const express = require('express');
const PORT = process.env.PORT || 8080;
const router = express.Router();
const fs = require('fs');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'))

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
    res.render('index', { mensaje: '' })
});





let date = new Date();
const chat = [
    { author: 'Ema', msj: 'Hola', date: date.toISOString().split('T')[0] + ' ' + date.toLocaleTimeString() },
    { author: 'Coder', msj: 'Hola', date: date.toISOString().split('T')[0] + ' ' + date.toLocaleTimeString() }
]

io.on('connection', (socket) => {
    console.log('Usuario conectado, id: ' + socket.id);

    const archivo = fs.readFileSync('./productos.txt', 'utf-8');
    const productos = JSON.parse(archivo);
    socket.emit('productos', productos);
    socket.emit('chat', chat);

    socket.on('nuevoProducto', (nuevoProducto) => {
        const archivo = fs.readFileSync('./productos.txt', 'utf-8');
        const productos = JSON.parse(archivo);
        const productosId = productos.map(p => p.id);
        nuevoProducto.id = Math.max(...productosId) + 1;

        productos.push(nuevoProducto);
        fs.writeFileSync('./productos.txt', JSON.stringify(productos, null, '\t'));

        io.sockets.emit('productos', productos);
    });

    socket.on('nuevoMensaje', (nuevoMensaje) => {
        chat.push(nuevoMensaje);
        io.sockets.emit('chat', chat);
    });
});







//Devuelve todos los productos
router.get('/', (req, res) => {
    const archivo = fs.readFileSync('./productos.txt', 'utf-8');
    const productos = JSON.parse(archivo);
    res.render('productos', { productos: productos });
});

//Devuelve un producto segun id
router.get('/:id', (req, res) => {
    const id = Number(req.params.id);
    const archivo = fs.readFileSync('./productos.txt', 'utf-8');
    const productos = JSON.parse(archivo);

    const producto = productos.find(prod => prod.id === id);
    if (producto == undefined) {
        res.send({ error: 'Producto no encontrado' });
    } else {
        res.json(producto);
    }
});

//Agrega un producto con su ID asignado
router.post('/', (req, res) => {
    const producto = req.body;
    const archivo = fs.readFileSync('./productos.txt', 'utf-8');
    const productos = JSON.parse(archivo);

    const productosId = productos.map(p => p.id);
    producto.id = Math.max(...productosId) + 1;

    productos.push(producto);

    fs.writeFileSync('./productos.txt', JSON.stringify(productos, null, '\t'));
    res.render('index', { mensaje: 'Producto agregado' });
});

//Recibe y actualiza un producto segun id
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const producto = req.body;
    producto.id = id;
    const archivo = fs.readFileSync('./productos.txt', 'utf-8');
    const productos = JSON.parse(archivo);

    const indice = productos.findIndex(p => p.id == id);

    if (indice === -1) {
        res.send('No existe el producto a editar')
    } else {
        productos.splice(indice, 1, producto);

        fs.writeFileSync('./productos.txt', JSON.stringify(productos, null, '\t'));
        res.json(producto);
    }
});

//Elimina un producto segun id
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const archivo = fs.readFileSync('./productos.txt', 'utf-8');
    const productos = JSON.parse(archivo);

    const indice = productos.findIndex(p => p.id == id);

    if (indice === -1) {
        res.send('No existe el producto a eliminar')
    } else {
        productos.splice(indice, 1);

        fs.writeFileSync('./productos.txt', JSON.stringify(productos, null, '\t'));
        res.json(`Se elimino el producto con id: ${ id }`);
    }
});




app.use('/api/productos', router);

const server = httpServer.listen(PORT, () => {
    console.log(`Servidor Http escuchado en el puerto ${server.address().port}`);
})

server.on('error', error => console.log(`Error en servidor ${error}`));