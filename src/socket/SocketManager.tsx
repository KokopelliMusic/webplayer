import React, { useContext } from "react";
import { Socket } from "socket.io-client";
import Events from "./Events";
import SocketContext from "./SocketContext";

interface SocketManagerProps {
  io: Socket
}

export default class SocketManager extends React.Component<SocketManagerProps> {

  private io: Socket
  static contextType = SocketContext

  constructor(props: SocketManagerProps) {
    super(props)
    this.io = props.io
    this.setupSession()
    this.setupRoutes()
    this.state = {
      code: 'NOCO'
    }
  }

  private setupSession() {
    this.io.on(Events.SESSION_ID, id => {
      this.io.emit(Events.ACK_SESSION, id)
      this.setState({
        code: id
      })
      alert(id)
    })
  }

  private setupRoutes() {
  }

  render() {
    return <>{ this.props.children }</>
  }
  
}