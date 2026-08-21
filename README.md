# SmartQueue

A priority-based queue management system for hospitals, government offices, banks, universities, and other public service centers.

SmartQueue improves traditional token systems by dynamically prioritizing users according to urgency, special requirements, and waiting time.

## Problem

Traditional queue systems usually serve users only according to arrival time. This can create long waiting times, inefficient counter utilization, and poor user experience.

SmartQueue provides a digital queue where users can:

- Select a required service.
- Receive a digital token.
- Specify urgency and special-category requirements.
- Track their queue status.
- Cancel their token.

Administrators and staff can later:

- Monitor active queues.
- Call the next user.
- Assign users to counters.
- Start and complete services.
- View queue events and statistics.

## Main Features

### Current MVP

- Supabase email authentication.
- User profiles and role management.
- Service selection.
- Digital token generation.
- Priority-based queue joining.
- Urgency selection from 1 to 5.
- Special-category selection from 0 to 5.
- Queue-entry status tracking.
- Queue-event history.
- PostgreSQL functions for queue operations.
- Row Level Security policies.

### Planned Features

- Admin dashboard.
- Staff dashboard.
- Call-next-user functionality.
- Start and complete service actions.
- Queue cancellation.
- Real-time queue updates.
- Estimated waiting time.
- QR-code check-in.
- Email, SMS, or browser notifications.
- Queue analytics and reports.
- Counter-service compatibility.

## Priority Logic

The current system uses a rule-based priority score:

```text
Priority score = (urgency × 40)
               + (special category × 20)
               + (waiting time in minutes × 2)
```

Waiting time increases the score continuously. This prevents users with low initial priority from waiting indefinitely.

The queue is ordered using:

1. Highest priority score.
2. Earliest arrival time when scores are equal.

This approach provides both prioritization and fairness.

## Technology Stack

- Frontend: React and Vite.
- Database: PostgreSQL through Supabase.
- Authentication: Supabase Auth.
- API access: Supabase JavaScript client and PostgreSQL RPC functions.
- Realtime updates: Supabase Realtime, planned.
- Styling: CSS.
- Development environment: VS Code.

## Project Structure

```text
smartqueue-frontend/
├── .env
├── .gitignore
├── index.html
├── package.json
├── public/
└── src/
    ├── App.jsx
    ├── App.css
    ├── main.jsx
    └── lib/
        └── supabase.js
```

## Supabase Database Structure

The database contains the following main tables:

### `profiles`

Stores application user information.

- `id`
- `full_name`
- `phone`
- `role`
- `created_at`

Roles currently include:

- `user`
- `staff`
- `admin`

### `services`

Stores the services available at the center.

- `id`
- `name`
- `description`
- `average_duration_minutes`
- `priority_enabled`
- `is_active`
- `created_at`

### `counters`

Stores service counters and their availability.

- `id`
- `counter_name`
- `staff_id`
- `status`
- `supported_services`
- `created_at`

### `queue_entries`

Stores individual tokens and their current state.

- `id`
- `user_id`
- `service_id`
- `token_number`
- `queue_date`
- `urgency`
- `special_category`
- `arrival_time`
- `called_at`
- `service_started_at`
- `completed_at`
- `status`
- `priority_score`
- `estimated_wait_minutes`
- `assigned_counter_id`
- `notes`
- `created_at`

Possible queue statuses are:

- `waiting`
- `called`
- `serving`
- `completed`
- `cancelled`
- `skipped`
- `no_show`

### `queue_events`

Stores the history of actions performed on queue entries.

Possible events include:

- `joined`
- `called`
- `service_started`
- `service_completed`
- `cancelled`
- `skipped`
- `marked_no_show`
- `priority_updated`

## Prerequisites

Install the following software:

- Node.js LTS.
- npm.
- VS Code.
- A Supabase account.

Check Node.js and npm installation:

```bash
node --version
npm --version
```

## Installation

### 1. Clone or create the project

```bash
git clone <your-repository-url>
cd smartqueue-frontend
```

If you are creating the project from scratch:

```bash
npm create vite@latest smartqueue-frontend
cd smartqueue-frontend
npm install
```

Select the following options when prompted:

```text
Framework: React
Variant: JavaScript
```

### 2. Install dependencies

```bash
npm install @supabase/supabase-js
```

### 3. Create a Supabase project

1. Open the Supabase dashboard.
2. Create a new project.
3. Use a project name such as `smartqueue`.
4. Create and securely save the PostgreSQL database password.
5. Select the region closest to your users.
6. Enable the Data API.
7. Enable automatic RLS if desired.

The PostgreSQL database password is created by you during project creation. It is not your Gmail password and is not required in frontend code.

### 4. Configure the database

Open:

```text
Supabase Dashboard → SQL Editor → New query
```

Run the SmartQueue database schema SQL. The schema should create:

- Custom enum types.
- `profiles`.
- `services`.
- `counters`.
- `queue_entries`.
- `queue_events`.
- Indexes.
- Queue-management functions.
- Row Level Security policies.

Insert sample services after creating the tables:

```sql
insert into public.services
  (name, description, average_duration_minutes)
values
  ('General Enquiry', 'General information and assistance', 5),
  ('Document Verification', 'Verification of official documents', 15),
  ('Fee Payment', 'Payment of fees and charges', 7),
  ('Complaint Resolution', 'Submit or resolve a complaint', 20);
```

### 5. Configure authentication

In the Supabase dashboard:

```text
Authentication → Providers → Email
```

Enable email authentication.

For development, email confirmation may be disabled so that users can log in immediately after signup. For a production deployment, email confirmation should be enabled.

### 6. Create the environment file

Create `.env` in the project root, next to `package.json`:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Get these values from:

```text
Supabase Dashboard → Project Settings → API
```

Do not add the database password to this file for the frontend.

### 7. Create the Supabase client

Create:

```text
src/lib/supabase.js
```

Add:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
)
```

## Running the Application

Start the development server:

```bash
npm run dev
```

Open the local URL shown in the terminal. It is normally:

```text
http://localhost:5173
```

Build the application for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Basic User Flow

1. Open the application.
2. Enter an email and password.
3. Click **Sign up**.
4. Confirm the email if confirmation is enabled.
5. Log in.
6. Select a service.
7. Set urgency and special-category values.
8. Click **Get token**.
9. View the generated token and priority score.
10. Verify the new entry in the `queue_entries` table.

## Important Supabase Functions

### Join the queue

```javascript
const { data, error } = await supabase.rpc('join_queue', {
  p_service_id: selectedService,
  p_urgency: Number(urgency),
  p_special_category: Number(specialCategory)
})
```

### Get the next queue entry

```javascript
const { data, error } = await supabase.rpc(
  'get_next_queue_entry',
  {
    p_service_id: null
  }
)
```

### Cancel a queue entry

```javascript
const { data, error } = await supabase.rpc(
  'cancel_queue_entry',
  {
    p_queue_entry_id: queueEntryId
  }
)
```

## Security Notes

- Never expose the PostgreSQL database password in frontend code.
- Never expose the Supabase secret or service-role key in frontend code.
- Keep `.env` out of GitHub.
- Enable Row Level Security on exposed tables.
- Do not allow users to directly modify `priority_score`.
- Use PostgreSQL functions for queue operations.
- Restrict staff and admin operations using roles and RLS policies.
- Store queue actions in `queue_events` for auditing.

Add this to `.gitignore`:

```gitignore
node_modules/
dist/
.env
.env.local
```

## Troubleshooting

### Services are not visible

Check that services exist and are active:

```sql
select *
from public.services
where is_active = true;
```

Also verify that an authenticated-user SELECT policy exists on `services`.

### Signup works but login fails

Check the Email provider settings in Supabase Authentication. If email confirmation is enabled, confirm the email before logging in.

### Queue joining gives an authentication error

Make sure the user is logged in before calling `join_queue`. The function uses the authenticated user ID.

### Profile was not created

Check the `profiles` table after signup. If no profile exists, verify that the `on_auth_user_created` trigger was created successfully.

### Environment variables do not work

Confirm that:

- The file is named `.env`.
- It is in the project root.
- Variables begin with `VITE_`.
- The development server was restarted after editing `.env`.

## Roadmap

### Phase 1: MVP

- Authentication.
- Service listing.
- Token generation.
- Priority calculation.
- User queue status.

### Phase 2: Administration

- Admin dashboard.
- Staff management.
- Counter management.
- Call next user.
- Skip and mark no-show.
- Start and complete service.

### Phase 3: Real-time and analytics

- Supabase Realtime subscriptions.
- Live token updates.
- Estimated waiting time.
- Average service duration.
- Queue abandonment rate.
- Daily and weekly reports.

### Phase 4: Advanced optimization

- Counter-service compatibility.
- Demand forecasting.
- Staff workload recommendations.
- Machine-learning service-time prediction.
- SMS, email, or WhatsApp notifications.

## Expected Impact

SmartQueue aims to:

- Reduce average waiting time.
- Improve service-counter utilization.
- Provide transparent queue status.
- Prioritize urgent cases responsibly.
- Prevent starvation through waiting-time aging.
- Improve the experience for users and administrators.

## License

This project is currently intended for educational and hackathon purposes. Add an appropriate open-source license before public distribution.
