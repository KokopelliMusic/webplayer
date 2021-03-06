import { useContext } from "react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Session, SessionContext, watchSessionCode } from "../data/session";
import settings from '../settings'

const Connect = () => {

  const [code, setCode] = useState('')
  const sessionContext = useContext(SessionContext)
  const history = useHistory()
 
  useEffect(() => {
    fetch(settings.makeUrl('session/new'))
      .then(resp => resp.json())
      .then(resp => {
        setCode(resp.code)
        watchSessionCode(resp.code, codeClaimed)
        return resp;
      })
      .catch(err => {
        console.error(err)
        alert(`Something went wrong, try refreshing.`)
      })

  }, [])

  const codeClaimed = (session: Session) => {
    sessionContext.setSession!(session)
    history.push('/player')
  }

  return <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4">
  <div className="max-w-lg min-w-lg w-full space-y-8">
    <div>
      <img
        className="mx-auto h-40 w-auto"
        src="./kokopelli.png"
        alt="Workflow"
      />
      <h1 className="pt-6 text-center text-3xl font-extrabold text-gray-900">
        Welcome to Kokopelli
      </h1>
      <p className="pt-3 text-center text-gray-600 text-lg">
        Link this device with the code below
      </p>
    </div>
    <div>
      <h1 className="text-center text-9xl font-black text-gray-900 uppercase">
        { code.split('').join(' ') }
      </h1>
    </div>
  </div>
</div>
}



export default Connect;
