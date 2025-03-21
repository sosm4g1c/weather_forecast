export function getDayOrNightIcon(
  iconName: string,
  dateTimeString: string
): string {
  const hours = new Date(dateTimeString).getHours();
  const isDayTime = hours >= 0 && hours <= 12;
  return isDayTime ? iconName.replace(/.$/, "d") : iconName.replace(/.$/, "n");
}
