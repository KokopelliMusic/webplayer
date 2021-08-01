import { createContext } from "react";
import { Socket } from "socket.io-client";

interface ISocketContext {
  socket?: Socket,
  id?: string
}

const SocketContext = createContext<ISocketContext>({})

export default SocketContext