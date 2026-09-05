# Portfolio-Website — Design

## Zweck

Neuaufbau der Portfolio-Website für Christian Sislak, aktuell unter `christiansislak.de` gehostet. Die bestehende Seite wird nicht migriert, sondern von Grund auf neu gebaut und auf ein einfacheres Hosting-Modell (GitHub + Vercel) umgestellt.

Positionierung: Berater/Architekt mit technischem Hintergrund. Die Seite zeigt berufliches Profil und Projekte gleichwertig.

## Zielgruppe & Sprache

Deutsch- und englischsprachiges Publikum. Sprachumschalter (DE/EN) über Astro i18n-Routing (`/` für Deutsch, `/en/` für Englisch).

## Tech-Stack

- **Framework:** Astro (statischer Build)
- **Hosting:** Vercel, verbunden mit einem GitHub-Repository
- **Deployment:** Automatisch bei jedem Push auf den Main-Branch; Preview-Deployments für Branches/PRs
- **Domain:** `christiansislak.de` wird per DNS (CNAME/A-Record) auf Vercel umgezogen
- **Kein Backend/CMS:** Inhalte liegen als strukturierte Daten getrennt vom Markup (z. B. Astro Content Collections oder `content/de.json` / `content/en.json`), damit DE/EN sauber trennbar sind und spätere Textänderungen ohne Layout-Eingriff möglich sind

## Seitenstruktur

Single-Page mit vier Sektionen:

1. **Hero** — Name, Rolle ("Cloud Solution Architect" / "Berater & Architekt"), kurzer Pitch, Sprachumschalter, Kontakt-CTA
2. **Über mich** — vollständige Werdegang-Timeline, Ausbildung, Zertifizierungen (siehe unten)
3. **Projekte** — 2–4 Projekt-Karten mit `[PLACEHOLDER]`-Inhalten, die der Nutzer später selbst befüllt
4. **Kontakt** — Links (E-Mail, LinkedIn, GitHub); kein Kontaktformular, da kein Backend vorgesehen ist und ein Formular-Service (z. B. Formspree) zusätzliche Abhängigkeit wäre

### Über mich — Inhalte (aus LinkedIn-Profil)

**Werdegang (chronologische Timeline, neueste zuerst):**

| Rolle | Unternehmen | Zeitraum | Ort |
|---|---|---|---|
| Cloud Solution Architect | SAP | Juli 2024–Heute | Eschborn (Hybrid) |
| Projektleiter S/4HANA | DB Systel GmbH | Apr. 2020–Juli 2024 | Frankfurt |
| Product Owner Team SAP Business Technology Platform | DB Systel GmbH | März 2020–Juli 2024 | Frankfurt |
| Product Owner Einheit SAP Mobile | DB Systel GmbH | Jan. 2018–März 2020 | Frankfurt/Rhein-Main (Hybrid) |
| SAP Consultant | DB Systel GmbH | Jan. 2016–Jan. 2018 | Frankfurt/Rhein-Main (Hybrid) |
| Senior Consultant / Consultant | Sopra Steria | März 2013–Dez. 2015 | Frankfurt/Rhein-Main |
| Business Process Consultant | Goodyear Dunlop Tires Germany GmbH | Dez. 2010–Feb. 2013 | Fulda |

**Ausbildung:**
Bachelor's Degree, Computer Software and Media Applications — Fachhochschule Wiesbaden, 2006–2010

**Zertifizierungen (aktuell gültig, Auswahl):**
- SAP Certified Associate – SAP Generative AI Developer (gültig bis Juni 2026)
- SAP Certified Professional – Solution Architect, SAP BTP (gültig bis Aug. 2026)

Rollenbeschreibungen (Aufgaben/Verantwortlichkeiten je Station) liegen im LinkedIn-Profil vor, wurden aber noch nicht in Kurzform für die Website übernommen — das erfolgt in der Implementierungsphase, ggf. verdichtet auf 1–2 Sätze pro Station.

## Design-Umsetzung

Visuelles Design (Farbschema, Typografie, Layout-Details) wird nicht in dieser Spec festgelegt, sondern in der Implementierungsphase über den `design-taste-frontend`-Skill erarbeitet, um generische AI-Optik zu vermeiden.

## Qualitätsanforderung: Web Interface Guidelines

Vor Live-Schaltung wird die Umsetzung gegen die `web-design-guidelines`-Checkliste geprüft:

- Accessibility: Kontraste, sichtbare Fokuszustände, semantisches HTML, Tastaturbedienbarkeit
- Responsives Verhalten auf Mobile/Tablet/Desktop
- Allgemeine UX-Best-Practices (Ladezeiten, klare Navigation, verständliche CTAs)

Dieser Review erfolgt als eigener Schritt nach der Implementierung, bevor DNS/Domain umgestellt wird.

## Out of Scope

- Migration von Inhalten der alten Seite (bewusster Neubau statt Migration)
- Kontaktformular mit Backend-Verarbeitung
- CMS oder Admin-Oberfläche für Inhalte
- Mehr als 4 Projekt-Platzhalter in der ersten Version

## Offene Punkte für spätere Iteration

- Konkrete Projektinhalte (Nutzer befüllt `[PLACEHOLDER]`-Texte selbst)
- Kurzbeschreibungen (1–2 Sätze) je Werdegang-Station, verdichtet aus dem LinkedIn-Profil
- Finales visuelles Design (folgt in Implementierungsphase)
- Registrar-seitige DNS-Umstellung (manueller Schritt durch Nutzer, da Zugangsdaten zu Drittanbietern nicht durch Claude eingegeben werden)
