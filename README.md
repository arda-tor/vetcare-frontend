# PetCare Clinic — Frontend

This is the **React + Vite**–powered front-end for the PetCare Clinic application. It handles all user-facing dashboards (admin, doctor, receptionist, pet-parent), authentication flows, and communicates with a Laravel/Sanctum back-end via REST.

---

## 📦 Prerequisites

- Node.js ≥ 16  
- npm or Yarn  

---

## 🔧 Setup

1. **Clone & install**  
   ```bash
   git clone <your-repo-url>
   cd frontend
   npm install
   # or
   yarn install

2.Environment
Copy .env.example to .env and adjust as needed:

bash
Copy
Edit
cp .env.example .env
dotenv
Copy
Edit
# .env.example

# base URL for all API requests
VITE_API_BASE_URL=http://127.0.0.1:8000/api
