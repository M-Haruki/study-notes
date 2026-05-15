import styles from "./Form.module.scss";
export function SubmitBtn({ label }: { label: string }) {
  return (
    <div className={styles.btn}>
      <button type="submit">{label}</button>
    </div>
  );
}
