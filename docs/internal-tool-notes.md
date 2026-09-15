# Internal material — NOT for the public website

Extracted from `info_doc/Présentation Diwa-Industries-SA.pptx` while pulling
content for the website. None of this is published; it is set aside for the
internal tool project.

`info_doc/` itself is gitignored. This file is a summary, not the source.

## Operating KPIs (slide 11)

The deck's target bands for "principaux indicateurs de performance":

| Indicator | Target |
| --- | --- |
| Raw materials / revenue | 45–55 % |
| Scrap rate | < 2 % |
| EBITDA / revenue | 15–25 % |
| Energy (electricity, gas, fuel) / revenue | 3–8 % |
| OEE (TRS) | > 85 % |
| Net result / revenue | 5–12 % |
| Payroll | 12–18 % |
| Accident rate | 0 % |
| Overheads & admin | 5–10 % |

These read as the dashboard spec for the internal tool almost line for line:
nine indicators, each with a target band, several of them ratios against
revenue. Worth confirming that is the intent before designing around it.

## Headcount (slide 12)

Total **124**, split:

- Plant: 109
- Administration: 12
- Maintenance: 3

By employer — and this is the part that matters for any staff-facing tool:

| Employer | People |
| --- | --- |
| Diwa payroll | 48 |
| Phenix | 24 |
| Elite Intérim — plant | 49 |
| Elite Intérim — admin | 3 |

**Over half the workforce is not on Diwa's own payroll.** Any internal tool
with accounts, shifts or access control has to model three employers, not
one, and agency staff turn over faster than direct hires.

## Org chart (slide 14 image)

The deck carries a full org chart as an image — departments, reporting lines
and named roles down to team-leader level. Not reproduced here, but it is in
the source file and is the obvious starting point for a permissions model.

## Strategic projects (slide 13)

- Cost control and export portfolio development
- Revenue and profitability optimisation
- Commissioning a **new production line**
- Installing a **powder coating system**

Both capital projects change what the plant does, so a tool built around
current line capacity should not hard-code it.

## Why this is not on the website

Financial ratios, agency-staffing splits and internal reporting lines are
competitive and personnel information. The brochure is the client's public
document; the deck is plainly an internal or investor one. Only material that
also appears in the brochure, or that Diwa already publishes, was used on the
site.
