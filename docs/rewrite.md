# Explore Australia — Rewrite Plan

## Project Overview

Rewrite the existing MERN stack tour booking platform (Explore Australia) with a clear separation between consumer-facing (C-end) and admin-facing (B-end) interfaces.

---

## Confirmed Decisions

### Theme & Idea
- Keep the Explore Australia tour booking theme
- Add at least 2 new features (TBD, not blocking rewrite)

### Frontend Architecture

**User-facing (C-end) — Airbnb style**
- Homepage is public, no login required to browse tours
- Clean white backgrounds, rounded card grids, subtle shadows, clear typography hierarchy
- Reference: 6 Airbnb screenshots in `design/style/`

**Admin-facing (B-end) — Dashboard style**
- Separate layout and navigation from C-end
- Table-based, data-oriented UI
- Style reference: TBD (waiting for reference images)

### Routing Structure

```
Public (no auth required)
  /              → Homepage, browse all tours (Airbnb card grid)
  /tours/:id     → Tour detail page

User (login required)
  /book/:id      → Book a tour
  /my-trips      → My bookings
  /profile       → User profile

Admin (separate entry)
  /admin         → Admin dashboard (own layout)
  /admin/tours   → Manage tours
  /admin/orders  → View all orders
```

### Authentication Flow
- Single login page shared by user and admin
- Backend returns JWT with role, frontend reads role and redirects:
  - user → homepage
  - admin → `/admin` dashboard
- Entry points differ:
  - Users: "Sign in" button in navbar
  - Admins: "Admin Portal" link in footer
- One email = one role (no dual-role accounts)

### Rewrite Strategy
- Frontend first: restyle UI while keeping existing API call interfaces unchanged
- Backend later: refactor after CRC cards are finalized
- Keep `axiosConfig.jsx` baseURL and all request paths/params stable during frontend rewrite

### Temporary Compromises
- Tour images: single image (`imageUrl`) for now, multi-image support deferred
- Search/Filter: not adding during initial rewrite
- Database: continue using current MongoDB Atlas instance, will create a new one later

---

## Outstanding Items (TBD)

| Item | Status | Notes |
|------|--------|-------|
| 2 new features | Not decided | AI tour recommendation discussed as candidate |
| Admin style reference | Done | PandaDoc Dashboard style — dark sidebar + white main + table data |
| New database | Deferred | Will create new MongoDB Atlas instance, current one named "A1" |
| CRC cards | Not started | Backend refactor blocked on this |
| Multi-image tour support | Deferred | Single image placeholder for now |
| Search / Filter feature | Deferred | Not part of initial rewrite |
| Design diagrams fixes | Pending | BDD missing Auth block, CRUD missing Read ops, Use Case misplaced "Change customer info" |

---

## Design Diagram Issues to Fix

These must be corrected before final report submission:

1. **BDD missing Auth block** — Login/Register/JWT authentication is core infrastructure. The BDD's Business_Logic only has Package_CRUD, Booking_CRUD, and Payment — no Auth handler.

2. **CRUD handlers missing Read operations** — Package_CRUD_handler lists create/update/delete but no getPackage/getAllPackages. Same for Booking_CRUD — no readOrder.

3. **User Profile misplaced in Use Case diagram** — "Change customer info" is an `<<extend>>` of "Manage my orders", but editing profile is an independent action. It should be a standalone use case connected directly to the user.

---

## Page Mapping (Airbnb Reference → Project Pages)

| Reference Image | Target Page | Key Elements |
|-----------------|-------------|--------------|
| Airbnb_style_01 | Homepage / Tours listing | Navbar, search bar, card grid with images/prices |
| Airbnb_style_02 | Filter (deferred) | Filter modal — not implementing now |
| Airbnb_style_03 | Tour Detail | Photo display (single image for now), title, location, price, booking CTA |
| Airbnb_style_04 | Payment / Book Tour | Confirm & pay layout, trip details sidebar, price breakdown |
| Airbnb_style_05 | My Bookings | Trip cards with dates, status, destination info |
| Airbnb_style_06 | Profile | User avatar, stats, about section |
