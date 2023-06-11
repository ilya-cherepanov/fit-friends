import classNames from 'classnames';
import {ChangeEventHandler} from 'react';

interface TextFieldProps<T extends 'password' | 'text' | 'email' | 'number'> {
  label?: string;
  additionalText?: string;
  additionalTextRight?: boolean;
  additionalClass?: string;
  readonly?: boolean;
  error?: string;
  value?: T extends 'number' ? number : string;
  name: string;
  type: T;
  onChange: (evt: T extends 'number' ? number : string) => void;
}

export function TextField<T extends 'password' | 'text' | 'email' | 'number'>({readonly = false, error, label, ...props}: TextFieldProps<T>) {
  const classes = classNames(
    'custom-input',
    props.additionalClass,
    {
      'custom-input--with-text-left': props.additionalText && !props.additionalTextRight,
      'custom-input--with-text-right': props.additionalText && props.additionalText,
      'custom-input--readonly': readonly,
      'custom-input--error': !!error,
    }
  );

  const handleChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    props.onChange(evt.target.value as T extends 'number' ? number : string);
  }

  return (
    <div className={classes}>
      <label>{label && <span className="custom-input__label">{label}</span>}<span className="custom-input__wrapper">
        <input type={props.type} name={props.name} value={props.value} onChange={handleChange} readOnly={readonly} autoComplete="off"/>{props.additionalText && <span className="custom-input__text">{props.additionalText}</span>}</span>
        {error && <span className="custom-input__error">{error}</span>}
      </label>
    </div>
  );
}
