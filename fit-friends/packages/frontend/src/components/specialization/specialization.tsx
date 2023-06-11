import {TrainingType, USER_MAX_TRAINING_TYPE_COUNT} from '@fit-friends/core';
import {SpecializationCheckbox} from './specialization-checkbox';
import {useState} from 'react';

interface SpecializationProps {
  additionalClass?: string;
  value?: TrainingType[];
  onChange?: (evt: TrainingType[]) => void;
}

export function Specialization({additionalClass = '', value = [], onChange = () => ({})}: SpecializationProps) {
  const specializations = Object.values(TrainingType);

  const handleChange = (evt: { value: TrainingType, checked: boolean }) => {
    if (evt.checked && value.length < USER_MAX_TRAINING_TYPE_COUNT) {
      onChange([...value, evt.value]);
    } else if (!evt.checked) {
      onChange(value.filter(
        (specialization) => specialization !== evt.value
      ));
    }
  }

  return (
    <div className={`specialization-checkbox ${additionalClass}`}>
      {specializations.map(
        (specialization) => (
          <SpecializationCheckbox key={specialization} checked={value.includes(specialization)}
                                                    value={specialization} onChange={handleChange}/>
        )
      )}
    </div>
  );
}
