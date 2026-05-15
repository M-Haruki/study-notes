import type { NoteSmall } from "../types";
import { Link } from "react-router-dom";
import styles from "./NoteThumbnail.module.scss";

export default function NoteThumbnail({ note }: { note: NoteSmall }) {
  return (
    <Link className={styles.note} to={"/note/detail/" + note.id}>
      <p className={styles.noteTitle}>{note.title}</p>
      <p className={styles.noteDate}>{note.updated_at.toLocaleString()}</p>
    </Link>
  );
}
