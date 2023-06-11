import {MouseEventHandler, ReactElement, ReactNode, useEffect} from 'react';
import classNames from 'classnames';
import {createPortal} from 'react-dom';


interface ModalProps {
  children: ReactNode,
  title: string;
  onClose: () => void;
  address?: string;
  classModifier?: string;
  map?: boolean;
}


export function Modal({title, children, onClose, address, classModifier, map = false}: ModalProps) {

  const handleEscKeydown = (evt: KeyboardEvent) => {
    if (evt.key === 'Escape') {
      onClose()
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleEscKeydown);

    return () => {
      document.removeEventListener('keydown', handleEscKeydown);
    };
  });

  const handleCloseClick: MouseEventHandler<HTMLButtonElement> = (evt) => {
    evt.preventDefault();
    onClose();
  };

  return createPortal(
    <div className={classNames('popup-form', {[`popup-form--${classModifier}`]: classModifier !== undefined})}>
      <section className="popup">
        <div
          className={classNames('popup__wrapper', {[`popup__wrapper--${classModifier}`]: classModifier !== undefined})}>
          <div className={classNames('popup-head', {[`popup-head--address`]: address !== undefined})}>
            <h2 className="popup-head__header">{title}</h2>
            {classModifier === 'map' && address && (
              <p className="popup-head__address">
                <svg className="popup-head__icon-location" width="12" height="14" aria-hidden="true">
                  <use xlinkHref="#icon-location"></use>
                </svg>
                <span>м. {address}</span>
              </p>
            )}
            <button className="btn-icon btn-icon--outlined btn-icon--big" type="button" aria-label="close" onClick={handleCloseClick}>
              <svg width="20" height="20" aria-hidden="true">
                <use xlinkHref="#icon-cross"></use>
              </svg>
            </button>
          </div>
          {/*<div className="popup__content-map">*/}
          <div className={classNames({
            'popup__content-map': classModifier === 'map',
            'popup__content': classModifier !== 'map',
            [`popup__content--${classModifier}`]: classModifier !== undefined && classModifier !== 'map',
          })}>
            {children}
          </div>
        </div>
      </section>
    </div>,
    document.getElementById('portal') as HTMLDivElement
  );
}
