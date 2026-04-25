# User Profile Dashboard Implementation Plan

This plan outlines the creation of a secure, modern profile dashboard where users can view their details after successfully authenticating via OTP.

## Overview
Currently, the application allows users to register and verify their phone numbers via OTP, but lacks a dedicated page where users can view their stored personal details (PAN, Income, Employment, etc.). I will create a highly polished `/profile` page using Next.js and Tailwind CSS.

## Open Questions
> [!NOTE]
> 1. Should the user be allowed to **edit** their profile from this page, or should this initial version just be **read-only**? 
> 2. Do you have a specific icon or graphic preference for the profile header (e.g. an avatar vs an abstract gradient)? If not, I will default to a premium abstract design.

## Proposed Changes

### Frontend Components

#### [NEW] [profile/page.tsx](file:///d:/websiteCV/coverfrontend/src/app/profile/page.tsx)
- Create a new Next.js route for the profile dashboard.
- Integrate Zustand's `useAuthStore` to ensure the user is logged in before rendering. If the user is unauthenticated, redirect them to the home page or prompt them to log in.
- Use `fetchUserData` from the centralized Axios instance (`utils.tsx`) to pull the secure payload from the `POST /api/user/profile` backend endpoint.
- **UI Design**: Apply the "Anti-Gravity" premium design language:
  - Deep Navy background (`#08101E`) with vibrant Saffron (`#FF7819`) accents and glassmorphism cards (`backdrop-blur`).
  - Use `framer-motion` for smooth entrance animations (staggered card loading).
  - Use `lucide-react` icons (User, Phone, MapPin, Briefcase, IndianRupee) to visually separate sections (Personal Details, Professional Details, Address).

#### [MODIFY] [Navbar.tsx](file:///d:/websiteCV/coverfrontend/src/app/Components/Navbar.tsx)
- Ensure the Navbar correctly links to `/profile` when the user is logged in instead of just showing "Logged In" or doing nothing.

## Verification Plan

### Automated Tests
- Build the Next.js frontend (`npm run build`) to ensure the new page complies with TypeScript and has no hydration mismatches.

### Manual Verification
- Log in using an OTP.
- Navigate to `/profile`.
- Verify that the page loads beautifully and accurately displays the user's database records.
- Verify that accessing `/profile` while logged out safely redirects or shows an error.
