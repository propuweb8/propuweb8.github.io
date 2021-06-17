import {
  getAuth,
  getFirestore
} from "../lib/fabrica.js";
import {
  muestraError
} from "../lib/util.js";

const firestore = getFirestore();
const daoUsuario = firestore.
  collection("Usuario");

export async function
  iniciaSesión() {
  const provider =
    new firebase.auth.
      GoogleAuthProvider();
  provider.setCustomParameters(
    { prompt: "select_account" });
  await getAuth().
    signInWithRedirect(provider);
}

export async function
  tieneRol(usuario, roles) {
  if (usuario && usuario.email) {
    const rolIds =
      await cargaRoles(
        usuario.email);
    for (const rol of roles) {
      if (rolIds.has(rol)) {
        return true;
      }
    }
    alert("No autorizado.");
    location.href = "index.html";
  } else {
    iniciaSesión();
  }
  return false;
}

export async function
  terminaSesión() {
  try {
    await getAuth().signOut();
  } catch (e) {
    muestraError(e);
  }
}

export async function
  cargaRoles(email) {
  let doc =
    await daoUsuario.
      doc(email).
      get();
  if (doc.exists) {
    const data = doc.data();
    return new Set(
      data.rolIds || []);
  } else {
    return new Set();
  }
}
