import { useParams, Link, useNavigate, useBlocker } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./Detail.module.scss";
import { flushSync } from "react-dom";
import type { Note } from "../../types";
import apiClient from "../../lib/axios";

export default function Detail() {
  // 定数定義
  const id = useParams().id as string; // URLからidを取得(routerの制約により、idは必ず値を持つ)
  const [note, setNote] = useState(() => {
    return {
      id: "",
      title: "loading",
      content: "loading",
      updated_at: new Date(0),
      created_at: new Date(0),
    } as Note;
  });
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
    apiClient
      .get(`/note?id=${id}`)
      .then((res) => {
        type Res = {
          id: string;
          title: string;
          content: string;
          updated_at: string;
          created_at: string;
        };
        const data = res.data as Res;
        setNote({
          ...data,
          updated_at: new Date(data.updated_at),
          created_at: new Date(data.created_at),
        });
      })
      .catch(() => {
        alert("ノートの取得に失敗しました。");
        navigate("/note/list");
      });
  }, [navigate, setNote, id]);
  // func
  function onChangeTitle(event: React.ChangeEvent<HTMLInputElement>) {
    setNote((prev) => ({ ...prev, title: event.target.value }));
    setIsDirty(true);
  }
  function onChangeContent(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setNote((prev) => ({ ...prev, content: event.target.value }));
    setIsDirty(true);
  }
  function doSaveNote() {
    apiClient
      .patch(`/note?id=${id}`, {
        title: note.title,
        content: note.content,
      })
      .then((res) => {
        type Res = {
          id: string;
          title: string;
          content: string;
          updated_at: string;
          created_at: string;
        };
        const data = res.data as Res;
        setNote({
          ...data,
          updated_at: new Date(data.updated_at),
          created_at: new Date(data.created_at),
        });
        setIsDirty(false);
      })
      .catch(() => {
        alert("ノートの更新に失敗しました。");
      });
  }
  function doDeleteNote() {
    if (!confirm("削除しますか?")) return;
    // deleteNote(id);
    apiClient
      .delete(`/note?id=${id}`)
      .then(() => {
        flushSync(() => {
          setIsDirty(false);
        });
        navigate("/note/list");
      })
      .catch(() => {
        alert("ノートの削除に失敗しました。");
        navigate("/note/list");
      });
  }
  return (
    <>
      <div className={styles.bar}>
        <Link to="/note/list" className={styles.btn}>
          戻る
        </Link>
        <div>
          <p>更新時刻 {note.updated_at.toLocaleString()}</p>
          <p>作成時刻 {note.created_at.toLocaleString()}</p>
        </div>
      </div>
      <div className={styles.content}>
        <input
          type="text"
          value={note.title}
          onChange={onChangeTitle}
          placeholder="タイトル"
        />
        <textarea
          value={note.content}
          onChange={onChangeContent}
          placeholder="内容"
        />
      </div>
      <div className={styles.bar}>
        <button onClick={doSaveNote} className={styles.btn} disabled={!isDirty}>
          保存
        </button>
        <button onClick={doDeleteNote} className={styles.btn}>
          削除
        </button>
      </div>
    </>
  );
}
