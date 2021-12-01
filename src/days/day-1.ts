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
    TE.map(groupArrayByTriples),
    TE.map(A.map(A.reduce(0, add))),
    TE.map(groupArrayByPairs),
    TE.map(
      A.map(([previousWindowResult, nextWindowResult]) => {
        if (nextWindowResult > previousWindowResult) {
          return "(increased)";
        } else if (nextWindowResult < previousWindowResult) {
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

function add(a: number, b: number) {
  return a + b;
}

function groupArrayByPairs<X>(xs: X[]): [X, X][] {
  let result: [X, X][] = [];

  for (let i = 0; i < xs.length; i++) {
    if (i > 0) {
      result.push([xs[i - 1], xs[i]]);
    }
  }

  return result;
}

function groupArrayByTriples<X>(xs: X[]): [X, X, X][] {
  let result: [X, X, X][] = [];

  for (let i = 0; i < xs.length; i++) {
    if (i > 1) {
      result.push([xs[i - 2], xs[i - 1], xs[i]]);
    }
  }

  return result;
}
