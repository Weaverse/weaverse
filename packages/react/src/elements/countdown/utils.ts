import { CountdownTimeKey } from '../../types'

export let times: CountdownTimeKey[] = ['days', 'hours', 'minutes', 'seconds']

export function getTime(_seconds: number): {
  [key in CountdownTimeKey]: number
} {
  const ONE_MINUTE = 60 * 1000
  const ONE_HOUR = 60 * ONE_MINUTE
  const ONE_DAY = 24 * ONE_HOUR
  const days = Math.floor(_seconds / ONE_DAY)
  const hours = Math.floor((_seconds - days * ONE_DAY) / ONE_HOUR)
  const minutes = Math.floor(
    (_seconds - days * ONE_DAY - hours * ONE_HOUR) / ONE_MINUTE
  )
  const seconds = Math.floor(
    (_seconds - days * ONE_DAY - hours * ONE_HOUR - minutes * ONE_MINUTE) / 1000
  )
  return { days, hours, minutes, seconds }
}
