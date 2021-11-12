import { useContext, useRef } from "react"
import { useEffect, useState } from "react"
import { MP3Extras, SessionContext, SpotifyExtras } from "../data/session"
import ColorThief from 'colorthief'
import './MusicBase.css'

interface MusicBaseProps {
  title: string
  code: string
  addedBy: string
  song: SpotifyExtras | MP3Extras | undefined
}
const MusicBase = (props: MusicBaseProps) => {

  const sessionContext = useContext(SessionContext)

  const [titleSize, setTitleSize] = useState('text-8xl')
  const [timePlayed, setTimePlayed] = useState(0)
  const [timeInterval, setTimeInterval] = useState<NodeJS.Timeout>()
  const [backgroundColor, setBackgroundColor] = useState<string>('#312e81')
  const [textColor, setTextColor] = useState<string>('#000')

  const albumCoverRef = useRef<HTMLImageElement>(null)

  const colorThief: ColorThief = new ColorThief()

  useEffect(() => {
    console.log('MusicBase props:', props)
  }, [])

  useEffect(() => {
    // Dynamically change font size for the title, depending on how long the title is
    let size = 'text-8xl'
    if (props.title.length > 30) size = 'text-7xl'
    if (props.title.length > 80) size = 'text-5xl'

    setTitleSize(size)

  }, [props.title.length])

  useEffect(() => {
    if (props.song && props.song.length >= 0) {
      console.log('MusicBase.props', props)
      if (timeInterval) {
        clearInterval(timeInterval)
      }
      
      setTimePlayed(0)
      setTimeInterval(setInterval(() => {
        setTimePlayed(timePlayed => timePlayed + 1000)
      }, 1000))
    }

    return () => {
      clearInterval(timeInterval!)
    }
  }, [props.song])

  const calcTimeLeftStyle = () => {
    // @ts-expect-error
    return `${Math.floor((timePlayed / props.song.length) * 100)}%`
  }

  const selectTextColor = (r: number, g: number, b: number) => {
    const yiq = ((r*299) + (g*587) + (b*114)) / 1000;
    
    if (yiq >= 128) {
      setTextColor('#000')
    } else {
      setTextColor('#FFF')
    }
  }

  const selectBackgroundColor = () => {
    // const img = albumCoverRef.current
    const img = document.getElementById('img-test') as HTMLImageElement
    if (!img?.src) {
      console.error('stuk', albumCoverRef.current)
      return '#312e81'
    }
    
    const color = colorThief.getColor(img)
    const hex = rgbToHex(color[0], color[1], color[2])
  
    console.log(hex)
    selectTextColor(color[0], color[1], color[2])
    setBackgroundColor(hex)
  }

  const rgbToHex = (r: number, g: number, b: number): string => {
    const component = (c: number): string => {
      let hex = c.toString(16)
      return hex.length === 1 ? "0" + hex : hex
    }

    return '#' + component(r) + component(g) + component(b)
  }

  if (!props || !props.song) {
    return <div></div>
  }

  return <div 
    className="h-screen font-player" 
    style={{ 
      backgroundColor, 
      color: textColor,
      transition: 'all .5s ease',
      WebkitTransition: 'all .5s ease',
      MozTransition: 'all .5s ease'
    }}>
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
              <img 
                className="rounded-3xl shadow-2xl-white"     
                src={props.song!.cover} 
                ref={albumCoverRef}
                id="img-test"
                crossOrigin="anonymous"
                onLoad={selectBackgroundColor}
                alt="cover" />
            
              <div className="flex pt-6">
              
                <div className="w-16 text-xl">
                  {formatTime(timePlayed)}
                </div>
                  
                <div className="flex-grow">
                  <div className="pt-3">
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-red-200">
                      <div style={{ width: calcTimeLeftStyle() }} 
                      className="shadow-none flex flex-col text-center whitespace-nowrap justify-center bg-red-500" />
                    </div>
                  </div>
                </div>

                  
                <div className="w-16 text-xl text-right">
                  {formatTime(props.song.length)}
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="col-span-2 grid grid-rows-6">
        <div />


        <div className="row-span-3 pt-20">
          <div className={`${titleSize}`}>
            {props.title}
          </div>

          <div className="pt-3 pl-1.5 text-5xl">
            {props.song.artist}
          </div>
          <div className="pt-3 pl-2 text-2xl">
            Added by <span className="italic">{props.addedBy}</span> 
          </div>
          <div className="pt-4 pl-2 text-2xl">
            Code <span className="underline">{sessionContext.code}</span>
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