const cartContainer = document.getElementById('cart-container');
const mensajeVacio = document.getElementById('mensaje-vacio');
const subtotalEl = document.getElementById('subtotal');
const costoEnvioEl = document.getElementById('costo-envio');
const totalEl = document.getElementById('total');
const btnComprar = document.getElementById('btn-comprar-todos');
const mensajeCompra = document.getElementById('mensaje-compra');

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let porcentajeEnvio = 0;
let timeoutMensaje = null; // <-- para controlar los mensajes activos

// === Mostrar mensajes visuales ===
function mostrarMensaje(texto, tipo = 'error') {
  // limpiar mensaje anterior y su temporizador
  clearTimeout(timeoutMensaje);
  mensajeCompra.innerHTML = `
    <div class="alert ${tipo === 'exito' ? 'alert-success' : 'alert-danger'} text-center" role="alert">
      ${texto}
    </div>
  `;
  mensajeCompra.scrollIntoView({ behavior: 'smooth' });

  // eliminar después de 3 segundos
  timeoutMensaje = setTimeout(() => {
    mensajeCompra.innerHTML = '';
  }, 3000);
}

// === Renderizar carrito ===
function renderCarrito() {
  
  cartContainer.innerHTML = '';

  if (carrito.length === 0) {
    mensajeVacio.style.display = 'block';
    subtotalEl.textContent = 'USD 0.00';
    costoEnvioEl.textContent = 'USD 0.00';
    totalEl.textContent = 'USD 0.00';
    return;
  }

  mensajeVacio.style.display = 'none';

  carrito.forEach((producto, index) => {
    const { nombre, costo, moneda, cantidad, imagen } = producto;

    const productoDiv = document.createElement('div');
    productoDiv.classList.add('producto', 'mb-3', 'd-flex', 'align-items-center', 'gap-3', 'border-bottom', 'pb-3');

    productoDiv.innerHTML = `
      <img src="${imagen}" alt="${nombre}">
      <div class="producto-details">
        <h5>${nombre}</h5>
        <p class="price">${moneda} ${costo}</p>
        <div class="cantidad-wrapper">
          <label for="cantidad-${index}">Cantidad:</label>
          <input id="cantidad-${index}" type="number" min="1" value="${cantidad}" class="cantidad-input" data-index="${index}">
          <button class="btn-eliminar" data-index="${index}" title="Eliminar">🗑️</button>
        </div>
        <p class="subtotal">Subtotal: ${moneda} <span class="subtotal-value">${costo * cantidad}</span></p>
      </div>
    `;

    cartContainer.appendChild(productoDiv);
  });

  actualizarTotales();
  actualizarBadgeCarrito();

}

// === Conversión a USD ===
function convertirADolares(costo, moneda) {
  return moneda === 'USD' ? costo : costo / 40;
}

// === Calcular subtotal, envío y total ===
function actualizarTotales() {
  const subtotalUSD = carrito.reduce((acc, p) => acc + convertirADolares(p.costo * p.cantidad, p.moneda), 0);
  const costoEnvio = subtotalUSD * porcentajeEnvio;
  const total = subtotalUSD + costoEnvio;

  subtotalEl.textContent = `USD ${subtotalUSD.toFixed(2)}`;
  costoEnvioEl.textContent = `USD ${costoEnvio.toFixed(2)}`;
  totalEl.textContent = `USD ${total.toFixed(2)}`;
}

// === Actualizar cantidades en tiempo real ===
cartContainer.addEventListener('input', (e) => {
  if (e.target.classList.contains('cantidad-input')) {
    const index = e.target.dataset.index;
    let nuevaCantidad = parseInt(e.target.value, 10);
    if (isNaN(nuevaCantidad) || nuevaCantidad < 1) nuevaCantidad = 1;

    carrito[index].cantidad = nuevaCantidad;
    localStorage.setItem('carrito', JSON.stringify(carrito));

    const subtotalEl = e.target.closest('.producto-details').querySelector('.subtotal-value');
    subtotalEl.textContent = (carrito[index].costo * nuevaCantidad).toLocaleString();

    actualizarTotales();
    actualizarBadgeCarrito();
  }
});

// === Eliminar producto ===
cartContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-eliminar')) {
    const index = e.target.dataset.index;
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderCarrito();
    actualizarBadgeCarrito();
  }
});

// === Seleccionar tipo de envío ===
document.querySelectorAll('input[name="envio"]').forEach(radio => {
  radio.addEventListener('change', (e) => {
    porcentajeEnvio = parseFloat(e.target.value);
    actualizarTotales();
  });
});

// === Validaciones y compra ===
btnComprar.addEventListener('click', () => {
  mensajeCompra.innerHTML = '';
  clearTimeout(timeoutMensaje);

  if (carrito.length === 0) {
    mostrarMensaje('Tu carrito está vacío.');
    return;
  }

  // Dirección
  const departamento = document.getElementById('departamento').value.trim();
  const localidad = document.getElementById('localidad').value.trim();
  const calle = document.getElementById('calle').value.trim();
  const numero = document.getElementById('numero').value.trim();
  const esquina = document.getElementById('esquina').value.trim();

  if (!departamento || !localidad || !calle || !numero || !esquina) {
    mostrarMensaje('Por favor, completa todos los campos de dirección.');
    return;
  }

  // Envío
  if (porcentajeEnvio === 0) {
    mostrarMensaje('Selecciona un tipo de envío.');
    return;
  }

  // Cantidades válidas
  const cantidadesInvalidas = carrito.some(p => p.cantidad < 1 || isNaN(p.cantidad));
  if (cantidadesInvalidas) {
    mostrarMensaje('Verifica las cantidades de los productos.');
    return;
  }

  // Forma de pago
  const metodoPago = document.querySelector('input[name="pago"]:checked');
  if (!metodoPago) {
    mostrarMensaje('Selecciona una forma de pago.');
    return;
  }

  // Exito
  mostrarMensaje('¡Compra realizada con éxito! Gracias por tu pedido.', 'exito');
  localStorage.removeItem('carrito');
  carrito = [];
  renderCarrito();
});

renderCarrito();

