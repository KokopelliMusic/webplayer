import { ReactNode, useEffect } from "react"
import ParticleBackground, { ParticleOptions } from "./ParticleBackground"

type EventBaseProps = {
  children?: ReactNode
  particles: ParticleOptions[]
}

const EventBase = (props: EventBaseProps) => {

  return <div>
    <ParticleBackground particles={props.particles}>
      { props.children }
    </ParticleBackground>
  </div>
}

export default EventBase