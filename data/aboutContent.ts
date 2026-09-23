export const ABOUT_MARKDOWN = `# Kampot Tech Hub (KTH) — Technical Architecture & Overview

> **The Unified Digital Ecosystem and Service Platform for Krong Kampot, Cambodia**  
> *Empowering local commerce, tech talent, expat logistics, and travelers through modern web technologies, Google Maps Platform, and Google Workspace integrations.*

---

## 1. What the Application Is

**Kampot Tech Hub (KTH)** is an integrated digital marketplace and operational portal designed specifically for the unique ecosystem of **Krong Kampot, Cambodia**. 

Kampot is home to a burgeoning international community of digital nomads, remote engineers, entrepreneurs, expatriates, and travelers alongside local Cambodian businesses and service providers. Kampot Tech Hub bridges the gap between digital services and physical infrastructure by providing a centralized, verified platform where users can discover, inspect, book, locate, and communicate regarding essential services in the region.

### Core Service Domains
1. **🛵 Motorbike Rentals & Sales:** Fleet discovery, scooter bookings, dirt bikes, and tour setups with real-time condition ratings, daily rates, and deposit terms.
2. **💻 Tech Solutions & Web Engineering:** Full-stack web application development, POS & cashless QR payment gateways (Bakong / KHQR integrations), IT infrastructure, and cloud networking.
3. **📱 Mobile App & UI/UX Design:** High-fidelity iOS/Android Figma prototyping, digital design systems, and responsive product interfaces tailored for Southeast Asian and international markets.
4. **🛂 Cambodian Visa Services:** Expat visa extension processing (Ordinary E-class, Tourist T-class, Business EB, Retirement ER), passport logistics, work permit assistance, and official requirement checklists.

---

## 2. What It Does

Kampot Tech Hub provides a seamless end-to-end user journey from search to confirmed booking and direct communication:

- **Verified Service Catalog & Galleries:** High-resolution multi-angle photography, pricing models (hourly, daily, project-based), specifications, and service status tracking (Active, Inactive, Pending).
- **Interactive Google Maps Geolocation:** Complete cartographic view of Kampot Province displaying precise service locations, partner depots, repair garages, creative studios, and riverside desks.
- **Turn-by-Turn Directions:** 1-click external navigation handoff to Google Maps for exact routes from the user's current location to any provider depot.
- **Direct Google Workspace Gmail Dispatch:** Authenticated users can transmit direct, formalized booking and inquiry emails straight from their personal Gmail account to service partners using the Google Gmail API.
- **Integrated Inquiries & Quotes Inbox:** Real-time inquiry log, custom Request-for-Quote (RFQ) workflows, and communication tracking.
- **Role-Based Access Control (RBAC):** Distinct workflows for **Customers** (exploring and requesting services), **Partners** (managing listings, answering quote requests), and **Admins** (system oversight, listings moderation, user management).

---

## 3. How It Does It (Technical Architecture)

Kampot Tech Hub is engineered as a modern, high-performance Single Page Application (SPA) leveraging decoupled cloud services and privacy-first client-side architectures.

### Architectural Diagram
\`\`\`
+-------------------------------------------------------------------------------+
|                             Kampot Tech Hub Client                            |
|                 (React 19 + TypeScript + Vite + Tailwind CSS)                 |
+------------------------------------+------------------------------------------+
                                     |
             +-----------------------+-----------------------+
             |                                               |
             v                                               v
+--------------------------+                     +---------------------------+
| Google Workspace API     |                     | Google Maps Platform      |
| - OAuth 2.0 Auth Flow    |                     | - @vis.gl/react-google-maps|
| - Gmail API (v1 REST)    |                     | - AdvancedMarker & Pin    |
| - Base64 RFC 822 Mails   |                     | - Custom Infowindows      |
| - In-Memory Token Store  |                     | - Directions & Geocoding  |
+--------------------------+                     +---------------------------+
             |                                               |
             +-----------------------+-----------------------+
                                     |
                                     v
                 +---------------------------------------+
                 |       Client Persistence Layer        |
                 |     IndexedDB (KampotTechHubDB)       |
                 | - USERS (Customers, Partners, Admins) |
                 | - LISTINGS (Multi-category Catalog)   |
                 | - INQUIRIES & BOOKINGS (Audit Trail)  |
                 +---------------------------------------+
\`\`\`

### 3.1. Frontend Core & User Interface
- **Framework:** React 19 with functional components, React Hooks (\`useMemo\`, \`useCallback\`, \`useContext\`), and React Router v7.
- **Compilation & Bundling:** Vite 6 with TypeScript 5.8 for near-instant hot-module replacement and optimized tree-shaken production bundles.
- **Styling Constitutions:** Tailwind CSS using an Earthy Coastal Kampot color palette (\`#004D40\` Deep Emerald Teal, \`#FFC107\` Amber Gold, and neutral slates).
- **Zero-Pill Typography:** Clean semantic hierarchy, accessible color contrasts, and responsive grid layouts designed for mobile smartphones, tablets, and desktop workstations.

### 3.2. Google Maps Platform Integration
- **SDK:** \`@vis.gl/react-google-maps\` providing modern React abstractions for the Maps JavaScript API.
- **Attribution & Usage Compliance:** In compliance with Google Maps Platform guidelines, all map instances and controllers transmit the mandatory \`internalUsageAttributionIds: ['gmp_mcp_codeassist_v1_aistudio']\`.
- **Advanced Markers & Interactive Pinning:** Custom color-coded \`Pin\` components representing distinct service sectors:
  - 🟠 **Motorbikes:** Warm Ochre Pin (\`#E65100\`)
  - 🟢 **Tech Solutions:** Emerald Teal Pin (\`#004D40\`)
  - 🔵 **Mobile Apps:** Sky Blue Pin (\`#0288D1\`)
  - 🟣 **Visa Extensions:** Royal Purple Pin (\`#6A1B9A\`)
- **Map Controllers & Pan-to Interactions:** Real-time dynamic smooth panning when selecting listings from the sidebar directory or navigating from a detail page.
- **Direct Navigation Links:** Automatically generated \`https://www.google.com/maps/dir/?api=1&destination={lat},{lng}\` navigation triggers for travelers on scooters or foot.

### 3.3. Google Workspace Gmail Integration
- **Authentication & Security:** Utilizes Firebase Google Auth Provider with OAuth 2.0 PKCE.
- **Requested Scopes:**
  - \`https://www.googleapis.com/auth/gmail.send\`
  - \`https://www.googleapis.com/auth/gmail.readonly\`
- **Zero-Exposure In-Memory Token Discipline:** Following strict OAuth security guidelines, OAuth access tokens are **never stored in \`localStorage\` or \`sessionStorage\`**. Tokens reside solely in transient runtime memory with active subscription listeners.
- **RFC 822 Email Encoding:** Inquiry messages are formatted as compliant RFC 822 MIME multi-part messages with UTF-8 base64url encoding (\`btoa\` safe variant) and dispatched directly via \`POST https://gmail.googleapis.com/gmail/v1/users/me/messages/send\`.
- **Inquiry Audit Trail:** Sent messages are logged in the user's authentic Gmail Sent folder and surfaced inside the Kampot Tech Hub Gmail Inquiries dashboard.

### 3.4. High-Reliability Local Database Layer
- **IndexedDB Engine (\`KampotTechHubDB\`):** Version-migrated client database supporting high-throughput transactions across three core object stores:
  - \`STORES.USERS\`: Account records, roles, authentication hashes, and profile metadata.
  - \`STORES.LISTINGS\`: Rich service catalogs with specs, pricing tiers, coordinates, and photo galleries.
  - \`STORES.INQUIRIES\`: Inquiry timestamps, booking dates, custom messages, and status lifecycles.
- **Instant Offline Availability:** Fast initial payload caching allowing instant boot and fluid interaction even under erratic cellular connectivity along the Kampot riverside.

---

## 4. Key Workflows & User Flows

\`\`\`
[ Visitor / Customer ]
       │
       ├─► 1. Browse Listings / Filter by Category (Motorbike, Tech, Visa, Apps)
       │
       ├─► 2. Launch Kampot Interactive Map ──► Inspect nearby pins & landmarks
       │
       ├─► 3. Open Listing Details ──────────► View specs & photo galleries
       │
       ├─► 4. Direct Inquiry or RFQ ────────► Dispatched to Provider via Gmail API
       │
       └─► 5. One-Click Navigation ──────────► Google Maps Turn-by-Turn Route
\`\`\`

---

## 5. Security, Privacy & Data Handling

- **OAuth Scope Minimization:** Only requested Google Workspace Gmail send/read permissions are solicited after explicit user confirmation.
- **No Secret Leakage:** No private API keys or client secrets are exposed to the client. Public Maps tokens are restricted to allowed hostnames.
- **Sanitized Outputs:** All dynamic email payloads, inquiries, and user inputs are strictly validated before submission.

---

## 6. Summary

**Kampot Tech Hub** unites modern React engineering, Google Maps spatial intelligence, and Google Workspace cloud communications into a single, cohesive portal. It serves as both a high-utility everyday tool for residents of Kampot and an exemplary demonstration of production-grade Google Cloud & Workspace API integration.
`;
