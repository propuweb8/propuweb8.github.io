import {
  getAuth,
  getFirestore
} from "../lib/fabrica.js";
import {
  eliminaStorage,
  urlStorage
} from "../lib/storage.js";
import {
  muestraError
} from "../lib/util.js";
import {
  muestraUsuarios
} from "./navegacion.js";
import {
  tieneRol
} from "./seguridad.js";
import {
  checksRoles,
  guardaUsuario,
  selectCursos
} from "./usuarios.js";

const params =
  new URL(location.href).
    searchParams;
const id = params.get("id");
const daoUsuario = getFirestore().
  collection("Usuario");
const forma = document["forma"];
const img = document.
  querySelector("img");
const listaRoles = document.
  querySelector("#listaRoles");
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
    const doc = await daoUsuario.
      doc(id).
      get();
    if (doc.exists) {
      const data = doc.data();
      forma.cue.value = id || "";
      img.src =
        await urlStorage(id);
      selectCursos(
        forma.cursoId,
        data.cursoId)
      checksRoles(
        listaRoles, data.rolIds);
      forma.addEventListener(
        "submit", guarda);
      forma.eliminar.
        addEventListener(
          "click", elimina);
    }
  } catch (e) {
    muestraError(e);
    muestraUsuarios();
  }
}

async function guarda(evt) {
  await guardaUsuario(evt,
    new FormData(forma), id);
}

async function elimina() {
  try {
    if (confirm("Confirmar la " +
      "eliminación")) {
      await daoUsuario.
        doc(id).delete();
      await eliminaStorage(id);
      muestraUsuarios();
    }
  } catch (e) {
    muestraError(e);
  }
}
