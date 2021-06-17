import {
  getAuth,
  getFirestore
} from "../lib/fabrica.js";
import {
  cod,
  getString,
  muestraError
} from "../lib/util.js";
import {
  tieneRol
} from "./seguridad.js";

const daoMensaje = getFirestore().
  collection("Mensaje");
let usuarioId = "";
const forma = document["forma"];
const lista = document.
  querySelector("#lista");

getAuth().onAuthStateChanged(
  protege, muestraError);

async function protege(usuario) {
  if (tieneRol(usuario,
    ["Cliente"])) {
    usuarioId = usuario.email;
    consulta();
    forma.addEventListener(
      "submit", agrega);
  }
}

async function agrega(evt) {
  try {
    evt.preventDefault();
    const formData =
      new FormData(forma);
    const texto = getString(
      formData, "texto").trim();
    const timestamp =
      firebase.firestore.
        FieldValue.
        serverTimestamp();
    const modelo = {
      usuarioId,
      texto,
      timestamp
    };
    await daoMensaje.add(modelo);
    forma.texto.value = "";
  } catch (e) {
    muestraError(e);
  }
}

function consulta() {
  daoMensaje.
    orderBy("timestamp", "desc").
    onSnapshot(
      htmlLista, errConsulta);
}

function htmlLista(snap) {
  let html = "";
  if (snap.size > 0) {
    snap.forEach(doc =>
      html += htmlFila(doc));
  } else {
    html += 
      `<li class="vacio">
        -- No hay discusiones
        registradas. --
      </li>`;
  }
  lista.innerHTML = html;
}

function htmlFila(doc) {
  const data = doc.data();
  return ( 
    `<li class="fila">
      <strong class="primario">
        ${cod(data.usuarioId)}
      </strong>
      <span class="secundario">
        ${cod(data.texto)}
      </span>
    </li>`);
}

function errConsulta(e) {
  muestraError(e);
  consulta();
}
