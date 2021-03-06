import { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Events from '../data/events';
import { MP3EventData, selectNextEvent, SessionContext, setCurrentlyPlaying, SpotifyEventData, SpotifyExtras, YouTubeEventData } from '../data/session';
import AdtRad from '../events/AdtRad';
import LoadingPlayer from '../events/LoadingPlayer';
import MusicBase from '../components/MusicBase';
import { EventEmitter } from 'events'
import { SpotifyWebPlayback } from '../events/Spotify';
import { refreshSpotifyToken } from '../data/spotify';
import settings from '../settings';
import YouTube from '../events/YouTube';


export type EventContextType = SpotifyEventData | MP3EventData | YouTubeEventData | {}

export type EventProps = {
  finished: () => void
}

const Player: React.FC = () => {

  // callback to indicate event has finished
  const finished = async () => {
    await next()
  }

  const play = async () => {
    await next(true)
      .then(() => setPlayPressed(true))
  }


  // Context
  const session = useContext(SessionContext)

  // history
  const history = useHistory()

  // Component State
  const [event, setEvent] = useState<Events>(Events.Loading)
  // const [eventComponent, setEventComponent] = useState<React.ReactElement>(<LoadingPlayer />)
  const [eventData, setEventData] = useState<EventContextType>()
  const [spotifyReady, setSpotifyReady] = useState(false)
  const [playPressed, setPlayPressed] = useState(false)
  const [finishedLoading, setFinishedLoading] = useState(false)

  const next = async (first?: boolean) => {

    let code = session.code!

    if (!code) {
      const session = sessionStorage.getItem('session')!

      if (session === null) {
        history.push('/')
      }

      code = JSON.parse(session).code
    }

    const e = await selectNextEvent(code, history, !!first)

    e.data.code = code

    console.log('OldEvent', eventData)
    console.log('NewEvent', e)

    // als dit werkt word ik boos
    // @ts-ignore
    if (e && e.type !== 'spotify') {
      setSpotifyReady(false)
      setTimeout(() => setSpotifyReady(true), 1000)
    }

    setEventData(e.data)
    // setEventComponent(getEventComponent(e.type, e.data))
    setEvent(e.type)
    setCurrentlyPlaying(code, e.data)

    // setEvent(Events.AdtRad)
    // setEventData({})
    // setCurrentlyPlaying(code, Events.AdtRad)

    if (e.type === 'spotify') {
      window.playerEvents.emit('play', e.data)
    }

  }

  useEffect(() => {
    loadSpotify()

    if (!window.playerEvents) window.playerEvents = new EventEmitter()
    window.playerEvents.on('ready', setSpotifyReady)

    window.playerEvents.on('finished', next)

    if (!session.code) {
      session.getSessionFromStore!()
    }

    console.log(session.code)

    setTimeout(async () => {
      setFinishedLoading(true)
      // lmao
    }, settings.debug ? 500: 5000)

    setInterval(async () => {

      const spotifyStore = sessionStorage.getItem('spotifyAccess')
      console.log('Checking spotify')
      if (spotifyStore !== null) {
        const access = JSON.parse(spotifyStore)
        console.log(access)

        // if token is 30 minutes old, just refresh it
        if (new Date(new Date(access.time).getTime() + 30 * 60 * 1000) < new Date()) {
          const sessionStore = sessionStorage.getItem('session')
          console.log('Access token more than 30 minutes old')
          
          if (sessionStore) {
            console.log(sessionStore)
            const session = JSON.parse(sessionStore)

            await refreshSpotifyToken(session.uid).then(code => {
              console.log('New code: ', code)
              sessionStorage.removeItem('spotifyAccess')
              sessionStorage.setItem('spotifyAccess', JSON.stringify({
                token: code,
                time: new Date().getTime()
              }))
            })
          }
        }
      }
    }, 60 * 1000)

  }, [])

  const getEventComponent = (event: Events) => {
    switch (event) {
      case Events.Loading:
        return <LoadingPlayer />
      case Events.PlaylistEmpty:
        return <div>Playlist is empty lol</div>

      case Events.Spotify:
        return spotifyReady ? <MusicBase {...(eventData as SpotifyEventData)} /> : <LoadingPlayer />
      case Events.MP3:
        return <div> MP3 TODO</div>
      case Events.YouTube:
        return <YouTube {...(eventData as YouTubeEventData)} finished={finished} />
      
      case Events.AdtRad:
        return <AdtRad finished={finished}/>
    }
  }

  const loadSpotify = () => {
    const script = document.createElement('script')
    script.src = 'https://sdk.scdn.co/spotify-player.js'
    script.async = true
    document.body.appendChild(script)
  }

  return <div>
    { finishedLoading
      ? (playPressed ? getEventComponent(event) : <PressPlay onClick={play} />)
      : <LoadingPlayer />
    }
    <SpotifyWebPlayback />
  </div>
  
}

interface PressPlayProps {
  onClick: () => void
}

const PressPlay = (props: PressPlayProps) => {
  return <div className="min-h-screen min-w-screen flex items-center justify-center flex-col bg-gray-100">
    <button className="h-" onClick={props.onClick}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-40 w-40" 
        viewBox="0 0 20 20" 
        fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
      </svg>
    </button>
  </div>
}

export default Player