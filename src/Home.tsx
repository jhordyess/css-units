import { fixUnit, rangeValues } from './utils'
import { useConverterHook } from './hooks'
import RangeInput from './Components/Rule'
import InputBox from './Components/InputBox'

export default function Home() {
  const { leftField, rightField, maxWidth, boxDiv } = useConverterHook()

  return (
    <main className="min-h-screen w-full bg-classy-background p-6 sm:p-12">
      <h1 className="pb-6 text-center text-3xl font-bold">CSS Units</h1>
      <h2 className="pb-6 text-center text-xl font-bold">Absolute units</h2>
      <section className="mx-auto mb-6 flex max-w-lg flex-wrap justify-center gap-8">
        <InputBox
          handleUnit={leftField.handleUnitChange}
          handleValue={leftField.handleValueChange}
          unit={leftField.unit}
          value={leftField.value}
          step={rangeValues[leftField.unit].inputStep}
        />
        <InputBox
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
            className={`h-32 w-24 border-r border-dashed border-classy-primary bg-classy-base ${
              boxDiv.isMax ? 'animate-pulse' : ''
            }`}
            style={{ width: `${leftField.value}${fixUnit(leftField.unit)}` || 0 }}
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
      <footer className="w-full pt-6 text-center">
        Made with 💪 by&nbsp;
        <a
          href="https://www.jhordyess.com"
          target="_blank"
          className="text-classy-link hover:text-classy-hover"
        >
          Jhordyess
        </a>
        <br />
        <a
          href="https://github.com/jhordyess/css-units"
          target="_blank"
          className="text-classy-link hover:text-classy-hover"
        >
          👉 View on GitHub
        </a>
      </footer>
    </main>
  )
}
