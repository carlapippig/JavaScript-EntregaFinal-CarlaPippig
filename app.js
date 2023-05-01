const stockProductos = [
  { id: 1, imagen:'./img/jumper.jpg', nombre: 'Jumper Bombón', cantidad:1, precio: 5200 },
  { id: 2, imagen:'./img/bolaespejada.jpg', nombre: 'Saquito p!nk', cantidad:1, precio: 5450 },
  { id: 3, imagen:'./img/corset.jpg', nombre: 'Corset castle', cantidad:1, precio: 5200 },
  { id: 4, imagen:'./img/piyama.jpg', nombre: 'Piyama Bear', cantidad:1,precio: 7500 },
  { id: 5, imagen:'./img/skirtcielo.jpg', nombre: 'Skirt Cielo',cantidad:1, precio: 3500 },
  { id: 6, imagen:'./img/skirtlavanda.jpg', nombre: 'Skirt Lavanda', cantidad:1, precio: 3500 },
  { id: 7, imagen:'./img/zapatosrosas.jpg', nombre: 'Tacos p!nk', cantidad:1, precio: 8950 },
  { id: 8, imagen:'./img/peluchito.jpg', nombre: 'Peluche Baby', cantidad:1,precio: 8900 },
];

let carrito = [];

  const contenedor = document.querySelector('#contenedor');
  const carritoContenedor = document.querySelector('#carritoContenedor');
  const vaciarCarrito = document.querySelector('#vaciarCarrito');
  const precioTotal = document.querySelector('#precioTotal');
  const activarFuncion = document.querySelector('#activarFuncion');
  const procesarCompra = document.querySelector("#procesarCompra");
  const totalProceso = document.querySelector('#totalProceso');
  const formulario = document.querySelector('#procesar-pago')
  
  if (activarFuncion) {
    activarFuncion.addEventListener("click", procesarPedido)
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    carrito = JSON.parse(localStorage.getItem("carrito")) || []
    mostrarCarrito()
    
    document.querySelector('#activarFuncion').click(procesarPedido)
})

if(formulario){
    formulario.addEventListener('submit', enviarCompra)
  }
  
  if (vaciarCarrito) {
    vaciarCarrito.addEventListener("click", () => {
      carrito.length = []
      mostrarCarrito()
    })
  }

  
  if (procesarCompra) {
    procesarCompra.addEventListener("click", () => {
      if (carrito.length === 0) {
        Swal.fire({
          title: "El carrito está vacio!",
          text: "Agrega productos para continuar",
          icon: "error",
          confirmButtonText: "Aceptar",
        })
      } else {
        location.href = "compra.html";
      }
    })
  } 
  
  stockProductos.forEach((prod) => {
    const { id, nombre, precio,imagen, cantidad} = prod
    if (contenedor) {
      contenedor.innerHTML += `
      <div class="card mt-3" style="width: 18rem;">
      <img class="card-img-top mt-2" src="${imagen}" alt="Card image cap">
        <div class="card-body">
        <h5 class="card-title">${nombre}</h5>
        <p class="card-text">Precio: ${precio}</p>
        <p class="card-text">Cantidad: ${cantidad}</p>
        <button class="btn btn-light" onclick="agregarProducto(${id})">Agregar al Carrito</button>
      </div>
    </div>
      `
    }
  
  })
  
  const agregarProducto = (id) => {
    const existe = carrito.some(prod => prod.id === id)
    
    if (existe) {
      const prod = carrito.map(prod => {
        if(prod.id === id){
          prod.cantidad++
        }
      })
    }else{
        const item = stockProductos.find((prod) =>prod.id === id)
      carrito.push(item)
    }

    mostrarCarrito()
  }
  

  
  const mostrarCarrito = () => {
    const modalBody = document.querySelector(".modal .modal-body");
    if (modalBody) {
      modalBody.innerHTML = ""
      carrito.forEach((prod) => {
        const { id, nombre, precio,imagen, cantidad } = prod
        modalBody.innerHTML += `
        <div class="modal-contenedor">
          <div>
          <img class="img-fluid img-carrito" src='${imagen}'/>
          </div>
          <div>
          <p>Producto: ${nombre}</p>
          <p>Precio: ${precio}</p>
          <p>Cantidad :${cantidad}</p>
          <button class="btn btn-light"  onclick="eliminarProducto(${id})">Eliminar producto</button>
          </div>
        </div>
        
    
        `
      })
    } 
  
    if (carrito.length === 0) {
      
      modalBody.innerHTML = `
      <p class="text-center parrafo">¡Aun no agregaste nada!</p>
      `
    } 
    
    carritoContenedor.textContent = carrito.length
  
    if (precioTotal) {
      precioTotal.textContent = carrito.reduce
      ((acc, prod) => acc + prod.cantidad * prod.precio,0)
    }
  
    guardarStorage();
  }
  
  function guardarStorage() {
    localStorage.setItem("carrito", JSON.stringify(carrito))
  }
  
  function eliminarProducto(id) {
    const cosaId = id
    carrito = carrito.filter((cosa) => cosa.id !== cosaId)
    mostrarCarrito()
  }
  function procesarPedido() {
    carrito.forEach((prod) => {
      const listaCompra = document.querySelector("#lista-compra tbody")
      const { id, nombre, precio, imagen, cantidad } = prod
      if (listaCompra) {
        const row = document.createElement("tr")
        row.innerHTML += `
                <td>
                <img class="img-fluid img-carrito" src="${imagen}"/>
                </td>
              <td>${nombre}</td>
              <td>${precio}</td>
              <td>${cantidad}</td>
              <td>${precio * cantidad}</td>
              `
        listaCompra.appendChild(row);
      }
    })
    totalProceso.innerText = carrito.reduce(
      (acc, prod) => acc + prod.cantidad * prod.precio,0)
  }
  
  function enviarCompra(e){
    e.preventDefault()
    const persona = document.querySelector('#persona').value
    const email = document.querySelector('#correo').value
  
    if(correo === '' || persona == ''){
    Swal.fire({
    title: "¡No te olvides tu email y nombre!",
        text: "Rellena el formulario",
        icon: "error",
        confirmButtonText: "Aceptar",
})
} else {
  
    const btn = document.getElementById('button')

    // document.getElementById('procesar-pago')
    //  .addEventListener('submit', function(event) {
    //    event.preventDefault();
    
      btn.value = 'Enviando...';
    
      const serviceID = 'default_service';
      const templateID = 'template_qxwi0jn';
    
      emailjs.sendForm(serviceID, templateID, this)
        .then(() => {
          btn.value = 'Finalizar compra';
          alert('Correo enviado!');
        }, (err) => {
          btn.value = 'Finalizar compra';
          alert(JSON.stringify(err));
        });
      

  
      const alertExito = document.createElement('p')
      alertExito.classList.add('alert', 'alerta', 'd-block', 'text-center', 'col-12', 'mt-2', 'alert-success')
      alertExito.textContent = 'Compra realizada'
      formulario.appendChild(alertExito)
  
      setTimeout(() => {
        alertExito.remove()
      }, 3000)
  
  
  
  }
  localStorage.clear()
  
}