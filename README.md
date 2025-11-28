## Overview

This is the RADAR Self-Enrolment UI, a [Next.js](https://nextjs.org/) application that lets participants:

- Discover a study via a landing page.
- Create and manage their account (via Ory Kratos / Hydra).
- Enrol into a study defined in GitHub or local JSON files.
- Complete tasks and connect devices (SEP, pRMT, aRMT, Apple Health).

Study definitions are loaded from:

- **GitHub**: default (remote JSON definitions repo), and/or
- **Local**: `public/study/{studyId}` (e.g. `public/study/default`).

If no remote/local definition exists for a project created in Management Portal, the app falls back to a **default study** (by default `public/study/default`) but keeps the requested `studyId` for routing and API calls.

## Prerequisites

To run this UI end-to-end you need:

- **Node.js** (v18+ recommended).
- **Ory Kratos** (identity) – running and reachable.
- **Ory Hydra** (OAuth2 / consent) – running and reachable.
- **Management Portal** (optional but recommended) – to create projects and have project metadata available.
- A **GitHub repository** containing study definitions (optional if you only use local `public/study/*`).

> Without Kratos and Hydra running and correctly configured, login/enrolment and token-based flows will fail with `fetch failed` / `ENOTFOUND` errors.

## Environment variables

You can set these in `.env.local` (for local dev) or your deployment environment.

### Core / Next.js

- `BASEPATH` (optional): Base path the app is served under (e.g. `/study`).  
  Used to set `NEXT_PUBLIC_BASEPATH` at build time.

### Ory Kratos (identity)

- `KRATOS_INTERNAL_URL` (required)  
  Internal URL used by the server for Kratos REST calls, e.g.:
  - `http://localhost:4433` (local)
  - `http://kratos:4433` (Docker / k8s, matching your service name)

### Ory Hydra (OAuth2 / consent)

- `HYDRA_ADMIN_URL` (required for consent/logout flows), e.g.:

```bash
HYDRA_ADMIN_URL=http://localhost:4445
NEXT_PUBLIC_HYDRA_PUBLIC_URL=http://localhost:4444
```

### Study definitions & Management Portal

Defined in `app/_lib/github/config/github-config.ts` and `app/_lib/study/config.ts`:

- `GITHUB_REPO_NAME` (optional, default `radar-self-enrolment-definitions`)  
  GitHub repository name holding the definitions.
- `GITHUB_REPO_BRANCH_NAME` (optional, default `main`)  
  Branch to read definitions from.
- `GITHUB_AUTH_TOKEN` (optional)  
  Used for authenticated GitHub API access if needed.
- `STUDY_DEFINITION_REPOSITORY` (optional, default `GITHUB`)  
  - `"GITHUB"` – load study protocol/pages from GitHub, with local/default fallback.  
  - `"LOCAL"` – prefer local `public/study/{studyId}` protocol/pages, with default fallback.
- `DEFAULT_STUDY_ID` (optional, default `default`)  
  - The id of the local fallback study under `public/study/{DEFAULT_STUDY_ID}`.  
  - This study’s `protocol.json` and `landingpage.json` are used when a project exists in Management Portal but has no remote/local definitions yet.  
  - The UI content comes from this default study, but the **runtime protocol’s `studyId` and `name` are set to the requested id**.
- `MP_CONFIG_BASE_URL` (optional, default `http://localhost:8080/managementportal`)  
  Base URL for Management Portal API.
- `MP_PROJECTS_ENDPOINT` (optional, default `api/public/projects`)  
  Endpoint used to fetch the list of projects.

### Device connect (SEP, pRMT, aRMT)

- SEP (Study Extension Platform):
  - `SEP_CLIENT_ID` (default `SEP`)
  - `SEP_CLIENT_SECRET`
  - `NEXT_PUBLIC_SEP_REDIRECT_URI`

- pRMT:
  - `PRMT_CLIENT_ID` (default `pRMT`)
  - `PRMT_CLIENT_SECRET`
  - `NEXT_PUBLIC_PRMT_REDIRECT_URI`

- aRMT (RADAR active RMT / Apple Health, etc.):
  - `ARMT_CLIENT_ID` (default `aRMT`)
  - `NEXT_PUBLIC_ARMT_REDIRECT_URI`

### Email (optional)

Used by email helpers (e.g. `app/_lib/email/send.ts`):

- `SMTP_HOST`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_PORT` (default `587`)
- `SMTP_FROM` (sender address)

## Getting Started (local development)

1. **Install dependencies**

```bash
npm install
```

2. **Create `.env.local`**

Minimal example for local development (adjust URLs to your stack):

```bash
KRATOS_INTERNAL_URL=http://localhost:4433

HYDRA_ADMIN_URL=http://localhost:4445
NEXT_PUBLIC_HYDRA_PUBLIC_URL=http://localhost:4444

MP_CONFIG_BASE_URL=http://localhost:8080/managementportal
MP_PROJECTS_ENDPOINT=api/public/projects

STUDY_DEFINITION_REPOSITORY=GITHUB
DEFAULT_STUDY_ID=default

GITHUB_REPO_NAME=radar-self-enrolment-definitions
GITHUB_REPO_BRANCH_NAME=main

BASEPATH=/study
```

3. **Run the development server**

```bash
npm run dev
```

Then open `http://localhost:3000` (or `http://localhost:3000/study` if `BASEPATH=/study`) in your browser.

> Ensure **Kratos**, **Hydra**, and (optionally) **Management Portal** are running and reachable at the URLs you configured above before testing login/enrolment.

## Default study & fallback behavior

- If a project exists in Management Portal but has no study definitions in GitHub or local `public/study/{studyId}`, the app uses the **default study** from `public/study/default` (or `DEFAULT_STUDY_ID`) for:
  - Landing page content (e.g. `public/study/default/landingpage.json`).
  - Protocol and tasks (e.g. `public/study/default/protocol.json`).
- The UI content/theme comes from the default study, but:
  - `protocol.studyId` is set to the **requested** id.
  - `protocol.name` is also set to the **requested** id (so titles/nav reflect the project id).
- The default landing page CTA (hero block with `href: "enrol"`) is automatically resolved to `/{studyId}/enrol` (and base path–aware, e.g. `/study/{studyId}/enrol` when `BASEPATH` is set).

This allows you to create a new project in Management Portal and immediately:

- Visit `/{studyId}` (or `/study/{studyId}`),
- See a functional default landing page,
- Enrol and access `/[studyId]/portal` without having created project-specific definitions yet.