import EventEmitter from "events";

declare global {
  interface Window {
    playerEvents: EventEmitter
    spotifyPlayer: any
    Spotify: any
    onSpotifyWebPlaybackSDKReady: () => void
    drawPointer: (() => void) | null
  }
}