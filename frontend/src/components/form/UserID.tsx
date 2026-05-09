export function UserIDInput({ label, name }: { label: string; name: string }) {
  return (
    <div>
      <label htmlFor="user_id">{label}</label>
      <input
        name={name}
        type="text"
        maxLength={16}
        minLength={3}
        pattern="^[A-Za-z0-9]{3,16}$"
      />
    </div>
  );
}
