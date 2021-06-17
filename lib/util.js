export function muestraError(e) {
  console.error(e);
  alert(e.message);
}

export function cod(texto) {
  return (texto || "").
    toString().
    replace(/[<>"']/g, reemplaza);
}

function reemplaza(letra) {
  switch (letra) {
    case "<": return "&lt;";
    case ">": return "&gt;";
    case '"': return "&quot;";
    case "'": return "&#039;";
    default: return letra;
  }
}

export function
  getString(formData, name) {
  const valor =
    formData.get(name);
  return (
    typeof valor === "string" ?
      valor : "" );
}

export function
  getForánea(formData, name) {
  const valor =
    formData.get(name);
  return (
    typeof valor === "string" ?
      (valor || null) : null );
}
