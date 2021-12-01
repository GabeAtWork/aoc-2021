import { flow, pipe } from "fp-ts/lib/function";
import { either as E, array as A, taskEither as TE, task as T } from "fp-ts";
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
    TE.fold(flow(printError, T.of), flow(printResult, T.of))
  )();
}

main();
