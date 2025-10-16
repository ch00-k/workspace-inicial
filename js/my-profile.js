document.addEventListener("DOMContentLoaded", () => {
  const nombreInput = document.getElementById("nombre");
  const apellidoInput = document.getElementById("apellido");
  const telefonoInput = document.getElementById("telefono");
  const emailInput = document.getElementById("email");
  const btnEditarGuardar = document.getElementById("btnEditarGuardar");

  const inputFile = document.getElementById("inputFile");
  const btnSubirFoto = document.getElementById("btnSubirFoto");
  const eliminarFotoText = document.getElementById("eliminarFoto"); // texto para eliminar
  const profilePic = document.getElementById("profilePic");

  const imgDefault = "img/img_perfil.png"; // imagen por defecto

  // --- FOTO DE PERFIL ---
  const imgGuardada = localStorage.getItem("imgB64");
  profilePic.src = imgGuardada || imgDefault;

  // Inicialmente ocultar controles de edición de foto
  btnSubirFoto.style.display = "none";
  eliminarFotoText.style.display = "none";

  // Subir nueva imagen
  btnSubirFoto.addEventListener("click", () => inputFile.click());

  inputFile.addEventListener("change", () => {
    const file = inputFile.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      const srcData = event.target.result;
      let y = (srcData[srcData.length - 2] === '=') ? 2 : 1;
      let sizeB = (srcData.length * (3 / 4)) - y;

      if (sizeB < 4_000_000) {
        localStorage.setItem("imgB64", srcData);
        profilePic.src = srcData;
      } else {
        alert("Tu imagen debe ser menor a 4 MB");
      }
    };
    reader.readAsDataURL(file);
  });

  // Eliminar imagen
  eliminarFotoText.addEventListener("click", () => {
    localStorage.removeItem("imgB64");
    profilePic.src = imgDefault;
  });

  // --- DATOS PERSONALES ---
  [nombreInput, apellidoInput, telefonoInput].forEach(input => input.disabled = true);

  const usuarioGuardado = localStorage.getItem("usuario");
  if (usuarioGuardado) {
    emailInput.value = usuarioGuardado;
    emailInput.disabled = true;
  }

  const datosPerfil = JSON.parse(localStorage.getItem("perfilUsuario")) || {};
  if (datosPerfil.nombre) nombreInput.value = datosPerfil.nombre;
  if (datosPerfil.apellido) apellidoInput.value = datosPerfil.apellido;
  if (datosPerfil.telefono) telefonoInput.value = datosPerfil.telefono;

  let modoEdicion = false;

  // Alternar entre editar y guardar
  btnEditarGuardar.addEventListener("click", () => {
    modoEdicion = !modoEdicion;

    [nombreInput, apellidoInput, telefonoInput].forEach(input => input.disabled = !modoEdicion);

    // Mostrar/ocultar controles de imagen según modo edición
    btnSubirFoto.style.display = modoEdicion ? "inline-block" : "none";
    eliminarFotoText.style.display = modoEdicion ? "block" : "none";

    if (modoEdicion) {
      btnEditarGuardar.textContent = "Guardar";
    } else {
      const datos = {
        nombre: nombreInput.value.trim(),
        apellido: apellidoInput.value.trim(),
        telefono: telefonoInput.value.trim(),
      };
      localStorage.setItem("perfilUsuario", JSON.stringify(datos));


      // Confirmación rápida
      btnEditarGuardar.textContent = "Guardado ✓";
      setTimeout(() => {
        btnEditarGuardar.textContent = "Editar";
      }, 1000);
    }
  });
});
