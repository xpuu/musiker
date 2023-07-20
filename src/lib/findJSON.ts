const closers = {
  '{': '}',
  '[': ']',
  '"': '"',
  '/': '/',
}

export function findJSON(text: string, prefix: string = '') {
  if (!text.length) throw Error('Empty text')
  // Start after prefix
  let start = text.indexOf(prefix)
  if (start < 0) throw Error('Unable to find prefix')
  start += prefix.length
  // First char
  let first = text.indexOf('{', start)
  if (first < 0) throw Error('Unable to find JSON')
  // Init
  let i = first
  let last = '{'
  let current = ''
  let context = last
  let stack = [last]
  while (i++ < text.length) {
    if (stack.length === 0) break
    current = text[i]
    context = stack[stack.length - 1]
    // console.log({ context, current });
    // Context closer?
    if (current === closers[context]) {
      stack.pop()
      continue
    }
    // Strings
    if (context === '"') {
      // Skip escaped string
      if (current === '\\') i++
    } else {
      // Non strings
      if (Object.keys(closers).includes(current)) {
        stack.push(current)
      }
    }
  }
  let snippet = text.substring(first, i)
  // console.log(snippet)
  return JSON.parse(snippet)
}
