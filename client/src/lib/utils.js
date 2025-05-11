/* eslint-disable no-unused-vars */
export function cn(...inputs) {
  return inputs
    .flatMap(input => {
      // The `_` can be safely ignored, hence the disable
      if (typeof input === "string") return input;
      if (typeof input === "object" && input !== null) {
        return Object.entries(input)
          .filter(([_, value]) => Boolean(value)) // _ is used as a placeholder here
          .map(([key]) => key);
      }
      return [];
    })
    .join(" ");
}
/* eslint-enable no-unused-vars */
