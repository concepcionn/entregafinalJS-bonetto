function programaPrincipal() {
     //array de productos
    let productos = [
   {id: 1, nombre: "Hongos de pino", categoria: "natural", rutaImagen: "./img/hongos-pino.jpg", stock: 4, precio: 2200 },
   {id: 4, nombre: "Aceitunas", categoria: "gourmet", rutaImagen: "./img/aceitunas.jpg", stock: 10, precio: 2000 },
   {id: 7, nombre: "Pasta de mani", categoria: "gourmet", rutaImagen: "./img/pasta-mani.jpg", stock: 15, precio: 800},
   {id: 9, nombre: "Champignones", categoria: "natural", rutaImagen: "./img/hongos-champi.jpg", stock: 6, precio: 1800 },
   {id: 11, nombre: "Frutos secos", categoria: "natural", rutaImagen: "./img/frutos-secos.jpg", stock: 8, precio: 3500 },
   {id: 15, nombre: "Fideos secos", categoria: "gourmet", rutaImagen: "./img/fideos.jpg", stock: 20, precio: 950 },
   {id: 18, nombre: "Escabeche", categoria: "gourmet", rutaImagen: "./img/escabeche.jpg",  stock: 9, precio: 1450 },
   {id: 24, nombre: "Aceite de oliva extra virgen", categoria: "gourmet", rutaImagen: "./img/oliva.jpg",  stock: 10, precio: 2500 },
   {id: 29, nombre: "Chocolate", categoria: "gourmet", rutaImagen: "./img/chocolate.jpg", stock: 14, precio: 900},
]

    //creacion de carrito
    let carrito = []
    let carritoJSON = JSON.parse(localStorage.getItem("carrito"))

    if (carritoJSON) {
    carrito = carritoJSON
    }

    //filtro de busqueda
    //por nombre
    let buscador = document.getElementById("buscador")
    buscador.addEventListener("input", () => filtrar(productos, carrito))

    let contenedorFiltros = document.getElementById("filtros")

    //carrito
    let botonCarrito = document.getElementById("botonCarrito")
    botonCarrito.addEventListener("click", mostrarOcultar)

    crearFiltros(productos, contenedorFiltros, carrito)

    crearTarjeta (productos, carrito)

    crearCarrito (carrito)

    let finalizar = document.getElementById("finalizar")
    finalizar.addEventListener("click", () => finalizarCompra(carrito))
}
   
programaPrincipal()

function crearTarjeta(array, carrito) {
// creacion de tarjetas de productos
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

function filtrar (productos, carrito) {
    let contenedor = document.getElementById("padre")
    let arrayFiltrado = productos.filter(producto => producto.nombre.toLowerCase().includes(buscador.value.toLowerCase()))
    crearTarjeta(arrayFiltrado, carrito)
}

//filtro de botones por categoria
function crearFiltros (arrayDeElementos, contenedorFiltros, carrito) {
    let filtros = ["principal"]
    arrayDeElementos.forEach(prod => {
     if (!filtros.includes(prod.categoria))
     filtros.push(prod.categoria)
    })
 
    filtros.forEach(filtro => {
        let boton = document.createElement("button")
        boton.id = filtro
        boton.innerText = filtro
        contenedorFiltros.append(boton)
   
        let botonesFiltro = document.getElementById(filtro)
        botonesFiltro.addEventListener("click", (event) => filtrarPorCategoria(event, filtro, arrayDeElementos, carrito))
    })
}

function filtrarPorCategoria (event, id, productos, carrito) {
    if (id === "principal") {
        crearTarjeta(productos, carrito)
    } else {    
        let arrayFiltrado = productos.filter(prod => prod.categoria === id)
        crearTarjeta(arrayFiltrado, carrito) 
    }   
} 

function mostrarOcultar() {
    let padreProd = document.getElementById("padreProd")
    let carrito = document.getElementById("contenedorCarrito")
    padreProd.classList.toggle("oculto")
    carrito.classList.toggle("oculto")
}

// agregar al carrito
function agregarAlCarrito(productos, id, carrito) {
    console.log(id);
    let productoBuscado = productos.find(prod => prod.id === id)
    let posicionProdEnCarrito = carrito.findIndex(prod => prod.id === id)

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

    lanzarTostada()
    localStorage.setItem("carrito", JSON.stringify(carrito));
    crearCarrito(carrito);
}

function crearCarrito (carrito) {
    let carritoReal = document.getElementById("carrito")
    carritoReal.innerHTML = `
        <a>Unidades</a>
        <a>Nombre</a>
        <a>Precio</a>
        <a>Subtotal</a> 
    `

    carrito.forEach(prod => {
        let elementoCarrito = document.createElement("div")
        elementoCarrito.classList.add("elementoCarrito")
        elementoCarrito.innerHTML = `
            <p>${prod.unidades}<p> 
            <p>${prod.nombre}</p> 
            <p>${prod.precioUnitario}</p> 
            <p>${prod.subtotal}</p>
        `
        carritoReal.append(elementoCarrito)
    })      
}

// finalizar compra
function finalizarCompra (carrito) {
    let carritoReal = document.getElementById("carrito")
    carritoReal.innerHTML = ""
    localStorage.clear()
}

function lanzarTostada () {
    Toastify({
        text: "Producto añadido correctamente",
        duration: 2000,
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
      }).showToast();
}


