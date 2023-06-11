import {MouseEventHandler} from 'react';

interface QuantityFieldProps {
  value: number;
  onChange: (evt: number) => void;
  min?: number;
  max?: number;
}

export function QuantityField({value, onChange, min, max}: QuantityFieldProps) {
  const handleChange = (newValue: number) => {
    if (max && newValue > max) {
      return;
    }
    if (min && newValue < min) {
      return;
    }

    onChange(newValue);
  };

  return (
    <div className="input-quantity">
      <button className="btn-icon btn-icon--quantity" type="button" aria-label="minus" onClick={() => handleChange(value - 1)}>
        <svg width="12" height="12" aria-hidden="true">
          <use xlinkHref="#icon-minus"></use>
        </svg>
      </button>
      <div className="input-quantity__input">
        <label>
          <input type="number" value={value} size={2} readOnly/>
        </label>
      </div>
      <button className="btn-icon btn-icon--quantity" type="button" aria-label="plus" onClick={() => handleChange(value + 1)}>
        <svg width="12" height="12" aria-hidden="true">
          <use xlinkHref="#icon-plus"></use>
        </svg>
      </button>
    </div>
  );
}
