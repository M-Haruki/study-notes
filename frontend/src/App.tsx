import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header";
import { useUserStore } from "./stores/userStore";
import apiClient from "./lib/axios";
import { useEffect } from "react";

export default function App() {
  const location = useLocation();
  const setUserID = useUserStore((s) => s.setUserID);
  useEffect(() => {
    apiClient
      .get("/user/userid")
      .then((res) => {
        type Res = {
          user_id: string;
        };
        const data = res.data as Res;
        setUserID(data.user_id);
      })
      .catch(() => {
        setUserID(null);
      });
  }, [setUserID]);
  return (
    <>
      <Header key={location.key} />
      <div id="page">
        <Outlet />
      </div>
    </>
  );
}
