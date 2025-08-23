const URL = PRODUCTS_URL+"/101.json";

document.addEventListener("DOMContentLoaded", () => {
  fetch(URL)
    .then(response => response.json())
    .then(data => {
      const products = data.products;
      setCategoryTitle(data.catName);
      mostrarProductos(products);
    })
    .catch(error => console.error("Error al cargar los productos:", error));
});

function setCategoryTitle(catName) {
  const titleElement = document.getElementById("category-title");
  titleElement.textContent = catName;
}

function mostrarProductos(products) {
  const container = document.getElementById("products-container");
  container.innerHTML = "";

  products.forEach(product => {
    const { name, description, cost, currency, soldCount, image } = product;

    const productCard = document.createElement("div");
    productCard.classList.add("card", "mb-3");
    productCard.innerHTML = `
      <div class="row g-0">
        <div class="col-md-4 p-3">
            <img src="${image}" class="img-fluid rounded-start" alt="${name}">
        </div>
        <div class="col-md-8 d-flex flex-column justify-content-between p-3">
          <div>
            <h5 class="card-title">${name}</h5>
            <p class="card-text">${description}</p>
          </div>
          <div>
            <p class="card-text"><strong>Precio:</strong> ${currency} ${cost}</p>
            <p class="card-text"><small class="text-muted">Cant. vendidos: ${soldCount}</small></p>
          </div>
        </div>
      </div>
    `;
    container.appendChild(productCard);
  });
}
