I designed and implemented the complete TinyLink URL Shortener system from the ground up, covering backend engineering, database integration, API development, and an admin-facing dashboard.

🔹 Backend Engineering (Node.js + Express)

I built a secure, modular backend that includes:

.REST APIs for creating, listing, deleting, and analyzing short links

.A redirect endpoint that maps short codes to original URLs

.JSON body parsing, CORS, logging (morgan), and rate limiting

.Industry-grade security using Helmet with custom CSP

.Error handling, validation, and HTTP-status control

🔹 Database Layer (PostgreSQL + node-pg)

I implemented:

.A normalized links table with indexes for performance

.Auto-increment click tracking on every redirect

.Secure parameterized SQL queries

.Full migration script to reproduce the database anywhere

.DB connection pooling for production-readiness

🔹 Short URL Logic

I built:

.Random 6–8 character short code generator

.Collision-safe lookup

.Click tracking + timestamps (created_at, last_clicked)

.302 redirect logic

.Query indexing for faster analytics

🔹 Frontend Admin Dashboard (HTML + JS)

I developed a minimal admin UI that allows:

.Creating a new short link

.Viewing all stored links

.Copying short URLs

.Deleting links

.Opening detailed analytics page

.Updating UI instantly without page refresh (AJAX)

This dashboard consumes the API end-to-end and validates the full system.

🔹 Security Enhancements

I didn’t just build it — I hardened it:

.Helmet with CSP (configured to allow safe inline scripts)

.Rate limiting (30 req/min per IP)

.SQL injection prevention

.Safe redirects only

.Proper HTTP status management

No secrets committed (only .env.example provided)

🔹 Testing & Local Dev Setup

I validated the entire stack using:

.Curl commands for API testing

.pgAdmin for database queries

.Browser testing for redirects and dashboard actions

.Logging verification through morgan

⭐ Overall, I delivered a stable, secure, full-stack URL shortener system

The app demonstrates:

.Backend API design

.DB schema design

.Security awareness

.Frontend integration

.Debugging and logging

.Deployment readiness

.Clean code and project structure
