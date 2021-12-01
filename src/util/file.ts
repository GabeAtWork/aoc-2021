import { promisify } from "util";
import { readFile, writeFile } from "fs";
import { taskEither as TE, either as E } from "fp-ts";

const readFromFile = promisify(readFile);
const writeToFile = promisify(writeFile);

export const getFileContents = (path: string) =>
  TE.tryCatch(() => readFromFile(path, "utf-8"), E.toError);

export const writeContentsToFile = (path: string) => (contents: string) =>
  TE.tryCatch(() => writeToFile(path, contents), E.toError);
