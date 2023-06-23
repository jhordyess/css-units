import { useState } from 'react';
import { convert } from './math';
import { LengthUnit, Field } from './utils';

type converterState = {
  left: { value: string, unit: LengthUnit },
  right: { value: string, unit: LengthUnit },
}

const defConverterVals: converterState = {
  left: {
    value: "96",
    unit: LengthUnit.Pixel
  },
  right: {
    value: "1",
    unit: LengthUnit.Inch
  }
}

export const useConverterHook = (initialState: converterState = defConverterVals) => {
  const [lengthLeft, setLengthLeft] = useState(initialState.left);

  const [lengthRight, setLengthRight] = useState(initialState.right);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>, field: Field) => {
    const { value: inputValue } = e.target;

    const isLeft = field === Field.Left // True is left, False is right

    const convertedValue = convert(
      inputValue,
      isLeft ? lengthLeft.unit : lengthRight.unit,
      isLeft ? lengthRight.unit : lengthLeft.unit
    );

    setLengthLeft((prev) => ({
      ...prev,
      value: isLeft ? inputValue : convertedValue,
    }));

    setLengthRight((prev) => ({
      ...prev,
      value: isLeft ? convertedValue : inputValue,
    }));
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>, field: Field) => {
    const selectedUnit = e.target.value as LengthUnit;

    if (field === Field.Left) {

      const isRightUnit = lengthRight.unit === selectedUnit

      const convertedValue = convert(
        lengthLeft.value,
        isRightUnit ? lengthRight.unit : selectedUnit,
        isRightUnit ? lengthLeft.unit : lengthRight.unit
      );

      setLengthRight((prev) => ({
        ...prev,
        value: convertedValue,
        unit: isRightUnit ? lengthLeft.unit : lengthRight.unit // lengthRight.unit unnecessary
      }));

      setLengthLeft((prev) => ({
        ...prev,
        unit: selectedUnit,
      }));
    } else if (field === Field.Right) {

      const isLeftUnit = lengthLeft.unit === selectedUnit

      const convertedValue = convert(
        isLeftUnit ? lengthLeft.value : lengthRight.value,
        lengthRight.unit,
        selectedUnit
      )

      setLengthLeft((prev) => ({
        ...prev,
        unit: isLeftUnit ? lengthRight.unit : lengthLeft.unit // lengthLeft.unit unnecessary
      }));

      setLengthRight((prev) => ({
        ...prev,
        value: convertedValue,
        unit: selectedUnit,
      }));
    }
  };

  return {
    leftField: {
      value: lengthLeft.value,
      handleValueChange: (e: React.ChangeEvent<HTMLInputElement>) => { handleValueChange(e, Field.Left) },
      unit: lengthLeft.unit,
      handleUnitChange: (e: React.ChangeEvent<HTMLSelectElement>) => { handleUnitChange(e, Field.Left) }
    },
    rightField: {
      value: lengthRight.value,
      handleValueChange: (e: React.ChangeEvent<HTMLInputElement>) => { handleValueChange(e, Field.Right) },
      unit: lengthRight.unit,
      handleUnitChange: (e: React.ChangeEvent<HTMLSelectElement>) => { handleUnitChange(e, Field.Right) }
    },
  }
}