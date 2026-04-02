import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import { readFileSync, writeFileSync, unlinkSync, existsSync, mkdirSync } from 'fs';
import { join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import Anthropic from '@anthropic-ai/sdk';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import { parse as csvParse } from 'csv-parse/sync';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// --- Data paths ---
const DATA_DIR = join(__dirname, 'data');
const UPLOADS_DIR = join(DATA_DIR, 'uploads');
const DOCUMENTS_JSON = join(DATA_DIR, 'documents.json');

// Ensure directories exist
if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
if (!existsSync(UPLOADS_DIR)) mkdirSync(UPLOADS_DIR, { recursive: true });
if (!existsSync(DOCUMENTS_JSON)) writeFileSync(DOCUMENTS_JSON, '[]');

// --- Anthropic client ---
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// --- Multer config ---
const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.xlsx', '.csv', '.jpg', '.jpeg', '.png'];
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (_req, file, cb) => {
    const unique = randomUUID();
    const ext = extname(file.originalname).toLowerCase();
    cb(null, `${unique}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    const ext = extname(file.originalname).toLowerCase();
    if (ALLOWED_EXTENSIONS.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${ext} not supported. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`));
    }
  },
});

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'change-me-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      // expires when browser closes (no maxAge)
    },
  })
);

// Serve static files
app.use(express.static(join(__dirname, 'public')));

// Auth middleware
function requireAuth(req, res, next) {
  if (req.session && req.session.authenticated) return next();
  res.status(401).json({ error: 'Not authenticated' });
}

// --- Helper: read/write documents ---
function readDocuments() {
  try {
    return JSON.parse(readFileSync(DOCUMENTS_JSON, 'utf-8'));
  } catch {
    return [];
  }
}

function writeDocuments(docs) {
  writeFileSync(DOCUMENTS_JSON, JSON.stringify(docs, null, 2));
}

// --- Text extraction ---
async function extractText(filePath, originalName) {
  const ext = extname(originalName).toLowerCase();

  switch (ext) {
    case '.pdf':
      return extractPdf(filePath);
    case '.docx':
      return extractDocx(filePath);
    case '.xlsx':
      return extractXlsx(filePath);
    case '.csv':
      return extractCsv(filePath);
    case '.jpg':
    case '.jpeg':
    case '.png':
      return extractImage(filePath, ext);
    default:
      return '[Unsupported file type]';
  }
}

async function extractPdf(filePath) {
  const buffer = readFileSync(filePath);
  const data = await pdfParse(buffer);
  return data.text || '[No text extracted from PDF]';
}

async function extractDocx(filePath) {
  const buffer = readFileSync(filePath);
  const result = await mammoth.extractRawText({ buffer });
  return result.value || '[No text extracted from DOCX]';
}

function extractXlsx(filePath) {
  const workbook = XLSX.readFile(filePath);
  const lines = [];
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const csv = XLSX.utils.sheet_to_csv(sheet);
    if (csv.trim()) {
      lines.push(`--- Sheet: ${sheetName} ---`);
      lines.push(csv);
    }
  }
  return lines.join('\n') || '[No data extracted from XLSX]';
}

function extractCsv(filePath) {
  const raw = readFileSync(filePath, 'utf-8');
  // Validate it parses
  csvParse(raw, { relax_column_count: true });
  return raw || '[No data extracted from CSV]';
}

async function extractImage(filePath, ext) {
  const buffer = readFileSync(filePath);
  const base64 = buffer.toString('base64');
  const mediaType =
    ext === '.png' ? 'image/png' : 'image/jpeg';

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mediaType, data: base64 },
          },
          {
            type: 'text',
            text: 'Extract ALL text and content from this image. Include any handwritten text, printed text, table data, scores, names, dates, and any other readable content. Be thorough — capture everything visible.',
          },
        ],
      },
    ],
  });

  return response.content[0]?.text || '[No text extracted from image]';
}

// --- Routes ---

// Login page
app.get('/', (req, res) => {
  if (req.session && req.session.authenticated) {
    return res.redirect('/app.html');
  }
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

// Login API
app.post('/api/login', async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'Password required' });

  const hash = process.env.COMMITTEE_PASSWORD;
  if (!hash) return res.status(500).json({ error: 'Server not configured — no password hash set' });

  const match = await bcrypt.compare(password, hash);
  if (!match) return res.status(401).json({ error: 'Wrong password' });

  req.session.authenticated = true;
  res.json({ ok: true });
});

// Logout
app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

// Upload document
app.post('/api/documents', requireAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const { originalname, filename, size } = req.file;

    // Extract text
    const filePath = join(UPLOADS_DIR, filename);
    const extractedText = await extractText(filePath, originalname);

    // Save metadata
    const docs = readDocuments();
    const doc = {
      id: randomUUID(),
      originalName: originalname,
      storedName: filename,
      size,
      uploadedAt: new Date().toISOString(),
      extractedText,
    };
    docs.push(doc);
    writeDocuments(docs);

    res.json({ ok: true, document: { id: doc.id, originalName: doc.originalName, size: doc.size, uploadedAt: doc.uploadedAt } });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message || 'Upload failed' });
  }
});

// List documents
app.get('/api/documents', requireAuth, (_req, res) => {
  const docs = readDocuments();
  const list = docs.map(({ id, originalName, size, uploadedAt }) => ({
    id,
    originalName,
    size,
    uploadedAt,
  }));
  res.json(list);
});

// Delete document
app.delete('/api/documents/:id', requireAuth, (req, res) => {
  const docs = readDocuments();
  const idx = docs.findIndex((d) => d.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Document not found' });

  const [removed] = docs.splice(idx, 1);

  // Delete file from disk
  const filePath = join(UPLOADS_DIR, removed.storedName);
  try {
    if (existsSync(filePath)) unlinkSync(filePath);
  } catch {
    // file already gone — fine
  }

  writeDocuments(docs);
  res.json({ ok: true });
});

// Query knowledge base
app.post('/api/query', requireAuth, async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: 'Question required' });

  const docs = readDocuments();
  if (docs.length === 0) {
    return res.json({
      answer: 'No documents have been uploaded yet. Upload some documents first, then ask your question.',
      sources: [],
    });
  }

  // Build context from all documents
  const context = docs
    .map((doc, i) => `[Document ${i + 1}: "${doc.originalName}" — uploaded ${doc.uploadedAt}]\n${doc.extractedText}`)
    .join('\n\n---\n\n');

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: `You are the Dumfries Pool League Committee Knowledge Base assistant. You have access to the committee's uploaded documents. Answer questions based ONLY on the document contents provided. Always cite which document(s) you used by name. If the answer isn't in the documents, say so clearly. Be concise and direct.`,
      messages: [
        {
          role: 'user',
          content: `Here are the committee's documents:\n\n${context}\n\n---\n\nQuestion: ${question}`,
        },
      ],
    });

    const answer = response.content[0]?.text || 'No response from AI';

    // Extract which documents were referenced
    const sources = docs
      .filter((doc) => answer.includes(doc.originalName))
      .map((doc) => doc.originalName);

    res.json({ answer, sources });
  } catch (err) {
    console.error('Query error:', err);
    res.status(500).json({ error: 'Failed to query knowledge base: ' + err.message });
  }
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`DPL Knowledge Base running on port ${PORT}`);
});
