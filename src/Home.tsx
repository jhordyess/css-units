import { create, all, map, abs } from "mathjs";
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
  "px": ["0", "16", "32", "64", "96", "128", "192", "256", "384"],
  "cm": ["0", "0.5", "1", "1.5", "2.54", "3", "5", "7", "10"],
  "mm": ["0", "5", "10", "15", "25.4", "30", "50", "70", "100"],
  "q": ["0", "20", "40", "60", "101.6", "120", "200", "280", "400"],
  "in": ["0", "0.25", "0.5", "0.75", "1", "1.5", "2", "2.5", "4"],
  "pc": ["0", "1", "2", "4", "6", "8", "12", "16", "24"],
  "point": ["0", "12", "24", "48", "72", "96", "144", "192", "288"]
}

enum absoluteLength {
  pixel = "px",
  centimeter = "cm",
  millimeter = "mm",
  quarterMillimeter = "q",
  inch = "in",
  pica = "pc",
  point = "point",
}

enum sideE {
  left, right
}

export default function Home() {
  const [lengthLeft, setLengthLeft] = useState<
    {
      number: string,
      unit: absoluteLength

    }>({ number: "96", unit: absoluteLength.pixel }
    );

  const [lengthRight, setLengthRight] = useState<
    {
      number: string,
      unit: absoluteLength
    }
  >({ number: "1", unit: absoluteLength.inch }
  );

  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>, side: sideE
  ) => {
    const { value: elemValue } = e.target;
    if (side === sideE.left) {
      setLengthLeft((prev) => ({
        ...prev,
        number: elemValue,
      }));
      setLengthRight((prev) => ({
        ...prev,
        number: convert(
          elemValue,
          lengthLeft.unit,
          lengthRight.unit,
        ),
      }));
    } else if (side === sideE.right) {
      setLengthRight((prev) => ({
        ...prev,
        number: elemValue,
      }));
      setLengthLeft((prev) => ({
        ...prev,
        number: convert(
          elemValue,
          lengthRight.unit,
          lengthLeft.unit,
        ),
      }));
    }
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>, side: sideE) => {
    const { value: elemValue } = e.target;
    if (side === sideE.left) {
      const lenLeftUnit = lengthLeft.unit;
      if (lengthRight.unit === elemValue) {
        setLengthLeft((prev) => ({
          ...prev,
          unit: lengthRight.unit
        }));
        setLengthRight((prev) => ({
          ...prev,
          unit: lenLeftUnit,
          number: convert(
            lengthLeft.number,
            lengthRight.unit,
            lenLeftUnit,
          ),
        }));
      }
      else {
        setLengthLeft((prev) => ({
          ...prev,
          unit: elemValue as absoluteLength,
        }));
        setLengthRight((prev) => ({
          ...prev,
          number: convert(
            lengthLeft.number,
            elemValue,
            lengthRight.unit,
          ),
        }));
      }
    } else if (side === sideE.right) {
      if (lengthLeft.unit === elemValue) {
        const lenRightUnit = lengthRight.unit;
        setLengthRight((prev) => ({
          ...prev,
          unit: lengthLeft.unit,
          number: convert(
            lengthLeft.number,
            lenRightUnit,
            lengthLeft.unit,
          ),
        }));
        setLengthLeft((prev) => ({
          ...prev,
          unit: lenRightUnit,
        }));
      } else
        setLengthRight((prev) => ({
          ...prev,
          unit: elemValue as absoluteLength,
          number: convert(
            lengthRight.number,
            lengthRight.unit,
            elemValue,
          ),
        }));
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
        <div className="w-full overflow-x-auto border p-2">
          <div className="h-60 w-24 border border-red-300" style={{ width: `${lengthLeft.number}${lengthLeft.unit === "point" ? "pt" : lengthLeft.unit}` }} />
        </div>
      </section>
    </main>
  )
}
