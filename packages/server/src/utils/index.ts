/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

/**This function pretty-prints (just formats and returns a string) the input */
export const pp = (input: any): string => JSON.stringify(input, undefined, 2)
