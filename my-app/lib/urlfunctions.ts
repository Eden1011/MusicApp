export function urlencode(data: string): string {
  return encodeURIComponent(data.replace(/ /g, '+'))
}

export function urldecode(data: string): string {
  return decodeURIComponent(data).replace(/\+/g, ' ')
}

