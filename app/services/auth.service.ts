import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_SSO_URL;

export const authService = {
  async login(email: string, password: string) {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.access_token) {
        console.log(response);

        localStorage.setItem("access_token", data.access_token);
        return data;
      }

      throw new Error(data.message || "Login failed");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  async getUser() {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${API_URL}/api/auth/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    return response.json();
  },

  async logout() {
    const token = localStorage.getItem("access_token");
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

  async register(userData: { name: string; email: string; password: string }) {
    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("access_token", data.token);
        return data;
      }
      throw new Error(data.error || "Registrasi gagal");
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  },

  async globalLogout() {
    try {
      const token = localStorage.getItem("access_token");
      await fetch(`${API_URL}/api/global-logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    } catch (error) {
      console.error("Global logout error:", error);
      throw error;
    }
  },

  // Sebelum mengambil data dari localStorage, tambahkan pengecekan
  getStoredUser: () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },
};
