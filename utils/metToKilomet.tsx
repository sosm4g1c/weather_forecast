export function metToKilomet(visabilityInMet: number): string {
  const visabilityInKilomet = visabilityInMet / 1000;
  return `${visabilityInKilomet.toFixed(0)} km`;
}
