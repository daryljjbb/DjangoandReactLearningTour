export function logout() {
  // Clear tokens or session data
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");

  // Clear any user info you may store later
  localStorage.removeItem("user");

  // Redirect to login page
  window.location.href = "/login";
}

export async function refreshToken() {
  const refresh = localStorage.getItem("refresh_token");

  const response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  const data = await response.json();
  localStorage.setItem("access_token", data.access);

  return data.access;
}

