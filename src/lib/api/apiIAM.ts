// utils/apiIAM.ts
import axios from 'axios';

const apiIAM = axios.create({
  baseURL: "https://fhard.khoa.email/api/iam",
  withCredentials: true, // Include cookies (JWT)
});

export default apiIAM;
