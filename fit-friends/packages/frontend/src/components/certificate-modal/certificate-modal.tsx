import {Modal} from '../modal/modal';
import {useEffect, useRef} from 'react';
import {getDocument, GlobalWorkerOptions} from 'pdfjs-dist';
import {BACKEND_STATIC_URL} from '../../constants';
import {CoachResponse} from '@fit-friends/shared-types';


interface CertificateModalProps {
  onClose: () => void;
  coach: CoachResponse;
}


export function CertificateModal({onClose, coach}: CertificateModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    (async () => {
      if (!canvasRef.current) {
        return;
      }

      const pdfDocument = await getDocument(`${BACKEND_STATIC_URL}/${coach.certificate}`).promise;

      const page = await pdfDocument.getPage(1);

      const context = canvasRef.current.getContext('2d');
      if (!context) {
        return;
      }

      const viewport = page.getViewport();
      await page.render({canvasContext: context, viewport}).promise;
    })();
  }, [coach]);

  return (
    <Modal title="Сертификаты" onClose={onClose} classModifier="certificates">
      <>
        <div className="popup__slider-buttons">
          <button className="btn-icon popup__slider-btn popup__slider-btn--prev" type="button" aria-label="prev" disabled>
            <svg width="16" height="14" aria-hidden="true">
              <use xlinkHref="#arrow-left"></use>
            </svg>
          </button>
          <button className="btn-icon popup__slider-btn popup__slider-btn--next" type="button" aria-label="next" disabled>
            <svg width="16" height="14" aria-hidden="true">
              <use xlinkHref="#arrow-right"></use>
            </svg>
          </button>
        </div>
        <ul className="popup__slider-list">
          <li className="popup__slide popup__slide--current">
            <div className="popup__slide-img">
              <canvas ref={canvasRef} width="294" height="360"/>
            </div>
          </li>
        </ul>
      </>
    </Modal>
  );
}
