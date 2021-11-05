import { useEffect, useState } from 'react'
import YouTubeIFrame, { Options } from 'react-youtube'
import { YouTubeEventData } from '../data/session'


const YouTube = (props: YouTubeEventData) => {

  // const [title, setTitle] = useState<string>('Outsiders, Django Wagner - Kali (Outsiders Remix)')
  const titleSize = 2.0

  const onReady = () => {

  }

  const convertRemToPixels = (rem: number): number => {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
}

  const calcScreenHeight = (): string => {
    return '' + (window.innerHeight - convertRemToPixels(titleSize)) 
  }

  const opts: Options = {
    height: calcScreenHeight(),
    width: '' + window.innerWidth,
    playerVars: {
      autoplay: 1,
      controls: 0,
      enablejsapi: 1,
      fs: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      origin: window.origin,
      showinfo: 0,
    }
  }

  return <div className="bg-black">
    <div className="text-2xl text-white flex justify-between pl-4 pr-4">
      <h1>{props.title}</h1>
      <div className="">
        <span className="pr-4">{props.addedBy}</span>
        <span>{props.code}</span>
      </div>
    </div>
    <div className="w-screen flex flex-center justify-center">
      <YouTubeIFrame videoId="K70nC0FbxiU" onReady={onReady} opts={opts}/>
    </div>
  </div>
}

export default YouTube