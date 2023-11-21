const ContenedorProductos = document.querySelector("#grid");
const ContenedorCarta = document.querySelector("#shopping-cart");
const ContenidoCartaProducto = document.querySelector("#cart-content");
const BotonCarrito = document.querySelector("#toggle-cart-btn");
const BotonLimpiar = document.querySelector("#clear-cart");
const BotonComprar = document.querySelector("#checkout-btn");
const parrafoPrecio = document.querySelector("#total-price");

if (typeof (Storage) !== "undefined") {
  console.log(Storage);
} else {
  console.log("Storage no es compatible con este navegador.");
}

let traeProductos = () => {
  fetch('/ferreteria/', { method: 'GET' })
    .then(response => response.json())
    .then(data => armaTemplate(data));

  function armaTemplate(productos) {
    let template = "";
    productos.forEach(producto => {
      let precioFormateado = new Intl.NumberFormat('es-AR').format(producto.precio);
      template += `
        <div class="card">
        <img src="${producto.imagen}" class="card__image" width="200" height="200">
        <div class="card__info">
          <h4 class="card__title">${producto.descripcion}</h4>
          <p class="card__text">Cod. ${producto.codigo}</p>
          <p class="card__price">$ ${precioFormateado}</p>
          <button class="card__btn add-to-cart" data-id="8" onclick="agregaProducto(${producto.id},'${producto.descripcion}','${producto.imagen}',${producto.precio}, ${producto.codigo})">Agregar al Carrito</button>
        </div>
      </div>`
    });
    ContenedorProductos.innerHTML = template;
  }
}

traeProductos();

function GuardarContenidoLS() {
  localStorage.setItem("ProductosCarrito", JSON.stringify(carrito));
}

let carrito = [];
let contador = 0;
let siProductoEstaba = false;

function agregaProducto(id, desc, img, precio, cod) {
  contador++;

  let item = {
    'id': id,
    'descripcion': desc,
    'codigo': cod,
    'imagen': img,
    'precio': precio,
    'cantidad': 0,
  }

  document.querySelector('#contador').innerHTML = contador;

  for (let i = 0; i < carrito.length; i++) {
    if (item.id === carrito[i].id) {
      siProductoEstaba = true;
      carrito[i].cantidad++;
    }
  }
  if (!siProductoEstaba) {
    item.cantidad = 1;
    let elem = carrito.push(item);
  };

  GuardarContenidoLS();
}

let totalCarrito;

BotonCarrito.addEventListener("click", function (e) {
  armaCarrito();
  muestraCarrito();
});

function armaCarrito() {

  let html = "";
    totalCarrito = 0;
    for (let i = 0; i < carrito.length; i++) {
      let producto = carrito[i];
      let producto_importe = producto.cantidad * producto.precio;
      totalCarrito = totalCarrito + producto_importe;

      html += `
        <tr><td><img class="cart-image" src="${producto.imagen}" alt="${producto.descripcion}" height="50px" width="50px"></td>
        <td>${producto.codigo}</td>
        <td>${producto.descripcion}</td>
        <td><div class="cuadradito" onclick="resto(${producto.id})">-</div>
        <div id="canti${producto.id}">${producto.cantidad}</div>
        <div class="cuadradito" onclick="sumo(${producto.id})">+</div></td>
        <td><div id="importe${producto.id}">$ ${new Intl.NumberFormat('es-AR').format(producto_importe)}</td>
        </tr>`;
    }

    ContenidoCartaProducto.querySelector("tbody").innerHTML = html;

    parrafoPrecio.innerHTML = ("Total $") + new Intl.NumberFormat('es-AR').format(totalCarrito);

}

function sumo(id) {
  let producto = carrito.find(element => element.id === id);
  let posicion = carrito.indexOf(producto);
  producto.cantidad++;
  carrito.splice(posicion, 1, producto);
  document.querySelector(`#canti${producto.id}`).innerHTML = producto.cantidad;
  let producto_importe = producto.cantidad * producto.precio;
  document.querySelector(`#importe${producto.id}`).innerHTML = new Intl.NumberFormat('es-AR').format(producto_importe);
  totalCarrito += producto.precio;
  parrafoPrecio.innerHTML = ("Total: $ ") + new Intl.NumberFormat('es-AR').format(totalCarrito);
  contador++;
  document.querySelector('#contador').innerHTML = contador;

  GuardarContenidoLS();
}

function resto(id) {
  let producto = carrito.find(element => element.id === id);
  let posicion = carrito.indexOf(producto);
  producto.cantidad--;
  carrito.splice(posicion, 1, producto);
  document.querySelector(`#canti${producto.id}`).innerHTML = producto.cantidad;
  let producto_importe = producto.cantidad * producto.precio;
  document.querySelector(`#importe${producto.id}`).innerHTML = new Intl.NumberFormat('es-AR').format(producto_importe);
  totalCarrito -= producto.precio;
  parrafoPrecio.innerHTML = ("Total: $ ") + new Intl.NumberFormat('es-AR').format(totalCarrito);
  contador--;
  document.querySelector('#contador').innerHTML = contador;

  if (producto.cantidad === 0) {
    carrito.splice(posicion, 1);
    localStorage.removeItem('ProductosCarrito');
  } else { 
    GuardarContenidoLS();
  }

  armaCarrito();
}

function limpiarCarrito() {
  ContenidoCartaProducto.querySelector("tbody").innerHTML  = "";
  parrafoPrecio.innerHTML = ("Total: $ 0");
  contador = 0;
  document.querySelector('#contador').innerHTML = contador;
  localStorage.removeItem('ProductosCarrito');
  GuardarContenidoLS();
}

function comprar() {
  const cartaProductos = ContenidoCartaProducto.querySelector("tbody").innerHTML;
  if (cartaProductos !== "" && confirm("Estas seguro que quieres comprar?")) {
    limpiarCarrito();
  } else {
    return;
  }
}

BotonLimpiar.addEventListener("click", function (e) {
  e.preventDefault();
  limpiarCarrito();
});


BotonComprar.addEventListener("click", function (e) {
  e.preventDefault();
  comprar();
});

function muestraCarrito() {
  ContenedorCarta.classList.toggle("open");
}

function verificarLocalStorage(){
  if (localStorage.getItem("ProductosCarrito")) {
    carrito = JSON.parse(localStorage.getItem("ProductosCarrito"));
    contador = 0;
    carrito.forEach((element, indice) => {
      console.log("Entre a" + element.id);
      contador += element.cantidad;
      // fetch(`/ferreteria/${element.id}`, { method: 'GET' })
      // .then(response => response.json())
      // .then(data => {
      //   let producto = data [0];
      //   element.precio = producto.precio;
      // });
    });
    document.querySelector("#contador").innerHTML = contador;
  }
}

function main(){
  traeProductos();
  verificarLocalStorage();
}

main();