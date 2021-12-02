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
} from "../../util";
import { join as joinPath } from "path";

const rootDirectory = process.cwd();

const emptyCoordinates: Coordinates = {
  position: 0,
  depth: 0,
};

async function main() {
  await pipe(
    joinPath(rootDirectory, "./input/day-2"),
    getFileContents,
    TE.map(splitIntoLines),
    TE.map(A.map(parseCommand)),
    // Turning the TE<Option<X>[]> into a TE<X[]>
    TE.chainW(
      flow(
        A.sequence(O.Applicative),
        TE.fromOption(() => "Some commands could not be decoded")
      )
    ),
    TE.map(A.reduce(emptyCoordinates, updateCoordinates)),
    TE.map(({ depth, position }) => depth * position),
    TE.fold(flow(printError, T.of), flow(printResult, T.of))
  )();
}

main();

type Command = {
  tag: "forward" | "up" | "down";
  amount: number;
};

type Coordinates = {
  depth: number;
  position: number;
};

function parseCommand(line: string): O.Option<Command> {
  const [tag, stringAmount] = line.split(" ");

  if (tag !== "forward" && tag !== "up" && tag !== "down") {
    return O.none;
  }

  return O.some({
    tag,
    amount: parseInt(stringAmount),
  });
}

function updateCoordinates(
  { depth, position }: Coordinates,
  command: Command
): Coordinates {
  switch (command.tag) {
    case "forward":
      return { depth, position: position + command.amount };
    case "down":
      return { position, depth: depth + command.amount };
    case "up":
      return { position, depth: depth - command.amount };
  }
}
