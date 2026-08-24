# TodoApp

A full-stack To-Do application built for the **Modulus Seventeen Full Stack Developer (React Native predominant) assignment**.

Built with **React Native CLI + TypeScript**, **Node.js/Express**, **MongoDB**, and **JWT authentication**.

## Features

### Core

* User registration and login
* JWT authentication with bcrypt password hashing
* Create, complete, and delete tasks
* Task title, description, date-time, deadline, priority
* Persistent login using AsyncStorage
* Context API for state management
* Dark, card-based UI

### Bonus

* Smart task sorting
* Categories/tags
* Deadline-based sorting
* Priority-based sorting
* Due dates

### Creative Features

**Smart Priority Score**
Each task gets a score from **0–100** based on its priority and how close its deadline is. The Smart sort uses this score to bring the most urgent tasks to the top.

**Focus Mode**
A 25-minute Pomodoro-style timer can be started for a task. Completed focus time is stored as `focusMinutes`.

## Tech Stack

**Frontend**

* React Native CLI
* TypeScript
* React Navigation
* Context API
* AsyncStorage
* Metro

**Backend**

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt

**Deployment**

* Render
* MongoDB Atlas
* GitHub Actions

## Project Structure

```text
todo-app/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── navigation/
│   │   ├── screens/
│   │   ├── types/
│   │   └── utils/
│   ├── App.tsx
│   └── metro.config.js
│
└── README.md
```

## How It Works

```text
React Native App
       ↓
Node.js + Express API
       ↓
MongoDB Atlas
```

JWT authentication protects task APIs so users can only access their own tasks.

## Local Setup

### Backend

```bash
cd backend
npm install
```

Create `.env`:

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d
```

Start the server:

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npx react-native run-android
```

For local Android emulator development, the API uses `10.0.2.2` to access the backend running on the host machine.

## Production

The backend is deployed on Render and uses MongoDB Atlas.

**Live Backend:**
https://todo-app-7s2x.onrender.com

**Health Check:**
https://todo-app-7s2x.onrender.com/api/health

The submitted Android release APK uses the live backend, so no local server or MongoDB setup is required to run the submitted app.

## Android APK

The release APK is built using **GitHub Actions** with:

```bash
./gradlew assembleRelease
```

The release build includes the React Native JavaScript bundle, so it does **not require Metro to be running** on the user's machine.

## Repository

**GitHub:**
https://github.com/srv184/todo-app

## Assignment

The project covers all required functionality along with the requested bonus features and two additional features: **Smart Priority Score** and **Focus Mode**.
