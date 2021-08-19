import { useContext } from "react"
import { useEffect, useState } from "react"
import { SessionContext } from "../data/session"

interface MusicBaseProps {
  artist: string
  title: string
  cover: string
  length: number
  code: string
  addedBy: string
}
const MusicBase = (props: MusicBaseProps) => {

  const sessionContext = useContext(SessionContext)

  const [titleSize, setTitleSize] = useState('text-8xl')
  const [timePlayed, setTimePlayed] = useState(0)
  const [timeInterval, setTimeInterval] = useState<NodeJS.Timeout>()

  useEffect(() => {
    // Dynamically change font size for the title, depending on how long the title is
    let size = 'text-8xl'
    if (props.title.length > 80) size = 'text-6xl'
    else if (props.title.length > 30) size = 'text-7xl'

    setTitleSize(size)

  }, [props.title.length])

  useEffect(() => {
    if (timeInterval) {
      clearInterval(timeInterval)
    }
    
    setTimePlayed(0)
    setTimeInterval(setInterval(() => {
      setTimePlayed(timePlayed => timePlayed + 1000)
    }, 1000))


    return () => {
      clearInterval(timeInterval!)
    }
  }, [props.length])

  const calcTimeLeftStyle = () => {
    return `${Math.floor((timePlayed / props.length) * 100)}%`
  }

  return <div className="bg-indigo-900 h-screen font-player">
    <div className="grid grid-cols-5">

      <div className="col-span-3">
        <div className="grid grid-rows-6 h-screen">

          <div className="row-span-1">
            {/* <div className="text-red-500 pl-20 pt-12 text-4xl">
              {props.code}
            </div> */}
          </div>

          <div className="row-span-4 flex flex-col justify-center items-center">
            <div>
              <img className="rounded-3xl shadow-2xl-white" src={props.cover} alt="cover" />
            
              <div className="text-white flex pt-6">
              
                <div className="w-16 text-white text-xl">
                  {formatTime(timePlayed)}
                </div>
                  
                <div className="flex-grow">
                  <div className="pt-3">
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-red-200">
                      <div style={{ width: calcTimeLeftStyle() }} 
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500" />
                    </div>
                  </div>
                </div>

                  
                <div className="w-16 text-white text-xl text-right">
                  {formatTime(props.length)}
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="col-span-2 grid grid-rows-6">
        <div />


        <div className="row-span-3 pt-20">
          <div className={`text-white ${titleSize}`}>
            {props.title}
          </div>

          <div className="pt-3 pl-1.5 text-5xl text-red-500">
            {props.artist}
          </div>
          <div className="text-white pt-3 pl-2 text-2xl">
            Added by <span className="text-red-500">{props.addedBy}</span> 
          </div>
          <div className="text-white pt-4 pl-2 text-2xl">
            Code <span className="text-red-500">{sessionContext.code}</span>
          </div>
        </div>
      </div>

    </div>
  </div>

}

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60000)
  const seconds = ((time % 60000) / 1000)
  return `${minutes}:${(seconds < 10 ? '0' : '')}${seconds.toFixed(0)}`
}

export default MusicBase