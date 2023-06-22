import { create, all, map, abs, leftShift } from "mathjs";
import { useEffect, useState } from "react";

//TODO improve bundle 
const math = create(all);
math.createUnit("q", math.unit(math.fraction(1, 40),
  "cm"))
math.createUnit("pc", math.unit(math.fraction(1, 6),
  "in"))
math.createUnit("point", math.unit(math.fraction(1, 72),
  "in"))
math.createUnit("px", math.unit(math.fraction(1, 96),
  "in"))
math.config({
  number: "Fraction",
});

const convert = (value: string, unit: string, newUnit: string) => String(
  math.number(
    math.round(math
      .evaluate(`${parseFloat(value)} ${unit} to ${newUnit}`)
      .toNumeric(newUnit), 2)
  ))

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

enum absoluteLength {
  centimeter = "cm",
  millimeter = "mm",
  quarterMillimeter = "q",
  inch = "in",
  pica = "pc",
  point = "point",
  pixel = "px",
}

enum sideE {
  left, right
}

export default function Home() {
  const [lengthLeft, setLengthLeft] = useState({
    number: "96",
    unit: absoluteLength.pixel
  });

  const [lengthRight, setLengthRight] = useState({
    number: "1",
    unit: absoluteLength.inch
  });

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>, side: sideE) => {
    const { value: elemValue } = e.target;

    const convertedNumber = convert(
      elemValue,
      side === sideE.left ? lengthLeft.unit : lengthRight.unit,
      side === sideE.right ? lengthLeft.unit : lengthRight.unit
    );

    setLengthLeft((prev) => ({
      ...prev,
      number: side === sideE.left ? elemValue : convertedNumber,
    }));

    setLengthRight((prev) => ({
      ...prev,
      number: side === sideE.right ? elemValue : convertedNumber,
    }));
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>, side: sideE) => {
    const { value: elemValue } = e.target;

    if (side === sideE.left) {
      if (lengthRight.unit === elemValue) {
        setLengthRight((prev) => ({
          ...prev,
          unit: lengthLeft.unit,
          number: convert(lengthLeft.number, lengthRight.unit, lengthLeft.unit),
        }));
      } else {
        setLengthRight((prev) => ({
          ...prev,
          number: convert(lengthLeft.number, elemValue, lengthRight.unit),
        }));
      }

      setLengthLeft((prev) => ({
        ...prev,
        unit: elemValue as absoluteLength,
      }));
    } else if (side === sideE.right) {
      if (lengthLeft.unit === elemValue) {
        setLengthLeft((prev) => ({
          ...prev,
          unit: lengthRight.unit
        }));

        setLengthRight((prev) => ({
          ...prev,
          unit: elemValue as absoluteLength,
          number: convert(lengthLeft.number, lengthRight.unit, elemValue),
        }));
      } else {
        setLengthRight((prev) => ({
          ...prev,
          unit: elemValue as absoluteLength,
          number: convert(lengthRight.number, lengthRight.unit, elemValue),
        }));
      }
    }
  };
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
              value={lengthLeft.number}
              onChange={(e) => { handleNumberChange(e, sideE.left) }}
              min="0"
              type="number"
            />
            <select value={lengthLeft.unit} name="unit" onChange={(e) => { handleUnitChange(e, sideE.left) }} className="py-1 px-2 w-20">
              {Object.entries(absoluteLength).map(([key, value]) =>
                <option value={value} title={key} key={value}>{value}</option>
              )}
            </select>
            <input
              className="border py-1 px-2 w-20 focus:border-red"
              placeholder="Insert value"
              name="number"
              value={lengthRight.number}
              onChange={(e) => { handleNumberChange(e, sideE.right) }}
              min="0"
              type="number"
            />
            <select value={lengthRight.unit} name="unit" onChange={(e) => { handleUnitChange(e, sideE.right) }} className="py-1 px-2 w-20">
              {Object.entries(absoluteLength).map(([key, value]) =>
                <option value={value} title={key} key={value}>{value}</option>
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
              value={lengthLeft.number}
            // onChange={handleChange}
            />
            <datalist id="markersL" className="flex justify-around">
              {rangeValues[lengthLeft.unit].map((item, index) =>
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
              value={lengthRight.number}
            // onChange={handleChange}
            />
            <datalist id="markersR" className="flex justify-around">
              {rangeValues[lengthRight.unit].map((item, index) =>
                <option key={"rgnR-" + index} value={item} ></option>
              )}
            </datalist>
          </div>
        </div>
        <div className="w-full overflow-x-auto border p-2">
          <div className="h-60 w-24 border border-red-300" style={{ width: `${lengthLeft.number}${lengthLeft.unit === "point" ? "pt" : lengthLeft.unit}` }} />
        </div>
      </section>
    </main>
  )
}
