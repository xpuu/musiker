import wretch from 'wretch'

type ErrorLevel = 'error' | 'warn' | 'info' | 'log'

export type ApiOpts = {
  fetch?: any
  timeout: number
  res: 'res' | 'json' | 'blob' | 'formData' | 'arrayBuffer' | 'text'
  reject: boolean
  errorLevel: ErrorLevel
}

export function apiErrorHandler(err, url = '', reject = true, errorLevel: ErrorLevel = 'error') {
  const location = err.response?.headers.get('location')
  const content = err.response?.headers.get('content-type')
  // Log error
  console[errorLevel](
    'apiError',
    err.status || err.name,
    (url || err.response?.url) + (location ? ` >> ${location}` : ''),
    err.message
  )
  // Try to parse response
  if (content && content.includes('application/json')) {
    try {
      err.json = JSON.parse(err.text)
    } catch (e) {
      console.log(e)
    }
  }
  // Reject
  if (reject) return Promise.reject(err)
}

const defaultOpts: ApiOpts = {
  res: 'json',
  timeout: 10 * 1000,
  reject: true,
  errorLevel: 'error',
}

export function api(url: string, options: Partial<ApiOpts> = {}) {
  const opts = Object.assign({}, defaultOpts, options)
  return wretch(url)
    .polyfills({
      fetch: opts.fetch,
    })
    .options({ mode: 'cors', redirect: 'manual' })
    .resolve(resolver => {
      return resolver
        .setTimeout(opts.timeout)
        .res(res => {
          return opts.res === 'res' ||
            res.status === 204 ||
            res.headers.get('content-length') === '0'
            ? res
            : res[opts.res]()
        })
        .catch(err => {
          return apiErrorHandler(err, url, opts.reject, opts.errorLevel)
        })
    })
}
