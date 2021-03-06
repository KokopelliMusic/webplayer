import { getDatabase, ref, onValue, set, get } from 'firebase/database'
import { useEffect, useState } from 'react'
import { createContext } from 'react'
import Events, { GameEvents } from './events'
import settings from '../settings'
import { useHistory } from 'react-router-dom'

export interface Session {
  playlistId?: string
  started?: number
  uid?: string
  code?: string
  setSession?: (session: Session) => void
  getSessionFromStore?: () => void
}

interface NextEvent {
  type: Events,
  data: SpotifyEventData | YouTubeEventData | MP3EventData
}

type MusicEventData = {
  code: string
  title: string
  songType: string
  uid: string
  addedBy: string
  playlistId: string
  platformId: string
  song: SpotifyExtras | MP3Extras | undefined
}

export type SpotifyExtras = {
  artist: string
  cover: string
  length: number
}

export type MP3Extras = {
  src: string
  cover: string
  length: number
  artist: string
}

export type SpotifyEventData = MusicEventData & {}

export type YouTubeEventData = MusicEventData & {}

export type MP3EventData = MusicEventData & {}


export const watchSessionCode = (code: string, callback: (session: Session) => void): void => {
  const sessionCodeRef = ref(getDatabase(), 'sessions/' + code.toUpperCase())

  const unsub = onValue(sessionCodeRef, (snap) => {
    // If the session exists inside the database then run the callback
    const val = snap.val()
    if (val !== null) {
        // Add the session code to the session object from the database
      val.code = code
      console.log(val)
      callback(val)
      unsub()
    }
  })

}

export const setCurrentlyPlaying = (sessionCode: string, song: SpotifyEventData | YouTubeEventData | MP3EventData | string) => {
  const playingRef = ref(getDatabase(), 'currently-playing/' + sessionCode.toUpperCase())

  console.log(`Set currently playing for code ${sessionCode}`, song)

  let toSet

  // @ts-expect-error
  if (song.type && song.type === 'event') {
    toSet = {
      code: sessionCode,
      songType: 'event',
      artist: 'event'
    }
  } else {
    toSet = song
  }

  set(playingRef, toSet)
}

export const selectNextEvent = async (sessionCode: string, history: any, first: boolean): Promise<NextEvent> => {

  console.log('first', first)

  return await fetch(settings.makeUrl(`event/next?code=${sessionCode}&firstTime=${first}`))
    .then(resp => resp.json())
    .then(resp => {
      console.log(resp)
      return {
        type: translateBackendEvent(resp.type),
        data: resp.data
      }
    })
}

export const getPeople = async (sessionCode: string): Promise<string[]> => {
  const peopleRef = ref(getDatabase(), 'sessions/' + sessionCode.toUpperCase() + '/users')

  return await get(peopleRef)
    .then(snap => snap.val())
    .then(val => {
      let people: string[] = []

      if (val !== null) {
        for (const [_, username] of Object.entries(val)) {
          people.push(username as string);
        }
      }

      return people
    })
}

export const translateBackendEvent = (code: string): Events => {
  switch (code) {
    case 'spotify':
      return Events.Spotify
    case 'loading':
      return Events.Loading
    case 'mp3':
      return Events.MP3
    case 'youtube':
      return Events.YouTube
    case 'nosongs':
      return Events.PlaylistEmpty
    case 'event':
      return GameEvents[Math.floor(Math.random() * GameEvents.length)]
    default:
      return Events.Loading
  }
}

export const SessionContext = createContext<Session>({})


export const SessionContextProvider: React.FC = (props) => {

  const getSessionFromStore = () => {
    const session = sessionStorage.getItem('session')

    if (session !== null) {
      setSession(JSON.parse(session))
    }

  }

  const setSession = (session: Session) => {
    sessionStorage.setItem('session', JSON.stringify(session))
    setSessionState({
      ...session,
      setSession,
      getSessionFromStore
    })
  }

  const [sessionState, setSessionState] = useState<Session>({ setSession, getSessionFromStore })

  return <SessionContext.Provider value={{ ...sessionState }}>
    {props.children}
  </SessionContext.Provider>
}