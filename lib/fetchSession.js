export const fetchSession = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/auth/session", {
      credentials: "include",
    });
    const sessionData = await response.json();
    setSession(sessionData);
  } catch (error) {
    console.error("Failed to fetch session:", error);
    setSession(null);
  } finally {
    setLoading(false);
  }
};
