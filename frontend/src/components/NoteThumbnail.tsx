import type { Note } from "../types";
import { Link } from "react-router-dom";
import styles from "./NoteThumbnail.module.css";

export default function NoteThumbnail({ note }: { note: Note }) {
  return (
    <Link className={styles.note} to={"/detail/" + note.id}>
      <p className={styles.noteTitle}>{note.title}</p>
      <p className={styles.noteDate}>{note.date}</p>
    </Link>
  );
}
