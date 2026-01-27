# AICTE Activity Points Report Generator

A tool for generating AICTE Activity Points forms for RVCE students

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/CubeStar1/aicte-activity-points.git
   ```

2. **Setup Services**

   - Create a project on [Supabase](https://supabase.com)
   - Create an account on [Resend](https://resend.com) for email services

3. **Run Database Migration**

   Copy the contents of `lib/supabase/migrations/schema.sql` and run it in the Supabase SQL Editor to set up the database schema and storage buckets.

4. **Setup Environment Variables**

   Copy the example environment file to `.env.local` and configure the keys using credentials from Supabase and Resend:

   ```bash
   cp env.example .env.local
   ```

5. **Install dependencies**

   ```bash
   npm install
   ```

6. **Run the development server**

   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) with your browser.
