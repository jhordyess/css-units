import { convert } from '../math'
import { LengthUnit } from '../utils'

const generate = ({
  maxBoxWidth,
  step,
  factor
}: {
  maxBoxWidth: number
  step: number
  factor: number
}): { list: number[]; percent: number } => {
  const maximumValue = Math.floor(maxBoxWidth / step) * step

  const newStep = Math.ceil(maximumValue / factor / step) * step

  const list = Array.from(
    {
      length: maxBoxWidth / newStep + 1
    },
    (_: any, index: number) => index * newStep
  )

  const percent = (100 * (maxBoxWidth % newStep)) / maxBoxWidth

  return { list, percent }
}

export default function RangeInput({
  maxBoxWidth,
  unit,
  value,
  id = 'unk',
  handleRange,
  step,
  factor
}: {
  id: string
  unit: LengthUnit
  value?: string
  handleRange: (e: React.ChangeEvent<HTMLInputElement>) => void
  maxBoxWidth: number
  step: number
  factor: number
}) {
  factor =
    maxBoxWidth <= 420 &&
    (unit === LengthUnit.Centimeter ||
      unit === LengthUnit.Millimeter ||
      unit === LengthUnit.QuarterMillimeter)
      ? factor / 2
      : factor
  if (unit !== LengthUnit.Pixel)
    maxBoxWidth = Number(convert(String(maxBoxWidth), LengthUnit.Pixel, unit))
  const { list, percent } = generate({ maxBoxWidth, step, factor })

  return (
    <div>
      <input
        className="w-full"
        type="range"
        list={'marks-' + id}
        min="0"
        max={maxBoxWidth}
        step="0.01"
        value={value || '0'}
        onChange={handleRange}
      />
      <datalist
        id={'marks-' + id}
        className="w-full flex flex-col justify-between text-sm sm:text-base"
        style={{
          writingMode: 'vertical-lr',
          paddingRight: String(percent) + '%' || 0
        }}
      >
        {list.map((value, index) => (
          <option
            key={id + '-' + index}
            value={String(value)}
            label={String(value)}
            className="flex justify-center p-0 m-0"
            style={{ transform: 'rotate(-90deg)' }}
          />
        ))}
      </datalist>
    </div>
  )
}
