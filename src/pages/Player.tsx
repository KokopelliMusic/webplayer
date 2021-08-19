import { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Events from '../data/events';
import { MP3EventData, selectNextEvent, SessionContext, setCurrentlyPlaying, SpotifyEventData, YouTubeEventData } from '../data/session';
import AdtRad from '../events/AdtRad';
import LoadingPlayer from '../events/LoadingPlayer';
import MusicBase from '../components/MusicBase';
import { EventEmitter } from 'events'
import { SpotifyWebPlayback } from '../events/Spotify';


export type EventContextType = SpotifyEventData | MP3EventData | YouTubeEventData

export type EventProps = {
  finished: () => void
}

const Player: React.FC = () => {

  // callback to indicate event has finished
  const finished = async () => {
    await next()
  }

  const play = async () => {
    await next()
      .then(() => setPlayPressed(true))
  }


  // Context
  const session = useContext(SessionContext)

  // history
  const history = useHistory()

  // Component State
  const [event, setEvent] = useState<Events>(Events.Loading)
  const [eventData, setEventData] = useState<EventContextType>()
  const [spotifyReady, setSpotifyReady] = useState(false)
  const [playPressed, setPlayPressed] = useState(false)
  const [finishedLoading, setFinishedLoading] = useState(false)

  const next = async () => {

    let code = session.code!

    if (!code) {
      const session = sessionStorage.getItem('session')!

      if (session === null) {
        history.push('/')
      }

      code = JSON.parse(session).code
    }

    const e = await selectNextEvent(code, history)

    e.data.code = code

    setEvent(e.type)
    setEventData(e.data)
    setCurrentlyPlaying(code, e.data)

    if (e.type === Events.Spotify) {
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
    }, 2000)

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
        return <div>YouTube TODO</div>
      
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
    {/* {!session.uid && !session.code ? <div /> :
      <SpotifyPlayer 
        uid={session.uid!} 
        code={session.code!} 
        finished={finished}
        setReady={setSpotifyReady}
        setApi={setSpotifyApi}
        setDevice={setSpotifyDevice}
        emitter={spotifyEmitter}
        /> }
    {spotifyReady && finishedLoading
      ? (playPressed ? getEventComponent(event) : <PressPlay onClick={play} />) 
      : <LoadingPlayer />} */}
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