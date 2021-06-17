import {
  getAuth,
  getFirestore
} from "../lib/fabrica.js";
import {
  getString,
  muestraError
} from "../lib/util.js";
import {
  muestraPasatiempos
} from "./navegacion.js";
import {
  tieneRol
} from "./seguridad.js";

const daoPasatiempo =
  getFirestore().
    collection("Pasatiempo");
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
      await daoPasatiempo.
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
    muestraPasatiempos();
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
    await daoPasatiempo.
      doc(id).
      set(modelo);
    muestraPasatiempos();
  } catch (e) {
    muestraError(e);
  }
}

async function elimina() {
  try {
    if (confirm("Confirmar la " +
      "eliminación")) {
      await daoPasatiempo.
        doc(id).
        delete();
      muestraPasatiempos();
    }
  } catch (e) {
    muestraError(e);
  }
}
