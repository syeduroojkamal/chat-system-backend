import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

export const useClerkToken = () => {
  const { getToken, isSignedIn } = useAuth();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      if (isSignedIn) {
        const jwt = await getToken();
        setToken(jwt);
      }
    };
    fetchToken();
  }, [isSignedIn, getToken]);

  return token;
};
