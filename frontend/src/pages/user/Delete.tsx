import { useNavigate } from "react-router-dom";
import apiClient from "../../lib/axios";
import { useUserStore } from "../../stores/userStore";
import { UserIDInput } from "../../components/form/UserID";
import { SubmitBtn } from "../../components/form/SubmitBtn";

export default function User_Delete() {
  const navigate = useNavigate();
  const userStore = useUserStore();
  function submit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const input_id = new FormData(event.target).get("user_id");
    const id = userStore.userID;
    if (id == input_id) {
      if (confirm("アカウントを削除しますか?")) {
        apiClient
          .delete("/user")
          .then(() => {
            userStore.setUserID(null);
            alert("アカウントを削除しました。");
            navigate("/");
          })
          .catch(() => {
            alert("アカウントの削除に失敗しました。");
          });
      }
    } else {
      alert("ユーザーIDが間違っています。");
    }
  }
  return (
    <>
      <form onSubmit={submit}>
        <UserIDInput label="ユーザーID" name="user_id" />
        <SubmitBtn label="削除" />
      </form>
    </>
  );
}
