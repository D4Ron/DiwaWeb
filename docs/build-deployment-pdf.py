"""
Builds docs/Diwa-Deploiement.pdf.

Typography and colour match docs/ImmoTg-Point-avancement.pdf, which is the
house style for client-facing notes. Values were read directly out of that
file rather than eyeballed: Helvetica throughout, 9.5pt body, 11.5pt navy
section headings, borderless tables with hairline row rules, a warm shaded
callout with a red left bar.

    python docs/build-deployment-pdf.py
"""

import os

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

# --- palette, straight from the reference -------------------------------
INK = colors.HexColor("#0e0f12")
MUTED = colors.HexColor("#6b6f78")
NAVY = colors.HexColor("#16385e")
GREEN = colors.HexColor("#1c6b45")
RED = colors.HexColor("#a8321e")
SHADE = colors.HexColor("#f4f2eb")
RULE = colors.HexColor("#d8d8d8")

MARGIN = 57  # pt, as measured
PAGE_W, PAGE_H = A4
CONTENT_W = PAGE_W - 2 * MARGIN

TITLE = "Diwa Industries — Déploiement"
SUBTITLE = "Site diwaindustries.tg · Note technique · 1er octobre 2026"

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "Diwa-Deploiement.pdf")

# --- styles -------------------------------------------------------------
S = {
    "h1": ParagraphStyle("h1", fontName="Helvetica-Bold", fontSize=19,
                         leading=23, textColor=INK, spaceAfter=3),
    "sub": ParagraphStyle("sub", fontName="Helvetica", fontSize=9.5,
                          leading=13, textColor=MUTED),
    "h2": ParagraphStyle("h2", fontName="Helvetica-Bold", fontSize=11.5,
                         leading=14, textColor=NAVY, spaceBefore=9,
                         spaceAfter=4),
    "h3": ParagraphStyle("h3", fontName="Helvetica-Bold", fontSize=9,
                         leading=12, textColor=INK, spaceBefore=8,
                         spaceAfter=3),
    "body": ParagraphStyle("body", fontName="Helvetica", fontSize=9.5,
                           leading=13, textColor=INK, alignment=TA_LEFT,
                           spaceAfter=5),
    "cell": ParagraphStyle("cell", fontName="Helvetica", fontSize=9,
                           leading=11.8, textColor=INK),
    "cellb": ParagraphStyle("cellb", fontName="Helvetica-Bold", fontSize=9,
                            leading=11.8, textColor=INK),
    "detail": ParagraphStyle("detail", fontName="Helvetica", fontSize=8.5,
                             leading=11.3, textColor=MUTED),
    "mono": ParagraphStyle("mono", fontName="Courier", fontSize=8.5,
                           leading=13, textColor=NAVY, spaceAfter=6),
    "callout": ParagraphStyle("callout", fontName="Helvetica", fontSize=9,
                              leading=13.5, textColor=INK),
}


def P(text, style="body"):
    return Paragraph(text, S[style])


def ok(text):
    return Paragraph(f'<font color="#1c6b45"><b>{text}</b></font>', S["cell"])


def todo(text):
    return Paragraph(f'<font color="#a8321e"><b>{text}</b></font>', S["cell"])


def table(rows, widths, header=True, shade_rows=()):
    """Borderless table: bold header with a rule under it, hairline rows."""
    style = [
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 4.5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4.5),
    ]
    if header:
        style += [
            ("LINEBELOW", (0, 0), (-1, 0), 0.9, INK),
            ("LINEBELOW", (0, 1), (-1, -2), 0.4, RULE),
        ]
    else:
        style += [("LINEBELOW", (0, 0), (-1, -2), 0.4, RULE)]

    for r in shade_rows:
        style.append(("BACKGROUND", (0, r), (-1, r), SHADE))
        style.append(("LEFTPADDING", (0, r), (-1, r), 6))

    t = Table(rows, colWidths=widths, hAlign="LEFT")
    t.setStyle(TableStyle(style))
    return t


def callout(paragraphs):
    """Shaded block with a red left bar, as in the reference."""
    inner = Table([[p] for p in paragraphs], colWidths=[CONTENT_W - 26],
                  hAlign="LEFT")
    inner.setStyle(TableStyle([
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
    ]))
    outer = Table([[inner]], colWidths=[CONTENT_W], hAlign="LEFT")
    outer.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), SHADE),
        ("LINEBEFORE", (0, 0), (0, -1), 2.4, RED),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    return outer


def chrome(canvas, doc):
    """Running header rule on page 1, footer with page number on all."""
    canvas.saveState()
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(MUTED)

    canvas.drawString(MARGIN, 30, f"{TITLE} · 1er octobre 2026")
    canvas.drawRightString(PAGE_W - MARGIN, 30, str(doc.page))
    canvas.setStrokeColor(RULE)
    canvas.setLineWidth(0.4)
    canvas.line(MARGIN, 42, PAGE_W - MARGIN, 42)
    canvas.restoreState()


# --- content ------------------------------------------------------------
story = []

story.append(P(TITLE, "h1"))
story.append(P(SUBTITLE, "sub"))
story.append(Spacer(1, 8))
story.append(Table([[""]], colWidths=[CONTENT_W], rowHeights=[0.9],
                   style=TableStyle([("BACKGROUND", (0, 0), (-1, -1), INK)]),
                   hAlign="LEFT"))
story.append(Spacer(1, 12))

story.append(P(
    "Remplacement du site WordPress / Divi par une application Next.js. "
    "Trois langues, le français à la racine. Le dépôt est "
    "<b>github.com/D4Ron/DiwaWeb</b> ; l'application est dans <b>web/</b>."))

# 1. Pile
story.append(P("1. Pile, prérequis et build", "h2"))
story.append(table([
    [P("Application", "cellb"), P("Next.js 16.3 · React 19 · Tailwind v4 · next-intl", "cell")],
    [P("Node", "cellb"), P("24.x — l'image Docker épingle <b>node:24-alpine</b>. Aucun champ <font face='Courier' size='8'>engines</font> déclaré.", "cell")],
    [P("Langues", "cellb"), P("fr à <font face='Courier' size='8'>/</font> (défaut) · en à <font face='Courier' size='8'>/en</font> · pt à <font face='Courier' size='8'>/pt</font> — slugs localisés", "cell")],
    [P("Conteneur", "cellb"), P("<font face='Courier' size='8'>output: standalone</font> conditionné à <font face='Courier' size='8'>DOCKER_BUILD=1</font>, donc sans effet sur Vercel", "cell")],
], [95, CONTENT_W - 95], header=False))

story.append(Spacer(1, 7))
story.append(P("<font face='Courier' size='8.5' color='#16385e'>git clone https://github.com/D4Ron/DiwaWeb.git &amp;&amp; cd DiwaWeb/web</font><br/>"
               "<font face='Courier' size='8.5' color='#16385e'>npm ci &amp;&amp; npm run build &amp;&amp; npm start</font>"))
story.append(P(
    "<b>npm ci</b>, pas <font face='Courier' size='8'>npm install</font> — voir §6. "
    "Le script <font face='Courier' size='8'>prebuild</font> régénère les miniatures floues via "
    "<b>sharp</b>, une devDependency : ne pas installer avec "
    "<font face='Courier' size='8'>--omit=dev</font> avant de builder."))

# 2. Configuration
story.append(P("2. Configuration", "h2"))
story.append(P(
    "Tout dans la plateforme d'hébergement, jamais dans le dépôt. Variables "
    "lues <b>au build</b> : toute modification impose un redéploiement. Le "
    "fournisseur de messagerie est choisi dans "
    "<font face='Courier' size='8'>web/src/lib/mailer.ts</font>."))
story.append(table([
    [P("Fournisseur", "cellb"), P("Activé si", "cellb"), P("Usage", "cellb")],
    [P("Microsoft Graph", "cellb"), P("AZURE_TENANT_ID + AZURE_CLIENT_ID", "detail"),
     P("Recommandé — l'organisation est sous Entra ID", "cell")],
    [P("Resend", "cell"), P("RESEND_API_KEY", "detail"),
     P("Uniquement hors du tenant", "cell")],
    [P("Console", "cell"), P("aucun", "detail"),
     P("Journalise, renvoie <font face='Courier' size='8'>delivered: false</font>", "cell")],
], [108, 150, CONTENT_W - 258], shade_rows=(1,)))
story.append(Spacer(1, 4))
story.append(P(
    "Sans identifiants, les formulaires acceptent les envois et signalent que "
    "rien n'est parti — voulu, pour les préproductions.", "detail"))
story.append(Spacer(1, 8))
story.append(table([
    [P("Variable", "cellb"), P("Requis", "cellb"), P("Détail", "cellb")],
    [P("AZURE_TENANT_ID", "cell"), P("Graph", "detail"), P("GUID du tenant", "detail")],
    [P("AZURE_CLIENT_ID", "cell"), P("Graph", "detail"), P("ID de l'inscription d'application", "detail")],
    [P("AZURE_CLIENT_SECRET", "cell"), P("repli", "detail"), P("Préférer la fédération — §3", "detail")],
    [P("GRAPH_SENDER", "cell"), P("Graph", "detail"), P("Boîte émettrice", "detail")],
    [P("RESEND_API_KEY", "cell"), P("Resend", "detail"), P("Commence par re_", "detail")],
    [P("CONTACT_FROM", "cell"), P("Resend", "detail"), P("Expéditeur sur domaine vérifié", "detail")],
    [P("CONTACT_TO", "cell"), P("non", "detail"), P("Défaut info@diwaindustries.tg", "detail")],
    [P("CAREERS_TO", "cell"), P("non", "detail"), P("Replie sur CONTACT_TO", "detail")],
], [148, 60, CONTENT_W - 208]))

# 4. Entra
story.append(P("3. Entra ID — Microsoft Graph", "h2"))
story.append(P(
    "À faire une fois, avec un administrateur du tenant. Le courrier part "
    "alors d'une boîte du tenant : pas de tiers, pas de domaine à faire "
    "vérifier."))
story.append(table([
    [P("1", "cellb"), P("Inscription d'application + permission <b>Mail.Send</b> de type <b>Application</b> (pas Déléguée) sur Graph, puis consentement administrateur.", "cell")],
    [P("2", "cellb"), P("<b>La restreindre à une seule boîte</b> — voir l'encadré.", "cell")],
    [P("3", "cellb"), P("Créditer, par ordre de préférence : <b>fédération d'identité</b> (sur Vercel, activer OIDC et déclarer un credential fédéré côté Entra — <font face='Courier' size='8'>VERCEL_OIDC_TOKEN</font> fourni à l'exécution, <b>aucun secret stocké</b>) ; <b>identité managée</b> sur Azure ; à défaut <font face='Courier' size='8'>AZURE_CLIENT_SECRET</font>, qui expire et qu'il faut détenir.", "cell")],
    [P("4", "cellb"), P("Renseigner <font face='Courier' size='8'>GRAPH_SENDER</font> avec la boîte émettrice.", "cell")],
], [18, CONTENT_W - 18], header=False))
story.append(Spacer(1, 8))
story.append(KeepTogether(callout([
    P("<b>Mail.Send en permission d'application porte sur tout le tenant.</b>", "callout"),
    Spacer(1, 5),
    P("Accordée sans restriction, l'application peut envoyer du courrier "
      "<b>au nom de n'importe quelle boîte de l'organisation</b>. La limiter "
      "à la seule boîte émettrice par une <b>Application Access Policy</b> "
      "Exchange Online (<font face='Courier' size='8'>New-ApplicationAccessPolicy</font>) "
      "ou par <b>RBAC for Applications</b>, qui la remplace.", "callout"),
    Spacer(1, 5),
    P("Une permission Entra non restreinte peut encore autoriser des envois "
      "hors périmètre RBAC Exchange : les deux doivent concorder. "
      "<b>Vérifier par un envoi test depuis une boîte interdite — il doit "
      "échouer.</b>", "callout"),
])))
story.append(Spacer(1, 8))
story.append(P(
    "<b>Pièces jointes — 3 Mo.</b> <font face='Courier' size='8'>sendMail</font> "
    "transporte les pièces en ligne et plafonne la requête à 4 Mo ; le base64 "
    "gonfle d'environ un tiers. <font face='Courier' size='8'>MAX_ATTACHMENT_BYTES</font> "
    "vaut donc 3 Mo et le formulaire affiche le même chiffre. Au-delà, il faut "
    "passer par une upload session."))

# 5. Déploiement
story.append(P("4. Déploiement", "h2"))
story.append(table([
    [P("Vercel", "cellb"),
     P("Préproduction : <b>diwatest.vercel.app</b>. <b>Root Directory = web</b>, "
       "détection Next.js acceptée telle quelle. "
       "<font face='Courier' size='8'>--prod</font> obligatoire : les "
       "préproductions sont derrière l'authentification Vercel. <b>Le plan Hobby "
       "est sous licence non commerciale</b> — inadapté pour un client.", "cell")],
    [P("Docker", "cellb"),
     P("<font face='Courier' size='8'>docker compose up web --build</font> — "
       "image ~328 Mo, utilisateur non root, healthcheck. Port occupé sous "
       "Windows (plages réservées Hyper-V) : "
       "<font face='Courier' size='8'>WEB_PORT=8099</font>.", "cell")],
], [60, CONTENT_W - 60], header=False))

# 6. Bascule
story.append(P("5. Bascule depuis WordPress", "h2"))
story.append(table([
    [P("1", "cellb"), P("Redirections : <font face='Courier' size='8'>next.config.ts</font> renvoie en 301 les trois anciennes URL d'articles racine vers <font face='Courier' size='8'>/actualites/&lt;slug&gt;</font>, plus <font face='Courier' size='8'>/en/contact-us</font>. Les slugs français des pages sont inchangés.", "cell")],
    [P("2", "cellb"), P("<font face='Courier' size='8'>hreflang</font> : racine en français, <font face='Courier' size='8'>x-default</font> pointant dessus — conforme au site actuel, préserve le référencement.", "cell")],
    [P("3", "cellb"), P("<b>Analytics non repris.</b> L'ancien site utilise GA <b>G-DDKBVSSDEQ</b> et GTM <b>GTM-N282LHXL</b>, absents du nouveau build. Décider avant la bascule.", "cell")],
    [P("4", "cellb"), P("DNS, puis <b>conserver WordPress intact</b> quelques semaines : c'est le retour arrière.", "cell")],
], [18, CONTENT_W - 18], header=False, shade_rows=(2,)))

# 7. Pièges
story.append(P("6. Pièges", "h2"))
story.append(table([
    [P("Lockfile", "cellb"),
     P("<font face='Courier' size='8'>npm install</font> sous Windows produit un lockfile amputé des dépendances optionnelles Linux (<font face='Courier' size='8'>@emnapi/*</font>) et <font face='Courier' size='8'>npm ci</font> échoue dans Docker. Le régénérer sous Linux :<br/>"
       "<font face='Courier' size='8' color='#16385e'>docker run --rm -v \"$PWD/web:/app\" -w /app node:24-alpine npm install --package-lock-only --ignore-scripts</font>", "cell")],
    [P("Révélations", "cellb"),
     P("Les apparitions au défilement sont conditionnées à la classe <font face='Courier' size='8'>html.js</font>, posée avant le premier rendu. Sans JavaScript les règles ne s'appliquent pas et tout s'affiche. <b>Ne pas « corriger » en repassant par une bibliothèque qui pose <font face='Courier' size='8'>opacity: 0</font> en ligne.</b>", "cell")],
    [P("Images", "cellb"),
     P("Les miniatures floues sont générées, pas écrites à la main. Toute image ajoutée dans <font face='Courier' size='8'>web/public/images/</font> impose <font face='Courier' size='8'>npm run blur</font> (ou un build).", "cell")],
], [60, CONTENT_W - 60], header=False))

# 8. Reste
story.append(P("7. Reste à faire", "h2"))
story.append(P(
    "<b><font color='#a8321e'>À confirmer</font></b> — la capacité annoncée : "
    "2 000 000 bouteilles/an, d'après la brochure 2026 et la présentation ; "
    "l'ancien site indiquait 500 000.<br/>"
    "<b><font color='#a8321e'>À décider</font></b> — analytics, §5.<br/>"
    "<b><font color='#a8321e'>À produire</font></b> — la vidéo d'accueil : le "
    "héros enchaîne pour l'instant quatre photos réelles de l'usine, point de "
    "bascule <font face='Courier' size='8'>HeroRotator</font>. Mineur : le "
    "visuel de rayonnement porte un lettrage français incrusté, visible tel "
    "quel sur /en et /pt."))

# --- build --------------------------------------------------------------
doc = BaseDocTemplate(
    OUT, pagesize=A4,
    leftMargin=MARGIN, rightMargin=MARGIN,
    topMargin=MARGIN - 1, bottomMargin=46,
    title="Diwa Industries — Déploiement",
    author="Kapi Consult",
    subject="Note technique de déploiement — diwaindustries.tg",
)
frame = Frame(MARGIN, 46, CONTENT_W, PAGE_H - MARGIN - 46 + 1, id="main",
              leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
doc.addPageTemplates([PageTemplate(id="all", frames=[frame], onPage=chrome)])
doc.build(story)

print(f"written: {OUT}")
print(f"size   : {os.path.getsize(OUT) // 1024} KB")
