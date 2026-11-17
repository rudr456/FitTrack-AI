# 💪 FitTrack AI

### AI-Powered Fitness, Workout & Nutrition Tracking Platform

FitTrack AI is a full-stack fitness management web application designed to help users manage their fitness journey in one place. It combines workout tracking, nutrition management, progress visualization, and AI-powered fitness guidance.

## 🚀 Live Application

**Frontend:** https://fittrack-ai-1-nzg2.onrender.com

**Backend:** https://fittrack-ai-8agl.onrender.com

## ✨ Key Features

- **User Authentication:** Register and log in securely using JWT authentication.
- **Dashboard:** View your fitness activity and key information in one place.
- **Workout Tracking:** Record and manage workout activities.
- **Nutrition Tracking:** Manage meals and monitor nutrition information.
- **Progress Monitoring:** Visualize fitness activity and progress using charts.
- **AI Fitness Coach:** Get personalized fitness guidance through Google Gemini.
- **Protected Routes:** Restrict application pages to authenticated users.
- **Responsive Design:** Use the application on desktop and mobile devices.

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, Vite |
| Styling | CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Token (JWT) |
| AI Integration | Google Gemini API |
| Charts | Recharts |
| HTTP Requests | Axios |
| Icons | Lucide React |
| Deployment | Render |

## 📁 Project Structure

```text
FitTrack-AI/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── app.js
│   │   └── index.js
│   │
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── index.html
│
└── README.md
```

## ⚙️ Installation & Setup

Follow these steps to run FitTrack AI locally.

### 1. Clone the Repository

```bash
git clone https://github.com/rudr456/FitTrack-AI.git
cd FitTrack-AI
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend server:

```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal from the project root:

```bash
cd frontend
npm install
```

Create a `.env` file inside the frontend folder:

```env
VITE_API_URL=http://localhost:8000/api
```

Start the frontend:

```bash
npm run dev
```

Open the local URL shown in your terminal, usually:

```text
http://localhost:5173
```

## 🔐 Security

- JWT-based authentication.
- Protected application routes.
- Environment variables for sensitive credentials.
- API keys and database credentials should never be committed to GitHub.

## 📸 Application Screenshots

Screenshots of the following application sections will be added here:

- Dashboard
- Login & Registration
- Workout Tracker
- Nutrition Tracker
- Progress Dashboard
- AI Fitness Coach

## 🌐 Deployment

FitTrack AI is deployed using **Render**.

- Frontend: Render Static Site
- Backend: Render Web Service
- Database: MongoDB Atlas

## 👨‍💻 Developer

**Rudrangshu Biswas**

B.Tech – Electronics and Communication Engineering

GitHub: [rudr456](https://github.com/rudr456)

Project Repository: [FitTrack AI](https://github.com/rudr456/FitTrack-AI)

---

**FitTrack AI — Track Your Fitness. Understand Your Progress. Train Smarter with AI.**