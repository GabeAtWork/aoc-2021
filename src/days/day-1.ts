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
    TE.map(A.chop(trioChopper)),
    TE.map(A.map(A.reduce(0, add))),
    TE.map(A.chop(pairChopper)),
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

function pairChopper<X>([a0, ...rest]: X[]): [[X, X], X[]] {
  return [[a0, rest[0]], rest.length > 1 ? rest : []];
}
function trioChopper<X>([a0, ...rest]: X[]): [[X, X, X], X[]] {
  return [[a0, rest[0], rest[1]], rest.length > 2 ? rest : []];
}
