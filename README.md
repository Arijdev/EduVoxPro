# EduVoxPro — Role-Based Tech Certification Platform

EduVoxPro is a production-grade, text-first technical certification and learning platform designed for software engineers, architects, and AI practitioners. It features high-density documentation, interactive architectural diagrams, copyable code blocks, 80% MCQ progression gates, direct UPI payment workflows, and cryptographically verifiable print-ready certificates.

## ✨ Key Features

- **5 Certification Tracks** — 2 completely free (Web Foundations, AI Prompt Engineering & Ethics) + 3 paid (Agentic AI Developer, Generative AI Specialist, Modern Full-Stack Architect)
- **7–10 Modules per Track** — deep documentation, code architectures, and architectural diagrams
- **80% MCQ Progression Gate** — 5 questions per module; score â‰¥80% to unlock the next chapter
- **Verifiable Certificates** — print-ready diplomas with unique Verification ID and QR code
- **Direct UPI Checkout** — QR code generation, VPA copy, and webhook simulation for paid tracks
- **Auth & Persistence** — email/password + Google OAuth (Supabase), localStorage fallback
- **Student Dashboard** — enrolled tracks, mastery progress, certificate library
- **SEO Ready** — per-page metadata, Open Graph, Twitter cards, sitemap.xml, robots.txt
- **Error Boundary** — graceful error recovery instead of raw 500 pages

## ðŸ“ Project Structure

```
eduvoxpro/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── next.config.mjs
├── .env.local
├── README.md
├── data/
│   └── curriculum.ts           # Track & module definitions, 44 modules, 5 MCQs each
├── lib/
│   ├── utils.ts                # cn helper, INR formatter, verification ID generator
│   ├── supabase.ts             # Supabase client + SupabaseUser interface
│   └── upi.ts                  # UPI deep link, QR generator, webhook simulator
├── context/
│   └── AppContext.tsx          # Global React Context + localStorage persistence
├── components/
│   ├── Navbar.tsx              # Sticky navigation (Home, Dashboard when logged in, About, Courses, Contact)
│   ├── Footer.tsx              # Technical footer with architecture notes
│   ├── AuthModal.tsx           # Sign In / Sign Up modal with Supabase hooks & Google OAuth
│   ├── CheckoutModal.tsx       # Direct UPI modal with dynamic QR code & Webhook simulator
│   ├── TrackCard.tsx           # Certification track card with role badge, hours, modules & pricing
│   ├── CodeBlock.tsx           # Syntax styled code viewer with line numbers & 1-click copy
│   ├── Callout.tsx             # Pro-tip, Warning, Architecture note callout boxes
│   ├── ArchitectureDiagram.tsx # Responsive diagram viewer (agent-loop, rag-pipeline, microservices, llm-orchestrator)
│   └── QuizModule.tsx          # Embedded MCQ quiz with 80% progression lock & certificate trigger
├── app/
│   ├── layout.tsx              # Root layout with AppContextProvider, Navbar, Footer, modals
│   ├── metadata.ts             # Homepage SEO metadata
│   ├── page.tsx                # Landing page with hero, stats, catalog preview
│   ├── error.tsx               # Global error boundary (replaces raw 500 pages)
│   ├── sitemap.ts              # Auto-generated sitemap.xml
│   ├── robots.ts               # Auto-generated robots.txt
│   ├── about/
│   │   ├── page.tsx            # About page: mission, stats, free tracks
│   │   └── metadata.ts         # About page SEO
│   ├── courses/
│   │   ├── page.tsx            # Course catalog with All/Free/Paid filters
│   │   └── metadata.ts         # Courses page SEO
│   ├── contact/
│   │   ├── page.tsx            # Contact page with form, FAQ, social links
│   │   └── metadata.ts         # Contact page SEO
│   ├── login/
│   │   ├── page.tsx            # Dedicated Login page
│   │   └── metadata.ts         # Login page SEO (noindex)
│   ├── signup/
│   │   ├── page.tsx            # Dedicated Sign-Up page
│   │   └── metadata.ts         # Signup page SEO (noindex)
│   ├── dashboard/
│   │   ├── page.tsx            # Student Dashboard (tracks + certificates tabs)
│   │   └── metadata.ts         # Dashboard page SEO (noindex)
│   ├── learn/[trackId]/
│   │   ├── page.tsx            # Interactive Learning Workspace with sidebar curriculum tree
│   │   └── generateMetadata.ts # Per-track dynamic SEO
│   └── certificate/[certificateId]/
│       ├── page.tsx            # Print-ready landscape certificate template
│       └── generateMetadata.ts # Per-certificate dynamic SEO
└── globals.css                 # Tailwind directives, custom scrollbars, @media print rules
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

2. Apply the schema in `supabase/schema.sql` to your Supabase project — it creates:
   - `profiles`, `tracks`, `modules`, `lessons`, `quizzes`, `questions`
   - `enrollments`, `user_progress`, `certificates`
   - Row Level Security (RLS) policies on all tables
   - Auto-profile trigger on `auth.users` signup

3. `context/AppContext.tsx` already calls Supabase auth (`getSession`, `onAuthStateChange`, `signInWithPassword`, `signUp`, `signInWithOAuth`) with localStorage fallback when Supabase is unavailable.

### 2. Connecting UPI Webhook

`lib/upi.ts` generates UPI deep links and QR codes. `components/CheckoutModal.tsx` simulates webhook verification.

To connect a real payment gateway (Razorpay / Cashfree / PhonePe / Decentro):

1. Update `lib/upi.ts` — `DEFAULT_UPI_CONFIG.merchantVpa` to your verified Merchant VPA.
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

- **60% Dominant:** `bg-background` (#F8FAFC) — light canvas
- **30% Secondary:** `text-slate-900` headings, `text-slate-600` body, white surface cards
- **10% Accent:** indigo (#4F46E5), cyan (#0284C7), emerald (#059669) — CTAs, links, badges

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

- **Tracks** — id, slug, title, roleBadge, difficulty, priceINR, isFree, modulesCount, skillsCovered
- **Modules** — id, trackId, orderIndex, title, summary, contentSections, quiz (5 questions)
- **Enrollments** — userId, trackId, status, paymentReference, amountPaidINR
- **UserProgress** — completedModuleIds, unlockedModuleIds, quizScores, lastActiveModuleId
- **Certificates** — verificationId, trackId, studentName, trackTitle, scoreAverage, skillsCertified

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
