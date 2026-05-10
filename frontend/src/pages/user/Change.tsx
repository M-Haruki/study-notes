import apiClient from "../../lib/axios";
import { PasswordInput } from "../../components/form/Password";
import { SubmitBtn } from "../../components/form/SubmitBtn";

export default function User_Change() {
  function submit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target);
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
      <form onSubmit={submit}>
        <PasswordInput label="パスワード 8~32バイト" name="password" />
        <SubmitBtn label="変更" />
      </form>
    </>
  );
}
