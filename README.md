# Fastor Mobile App — React Assessment Submission

A pixel-perfect, mobile-first React web application matching the **Figma Design Task** and integrated with the live **Fastor Staging APIs**.

---

## 🎯 Project Overview & Deliverables

- **Live Staging API Integration:** Complete end-to-end authentication (Phone Registration & 6-digit OTP verification) and dynamic restaurant catalog retrieval with token persistence.
- **Figma Visual Fidelity:** Exact extraction and implementation of design tokens, typography, SVGs, colors (`#E95322`, `#FFD8C7`, `#FFDECF`, `#F5CB58`), border radii (10px button vs 100px action pills), and responsive mobile device frame.
- **Mobile-First Experience:** Centered phone shell with elevation for desktop viewing and fluid responsive layout for mobile screens (320px–430px).

---

## 📱 Implemented Screens & User Flow

### 1. Screen 1: Sign Up / Login (`/login`)
- Clean mobile header with iOS status bar indicators and back navigation.
- Phone number input field with `+91 |` country code prefix and `00000-00000` placeholder.
- Real-time length & numeric validation (`inputMode="numeric"`).
- "Get OTP" primary CTA button with `border-radius: 10px` and `height: 48px` matching Figma specs.
- Integrated mobile numeric dialpad matching Figma with complete native keyboard support.
- Calls `POST /pwa/user/register` and navigates to the OTP screen with phone number in state.

### 2. Screen 2: OTP Verification (`/otp`)
- 6 individual OTP digit boxes with a hyphen separator (`[ ][ ][ ] - [ ][ ][ ]`).
- Auto-advance on keystroke, backspace retreat, and full 6-digit paste support.
- 30-second countdown timer `(00:30)` with clickable Resend action when expired.
- Staging default OTP quick-helper (`123456`).
- Calls `POST /pwa/user/login`, persists JWT token in `localStorage`, updates `AuthContext`, and redirects to `/`.

### 3. Screen 3: Restaurant / Home Feed (`/`)
- Location header ("Model Town, New Delhi") with user logout action.
- Search bar with instant client-side name/address filtering.
- **Figma Shortcut Action Buttons:** Food/Flame shortcut button (`#FF6448`) and Wallet shortcut button (`#3A86FF`) with custom SVG icons.
- **"Best Seller" Section:** Horizontal scrolling card carousel with `₹` currency formatting.
- **Promotional 30% OFF Banner:** Featuring the wood-fired pizza imagery and the exact top and bottom yellow decorative arc SVGs (`#F5CB58`).
- **"Popular Items" Feed:** Populated dynamically from `GET /m/restaurant?city_id=118`.
- Shimmer skeleton loaders, empty states, and automatic retry mechanism with cached fallback for cold-start latency.

### 4. Screen 4: Restaurant / Food Details (`/restaurant/:id`)
- Hero dish photography with floating glassmorphism back pill button.
- **Price & Stepper Row:**
  - Dynamic price display in Indian Rupees (`₹`).
  - Separated by top and bottom `#FFD8C7` horizontal divider line SVGs.
  - Interactive Figma stepper SVG (`- 3 +`) supporting decrement, increment, and dynamic quantities.
- **Personal Portion Selector:**
  - Options: *Personal (4 Slides)*, *Medium (8 Slides)*, *Familiar (10 Slides)*, and *Jumbo (12 Slides)*.
  - Custom dotted leader line SVG (`#FFD8C7`) connecting portion title and price.
  - Custom Figma radio button SVG (`#E95322`) with hollow unselected rings and filled selected dot.
- **Floating CTA:** "Add to cart" primary button (`334 × 48px`, `border-radius: 10px`) with confirmation toast.
- **Active Orders / Order History (Frame 1:1343):**
  - Order cards for *Sushi Wave* (`₹20.00`) and *Strawberry Shake* (`₹20.00`).
  - Exact pill buttons: **Cancel Order** (`#E95322`, `border-radius: 100px`) and **Track Driver** (`#FFDECF`, `border-radius: 100px`).

### 5. Route Protection & Security (`ProtectedRoute`)
- Unauthenticated visitors attempting to access `/` or `/restaurant/:id` are redirected to `/login`.
- Logged-in users attempting to access `/login` or `/otp` are redirected to `/`.
- Axios interceptor injects `Authorization: Bearer <token>` on all authenticated requests.
- Any `401 Unauthorized` response immediately invalidates credentials and redirects to `/login`.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology |
|---|---|
| **Framework** | React 18 + Vite |
| **Routing** | React Router v6 |
| **HTTP Client** | Axios (with request & response interceptors) |
| **Design System** | Custom CSS Variables (`tokens.css`) + Vanilla CSS |
| **Icons** | Custom Figma SVGs + Lucide React |
| **State Management** | React Context (`AuthContext`) with `localStorage` persistence |

---

## 📂 Project Structure

```text
src/
├── api/
│   ├── client.js          # Axios instance, baseURL, and interceptors (401 auto-logout)
│   ├── auth.js            # registerUser() and loginWithOtp()
│   └── restaurants.js     # getRestaurants() with retry and cache fallback
├── context/
│   └── AuthContext.jsx    # Token state, user phone, login, logout, persistence
├── components/
│   ├── ProtectedRoute.jsx # Route guards for auth & public routes
│   ├── RestaurantCard.jsx # Figma-matched food & restaurant card
│   ├── RestaurantCard.css
│   ├── Keypad.jsx         # Mobile numeric dialpad matching Figma
│   ├── Keypad.css
│   ├── SkeletonCard.jsx   # Shimmer skeleton loader
│   ├── SkeletonCard.css
│   ├── HeaderBar.jsx      # iOS status bar and back button
│   └── HeaderBar.css
├── pages/
│   ├── Login.jsx          # Screen 1 (Phone registration)
│   ├── Login.css
│   ├── Otp.jsx            # Screen 2 (6-digit OTP verification)
│   ├── Otp.css
│   ├── Restaurants.jsx    # Screen 3 (Home / Restaurant feed)
│   ├── Restaurants.css
│   ├── RestaurantDetail.jsx # Screen 4 (Dish / Restaurant detail & order cards)
│   └── RestaurantDetail.css
├── styles/
│   ├── tokens.css         # Figma design tokens (colors, radii, shadows)
│   └── index.css          # CSS reset & centered mobile wrapper
├── App.jsx                # Route declarations
└── main.jsx               # React entry point
```

---

## 🚀 Setup & Local Execution

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/Gaurxvv/fastor-react-mobile-assignment.git

# Navigate into the project folder
cd fastor-react-mobile-assignment

# Install dependencies
npm install
```

### 3. Environment Variables
A `.env` file is included (sample in `.env.example`):
```env
VITE_API_BASE_URL=https://staging.fastor.ai/v1
```

### 4. Start Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 5. Production Build
```bash
npm run build
```
Outputs optimized production assets to `dist/`.

---

## 🔑 Test Credentials (Staging)

- **Test Mobile Number:** `9818979450` (or any valid 10-digit number)
- **Staging OTP:** `123456`
- **Default City ID:** `118`
- **Currency:** Indian Rupees (`₹`) across all catalog and order displays

---

## 🌐 Deployment Ready (Vercel)

A `vercel.json` configuration file is included in the root directory to handle client-side Single Page Application (SPA) routing:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
This ensures direct URLs (such as `/otp` or `/restaurant/1000`) resolve seamlessly on page refreshes without 404 errors.
