import { isDate, isPlainObject } from './unit'

function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildURL(url: string, params: any): string {
  if (!params) {
    return url
  }

  const post: string[] = []
  Object.keys(params).forEach(key => {
    const val = params[key]
    if (val === null || typeof val === 'undefined') {
      return
    }
    let values: string[] = []
    if (Array.isArray(val)) {
      values = val
      key += '[]'
    } else {
      values = [val]
    }

    values.forEach(value => {
      if (isDate(value)) {
        value = value.toISOString()
      } else if (isPlainObject(value)) {
        value = JSON.stringify(value)
      }

      post.push(`${encode(key)}=${encode(value)}`)
    })

    let serializedParams = post.join('&')
    if (serializedParams) {
      const markIndex = serializedParams.indexOf('#')
      if (markIndex !== -1) {
        url = url.slice(0, markIndex)
      }

      url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
    }
  })

  return url
}
