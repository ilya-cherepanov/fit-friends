import {Range, getTrackBackground} from 'react-range';
import classNames from 'classnames';
import {useEffect, useState} from 'react';

interface FilterRange {
  min?: number;
  max?: number;
  step?: number;
  value: [number, number];
  onChange: (evt: [number, number]) => void;
  isRating?: boolean;
}

export function FilterRange({min = 0, max = 100, step = 1, isRating = false, value, onChange}: FilterRange) {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  return (
    <Range renderTrack={({children, props}) => (
      <div {...props} className={`filter-${isRating ? 'raiting' : 'range'}`} style={{...props.style, width: '312px'}}>
        <div className={`filter-${isRating ? 'raiting' : 'range'}__scale`} style={{
          background: getTrackBackground({
            values: value,
            colors: ['#aeaeae', '#333', '#aeaeae'],
            min,
            max
          })
        }}>
          <div className={`filter-${isRating ? 'raiting' : 'range'}__bar`} style={{background: 'transparent'}}>
            <span className="visually-hidden">Полоса прокрутки</span>
          </div>
        </div>
        <div className={`filter-${isRating ? 'raiting' : 'range'}__control`}>
          {children}
        </div>
      </div>
    )} renderThumb={({index, props, value}) => (
      <>
        <button {...props} style={{...props.style, left: `${(value - min) / (max - min) * 296}px`}}
                className={classNames({
                  [`filter-${isRating ? 'raiting' : 'range'}__min-toggle`]: index === 0,
                  [`filter-${isRating ? 'raiting' : 'range'}__max-toggle`]: index === 1
                })} type="button">
          <span className="visually-hidden">{index === 0 ? 'Минимальное значение' : 'Максимальное значение'}</span>
        </button>
        {isRating && <span>{index === 0 ? min : max}</span>}
      </>
    )} values={internalValue} max={max} min={min} step={step} onChange={(values) => setInternalValue([values[0], values[1]])} onFinalChange={(values) => onChange([values[0], values[1]])}/>
  );
}
