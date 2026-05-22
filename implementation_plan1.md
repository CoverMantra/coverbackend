# CoverMantra Detailed Implementation Roadmap

**Last Updated:** 20 May 2026

## Purpose
Provide an executable project roadmap for modernizing CoverMantra into a Go-backed loan aggregator with a production-ready frontend.

## Milestone 1: Discovery and Code Audit
- Inventory existing backend files and frontend routes
- Identify the current API surface and partner integrations
- Confirm critical pages and user journeys
- Document missing assets or route gaps

### Deliverables
- Updated architecture docs
- API contract list
- Migration decision log
- Dependency inventory

## Milestone 2: Backend Migration Strategy
### Architecture
- `cmd/api/main.go` — server bootstrap
- `internal/handlers/*` — HTTP handlers
- `internal/service/*` — business logic
- `internal/store/*` — database repository layer
- `internal/model/*` — shared domain types
- `pkg/external/*` — lender adapter packages

### Technology
- Go 1.23 or later
- `chi` router
- `sqlx` for SQL access
- `golang-migrate` for schema management
- `zap` structured logging
- OpenTelemetry integration
- Postgres database
- Redis caching

### First-pass Features
- User registration and login
- OTP verification
- User profile CRUD
- Lender metadata and eligibility
- Loan search and comparison
- Partner API orchestration
- Admin lender management

## Milestone 3: Frontend Readiness
### Current Frontend State
- Next.js App Router project in `coverfrontend`
- Major pages: Home, Personal Loans, Insurance, Dashboard, Contact
- Existing UI uses Context API and cookies for auth

### Improvement Areas
- Consolidate API layer in `src/app/APIs/utils.tsx`
- Replace direct cookie checks with a single auth state service
- Improve responsive table layouts for loan comparison
- Add `loading.tsx` and `error.tsx` pages for better UX
- Add a user profile page with secure data fetch

### Frontend Migration Options
1. **Maintain Next.js frontend** and consume Go backend
2. **Go WASM frontend** using `vugu` or `TinyGo` for single-language implementation
3. **Hybrid**: keep web UI in React/Next.js, migrate core logic to Go services

### Recommended Path
- Start with **option 1** for fastest delivery
- Keep current frontend while backend migrates
- Later evaluate Go-based frontend if a single-language stack is required

## Milestone 4: Integration and Testing
### Integration Tasks
- Build backend API mocks for frontend development
- Wire the current UI to new Go endpoints
- Maintain the same request/response contracts where possible
- Add API versioning if the contract changes

### Test Strategy
- Unit tests for backend services and repository logic
- Integration tests against a test database
- Frontend smoke tests for login, dashboard, and loan search
- API contract tests for partner adapters
- Optional E2E tests with Cypress or Playwright

## Milestone 5: Deployment and Operations
### Local Development
- Docker Compose file with backend, frontend, Postgres, Redis
- `make dev` or `npm run dev` to launch full stack
- Seed data for lenders and test users

### CI/CD
- GitHub Actions workflow to:
  - build backend
  - run backend tests
  - build frontend
  - run frontend lint/tests
  - build Docker images

### Production
- Containerize backend and frontend
- Deploy to cloud with Kubernetes or managed containers
- Use managed Postgres and Redis
- Add observability and alerting

## Risk Mitigation
- Preserve current Node/Next implementation until Go backend is stable
- Use feature toggles for new API routes
- Keep partner integration logic isolated from core user flows
- Add logging and metrics early

## Team Alignment
- Assign backend owner for Go migration
- Assign frontend owner for API transition
- Sync weekly on blockers and API contract changes
- Use docs and architecture files to keep everyone aligned

## Summary
This detailed roadmap is the latest update for CoverMantra’s modernization initiative. It covers discovery, engineering, testing, deployment, and risk management to make the platform robust, scalable, and production-ready.
