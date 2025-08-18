# Intern Management System

A full-stack application for managing interns with role-based access control (Admin and Intern roles).

## Features

- **User Authentication**
  - JWT-based authentication
  - Role-based access control (Admin/Intern)
  - Protected routes

- **Admin Dashboard**
  - View all users
  - Manage intern accounts
  - Generate reports

- **Intern Dashboard**
  - View assigned tasks
  - Submit reports
  - Track progress

## Tech Stack

- **Frontend**: React 18, Vite, React Router 6
- **Styling**: Tailwind CSS Modules
- **Backend**: Django 5.0, Django REST Framework, JWT Authentication
- **Database**: SQLite (development), PostgreSQL (production-ready)

## Prerequisites

- Node.js 16+ and npm/yarn
- Python 3.9+
- pip (Python package manager)
- Virtual environment (recommended)

## Getting Started

### Backend Setup

1. **Activate Virtual Environment** (recommended)
   ```bash
   # Windows
   .\venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

2. **Install Python Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Run Migrations**
   ```bash
   python manage.py migrate
   ```

4. **Create Superuser (Admin Account)**
   ```bash
   python manage.py createsuperuser
   ```

5. **Run Development Server**
   ```bash
   python manage.py runserver
   ```
   The backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Install Node.js Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

## API Endpoints

- `POST /api/users/register/` - Register a new user
- `POST /api/users/login/` - Login and get JWT tokens
- `POST /api/users/refresh/` - Refresh access token
- `GET /api/users/me/` - Get current user profile

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

## Project Structure

```
intern-system/
├── backend/               # Django backend
│   ├── backend/           # Project settings
│   ├── users/             # User management app
│   ├── interns/           # Intern management app
│   ├── reports/           # Reports app
│   └── manage.py
├── frontend/              # React frontend
│   ├── public/
│   └── src/
│       ├── components/    # Reusable components
│       ├── contexts/      # React contexts
│       ├── pages/         # Page components
│       ├── services/      # API services
│       └── styles/        # Global styles
└── README.md
```

## Deployment

For production deployment, consider:

1. Setting `DEBUG=False` in Django settings
2. Configuring a production database (PostgreSQL)
3. Setting up a proper web server (Nginx + Gunicorn)
4. Using environment variables for sensitive data
5. Setting up HTTPS with Let's Encrypt

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
