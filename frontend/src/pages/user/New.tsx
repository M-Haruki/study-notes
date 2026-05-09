import apiClient from "../../lib/axios";
import { useNavigate } from "react-router-dom";
import { PasswordInput } from "../../components/form/Password";
import { UserIDInput } from "../../components/form/UserID";
import { SubmitBtn } from "../../components/form/SubmitBtn";

export default function User_New() {
  const navigate = useNavigate();
  function submit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target);
    apiClient
      .post("/auth/new", {
        user_id: formData.get("user_id"),
        password: formData.get("password"),
      })
      .then(() => {
        alert("登録が完了しました。\nログインしてください。");
        navigate("/user/login");
      })
      .catch(() => {
        alert("登録に失敗しました。");
      });
  }

  return (
    <>
      <form onSubmit={submit}>
        <UserIDInput label="ユーザーID 半角英数字3~16字" name="user_id" />
        <PasswordInput label="パスワード 8~32バイト" name="password" />
        <SubmitBtn label="登録" />
      </form>
    </>
  );
}
