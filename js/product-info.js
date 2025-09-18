// Obtener ID de producto desde la URL
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

document.addEventListener("DOMContentLoaded", () => {
  fetch(PRODUCT_INFO_URL + productId + EXT_TYPE)
    .then(response => response.json())
    .then(product => {
      mostrarProducto(product);
    })
    .catch(error => console.error("Error al cargar producto:", error));
});

function mostrarProducto(product) {
  // Título y categoría
  document.getElementById("product-name").textContent = product.name;
  document.getElementById("product-category").textContent = "Categoría: " + product.category;

  // Descripción
  document.getElementById("product-description").textContent = product.description;

  // Precio y vendidos
  document.getElementById("product-price").textContent = product.currency + " " + product.cost;
  document.getElementById("product-soldcount").textContent = product.soldCount;

  // Imagen principal
  const mainImage = document.getElementById("main-image");
  mainImage.src = product.images[0];
  mainImage.alt = product.name;

  // Miniaturas
  const thumbnailsContainer = document.getElementById("thumbnails-container");
  thumbnailsContainer.innerHTML = "";

  product.images.forEach((img, index) => {
    const thumb = document.createElement("img");
    thumb.src = img;
    thumb.alt = `${product.name} - imagen ${index + 1}`;
    thumb.classList.add("img-thumbnail", "mb-2", "d-block", "thumbnails-small");
    thumb.style.cursor = "pointer";

    // cambiar imagen principal al hacer click
    thumb.addEventListener("click", () => {
      mainImage.src = img;
    });

    thumbnailsContainer.appendChild(thumb);
  });
}
