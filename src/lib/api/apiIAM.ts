// utils/apiIAM.ts
import axios from 'axios';

const apiIAM = axios.create({
  baseURL: "http://localhost:8080/iam",
  withCredentials: true, // Include cookies (JWT)
});

export default apiIAM;
