import {TrainingType} from '@fit-friends/core';
import {TrainingTypeRu} from '../../constants';

interface SpecializationCheckboxProps {
  checked?: boolean;
  value: TrainingType;
  onChange: (evt: {value: TrainingType, checked: boolean}) => void;
}

export function SpecializationCheckbox({checked = false, value, onChange}: SpecializationCheckboxProps) {
  return (
    <div className="btn-checkbox">
      <label>
        <input className="visually-hidden" type="checkbox" name="trainingType" value={value}
               checked={checked} onChange={() => onChange({value, checked: !checked})}/><span className="btn-checkbox__btn">{TrainingTypeRu[value]}</span>
      </label>
    </div>
  );
}
