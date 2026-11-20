# GreyCircuit Technologies — Corporate Website

Official production repository for the GreyCircuit Technologies corporate website and digital experience.

## Production Environment
- **Canonical Domain:** [https://greycircuit.tech](https://greycircuit.tech)
- **Apex / Mirror Domain:** [https://www.greycircuit.tech](https://www.greycircuit.tech)
- **Deployment Platform:** Cloudflare Pages

## Architecture & Technology Stack
- **Runtime:** Pure Static Web (HTML5, Modern CSS3, Vanilla ES6+ JavaScript).
- **Zero Build Step:** Native browser ES modules and semantic HTML. No npm build, bundler, or transpilation required.
- **Content Sanitization:** Embedded DOMPurify (`vendor/dompurify/purify.min.js`) for safe runtime sanitization.
- **Headless CMS Integration:** Asynchronous client-side PostgREST integration with Supabase PostgreSQL (`published_sections` view) with zero-FOUC graceful fallback to embedded semantic DOM content.
- **Design System:** Deep Black Obsidian enterprise identity with custom SVG iconography and AVIF high-efficiency visual assets.

## Directory Structure
```
├── assets/                  # Brand iconography, imagery, and watermarks
│   ├── images/              # High-efficiency AVIF service and telemetry cards
│   ├── logo_transparent.png # Corporate brand mark
│   ├── profile.avif         # Authoritative executive identity portrait
│   └── watermark.png        # Structural background grid watermark
├── projects/                # Client case studies and engineering portfolio
│   └── project.html
├── services/                # Corporate service offerings
│   ├── automation-service/  # Automation engineering deep dive
│   ├── cybersecurity-service/ # Zero-trust perimeter & cybersecurity deep dive
│   ├── swe-service/         # High-assurance software engineering deep dive
│   └── index.html           # Services catalog landing page
├── vendor/                  # Third-party runtime dependencies
│   └── dompurify/           # DOMPurify XSS sanitization library
├── config.js                # Active public Supabase configuration
├── config.example.js        # Configuration template
├── index.html               # Corporate landing page
├── robots.txt               # Search engine crawl directives
├── script.js                # Core telemetry, animation & CMS sync engine
├── sitemap.xml              # Search engine XML sitemap
├── styles.css               # Unified enterprise design system tokens & surfaces
└── whitepaper.html          # Enterprise zero-trust engineering whitepaper
```

## Configuration
Client-side Supabase configuration resides in `config.js`:
```javascript
window.__GCT_CONFIG__ = Object.freeze({
  supabaseUrl: 'https://<your-project-ref>.supabase.co',
  anonKey: 'sb_publishable_<your-public-anon-key>'
});
```
> **Security Policy:** This file must contain *only* public anonymous keys. Elevated service-role credentials must never be placed in this repository.

## Cloudflare Pages Deployment
- **Framework Preset:** None (Static HTML)
- **Build Command:** *(None / leave empty)*
- **Build Output Directory:** `/`
- **Root Directory:** `/`

## License
Proprietary & Confidential. All rights reserved © 2026 GreyCircuit Technologies Private Limited.
