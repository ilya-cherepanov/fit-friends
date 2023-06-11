
interface CheckboxFieldProps {
  name: string;
  value: string;
  label: string;
  onChange: (evt: string) => string;
  checked: boolean;
}

export function CheckboxField({name, value, label, onChange, checked}: CheckboxFieldProps) {
  return (
    <div className="custom-toggle custom-toggle--checkbox">
      <label>
        <input type="checkbox" value={value} name={name} checked={checked}/><span className="custom-toggle__icon">
            <svg width="9" height="6" aria-hidden="true">
              <use xlinkHref="#arrow-check"></use>
            </svg></span><span className="custom-toggle__label">{label}</span>
      </label>
    </div>
  );
}
