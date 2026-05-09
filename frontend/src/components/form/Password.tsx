export function PasswordInput({
  label,
  name,
}: {
  label: string;
  name: string;
}) {
  // Validate
  function validators(value: string) {
    const bytes = new TextEncoder().encode(value).length;
    if (bytes < 8) return "8バイト以上で入力してください";
    if (bytes > 32) return "32バイト以下で入力してください";
    return "";
  }
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const message = validators(event.target.value);
    event.target.setCustomValidity(message);
    // event.target.reportValidity();
  }
  return (
    <div>
      <label htmlFor="password">{label}</label>
      <input name={name} type="password" onChange={handleChange} />
    </div>
  );
}
