import { create, all } from "mathjs";
import { useState } from "react";

//TODO improve bundle 
const math = create(all);
math.createUnit("q", math.unit(math.fraction(1, 40), "cm"));
math.createUnit("pc", math.unit(math.fraction(1, 6), "in"));
math.createUnit("point", math.unit(math.fraction(1, 72), "in"));
math.createUnit("px", math.unit(math.fraction(1, 96), "in"));
math.config({
  number: "Fraction",
});

const convert = (value: string, unit: string, newUnit: string) =>
  math.number(
    math
      .evaluate(`${parseFloat(value)} ${unit} to ${newUnit}`)
      .toNumeric(newUnit)
  );

export default function Home() {
  const [values, setValues] = useState({
    value: "96", unit: "px", rangeValue: "96"
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const name = e.target.name;
    const value = e.target.value;

    setValues(prevState => (
      {
        ...prevState,
        [name]: value,
      }
    ))
  };

  return (
    <main className="min-h-screen w-full p-12 bg-blue-100">
      <h1 className="text-3xl font-bold py-8 text-center">
        CSS Units
      </h1>
      <section className="w-full flex gap-12 justify-evenly">
        <div className="w-1/2 border">
          <div className="w-full flex gap-6 h-8 justify-center">
            <input
              className="border"
              placeholder="Insert value"
              name="value"
              value={values.value}
              onChange={handleChange}
              min="1"
            />
            <select value={values.unit} name="unit" onChange={handleChange}>
              <option value="cm">cm</option>
              <option value="mm">mm</option>
              <option value="q">q</option>
              <option value="in" selected>in</option>
              <option value="pc">pc</option>
              <option value="point">pt</option>
              <option value="px">px</option>
            </select>
          </div>
          <div className="w-full">
            <input
              className="w-full"
              type="range"
              list="markers"
              max="384"
              min="0"
              name="rangeValue"
              value={values.rangeValue}
              onChange={handleChange}
            />
            <datalist id="markers" className="flex text-sm">
              <option value="0" label="0" style={{ paddingLeft: 4 }}></option>
              <option value="16" label="16" style={{ paddingLeft: 2 }}></option>
              <option value="32" label="32" style={{ paddingLeft: 2 }}></option>
              <option value="64" label="64" style={{ paddingLeft: 16 }}></option>
              <option value="96" label="96" style={{ paddingLeft: 14 }}></option>
              <option
                value="128"
                label="128"
                style={{ paddingLeft: 12 }}
              ></option>
              <option
                value="192"
                label="192"
                style={{ paddingLeft: 40 }}
              ></option>
              <option
                value="256"
                label="256"
                style={{ paddingLeft: 40 }}
              ></option>
              <option
                value="384"
                label="384"
                style={{ marginLeft: "auto" }}
              ></option>
            </datalist>
          </div>
        </div>
        <div className="w-full overflow-x-auto p-6 border border-red-400">
          <div id="editableBox" className="h-60 w-24 border border-red-300">
            Adipisicing culpa nostrud Lorem voluptate dolore.
          </div>
        </div>
      </section>
    </main>
  )
}
