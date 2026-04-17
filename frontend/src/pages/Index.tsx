import { Link } from "react-router-dom";
export default function Index() {
  return (
    <>
      <p>
        簡単な平文のメモアプリです。
        <br />
        ReactとGoの勉強用に作成されました。
      </p>
      <Link to="/list">
        <div>始める</div>
      </Link>
    </>
  );
}
