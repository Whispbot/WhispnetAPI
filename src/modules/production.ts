export default function productionValue<T>(production: T, development: T) {
  return process.env.NODE_ENV === "production" ? production : development;
}
