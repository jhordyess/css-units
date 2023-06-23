import { create, all } from "mathjs";
import { LengthUnit } from "./utils";

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

export const convert = (value: string, unit: LengthUnit, newUnit: LengthUnit) => String(
  math.number(
    math.round(math
      .evaluate(`${parseFloat(value)} ${unit} to ${newUnit}`)
      .toNumeric(newUnit), 2)
  ))