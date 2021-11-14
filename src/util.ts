import settings from './settings'

export const getQuery = (param: string): string => {
  let code = getQueryParams().get(param)
  if (!code) {
    code = ''
  }
  return code
}

export const getQueryParams = () => {
  return new URLSearchParams(window.location.search)
}

/**
 * Generates a random number between min (inclusive) and max (inclusive)
 */
export const getRandomNumber = (lower: number, upper: number) => {
  return Math.floor(Math.random() * (upper - lower + 1) + lower)
}