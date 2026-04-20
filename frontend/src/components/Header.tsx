import { Link } from "react-router-dom";
import styles from "./Header.module.scss";

export default function Header() {
  return (
    <div className={styles.header}>
      <Link to="/">
        <h1>Study Notes</h1>
      </Link>
      <a
        className={styles.link}
        href="https://github.com/M-Haruki/study-notes"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub
      </a>
    </div>
  );
}
