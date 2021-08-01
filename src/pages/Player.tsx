import { useEffect } from 'react';
import { checkPlayerCode, getPlayerCode, redirect } from '../util'

const Player: React.FC = () => {
  const code: string = getPlayerCode()

  useEffect(() => {
    const fun = async () => {
      if (! await checkPlayerCode(code)) {
        alert(`Sorry, but playlist ${code} does not exists. Sending you back to home.`)
        redirect('/')
      }
    }
    fun()
  });

  return (
    <div className="">

    </div>
  )
}

export default Player