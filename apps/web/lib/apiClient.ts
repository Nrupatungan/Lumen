import axios from "axios";
import { cookies } from "next/headers";

const getToken = async () => (await cookies()).get("authjs.session-token")?.value;

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL!,
  withCredentials: false,
});

export default api;
