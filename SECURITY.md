# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability, please report it **privately** by emailing **derderian@abel.fr**.

**Do not open a public GitHub issue for security vulnerabilities.**

Please include:

- A description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

You can expect an initial response within 48 hours. We will work with you to understand the issue and coordinate a fix before any public disclosure.

## Supported Versions

Only the latest version on the `main` branch is actively maintained.

## Security Design

- GitHub tokens are never exposed to the client — all API calls are proxied through `server/api/github/*`
- In multi-user mode, OAuth tokens are stored in encrypted session cookies (via `nuxt-auth-utils`)
- In personal mode, the token is read from a server-side environment variable
- No server-side database — no stored credentials to leak
