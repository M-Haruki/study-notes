import { load } from "../utils/storage";
import NoteThumbnail from "../components/NoteThumbnail";

export default function List() {
  const notes = load();
  const noteDoms = notes.map((note) => <NoteThumbnail note={note} />);
  return (
    <>
      <h1>メモ一覧</h1>
      {noteDoms}
    </>
  );
}
