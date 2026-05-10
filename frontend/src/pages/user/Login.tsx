import apiClient from "../../lib/axios";
import { useNavigate, Link } from "react-router-dom";
import { PasswordInput } from "../../components/form/Password";
import { UserIDInput } from "../../components/form/UserID";
import { SubmitBtn } from "../../components/form/SubmitBtn";
import { useUserStore } from "../../stores/userStore";

export default function User_Login() {
  const navigate = useNavigate();
  const setUserID = useUserStore((s) => s.setUserID);
  function submit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target);
    apiClient
      .post("/auth/login", {
        user_id: formData.get("user_id"),
        password: formData.get("password"),
      })
      .then((res) => {
        type Res = {
          user_id: string;
        };
        const data = res.data as Res;
        console.log(data.user_id);
        setUserID(data.user_id);
        alert("ログインに成功しました。");
        navigate("/note/list");
      })
      .catch(() => {
        alert("ログインに失敗しました。");
      });
  }
  return (
    <>
      <form onSubmit={submit}>
        <UserIDInput label="ユーザーID 半角英数字3~16字" name="user_id" />
        <PasswordInput label="パスワード 8~32バイト" name="password" />
        <SubmitBtn label="ログイン" />
      </form>
      <Link to="/user/new">新規登録</Link>
    </>
  );
}
