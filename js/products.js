const URL = PRODUCTS_URL+localStorage.getItem("catID")+".json";
const ORDER_ASC_BY_PRICE = "AZ";
const ORDER_DESC_BY_PRICE = "ZA";
const ORDER_BY_RELEVANCE = "Rel.";
let currentProductsArray = [];
let currentSortCriteria = undefined;

function sortProducts(criteria, array) {
  let result = [];
  if (criteria === ORDER_ASC_BY_PRICE) {
    result = array.sort((a, b) => a.cost - b.cost);
  } else if (criteria === ORDER_DESC_BY_PRICE) {
    result = array.sort((a, b) => b.cost - a.cost);
  } else if (criteria === ORDER_BY_RELEVANCE) {
    result = array.sort((a, b) => b.soldCount - a.soldCount);
  }
  return result;
}

function sortAndShowProducts(sortCriteria, productsArray) {
  currentSortCriteria = sortCriteria;

  if (productsArray != undefined) {
    currentProductsArray = productsArray;
  }

  currentProductsArray = sortProducts(currentSortCriteria, currentProductsArray);

  mostrarProductos(currentProductsArray);
}



document.addEventListener("DOMContentLoaded", () => {
  fetch(URL)
    .then(response => response.json())
    .then(data => {
      currentProductsArray = data.products;
      setCategoryTitle(data.catName);
      mostrarProductos(currentProductsArray);
    })
    .catch(error => console.error("Error al cargar los productos:", error));

  document.getElementById("sortAscP").addEventListener("change", () => {
  sortAndShowProducts(ORDER_ASC_BY_PRICE);
  });
  document.getElementById("sortDescP").addEventListener("change", () => {
  sortAndShowProducts(ORDER_DESC_BY_PRICE);
  });
  document.getElementById("sortByRel").addEventListener("change", () => {
  sortAndShowProducts(ORDER_BY_RELEVANCE);
  });

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


