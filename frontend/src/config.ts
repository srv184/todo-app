// Keep API addresses in one place so mobile builds target the deployed backend
// in production while development can use the local emulator endpoint.
const DEV_URL = "http://10.0.2.2:5000/api";
const PROD_URL = "https://todo-app-7s2x.onrender.com/api";

const IS_PROD = true;

export const API_BASE_URL = IS_PROD ? PROD_URL : DEV_URL;
