import {MouseEventHandler, useRef, useState} from 'react';
import classNames from 'classnames';

interface VideoPlayerProps {
  src: string;
  playable: boolean;
}

export function VideoPlayer({src, playable}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isActive, setIsActive] = useState(false)

  const handlePlayClick: MouseEventHandler = async (evt) => {
    evt.preventDefault();

    if (!videoRef.current) {
      return;
    }

    if (!isActive) {
      setIsActive(true);
      await videoRef.current.play();
    }
  };

  return (
    <div className="training-video__video">
      <div className="training-video__thumbnail">
        <video ref={videoRef} src={src} width="922" height="566" controls={isActive}/>
      </div>
      {!isActive && (
        <button className={classNames('training-video__play-button', 'btn-reset', {'is-disabled': !playable})} disabled={!playable} type="button" onClick={handlePlayClick}>
          <svg width="18" height="30" aria-hidden="true">
            <use xlinkHref="#icon-arrow"></use>
          </svg>
        </button>
      )}
    </div>
  );
}
