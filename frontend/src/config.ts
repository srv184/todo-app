/**
 * Single place to control which backend the app talks to.
 *
 * DEV_URL   -> used while running against your backend on localhost via
 *              `npm run dev` (10.0.2.2 = Android emulator's alias for your host machine).
 *              If testing on a physical device on the same Wi-Fi, replace with
 *              your machine's LAN IP, e.g. http://192.168.1.42:5000/api
 *
 * PROD_URL  -> your deployed Render URL (see README "Deploy the backend").
 *              Looks like: https://todo-backend-xxxx.onrender.com/api
 *
 * Flip IS_PROD to true before building the release APK you submit, so the
 * app works for anyone opening it — not just against your local machine.
 */
const DEV_URL = 'http://10.0.2.2:5000/api';
const PROD_URL = 'https://REPLACE-WITH-YOUR-RENDER-URL.onrender.com/api';

const IS_PROD = true; // <-- set to true when building the submission APK

export const API_BASE_URL = IS_PROD ? PROD_URL : DEV_URL;
