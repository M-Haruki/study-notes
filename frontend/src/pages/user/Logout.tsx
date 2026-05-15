import { useNavigate } from "react-router-dom";
import apiClient from "../../lib/axios";
import { useUserStore } from "../../stores/userStore";
import { useEffect } from "react";

export default function User_Logout() {
  const navigate = useNavigate();
  const setUserID = useUserStore((s) => s.setUserID);
  useEffect(() => {
    if (confirm("ログアウトしますか?")) {
      apiClient
        .post("/user/logout")
        .then(() => {
          setUserID(null);
          alert("ログアウトしました。");
          navigate("/");
        })
        .catch(() => {
          alert("ログアウトに失敗しました。");
          navigate(-1);
        });
    } else {
      navigate(-1);
    }
  }, [navigate, setUserID]);
  return <></>;
}
