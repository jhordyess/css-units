import { LengthUnitArr, LengthUnit } from '../utils'

export default function InputBox({
  value,
  handleValue,
  unit,
  handleUnit,
  step,
  className = ''
}: {
  value: string
  handleValue: (e: React.ChangeEvent<HTMLInputElement>) => void
  unit: LengthUnit
  handleUnit: (e: React.ChangeEvent<HTMLSelectElement>) => void
  step: number
  className?: string
}) {
  return (
    <div
      className={
        'flex items-center rounded-md border border-classy-accent bg-classy-base px-2 text-sm sm:text-base' +
        className
      }
    >
      <input
        placeholder="Insert value"
        className="w-16 bg-transparent py-1 pr-2 outline-none sm:w-24"
        value={value}
        onChange={handleValue}
        min="0"
        type="number"
        step={step}
        onFocus={e => {
          e.target.select()
        }}
      />
      <div className="h-6 border-l border-classy-accent "></div>
      <select value={unit} onChange={handleUnit} className="h-6 w-14 bg-transparent pl-2">
        {LengthUnitArr.map(({ name, value, label }) => (
          <option value={value} title={name} key={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  )
}
