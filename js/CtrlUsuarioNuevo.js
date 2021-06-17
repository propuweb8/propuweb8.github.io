import {
  getAuth
} from "../lib/fabrica.js";
import {
  getString,
  muestraError
} from "../lib/util.js";
import {
  tieneRol
} from "./seguridad.js";
import {
  checksRoles,
  guardaUsuario,
  selectPasatiempos
} from "./usuarios.js";

const forma = document["forma"];
const listaRoles = document.
  querySelector("#listaRoles");

getAuth().onAuthStateChanged(
  protege, muestraError);

async function protege(usuario) {
  if (tieneRol(usuario,
    ["Administrador"])) {
    forma.addEventListener(
      "submit", guarda);
    selectPasatiempos(
      forma.pasatiempoId, "");
    checksRoles(listaRoles, []);
  }
}

async function guarda(evt) {
  const formData =
    new FormData(forma);
  const id = getString(
    formData, "cue").trim();
  await guardaUsuario(evt,
    formData, id);
}
