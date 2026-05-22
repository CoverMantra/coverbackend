# CoverMantra Implementation Plan

**Last Updated:** 20 May 2026

## Objective
Build the next version of CoverMantra as a modern loan aggregator platform with a Go backend and a responsive web frontend.

## Phase 0: Preparation
- Review existing `coverbackend` and `coverfrontend` repositories
- Document current API contracts and frontend expectations
- Define migration targets for Go backend and Go-friendly frontend option
- Create supporting architecture and plan documents

## Phase 1: Backend Redesign
### Goals
- Replace Express + MongoDB with Go + SQL
- Implement secure auth and OTP flows
- Build lender aggregation and partner adapters

### Tasks
1. Create `coverbackend/cmd/api/main.go`
2. Setup `go.mod`, `Makefile`, and `Dockerfile`
3. Build router and middleware stack with `chi`
4. Implement database layer with `sqlx` and migrations
5. Implement auth routes and JWT middleware
6. Implement OTP send/verify flows
7. Implement lender eligibility and aggregation endpoints
8. Add structured logging and metrics
9. Write unit and integration tests

## Phase 2: Frontend Stabilization
### Goals
- Keep the current Next.js app stable while preparing a Go-friendly frontend path
- Centralize API calls and state handling
- Improve responsiveness and accessibility

### Tasks
1. Audit `src/app/APIs/utils.tsx` and standardize backend URLs
2. Refactor login flow for consistent auth state
3. Improve responsive tables and card layouts
4. Add a profile/dashboard page with secure user data fetch
5. Apply mobile-first design to loan comparison and insurance pages
6. Validate current page routes and fix missing error/loading components

## Phase 3: Integration
### Goals
- Ensure backend and frontend work together through stable APIs
- Migrate API calls to the new backend service
- Maintain existing user experience throughout

### Tasks
1. Build backend mock endpoints for frontend testing
2. Update frontend API endpoints to new Go backend paths
3. Add feature flags or API versioning if needed
4. Validate the full loan search and apply flows
5. Run E2E smoke tests for core journeys

## Phase 4: Deployment & QA
### Goals
- Create local and production deployment pipelines
- Ensure test coverage and operational readiness

### Tasks
1. Add GitHub Actions workflows for backend and frontend
2. Create `docker-compose.yml` for local development
3. Add Kubernetes manifests or Terraform templates for cloud deployment
4. Add monitoring and logging configuration
5. Run security scans and performance tests
6. Document deployment and run instructions

## Phase 5: Launch Readiness
### Goals
- Validate production-like readiness
- Document user onboarding and operations

### Tasks
1. Confirm all endpoints in OpenAPI or Swagger
2. Validate database migrations and seed data
3. Test OTP, login, profile, and loan comparison flows
4. Validate responsive UI on desktop/tablet/mobile
5. Confirm metrics and alerts are configured

## Success Criteria
- Backend is running in Go with stable API routes
- Frontend is responsive and can consume the backend
- OTP and auth flows are secure and reliable
- Loan aggregation returns normalized results
- CI pipeline builds and tests successfully
- Deployment plan is documented

## Notes
This implementation plan is designed to support a phased migration without disrupting the existing CoverMantra product. It emphasizes a clear backend rewrite, frontend stabilization, and strong integration testing.
