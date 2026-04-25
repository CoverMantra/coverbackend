# Full-Stack Optimization & Security Fix Plan

This plan details the steps to fix the critical security issues, improve architecture, and boost performance across both the Frontend and Backend.

## User Review Required
> [!IMPORTANT]
> Since this involves massive changes across both the frontend and backend, please review the steps carefully. Once you approve, I will execute these changes sequentially.

## Phase 1: Backend Security & DB Optimization
We will secure the backend against IDOR vulnerabilities and SMS bombing, and optimize the database.

### 1. Database Indexing
#### [MODIFY] `models/Users.js`
- Add `index: true` to the `phone` field in the user schema to drastically speed up queries.

### 2. Authentication Middleware
#### [NEW] `middlewares/authMiddleware.js`
- Create a middleware that reads the `Authorization: Bearer <token>` header, verifies the JWT token, and attaches `req.user = { phone }`.

### 3. Securing Routes
#### [MODIFY] `routes/userRoutes.js`
- Apply `authMiddleware` to `/profile`, `/update-profile`, `/filter-lenders`, and `/delete-profile`.
- Remove the dependency on `req.body.phone` for these routes, extracting the phone directly from `req.user.phone` to prevent IDOR attacks.

### 4. Rate Limiting
- Run `npm install express-rate-limit` in `coverbackend`.
#### [MODIFY] `app.js` (or `userRoutes.js`)
- Add a rate limiter (e.g., max 5 requests per minute) to `/api/user/send-otp` and `/api/user/register`.

---

## Phase 2: Frontend Infrastructure (API & State)
We will clean up how the frontend communicates with the backend and how it manages user sessions.

### 1. Dependencies
- Run `npm install zustand axios` in `coverfrontend`.

### 2. Global Axios Instance
#### [NEW] `src/lib/axios.ts`
- Create a configured Axios instance.
- Add an interceptor to automatically attach the `co_token` from cookies to the `Authorization` header of every request.

### 3. API Utilities Refactor
#### [MODIFY] `src/app/APIs/utils.tsx`
- Replace hardcoded `fetch` and raw `axios` calls with the new configured Axios instance.
- Ensure the `BASE_URL` relies on environment variables or defaults to the correct backend host.

### 4. Global State (Zustand)
#### [NEW] `src/store/useAuthStore.ts`
- Create a Zustand store to handle authentication state (checking cookies on initial load, setting user data). This will eliminate the need to scatter `Cookies.get("co_token")` throughout the UI components.

---

## Phase 3: Frontend Component Refactoring
We will optimize images, remove hydration issues, and clean up form logic.

### 1. HeroSection Refactoring
#### [MODIFY] `src/app/Components/HeroSection.tsx`
- Add the `sizes` prop to all `next/image` components to fix loading performance issues.
- Replace raw `Cookies.get` checks with the new Zustand `useAuthStore` to prevent hydration mismatches.

### 2. LoginModal Cleanup
#### [MODIFY] `src/app/Components/LoginModal.tsx`
- Refactor to use the new `useAuthStore` for login status updates.
- Improve error handling states by standardizing API response handling through the new Axios instance.

---

## Verification Plan
After each phase is completed, I will:
1. Verify the backend starts correctly.
2. Verify that protected routes return `401 Unauthorized` without a valid token.
3. Verify that the frontend builds without errors and the `HeroSection` and `LoginModal` render correctly.
