import { Link } from "react-router-dom";
import styles from "./Index.module.scss";
export default function Index() {
  return (
    <>
      <div className={styles.descBox}>
        <h1>Study Notes</h1>
        <h2>
          簡単な平文のメモアプリ
          <br />
          ReactとGoの勉強用に制作
        </h2>
      </div>
      <Link to="/list" className={styles.startbtn}>
        はじめる
      </Link>
      <div className={styles.details}>
        <div className={styles.box}>
          <h3>フロントエンド</h3>
          <p>Vite + React</p>
        </div>
        <div className={styles.box}>
          <h3>バックエンド</h3>
          <p>Go + PostgreSQL</p>
        </div>
      </div>
    </>
  );
}
