import axios from 'axios';
import { env } from '../configs/env.config';

export const http = axios.create({ baseURL: env.BACKEND_BASE_URL, timeout: 10_000 });
