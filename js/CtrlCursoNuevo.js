import {
  getAuth,
  getFirestore
} from "../lib/fabrica.js";
import {
  getString,
  muestraError
} from "../lib/util.js";
import {
  muestraCursos
} from "./navegacion.js";
import {
  tieneRol
} from "./seguridad.js";

const daoCurso =
  getFirestore().
    collection("Curso");
const forma = document["forma"];
getAuth().onAuthStateChanged(
  protege, muestraError);

async function protege(usuario) {
  if (tieneRol(usuario,
    ["Administrador"])) {
    forma.addEventListener(
      "submit", guarda);
  }
}

async function guarda(evt) {
  try {
    evt.preventDefault();
    const formData =
      new FormData(forma);
    const nombre = getString(
      formData, "nombre").trim();
    const modelo = {
      nombre
    };
    await daoCurso.
      add(modelo);
    muestraCursos();
  } catch (e) {
    muestraError(e);
  }
}
