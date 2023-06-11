import classNames from 'classnames';
import {ChangeEventHandler} from 'react';


interface TextFieldProps {
  label?: string;
  additionalClass?: string;
  readonly?: boolean;
  error?: string;
  value?: string;
  name: string;
  onChange: (evt: string) => void
}


export function TextareaField({readonly = false, error, label, ...props}: TextFieldProps) {
  const classes = classNames(
    'custom-textarea',
    props.additionalClass,
    {
      'custom-textarea--readonly': readonly,
      'custom-input--error': !!error,
    }
  );

  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (evt) => {
    props.onChange(evt.target.value);
  }

  return (
    <div className={classes}>
      <label>{label && <span className="custom-textarea__label">{label}</span>}
        <textarea name={props.name} placeholder=" " onChange={handleChange} value={props.value} readOnly={readonly}></textarea>
        {error && <span className="custom-textarea__error">{error}</span>}
      </label>
    </div>
  );
}
