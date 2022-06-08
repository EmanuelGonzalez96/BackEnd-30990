const fs = require('fs')

class Contenedor {
    constructor(archivo) {
        this.archivo = archivo
    }
    static contador = 0
    async getAll() {
        const archivo = this.archivo

        let data
        try {
            let res = await fs.promises.readFile(archivo, "utf-8")
            res = JSON.parse(res) || null
            return res
        } catch (error) {
            console.log("No se encuentra el archivo")
        }

    }
    save(objecto) {
        const archivo = this.archivo

        let id = Contenedor.contador
        this.getAll()
            .then(async(res) => {
                try {
                    let data = res || []
                    while (data.some(elemento => elemento.id == id)) {
                        Contenedor.contador += 1
                        id += 1
                    }

                    objecto.id = id
                    data.push(objecto)
                    await fs.promises.writeFile(archivo, JSON.stringify(data))
                    console.log(`Guardado con el id #${id}`)
                    return id
                } catch (error) {
                    console.log("No se guardó", error)
                }
            })

    }
    getById(id) {
        this.getAll()
            .then(elemento => {
                let obtenerId = elemento.find(elemento => elemento.id == id)
                console.log(obtenerId)
                if (obtenerId) {
                    console.log(obtenerId)

                } else {
                    console.log("No se encontró el id")

                }
                return obtenerId
            })
            .catch(error => {
                console.log("Error al obtener id", error)
            })
    }
    deleteById(id) {
        const archivo = this.archivo
        this.getAll()
            .then(async elemento => {
                let aux = elemento.filter(elemento => elemento.id != id)
                await fs.promises.writeFile(archivo, JSON.stringify(aux))
                console.log(`Se borro elemento id #${id}`)
            })
            .catch(error => {
                console.log("No se pudo eliminar el objeto", error)
            })
    }
    async deleteAll() {
        const archivo = this.archivo
        try {
            await fs.promises.writeFile(archivo, JSON.stringify([]))
            console.log("Se han borrado todos los objetos")
        } catch (error) {
            console.log("No se pudo borrar los objetos", error)
        }


    }
}

module.exports = Contenedor