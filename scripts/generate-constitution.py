from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.platypus import Table, TableStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY

OUTPUT = "../public/constitution.pdf"

NAVY   = colors.HexColor("#0f1a2e")
GOLD   = colors.HexColor("#c9a84c")
GRAY   = colors.HexColor("#374151")
LGRAY  = colors.HexColor("#6b7280")

def build():
    doc = SimpleDocTemplate(
        OUTPUT,
        pagesize=A4,
        leftMargin=2.5*cm,
        rightMargin=2.5*cm,
        topMargin=3*cm,
        bottomMargin=2.5*cm,
        title="Dumfries Pool League Constitution",
        author="Dumfries Pool League",
    )

    styles = getSampleStyleSheet()

    heading1 = ParagraphStyle(
        "Heading1",
        fontName="Helvetica-Bold",
        fontSize=13,
        textColor=NAVY,
        spaceBefore=16,
        spaceAfter=4,
        leading=16,
    )
    heading2 = ParagraphStyle(
        "Heading2",
        fontName="Helvetica-Bold",
        fontSize=10,
        textColor=NAVY,
        spaceBefore=10,
        spaceAfter=2,
        leading=14,
    )
    body = ParagraphStyle(
        "Body",
        fontName="Helvetica",
        fontSize=10,
        textColor=GRAY,
        spaceBefore=3,
        spaceAfter=3,
        leading=14,
        alignment=TA_JUSTIFY,
    )
    bullet = ParagraphStyle(
        "Bullet",
        fontName="Helvetica",
        fontSize=10,
        textColor=GRAY,
        spaceBefore=2,
        spaceAfter=2,
        leading=14,
        leftIndent=18,
        bulletIndent=6,
    )

    story = []

    # ── Header block ──────────────────────────────────────────────────────
    header_data = [[
        Paragraph(
            '<font color="#c9a84c" size="18"><b>Dumfries Pool League</b></font><br/>'
            '<font color="#ffffff" size="11">Constitution</font>',
            ParagraphStyle("hdr", fontName="Helvetica-Bold", alignment=TA_CENTER,
                           textColor=colors.white, leading=24)
        )
    ]]
    header_table = Table(header_data, colWidths=[doc.width])
    header_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), NAVY),
        ("TOPPADDING",    (0, 0), (-1, -1), 16),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 16),
        ("LEFTPADDING",   (0, 0), (-1, -1), 20),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 20),
        ("ROUNDEDCORNERS", [4, 4, 4, 4]),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 0.4*cm))
    story.append(HRFlowable(width="100%", thickness=1, color=GOLD, spaceAfter=6))

    # ── Constitution sections ─────────────────────────────────────────────
    sections = [
        {
            "title": "1. Name",
            "content": [
                ("p", 'The league shall be known as the Dumfries Pool League ("the League").'),
            ]
        },
        {
            "title": "2. Objectives",
            "content": [
                ("p", "The objectives of the League are:"),
                ("b", "To promote and encourage the playing of Blackball Pool in accordance with official rules."),
                ("b", "To provide a structured, fair, and competitive league format."),
                ("b", "To foster sportsmanship, respect, and camaraderie among all players and teams."),
            ]
        },
        {
            "title": "3. Membership",
            "content": [
                ("p", "3.1  Membership is open to teams and individuals who agree to abide by this Constitution and the Rules of the League."),
                ("p", "3.2  Each team must register a minimum of 6 players."),
                ("p", "3.3  Players may only be registered with one team per season, unless approved by the Committee under transfer regulations."),
                ("p", "3.4  Membership fees shall be set annually by the Committee."),
            ]
        },
        {
            "title": "4. Governance",
            "content": [
                ("p", "4.1  The League shall be administered by an elected Committee comprising at least:"),
                ("b", "Chairperson"),
                ("b", "Vice Chairperson"),
                ("b", "Treasurer"),
                ("b", "Secretary"),
                ("p", "4.2  The Committee shall be responsible for:"),
                ("b", "Organising fixtures and competitions."),
                ("b", "Maintaining league records, results, and tables."),
                ("b", "Handling disputes, protests, and disciplinary matters."),
                ("b", "Managing League funds."),
                ("p", "4.3  Committee members shall be elected annually at the Annual General Meeting (AGM)."),
            ]
        },
        {
            "title": "5. General Meetings",
            "content": [
                ("p", "5.1  An Annual General Meeting (AGM) shall be held before the start of each new season."),
                ("p", "5.2  Notice of the AGM shall be given to all registered teams at least 21 days in advance."),
                ("p", "5.3  Each registered team shall have one vote. Each committee member shall have one vote. Note a committee member cannot cast a vote on behalf of their own team and as a committee member."),
                ("p", "5.4  A simple majority shall decide all motions. If a vote is a tie the Chairperson's vote is the decisive one."),
            ]
        },
        {
            "title": "6. Competition Format",
            "content": [
                ("p", "6.1  Matches shall be played in accordance with Blackball Rules."),
                ("p", "6.2  The format of fixtures (e.g. number of frames, singles/doubles structure) shall be determined by the Committee prior to each season."),
                ("h", "6.3  2025/26 Season Format"),
                ("b", "6 Singles – 2 Doubles – 6 Singles"),
                ("b", "Players can play a maximum of once in each set (example: play in the first set of singles, play in doubles and again play singles in the last set)."),
                ("b", "No player can play more than 3 frames in a fixture."),
                ("b", "Teams must play with at least 3 registered players."),
                ("p", "6.4  Points shall be awarded as follows:"),
                ("b", "Win: 2"),
                ("b", "Draw: 1"),
                ("b", "Loss: 0"),
                ("p", "6.5  League position shall be determined by points, then frame difference, then head-to-head record."),
            ]
        },
        {
            "title": "7. Rules of Play",
            "content": [
                ("p", "7.1  All matches shall be played under Blackball Rules as recognised by the League."),
                ("p", "7.2  Home venues must provide a suitable match table and equipment in good condition."),
                ("p", "7.3  Matches must start at the scheduled time unless otherwise agreed by both captains."),
                ("p", "7.4  Match Postponements – Committee must be notified of all match postponements and the reason why and when it shall be re-played. Any postponements must be played before the last round of fixtures."),
            ]
        },
        {
            "title": "8. Player Conduct",
            "content": [
                ("p", "8.1  All players and teams are expected to conduct themselves in a sporting and respectful manner."),
                ("p", "8.2  Abuse of officials, unsporting behaviour, or deliberate damage to equipment/venues will not be tolerated."),
                ("p", "8.3  The Committee has authority to impose warnings, suspensions, or expulsions for misconduct."),
            ]
        },
        {
            "title": "9. Counties Selection",
            "content": [
                ("p", "9.1  County captains shall be voted in at the AGM, captains are in place for 1 season ie 15's then the 11's."),
                ("p", "9.2  Players need to be an active member in the league to be deemed eligible for selection. Criteria set to be active is as follows – play in at least 25% of league fixtures or in a combination of league competitions team comp, doubles and singles as well as entering SPA affiliated competitions via the area league rep."),
                ("p", "9.3  County Captains need to firstly submit their proposed team to the committee to make sure all players selected are deemed as an active member of the league."),
            ]
        },
        {
            "title": "10. Protests & Disputes",
            "content": [
                ("p", "10.1  Protests must be lodged in writing to the Secretary within 48 hours of the incident."),
                ("p", "10.2  The Committee shall review and rule on all protests."),
                ("p", "10.3  The Committee's decision shall be final, subject to appeal at the AGM."),
            ]
        },
        {
            "title": "11. Finance",
            "content": [
                ("p", "11.1  All League funds shall be held in a dedicated bank account in the name of the League."),
                ("p", "11.2  The Treasurer shall present a financial statement at the AGM."),
                ("p", "11.3  No member may financially benefit from the League except for reimbursement of authorised expenses."),
            ]
        },
        {
            "title": "12. Dissolution",
            "content": [
                ("p", "12.1  If the League is dissolved, any assets remaining shall be donated to a local youth or community sports initiative, as decided by the Committee."),
            ]
        },
        {
            "title": "13. Amendments",
            "content": [
                ("p", "13.1  This Constitution may only be amended at an AGM or Extraordinary General Meeting (EGM)."),
                ("p", "13.2  Amendments require a majority vote."),
            ]
        },
    ]

    for section in sections:
        story.append(Paragraph(section["title"], heading1))
        story.append(HRFlowable(width="100%", thickness=0.5, color=GOLD, spaceAfter=4))
        for kind, text in section["content"]:
            if kind == "p":
                story.append(Paragraph(text, body))
            elif kind == "b":
                story.append(Paragraph(f"\u2022\u2002{text}", bullet))
            elif kind == "h":
                story.append(Paragraph(text, heading2))

    # ── Footer function ────────────────────────────────────────────────────
    def add_footer(canvas, doc):
        canvas.saveState()
        canvas.setFont("Helvetica", 8)
        canvas.setFillColor(LGRAY)
        footer_text = "Dumfries Pool League \u2014 dumfriespoolleague.co.uk"
        canvas.drawString(doc.leftMargin, 1.5*cm, footer_text)
        canvas.drawRightString(
            doc.pagesize[0] - doc.rightMargin,
            1.5*cm,
            f"Page {doc.page}"
        )
        canvas.setStrokeColor(GOLD)
        canvas.setLineWidth(0.5)
        canvas.line(doc.leftMargin, 1.8*cm, doc.pagesize[0] - doc.rightMargin, 1.8*cm)
        canvas.restoreState()

    doc.build(story, onFirstPage=add_footer, onLaterPages=add_footer)
    print(f"Generated: {OUTPUT}")

if __name__ == "__main__":
    build()
