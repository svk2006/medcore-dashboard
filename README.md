---

# 🏥 MedCoreOps

**The Administrative Command Center for Hospital Operational Excellence**

MedCoreOps is a high-fidelity, full-stack administrative dashboard designed to transform raw hospital data into actionable intelligence. Built for the modern healthcare facility, it bridges the gap between clinical activity and operational oversight, featuring real-time data synchronization and a refined "Clinical Dark Mode" user experience.

---

## ✨ Key Features

### 📊 Executive Analytics (The Pulse)

A data-driven overview of the facility's performance using historical and live metrics:

* **Total Admissions & Bed Occupancy:** Real-time capacity tracking to prevent "boarding" in the Emergency Department. 


* **Case Mix Index (CMI):** Visualizing the complexity and resource intensity of the current patient population. 


* **Average Length of Stay (ALOS):** Automated tracking of patient throughput efficiency.

### ⚡ Real-Time Admissions Portal

* **Manual Entry Engine:** A dedicated interface for staff to input new admissions instantly.
* **Supabase Realtime Sync:** Utilizing PostgreSQL Change Data Capture (CDC) to update the executive dashboard the second a new record is saved—no page refreshes required.

### 🩺 High-Fidelity Healthcare UX

* **Clinical Dark Mode:** A high-contrast design system built with Tailwind CSS and shadcn/ui for reduced eye strain in clinical environments.
* **Themed Transitions:** Custom healthcare-themed loading animations (EKG Heartbeat Pulse) for all page navigations and data-fetching states.

---

## 🛠️ Tech Stack

| Layer | Technology |
| --- | --- |
| **Frontend** | React + Vite + TypeScript |
| **Styling** | Tailwind CSS + shadcn/ui 

 |
| **Database** | Supabase (PostgreSQL) |
| **Real-time** | Supabase Realtime API |
| **Visualizations** | Recharts |
| **Deployment** | Lovable Cloud / Netlify |

---

## 📈 Business Logic & KPIs

MedCoreOps implements industry-standard healthcare metrics to ensure administrative accuracy:

* **Average Length of Stay (ALOS):**

$$ALOS = \frac{\sum_{i=1}^{n} (DischargeDate_i - AdmissionDate_i)}{n}$$



where $n$ is the total number of discharges. This metric serves as a proxy for bed turnover efficiency.
* **Staff-to-Patient Ratio:** Visualized through stacked bar charts to identify departmental bottlenecks or provider burnout risks.
* **Resolution Trends:** Tracking Mean Time to Resolution (MTTR) for administrative support queries and backlog aging. 



---

## 🚀 Installation & Setup

### Prerequisites

* A **Supabase** account for the backend.
* **Node.js** installed locally (if running outside the Lovable environment). 



### Steps

1. **Clone the Repository:**
```bash
git clone https://github.com/your-username/MedCoreOps.git
cd MedCoreOps

```


2. **Install Dependencies:**
```bash
npm install

```


3. **Configure Environment Variables:**
Create a `.env` file and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

```


4. **Database Migration:**
Run the provided SQL script in your Supabase SQL Editor to generate the `admissions` and `department_stats` tables.
5. **Run Development Server:**
```bash
npm run dev

```



---

## 📂 Data Sources

* **Primary Dataset:** Simulated hospital operations data (2025) covering 500+ records of CMI, ALOS, and departmental volumes. 


* **Real-time Inputs:** Live-entry simulated patient queries and admission events.

---

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for more information. 

---
