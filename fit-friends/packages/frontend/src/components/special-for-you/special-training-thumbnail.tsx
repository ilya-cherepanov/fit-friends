import {TrainingType} from '@fit-friends/core';
import {random} from 'lodash';
import {Link} from 'react-router-dom';

interface SpecialTrainingThumbnailProps {
  trainingType: TrainingType;
}

export function SpecialTrainingThumbnail({trainingType}: SpecialTrainingThumbnailProps) {
  const imageNumber = random(1, 3);

  return (
    <div className="thumbnail-preview">
      <div className="thumbnail-preview__image">
        <picture>
          <source type="image/webp"
                  srcSet={`img/content/thumbnails/preview-0${imageNumber}.webp, img/content/thumbnails/preview-0${imageNumber}@2x.webp 2x`} />
          <img src={`img/content/thumbnails/preview-0${imageNumber}.jpg`}
               srcSet={`img/content/thumbnails/preview-0${imageNumber}@2x.jpg 2x`} width="452" height="191" alt=""/>
        </picture>
      </div>
      <div className="thumbnail-preview__inner">
        <h3 className="thumbnail-preview__title">{trainingType}</h3>
        <div className="thumbnail-preview__button-wrapper">
          <Link className="btn btn--small thumbnail-preview__button" to="fit-friends/packages/frontend/src/page/main#">Подробнее</Link>
        </div>
      </div>
    </div>
  );
}
