import { getDatabase, ref, onValue } from 'firebase/database'
import { createContext } from 'react'

interface Session {
  playlistId: string | undefined
  started: number
  uid: string | undefined
}

export const watchSessionCode = (code: string, callback: () => void): void => {
  const sessionCodeRef = ref(getDatabase(), 'sessions/' + code.toUpperCase())

  onValue(sessionCodeRef, (snap) => {
    // If the session exists inside the database then run the callback
    if (snap.val() !== null) {
      console.log(snap.val())
      callback()
    }
  })

}

export const SessionContext = createContext<Partial<Session>>({})