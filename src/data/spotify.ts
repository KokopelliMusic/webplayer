import { getDatabase, ref, get } from "@firebase/database"
import settings from '../settings'

export const refreshSpotifyToken = async (uid: string): Promise<string> => {
  const path = `users/${uid}/spotify/refresh`
  const spotifyRef = ref(getDatabase(), path)

  const refresh = await get(spotifyRef).then(snap => snap.val())

  return await fetch(settings.refreshSpotify, {
    method: 'POST',
    body: JSON.stringify({
      refresh_token: refresh
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(data => data.json())
  .then(data => {
    if (data.error) {
      console.error('Spotify refresh failed :(', data)
      return
    }
    sessionStorage.setItem('spotifyAccess', data.access_token)
    return data.access_token
  })
}

export const getSpotifyToken = (uid: string): Promise<string> => {
  const path = `users/${uid}/spotify/access`
  const spotifyRef = ref(getDatabase(), path)

  return get(spotifyRef)
    .then(snap => snap.val())
    .then(snap => {
      sessionStorage.setItem('spotifyAccess', snap)
      return snap
    })
}