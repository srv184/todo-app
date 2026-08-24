const DEV_URL = "http://10.0.2.2:5000/api";
const PROD_URL = "https://todo-app-7s2x.onrender.com/api";

const IS_PROD = true;

export const API_BASE_URL = IS_PROD ? PROD_URL : DEV_URL;
