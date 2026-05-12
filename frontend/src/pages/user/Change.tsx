import apiClient from "../../lib/axios";
import { PasswordInput } from "../../components/form/Password";
import { SubmitBtn } from "../../components/form/SubmitBtn";
import styles from "./Form.module.scss";

export default function User_Change() {
  function submit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target);
    if (formData.get("password") != formData.get("password_check")) {
      alert("パスワードが一致していません。");
    }
    apiClient
      .patch("/user/password", {
        password: formData.get("password"),
      })
      .then(() => {
        alert("パスワードを変更しました。");
      })
      .catch(() => {
        alert("パスワードの変更に失敗しました。");
      });
  }
  return (
    <>
      <h1>パスワード変更</h1>
      <form onSubmit={submit} className={styles.form}>
        <PasswordInput label="パスワード" name="password" />
        <PasswordInput label="パスワード(確認)" name="password_check" />
        <SubmitBtn label="変更" />
      </form>
    </>
  );
}
