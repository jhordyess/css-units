import { rangeValues, fixUnit } from './utils'
import { useConverterHook } from './hooks'
import { useState } from 'react'
import RangeInput from './Components/Rule'
import InputBox from './Components/InputBox'

export default function Home() {
  const { leftField, rightField } = useConverterHook()

  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  )

  if (typeof window !== 'undefined') {
    window.addEventListener('resize', () => {
      setViewportWidth(window.innerWidth)
    })
  }

  const maxWidth = viewportWidth < 640 ? viewportWidth - 24 * 2 : viewportWidth - 48 * 2

  return (
    <main className="min-h-screen w-full bg-classy-background p-6 sm:p-12">
      <h1 className="py-8 text-center text-3xl font-bold">CSS Units</h1>
      <section className="mx-auto mb-8 flex max-w-lg flex-wrap justify-center gap-8">
        <InputBox
          className=""
          handleUnit={leftField.handleUnitChange}
          handleValue={leftField.handleValueChange}
          unit={leftField.unit}
          value={leftField.value}
          step={rangeValues[leftField.unit].inputStep}
        />
        <InputBox
          className=""
          handleUnit={rightField.handleUnitChange}
          handleValue={rightField.handleValueChange}
          unit={rightField.unit}
          value={rightField.value}
          step={rangeValues[rightField.unit].inputStep}
        />
      </section>
      <section className="w-full overflow-x-hidden">
        <RangeInput
          maxBoxWidth={maxWidth}
          unit={leftField.unit}
          id="lin"
          step={rangeValues[leftField.unit].rangeMinStep}
          factor={rangeValues[leftField.unit].factor}
        />
        <div className="border border-black bg-classy-accent">
          <div
            className="h-32 w-24 border-r-2 border-dashed border-classy-primary bg-classy-base"
            style={{ width: `${leftField.value}${fixUnit(leftField.unit)}` }}
          />
        </div>
        <RangeInput
          maxBoxWidth={maxWidth}
          unit={rightField.unit}
          id="rin"
          step={rangeValues[rightField.unit].rangeMinStep}
          factor={rangeValues[rightField.unit].factor}
        />
      </section>
    </main>
  )
}
