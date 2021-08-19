import { Session } from "../data/session"
import { getSpotifyToken, refreshSpotifyToken } from "../data/spotify"
import SpotifyApi from 'spotify-web-api-js'
import React from "react"


export class SpotifyWebPlayback extends React.Component {

  SPOTIFY_API = 'https://api.spotify.com/v1';

  device: string
  session: Session
  spotifyApi: SpotifyApi.SpotifyWebApiJs

  state = {
    paused: true
  }

  constructor(props: any) {
    super(props);
    this.device = '';
    this.session = JSON.parse(sessionStorage.getItem('session')!)
    this.spotifyApi = new SpotifyApi();
    this.spotifyApi.setAccessToken(this.getAccessToken());
    this.getAccessToken = this.getAccessToken.bind(this);
  }

  getAccessToken() {
    const store = sessionStorage.getItem('spotifyAccess')
    if (store === null) return null
    else return JSON.parse(store).token
  }

  getDeviceID() {
    return window.spotifyPlayer._options.id;
  }

  playSong(song: string) {
    console.log(`Attempting to play on devive ${this.device}`);
    this.spotifyApi.play({ device_id: this.device, uris: ['spotify:track:' + song] })
  }

  endOfSong() {
    window.playerEvents.emit('finished');
  }


  componentDidMount() {

    window.onSpotifyWebPlaybackSDKReady = () => {
      const Spotify = window.Spotify;
      const player = new Spotify.Player({
        name: 'Epic Web Player',
        getOAuthToken: async (cb: any) => {
          // first check locally
          const spotifyAccess = this.getAccessToken()

          if (spotifyAccess !== null) {
            cb(spotifyAccess)
          } else {
            // else just ask the database
            await refreshSpotifyToken(this.session.uid!).then(code => {
              cb(code)
            })
          }
        }
      });
      
      window.spotifyPlayer = player;

      window.playerEvents.on('play', data => {
        console.log(data)
        if (data.spotifyId) {
          this.playSong(data.spotifyId);
        } else {
          player.pause();
        }
      })

      window.playerEvents.on('stop', () => {
        player.pause();
      })

      // Error handling
      player.addListener('initialization_error', ({ message }: any) => { console.error(message); });
      player.addListener('authentication_error', ({ message }: any) => { console.error(message); });
      player.addListener('account_error', ({ message }: any) => { console.error(message); });
      player.addListener('playback_error', ({ message }: any) => { 
        console.error(message);
      });


      // Playback status updates
      player.addListener('player_state_changed', (s: any) => {
        if (!s) return;
        
        if (this.state && 
            s.track_window.previous_tracks.find((x: any) => x.id === s.track_window.current_track.id) &&
            !this.state.paused &&
            s.paused) {
          this.endOfSong();
        }

        this.setState(s);
      });

      // Ready
      player.addListener('ready', ({ device_id }: any) => {
        console.log('Device ready!', device_id);
        this.device = device_id;
      });

      // Not Ready
      player.addListener('not_ready', ({ device_id }: any) => {
        console.log('Device ID has gone offline', device_id);
      });


      // Connect to the player!
      player.connect().then((success: boolean) => {
        window.playerEvents.emit('ready', success)
      })
    }
  }

  render() {
    return (
      <div className="SpotifyWebPlayback"></div>
    )
  }
}