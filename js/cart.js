const cartContainer = document.getElementById('cart-container');
const mensajeVacio = document.getElementById('mensaje-vacio');
const totalEl = document.getElementById('total');

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function renderCarrito() {
  cartContainer.innerHTML = '';

  if (carrito.length === 0) {
    mensajeVacio.style.display = 'block';
    totalEl.textContent = '$0';
    return;
  }

  mensajeVacio.style.display = 'none';

  carrito.forEach((producto, index) => {
    const { nombre, costo, moneda, cantidad, imagen } = producto;

    const productoDiv = document.createElement('div');
    productoDiv.classList.add('producto', 'mb-3');

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

  actualizarTotal();
}

// Actualizar subtotal y total en tiempo real
cartContainer.addEventListener('input', (e) => {
  if (e.target.classList.contains('cantidad-input')) {
    const index = e.target.dataset.index;
    const nuevaCantidad = parseInt(e.target.value, 10) || 1;

    carrito[index].cantidad = nuevaCantidad;
    localStorage.setItem('carrito', JSON.stringify(carrito));

    const subtotalEl = e.target.parentElement.parentElement.querySelector('.subtotal-value');
    subtotalEl.textContent = carrito[index].costo * nuevaCantidad;

    actualizarTotal();
  }
});

// Funcionalidad de eliminar producto
cartContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-eliminar')) {
    const index = e.target.dataset.index;
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderCarrito();
  }
});

function actualizarTotal() {
  const total = carrito.reduce((acc, p) => acc + (p.costo * p.cantidad), 0);
  totalEl.textContent = `${carrito[0]?.moneda || ''} ${total}`;
}

renderCarrito();
