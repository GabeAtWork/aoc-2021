import { FgGreen, FgRed, Reset } from "./ansi-codes";

export const logAndPass =
  (message: string) =>
  <T>(thing: T) => {
    console.log(message, JSON.stringify(thing));

    return thing;
  };

export const printError = (error: unknown) =>
  console.error(`${FgRed}error${Reset}`, JSON.stringify(error));

export const printResult = (result: unknown) =>
  console.log(`${FgGreen}Result:${Reset}`, JSON.stringify(result));
