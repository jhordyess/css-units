import { LengthUnit, LengthUnitArr, fixUnit } from './utils'
import { useConverterHook } from './hooks'
import { FocusEvent } from 'react'

const rangeValues: {
  [key in LengthUnit]: { range: number[]; max: number; step: number; rightPadding?: string }
} = {
  [LengthUnit.Centimeter]: {
    range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], //11 len
    max: 10.16, //384px to cm
    step: 0.5,
    rightPadding: '1.65%'
  },
  [LengthUnit.Millimeter]: {
    range: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100], //11 len
    max: 101.6, //384px to mm
    step: 5,
    rightPadding: '1.65%'
  },
  [LengthUnit.QuarterMillimeter]: {
    range: [0, 40, 80, 120, 160, 200, 240, 280, 320, 360, 400],
    max: 406.4, //384px to q
    step: 20,
    rightPadding: '1.65%'
  },
  [LengthUnit.Inch]: {
    range: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4],
    max: 4, //384px to in
    step: 0.25
  },
  [LengthUnit.Pica]: {
    // range: [0, 3, 6, 9, 12, 15, 18, 21, 24],
    range: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24],
    max: 24, //384px to pc
    step: 1
  },
  [LengthUnit.Point]: {
    // range: [0, 36, 72, 108, 144, 180, 216, 252, 288],
    range: [0, 24, 48, 72, 96, 120, 144, 168, 192, 216, 240, 264, 288],
    max: 288, //384px to pt
    step: 12
  },
  [LengthUnit.Pixel]: {
    // range: [0, 48, 96, 144, 192, 240, 288, 336, 384],
    range: [0, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384],
    max: 384, //384px to px
    step: 16
  }
}

export default function Home() {
  const { leftField, rightField, rangeField } = useConverterHook()

  const autoSelect = (e: FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }

  return (
    <main className="min-h-screen w-full p-12 bg-blue-100">
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
              step={rangeValues[leftField.unit].step}
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
              step={rangeValues[rightField.unit].step}
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
        <div className="w-full mt-6 flex flex-col gap-6">
          <div>
            <input
              className="w-full"
              type="range"
              list="markersL"
              min="0"
              max={rangeValues[leftField.unit].max}
              step="0.01"
              value={leftField.value || '0'}
              onChange={rangeField.handleRangeLeft}
            />
            <datalist
              id="markersL"
              className="w-full flex flex-col justify-between"
              style={{
                writingMode: 'vertical-lr',
                paddingRight: rangeValues[leftField.unit].rightPadding || 0
              }}
            >
              {rangeValues[leftField.unit].range.map((item, index) => (
                <option
                  key={'rgnL-' + index}
                  value={item}
                  label={String(item)}
                  className={`flex justify-center p-0 m-0 ${
                    (index + 1) % 2 === 0 ? 'md:block hidden' : 'block'
                  }`}
                  style={{ transform: 'rotate(-90deg)' }}
                />
              ))}
            </datalist>
          </div>
          <div>
            <input
              className="w-full"
              type="range"
              list="markersR"
              min="0"
              max={rangeValues[rightField.unit].max}
              step="0.01"
              value={rightField.value || '0'}
              onChange={rangeField.handleRangeRight}
            />
            <datalist
              id="markersR"
              className="w-full flex flex-col justify-between"
              style={{
                writingMode: 'vertical-lr',
                paddingRight: rangeValues[rightField.unit].rightPadding || 0
              }}
            >
              {rangeValues[rightField.unit].range.map((item, index) => (
                <option
                  key={'rgnR-' + index}
                  value={item}
                  label={String(item)}
                  className={`flex justify-center p-0 m-0 ${
                    (index + 1) % 2 === 0 ? 'md:block hidden' : 'block'
                  }`}
                  style={{ transform: 'rotate(-90deg)' }}
                />
              ))}
            </datalist>
          </div>
        </div>
        <div className="w-full overflow-x-auto border p-2">
          <div
            className="h-60 w-24 border border-red-300"
            style={{ width: `${leftField.value}${fixUnit(leftField.unit)}` }}
          />
        </div>
      </section>
    </main>
  )
}
