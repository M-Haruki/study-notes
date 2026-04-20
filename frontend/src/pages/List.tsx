import { load } from "../utils/storage";
import NoteThumbnail from "../components/NoteThumbnail";
import styles from "./List.module.css";

export default function List() {
  const notes = load();
  const noteDoms = notes.map((note) => <NoteThumbnail note={note} />);
  return (
    <>
      <h1>メモ一覧</h1>
      <div className={styles.notes}>{noteDoms}</div>
    </>
  );
}
