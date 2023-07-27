export function durationFmt(duration: string) {
  const m = duration.match(/PT((\d+)H)?((\d+)M)?((\d+)S)?/)
  if (!m) throw new Error('Unable to find duration')
  const hours = m[2] || '0'
  const minutes = m[4] || '0'
  const seconds = m[6] || '0'
  let res = []
  if (hours !== '0') {
    res.push(hours, minutes.padStart(2, '0'), seconds.padStart(2, '0'))
  } else if (minutes !== '0') {
    res.push(minutes, seconds.padStart(2, '0'))
  } else {
    res.push(seconds + 's')
  }
  return res.join(':')
}
