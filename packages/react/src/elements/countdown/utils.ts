export function getTime(seconds: number) {
  const ONE_MINUTE = 60 * 1000
  const ONE_HOUR = 60 * ONE_MINUTE
  const ONE_DAY = 24 * ONE_HOUR
  const days = Math.floor(seconds / ONE_DAY)
  const hours = Math.floor((seconds - days * ONE_DAY)/ONE_HOUR)
  const mins = Math.floor((seconds - days * ONE_DAY - hours * ONE_HOUR)/ONE_MINUTE)
  const secs = Math.floor((seconds - days * ONE_DAY - hours * ONE_HOUR - mins * ONE_MINUTE)/1000)
  return {days, hours, mins, secs}
}