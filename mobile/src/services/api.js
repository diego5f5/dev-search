import axios from "axios";

const userIpv4 = "192.168.25.10"; // Alterar para IPv4 do usuário.

const api = axios.create({
  baseURL: `http://${userIpv4}:3333`,
});

export { api, userIpv4 };
