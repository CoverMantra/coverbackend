# Full Stack Architecture Documentation for CoverMantra Website

## Introduction

Hello Junior Developer! Welcome to the CoverMantra project. This is a full-stack web application that helps users apply for loans and buy insurance. As a professional full-stack developer, I'll explain how this entire system works step by step, from the backend to the frontend, and how they interact. We'll cover the architecture, technologies, data flow, and key components.

Think of this as a fintech platform where users can:
- Check loan eligibility
- Register and verify via OTP
- Apply for loans through partner lenders (MoneyView, FatakPay, Zype)
- Buy various insurance policies
- Calculate EMIs and premiums

## Project Structure Overview

The project is organized into two main folders:
- `coverbackend/` - Node.js/Express API server
- `coverfrontend/` - Next.js React application

Let's dive deep into each part.

## Backend Architecture (coverbackend/)

### Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **HTTP Client**: Axios for external API calls
- **Environment**: dotenv for configuration

### Entry Point: app.js

The `app.js` file is the heart of our backend application. Here's what it does:

1. **Environment Setup**: Loads environment variables from `.env` file
2. **Database Connection**: Calls `connectDb()` to establish MongoDB connection
3. **CORS Configuration**: Allows requests from specific domains (production and localhost)
4. **Middleware**: Enables JSON parsing with `express.json()`
5. **Route Registration**: Mounts all API routes under `/api/*`
6. **Server Start**: Starts the server on port 5001 (or from env)

```javascript
// Key routes mounted:
app.use("/api/user", userRoutes);           // User management
app.use("/api/insurence", insurence);       // Insurance requests
app.use("/api/moneyview", moneyview);       // MoneyView lender integration
app.use("/api/fatakPay", fatakPay);         // FatakPay lender integration
app.use("/api/zype", zype);                 // Zype lender integration
app.use("/api/vivifi", vivifiRoutes);       // Vivifi integration
```

### Database Layer: config/db.js

Simple but crucial - connects to MongoDB using Mongoose:

```javascript
const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`Mongo connected: ${conn.connection.host}`);
  } catch (e) {
    console.error("Database connection error:", e.message);
    process.exit(1); // Exit if DB fails
  }
};
```

### Data Models (models/)

We have several Mongoose schemas:

1. **Users.js**: Stores user personal information
   - name, phone, pan, dob, email, city, state, gender, employment, income, pincode
   - Also has DeleteRequest schema for account deletion requests

2. **Otp.js**: Temporary OTP storage (though currently using in-memory)

3. **Contact.js**: Contact form submissions

4. **ramfinmodel.js**: Likely for RAM Financial data

5. **VivifiResponse.js**: Stores responses from Vivifi partner

### User Management Routes (routes/userRoutes.js)

This is the core user-facing API. Key endpoints:

#### POST /api/user/eligibility
- Input: age, income, pincode
- Validates user meets basic criteria (age > 18)
- Filters lenders from `lenderList.js` based on:
  - Age >= lender's minimum age
  - Income >= lender's minimum income
  - Pincode matches lender's service areas
- Returns eligible lenders list

#### POST /api/user/register
- Creates new user account
- Validates all required fields (name, phone, pan, etc.)
- Validates PAN format and mobile number
- Saves to MongoDB Users collection

#### POST /api/user/send-otp
- Generates 6-digit OTP
- Sends via SMS API (external service)
- Stores OTP temporarily with expiry

#### POST /api/user/verify-otp
- Verifies OTP matches stored value
- Issues JWT token for authentication
- Returns token for frontend to store

#### POST /api/user/profile
- Fetches user data by phone number
- Requires JWT authentication

### Partner Integrations (PartnerRoutes/)

These handle integrations with external lender APIs:

#### MoneyView Integration
- **POST /api/moneyview/register**
- Authenticates with MoneyView API using username/password
- Validates PAN format
- Creates lead with user data
- Fetches loan offers and journey URL
- Returns combined response

#### FatakPay Integration
- Similar flow but for FatakPay lender
- Has separate endpoints for PL (Personal Loan) and DCL (Digital Credit Line)

#### Zype Integration
- Another lender partner
- Handles lead creation and response

#### Vivifi Integration
- Insurance-focused partner
- Stores responses in VivifiResponse model

### Insurance Routes (insurence/)

Handles different insurance types:
- Vehicle insurance (car, bike)
- Life insurance
- Travel insurance
- Home insurance
- Health insurance

Currently validates fields but doesn't store - just returns success.

### Utility Functions (utils/)

1. **jwtgenerate.js**: Creates JWT tokens for user sessions
2. **otpstore.js**: Manages OTP generation and storage

### Lender Configuration (lender/lenderList.js)

Static data defining available lenders with:
- Name, UTM tracking
- Minimum age and income requirements
- Serviceable pincodes
- API endpoints

## Frontend Architecture (coverfrontend/)

### Technology Stack
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Library**: Material-UI (MUI)
- **Animations**: Framer Motion, Lottie, AOS
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Routing**: Next.js App Router (file-based)

### App Structure

#### Root Layout (layout.tsx)
- Server component (no "use client")
- Sets up fonts (Geist Sans/Mono)
- Loads global CSS and AOS styles
- Defines metadata for SEO
- Wraps children in ClientLayout

#### Client Layout (clientlayout.tsx)
- Client component with "use client"
- Provides ModalProvider context
- Renders Navbar, children, GlobalModal, ChatBot, Footer

### Routing System (App Router)

Pages are organized under `src/app/`:
- `page.tsx` - Home page
- `about/page.tsx` - About page
- `contact/page.tsx` - Contact page
- `personal-loans/page.tsx` - Loan application
- `insurance/` - Insurance pages
- `dashboard/page.tsx` - User dashboard

### Component Architecture

#### Layout Components
- **Navbar**: Navigation with login/logout
- **Footer**: Site footer
- **GlobalModal**: Reusable modal component
- **ChatBot**: Interactive chatbot

#### Page Components
- **Body**: Main home page content assembler
- **HeroSection**: Landing hero with swiper carousel
- **LoanInfo**: Loan product information
- **HowItWorks**: Process explanation
- **EmiCalculator**: Interactive EMI calculator
- **TestimonialSlider**: Customer testimonials
- **Trust**: Trust indicators
- **WhyChooseUs**: Value proposition
- **Security**: Security features
- **DownloadSection**: App download CTA

#### Feature Components
- **LoginModal**: User authentication
- **VivifiLeadForm**: Insurance lead form
- **Achievement**: Success metrics display

### State Management

Uses React Context API:
- **ModalProvider**: Manages modal states (login, etc.)
- Stores in `context/modelcontext.tsx`

### Data Flow & API Integration

#### API Configuration (APIs/utils.tsx)
- Base URL: https://www.covermantra.com/api
- Axios instance with interceptors
- Handles authentication headers

#### User Journey Flow

1. **Eligibility Check**:
   - User enters age, income, pincode
   - Frontend calls `/api/user/eligibility`
   - Backend filters eligible lenders
   - Returns lender list

2. **Registration**:
   - User fills registration form
   - Frontend validates locally
   - Calls `/api/user/register`
   - Backend validates and saves user

3. **OTP Verification**:
   - User enters phone
   - Frontend calls `/api/user/send-otp`
   - SMS sent via external API
   - User enters OTP
   - Frontend calls `/api/user/verify-otp`
   - Backend validates and returns JWT

4. **Loan Application**:
   - Authenticated user applies
   - Frontend calls partner API (e.g., `/api/moneyview/register`)
   - Backend forwards to lender API
   - Returns lender's response (offers, redirect URL)

5. **Insurance Purchase**:
   - Similar flow through insurance routes
   - May integrate with Vivifi or other providers

### Authentication Flow

- Uses JWT tokens stored in cookies
- `js-cookie` library for client-side cookie management
- Protected routes check for `co_token` and `co_phone` cookies
- Redirects to login if not authenticated

### Animations & UI

- **Lottie**: JSON-based animations (stored in `animations/`)
- **Framer Motion**: Page transitions and micro-interactions
- **AOS**: Scroll-triggered animations
- **Swiper**: Image carousels
- **Material-UI**: Consistent component library

## Data Flow Architecture

```
User Browser → Next.js Frontend → Express Backend → MongoDB
     ↓              ↓              ↓              ↓
   React UI → API Calls (Axios) → Route Handlers → Mongoose Models
     ↓              ↓              ↓              ↓
  UI Updates ← Response Data ← Business Logic ← Database Queries
```

### Detailed Request Flow Example

1. User clicks "Apply for Loan"
2. Frontend checks authentication cookies
3. If not logged in, shows LoginModal
4. User registers → OTP verification → JWT issued
5. Authenticated user fills loan form
6. Frontend calls `/api/moneyview/register`
7. Backend validates user data
8. Backend calls MoneyView API with auth token
9. MoneyView returns loan offers
10. Backend saves response and returns to frontend
11. Frontend redirects user to lender's application URL

## Security Considerations

- JWT authentication with expiration
- CORS restricted to allowed domains
- Input validation on both frontend and backend
- PAN and mobile number format validation
- Environment variables for sensitive data
- HTTPS in production

## Deployment & Environment

- **Backend**: Deployed on Render (cbe-y7q8.onrender.com)
- **Frontend**: Next.js static export or server
- **Database**: MongoDB Atlas
- **Environment Variables**: Separate for dev/prod

## Key Business Logic

### Lender Eligibility Algorithm
```javascript
const eligibleLenders = lenderList.filter((lender) => {
  const ageMatch = age >= lender.age;
  const incomeMatch = income >= lender.minIncome;
  const pincodeMatch = lender.pincodes.includes("*") || 
                      lender.pincodes.includes(pincode);
  return ageMatch && incomeMatch && pincodeMatch;
});
```

### Partner API Integration Pattern
1. Authenticate with partner
2. Validate user data
3. Create lead
4. Get offers/response
5. Return formatted response

## Areas for Improvement

1. **Error Handling**: More comprehensive error responses
2. **Testing**: Add unit and integration tests
3. **Caching**: Implement Redis for OTP storage
4. **Logging**: Add structured logging
5. **API Documentation**: Swagger/OpenAPI specs
6. **Database Indexing**: Optimize MongoDB queries
7. **Frontend State**: Consider Zustand or Redux for complex state
8. **Type Safety**: More TypeScript interfaces for API responses

## Conclusion

This full-stack application demonstrates a complete fintech platform with:
- Secure user authentication
- External API integrations
- Modern React frontend
- Scalable Node.js backend
- MongoDB data persistence

The architecture follows best practices with separation of concerns, proper error handling, and scalable design patterns. As you work on this project, focus on understanding the data flow and how frontend and backend communicate through APIs.

Remember: Always validate inputs, handle errors gracefully, and keep security in mind!</content>
<parameter name="filePath">d:\websiteCV\architecturefullstack.md