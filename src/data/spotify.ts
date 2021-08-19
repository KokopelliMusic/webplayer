import { getDatabase, ref, get } from "@firebase/database"
import { set } from "firebase/database"
import settings from '../settings'

export const refreshSpotifyToken = async (uid: string): Promise<string> => {
  const path = `users/${uid}/spotify`
  const refresh = await get(ref(getDatabase(), path + '/refresh')).then(snap => snap.val())
  const accessRef = ref(getDatabase(), path + '/access')

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

    set(accessRef, data.access_token)

    sessionStorage.setItem('spotifyAccess', JSON.stringify({
      token: data.access_token,
      time: new Date().getTime()
    }))
    return data.access_token
  })
}

export const getSpotifyToken = (uid: string): Promise<string> => {
  const path = `users/${uid}/spotify/access`
  const spotifyRef = ref(getDatabase(), path)

  return get(spotifyRef)
    .then(snap => snap.val())
    .then(snap => {
      sessionStorage.setItem('spotifyAccess', JSON.stringify({
        token: snap,
        time: new Date().getTime()
      }))
      return snap
    })
}