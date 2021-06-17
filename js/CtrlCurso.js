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
const params =
  new URL(location.href).
    searchParams;
const id = params.get("id");
const forma = document["forma"];

getAuth().onAuthStateChanged(
  protege, muestraError);

async function protege(usuario) {
  if (tieneRol(usuario,
    ["Administrador"])) {
    busca();
  }
}

async function busca() {
  try {
    const doc =
      await daoCurso.
        doc(id).
        get();
    if (doc.exists) {
      const data = doc.data();
      forma.nombre.value =
        data.nombre || "";
      forma.addEventListener(
        "submit", guarda);
      forma.eliminar.
        addEventListener(
          "click", elimina);
    } else {
      throw new Error(
        "No se encontró.");
    }
  } catch (e) {
    muestraError(e);
    muestraCursos();
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
      doc(id).
      set(modelo);
    muestraCursos();
  } catch (e) {
    muestraError(e);
  }
}

async function elimina() {
  try {
    if (confirm("Confirmar la " +
      "eliminación")) {
      await daoCurso.
        doc(id).
        delete();
      muestraCursos();
    }
  } catch (e) {
    muestraError(e);
  }
}
