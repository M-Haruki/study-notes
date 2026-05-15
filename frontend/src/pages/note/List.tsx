import NoteThumbnail from "../../components/NoteThumbnail";
import styles from "./List.module.scss";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import apiClient from "../../lib/axios";
import type { NoteSmall } from "../../types";

export default function List() {
  const [notes, setNotes] = useState(() => [] as NoteSmall[]);
  const noteDoms = notes.map((note) => (
    <NoteThumbnail note={note} key={note.id} />
  ));

  const navigate = useNavigate();
  useEffect(() => {
    apiClient
      .get("/note/list")
      .then((res) => {
        type Res = {
          id: string;
          title: string;
          updated_at: string;
        };
        const data = res.data as Res[];
        setNotes(
          data.map((d) => {
            return {
              ...d,
              updated_at: new Date(d.updated_at),
            };
          }),
        );
      })
      .catch(() => {
        alert("ノートの取得に失敗しました。");
        navigate("/user/login");
      });
  }, [setNotes, navigate]);

  function newNote() {
    apiClient
      .post("/note/new")
      .then((res) => {
        type Res = {
          id: string;
        };
        const data = res.data as Res;
        navigate(`/note/detail/${data.id}`);
      })
      .catch(() => {
        alert("ノートの作成に失敗しました。");
      });
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
