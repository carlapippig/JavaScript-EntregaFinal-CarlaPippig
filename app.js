

fetch('productos.json')
  .then(response => response.json())
  .then(data => {
    stockProductos = data
    

    const contenedor = document.getElementById('contenedor')
    data.forEach((prod) => {
      const { id, nombre, precio, imagen, cantidad } = prod
      if (contenedor) {
        contenedor.innerHTML += `
          <div class="card mt-3" style="width: 20rem;">
            <img class="card-img-top mt-2" src="${imagen}" alt="Card image cap">
            <div class="card-body">
              <h5 class="card-title">${nombre}</h5>
              <p class="card-text">Precio: ${precio}</p>
              <p class="card-text">Cantidad: ${cantidad}</p>
              <button class="btn btn-light" onclick="agregarProducto(${id})">Agregar al Carrito</button>
            </div>
          </div>
        `;
      }
    
    });
  })
  .catch(error => {
    console.error('Error:', error)
  })

let carrito = []


const contenedor = document.querySelector('#contenedor')
const carritoContenedor = document.querySelector('#carritoContenedor')
const vaciarCarrito = document.querySelector('#vaciarCarrito')
const precioTotal = document.querySelector('#precioTotal')
const activarFuncion = document.querySelector('#activarFuncion')
const procesarCompra = document.querySelector("#procesarCompra")
const totalProceso = document.querySelector('#totalProceso')
const formulario = document.querySelector('#procesar-pago')

if (activarFuncion) {
  activarFuncion.addEventListener("click", procesarPedido)
}

document.addEventListener("DOMContentLoaded", () => {
  carrito = JSON.parse(localStorage.getItem("carrito")) || []
  mostrarCarrito()
  procesarPedido()
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelector('#activarFuncion').addEventListener("click", procesarPedido)
  })
  const activarFuncion = document.querySelector('#activarFuncion')
  if (activarFuncion) {
    activarFuncion.addEventListener("click", procesarPedido)
  }
})

if (formulario) {
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
      location.href = "compra.html"
    }
  })
}


const agregarProducto = (id) => {
  const existe = carrito.some(prod => prod.id === parseInt(id))

  if (existe) {
    carrito.forEach(prod => {
      if (prod.id === parseInt(id)) {
        prod.cantidad++
      }
    })
  } else {
    const item = stockProductos.find(prod => prod.id === parseInt(id))
    if (item) {
      carrito.push({ ...item, cantidad: 1 })
    
    }
  guardarStorage()
  }
  

  mostrarCarrito()
}
function guardarStorage() {
  localStorage.setItem("carrito", JSON.stringify (carrito))

}

const mostrarCarrito = () => {
  const modalBody = document.querySelector(".modal .modal-body")
  if (modalBody) {
    modalBody.innerHTML = ""
    carrito.forEach((prod) => {
      const { id, nombre, precio, imagen, cantidad } = prod
      modalBody.innerHTML += `
        <div class="modal-contenedor">
          <div>
          <img class="img-fluid img-carrito" src='${imagen}'/>
          </div>
          <div>
          <p>Producto: ${nombre}</p>
          <p>Precio: ${precio}</p>
          <p>Cantidad :${cantidad}</p>
          <button class="btn btn-light"onclick="eliminarProducto(${id})">Eliminar producto</button>
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
      ((acc, prod) => acc + prod.cantidad * prod.precio, 0)
  }



}



function eliminarProducto(id) {
  const cosaId = id
  carrito = carrito.filter((cosa) => cosa.id !== cosaId)
  mostrarCarrito()
}

function procesarPedido() {
  carrito.forEach((prod) => {
      const listaCompra = document.querySelector("#lista-compra tbody")
      const {id, nombre, precio, imagen, cantidad } = prod
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
      (acc, prod) => acc + prod.cantidad * prod.precio, 0)

}


function enviarCompra(e) {
  e.preventDefault()

  const persona = document.querySelector('#cliente').value
  const correo = document.querySelector('#correo').value
  const btnFinalizarCompra = document.getElementById('btnFinalizarCompra')

  if (correo === '' || persona === '') {
    Swal.fire({
      title: "¡No te olvides de ingresar tu email y nombre!",
      text: "Completa el formulario",
      icon: "error",
      confirmButtonText: "Aceptar",
    });
  } else {
    btnFinalizarCompra.disabled = true;
    btnFinalizarCompra.value = 'Enviando...'

    const serviceID = 'default_service'
    const templateID = 'template_yyj2357'

    emailjs.sendForm(serviceID, templateID, this)
      .then(() => {
        localStorage.clear()
        btnFinalizarCompra.value = 'Compra realizada'
        btnFinalizarCompra.classList.add('btn-success')
        btnFinalizarCompra.disabled = true
        mostrarAlertaExito()
      
      })
      .catch((err) => {
        btnFinalizarCompra.value = 'Finalizar compra'
        mostrarAlertaError()
        console.error('Error al enviar el correo:', err)
      });
  }

 
}
function mostrarAlertaExito() {
  const alertExito = document.createElement('p')
  alertExito.classList.add('alert', 'alerta', 'd-block', 'text-center', 'col-12', 'mt-2', 'alert-success')
  alertExito.textContent = 'Compra realizada'
  formulario.appendChild(alertExito)

  setTimeout(() => {
    alertExito.remove()
    location.reload()
  }, 3000);
}

function mostrarAlertaError() {
  const alertError = document.createElement('p')
  alertError.classList.add('alert', 'alerta', 'd-block', 'text-center', 'col-12', 'mt-2', 'alert-danger');
  alertError.textContent = 'Error al enviar la compra'
  formulario.appendChild(alertError);

  setTimeout(() => {
    alertError.remove()
  }, 3000)


}
