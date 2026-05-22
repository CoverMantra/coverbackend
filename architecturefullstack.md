# CoverMantra Fullstack Architecture

**Last Updated:** 20 May 2026

## Project Vision
CoverMantra is a loan aggregator and insurance advisory platform. The fullstack product should provide a polished, responsive web experience while aggregating loan offers from partner lenders in real time.

## Current Setup
- `coverbackend/` — Node.js + Express API server with MongoDB
- `coverfrontend/` — Next.js 16 React web application

## Target Fullstack Architecture
- **Backend:** Go service for API, aggregation, auth, and lender adapters
- **Frontend:** Go-based UI option or modern JS UI with clear migration path
- **Data Store:** PostgreSQL for transactional data; Redis for caching
- **Infrastructure:** Docker + Kubernetes / Docker Compose for local dev
- **CI/CD:** GitHub Actions builds and deploys backend and frontend

## Fullstack Layers
1. **Client Layer**
   - Responsive UI across desktop, tablet, and mobile
   - Home page, loan comparison, application forms, dashboard, user profile
   - Mobile-first design with accessible tables and cards

2. **API Layer**
   - Authentication and user profile routes
   - Loan search and aggregator endpoints
   - Partner integration triggers
   - Admin management APIs

3. **Domain Layer**
   - Business rules for eligibility, scoring, normalization
   - Loan request orchestration
   - Offer ranking and comparison

4. **Persistence Layer**
   - User, lender, loan request, offer, OTP
   - Audit logging and event history
   - Partner response storage

5. **Infrastructure Layer**
   - Network, reverse proxy, logs, metrics
   - Cache and queue systems
   - Secure secret management

## Key Data Flow
1. User enters loan details or requests eligibility
2. Frontend sends request to backend API
3. Backend validates input and loads lender eligibility
4. Backend sends parallel requests to partner lender adapters
5. Responses are normalized and ranked
6. Aggregated results returned to frontend
7. User selects offer and continues application

## Frontend Architecture
- **Current stack:** Next.js, Tailwind CSS, React Context
- **Responsive UI:** breakpoints for mobile/tablet/desktop
- **Components:** Navbar, Hero, OfferTable, LoginModal, Dashboard, ChatBot, Footer
- **API client:** Axios wrapper with centralized endpoints
- **Authentication:** OTP flow with cookies and JWT

## Backend Architecture
- **Current stack:** Express, MongoDB, Mongoose, Axios
- **Proposed stack:** Go, `chi`, `sqlx`, `golang-migrate`, `zap`, OpenTelemetry
- **Important modules:** `app.js`, `routes/userRoutes.js`, `PartnerRoutes/*`

## Migration Strategy
- Keep current repo structure until new Go backend is ready
- Build new backend alongside old one in `coverbackend/`
- Migrate feature-by-feature: auth, lenders, aggregation, admin
- Keep frontend API contracts stable during migration
- Use API gateway or versioned routes if needed

## UI/UX Requirements
- Loan aggregator homepage with hero search
- Loan comparison tables that adapt to mobile
- Lender detail pages with rates and fees
- User dashboard with profile and history
- Admin panel for lender data and metrics
- Notifications and error handling in frontend

## Security & Compliance
- OTP security and rate limiting
- JWT authentication with refresh tokens
- Secure storage of user PII
- HTTPS, CORS, input validation, CSRF mitigation

## Operations & Monitoring
- Prometheus metrics and Grafana dashboards
- Alerts for errors, latency, and resource usage
- Health checks and readiness probes
- Log aggregation and request tracing

## Implementation Roadmap
1. Audit current code and API contracts
2. Design target Go backend schema and routes
3. Build new backend skeleton and basic auth
4. Migrate lender integrations one by one
5. Update frontend to call the new backend
6. Test end-to-end and deploy locally
7. Harden security and observability

## Conclusion
The updated fullstack architecture is now aligned with CoverMantra’s next product phase: a modern lending aggregator with a Go backend, responsive frontend, secure authentication, and production-ready infrastructure.
