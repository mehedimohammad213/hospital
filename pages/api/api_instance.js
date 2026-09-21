import axios from "axios";
import { CMS_API_URL, CMS_SITE_KEY } from "../../lib/cms";

const instance = axios.create({
  baseURL: `${CMS_API_URL.replace(/\/$/, "")}/public`,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(CMS_SITE_KEY ? { "X-Headless-Site-Key": CMS_SITE_KEY } : {}),
  },
});

export default instance;
