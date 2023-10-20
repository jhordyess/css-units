import { ChangeEvent, useState } from 'react'
import { convert, defaultPPI, updatePPI } from './math'
import { LengthUnit, Field } from './utils'

type ConverterState = {
  leftField: { value: string; unit: LengthUnit }
  rightField: { value: string; unit: LengthUnit }
  boxDiv: { width: number; isMax: boolean }
}

const defaultConverterValues: ConverterState = {
  leftField: {
    value: '1',
    unit: LengthUnit.Inch
  },
  rightField: {
    value: '96',
    unit: LengthUnit.Pixel
  },
  boxDiv: { width: 96, isMax: false }
}

type BoxPadding = {
  minWidth: number
  minPadding: number
  maxPadding: number
}

const defaultBoxPadding = {
  minWidth: 640,
  minPadding: 24,
  maxPadding: 48
}

export const useConverterHook = (
  boxPadding: BoxPadding = defaultBoxPadding,
  initialState: ConverterState = defaultConverterValues
) => {
  const [fields, setFields] = useState(initialState)

  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  )

  const [customPPI, setCustomPPI] = useState<{
    isEnable: boolean
    ppi: string
    screenDiagonal: string
    screenDiagonalUnit: LengthUnit.Inch | LengthUnit.Centimeter
  }>({
    isEnable: false,
    ppi: '96',
    screenDiagonal: '',
    screenDiagonalUnit: LengthUnit.Inch
  })

  const handleCustomPPI = (e: ChangeEvent<HTMLInputElement>) => {
    const screenDiagonal = e.target.value
    let ppi = customPPI.ppi
    if (screenDiagonal && typeof window !== 'undefined') {
      ppi = updatePPI(
        window.screen.width,
        window.screen.height,
        screenDiagonal,
        customPPI.screenDiagonalUnit
      )
      handleValueChange(fields.leftField.value, Field.Left)
    }

    setCustomPPI({
      ...customPPI,
      ppi,
      screenDiagonal
    })
  }

  const handleCustomPPIUnit = (e: ChangeEvent<HTMLSelectElement>) => {
    const screenDiagonalUnit = e.target.value as LengthUnit.Inch | LengthUnit.Centimeter
    let ppi = customPPI.ppi
    if (typeof window !== 'undefined') {
      ppi = updatePPI(
        window.screen.width,
        window.screen.height,
        customPPI.screenDiagonal,
        screenDiagonalUnit
      )
      handleValueChange(fields.leftField.value, Field.Left)
    }
    setCustomPPI({
      ...customPPI,
      ppi,
      screenDiagonalUnit
    })
  }

  const handleCustomPPIEnable = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked: isEnable } = e.target
    const updateCustomPPI: {
      screenDiagonalUnit?: LengthUnit.Inch | LengthUnit.Centimeter
      screenDiagonal?: string
      ppi?: string
    } = {}
    if (!isEnable) {
      if (customPPI.screenDiagonalUnit !== LengthUnit.Inch)
        updateCustomPPI['screenDiagonalUnit'] = LengthUnit.Inch
      if (customPPI.screenDiagonal !== '') updateCustomPPI['screenDiagonal'] = ''
      if (customPPI.ppi !== '96') {
        defaultPPI()
        handleValueChange(fields.leftField.value, Field.Left)
        updateCustomPPI['ppi'] = '96'
      }
    }
    setCustomPPI({
      ...customPPI,
      ...updateCustomPPI,
      isEnable
    })
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('resize', () => {
      setViewportWidth(window.innerWidth)
      // if (fields.boxDiv.width > maxWidth) {
      //   setFields({
      //     ...fields,
      //     boxDiv: { width: maxWidth, isMax: true }
      //   })
      // }
    })
  }

  const maxWidth =
    viewportWidth < boxPadding.minWidth
      ? viewportWidth - boxPadding.minPadding * 2
      : viewportWidth - boxPadding.maxPadding * 2

  // Handles value changes in the input fields
  const handleValueChange = (e: ChangeEvent<HTMLInputElement> | string, field: Field) => {
    const inputValue = typeof e === 'string' ? e : e.target.value

    const isLeft = field === Field.Left // True is left, False is right

    const { leftField, rightField } = fields

    const [sourceUnit, targetUnit] = isLeft
      ? [leftField.unit, rightField.unit]
      : [rightField.unit, leftField.unit]

    const convertedValue = convert(inputValue, sourceUnit, targetUnit)

    const [updatedLeftVal, updatedRightVal] = isLeft
      ? [inputValue, convertedValue]
      : [convertedValue, inputValue]

    const boxWidth =
      sourceUnit === LengthUnit.Pixel
        ? Number(inputValue)
        : Number(convert(inputValue, sourceUnit, LengthUnit.Pixel))
    const boxIsMax = boxWidth > maxWidth

    setFields({
      leftField: {
        ...leftField,
        value: updatedLeftVal
      },
      rightField: {
        ...rightField,
        value: updatedRightVal
      },
      boxDiv: { width: boxIsMax ? maxWidth : boxWidth, isMax: boxIsMax }
    })
  }

  // Handles unit changes in the dropdown select
  const handleUnitChange = (e: ChangeEvent<HTMLSelectElement>, field: Field) => {
    const selectedUnit = e.target.value as LengthUnit

    const { leftField, rightField } = fields

    const isLeft = field === Field.Left // True is left, False is right

    if (rightField.unit === selectedUnit || leftField.unit === selectedUnit)
      setFields({
        ...fields,
        rightField: { ...leftField },
        leftField: { ...rightField }
      })
    else {
      const sourceField = isLeft ? leftField : rightField

      const updatedField = {
        value: convert(sourceField.value, sourceField.unit, selectedUnit),
        unit: selectedUnit
      }

      const [updatedLeftField, updatedRightField] = isLeft
        ? [updatedField, rightField]
        : [leftField, updatedField]

      setFields({
        ...fields,
        leftField: { ...updatedLeftField },
        rightField: { ...updatedRightField }
      })
    }
  }

  return {
    leftField: {
      value: fields.leftField.value,
      handleValueChange: (e: ChangeEvent<HTMLInputElement>) => {
        handleValueChange(e, Field.Left)
      },
      unit: fields.leftField.unit,
      handleUnitChange: (e: ChangeEvent<HTMLSelectElement>) => {
        handleUnitChange(e, Field.Left)
      }
    },
    rightField: {
      value: fields.rightField.value,
      handleValueChange: (e: ChangeEvent<HTMLInputElement>) => {
        handleValueChange(e, Field.Right)
      },
      unit: fields.rightField.unit,
      handleUnitChange: (e: ChangeEvent<HTMLSelectElement>) => {
        handleUnitChange(e, Field.Right)
      }
    },
    boxDiv: fields.boxDiv,
    maxWidth,
    customPPI: {
      ...customPPI,
      handleDiagonalChange: handleCustomPPI,
      handleDiagonalUnitChange: handleCustomPPIUnit,
      handleEnableChange: handleCustomPPIEnable
    }
  }
}
