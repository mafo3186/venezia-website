/**
 * Utility to join class names and filter out falsy values.
 * @param classes class names or falsy values
 * @returns joined class names
 */
export const cls = (...classes: (string | false | null | undefined)[]) =>
  classes.filter((x) => x).join(" ");
