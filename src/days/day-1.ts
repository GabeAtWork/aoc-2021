import { flow, pipe } from "fp-ts/lib/function";
import {
  either as E,
  array as A,
  taskEither as TE,
  task as T,
  option as O,
  nonEmptyArray as NEA,
} from "fp-ts";
import {
  logAndPass,
  getFileContents,
  printError,
  printResult,
  splitIntoLines,
} from "../util";
import { join as joinPath } from "path";

const rootDirectory = process.cwd();

async function main() {
  await pipe(
    joinPath(rootDirectory, "./input/day-1"),
    getFileContents,
    TE.map(splitIntoLines),
    TE.map(A.map(parseInt)),
    TE.map((nextReadings) => ({
      nextReadings: nextReadings,
      previousReadings: [0, ...nextReadings],
    })),
    TE.map(({ nextReadings, previousReadings }) =>
      A.zip(previousReadings)(nextReadings)
    ),
    TE.map(
      A.mapWithIndex((index, [nextReading, previousReading]) => {
        if (index === 0) {
          return "(N/A - no previous measurement)";
        }

        if (nextReading > previousReading) {
          return "(increased)";
        } else if (nextReading < previousReading) {
          return "(decreased)";
        }

        return "(stable)";
      })
    ),
    TE.map(A.filter((result) => result === "(increased)")),
    TE.map((results) => results.length),
    TE.fold(flow(printError, T.of), flow(printResult, T.of))
  )();
}

main();
