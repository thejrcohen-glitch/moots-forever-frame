# Security Policy

## Supported Versions

This repository is actively maintained on the `main` branch.

Security fixes are applied to the current production codebase on `main`.
Older branches, experimental branches, and archived branches are not guaranteed to receive security updates.

| Branch / Version | Supported |
| ---------------- | --------- |
| `main`           | ✅ |
| feature branches | ⚠️ Best effort |
| archived/old branches | ❌ |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please do **not** open a public issue with full exploit details.

Instead, use one of the following methods:

1. **Preferred:** Use GitHub's private vulnerability reporting feature for this repository, if enabled.
2. If private reporting is unavailable, contact the repository owner privately and include:
   - a description of the issue
   - steps to reproduce
   - the potential impact
   - any suggested fix, if you have one

Please include enough detail for the issue to be reproduced and validated.

## What to Expect

After a report is received:

- We will review the report as quickly as possible.
- We may ask follow-up questions if more detail is needed.
- If the issue is confirmed, we will work on a fix and release it through the repository.
- If the report is not accepted as a security issue, we will explain why when possible.

## Scope

Please report issues such as:

- exposed secrets or credentials
- authentication or authorization weaknesses
- injection vulnerabilities
- dependency vulnerabilities with real project impact
- unsafe server-side behavior
- sensitive information disclosure

Please do not report:

- general support requests
- feature requests
- low-risk best-practice suggestions without a concrete security impact
- issues already documented in existing alerts unless you have new evidence
