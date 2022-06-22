function renderProducto(data) {
    const html = data.map(producto => {
        return (`
        <tr scope="row">
          <td>${ producto.id }</td>
          <td>${ producto.title }</td>
          <td>$${ producto.price }</td>
          <td><img src="${ producto.thumbnail }" alt="img" style="width: 50px; height: 50px;"></td>
        </tr>
      `)
    }).join("");
    document.getElementById("productos").innerHTML = html;
}

function renderMessage(data) {
    const html = data.map(msj => {
        return (`
        <div>
          <strong style="color: blue">${ msj.author }</strong>
          <p style="color: brown; font-size: 20px; display: inline-block">[ ${ msj.date } ] :</p>
          <em style="color: green">${ msj.msj }</em>
        </div>
      `)
    }).join("");
    document.getElementById("chat").innerHTML = html;
}

const socket = io.connect();
socket.on('productos', (data) => {
    renderProducto(data)
});

socket.on('chat', (data) => {
    renderMessage(data)
});

const form = document.getElementById("form");
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nuevoProducto = {
        title: document.getElementById('title').value,
        price: document.getElementById('price').value,
        thumbnail: document.getElementById('thumbnail').value
    }
    socket.emit('nuevoProducto', nuevoProducto);
    return false;
});

const formChat = document.getElementById("form-chat");
formChat.addEventListener('submit', (e) => {
    const date = new Date();
    e.preventDefault();
    const nuevoMensaje = {
        author: document.getElementById('nombre').value,
        msj: document.getElementById('text-input').value,
        date: date.toISOString().split('T')[0] + ' ' + date.toLocaleTimeString()
    }
    socket.emit('nuevoMensaje', nuevoMensaje);
    return false;
});