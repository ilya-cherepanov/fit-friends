import {BACKEND_STATIC_URL} from '../../constants';
import {ChangeEventHandler, FocusEvent} from 'react';
import classNames from 'classnames';


interface AvatarInputProps {
  preview?: string;
  value?: File;
  name: string;
  readonly?: boolean;
  onChange: (evt: File) => void;
  onBlur: (evt: FocusEvent<HTMLInputElement>) => void;
}


export function AvatarInput({preview, value, onChange, readonly, name, onBlur}: AvatarInputProps) {
  const imageSrc = (preview && `${BACKEND_STATIC_URL}/${preview}`) ?? (value && URL.createObjectURL(value));

  const handleChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    if (evt.target.files && evt.target.files.length > 0 && !readonly) {
      onChange(evt.target.files[0]);
    }
  };

  return (
    <div className="input-load-avatar">
      <label>
        <input className="visually-hidden" type="file" name={name} accept="image/png, image/jpeg" onChange={handleChange} readOnly={readonly} onBlur={onBlur}/>
        <span className={classNames({'input-load-avatar__avatar': !!imageSrc, 'input-load-avatar__btn': !imageSrc})}>
          {!imageSrc && (
            <svg width="20" height="20" aria-hidden="true">
              <use xlinkHref="#icon-import"></use>
            </svg>
          )}
          {imageSrc && <img src={imageSrc} width="98" height="98" alt="Аватар пользователя"/>}
        </span>
      </label>
    </div>
  );
}
