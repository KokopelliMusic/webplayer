import { useContext, useEffect, useState } from "react"
import EventBase from "../components/EventBase"
import { ParticleOptions } from "../components/ParticleBackground"
import { getPeople, SessionContext } from "../data/session"
import { EventProps } from "../pages/Player"
// import Winwheel from 'winwheel'
import { Wheel, WheelDataType } from 'react-custom-roulette'
import { getRandomNumber } from "../util"
import './EventStyles.css'
import LoadingPlayer from "./LoadingPlayer"
import { selectRandomEventSong } from "./eventMusic"

const WAIT_TIME = 20.000 // 20 sec

const AdtRad = (props: EventProps) => {

  const context = useContext(SessionContext)
  const [people, setPeople] = useState<string[]>([])
  const [winner, setWinner] = useState<number>(-1)
  const [data, setData] = useState<Array<WheelDataType>>([])
  const [colors, setColors] = useState<Array<string>>([])
  const [startSpinning, setStartSpinning] = useState(false)

  useEffect(() => {
    getPeople(context.code!)
      .then(p => {
        setPeople(p)
        
        const segments = []
        for (let x of p) {
          segments.push({ option: x, style: { textColor: 'white' } } as WheelDataType)
        }
        setData(segments)

        const temp = ['#B5446E', '#583E23']
        if (!([3, 6, 9].includes(data.length))) {
          temp.push('#498467')
        }
        setColors(temp)
    
        setTimeout(() => {
          setWinner(getRandomNumber(0, 3))
          setStartSpinning(true)
        }, WAIT_TIME)
      })

    window.playerEvents.emit('play', {
      spotifyId: selectRandomEventSong()
    })

    // setData([
    //   { option: 'Heineken', style: { textColor: 'white' } },
    //   { option: 'Hertog Jan', style: { textColor: 'white' } },
    //   { option: 'Bavaria', style: { textColor: 'white' } },
    //   { option: 'Grolsch', style: { textColor: 'white' } },
    //   { option: 'Leffe', style: { textColor: 'white' } },
    // ])

  }, [])

  // const particles: ParticleOptions[] = [
  //   {
  //     src: 'https://cdn.nierot.com/memes/beugel.svg',
  //     height: 40,
  //     width: 20
  //   },
  //   {
  //     src: 'https://cdn.nierot.com/memes/klok.svg',
  //     height: 50,
  //     width: 30
  //   },
  //   {
  //     src: 'https://cdn.nierot.com/memes/hertog-jan.svg',
  //     height: 30,
  //     width: 25
  //   },
  // ]

  const onStopSpinning = () => setStartSpinning(false)
  
  if (data.length === 0) {
    return <LoadingPlayer />
  }

  console.log(data)

  return <EventBase>
      {/* https://github.com/effectussoftware/react-custom-roulette/issues/18 */}
      <div className="adtrad">
        <Wheel
          mustStartSpinning={startSpinning}
          prizeNumber={winner}
          data={data}
          backgroundColors={colors}
          onStopSpinning={onStopSpinning}
          outerBorderWidth={5}
          innerRadius={0}
        />
      </div>
  </EventBase>
}

export default AdtRad