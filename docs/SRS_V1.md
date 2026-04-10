# Software Requirements Specification (SRS)

**Project Name:** HEALTH AI Co-Creation & Innovation Platform  
**Course:** SENG 384 – Software Project III  
**Group Members:** Doğukan Ogan, Oğuz Arda Orhan  
**Submission Date:** 09/04/2026  
**Version:** 1.0  

---

## Revision History

| Date | Version | Change Description | Author |
|------|---------|-------------------|--------|
| 09/04/2026 | 1.0 | Initial version | Doğukan Ogan, Oğuz Arda Orhan |

---

## Table of Contents

1. [Introduction](#1-introduction)
   - 1.1 Purpose
   - 1.2 Scope
   - 1.3 Definitions and Abbreviations
   - 1.4 Intended Audience
2. [Overall Description](#2-overall-description)
   - 2.1 Product Perspective
   - 2.2 User Roles
   - 2.3 Assumptions and Dependencies
   - 2.4 Constraints
3. [Functional Requirements](#3-functional-requirements)
   - 3.1 User Registration & Access Control
   - 3.2 Post Management
   - 3.3 Search & Matching
   - 3.4 Meeting Request Workflow
   - 3.5 Administrative Dashboard
   - 3.6 Activity Logging & Audit Trail
4. [Non-Functional Requirements](#4-non-functional-requirements)
5. [Use Cases](#5-use-cases)
6. [Data Model](#6-data-model)
7. [Interface Requirements](#7-interface-requirements)
8. [Requirements Traceability Matrix](#8-requirements-traceability-matrix)
9. [Appendices](#9-appendices)

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) document defines the functional and non-functional requirements for the **HEALTH AI Co-Creation & Innovation Platform**. It serves as the primary reference for the development team during the design, implementation, and testing phases of the project. The document describes what the system shall do, how it shall perform, and under what constraints it operates.

### 1.2 Scope

The HEALTH AI platform is a secure, GDPR-compliant web application that enables structured partner discovery between **healthcare professionals** and **engineers**. Users can publish structured collaboration announcements, discover potential partners through filtered search, and initiate controlled meeting requests.

The platform **does not**:
- Store confidential technical documents, IP files, or patient data
- Handle financial transactions or contract management
- Provide medical advice or clinical decision support
- Record or store meeting content (meetings occur externally via Zoom/Teams)

### 1.3 Definitions and Abbreviations

| Term | Definition |
|------|-----------|
| SRS | Software Requirements Specification |
| RBAC | Role-Based Access Control |
| GDPR | General Data Protection Regulation |
| NDA | Non-Disclosure Agreement |
| WCAG | Web Content Accessibility Guidelines |
| JWT | JSON Web Token |
| FR | Functional Requirement |
| NFR | Non-Functional Requirement |
| UC | Use Case |
| API | Application Programming Interface |
| .edu | Institutional educational email domain |
| Post | A structured collaboration announcement published by a user |
| Meeting Request | A formal request to initiate a meeting with a post owner |

### 1.4 Intended Audience

- **Development Team:** Doğukan Ogan (Frontend), Oğuz Arda Orhan (Backend)
- **Course Instructor / Teaching Assistants:** SENG 384 evaluation team
- **Project Stakeholders:** Anyone reviewing the project for academic or functional evaluation

---

## 2. Overall Description

### 2.1 Product Perspective

Multidisciplinary health-tech innovation requires rapid and structured access to complementary expertise. Engineers developing healthcare technologies need clinical domain knowledge and validation pathways. Conversely, healthcare professionals with strong innovation ideas often lack the engineering competence to implement them.

Currently, such partnerships depend on personal networks or coincidence — an inefficient model that slows innovation. The HEALTH AI platform eliminates this randomness by providing:

- Structured, announcement-based partner discovery
- Secure first-contact initiation with NDA acceptance
- Controlled idea disclosure (no sensitive details in public view)
- A transparent meeting workflow with clear lifecycle states
- Comprehensive audit logging for accountability

The platform is a **user experience system** — it must feel safe, professional, simple, and trustworthy. Users must understand its purpose within 20 seconds and be able to post an announcement without confusion.

### 2.2 User Roles

| Role | Description | Key Permissions |
|------|-------------|----------------|
| **Engineer** | A technology professional seeking clinical domain expertise or healthcare collaboration | Create/edit/delete own posts, browse all posts, send meeting requests, manage own profile |
| **Healthcare Professional** | A clinician or medical researcher seeking engineering partnership | Create/edit/delete own posts, browse all posts, send meeting requests, manage own profile |
| **Admin** | Platform administrator | All of the above + manage all users, remove any post, view and export activity logs, access admin dashboard |

### 2.3 Assumptions and Dependencies

- All users possess a valid institutional `.edu` email address
- Users have access to a modern web browser (Chrome, Firefox, Safari, Edge)
- Meetings take place externally on platforms such as Zoom or Microsoft Teams; the platform only facilitates scheduling
- The platform is deployed in a cloud environment with HTTPS enforced
- Users are responsible for the accuracy of the information they post
- Email verification is required before a user can publish posts or send meeting requests

### 2.4 Constraints

- Registration is strictly limited to institutional `.edu` email addresses
- No file uploads (documents, images, patient data) are permitted
- No financial transactions or contract management are handled by the platform
- Activity logs must be retained for a maximum of 24 months (GDPR data minimization)
- No patient data of any kind may be stored on the platform
- The platform facilitates first contact only; all subsequent collaboration happens externally

---

## 3. Functional Requirements

### 3.1 User Registration & Access Control

| ID | Requirement Description | Priority | Source |
|----|------------------------|----------|--------|
| FR-01 | The system shall only allow registration with institutional `.edu` email addresses. Personal email providers (Gmail, Yahoo, etc.) must be rejected with a clear error message. | High | Brief §4.1 |
| FR-02 | The system shall send a verification email upon registration. The user must verify their email before accessing protected features. | High | Brief §4.1 |
| FR-03 | The user shall select a role during registration: **Engineer**, **Healthcare Professional**, or **Admin**. | High | Brief §4.1 |
| FR-04 | The system shall implement Role-Based Access Control (RBAC). Each role shall have clearly defined permissions enforced on both frontend and backend. | High | Brief §4.1 |
| FR-05 | The system shall allow users to log in using their registered email and password. | High | Brief §4.1 |
| FR-06 | The system shall allow users to log out, terminating the current session. | Medium | Brief §4.1 |
| FR-07 | The system shall automatically time out inactive sessions after a defined period. | Medium | Brief §5.2 |

### 3.2 Post Management

| ID | Requirement Description | Priority | Source |
|----|------------------------|----------|--------|
| FR-10 | The system shall allow authenticated users to create a structured post containing: Title, Domain, Description, Expertise Required, City, Country, Project Stage, Commitment Level, Collaboration Type, Confidentiality Level, and Expiry Date. | High | Brief §4.2 |
| FR-11 | The system shall allow post owners to edit their own posts at any time while in Draft or Active status. | High | Brief §4.2 |
| FR-12 | The system shall support post lifecycle states: **Draft → Active → Meeting Scheduled → Partner Found (Closed) → Expired**. | High | Brief §4.2 |
| FR-13 | The system shall allow users to save a post as **Draft** before publishing. | High | Brief §4.2 |
| FR-14 | The system shall allow users to publish a Draft post, changing its status to **Active**. | High | Brief §4.2 |
| FR-15 | The system shall allow post owners to mark their post as **Partner Found**, closing it. | High | Brief §4.2 |
| FR-16 | The system shall automatically expire posts that have passed their expiry date, changing their status to **Expired**. | Medium | Brief §4.2 |
| FR-17 | The system shall **not** allow any file uploads (documents, images, patient data) within posts. | High | Brief §2, §4.2 |
| FR-18 | The system shall allow post owners to delete their own posts. | Medium | Brief §4.2 |

### 3.3 Search & Matching

| ID | Requirement Description | Priority | Source |
|----|------------------------|----------|--------|
| FR-20 | The system shall allow authenticated users to browse all active posts. | High | Brief §4.3 |
| FR-21 | The system shall provide filtering by: Domain, Required Expertise, City, Country, Project Stage, and Status. | High | Brief §4.3 |
| FR-22 | The system shall allow multiple filters to be applied simultaneously and return the combined results. | High | Brief §4.3 |
| FR-23 | The system shall allow users to clear all applied filters and return to the full post list. | Medium | Brief §4.3 |
| FR-24 | Search results shall be returned within 1.5 seconds under normal load conditions. | High | Brief §5.3 |

### 3.4 Meeting Request Workflow

| ID | Requirement Description | Priority | Source |
|----|------------------------|----------|--------|
| FR-30 | An authenticated user (who is not the post owner) shall be able to send a meeting request on an Active post. | High | Brief §4.4 |
| FR-31 | The meeting request flow shall include an NDA acceptance step. The user must explicitly agree before proceeding. | High | Brief §4.4 |
| FR-32 | The requester shall be able to propose up to two available time slots when sending a meeting request. | High | Brief §4.4 |
| FR-33 | The post owner shall be able to **accept** or **decline** a meeting request. | High | Brief §4.4 |
| FR-34 | Upon accepting a meeting request, the post status shall automatically change to **Meeting Scheduled**. | High | Brief §3.1, §3.2 |
| FR-35 | The system shall allow a requester to cancel their own pending meeting request. | Medium | Brief §4.4 |
| FR-36 | The system shall not store any meeting recordings or meeting content. Meetings occur externally. | High | Brief §4.4 |

### 3.5 Administrative Dashboard

| ID | Requirement Description | Priority | Source |
|----|------------------------|----------|--------|
| FR-40 | The Admin Dashboard shall be accessible only to users with the **Admin** role (RBAC enforced). | High | Brief §4.5 |
| FR-41 | Admins shall be able to view all registered users, filter by role, and view profile completeness. | High | Brief §4.5.2 |
| FR-42 | Admins shall be able to suspend or deactivate user accounts. | High | Brief §4.5.2 |
| FR-43 | Admins shall be able to view all posts on the platform, filter by city, domain, and status. | High | Brief §4.5.1 |
| FR-44 | Admins shall be able to remove any inappropriate post from the platform. | High | Brief §4.5.1 |
| FR-45 | Admins shall be able to view the full post lifecycle history for any post. | Medium | Brief §4.5.1 |
| FR-46 | Admins shall be able to view platform-wide statistics (total users, posts, meetings). | Medium | Brief §4.5.1 |

### 3.6 Activity Logging & Audit Trail

| ID | Requirement Description | Priority | Source |
|----|------------------------|----------|--------|
| FR-50 | The system shall log the following events: login, logout, failed login attempts, post creation, post edit, post closure, meeting request events, admin actions, and security events. | High | Brief §4.6.1 |
| FR-51 | Each log entry shall contain: Timestamp, User ID, Role, Action Type, Target Entity, and Result Status. | High | Brief §4.6.2 |
| FR-52 | Activity logs shall be accessible only to Admin users. | High | Brief §4.6.3 |
| FR-53 | Admins shall be able to filter logs by user, date range, and action type. | High | Brief §4.6.4 |
| FR-54 | Admins shall be able to export activity logs as a CSV file. | High | Brief §4.6.4 |
| FR-55 | Logs shall not contain any patient data. Data minimization principles (GDPR) apply. | High | Brief §4.6.3 |
| FR-56 | Logs shall be retained for a maximum of 24 months, after which they shall be automatically purged. | Medium | Brief §4.6.3 |

---

## 4. Non-Functional Requirements

| ID | Requirement | Metric / Target | Category |
|----|-------------|----------------|----------|
| NFR-01 | Search results shall be returned within a specified time. | < 1.5 seconds | Performance |
| NFR-02 | Page load time shall be limited. | < 3 seconds | Performance |
| NFR-03 | The platform shall support concurrent users without degradation. | 1,000 concurrent users | Performance |
| NFR-04 | All data transmission shall be encrypted. | HTTPS mandatory | Security |
| NFR-05 | User passwords shall be stored using a strong one-way hashing algorithm. | bcrypt (min. cost factor 12) | Security |
| NFR-06 | The system shall implement secure session management with automatic timeout. | Session timeout: 30 minutes of inactivity | Security |
| NFR-07 | The system shall implement rate limiting to prevent brute-force attacks. | Max 5 failed login attempts before temporary lock | Security |
| NFR-08 | The system shall collect only the minimum personal data necessary. | GDPR Article 5(1)(c) | GDPR / Privacy |
| NFR-09 | Users shall have the right to delete their account and all associated data. | Account deletion available in profile settings | GDPR / Privacy |
| NFR-10 | Users shall have the right to export their personal data. | JSON export available in profile settings | GDPR / Privacy |
| NFR-11 | A clear privacy policy shall be accessible from all pages. | Link in footer | GDPR / Privacy |
| NFR-12 | A new user shall be able to understand the platform's purpose within 20 seconds. | User testing target | Usability |
| NFR-13 | A user shall be able to create and publish a post in 3 steps or fewer. | Max 3 UI steps from "New Post" to "Published" | Usability |
| NFR-14 | Sending a meeting request shall take less than 30 seconds once the user decides to proceed. | < 30 seconds end-to-end | Usability |
| NFR-15 | The platform shall conform to WCAG 2.1 accessibility standards. | Level AA compliance | Accessibility |
| NFR-16 | The platform shall be fully functional on mobile devices. | Responsive design, tested on viewport ≥ 375px | Accessibility |

---

## 5. Use Cases

### UC-01: Engineer Creates and Publishes a Post

| Field | Detail |
|-------|--------|
| **Name** | UC-01: Engineer Creates and Publishes a Post |
| **Actor(s)** | Engineer |
| **Precondition** | The engineer is logged in and email-verified. |
| **Main Flow** | 1. Engineer clicks "New Post". 2. Fills in all required fields (title, domain, expertise required, description, city, project stage, etc.). 3. Clicks "Save as Draft" — post is saved with Draft status. 4. Reviews the draft on the post detail page. 5. Clicks "Publish" — post status changes to Active and becomes visible to all users. |
| **Postcondition** | Post is visible to all authenticated users with Active status. Activity log entry created. |
| **Alternative Flow** | 2a. If a required field is left blank, the system shows a validation error and blocks submission. 5a. Engineer may choose to leave the post as Draft indefinitely. |

---

### UC-02: Healthcare Professional Sends a Meeting Request

| Field | Detail |
|-------|--------|
| **Name** | UC-02: Healthcare Professional Sends a Meeting Request |
| **Actor(s)** | Healthcare Professional |
| **Precondition** | The healthcare professional is logged in. The target post is in Active status. The user is not the post owner. |
| **Main Flow** | 1. User browses the post list and opens a post detail page. 2. Clicks "Express Interest / Request Meeting". 3. Step 1 — Writes an introductory message. 4. Step 2 — Reads and accepts the NDA. 5. Step 3 — Proposes up to two available time slots. 6. Clicks "Send Meeting Request". 7. The post owner receives a notification. The post status changes to Meeting Scheduled upon acceptance. |
| **Postcondition** | Meeting request is stored. Post owner is notified. Activity log entry created. |
| **Alternative Flow** | 4a. If the user does not accept the NDA, they cannot proceed to Step 3. 6a. The post owner declines the request — post remains Active. |

---

### UC-03: Admin Removes an Inappropriate Post

| Field | Detail |
|-------|--------|
| **Name** | UC-03: Admin Removes an Inappropriate Post |
| **Actor(s)** | Admin |
| **Precondition** | Admin is logged in. The target post exists on the platform. |
| **Main Flow** | 1. Admin navigates to Admin Panel → Posts tab. 2. Locates the post using filters (domain, city, status). 3. Clicks "Remove" on the target post. 4. Confirms the removal in the confirmation dialog. 5. Post is permanently removed. Activity log entry is created (action: post_remove). |
| **Postcondition** | Post is deleted from the platform. Post owner loses access to it. Admin action is logged. |
| **Alternative Flow** | 3a. Admin clicks "View" first to inspect the post detail before deciding to remove. |

---

### UC-04: User Exports Personal Data (GDPR)

| Field | Detail |
|-------|--------|
| **Name** | UC-04: User Exports Personal Data |
| **Actor(s)** | Any authenticated user |
| **Precondition** | User is logged in. |
| **Main Flow** | 1. User navigates to Profile page. 2. Finds the "Privacy & GDPR" section. 3. Clicks "Export My Data". 4. System generates a JSON file containing all personal data stored about the user. 5. File is automatically downloaded to the user's device. |
| **Postcondition** | User receives a complete export of their personal data. |
| **Alternative Flow** | — |

---

### UC-05: Admin Exports Activity Logs as CSV

| Field | Detail |
|-------|--------|
| **Name** | UC-05: Admin Exports Activity Logs as CSV |
| **Actor(s)** | Admin |
| **Precondition** | Admin is logged in. Activity logs exist in the system. |
| **Main Flow** | 1. Admin navigates to Admin Panel → Logs tab. 2. Optionally applies filters (action type, date range, user). 3. Clicks "Export CSV". 4. System generates a CSV file of the filtered logs. 5. File is automatically downloaded. |
| **Postcondition** | Admin has a CSV file of the selected activity logs for audit purposes. |
| **Alternative Flow** | 2a. Admin exports all logs without applying any filter. |

---

## 6. Data Model

### Core Entities

| Entity | Key Fields | Relationships |
|--------|-----------|---------------|
| **User** | id, name, email (.edu), password_hash, role (engineer / healthcare / admin), verified (bool), suspended (bool), created_at | Has many Posts, has many MeetingRequests (as requester), has many ActivityLogs |
| **Post** | id, user_id (FK → User), title, domain, description, expertise_required, city, country, project_stage, commitment_level, collaboration_type, confidentiality, expiry_date, status (draft / active / meeting_scheduled / closed / expired), created_at | Belongs to User, has many MeetingRequests, has many ActivityLogs |
| **MeetingRequest** | id, post_id (FK → Post), requester_id (FK → User), owner_id (FK → User), message, nda_accepted (bool), proposed_slots (array), confirmed_slot, status (pending / accepted / declined / cancelled), created_at | Belongs to Post, belongs to User (requester), belongs to User (owner) |
| **ActivityLog** | id, user_id (FK → User), role, action_type, target_entity, result_status, ip_address (optional), timestamp | Belongs to User |

### Post Lifecycle State Diagram

```
[Draft] ──(Publish)──► [Active] ──(Meeting Request Accepted)──► [Meeting Scheduled]
                          │                                              │
                          │ (Mark Partner Found)                        │ (Mark Partner Found)
                          ▼                                              ▼
                       [Closed / Partner Found] ◄──────────────────────┘
                          
[Active] ──(Expiry date reached)──► [Expired]
```

### Meeting Request Lifecycle

```
[Pending] ──(Owner Accepts)──► [Accepted] ──(Meeting occurs externally)──► [Completed]
[Pending] ──(Owner Declines)──► [Declined]
[Pending] ──(Requester Cancels)──► [Cancelled]
```

---

## 7. Interface Requirements

### 7.1 User Interface (UI)

The platform consists of the following main screens:

| Screen | Description | Access |
|--------|-------------|--------|
| **Login** | Email/password form. Links to Register. Shows demo credentials hint in V1. | Public |
| **Register** | Name, .edu email, role selection (Engineer / Healthcare), password. Two-step: form → email verification notice. | Public |
| **Dashboard** | Welcome banner with user name and role. Platform statistics. Feed of recent active posts. Quick links to create post and browse. | Authenticated |
| **Post List** | Full list of all posts. FilterBar with domain, city, expertise, stage, status filters. Result count. Post cards with preview. | Authenticated |
| **Post Detail** | Full post information. Owner actions (Edit, Publish, Mark Partner Found, Delete). Non-owner action: Express Interest / Request Meeting button. | Authenticated |
| **Post Create** | Multi-section form: Basic Information + Project Details. Save as Draft / Publish actions. | Authenticated |
| **Post Edit** | Same form pre-filled with existing post data. Save Changes action. | Post Owner only |
| **Meeting Request Modal** | 3-step flow within Post Detail: (1) Message, (2) NDA acceptance, (3) Time slot proposal. | Authenticated (non-owner) |
| **Meetings** | List of all meeting requests the user is involved in (sent or received). Accept/Decline actions for post owners. | Authenticated |
| **Admin Panel** | Three tabs: Users (list, filter, suspend), Posts (list, remove), Logs (list, filter, CSV export). | Admin only |
| **Profile** | Edit name. View email (read-only). GDPR section: Export Data, Delete Account flow. Notifications panel. | Authenticated |

### 7.2 External System Interfaces

| System | Purpose | Integration Method |
|--------|---------|-------------------|
| Email Service | Send verification emails upon registration, send meeting request notifications | SMTP (e.g., SendGrid, Nodemailer) — V2 |
| External Meeting Platforms | Meetings occur on Zoom / Microsoft Teams | Users share links externally; platform does not integrate directly |

---

## 8. Requirements Traceability Matrix

| Req. ID | Requirement Summary | Source (Brief) | Related Use Case |
|---------|---------------------|---------------|-----------------|
| FR-01 | .edu email restriction | §4.1 | UC-01, UC-02 |
| FR-02 | Email verification | §4.1 | UC-01 |
| FR-03 | Role selection at registration | §4.1 | UC-01, UC-02 |
| FR-04 | RBAC enforcement | §4.1 | UC-03 |
| FR-05 | User login | §4.1 | All UCs |
| FR-10 | Post creation with all fields | §4.2 | UC-01 |
| FR-11 | Post editing | §4.2 | UC-01 |
| FR-12 | Post lifecycle states | §4.2, §3.1 | UC-01, UC-02 |
| FR-13 | Save as Draft | §4.2 | UC-01 |
| FR-14 | Publish post | §4.2 | UC-01 |
| FR-15 | Mark Partner Found | §3.1, §3.2 | UC-01, UC-02 |
| FR-20 | Browse posts | §4.3 | UC-02 |
| FR-21 | Filter posts | §4.3 | UC-02 |
| FR-30 | Send meeting request | §4.4 | UC-02 |
| FR-31 | NDA acceptance step | §4.4 | UC-02 |
| FR-32 | Propose time slots | §4.4 | UC-02 |
| FR-33 | Accept / decline meeting | §4.4 | UC-02 |
| FR-40 | Admin-only dashboard | §4.5 | UC-03 |
| FR-41 | Admin user management | §4.5.2 | UC-03 |
| FR-43 | Admin post management | §4.5.1 | UC-03 |
| FR-44 | Admin remove post | §4.5.1 | UC-03 |
| FR-50 | Activity logging | §4.6.1 | UC-03, UC-05 |
| FR-53 | Filter logs | §4.6.4 | UC-05 |
| FR-54 | Export logs CSV | §4.6.4 | UC-05 |
| NFR-04 | HTTPS | §5.2 | All |
| NFR-08 | GDPR data minimization | §5.1 | UC-04 |
| NFR-09 | Right to delete account | §5.1 | UC-04 |
| NFR-10 | Right to export data | §5.1 | UC-04 |

---

## 9. Appendices

### Appendix A – Post Status Definitions

| Status | Description |
|--------|-------------|
| **Draft** | Post is saved but not visible to other users |
| **Active** | Post is published and visible to all authenticated users |
| **Meeting Scheduled** | A meeting request has been accepted; post is still visible |
| **Partner Found (Closed)** | Collaboration formed; post is closed |
| **Expired** | Post has passed its expiry date and is automatically closed |

### Appendix B – User Role Permissions Summary

| Permission | Engineer | Healthcare | Admin |
|-----------|----------|-----------|-------|
| Register / Login | ✅ | ✅ | ✅ |
| Create Post | ✅ | ✅ | ✅ |
| Edit Own Post | ✅ | ✅ | ✅ |
| Delete Own Post | ✅ | ✅ | ✅ |
| Browse All Posts | ✅ | ✅ | ✅ |
| Send Meeting Request | ✅ | ✅ | ✅ |
| Accept/Decline Meeting (own post) | ✅ | ✅ | ✅ |
| Export Own Data | ✅ | ✅ | ✅ |
| Delete Own Account | ✅ | ✅ | ✅ |
| View Admin Panel | ❌ | ❌ | ✅ |
| Suspend Users | ❌ | ❌ | ✅ |
| Remove Any Post | ❌ | ❌ | ✅ |
| View Activity Logs | ❌ | ❌ | ✅ |
| Export Logs CSV | ❌ | ❌ | ✅ |
