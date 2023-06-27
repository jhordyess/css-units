import { LengthUnit, LengthUnitArr, fixUnit } from './utils'
import { useConverterHook } from './hooks'
import { FocusEvent, useState } from 'react'
import RangeInput from './Components/RangeInput'

const rangeValues: {
  [key in LengthUnit]: { rangeMinStep: number; inputStep: number; factor: number }
} = {
  [LengthUnit.Centimeter]: {
    factor: 10,
    inputStep: 1,
    rangeMinStep: 1
  },
  [LengthUnit.Millimeter]: {
    factor: 10,
    inputStep: 10,
    rangeMinStep: 10
  },
  [LengthUnit.QuarterMillimeter]: {
    factor: 10,
    inputStep: 40,
    rangeMinStep: 40
  },
  [LengthUnit.Inch]: {
    factor: 8,
    inputStep: 0.5,
    rangeMinStep: 0.5
  },
  [LengthUnit.Pica]: {
    factor: 12,
    inputStep: 2,
    rangeMinStep: 4
  },
  [LengthUnit.Point]: {
    factor: 12,
    inputStep: 24,
    rangeMinStep: 48
  },
  [LengthUnit.Pixel]: {
    factor: 12,
    inputStep: 32,
    rangeMinStep: 64
  }
}

export default function Home() {
  const { leftField, rightField, rangeField } = useConverterHook()

  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  )

  if (typeof window !== 'undefined') {
    window.addEventListener('resize', () => {
      setViewportWidth(window.innerWidth)
    })
  }

  const autoSelect = (e: FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }

  const maxWidth = viewportWidth < 640 ? viewportWidth - 24 * 2 : viewportWidth - 48 * 2

  return (
    <main className="min-h-screen w-full p-6 sm:p-12 bg-blue-100">
      <h1 className="text-3xl font-bold py-8 text-center">CSS Units</h1>
      <section className="w-full">
        <div className="max-w-md mx-auto mb-8">
          <div className="w-full flex gap-4 justify-center flex-wrap">
            <input
              className="border py-1 p-2 w-24 focus:border-red"
              placeholder="Insert value"
              value={leftField.value}
              onChange={leftField.handleValueChange}
              min="0"
              type="number"
              step={rangeValues[leftField.unit].inputStep}
              onFocus={autoSelect}
            />
            <select
              value={leftField.unit}
              onChange={leftField.handleUnitChange}
              className="py-1 px-2 w-16"
            >
              {LengthUnitArr.map(({ name, value, label }) => (
                <option value={value} title={name} key={value}>
                  {label}
                </option>
              ))}
            </select>
            <input
              className="border py-1 px-2 w-24 focus:border-red"
              placeholder="Insert value"
              value={rightField.value}
              onChange={rightField.handleValueChange}
              min="0"
              type="number"
              step={rangeValues[rightField.unit].inputStep}
              onFocus={autoSelect}
            />
            <select
              value={rightField.unit}
              onChange={rightField.handleUnitChange}
              className="py-1 px-2 w-16"
            >
              {LengthUnitArr.map(({ name, value, label }) => (
                <option value={value} title={name} key={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="min-w-[240px] max-w-lg mx-auto my-8">
          <div className="w-full mt-6 flex flex-col gap-6">
            <RangeInput
              maxBoxWidth={maxWidth}
              unit={leftField.unit}
              value={leftField.value}
              handleRange={rangeField.handleRangeLeft}
              id="lin"
              step={rangeValues[leftField.unit].rangeMinStep}
              factor={rangeValues[leftField.unit].factor}
            />
            <RangeInput
              maxBoxWidth={maxWidth}
              unit={rightField.unit}
              value={rightField.value}
              handleRange={rangeField.handleRangeRight}
              id="rin"
              step={rangeValues[rightField.unit].rangeMinStep}
              factor={rangeValues[leftField.unit].factor}
            />
          </div>
        </div>
        <div className="w-full overflow-x-auto">
          <div
            className="h-32 w-24 bg-orange-200"
            style={{ width: `${leftField.value}${fixUnit(leftField.unit)}` }}
          />
        </div>
      </section>
    </main>
  )
}
