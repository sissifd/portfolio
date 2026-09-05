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

1. **Hero** — Name, Rolle ("Berater & Architekt"), kurzer Pitch, Sprachumschalter, Kontakt-CTA
2. **Über mich** — Werdegang, Erfahrung, Skills/Kompetenzen
3. **Projekte** — 2–4 Projekt-Karten mit `[PLACEHOLDER]`-Inhalten, die der Nutzer später selbst befüllt
4. **Kontakt** — Links (E-Mail, LinkedIn, GitHub); kein Kontaktformular, da kein Backend vorgesehen ist und ein Formular-Service (z. B. Formspree) zusätzliche Abhängigkeit wäre

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
- Finales visuelles Design (folgt in Implementierungsphase)
- Registrar-seitige DNS-Umstellung (manueller Schritt durch Nutzer, da Zugangsdaten zu Drittanbietern nicht durch Claude eingegeben werden)
