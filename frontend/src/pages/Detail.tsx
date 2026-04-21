import { useParams, Link, useNavigate, useBlocker } from "react-router-dom";
import { loadNote, updateNote, deleteNote } from "../utils/storage";
import { useState, useEffect } from "react";
import styles from "./Detail.module.scss";
import { flushSync } from "react-dom";

export default function Detail() {
  // 定数定義
  const id = useParams().id as string; // URLからidを取得(routerの制約により、idは必ず値を持つ)
  const [note, setNote] = useState(() => loadNote(id));
  // ルーティング周り
  const [isDirty, setIsDirty] = useState(false);
  const navigate = useNavigate();
  const blocker = useBlocker(isDirty && !!note);
  // effect
  useEffect(() => {
    if (blocker.state === "blocked") {
      if (confirm("本当に移動しますか?\n変更内容は保存されません。")) {
        blocker.proceed();
      } else {
        blocker.reset();
      }
    }
  }, [blocker]);
  useEffect(() => {
    if (!note) {
      navigate("/list");
      return;
    }
  }, [navigate, note]);
  // func
  function onChangeTitle(event: React.ChangeEvent<HTMLInputElement>) {
    setNote((prev) => ({ ...prev, title: event.target.value }));
    setIsDirty(true);
  }
  function onChangeContent(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setNote((prev) => ({ ...prev, content: event.target.value }));
    setIsDirty(true);
  }
  function saveNote() {
    const saved = updateNote(note);
    setNote(saved);
    setIsDirty(false);
  }
  function deleteNote_() {
    if (!confirm("削除しますか?")) return;
    deleteNote(id);
    flushSync(() => {
      setIsDirty(false);
    });
    navigate("/list");
  }
  return (
    <>
      <div className={styles.bar}>
        <Link to="/list" className={styles.btn}>
          戻る
        </Link>
        <p>{note?.date}</p>
      </div>
      <div className={styles.content}>
        <input
          type="text"
          value={note?.title}
          onChange={onChangeTitle}
          placeholder="タイトル"
        />
        <textarea
          value={note?.content}
          onChange={onChangeContent}
          placeholder="内容"
        />
      </div>
      <div className={styles.bar}>
        <div onClick={saveNote} className={styles.btn}>
          保存
        </div>
        <div onClick={deleteNote_} className={styles.btn}>
          削除
        </div>
      </div>
    </>
  );
}
