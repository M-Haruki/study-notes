import type { Note } from "../types";
import { Link } from "react-router-dom";

export default function NoteThumbnail({ note }: { note: Note }) {
  return (
    <Link to={"/detail/" + note.id}>
      <div>
        <p>{note.title}</p>
      </div>
    </Link>
  );
}
