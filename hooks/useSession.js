import { useState, useEffect } from "react";

const useSession = () => {
  const [session, setSession] = useState(null);
  const [status, setStatus] = useState("loading"); // Possible values: "loading", "authenticated", "unauthenticated"

  const fetchSession = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/session", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch session");
      }

      const sessionData = await response.json();
      setSession(sessionData);

      if (sessionData?.user) {
        setStatus("authenticated");
      } else {
        setStatus("unauthenticated");
      }
    } catch (error) {
      console.error("Failed to fetch session:", error);
      setSession(null);
      setStatus("unauthenticated");
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  return { session, status };
};

export default useSession;
