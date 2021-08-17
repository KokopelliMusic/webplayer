import { useEffect } from "react"
import { EventProps } from "../pages/Player"


const AdtRad = (props: EventProps) => {

  useEffect(() => {
    window.playerEvents.emit('play', {
      spotifyId: '42CxtPzRkuHA1wyQr78W1S'
    })
  }, [])

  return <div>
    AdtRad
  </div>
}

export default AdtRad