import { useContext, useEffect, useState } from "react"
import EventBase from "../components/EventBase"
import { ParticleOptions } from "../components/ParticleBackground"
import { getPeople, SessionContext } from "../data/session"
import { EventProps } from "../pages/Player"
// @ts-expect-error
import Winwheel from 'winwheel'

const AdtRad = (props: EventProps) => {

  const context = useContext(SessionContext)
  const [wheel, setWheel] = useState(null)
  const [people, setPeople] = useState<string[]>([])

  useEffect(() => {
    getPeople(context.code!).then(p => setPeople(p))

    window.playerEvents.emit('play', {
      spotifyId: '42CxtPzRkuHA1wyQr78W1S'
    })

    // @ts-expect-error
    setTimeout(() => wheel.startAnimation(), 100000)

    window.drawPointer = () => {
      let pointer = new Image();
      pointer.onload = () => {
        let canvas = document.querySelector('#adtRadCanvas');
        // @ts-expect-error
        let ctx = canvas.getContext('2d');
  
        if (ctx) {
          ctx.save();
          ctx.translate(700, 138);
          // @ts-expect-error
          ctx.rotate(wheel.degToRad(220));
          ctx.drawImage(pointer, 0, 0, 120, 120);
          ctx.restore();
        }
      }
  
      pointer.src = 'https://cdn.nierot.com/memes/beugel.png'
    }

    setWheel(new Winwheel({
      canvasId: 'adtRadCanvas',
      numSegments: people.length,
      segments: generateSegments(),
      rotationAngle: 3,
      pointerAngle: 40,
      animation: {
        type: 'spinToStop',
        duration: 5,
        spins: 8,
        clearTheCanvas: false,
        callbackFinished: `window.drawPointer()`,
      }
    }))
    window.drawPointer();

    return () => {
      window.drawPointer = null
    }
  }, [])

  const particles: ParticleOptions[] = [
    {
      src: 'https://cdn.nierot.com/memes/beugel.svg',
      height: 40,
      width: 20
    },
    {
      src: 'https://cdn.nierot.com/memes/klok.svg',
      height: 50,
      width: 30
    },
    {
      src: 'https://cdn.nierot.com/memes/hertog-jan.svg',
      height: 30,
      width: 25
    },
  ]

  const generateSegments = async () => {
    let colors = [ '#22aa22', '#ff2222', '#2222aa' ]
    let currentColor = -1;
    return people.map(person => {
      currentColor === 2 ? currentColor = 0 : currentColor++;
      let color = colors[currentColor];
      return {
        fillStyle: color,
        text: person
      }
    })
  }



  return <EventBase particles={particles}>
      <div className="adtRad">
        <canvas id="adtRadCanvas" width='800' height='800'></canvas>
      </div>
  </EventBase>
}

export default AdtRad