import { useParams, Link } from "react-router-dom";
import { loadNote, updateNote } from "../utils/storage";
import { useState } from "react";

export default function Detail() {
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
  return (
    <>
      <Link to="/list">戻る</Link>
      <br />
      <p>{note.date}</p>
      <input type="text" value={note.title} onChange={onChangeTitle} />
      <br />
      <textarea value={note.content} onChange={onChangeContent} />
      <br />
      <button onClick={saveNote}>Save</button>
    </>
  );
}
