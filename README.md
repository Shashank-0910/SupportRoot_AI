# Supportroot Ai

Supportroot Ai is an AI-powered customer support platform that enables businesses to create knowledge-based support assistants, manage customer conversations and tickets, and monitor support performance from a centralized dashboard.

## 🚀 Tech Stack

*   **Frontend:** React 18, TypeScript, Tailwind CSS v4, Vite, Recharts, Lucide Icons, React Router DOM
*   **Backend:** Django 5, Django REST Framework (DRF), SimpleJWT (Authentication)
*   **Database:** SQLite (Development) / PostgreSQL (Production ready)

---

## 🛠️ Getting Started

Follow these steps to run the full-stack application (frontend + backend) on your local machine from scratch.

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18 or higher)
*   [Python](https://www.python.org/) (v3.10 or higher)

### 1. Backend Setup (Django API)

Open a new terminal and navigate to the project root folder.

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Create a virtual environment
python -m venv venv

# 3. Activate the virtual environment
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

# 4. Install required Python packages
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers

# 5. Run database migrations to set up models
python manage.py makemigrations
python manage.py migrate

# 6. Start the Django development server
python manage.py runserver
```
The backend API will now be running at **http://localhost:8000**. Keep this terminal open.

### 2. Frontend Setup (React App)

Open a **second** terminal window and navigate to the project root folder.

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install Node dependencies
npm install

# 3. Start the Vite development server
npm run dev
```

### 3. View the Application

Once both servers are running:
1. Open your browser and navigate to **http://localhost:5173**
2. You will see the Landing Page.
3. Click **Get Started** or **Sign In** to create a new account.
4. Your account will be saved to the local SQLite database, and you will be redirected to the secure Dashboard!

---

## 📁 Project Structure

```text
├── backend/                  # Django backend
│   ├── core/                 # Main Django project settings (settings.py, urls.py)
│   ├── accounts/             # Authentication & User models app
│   └── manage.py             # Django execution script
│
└── frontend/                 # React frontend
    ├── src/
    │   ├── api/              # Axios configuration & API calls
    │   ├── components/       # Reusable UI components & Dashboard Layout
    │   ├── context/          # React Context (AuthContext)
    │   ├── pages/            # Page components (Dashboard, Tickets, Login, etc.)
    │   ├── App.tsx           # React Router configuration
    │   └── index.css         # Tailwind CSS entry & custom styles
    ├── package.json          # Node dependencies
    └── vite.config.ts        # Vite configuration with Tailwind plugin
```

## ✨ Current Features (Phase 1 & 2)

*   **Modern UI:** Responsive, glassmorphism dark theme using Tailwind CSS v4.
*   **Authentication:** Full JWT authentication flow (Register, Login, Protected Routes).
*   **Dashboard Layout:** Sidebar navigation, top-bar user context.
*   **Mock Pages:** 
    *   Analytics with Recharts data visualization.
    *   Conversations & Tickets tables with mock data filtering.
    *   AI Assistant simulated chat view.
