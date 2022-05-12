class Usuario {
    constructor(nombres, apellido, libros, mascotas) {
        this.nombres = nombres;
        this.apellido = apellido;
        this.libros = libros;
        this.mascotas = mascotas;
    }

    getFullName() {
        return (`Hola ${this.nombres} ${this.apellido}`);
    }

    addMascota(mascota) {
        this.mascotas.push(mascota);
    }

    countMascotas() {
        return this.mascotas.length;
    }

    addBook = (nombre, autor) => this.libros.push({ nombre, autor });

    getBooksName() {
        let nombreLibro = []
        this.libros.map(libro => {
            nombreLibro.push(libro.nombre)
        })
        return nombreLibro
    }
}

let usuario = new Usuario('Emanuel', 'Gonzalez', [{ nombre: 'El señor de las moscas', autor: 'William Golding' }, { nombre: 'Fundacion', autor: 'Isaac Asimov' }], ['perro', 'gato'])

console.log(usuario.countMascotas());
console.log(usuario.getBooksName());
console.log(usuario.getFullName());
usuario.addBook('Transformers', 'Yo');