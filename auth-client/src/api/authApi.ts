import axios from "axios";

const API_URL = "http://localhost:5000/user";

export const signup = async (name: string, email: string, password: string) => {
  console.log("🚀 ~ API_URL:", API_URL);

  return axios.post(`${API_URL}/signup`, { name, email, password });
};

export const signin = async (email: string, password: string) => {
  return axios.post(`${API_URL}/signin`, { email, password });
};
