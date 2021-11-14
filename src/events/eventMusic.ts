
/**
 * Returns a random Spotify track URI from a select list of "escalatie" tracks.
 * @returns {string} A Spotify track URI of the form '<id>' (so without spotify:track:)
 */
export const selectRandomEventSong = (): string => {
  return eventSongs[Math.floor(Math.random() * eventSongs.length)]
}

const eventSongs = [
  '42CxtPzRkuHA1wyQr78W1S', // Adtje voor de sfeer - Rene Karst (Hardstyle)
  '2bJaewMbxlwnm69zvOAq3s', // Adtje voor de sfeer - Rene Karst 
  '72lQhFytmSrEVWBiYUWkcR', // Ik Moet Zuipen! - PartyFriex
  '1r4B01B0IxHGd6sLVplmNP', // Wakker Met Een Biertje - Lamme Frans
  '00gHGXYNpwG5bYvTWUAo9p', // De Zuipschuit - Lamme Frans (P!mpteam Stampwaoge Radio Mix)
]