// Creación de carrito
    let carrito = []
    let carritoJSON = JSON.parse(localStorage.getItem("carrito"))

    if (carritoJSON) {
        carrito = carritoJSON
    }

//mi funcion principal
function programaPrincipal() {
    let productos = []

    /*Json local y fetch*/
    const urlLocal = "./productos.json"

    fetch(urlLocal)
    .then(response => response.json())
    .then(data => {
    productos = data.productos
    console.log(productos)


    // Filtro de búsqueda por nombre
    let buscador = document.getElementById("buscador")
    buscador.addEventListener("input", () => filtrar(productos))

    let contenedorFiltros = document.getElementById("filtros")

    // Botones de filtro por categoría
    crearFiltros(productos, contenedorFiltros)

    crearTarjeta(productos)

    let botonCarrito = document.getElementById("botonCarrito")
    botonCarrito.addEventListener("click", mostrarOcultar)

    crearCarrito(carrito)

    let finalizar = document.getElementById("finalizar")
    finalizar.addEventListener("click", () => finalizarCompra(carrito))
});
}

programaPrincipal()

// creacion de tarjetas de productos
function crearTarjeta(array) {
let contenedor = document.getElementById("padre")
contenedor.innerHTML = ""

array.forEach(element => {
    let mensaje = element.precio
    
    let tarjeta = document.createElement("div")

    if (element.stock === 0) {
        mensaje = "Sin stock"
    }

    tarjeta.classList.add("tarjetaProducto")

    tarjeta.innerHTML = `
    <h3>${element.nombre}</h3>
    <img src="${element.rutaImagen}">
    <h4>$${mensaje}</h4>
    <a id="${element.id}" class="btn btn-secondary"  role="button" aria-disabled="false">Agregar</a>
    `
    contenedor.append(tarjeta)

    let botonAgregarCarrito = document.getElementById(element.id)
    botonAgregarCarrito.addEventListener("click", () => agregarAlCarrito(array, element.id, carrito))
})
}

//filtros 
function filtrar (productos) {
let contenedor = document.getElementById("padre")
let arrayFiltrado = productos.filter(producto => producto.nombre.toLowerCase().includes(buscador.value.toLowerCase()))
crearTarjeta(arrayFiltrado)
}

//filtro de botones por categoria
function crearFiltros (arrayDeElementos, contenedorFiltros) {
let filtros = ["principal"]
arrayDeElementos.forEach(prod => {
 if (!filtros.includes(prod.categoria))
 filtros.push(prod.categoria)
})

filtros.forEach(filtro => {
    let boton = document.createElement("button")
    boton.id = filtro
    boton.innerText = filtro
    boton.classList.add("btn", "btn-secondary")
    boton.style.margin = "0.5rem"; 
    
    contenedorFiltros.append(boton)

    let botonesFiltro = document.getElementById(filtro)
    botonesFiltro.addEventListener("click", (event) => filtrarPorCategoria(event, filtro, arrayDeElementos))
})
}

//funcion de filtrar
function filtrarPorCategoria (event, id, productos) {
if (id === "principal") {
    crearTarjeta(productos)
} else {    
    let arrayFiltrado = productos.filter(prod => prod.categoria === id)
    crearTarjeta(arrayFiltrado) 
}   
} 

//carrito
function mostrarOcultar() {
    let padreProd = document.getElementById("padreProd")
    let carrito = document.getElementById("padreCarrito")
    padreProd.classList.toggle("oculto")
    carrito.classList.toggle("oculto")
}

//agregar al carrito
function agregarAlCarrito(productos, id) {

    let productoBuscado = productos.find(prod => prod.id === id)
    let posicionProdEnCarrito = carrito?.findIndex(prod => prod.id === id)

    if (posicionProdEnCarrito !== -1) {
        carrito[posicionProdEnCarrito].unidades++
        carrito[posicionProdEnCarrito].subtotal = carrito[posicionProdEnCarrito].unidades * carrito[posicionProdEnCarrito].precioUnitario
    } else {
        carrito.push({
            id: productoBuscado.id,
            nombre: productoBuscado.nombre,
            precioUnitario: productoBuscado.precio,
            unidades: 1,    
            subtotal: productoBuscado.precio,
        });
    }

    let totalCarrito = 0;

    carrito.forEach(item => {
        totalCarrito += item.subtotal;
    });
    document.getElementById("totalCarrito").textContent = `Total $${totalCarrito.toFixed(2)}`;

    //Toastify
    lanzarTostada()
    localStorage.setItem("carrito", JSON.stringify(carrito));
    crearCarrito(carrito);
}

//creacion del carrito
function crearCarrito (carrito) {
    let carritoReal = document.getElementById("carrito")
    carritoReal.innerHTML = ""
        
    carrito.forEach(prod => {
        let elementoCarrito = document.createElement("div")
        elementoCarrito.classList.add("elementoCarrito")
        elementoCarrito.setAttribute("class", "productoCarrito")
        elementoCarrito.innerHTML = `
            <div>${prod.unidades}<div> 
            <div>${prod.nombre}</div> 
            <div>${prod.precioUnitario}</div> 
            <div>$${prod.subtotal}</div>
        `
        carritoReal.append(elementoCarrito)
    })      
}

// finalizar compra
function finalizarCompra() {
let carritoReal = document.getElementById("carrito")
carritoReal.innerHTML = ""
localStorage.removeItem("carrito")
carrito = []
lanzarAlerta()
}

//librerias
function lanzarTostada () {
Toastify({
    text: "Producto añadido correctamente",
    duration: 2000,
    style: {
      background: "linear-gradient(to right, rgb(184, 158, 206), #B4CFB0)",
    }
  }).showToast();
}

function lanzarAlerta () {
Swal.fire('¡Muchas gracias por su compra!')
}