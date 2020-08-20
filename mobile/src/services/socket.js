import socketio from "socket.io-client";
import { userIpv4 } from "./api";

const socket = socketio(`http://${userIpv4}:3333`, {
  autoConnect: false,
});

function subscribeToNewDevs(subscribeFunction) {
  socket.on("new_dev", subscribeFunction);
}

function connect(latitude, longitude, techs) {
  socket.io.opts.query = {
    latitude: latitude,
    longitude: longitude,
    techs: techs,
  };
  socket.connect();
}

function disconnect() {
  if (socket.connected) {
    socket.disconnect();
  }
}

export { connect, disconnect, subscribeToNewDevs };
