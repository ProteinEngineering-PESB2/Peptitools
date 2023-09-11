import { useContext, useEffect, useState } from "react";
import axios from "axios";
import AppContext from "../context/AppContext";

function useHandlerBackendUrl() {
  const [backendUrl, setBackendUrl] = useState<string>("");

  useEffect(() => {
    if (import.meta.env.VITE_BACKEND_URL) {
      axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
      setBackendUrl(import.meta.env.VITE_BACKEND_URL);
    }
  }, []);

  return { backendUrl };
}

export default useHandlerBackendUrl;
