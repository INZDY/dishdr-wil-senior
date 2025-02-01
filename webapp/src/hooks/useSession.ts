import { useState, useEffect } from "react";
import { Session } from "next-auth";

export default function useSession() {
  const [currentSession, setCurrentSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch("/api/session");
        if (!response.ok) {
          throw new Error("Failed to fetch session");
        }
        const data: Session | null = await response.json();
        setCurrentSession(data);
      } catch (error) {
        console.error("Failed to fetch session:", error);
      }
    };

    fetchSession();
  }, []);

  return currentSession;
}
