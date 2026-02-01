const API_BASE_URL = "http://localhost:8080";

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    return data; // Returns { token, email, role }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
