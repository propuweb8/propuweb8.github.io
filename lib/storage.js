import {
  getStorage
} from "./fabrica.js";

const storage = getStorage();

export async function
  subeStorage(nombre, archivo) {
  if (archivo instanceof File &&
    archivo.size > 0) {
    await storage.
      ref(nombre).
      put(archivo);
  }
}

export async function
  urlStorage(nombre) {
  try {
    return await storage.
      ref(nombre).
      getDownloadURL();
  } catch (e) {
    console.log(e);
    return "";
  }
}

export async function
  eliminaStorage(nombre) {
  return await storage.
    ref(nombre).delete();
}
