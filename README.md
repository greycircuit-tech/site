Absolutely. Here are the two files separately, ready to paste into GitHub.
# Grey Circuit Technologies

Official website repository of **GREYCIRCUIT TECHNOLOGIES PRIVATE LIMITED (GCT)**.

**Website:** https://greycircuit.tech  
**Email:** contact@greycircuit.tech

Grey Circuit Technologies is an engineering-led technology company focused on three core capabilities:

- **Cybersecurity**
- **Automation**
- **Software Engineering**

GCT works with businesses to secure systems, automate operational processes, and engineer software around real-world technical and business requirements.

---

## About Grey Circuit Technologies

Grey Circuit Technologies brings cybersecurity, automation, and software engineering together under one engineering-led practice.

The focus is simple:

> **Secure what you have. Automate what is repetitive. Build what you need.**

GCT approaches technology problems from an engineering perspective, focusing on practical implementation rather than unnecessary complexity.

---

## Core Capabilities

### Cybersecurity

Security engineering and offensive security services designed to identify meaningful risk and strengthen systems.

Capabilities include:

- Vulnerability Assessment & Penetration Testing
- Web Application Security
- API Security
- Cloud Security
- Security Engineering
- Security Architecture
- AI Security
- LLM & Agentic System Security
- Security Automation
- Security Testing & Assessment

---

### Automation

Engineering automation around business, operational, security, and production processes.

Capabilities include:

- Production Process Automation
- Workflow Automation
- Business Process Automation
- Security Automation
- Operational Automation
- System Integration
- Process Orchestration
- Automated Reporting
- Production Monitoring
- AI-assisted Automation
- Intelligent Workflow Systems

---

### Software Engineering

Engineering practical software systems around specific technical and business requirements.

Capabilities include:

- Custom Software Development
- Web Applications
- APIs & Backend Systems
- Internal Tools
- Dashboards
- Business Applications
- AI-enabled Applications
- Automation Platforms
- System Integrations
- MVP & Prototype Development
- Software Modernization

GCT uses AI-assisted development where it provides meaningful engineering value while maintaining conventional software engineering practices.

---

## Production Process Automation

Production Process Automation is a key offering within GCT's Automation practice.

The service focuses on engineering production workflows into connected, measurable, and automated systems.

Potential areas include:

- Production workflow automation
- Production data collection
- System integration
- Operational dashboards
- Automated reporting
- Production monitoring
- Alerts and exception handling
- Workflow orchestration
- AI-assisted operational analysis
- Secure production integrations
- Human-in-the-loop decision support

The approach is not to replace existing infrastructure unnecessarily.

GCT focuses on understanding the existing production process, identifying repetitive or inefficient work, connecting relevant systems, and engineering automation around the actual operating environment.

---

## Technology

The website is intentionally lightweight and primarily built using:

- HTML
- CSS
- JavaScript
- AVIF image assets
- Client-side interaction and animation

The project avoids unnecessary frontend complexity while maintaining a highly interactive interface.

---

## Project Structure

```text
greycircuit.tech/
│
├── assets/
│   ├── card_bg_picture/
│   └── images/
│       └── services/
│           ├── automation/
│           │   └── production-process-automation/
│           ├── cybersecurity/
│           └── swe/
│
├── services/
│   ├── automation-service/
│   │   ├── automation-subservices/
│   │   └── automation.html
│   │
│   ├── cybersecurity-service/
│   │   ├── cybersecurity-subservices/
│   │   └── cybersecurity.html
│   │
│   ├── swe-service/
│   │   ├── swe-subservices/
│   │   └── software-engineering.html
│   │
│   └── index.html
│
├── index.html
├── script.js
├── styles.css
├── whitepaper.html
├── README.md
└── LICENSE
```

---

## Service Architecture

The website is organized around three primary service pillars:

```text
Cybersecurity
    │
    ├── Application & API Security
    ├── VAPT
    ├── Cloud Security
    ├── Security Engineering
    ├── AI / LLM Security
    └── Security Automation

Automation
    │
    ├── Production Process Automation
    ├── Workflow Automation
    ├── System Integration
    ├── Operational Automation
    └── Intelligent Automation

Software Engineering
    │
    ├── Applications
    ├── APIs
    ├── Internal Systems
    ├── Dashboards
    └── AI-enabled Software
```

The three capabilities can also intersect.

For example:

```text
Cybersecurity
      +
Automation
      +
Software Engineering
      ↓
Secure automated business and production systems
```

---

## Design System

The website follows a restrained technical aesthetic built around:

- Dark visual system
- Technical typography
- Minimal interface elements
- Strong visual hierarchy
- Interactive service cards
- Custom cursor interaction
- Image hover interactions
- Subtle motion
- Responsive layouts
- Lightweight visual assets

The visual language is shared throughout the website rather than being independently redesigned for individual service pages.

---

## Performance

Interactive elements are implemented with performance in mind.

The website's hover and cursor systems are designed to avoid unnecessary resource consumption through techniques such as:

- Reusing image resources
- Avoiding repeated image creation
- Controlled pointer event handling
- `requestAnimationFrame` where appropriate
- Transform-based movement
- Avoiding unnecessary layout recalculation
- Reusing DOM elements
- Preventing duplicate event listeners
- Preventing animation-loop accumulation
- Optimized image assets

The goal is to preserve the interactive experience while minimizing unnecessary CPU, memory, and rendering overhead.

---

## Local Development

This repository is a static website and can be run using a simple local development server.

For example, with VS Code Live Server:

```text
Open index.html
        ↓
Start Live Server
        ↓
Open the local development URL
```

No backend service is required for the core website.

---

## Navigation Structure

The primary service pages are:

```text
/services/cybersecurity-service/cybersecurity.html

/services/automation-service/automation.html

/services/swe-service/software-engineering.html
```

Service-specific pages are organized underneath their respective service directories.

When adding or moving pages, ensure that:

- Navigation paths remain valid
- Asset paths resolve correctly
- Shared CSS loads correctly
- Shared JavaScript loads correctly
- The global cursor remains available
- Service-card interactions remain consistent
- Nested pages do not introduce broken relative paths

---

## Service Card Assets

The primary service cards use:

```text
cybersec-card.avif
automation-card.avif
swe-card.avif
```

Service-specific imagery is organized under:

```text
assets/images/services/
```

The website uses the same service-card interaction system throughout the relevant pages.

---

## SEO

Website pages use page-specific metadata where applicable.

New pages should maintain:

- Descriptive page titles
- Unique meta descriptions
- Appropriate heading hierarchy
- Canonical URLs where applicable
- Meaningful image alt text
- Relevant internal links
- Open Graph metadata where applicable

Avoid keyword stuffing or artificially repetitive content.

---

## Intellectual Property

This repository contains proprietary material belonging to:

**GREYCIRCUIT TECHNOLOGIES PRIVATE LIMITED**

This includes, where applicable:

- Source code
- Website design
- UI/UX implementation
- Written content
- Graphics
- Images
- Animations
- Interaction systems
- Branding
- Logos
- Original documentation
- Other original materials contained in this repository

The repository may be publicly viewable on GitHub, but it is **not an open-source project**.

See [`LICENSE`](./LICENSE) for the applicable terms.

---

## Third-Party Materials

Any third-party libraries, fonts, icons, frameworks, services, or other materials included in the repository remain subject to their respective licenses.

Nothing in the GCT proprietary license transfers ownership of third-party materials.

Where required, applicable third-party license notices should remain with the relevant material.

---

## Contact

**GREYCIRCUIT TECHNOLOGIES PRIVATE LIMITED**

Website: https://greycircuit.tech

Email: contact@greycircuit.tech

---

## Copyright

Copyright © 2026  
**GREYCIRCUIT TECHNOLOGIES PRIVATE LIMITED**

All rights reserved.
```
