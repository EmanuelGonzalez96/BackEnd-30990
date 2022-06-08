const express = require('express')
const PORT = process.env.PORT || 8080;
const Contenedor = require('./contenedor_desafioClase6')
const app = express()
const DB = 'productos.json'
const contenedor = new Contenedor(DB)

app.get('/productos', async(req, res) => {

    try {
        const data = await contenedor.getAll()
        res.json(data)
    } catch (e) {
        res.send(e)
    }
})

app.get('/productosRandom', async(req, res) => {

    try {
        const data = await contenedor.getAll()
        const num = Math.floor(Math.random() * data.length)
        const articuloRandom = data[num]
        res.json(articuloRandom)
    } catch (e) {
        res.send(e)
    }

})

const server = app.listen(PORT, () => {
    console.log(`Servidor Http escuchado en el puerto ${server.address().port}`);
})

server.on('error', error => console.log(`Error en servidor ${error}`));