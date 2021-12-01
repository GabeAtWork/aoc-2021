export const splitIntoLines = (s: string): string[] =>
  s.split("\n").filter((l) => l.length > 0);
