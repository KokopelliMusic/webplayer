import settings from './settings'

export const checkPlayerCode = async (code: string) => {
  return await fetch(settings.makeUrl('playlist/exists'), {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      playlistID: code
    })
  }).then(resp => resp.json())
    .then(resp => {
      const exists = resp?.exists
      return !!exists
    })
    .catch(err => {
      console.error(err)
      return false
    })

}

export const getPlayerCode = () => {
  return getQuery('code')
}

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

export const redirect = (to: string) => {
  window.location.replace(to)
}

export const getRandomNumber = (lower: number, upper: number) => {
  return Math.floor(Math.random() * (upper - lower + 1) + lower)
}