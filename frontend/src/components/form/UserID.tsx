import styles from "./Form.module.scss";

export function UserIDInput({ label, name }: { label: string; name: string }) {
  return (
    <div className={styles.input}>
      <label htmlFor="user_id">{label}</label>
      <input
        name={name}
        placeholder="半角英数字3~16字"
        type="text"
        maxLength={16}
        minLength={3}
        pattern="^[A-Za-z0-9]{3,16}$"
      />
    </div>
  );
}
