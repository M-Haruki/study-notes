import { load, createNote } from "../utils/storage";
import NoteThumbnail from "../components/NoteThumbnail";
import styles from "./List.module.scss";
import { useNavigate } from "react-router-dom";

export default function List() {
  const notes = load();
  const noteDoms = notes.map((note) => (
    <NoteThumbnail note={note} key={note.id} />
  ));

  const navigate = useNavigate();
  function newNote() {
    const note = createNote();
    navigate(`/detail/${note.id}`);
  }

  return (
    <>
      <div className={styles.front}>
        <h1>メモ一覧</h1>
        <button onClick={newNote} className={styles.new}>
          作成
        </button>
      </div>
      <div className={styles.notes}>{noteDoms}</div>
    </>
  );
}
