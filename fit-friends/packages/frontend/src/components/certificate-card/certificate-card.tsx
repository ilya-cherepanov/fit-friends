import {useEffect, useRef, useState} from 'react';
import classNames from 'classnames';
import {getDocument} from 'pdfjs-dist';
import {BACKEND_STATIC_URL} from '../../constants';


interface CertificateCardProps {
  certificate: string;
}

export function CertificateCard({certificate}: CertificateCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    (async () => {
      if (!canvasRef.current) {
        return;
      }

      const pdfDocument = await getDocument(`${BACKEND_STATIC_URL}/${certificate}`).promise;
      const page = await pdfDocument.getPage(1);

      const context = canvasRef.current.getContext('2d');
      if (!context) {
        return;
      }

      const viewport = page.getViewport();

      await page.render({canvasContext: context, viewport}).promise;
    })()

  }, [certificate]);

  return (
    <div className={classNames('certificate-card', {'certificate-card--edit': isEditing})}>
      <div className="certificate-card__image">
        <canvas width="294" height="360" ref={canvasRef}/>
      </div>
      <div className="certificate-card__buttons">
        <button
          className="btn-flat btn-flat--underlined certificate-card__button certificate-card__button--edit"
          type="button">
          <svg width="12" height="12" aria-hidden="true">
            <use xlinkHref="#icon-edit"></use>
          </svg>
          <span>Изменить</span>
        </button>
        <button
          className="btn-flat btn-flat--underlined certificate-card__button certificate-card__button--save"
          type="button">
          <svg width="12" height="12" aria-hidden="true">
            <use xlinkHref="#icon-edit"></use>
          </svg>
          <span>Сохранить</span>
        </button>
        <div className="certificate-card__controls">
          <button className="btn-icon certificate-card__control" type="button" aria-label="next">
            <svg width="16" height="16" aria-hidden="true">
              <use xlinkHref="#icon-change"></use>
            </svg>
          </button>
          <button className="btn-icon certificate-card__control" type="button" aria-label="next">
            <svg width="14" height="16" aria-hidden="true">
              <use xlinkHref="#icon-trash"></use>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
