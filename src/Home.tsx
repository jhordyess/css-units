import { LengthUnitArr, fixUnit } from "./utils"
import { useConverterHook } from "./hooks"

const rangeValues: {
  [key: string]: string[]
} = {
  "cm": ["0", "18.9", "37.8", "56.69", "96", "113.39", "188.98", "264.57", "377.95", "384"],//1 extra value
  "mm": ["0", "18.9", "37.8", "56.69", "96", "113.39", "188.98", "264.57", "377.95", "384"],//1 extra value
  "q": ["0", "18.9", "37.8", "56.69", "96", "113.39", "188.98", "264.57", "377.95", "384"],//1 extra value
  "in": ["0", "24", "48", "72", "96", "144", "192", "240", "384"],
  "pc": ["0", "16", "32", "64", "96", "128", "192", "256", "384"],
  "point": ["0", "16", "32", "64", "96", "128", "192", "256", "384"],
  "px": ["0", "16", "32", "64", "96", "128", "192", "256", "384"]
}

export default function Home() {
  const { leftField, rightField } = useConverterHook();

  return (
    <main className="min-h-screen w-full p-12 bg-blue-100">
      <h1 className="text-3xl font-bold py-8 text-center">
        CSS Units
      </h1>
      <section className="w-full">
        <div className="max-w-md mx-auto mb-8">
          <div className="w-full flex gap-6 justify-center flex-wrap">
            <input
              className="border py-1 px-2 w-20 focus:border-red"
              placeholder="Insert value"
              value={leftField.value}
              onChange={leftField.handleValueChange}
              min="0"
              type="number"
            />
            <select value={leftField.unit} onChange={leftField.handleUnitChange} className="py-1 px-2 w-20">
              {LengthUnitArr.map(({ name, value, label }) =>
                <option value={value} title={name} key={value}>{label}</option>
              )}
            </select>
            <input
              className="border py-1 px-2 w-20 focus:border-red"
              placeholder="Insert value"
              value={rightField.value}
              onChange={rightField.handleValueChange}
              min="0"
              type="number"
            />
            <select value={rightField.unit} onChange={rightField.handleUnitChange} className="py-1 px-2 w-20">
              {LengthUnitArr.map(({ name, value, label }) =>
                <option value={value} title={name} key={value}>{label}</option>
              )}
            </select>
          </div>
        </div>
        <div className="w-full mt-6">
          <div>
            <input
              className="w-full"
              type="range"
              list="markersL"
              max="384"
              min="0"
              value={leftField.value}
            // onChange={handleChange}
            />
            <datalist id="markersL" className="flex justify-around">
              {rangeValues[leftField.unit].map((item, index) =>
                <option key={"rgnL-" + index} value={item} ></option>
              )}
            </datalist>
          </div>

          <div>
            <input
              className="w-full"
              type="range"
              list="markersR"
              max="384"
              min="0"
              value={leftField.value}
            // onChange={handleChange}
            />
            <datalist id="markersR" className="flex justify-around">
              {rangeValues[leftField.unit].map((item, index) =>
                <option key={"rgnR-" + index} value={item} ></option>
              )}
            </datalist>
          </div>
        </div>
        <div className="w-full overflow-x-auto border p-2">
          <div className="h-60 w-24 border border-red-300" style={{ width: `${leftField.value}${fixUnit(leftField.unit)}` }} />
        </div>
      </section>
    </main>
  )
}
