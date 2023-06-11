import {MouseEventHandler, ReactElement, useState} from 'react';
import classNames from 'classnames';
import {MAX_COUNT_NOT_EXPANDED_CONTAINER} from '../../constants';

interface ExpandingBoxProps {
  children: ReactElement[];
  additionalClass?: string;
  classPrefix: string;
  label: string;
}

export function ExpandingBox({children, additionalClass, classPrefix, label}: ExpandingBoxProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpandClick: MouseEventHandler<HTMLButtonElement> = (evt) => {
    evt.preventDefault();
    setIsExpanded(true);
  };

  return (
    <div className={classNames(`${classPrefix}-form__block`, additionalClass)}>
      <h4 className={`${classPrefix}-form__block-title`}>{label}</h4>
      <ul className={`${classPrefix}-form__check-list`}>
        {children.slice(0, !isExpanded ? MAX_COUNT_NOT_EXPANDED_CONTAINER : children.length).map((child) => (
          <li key={child.key} className={`${classPrefix}-form__check-list-item`}>
            {child}
          </li>
        ))}
      </ul>
      {!isExpanded && children.length > MAX_COUNT_NOT_EXPANDED_CONTAINER && (
        <button className={`btn-show-more ${classPrefix}-form__btn-show`} type="button" onClick={handleExpandClick}><span>Посмотреть все</span>
          <svg className="btn-show-more__icon" width="10" height="4" aria-hidden="true">
            <use xlinkHref="#arrow-down"></use>
          </svg>
        </button>
      )}
    </div>
  );
}
