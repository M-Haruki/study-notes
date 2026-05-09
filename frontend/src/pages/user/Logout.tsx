import { useNavigate } from "react-router-dom";
import apiClient from "../../lib/axios";
export default function User_Logout() {
  const navigate = useNavigate();
  if (confirm("ログアウトしますか?")) {
    apiClient
      .post("/user/logout")
      .then(() => {
        alert("ログアウトしました。");
        navigate("/");
      })
      .catch(() => {
        alert("ログアウトに失敗しました。");
      });
  } else {
    navigate(-1);
  }
  return <></>;
}
