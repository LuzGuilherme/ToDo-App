# MVP Examples: Idea to Execution

This file contains concrete examples of transforming app ideas into shippable MVPs following Launch Planner principles.

## Example 1: Habit Tracker for Developers

### Original Idea
"A habit tracking app specifically for developers that integrates with GitHub, tracks coding streaks, has social features for accountability, gamification with achievements, and detailed analytics dashboards."

### Pre-Build Questions

**Who is this for?**
Solo developers who want to build a daily coding habit but struggle with consistency.

**What's the ONE problem it solves?**
Developers forget to code daily and lose momentum on side projects.

**How will I know if it works?**
5 users track habits for 7 consecutive days within the first week of launch.

### Scoped MVP PRD

**Core User Loop:**
1. User opens app each day
2. User clicks "I coded today"
3. User sees their current streak number

**Must Have (Week 1):**
- [ ] Single "Mark complete" button (3 hours)
- [ ] Display current streak count (2 hours)
- [ ] Show last 7 days as dots (complete/incomplete) (3 hours)
- [ ] Deploy to Vercel with public URL (1 hour)

**Total: 9 hours**

**Explicitly Excluded:**
- GitHub integration (not needed to track habit)
- Social features (can share screenshot instead)
- Achievements (doesn't validate core problem)
- Analytics dashboard (can count in database directly)
- User profiles (hardcode single user initially)
- Multiple habit types (validates with one habit first)

**Tech Implementation:**
- Single Next.js page with date picker
- Supabase table: `completions` (id, date, completed)
- No auth - just tracks one user's data initially

**Manual Workarounds:**
- User shares progress via screenshot
- Developer checks Supabase dashboard for stats
- Reset streak by deleting database rows

**Risk:**
Users might not open the app daily without notifications (test this assumption first before building notifications).

---

## Example 2: Freelancer Invoice Tool

### Original Idea
"Complete freelancer management platform with client portal, project tracking, time tracking, automated invoicing, payment processing, expense tracking, tax calculations, and reporting."

### Pre-Build Questions

**Who is this for?**
Freelance designers who manually create invoices in Google Docs every month.

**What's the ONE problem it solves?**
Creating professional invoices takes 30 minutes of reformatting each time.

**How will I know if it works?**
3 freelancers generate invoices in under 2 minutes within first week.

### Scoped MVP PRD

**Core User Loop:**
1. User enters client name, amount, and line items
2. User clicks "Generate Invoice"
3. User downloads professional PDF invoice

**Must Have (Week 1):**
- [ ] Form for invoice details (4 hours)
- [ ] Generate PDF from template (6 hours)
- [ ] Download button (1 hour)
- [ ] Deploy to Vercel (1 hour)

**Total: 12 hours**

**Explicitly Excluded:**
- Client portal (email invoice instead)
- Project tracking (not needed for invoicing)
- Time tracking (enter hours manually)
- Payment processing (validate demand first)
- Multiple invoice templates (one template is enough)
- Invoice history (validate with single-use first)
- User accounts (stateless invoice generator)

**Tech Implementation:**
- Single-page form in Next.js
- No database initially (stateless)
- Use react-pdf or puppeteer for PDF generation
- Optional: Store in Supabase only if user requests history

**Manual Workarounds:**
- User emails invoice themselves
- User tracks payments in spreadsheet
- User saves PDFs locally

**Risk:**
PDF generation might not look professional enough (get feedback on first generated invoice before building more features).

---

## Example 3: Local Restaurant Finder

### Original Idea
"Restaurant discovery app with AI-powered recommendations, user reviews, social feed, reservation system, loyalty rewards, user-generated photos, dietary filters, and integration with food delivery services."

### Pre-Build Questions

**Who is this for?**
People new to a city who don't know where to eat lunch.

**What's the ONE problem it solves?**
Finding a good restaurant near you right now is overwhelming with too many options.

**How will I know if it works?**
10 people use it to pick a lunch spot within first 3 days.

### Scoped MVP PRD

**Core User Loop:**
1. User allows location access
2. App shows 3 nearby restaurants with one-sentence descriptions
3. User taps one to see address and Google Maps link

**Must Have (Week 1):**
- [ ] Get user location (2 hours)
- [ ] Fetch 10 nearby restaurants from Google Places API (4 hours)
- [ ] Show top 3 with photo, name, rating (3 hours)
- [ ] Link to Google Maps for directions (1 hour)

**Total: 10 hours**

**Explicitly Excluded:**
- AI recommendations (show top-rated instead)
- User reviews (link to Google reviews)
- Social feed (unnecessary for MVP)
- Reservations (link to restaurant website)
- Dietary filters (show all restaurants first)
- Photos beyond API (Google Places provides photos)
- Favorites/saved lists (validate with basic search first)

**Tech Implementation:**
- Single Next.js page
- Google Places API for restaurant data
- Geolocation API for user position
- No database needed
- No auth needed

**Manual Workarounds:**
- Use Google's existing reviews instead of building review system
- Link to OpenTable/Resy instead of building reservations
- User screenshots to save favorites

**Risk:**
Google Places might not return good recommendations (test with 5 different locations before adding filtering logic).

---

## Example 4: Reading List Manager

### Original Idea
"Social reading platform with friend connections, book clubs, reading challenges, progress tracking, notes and highlights, book recommendations, reading stats, Goodreads import, and discussion forums."

### Pre-Build Questions

**Who is this for?**
People who save book recommendations but forget what's on their list.

**What's the ONE problem it solves?**
Can't remember which book to read next from my saved list.

**How will I know if it works?**
5 users add books and mark one as "currently reading" within first week.

### Scoped MVP PRD

**Core User Loop:**
1. User adds book title to list
2. User sees all their books
3. User marks one as "currently reading"

**Must Have (Week 1):**
- [ ] Add book form (title only) (2 hours)
- [ ] Display list of books (2 hours)
- [ ] Mark as "currently reading" button (2 hours)
- [ ] Show "Currently Reading" at top (1 hour)

**Total: 7 hours**

**Explicitly Excluded:**
- Friend connections (test solo use first)
- Book clubs (doesn't solve core problem)
- Progress tracking (binary reading/not reading is enough)
- Notes (can write in notes app)
- Recommendations (can Google books separately)
- Stats (manual count is fine)
- Goodreads import (users can add manually)
- Book metadata (author, cover, etc. - title is enough)

**Tech Implementation:**
- Next.js with simple form
- Supabase table: `books` (id, title, status, user_id)
- Magic link auth (Supabase built-in)

**Manual Workarounds:**
- Share list via screenshot
- Track pages manually elsewhere
- Search for book info on Goodreads

**Risk:**
Users might want book covers to feel useful (test with text-only list first before adding OpenLibrary API).

---

## Example 5: Workout Logger

### Original Idea
"Complete fitness platform with workout plans, exercise library with videos, progress photos, body measurements, nutrition tracking, workout programs, social features, and AI form analysis."

### Pre-Build Questions

**Who is this for?**
Gym-goers who forget what weight they lifted last time.

**What's the ONE problem it solves?**
Can't remember last session's weights so progress stalls.

**How will I know if it works?**
3 users log 3 workouts each in the first week.

### Scoped MVP PRD

**Core User Loop:**
1. User enters exercise name and weight/reps
2. User saves workout
3. Next time, user sees previous weight/reps for that exercise

**Must Have (Week 1):**
- [ ] Form: exercise name, weight, reps (3 hours)
- [ ] Save to database (2 hours)
- [ ] Show last logged value for each exercise (4 hours)
- [ ] List of all workouts (2 hours)

**Total: 11 hours**

**Explicitly Excluded:**
- Workout plans (users create their own)
- Exercise library (users know their exercises)
- Progress photos (use phone camera)
- Body measurements (track separately)
- Nutrition (separate concern)
- Programs (doesn't solve core problem)
- Exercise videos (YouTube exists)
- Charts/graphs (see numbers is enough)

**Tech Implementation:**
- Next.js simple form
- Supabase table: `workouts` (id, exercise, weight, reps, date)
- Magic link auth

**Manual Workarounds:**
- Search YouTube for exercise technique
- Take progress photos with phone
- Calculate volume/PRs manually

**Risk:**
Searching old exercises might be tedious (test with simple list first before adding autocomplete).

---

## Common Patterns in Good MVPs

### What These Examples Share:

1. **Single, clear problem** - Each solves exactly one pain point
2. **Linear core loop** - 3 steps or fewer to get value
3. **No authentication complexity** - Most are stateless or use magic links
4. **Under 15 hours to build** - Can be done in 1-2 days of focused work
5. **Manual workarounds** - Leverage existing tools instead of building
6. **Measurable success** - Specific user actions to track
7. **No "phase 2" features** - Ruthlessly cut anything not core

### Red Flags These Avoid:

- ❌ Building multiple user types (admin vs user)
- ❌ Social features before solo use works
- ❌ Complex onboarding or tutorials
- ❌ Integration with external services (unless core)
- ❌ Rich media (photos, videos) unless essential
- ❌ Reports and analytics dashboards
- ❌ Search and filtering (simple list first)
- ❌ Settings and configuration
