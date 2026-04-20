import { Link } from "react-router-dom";
import styles from "./Index.module.css";
export default function Index() {
  return (
    <>
      <p>
        簡単な平文のメモアプリです。
        <br />
        ReactとGoの勉強用に作成されました。
      </p>
      <Link to="/list" className={styles.startbtn}>
        始める
      </Link>
    </>
  );
}
