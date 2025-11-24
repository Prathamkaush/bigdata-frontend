
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CreditsMain() {
  const nav = useNavigate();
  useEffect(() => {
    nav("/credits/manage", { replace: true });
  }, []);
  return null;
}
