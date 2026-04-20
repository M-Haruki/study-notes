import { load, createNote } from "../utils/storage";
import NoteThumbnail from "../components/NoteThumbnail";
import styles from "./List.module.scss";
import { useNavigate } from "react-router-dom";

export default function List() {
  const notes = load();
  const noteDoms = notes.map((note) => <NoteThumbnail note={note} />);

  const navigate = useNavigate();
  function newNote() {
    const note = createNote();
    navigate(`/detail/${note.id}`);
  }

  return (
    <>
      <h1>メモ一覧</h1>
      <div onClick={newNote} className="btn">
        新規作成
      </div>
      <div className={styles.notes}>{noteDoms}</div>
    </>
  );
}
