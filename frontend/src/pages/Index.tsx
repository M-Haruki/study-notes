import { Link } from "react-router-dom";
import styles from "./Index.module.scss";
export default function Index() {
  return (
    <>
      <p>
        簡単な平文のメモアプリです。
        <br />
        ReactとGoの勉強用に作成されました。
      </p>
      <Link to="/list" className="btn">
        始める
      </Link>
    </>
  );
}
