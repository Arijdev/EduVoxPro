# EduVoxPro â€” Role-Based Tech Certification Platform

EduVoxPro is a production-grade, text-first technical certification and learning platform designed for software engineers, architects, and AI practitioners. It features high-density documentation, interactive architectural diagrams, copyable code blocks, 80% MCQ progression gates, direct UPI payment workflows, and cryptographically verifiable print-ready certificates.

## âœ¨ Key Features

- **5 Certification Tracks** â€” 2 completely free (Web Foundations, AI Prompt Engineering & Ethics) + 3 paid (Agentic AI Developer, Generative AI Specialist, Modern Full-Stack Architect)
- **7â€“10 Modules per Track** â€” deep documentation, code architectures, and architectural diagrams
- **80% MCQ Progression Gate** â€” 5 questions per module; score â‰¥80% to unlock the next chapter
- **Verifiable Certificates** â€” print-ready diplomas with unique Verification ID and QR code
- **Direct UPI Checkout** â€” QR code generation, VPA copy, and webhook simulation for paid tracks
- **Auth & Persistence** â€” email/password + Google OAuth (Supabase), localStorage fallback
- **Student Dashboard** â€” enrolled tracks, mastery progress, certificate library
- **SEO Ready** â€” per-page metadata, Open Graph, Twitter cards, sitemap.xml, robots.txt
- **Error Boundary** â€” graceful error recovery instead of raw 500 pages

## ðŸ“ Project Structure

```
eduvoxpro/
â”œâ”€â”€ package.json
â”œâ”€â”€ tsconfig.json
â”œâ”€â”€ tailwind.config.ts
â”œâ”€â”€ postcss.config.mjs
â”œâ”€â”€ next.config.mjs
â”œâ”€â”€ .env.local
â”œâ”€â”€ README.md
â”œâ”€â”€ data/
â”‚   â””â”€â”€ curriculum.ts           # Track & module definitions, 44 modules, 5 MCQs each
â”œâ”€â”€ lib/
â”‚   â”œâ”€â”€ utils.ts                # cn helper, INR formatter, verification ID generator
â”‚   â”œâ”€â”€ supabase.ts             # Supabase client + SupabaseUser interface
â”‚   â””â”€â”€ upi.ts                  # UPI deep link, QR generator, webhook simulator
â”œâ”€â”€ context/
â”‚   â””â”€â”€ AppContext.tsx          # Global React Context + localStorage persistence
â”œâ”€â”€ components/
â”‚   â”œâ”€â”€ Navbar.tsx              # Sticky navigation (Home, Dashboard when logged in, About, Courses, Contact)
â”‚   â”œâ”€â”€ Footer.tsx              # Technical footer with architecture notes
â”‚   â”œâ”€â”€ AuthModal.tsx           # Sign In / Sign Up modal with Supabase hooks & Google OAuth
â”‚   â”œâ”€â”€ CheckoutModal.tsx       # Direct UPI modal with dynamic QR code & Webhook simulator
â”‚   â”œâ”€â”€ TrackCard.tsx           # Certification track card with role badge, hours, modules & pricing
â”‚   â”œâ”€â”€ CodeBlock.tsx           # Syntax styled code viewer with line numbers & 1-click copy
â”‚   â”œâ”€â”€ Callout.tsx             # Pro-tip, Warning, Architecture note callout boxes
â”‚   â”œâ”€â”€ ArchitectureDiagram.tsx # Responsive diagram viewer (agent-loop, rag-pipeline, microservices, llm-orchestrator)
â”‚   â””â”€â”€ QuizModule.tsx          # Embedded MCQ quiz with 80% progression lock & certificate trigger
â”œâ”€â”€ app/
â”‚   â”œâ”€â”€ layout.tsx              # Root layout with AppContextProvider, Navbar, Footer, modals
â”‚   â”œâ”€â”€ metadata.ts             # Homepage SEO metadata
â”‚   â”œâ”€â”€ page.tsx                # Landing page with hero, stats, catalog preview
â”‚   â”œâ”€â”€ error.tsx               # Global error boundary (replaces raw 500 pages)
â”‚   â”œâ”€â”€ sitemap.ts              # Auto-generated sitemap.xml
â”‚   â”œâ”€â”€ robots.ts               # Auto-generated robots.txt
â”‚   â”œâ”€â”€ about/
â”‚   â”‚   â”œâ”€â”€ page.tsx            # About page: mission, stats, free tracks
â”‚   â”‚   â””â”€â”€ metadata.ts         # About page SEO
â”‚   â”œâ”€â”€ courses/
â”‚   â”‚   â”œâ”€â”€ page.tsx            # Course catalog with All/Free/Paid filters
â”‚   â”‚   â””â”€â”€ metadata.ts         # Courses page SEO
â”‚   â”œâ”€â”€ contact/
â”‚   â”‚   â”œâ”€â”€ page.tsx            # Contact page with form, FAQ, social links
â”‚   â”‚   â””â”€â”€ metadata.ts         # Contact page SEO
â”‚   â”œâ”€â”€ login/
â”‚   â”‚   â”œâ”€â”€ page.tsx            # Dedicated Login page
â”‚   â”‚   â””â”€â”€ metadata.ts         # Login page SEO (noindex)
â”‚   â”œâ”€â”€ signup/
â”‚   â”‚   â”œâ”€â”€ page.tsx            # Dedicated Sign-Up page
â”‚   â”‚   â””â”€â”€ metadata.ts         # Signup page SEO (noindex)
â”‚   â”œâ”€â”€ dashboard/
â”‚   â”‚   â”œâ”€â”€ page.tsx            # Student Dashboard (tracks + certificates tabs)
â”‚   â”‚   â””â”€â”€ metadata.ts         # Dashboard page SEO (noindex)
â”‚   â”œâ”€â”€ learn/[trackId]/
â”‚   â”‚   â”œâ”€â”€ page.tsx            # Interactive Learning Workspace with sidebar curriculum tree
â”‚   â”‚   â””â”€â”€ generateMetadata.ts # Per-track dynamic SEO
â”‚   â””â”€â”€ certificate/[certificateId]/
â”‚       â”œâ”€â”€ page.tsx            # Print-ready landscape certificate template
â”‚       â””â”€â”€ generateMetadata.ts # Per-certificate dynamic SEO
â””â”€â”€ globals.css                 # Tailwind directives, custom scrollbars, @media print rules
```

## ðŸƒ Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint
```

## ðŸ› ï¸ Production Integration

### 1. Connecting Supabase

`lib/supabase.ts` already contains a Supabase client stub configured with `.env.local` credentials.

1. Update `.env.local` with your Supabase project credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

2. Apply the schema in `supabase/schema.sql` to your Supabase project â€” it creates:
   - `profiles`, `tracks`, `modules`, `lessons`, `quizzes`, `questions`
   - `enrollments`, `user_progress`, `certificates`
   - Row Level Security (RLS) policies on all tables
   - Auto-profile trigger on `auth.users` signup

3. `context/AppContext.tsx` already calls Supabase auth (`getSession`, `onAuthStateChange`, `signInWithPassword`, `signUp`, `signInWithOAuth`) with localStorage fallback when Supabase is unavailable.

### 2. Connecting UPI Webhook

`lib/upi.ts` generates UPI deep links and QR codes. `components/CheckoutModal.tsx` simulates webhook verification.

To connect a real payment gateway (Razorpay / Cashfree / PhonePe / Decentro):

1. Update `lib/upi.ts` â€” `DEFAULT_UPI_CONFIG.merchantVpa` to your verified Merchant VPA.
2. Create `app/api/webhooks/upi/route.ts` to validate HMAC signatures:
   ```ts
   import crypto from 'crypto';
   const expectedSignature = crypto
     .createHmac('sha256', process.env.PAYMENT_WEBHOOK_SECRET!)
     .update(body)
     .digest('hex');
   ```
3. On `event.status === 'PAYMENT_SUCCESS'`, insert an enrollment into Supabase and call `enrollTrack()`.

## ðŸŽ¨ Color System (60-30-10)

- **60% Dominant:** `bg-background` (#F8FAFC) â€” light canvas
- **30% Secondary:** `text-slate-900` headings, `text-slate-600` body, white surface cards
- **10% Accent:** indigo (#4F46E5), cyan (#0284C7), emerald (#059669) â€” CTAs, links, badges

## ðŸ“± Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page: hero, stats, track catalog preview, how it works |
| `/about` | Mission, philosophy, team, free track spotlight |
| `/courses` | Full track catalog with All / Free / Paid filters |
| `/contact` | Contact form, FAQ, support info, social links |
| `/login` | Email/password + Google OAuth sign in |
| `/signup` | Account creation with full name for certificate |
| `/dashboard` | Student dashboard: enrolled tracks, progress, certificates |
| `/learn/[trackId]` | Interactive learning workspace: modules, quizzes, progression |
| `/certificate/[certificateId]` | Print-ready verifiable certificate |

## ðŸ” Authentication Flow

- Email/password via Supabase Auth (`signInWithPassword`, `signUp`)
- Google OAuth via Supabase (`signInWithOAuth`)
- Session persistence via `localStorage` + Supabase `autoRefreshToken`
- `useApp()` hook provides `user`, `login`, `signup`, `logout`, `loginWithGoogle`
- Dashboard, certificates, and enrollment require authentication

## ðŸ“Š Data Model

- **Tracks** â€” id, slug, title, roleBadge, difficulty, priceINR, isFree, modulesCount, skillsCovered
- **Modules** â€” id, trackId, orderIndex, title, summary, contentSections, quiz (5 questions)
- **Enrollments** â€” userId, trackId, status, paymentReference, amountPaidINR
- **UserProgress** â€” completedModuleIds, unlockedModuleIds, quizScores, lastActiveModuleId
- **Certificates** â€” verificationId, trackId, studentName, trackTitle, scoreAverage, skillsCertified

All data persists to `localStorage` by default and syncs to Supabase when connected.

## ðŸ§ª Testing Checklist

- [ ] Homepage loads with hero, stats, and catalog
- [ ] `/courses` filter buttons (All/Free/Paid) work correctly
- [ ] Free track enrollment is instant (no payment)
- [ ] Paid track opens UPI Checkout modal with QR code
- [ ] Quiz 80% gate unlocks next module
- [ ] Certificate generates after completing all modules
- [ ] Print certificate via browser print dialog
- [ ] Login/signup persists session across refresh
- [ ] Dashboard shows enrolled tracks and certificates
- [ ] Error boundary catches unexpected errors gracefully

## ðŸ›¡ï¸ License

MIT License
