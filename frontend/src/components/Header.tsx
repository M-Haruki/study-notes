import { Link } from "react-router-dom";
import styles from "./Header.module.scss";
import { useUserStore } from "../stores/userStore";

export default function Header() {
  const userID = useUserStore((s) => s.userID);
  return (
    <div className={styles.header}>
      <Link to="/">
        <h1>Study Notes</h1>
      </Link>
      <div className={styles.userLabel}>
        {userID != null ? (
          <>
            <span>{userID}</span>
            <div>
              <Link to="/user/change">パスワード変更</Link>
              <Link to="/user/logout">ログアウト</Link>
              <Link to="/user/delete">アカウント削除</Link>
            </div>
          </>
        ) : (
          <>
            <Link to="/user/login">ログイン</Link>
          </>
        )}
      </div>
      <a
        className={styles.link}
        href="https://github.com/M-Haruki/study-notes"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub
      </a>
    </div>
  );
}
