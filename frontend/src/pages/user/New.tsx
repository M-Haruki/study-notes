import apiClient from "../../lib/axios";
import { useNavigate } from "react-router-dom";
import { PasswordInput } from "../../components/form/Password";
import { UserIDInput } from "../../components/form/UserID";
import { SubmitBtn } from "../../components/form/SubmitBtn";
import styles from "./Form.module.scss";

export default function User_New() {
  const navigate = useNavigate();
  function submit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target);
    if (formData.get("password") != formData.get("password_check")) {
      alert("パスワードが一致していません。");
    }
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
      <h1>新規登録</h1>
      <form onSubmit={submit} className={styles.form}>
        <UserIDInput label="ユーザーID" name="user_id" />
        <PasswordInput label="パスワード" name="password" />
        <PasswordInput label="パスワード(確認)" name="password_check" />
        <SubmitBtn label="登録" />
      </form>
    </>
  );
}
