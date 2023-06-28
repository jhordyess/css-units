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
    (_: number, index: number) => index * newStep
  )

  const percent = (100 * (maxBoxWidth % newStep)) / maxBoxWidth

  return { list, percent }
}

export default function RangeInput({
  maxBoxWidth,
  unit,
  id = 'unk',
  step,
  factor,
  className = ''
}: {
  id: string
  unit: LengthUnit
  maxBoxWidth: number
  step: number
  factor: number
  className?: string
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
    <ul
      className={`flex w-full justify-between text-sm ${className}`}
      style={{
        paddingRight: String(percent) + '%' || 0
      }}
    >
      {list.map((value, index) => (
        <li key={id + '-' + index} className="relative h-6 border-l border-black">
          <span className="absolute left-1">{String(value)}</span>
        </li>
      ))}
    </ul>
  )
}
