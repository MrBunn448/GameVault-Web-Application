# GameVault Web Application

**Project:** GameVault (Semester 3 Full-Stack Individual Project)  
**Primary Learning Outcome:** LO1 (Full-Stack Application Development)  
**Secondary Learning Outcome:** LO2 (Agile Development) & LO3 (Process Automation)  
**Version:** 1.0 (Sprint 1 – PR1 Interface)

---

## 1. Overview

The **GameVault Web Application** is the client-side Single Page Application (SPA) for the GameVault ecosystem. Built with **React** and bundled using **Vite**, it provides a responsive user interface to manage personal game collections, track playthrough statuses, log playtime hours, and record ratings.

This frontend interfaces directly with the Spring Boot REST API (`GameVaultAPI`) via standard HTTP/JSON requests.

---

## 2. Implemented Capabilities (Sprint 1 Scope)

This initial release addresses the core user stories defined for Portfolio Review 1:

* **[US-10] View Personal Game Library:**
  * Displays tracked games with real-time status badges (`PLAYING`, `COMPLETED`, `BACKLOG`, `DROPPED`).
  * Displays personal ratings (`1–10` scale), playtime (hours), and playthrough dates.
  * Provides quick dashboard summary statistics (total titles, count per status, accumulated playtime, average rating).
  * Supports client-side filtering by status and instant title search.
  * Supports sorting by recently added, alphabetical title, rating, or playtime.

* **[US-09] Add Game to Library:**
  * Interactive modal dialog with field validation ensuring required fields (`title`, `status`) and constraints (`rating 1-10`, non-negative playtime).
  * Communicates via `POST /api/library`, reactively updating the library view upon HTTP 201 response without full-page reloads.

* **[US-11] Remove Game from Library:**
  * Confirmation-guarded deletion action dispatching `DELETE /api/library/{id}`.

* **Resilient Connection Handling:**
  * Live API status indicator in the navbar (`API Online` / `API Offline`).
  * Graceful fallback banner with retry action if the backend service is offline.

---

## 3. Technology Stack

* **Framework:** React 19
* **Build Tool:** Vite
* **Language:** Modern JavaScript (ES Modules)
* **Code Quality & Linter:** Oxlint
* **Styling:** Modular CSS3 with custom properties and dark-theme gaming aesthetics

---

## 4. Development Setup

### Prerequisites
* Node.js (v20+ recommended, tested on Node v24.13.0)
* npm (v10+)
* GameVault Spring Boot API running on `http://localhost:8080`

### Installation & Run

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```
   The application will start at `http://localhost:5173`.  
   Requests to `/api` are automatically proxied to the backend at `http://localhost:8080`.

3. **Build for Production:**
   ```bash
   npm run build
   ```

4. **Lint Codebase:**
   ```bash
   npm run lint
   ```

---

## 5. Branching & Git Strategy

In alignment with the project's [Git & Branching Strategy](https://github.com/MrBunn448/GameVault), development follows **GitHub Flow**:
* Active development branch: `feat/library-ui-skeleton`
* Base branch: `main`
* Traceability: Linked to issues `[US-10]` and `[US-09]`
