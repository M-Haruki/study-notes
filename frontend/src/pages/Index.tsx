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
        <p>
          メモはサーバーに保存され、<b>管理者が自由に観覧可能</b>
          な状態に置かれます。
          <br />
          このサイトやユーザーが保存したデータは、管理者の都合により、
          <b>事前の連絡なく消される</b>場合があります。
          <br />
          実使用を想定したアプリではないため、<b>お試し程度</b>
          のご利用にお留めください。
        </p>
      </div>
      <Link to="/note/list" className={styles.startbtn}>
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
