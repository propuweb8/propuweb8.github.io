import {
  getFirestore
} from "../lib/fabrica.js";
import {
  subeStorage
} from "../lib/storage.js";
import {
  cod, getForánea, muestraError
} from "../lib/util.js";
import {
  muestraUsuarios
} from "./navegacion.js";

const SIN_PASATIEMPO = 
  `<option value="">
    -- Sin Curso cargado --
  </option>`;

const firestore = getFirestore();
const daoRol = firestore.
  collection("Rol");
const daoPasatiempo = firestore.
  collection("Pasatiempo");
const daoUsuario = firestore.
  collection("Usuario");

export function
  selectPasatiempos(select,
    valor) {
  valor = valor || "";
  daoPasatiempo.
    orderBy("nombre").
    onSnapshot(
      snap => {
        let html = SIN_PASATIEMPO;
        snap.forEach(doc =>
          html += htmlPasatiempo(
            doc, valor));
        select.innerHTML = html;
      },
      e => {
        muestraError(e);
        selectPasatiempos(
          select, valor);
      }
    );
}

function
  htmlPasatiempo(doc, valor) {
  const selected =
    doc.id === valor ?
      "selected" : "";
  const data = doc.data();
  return (
    `<option
        value="${cod(doc.id)}"
        ${selected}>
      ${cod(data.nombre)}
    </option>`);
}

export function
  checksRoles(elemento, valor) {
  const set =
    new Set(valor || []);
  daoRol.onSnapshot(
    snap => {
      let html = "";
      if (snap.size > 0) {
        snap.forEach(doc =>
          html +=
          checkRol(doc, set));
      } else {
        html += 
          `<li class="vacio">
              -- No hay roles
              registrados. --
            </li>`;
      }
      elemento.innerHTML = html;
    },
    e => {
      muestraError(e);
      checksRoles(
        elemento, valor);
    }
  );
}

export function
  checkRol(doc, set) {
  const data = doc.data();
  const checked =
    set.has(doc.id) ?
      "checked" : "";
  return (
    `<li>
      <label class="fila">
        <input type="checkbox"
            name="rolIds"
            value="${cod(doc.id)}"
          ${checked}>
        <span class="texto">
          <strong
              class="primario">
            ${cod(doc.id)}
          </strong>
          <span
              class="secundario">
          ${cod(data.descripción)}
          </span>
        </span>
      </label>
    </li>`);
}

export async function
  guardaUsuario(evt, formData,
    id) {
  try {
    evt.preventDefault();
    const pasatiempoId =
      getForánea(formData,
        "pasatiempoId");
    const rolIds =
      formData.getAll("rolIds");
    await daoUsuario.
      doc(id).
      set({
        pasatiempoId,
        rolIds
      });
    const avatar =
      formData.get("avatar");
    await subeStorage(id, avatar);
    muestraUsuarios();
  } catch (e) {
    muestraError(e);
  }
}
