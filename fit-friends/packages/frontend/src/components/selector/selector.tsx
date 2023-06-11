import classNames from 'classnames';
import {useState} from 'react';
import {Level, Location, TrainingTimeIntervals, TrainingType, UserSex} from '@fit-friends/core';

interface SelectorProps<T extends Location | UserSex | Level | TrainingTimeIntervals | TrainingType> {
  additionalClass?: string;
  readonly?: boolean;
  value: T | null;
  onChange: (evt: T) => void;
  options: T[];
  dictionary: {[key in T]: string};
  title: string;
  error?: string;
}

export function Selector<T extends Location | UserSex | Level | TrainingTimeIntervals | TrainingType>({additionalClass, readonly = false, value = null, ...props}: SelectorProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (evt: T) => {
    if (readonly) {
      return;
    }

    props.onChange(evt);
    setIsOpen(false);
  }

  const handleOpenClick = () => {
    if (readonly) {
      return;
    }

    setIsOpen(!isOpen);
  }

  return (
    // <div className="custom-select user-info-edit__select"><span
    <div className={classNames('custom-select', additionalClass, {'custom-select--readonly': readonly, 'is-open': isOpen})}><span
      className="custom-select__label">{props.title}</span>
      <div className="custom-select__placeholder">{value !== null ? props.dictionary[value] : ''}</div>
      <button className="custom-select__button" type="button" aria-label="Выберите одну из опций" onClick={handleOpenClick}><span
        className="custom-select__text"></span><span className="custom-select__icon">
                        <svg width="15" height="6" aria-hidden="true">
                          <use xlinkHref="#arrow-down"></use>
                        </svg></span></button>
      <ul className="custom-select__list" role="listbox">
        {props.options.map((option) => <li key={option} className="custom-select__item" onClick={() => handleOptionClick(option)}>{props.dictionary[option]}</li>)}
      </ul>
    </div>
  );
}
