// hooks/useSocket.ts
import { useCallback, useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

const ENDPOINT = "http://localhost:3000";

const useSocket = (chatId: string, currUser: any) => {
  const socketRef = useRef<Socket | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    // if (!chatId || !currUser) return;

    socketRef.current = io(ENDPOINT);

    socketRef.current.on("connect", () => {
      console.log("Socket connected");
      setSocketConnected(true);
    });

    socketRef.current.emit("setup", currUser);
    socketRef.current.emit("join chat", chatId);

    return () => {
      if (socketRef.current) {
        socketRef.current.off();
        socketRef.current.disconnect();
        console.log("Socket disconnected");
      }
    };
  }, [chatId, currUser]);

  const onNewMessage = useCallback((callback: (message: any) => void) => {
    socketRef.current?.on("newMessage", callback);
    return () => {
      socketRef.current?.off("newMessage", callback);
    };
  }, []);

  return { socket: socketRef.current, socketConnected, onNewMessage };
};

export default useSocket;
