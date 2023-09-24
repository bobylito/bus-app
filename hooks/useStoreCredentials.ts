import { useEffect, useState } from "react";

const storeKey = "credentials";
export type Credentials = {
  code: string;
  route: string;
};
export const useStoreCredentials = () => {
  const [credentials, setCredentials] = useState<Credentials>({
    code: "",
    route: "",
  });

  useEffect(() => {
    if ("localStorage" in window) {
      const raw = window.localStorage.getItem(storeKey);
      if (raw === null) return;
      try {
        const data = JSON.parse(raw);
        setCredentials(data);
      } catch (e) {}
    }
  }, []);

  const saveCredentials = (credentials: Credentials) => {
    setCredentials(credentials);
    if ("localStorage" in window) {
      window.localStorage.setItem(storeKey, JSON.stringify(credentials));
    }
  };

  return { credentials, saveCredentials };
};
