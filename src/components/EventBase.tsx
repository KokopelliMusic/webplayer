import { ReactNode, useEffect } from "react"
import ParticleBackground, { ParticleOptions } from "./ParticleBackground"

type EventBaseProps = {
  children?: ReactNode
  // particles: ParticleOptions[]
}

const EventBase = (props: EventBaseProps) => {

  return <div className="bg-indigo-700 h-screen w-screen flex justify-center items-center">
    { props.children }
    {/* <ParticleBackground particles={props.particles}>
      { props.children }
    </ParticleBackground> */}
  </div>
}

export default EventBase