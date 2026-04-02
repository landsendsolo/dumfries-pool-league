<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:output-rules -->
## OUTPUT RULES — MANDATORY
- NEVER use the Read tool when asked for file contents
- ALWAYS use bash cat and print the ENTIRE raw output in the chat
- NEVER summarise output — paste everything verbatim
- NEVER say "here it is" or "there it is" without printing the actual content
- Before making ANY fix, read the actual file first with bash cat
- Multiple files: cat file1 && echo "==FILE1==" && cat file2 && echo "==FILE2=="
<!-- END:output-rules -->
