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
    paused: true,
    spotify: undefined
  }

  constructor(props: any) {
    super(props);
    this.device = '';
    this.session = JSON.parse(sessionStorage.getItem('session')!)
    this.spotifyApi = new SpotifyApi();
    this.getAccessToken = this.getAccessToken.bind(this);
  }


  async getAccessToken() {
    const store = sessionStorage.getItem('spotifyAccess')
    let token;
    if (store === null) {
      token = await refreshSpotifyToken(this.session.uid!)
    } else {
      token = JSON.parse(store).token
    }
    this.spotifyApi.setAccessToken(token)
    return token
  }

  getDeviceID() {
    return window.spotifyPlayer._options.id;
  }

  playSong(song: string) {
    this.spotifyApi.play({ device_id: this.device, uris: ['spotify:track:' + song] }, (error) => {
      if (error) {
        console.error(error)
        setTimeout(() => {
          this.spotifyApi.play({ device_id: this.device, uris: ['spotify:track:' + song] })
        }, 5000)
      }
    })
  }

  endOfSong() {
    window.playerEvents.emit('finished');
  }

  // TODO queue alles

  async componentDidMount() {

    await this.getAccessToken();

    window.onSpotifyWebPlaybackSDKReady = () => {
      const Spotify = window.Spotify;
      const player = new Spotify.Player({
        name: 'Kokopelli',
        getOAuthToken: async (cb: any) => {
          // first check locally
          const spotifyAccess = this.getAccessToken()
          cb(spotifyAccess)
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
      player.addListener('initialization_error', ({ message }: any) => console.error(message))

      // Emitted when the Spotify.Player fails to instantiate a valid Spotify connection from the access token provided to getOAuthToken.
      player.addListener('authentication_error', ({ message }: any) => { 
        console.error('Failed to authenticate', message)
      })

      // This triggers when the user does not have Spotify premium
      player.addListener('account_error', ({ message }: any) => console.error(message))

      // This triggers when loading and/or playing back a track fails
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
        this.setState({ spotify: player })
      })
    }
  }

  render() {
    return (
      <div className="SpotifyWebPlayback"></div>
    )
  }
}