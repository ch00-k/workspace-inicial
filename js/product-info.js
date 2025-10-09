// Obtener ID de producto desde la URL
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

document.addEventListener("DOMContentLoaded", () => {

  fetch(PRODUCT_INFO_URL + productId + EXT_TYPE)
    .then(response => response.json())
    .then(product => {
      mostrarProducto(product);
      mostrarProductosRelacionados(product.relatedProducts);
    })
    .catch(error => console.error("Error al cargar producto:", error));

  
  fetch(PRODUCT_INFO_COMMENTS_URL + productId + EXT_TYPE)
    .then(response => response.json())
    .then(comments => {
      mostrarComentarios(comments);
    })
    .catch(error => console.error("Error al cargar comentarios:", error));

  
  document.getElementById("comment-form").addEventListener("submit", agregarComentario);
});


// Mostrar info del producto

function mostrarProducto(product) {
  document.getElementById("product-name").textContent = product.name;
  document.getElementById("product-category").textContent = "Categoría: " + product.category;
  document.getElementById("product-description").textContent = product.description;
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

    thumb.addEventListener("click", () => {
      mainImage.src = img;
    });
    thumbnailsContainer.appendChild(thumb);
  });
}



// Mostrar comentarios 

function mostrarComentarios(comments) {
  const container = document.getElementById("comments-container");
  container.innerHTML = "";

  // Cargar comentarios guardados localmente
  const storedComments = JSON.parse(localStorage.getItem(`comments_${productId}`)) || [];
  const allComments = [...comments, ...storedComments];

  allComments.forEach(comment => {
    const commentDiv = document.createElement("div");
    commentDiv.classList.add("border", "rounded", "p-3", "mb-3", "shadow-sm", "position-relative");

    const stars = renderStars(comment.score);

    commentDiv.innerHTML = `
      <div class="d-flex justify-content-between align-items-start mb-2">
        <strong>${comment.user}</strong>
        <div class="stars-container">${stars}</div>
      </div>
      <p class="mb-0">${comment.description}</p>
      <div class="text-end text-muted small mt-2">${comment.dateTime}</div>
    `;

    container.appendChild(commentDiv);
  });
}

// Renderizar estrellas fijas con Font Awesome
function renderStars(score) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    stars += `<i class="fa fa-star${i <= score ? ' filled-star' : ' empty-star'}"></i>`;
  }
  return stars;
}

// Estrellas interactivas 

let selectedScore = 0;

document.addEventListener("DOMContentLoaded", () => {
  const starsContainer = document.getElementById("star-rating");
  if (!starsContainer) return;

  // Crear 5 estrellas clicables
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("i");
    star.classList.add("fa", "fa-star", "interactive-star");
    star.dataset.value = i;

    star.addEventListener("mouseover", () => pintarEstrellas(i));
    star.addEventListener("mouseout", () => pintarEstrellas(selectedScore));
    star.addEventListener("click", () => {
      selectedScore = i;
      pintarEstrellas(selectedScore);
    });

    starsContainer.appendChild(star);
  }


  pintarEstrellas(0);
});


function pintarEstrellas(valor) {
  const stars = document.querySelectorAll("#star-rating .interactive-star");
  stars.forEach(star => {
    const val = parseInt(star.dataset.value);
    if (val <= valor) {
      star.style.color = "#ff9900"; 
    } else {
      star.style.color = "#ccc"; 
    }
  });
}


// Agregar nuevo comentario con LocalStorage
function agregarComentario(e) {
  e.preventDefault();

  const text = document.getElementById("comment-text").value.trim();
  const score = selectedScore;
  const user = localStorage.getItem("usuario") || "Usuario";
  const dateTime = new Date().toISOString().slice(0, 19).replace("T", " ");

  if (!text || score === 0) {
    alert("Por favor completa el comentario y selecciona un puntaje.");
    return;
  }

  const nuevoComentario = { user, description: text, score, dateTime };

  // Guardar en LocalStorage
  const storedComments = JSON.parse(localStorage.getItem(`comments_${productId}`)) || [];
  storedComments.push(nuevoComentario);
  localStorage.setItem(`comments_${productId}`, JSON.stringify(storedComments));

  // Mostrar en pantalla
  const container = document.getElementById("comments-container");
  const commentDiv = document.createElement("div");
  commentDiv.classList.add("border", "rounded", "p-3", "mb-3", "shadow-sm", "position-relative");
  commentDiv.innerHTML = `
    <div class="d-flex justify-content-between align-items-start mb-2">
      <strong>${nuevoComentario.user}</strong>
      <div class="stars-container">${renderStars(nuevoComentario.score)}</div>
    </div>
    <p class="mb-0">${nuevoComentario.description}</p>
    <div class="text-end text-muted small mt-2">${nuevoComentario.dateTime}</div>
  `;
  container.prepend(commentDiv);

  // Limpiar formulario
  document.getElementById("comment-form").reset();
  selectedScore = 0;
  pintarEstrellas(0);
}



// Productos relacionados
function mostrarProductosRelacionados(relatedProducts) {
  const container = document.getElementById("related-products-container");
  container.innerHTML = "";

  relatedProducts.forEach(prod => {
    const card = document.createElement("div");
    card.classList.add("col-md-3");
    card.innerHTML = `
      <div class="card h-100 shadow-sm product-card" style="cursor:pointer;">
        <img src="${prod.image}" class="card-img-top" alt="${prod.name}">
        <div class="card-body">
          <h6 class="card-title">${prod.name}</h6>
        </div>
      </div>
    `;

    card.addEventListener("click", () => {
      // Navegar al producto relacionado
      window.location.href = `product-info.html?id=${prod.id}`;
    });

    container.appendChild(card);
  });
}
