# TodoApp — React Native + Node/Express/MongoDB

Full-stack To-Do app: React Native CLI (TypeScript) frontend, Node.js/Express + MongoDB backend, JWT auth.

## What's included

**Backend** (`/backend`)
- Express REST API, MongoDB via Mongoose, bcrypt password hashing, JWT auth middleware
- Routes: `POST /api/auth/register`, `POST /api/auth/login`, full CRUD under `/api/tasks`
- Bonus sort/filter algorithm mixing priority + deadline urgency (`utils/priorityScore.js`)

**Frontend** (`/frontend`)
- React Native CLI + TypeScript, Metro configured (`metro.config.js`)
- React Navigation (native-stack) for Login → Register → Task List → Add Task flow
- Context API for auth state and task state (no Redux needed, but swappable)
- AsyncStorage-persisted JWT session
- Dark, card-based UI with priority color-coding

**Bonus items implemented**
- Due dates + deadline field ✅
- Smart sort mixing priority + deadline + time ("Smart" sort mode) ✅
- Categories/tags on tasks ✅
- Sort/filter toggle (Smart / Deadline / Priority) ✅
- Cool, minimal dark UI ✅

## 2 Creative/unique features added

1. **Smart Priority Score** — instead of a static priority label, every task gets a live 0–100 urgency score computed from (a) its priority level and (b) how close the deadline is, recalculated on every fetch. The "Smart" sort surfaces what actually needs attention *right now*, not just what was marked "High" three weeks ago.

2. **Focus Mode timer** — tapping "Focus" on a task opens a 25-minute Pomodoro-style countdown bound to that specific task. Time spent is logged back onto the task (`focusMinutes`), turning the to-do list into a lightweight personal time-tracker — you can see not just what's due, but how much real work you've put into it.

## Setup — local development

### Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI and JWT_SECRET
npm run dev             # requires nodemon, or `npm start`
```

### Frontend
```bash
cd frontend
npm install
npx react-native run-android
```
Requires the standard React Native CLI Android setup (Android Studio, SDK, an emulator or device). See https://reactnative.dev/docs/set-up-your-environment.

While developing, keep `frontend/src/config.ts` → `IS_PROD = false`. It'll hit `http://10.0.2.2:5000/api`, which is the Android emulator's alias for your host machine's localhost. On a physical device on the same Wi-Fi, change `DEV_URL` to your machine's LAN IP instead (e.g. `http://192.168.1.42:5000/api`).

### Metro
Metro is the default RN bundler — `metro.config.js` extends the standard config to explicitly declare `.ts`/`.tsx` source extensions and enable inline requires for faster startup. It runs automatically with `npx react-native start` (or via `run-android`, which starts it for you).

---

## Going live — MongoDB Atlas + Render (do this before submitting)

The goal: your submitted APK talks to a real, already-running backend. The reviewer should never need to start a server or install MongoDB themselves.

### 1. MongoDB Atlas (free, real database)
1. Go to https://www.mongodb.com/cloud/atlas/register and create a free account.
2. Create a free **M0** cluster (any region close to you).
3. Under **Database Access**, add a database user with a username/password.
4. Under **Network Access**, add `0.0.0.0/0` (allow from anywhere) — needed since Render's servers have dynamic IPs.
5. Click **Connect → Drivers**, copy the connection string. It looks like:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/todoapp?retryWrites=true&w=majority`
   Replace `<username>`/`<password>` with your actual values, keep `/todoapp` as the database name.

### 2. Push the backend to GitHub
```bash
cd todo-app
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/todo-app.git
git push -u origin main
```
(`.gitignore` files are already in place so `node_modules` and `.env` won't be committed.)

### 3. Deploy the backend on Render
1. Go to https://dashboard.render.com → sign up with GitHub (no card required).
2. **New → Blueprint**, select your repo. Render will read `render.yaml` at the repo root and pre-fill a web service rooted at `/backend` automatically.
   - If you'd rather do it manually: **New → Web Service** → select repo → set **Root Directory** to `backend`, **Build Command** to `npm install`, **Start Command** to `npm start`.
3. Add environment variables when prompted:
   - `MONGO_URI` — paste your Atlas connection string from step 1
   - `JWT_SECRET` — Render can auto-generate this (blueprint does it for you)
   - `JWT_EXPIRES_IN` — `7d`
4. Deploy. Once live, Render gives you a URL like `https://todo-backend-xxxx.onrender.com`.
5. Sanity check it's alive: open `https://todo-backend-xxxx.onrender.com/api/health` in a browser — should return `{"status":"ok"}`.

Note: the free tier sleeps after 15 minutes of no traffic and takes 30-60s to wake up on the next request — the app already shows a "waking up" hint on first login for this reason. Fine for a submitted assignment; not something to worry about.

### 4. Point the app at your live backend
In `frontend/src/config.ts`:
```ts
const PROD_URL = 'https://todo-backend-xxxx.onrender.com/api'; // your actual Render URL
const IS_PROD = true; // flip this on
```

### 5. Build the release APK
```bash
cd frontend/android
./gradlew assembleRelease
```
The APK lands at `frontend/android/app/build/outputs/apk/release/app-release.apk`.

(This produces an unsigned/default-debug-signed release build, which is fine for an assignment submission. If you want a properly signed release, see https://reactnative.dev/docs/signed-apk-android — optional here.)

### 6. Final check before submitting
- Install the APK on a real device or fresh emulator (not the one you developed on) and confirm: register → login → add task → mark complete → delete all work against the **live** Render + Atlas backend, with no local server running.
- Upload the APK **and** a link to your GitHub repo to Google Drive, share both in the submission form.

## Folder structure
```
todo-app/
├── backend/
│   ├── models/        User.js, Task.js
│   ├── controllers/    authController.js, taskController.js
│   ├── routes/         authRoutes.js, taskRoutes.js
│   ├── middleware/     auth.js
│   ├── utils/          priorityScore.js
│   └── server.js
└── frontend/
    ├── src/
    │   ├── screens/     LoginScreen, RegisterScreen, TaskListScreen, AddTaskScreen
    │   ├── components/  TaskItem, FocusModeTimer
    │   ├── context/      AuthContext, TaskContext
    │   ├── navigation/   AppNavigator
    │   ├── api/          client.ts
    │   ├── utils/        sortTasks.ts
    │   └── types/
    ├── metro.config.js
    ├── App.tsx
    └── index.js
```

## Next steps before submitting
- Swap the `deadline` text input in `AddTaskScreen` for a real date/time picker (`@react-native-community/datetimepicker`) — left as plain text here to avoid a native-linking dependency in this scaffold.
- Add a `.gitignore` (node_modules, `.env`, `android/app/build`, etc.) before pushing to GitHub.
- Test the register → login → add/complete/delete task flow end-to-end against your MongoDB instance.
