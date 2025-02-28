import { envs } from "./envs";

interface Cookies {
  httpOnly?: boolean;
  secure: boolean;
  sameSite?: "strict" | "lax" | "none";
}

export const configCookies: Cookies = {
  httpOnly: true, //solo se lee desde el servidor, false para que se lea con document.cookie
  secure: envs.NODE_ENV === "prod",
  sameSite: "strict", //solo se puede acceder desde el mismo dominio
};
