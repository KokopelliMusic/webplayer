import { ReactNode, useEffect } from "react";
import Particles, { IOptions, RecursivePartial } from "react-tsparticles";

type ParticlesProps = {
  children: ReactNode
  particles: ParticleOptions[]
  number?: number
  speed?: number
  size?: number
}

export type ParticleOptions = {
  src: string
  height: number
  width: number
}

const ParticleBackground = (props: ParticlesProps) => {

  const particlesInit = (main: any) => {
  }

  const particlesLoaded = () => {

  }

  const options: RecursivePartial<IOptions> = {
    particles: {
      number: {
        value: props.number || 5 
      },
      lineLinked: {
        enable: false
      },
      move: {
        speed: props.speed || 5,
        out_mode: 'out',
        enable: true
      },
      shape: {
        type: [
          'image'
        ],
        image: props.particles
      },
      size: {
        value: props.size || 50,
        random: false,
        anim: {
          enable: true,
          speed: 4,
          size_min: 40,
          sync: true
        }
      },
      opacity: {
        anim: { 
          enable: false
        },
        value: 0.7
      },
      reduceDuplicates: true
    },
    retina_detect: true
  }


  return <div className="min-h-screen bg-indigo-200">
    <div className="z-10 w-screen h-screen bg-transparent absolute">
      <div className="flex items-center text-center flex-col">
        { props.children }
      </div>
    </div>
    {/* <Particles
      className="z-0 h-screen w-screen absolute"
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={options}
    /> */}

  </div>
}

export default ParticleBackground