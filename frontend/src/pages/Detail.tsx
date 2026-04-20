import { useParams, Link, useNavigate } from "react-router-dom";
import { loadNote, updateNote, deleteNote } from "../utils/storage";
import { useState } from "react";
import styles from "./Detail.module.scss";

export default function Detail() {
  const navigate = useNavigate();
  const id = useParams().id as string; // URLからidを取得(routerの制約により、idは必ず値を持つ)
  const [note, setNote] = useState(() => loadNote(id));
  function onChangeTitle(event: React.ChangeEvent<HTMLInputElement>) {
    setNote((prev) => ({ ...prev, title: event.target.value }));
  }
  function onChangeContent(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setNote((prev) => ({ ...prev, content: event.target.value }));
  }
  function saveNote() {
    const saved = updateNote(note);
    setNote(saved);
  }
  function deleteNote_() {
    deleteNote(id);
    navigate("/list");
  }
  return (
    <>
      <div className={styles.bar}>
        <Link to="/list" className="btn">
          戻る
        </Link>
        <p>{note.date}</p>
      </div>
      <input type="text" value={note.title} onChange={onChangeTitle} />
      <textarea value={note.content} onChange={onChangeContent} />
      <div className={styles.bar}>
        <div onClick={saveNote} className="btn">
          Save
        </div>
        <div onClick={deleteNote_} className="btn">
          削除
        </div>
      </div>
    </>
  );
}
