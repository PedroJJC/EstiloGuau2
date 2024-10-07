const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
const bodyParser = require('body-parser');
const router = express.Router();


const paymentsRoutes = require('./routes/payments');

dotenv.config(); // Carga las variables de entorno

const app = express();
const port = process.env.PORT || 3001;


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
// Usar el enrutador de pagos
app.use('/api/payments', paymentsRoutes);
// Middleware para parsear JSON
app.use(bodyParser.json());

// Conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bdestiloguau'
});

connection.connect(error => {
  if (error) throw error;
  console.log("MySQL database connection established successfully");
});

// Configuración de Multer
const storage = multer.diskStorage({  
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'public', 'images');
    /*const uploadDir = path.join(process.cwd(), 'public', 'images');*/
    
    if (!fs.existsSync(uploadDir)) {
      
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
   
    cb(null, Date.now() + '-' + file.originalname);
    
  }
});

const upload = multer({ storage: storage });

// Rutas
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});


///#Joel
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const encodedPassword = Buffer.from(password).toString('base64'); // Decodificar la contraseña (si está codificada)

  const query = 'SELECT * FROM usuario WHERE email = ? AND password = ?';
  connection.query(query, [email, encodedPassword], (error, results) => {
    if (error) {
      res.status(400).json({ message: error.message });
    } else {
      if (results.length > 0) {
        // Usuario autenticado correctamente
        res.status(200).json({ message: 'Login exitoso', user: results[0] });
      } else {
        // Credenciales incorrectas
        res.status(401).json({ message: 'Credenciales incorrectas' });
      }
    }
  });
});
app.post('/registro', (req, res) => {
  const query = 'INSERT INTO usuario (idRol, nombre, apellido, email, password, fecha_creacion, foto) VALUES (?,?, ?, ?, ?, NOW(),?)';
  const { idRol = 1, nombre, apellido, email, password } = req.body;
  const encoded = Buffer.from(password).toString("base64");
  const fotoPorDefecto = '1721157608571-logo.png';

  connection.query(query, [idRol, nombre, apellido, email, encoded, fotoPorDefecto], (error, results) => {
    if (error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(201).json({ message: "Usario Agreado" });
    }
  });
});

app.post('/new-user',upload.single('foto'), (req, res) => {
  console.log('hola')

  const { idRol, nombre, apellido, email, password,fecha_creacion } = req.body;
  let foto='1721157608571-logo.png'
  const encoded = Buffer.from(password).toString("base64");
  const query = 'INSERT INTO usuario (idRol, nombre, apellido, email, password, fecha_creacion,foto) VALUES (?,?, ?, ?, ?, ?,?)';

  console.log(req.body)
  connection.query(query, [idRol, nombre, apellido, email, encoded,fecha_creacion, foto], (error, results) => {
    if (error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(201).json({ message: "Usuario agregado" });
    }
  });
});
app.get('/usuariosget', (req, res) => {
  const query = 'SELECT * FROM usuario join rol';
  connection.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ message: 'nop' });
    } else {
      res.json(results);
    }
  });
});

app.get('/usuarioget/:idUsuario', (req, res) => {
  const query = 'SELECT * FROM usuario WHERE idUsuario = ?;';
  connection.query(query, [req.params.idUsuario], (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else if (results.length === 0) {
      res.status(404).json({ message: 'Usuario no encontrado' });
    } else {
      res.json(results[0]);
    }
  });
});

app.get('/usuarioget/:idUsuario', (req, res) => {
  const query = 'SELECT * FROM usuario WHERE idUsuario = ?;';
  connection.query(query, [req.params.idUsuario], (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else if (results.length === 0) {
      res.status(404).json({ message: 'Usuario no encontrado' });
    } else {
      res.json(results[0]);
    }
  });
});

app.get('/comprasxus/:idUsuario', (req, res) => {
  const query = `
SELECT 
    producto.producto AS nombre_producto, 
    producto.descripcion, 
    producto.precio,
    SUBSTRING_INDEX(producto.foto, ',', 1) AS primera_foto,
    tallas.talla,
    compra.cantidad_producto,
    compra.idUsuario,
    compra.idCompra,
    usuario.nombre as cliente
FROM 
    compra 
JOIN 
    producto ON compra.idProducto = producto.idProducto
JOIN
    tallas  ON producto.idTalla = tallas.idTalla
JOIN
    usuario ON compra.idUsuario = usuario.idUsuario
WHERE 
    producto.idUsuario = ?
  `;

  // Ejecutar la consulta con el idUsuario proporcionado
  connection.query(query, [req.params.idUsuario], (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else if (results.length === 0) {
      res.status(404).json({ message: 'Compras no encontradas para este usuario' });
    } else {
      res.json(results);
    }
  });
});




{/*app.put('/usuarioupdate/:idUsuario', (req, res) => {
  const query = 'UPDATE usuario SET idRol=?, nombre=?, apellido=?, email=?, password=?, foto=? WHERE idUsuario = ?';
  const {idRol, nombre, apellido, email, password, foto } = req.body;
  const {idUsuario} = req.params;
  const encodedPassword = Buffer.from(password).toString("base64");

  connection.query(query, [idRol, nombre, apellido, email, encodedPassword, foto, idUsuario], (error, results) => {
    if (error){
      res.status(400).json({ message: error.message });
    } else {
      res.status(201).json({results});
    }
  });
});*/}

// Actualizar un usuario
app.put('/usuarioupdate/:idUsuario', upload.single('foto'), (req, res) => {
  const { idRol, nombre, apellido, email, password } = req.body;
  const foto = req.file ? req.file.filename : null; // Nombre del archivo de imagen guardado por Multer, si hay uno nuevo

  // Construcción de la consulta de actualización
  let updateQuery = 'UPDATE usuario SET idRol = ?, nombre = ?, apellido = ?, email = ?';
  let queryParams = [idRol, nombre, apellido, email];

  // Agregar la foto a la consulta si se proporciona
  if (foto) {
    updateQuery += ', foto = ?';
    queryParams.push(foto);
  }

  updateQuery += ' WHERE idUsuario = ?';
  queryParams.push(req.params.idUsuario);

  console.log('Update Query:', updateQuery);
  console.log('Query Params:', queryParams);

  connection.query(updateQuery, queryParams, (error, results) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
      res.status(400).json({ message: error.message });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ message: 'Usuario no encontrado' });
    } else {
      res.json({
        idUsuario: req.params.idUsuario,
        idRol,
        nombre,
        apellido,
        email,
        password,
        foto
      });
    }
  });
});

app.delete('/usuariodelete/:idUsuario', (req, res) => {
  const query = 'DELETE FROM usuario WHERE idUsuario= ?'
  connection.query(query, [req.params.idUsuario], (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else if (results.length === 0) {
      res.status(404).json({ message: 'Usuario no encontrado' });
    } else {
      res.json({ message: 'Usuario eliminado' });
    }
  });
});
///#JoelEnd
//Obtener todos los registros
app.get('/all-rol', (req, res) => {
  const query = 'SELECT * FROM rol';
  connection.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ message: 'nop' });
    } else {
      res.json(results);
    }
  });
});

//Obtener registro por ID
app.get('/id-rol/:idrol', (req, res) => {
  const query = 'SELECT * FROM rol WHERE idrol = ?;';
  connection.query(query, [req.params.idrol], (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else if (results.length === 0) {
      res.status(404).json({ message: 'Rol no encontrado' });
    } else {
      res.json(results[0]);
    }
  });
});

//Crear un nuevo rol
app.post('/new-rol', (req, res) => {
  const query = 'INSERT INTO rol (rol) VALUES (?)';
  const { rol } = req.body;
  connection.query(query, [rol], (error, results) => {
    if (error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(201).json({ id: results.insertId, rol });
    }
  });
});

//Actulizar regstro 
app.put('/id-rol/:idrol', (req, res) => {
  const query = 'SELECT * FROM rol WHERE idrol = ?;';
  connection.query(query, [req.params.idrol], (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else if (results.length === 0) {
      res.status(404).json({ message: 'Rol no encontrado' });
    } else {
      res.json(results[0]);
    }
  });
});

//Eliminar registro
app.delete('/id-rol/:idrol', (req, res) => {
  const query = 'DELETE FROM rol WHERE idrol= ?'
  connection.query(query, [req.params.idrol], (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else if (results.length === 0) {
      res.status(404).json({ message: 'Rol no encontrado' });
    } else {
      res.json({ message: 'Rol eliminado' });
    }
  });
});

//Ruta para obtener todas las compras
app.get('/compras', (req, res) => {
  const query = `
SELECT
    c.idCompra,
    p.descripcion AS descripcion_producto,
    p.precio,
    p.foto,
    t.talla AS talla,
    c.cantidad_producto,
    CONCAT(u.nombre, ' ', u.apellido) AS cliente
FROM
    compra c
JOIN
    producto p ON c.idProducto = p.idProducto
JOIN
    usuario u ON c.idUsuario = u.idUsuario
JOIN
    tallas t ON p.idTalla = t.idTalla
ORDER BY
    c.fecha_compra DESC
  `;
  // Ejecuta la consulta con el parámetro idCompra de la ruta
  connection.query(query, [req.params.idCompra], (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else if (results.length === 0) {
      res.status(404).json({ message: 'Compra no encontrada' });
    } else {
      res.json(results);
    }
  });
});

// Ruta para obtener las compras recientes
app.get('/clientes-recientes', (req, res) => {
  const query = `
    SELECT
        u.nombre,
        u.email AS correo,
        u.foto
    FROM
        compra c
    JOIN
        usuario u ON c.idUsuario = u.idUsuario
    ORDER BY
        c.fecha_compra DESC
    LIMIT 5;
`;

  // Ejecutar la consulta SQL
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
      res.status(500).json({ error: 'Error al obtener las compras recientes' });
      return;
    }
    res.json(results); // Enviar resultados como JSON
  });
});




//Pedro PERMISOS
// Obtener todos los permisos
app.get('/permisos-all', (req, res) => {
  const query = 'SELECT * FROM permisos';
  connection.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else {
      res.json(results);
    }
  });
});

// Obtener un permiso por ID
app.get('/permisos/:id', (req, res) => {
  const query = 'SELECT * FROM permisos WHERE id = ?';
  connection.query(query, [req.params.id], (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else if (results.length === 0) {
      res.status(404).json({ message: 'Permiso no encontrado' });
    } else {
      res.json(results[0]);
    }
  });
});

// Crear un nuevo permiso
app.post('/nuevoPermiso', (req, res) => {
  const query = 'INSERT INTO permisos (permiso) VALUES (?)';
  const { permiso } = req.body;
  connection.query(query, [permiso], (error, results) => {
    if (error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(201).json({ id: results.insertId, permiso });
    }
  });
});

// Actualizar un permiso
app.put('/permisos/:id', (req, res) => {
  const query = 'UPDATE permisos SET permiso = ? WHERE id = ?';
  const { permiso } = req.body;
  connection.query(query, [permiso, req.params.id], (error, results) => {
    if (error) {
      res.status(400).json({ message: error.message });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ message: 'Permiso no encontrado' });
    } else {
      res.json({ id: req.params.id, permiso });
    }
  });
});

// Eliminar un permiso
app.delete('/permisos/:id', (req, res) => {
  const query = 'DELETE FROM permisos WHERE id = ?';
  connection.query(query, [req.params.id], (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ message: 'Permiso no encontrado' });
    } else {
      res.json({ message: 'Permiso eliminado' });
    }
  });
});

//Pedro TALLAS
// Obtener todas las tallas
app.get('/tallas', (req, res) => {
  const query = 'SELECT * FROM tallas';
  connection.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else {
      res.json(results);
    }
  });
});

// Obtener una talla por ID
app.get('/tallas:id', (req, res) => {
  const query = 'SELECT * FROM tallas WHERE idTalla = ?';
  connection.query(query, [req.params.id], (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else if (results.length === 0) {
      res.status(404).json({ message: 'Talla no encontrada' });
    } else {
      res.json(results[0]);
    }
  });
});

// Crear una nueva talla
app.post('/talla-nueva', (req, res) => {
  const { talla } = req.body;
  const query = 'INSERT INTO tallas (talla) VALUES (?)';
  connection.query(query, [talla], (error, results) => {
    if (error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(201).json({ id: results.insertId, talla });
    }
  });
});

// Actualizar una talla
app.put('/tallas/:id', (req, res) => {
  const { talla } = req.body;
  const query = 'UPDATE tallas SET talla = ? WHERE idTalla = ?';
  connection.query(query, [talla, req.params.id], (error, results) => {
    if (error) {
      res.status(400).json({ message: error.message });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ message: 'Talla no encontrada' });
    } else {
      res.json({ id: req.params.id, talla });
    }
  });
});

// Eliminar una talla
app.delete('/tallas/:id', (req, res) => {
  const query = 'DELETE FROM tallas WHERE idTalla = ?';
  connection.query(query, [req.params.id], (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ message: 'Talla no encontrada' });
    } else {
      res.json({ message: 'Talla eliminada' });
    }
  });
});


// Obtener todos las ofertas
app.get('/all-ofertas', (req, res) => {
  const query = 'SELECT * FROM ofertas';
  connection.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else {
      res.json(results);
    }
  });
});



//Pedro PRODUCTOS
// Obtener todos los productos
app.get('/productos', (req, res) => {
  const query = 'SELECT *, SUBSTRING_INDEX(producto.foto, \',\', 1) AS primera_foto FROM producto';
  connection.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else {
      res.json(results);
    }
  });
});

// Obtener todos los productos por idUs
app.get('/productosidus/:idUsuario', (req, res) => {

  const query = 'SELECT * FROM producto where idUsuario = ?';
  connection.query(query, [req.params.idUsuario], (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else if (results.length === 0) {
      res.status(404).json({ message: 'Usuario no encontrado' });
    } else {
      res.json(results);
    }
  });
});


// Obtener un producto por ID
app.get('/productos/:id', (req, res) => {
  const query = 'SELECT * FROM producto WHERE idProducto = ?';
  connection.query(query, [req.params.id], (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else if (results.length === 0) {
      res.status(404).json({ message: 'Producto no encontrado' });
    } else {
      res.json(results[0]);
    }
  });
});

// Obtener un producto por ID
app.get('/detalleproducto/:id', (req, res) => {
  const query = 'SELECT * FROM producto WHERE idProducto = ?';
  connection.query(query, [req.params.id], (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else if (results.length === 0) {
      res.status(404).json({ message: 'Producto no encontrado' });
    } else {
      res.json(results[0]);
    }
  });
});


//Agregar Producto
app.post('/producto-nuevo', upload.array('foto',4), (req, res) => {

  const {idUsuario, sku, Marca, producto, precio, idTalla, descripcion , idOferta,  fecha_ingreso,
    cantidad, idTemporada} = req.body;
  
  let foto = ''; // Inicializa foto como cadena vacía
  
  /* Verifica la presencia de req.file para asignar el nombre del archivo
  if (req.file) {
    foto = req.file.filename;
  }*/

     // Si hay archivos (fotos), genera una cadena separada por comas con los nombres de los archivos
     if (req.files && req.files.length > 0) {
      foto = req.files.map(file => file.filename).join(','); // Une los nombres de los archivos con comas
    }


  // Verifica que todos los campos necesarios estén presentes antes de la inserción
  if (producto && sku && Marca && precio && idTalla && descripcion && idUsuario &&  cantidad && idTemporada ) {
    const query = 'INSERT INTO producto (producto, sku, Marca, precio, idTalla, descripcion, foto, idUsuario, idOferta, fecha_ingreso,cantidad, idTemporada) VALUES (?,?, ?, ?, ?, ?, ?, ?,?,?,?,?)';
    connection.query(query, [producto, sku, Marca, precio, idTalla, descripcion, foto, idUsuario , idOferta ,  fecha_ingreso,cantidad, idTemporada], (error, results) => {

      if (error) {
        console.error( error);
        res.status(400).json({ message: 'Error ', error });
      } else {
        const productId = results.insertId;
        res.status(201).json({ id: productId, producto, sku, Marca, precio, idTalla, descripcion, foto, idUsuario, idOferta,  fecha_ingreso,cantidad , idTemporada});
      }
    });
  } else {
    res.status(400).json({ message: 'Todos los campos son requeridos' });
  }
});

// Actualizar un producto
app.put('/productos/:id', upload.array('foto',4), (req, res) => {
  //console.log(req.body)
  const { producto, sku, Marca, precio, idTalla, descripcion, idOferta,  fecha_ingreso, cantidad, idUsuario, idTemporada} = req.body;
  let foto = ''
  console.log(req.files )
  if (req.files && req.files.length > 0) {
    
    foto = req.files.map(file => file.filename).join(','); // Une los nombres de los archivos con comas
  }
  
  const updateQuery = foto
    ? 'UPDATE producto SET producto = ?, sku = ?, Marca = ?, precio = ?, idTalla = ?, descripcion = ?, foto = ?,  idOferta=? ,  fecha_ingreso=?, cantidad=?, idUsuario=? , idTemporada=? WHERE idProducto = ?'
    : 'UPDATE producto SET producto = ?, sku = ?, Marca = ?, precio = ?, idTalla = ?, descripcion = ?, idOferta=? ,  fecha_ingreso=?, cantidad=?, idUsuario=?, idTemporada=? WHERE idProducto = ?';
   // console.log(updateQuery)
    const queryParams = foto
    ? [producto, sku, Marca, precio, idTalla, descripcion, foto, idOferta, fecha_ingreso, cantidad, idUsuario,idTemporada, req.params.id]
    : [producto, sku, Marca, precio, idTalla, descripcion, idOferta, fecha_ingreso, cantidad, idUsuario,idTemporada ,req.params.id];
    console.log(queryParams)
  connection.query(updateQuery, queryParams, (error, results) => {
    if (error) {
      res.status(400).json({ message: error.message });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ message: 'Producto no encontrado' });
    } else {
      res.json({ id: req.params.id, producto, sku, Marca, precio, idTalla, descripcion, foto, idOferta,  fecha_ingreso, cantidad, idUsuario, idTemporada });
    }
  });
});

// Eliminar un producto
app.delete('/productos/:id', (req, res) => {
  const query = 'DELETE FROM producto WHERE idProducto = ?';
  connection.query(query, [req.params.id], (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ message: 'Producto no encontrado' });
    } else {
      res.json({ message: 'Producto eliminado' });
    }
  });
});

// Eliminar la imagen de un producto
app.delete('/productos/:id/foto', (req, res) => {
  const { id } = req.params;
  const query = 'UPDATE producto SET foto = "" WHERE idProducto = ?'; // Cambiar a un valor vacío
  connection.query(query, [id], (error, results) => {
    if (error) {
      console.error(`Error al eliminar la imagen del producto con ID ${id}:`, error);
      res.status(500).json({ message: 'Error interno del servidor al eliminar la imagen' });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ message: 'Producto no encontrado' });
    } else {
      res.json({ message: 'Imagen eliminada exitosamente' });
    }
  });
});



//Pedro RECIBOS
// Obtener todos los recibos
app.get('/recibos', (req, res) => {
  const query = 'SELECT * FROM recibo';
  connection.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else {
      res.json(results);
    }
  });
});

// Obtener un recibo por ID
app.get('/recibos/:id', (req, res) => {
  const query = 'SELECT * FROM recibo WHERE idRecibo = ?';
  connection.query(query, [req.params.id], (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else if (results.length === 0) {
      res.status(404).json({ message: 'Recibo no encontrado' });
    } else {
      res.json(results[0]);
    }
  });
});

// Crear un nuevo recibo
app.post('/recibo-nuevo', (req, res) => {
  const { idUsuario } = req.body;
  const query = 'INSERT INTO recibo (idUsuario) VALUES (?)';
  connection.query(query, [idUsuario], (error, results) => {
    if (error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(201).json({ id: results.insertId, idUsuario });
    }
  });
});

// Actualizar un recibo
app.put('/recibos/:id', (req, res) => {
  const { idUsuario } = req.body;
  const query = 'UPDATE recibo SET idUsuario = ? WHERE idRecibo = ?';
  connection.query(query, [idUsuario, req.params.id], (error, results) => {
    if (error) {
      res.status(400).json({ message: error.message });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ message: 'Recibo no encontrado' });
    } else {
      res.json({ id: req.params.id, idUsuario });
    }
  });
});

// Eliminar un recibo
app.delete('/recibos/:id', (req, res) => {
  const query = 'DELETE FROM recibo WHERE idRecibo = ?';
  connection.query(query, [req.params.id], (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ message: 'Recibo no encontrado' });
    } else {
      res.json({ message: 'Recibo eliminado' });
    }
  });
});

//Publicidad
app.get('/no-comprado/:idUsuario', (req, res) => {
  const { idUsuario } = req.params;
  const query = `
SELECT p.*
FROM producto p
LEFT JOIN compra c ON p.idProducto = c.idProducto AND c.idUsuario = ?
WHERE c.idProducto IS NULL
LIMIT 6;

  `;
  connection.query(query, [idUsuario], (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else {
      res.json(results);
    }
  });
});

//Dashboard
//Ventas mensuales
app.get('/ventas/mensuales', (req, res) => {
  // Obtener el año y mes actual
  const fechaActual = new Date();
  const anioActual = fechaActual.getFullYear();
  const mesActual = fechaActual.getMonth() + 1; // Los meses en JavaScript son base 0 (enero = 0), por lo que sumamos 1

  const query = `
    SELECT YEAR(fecha_compra) AS anio, MONTH(fecha_compra) AS mes, SUM(precio * cantidad_producto) AS total_ventas
    FROM compra
    JOIN producto ON compra.idProducto = producto.idProducto
    WHERE YEAR(fecha_compra) = ? AND MONTH(fecha_compra) = ?
    GROUP BY YEAR(fecha_compra), MONTH(fecha_compra)
  `;

  connection.query(query, [anioActual, mesActual], (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else {
      res.json(results);
    }
  });
});


//Ventas mensuales por IDUsuario
app.get('/ventas/mensuales/:idUsuario', (req, res) => {
  // Obtener el año y mes actual
  const fechaActual = new Date();
  const anioActual = fechaActual.getFullYear();
  const mesActual = fechaActual.getMonth() + 1; // Los meses en JavaScript son base 0 (enero = 0), por lo que sumamos 1

  // Consulta SQL corregida
  const query = `
SELECT 
  YEAR(fecha_compra) AS anio, 
  MONTH(fecha_compra) AS mes, 
  SUM(precio * cantidad_producto) AS total_ventas
FROM 
  compra
JOIN 
  producto ON compra.idProducto = producto.idProducto
WHERE 
  YEAR(fecha_compra) = ? 
  AND MONTH(fecha_compra) = ? 
  AND producto.idUsuario = ?
GROUP BY 
  YEAR(fecha_compra), 
  MONTH(fecha_compra);
  `;

  // Ejecutar la consulta con los parámetros correctos
  connection.query(query, [anioActual, mesActual, req.params.idUsuario], (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else {
      res.json(results);
    }
  });
});

// Ventas de la semana
app.get('/ventas/semana', (req, res) => {
  const inicioSemana = moment().startOf('week').format('YYYY-MM-DD');
  const finSemana = moment().endOf('week').format('YYYY-MM-DD');

  const query = `
    SELECT SUM(precio * cantidad_producto) AS total_ventas_semana
    FROM compra
    JOIN producto ON compra.idProducto = producto.idProducto
    WHERE fecha_compra BETWEEN ? AND ?
  `;

  connection.query(query, [inicioSemana, finSemana], (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else {
      res.json(results);
    }
  });
});

// Ventas de la semana x IDUSUARIO
app.get('/ventas/semana/:idUsuario', (req, res) => {
  const inicioSemana = moment().startOf('week').format('YYYY-MM-DD');
  const finSemana = moment().endOf('week').format('YYYY-MM-DD');

  const query = `
SELECT 
  SUM(precio * cantidad_producto) AS total_ventas_semana
FROM 
  compra
JOIN 
  producto ON compra.idProducto = producto.idProducto
WHERE 
  fecha_compra BETWEEN ? AND ?
  AND producto.idUsuario = ?

  `;

  connection.query(query, [inicioSemana, finSemana, req.params.idUsuario], (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else {
      res.json(results);
    }
  });
});

// Ventas del día
app.get('/ventas/dia', (req, res) => {
  const fechaHoy = moment().format('YYYY-MM-DD');

  const query = `
    SELECT SUM(precio * cantidad_producto) AS total_ventas_dia
    FROM compra
    JOIN producto ON compra.idProducto = producto.idProducto
    WHERE fecha_compra = ?
  `;

  connection.query(query, [fechaHoy], (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else {
      res.json(results);
    }
  });
});

// Ventas del día x idUsuario
app.get('/ventas/dia/:idUsuario', (req, res) => {
  const fechaHoy = moment().format('YYYY-MM-DD');

  const query = `
SELECT 
  SUM(precio * cantidad_producto) AS total_ventas_dia
FROM 
  compra
JOIN 
  producto ON compra.idProducto = producto.idProducto
WHERE 
  fecha_compra = ?
  AND producto.idUsuario = ?
  `;

  connection.query(query, [fechaHoy, req.params.idUsuario ], (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else {
      res.json(results);
    }
  });
});

// Ganancias mensuales Grafica
app.get('/ganancias/mensuales', (req, res) => {
  // Obtener la fecha actual y la fecha hace 6 meses
  const fechaActual = moment(); // Fecha actual
  const fechaInicio = moment().subtract(6, 'months'); // Fecha hace 6 meses

  const query = `
    SELECT YEAR(fecha_compra) AS anio, MONTH(fecha_compra) AS mes, SUM(precio * cantidad_producto) AS total_ganancias
    FROM compra
    JOIN producto ON compra.idProducto = producto.idProducto
    WHERE fecha_compra BETWEEN ? AND ?
    GROUP BY YEAR(fecha_compra), MONTH(fecha_compra)
    ORDER BY anio, mes;
  `;

  connection.query(query, [fechaInicio.format('YYYY-MM-DD'), fechaActual.format('YYYY-MM-DD')], (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else {
      res.json(results);
    }
  });
});

app.get('/ganancias/mensuales/:idUsuario', (req, res) => {
  // Obtener la fecha actual y la fecha hace 6 meses
  const fechaActual = moment(); // Fecha actual
  const fechaInicio = moment().subtract(6, 'months'); // Fecha hace 6 meses

  const query = `
    SELECT YEAR(fecha_compra) AS anio, MONTH(fecha_compra) AS mes, SUM(precio * cantidad_producto) AS total_ganancias
    FROM compra
    JOIN producto ON compra.idProducto = producto.idProducto
    WHERE fecha_compra BETWEEN ? AND ?
    GROUP BY YEAR(fecha_compra), MONTH(fecha_compra)
    ORDER BY anio, mes;
  `;

  connection.query(query, [fechaInicio.format('YYYY-MM-DD'), fechaActual.format('YYYY-MM-DD')], (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else {
      res.json(results);
    }
  });
});

app.get('/mas-vendidos', (req, res) => {
  const fechaActual = new Date();
  const anioActual = fechaActual.getFullYear();
  const mesActual = fechaActual.getMonth() + 1; // Sumamos 1 porque los meses van de 0 a 11 en JavaScript

  const query = `SELECT 
    producto.producto AS nombre_producto, 
    producto.descripcion, 
    producto.precio, 
    SUBSTRING_INDEX(producto.foto, ',', 1) AS primera_foto,
    SUM(compra.cantidad_producto) AS total_vendido
FROM compra
JOIN producto ON compra.idProducto = producto.idProducto
WHERE YEAR(compra.fecha_compra) = ? 
  AND MONTH(compra.fecha_compra) = ?
GROUP BY producto.producto, producto.descripcion, producto.precio, primera_foto
ORDER BY total_vendido DESC
LIMIT 5;
  `;

  connection.query(query, [anioActual, mesActual], (error, results) => {
    if (error) {
      console.error('Error en la consulta:', error);
      res.status(500).json({ message: 'Error en la consulta' });
    } else {
      //console.log('Resultados de consulta:', results);

      if (results.length === 0) {
        res.status(404).json({ message: 'Productos no encontrados' });
      } else {
        res.json(results);
      }
    }
  });
});

//Productos más vendidos x idUsuario
app.get('/mas-vendidos/:idUsuario', (req, res) => {
  const { idUsuario } = req.params;
  const fechaActual = new Date();
  const anioActual = fechaActual.getFullYear();
  const mesActual = fechaActual.getMonth() + 1; // Sumamos 1 porque los meses van de 0 a 11 en JavaScript

  const query = `SELECT 
    producto.producto AS nombre_producto, 
    producto.descripcion, 
    producto.precio, 
    SUBSTRING_INDEX(producto.foto, ',', 1) AS primera_foto,
    SUM(compra.cantidad_producto) AS total_vendido
FROM 
    compra
JOIN 
    producto ON compra.idProducto = producto.idProducto
WHERE 
    producto.idUsuario = ?  
    AND YEAR(compra.fecha_compra) = ?
    AND MONTH(compra.fecha_compra) = ?
GROUP BY 
    producto.producto, 
    producto.descripcion, 
    producto.precio, 
    primera_foto
ORDER BY 
    total_vendido DESC
LIMIT 5;
  `;

  connection.query(query, [idUsuario, anioActual, mesActual], (error, results) => {
    if (error) {
      console.error('Error en la consulta:', error);
      res.status(500).json({ message: 'Error en la consulta' });
    } else {
      //console.log('Resultados de consulta:', results);

      if (results.length === 0) {
        res.status(404).json({ message: 'Productos no encontrados' });
      } else {
        res.json(results);
      }
    }
  });
});

//Tienda
app.post('/nueva-compra', (req, res) => {
  const { idUsuario, idProducto, cantidad_producto } = req.body;
  const fechaCompra = new Date().toISOString().slice(0, 10); // Obtener la fecha actual en formato YYYY-MM-DD

  const query = 'INSERT INTO compra (idUsuario, idProducto, cantidad_producto, fecha_compra) VALUES (?, ?, ?, ?)';
  connection.query(query, [idUsuario, idProducto, cantidad_producto, fechaCompra], (error, results) => {
    if (error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(201).json({ id: results.insertId, idUsuario, idProducto, cantidad_producto, fechaCompra });
    }
  });
});

//Cupones - Pedro
// Obtener todos los cupones
app.get('/cupones', (req, res) => {
  const query = 'SELECT * FROM cupones';
  connection.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else {
      // Convertir status numérico a texto
      const mappedResults = results.map(cupon => ({
        ...cupon,
        status: cupon.status === 1 ? 'activo' : 'inactivo'
      }));
      res.json(mappedResults);
    }
  });
});

// Obtener un cupón por ID
app.get('/cupones/:id', (req, res) => {
  const query = 'SELECT * FROM cupones WHERE idCupon = ?';
  connection.query(query, [req.params.id], (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else if (results.length === 0) {
      res.status(404).json({ message: 'Cupón no encontrado' });
    } else {
      const cupon = results[0];
      res.json({
        ...cupon,
        status: cupon.status === 1 ? 'activo' : 'inactivo'
      });
    }
  });
});

// Agregar un nuevo cupón
app.post('/cupones-nuevo', (req, res) => {
  const { idUsuario, cupon, descripcion, fechaRegistro, vigencia, status } = req.body;

  // Asegurarse de que status es un número entero
  const statusValue = parseInt(status, 10);

  if (isNaN(statusValue)) {
    return res.status(400).json({ message: 'Estado inválido' });
  }

  // Formatear las fechas al formato 'YYYY-MM-DD'
  const formattedFechaRegistro = new Date(fechaRegistro).toISOString().split('T')[0];
  const formattedVigencia = new Date(vigencia).toISOString().split('T')[0];

  // Consulta de inserción corregida
  const query = `
    INSERT INTO cupones (idUsuario, cupon, descripcion, fechaRegistro, vigencia, status)
    VALUES (?, ?, ?, ?, ?, ?)`; // Asegurarse de incluir los 6 valores

  connection.query(query, [idUsuario, cupon, descripcion, formattedFechaRegistro, formattedVigencia, statusValue], (error, results) => {
    if (error) {
      console.error('Error en la consulta de inserción:', error);
      res.status(400).json({ message: error.message });
    } else {
      res.status(201).json({
        idCupon: results.insertId,
        idUsuario,
        cupon,
        descripcion,
        fechaRegistro: formattedFechaRegistro,
        vigencia: formattedVigencia,
        status: statusValue
      });
    }
  });
});



// Actualizar un cupón
app.put('/cupones/:id', (req, res) => {
  const { cupon, descripcion, fechaRegistro, vigencia, status } = req.body;

  // Convertir `status` a número
  const statusValue = parseInt(status, 10);

  console.log('Datos recibidos en el backend:', {
    cupon,
    descripcion,
    fechaRegistro,
    vigencia,
    status: statusValue
  });

  // Verificar si `statusValue` es un número válido
  if (isNaN(statusValue) || (statusValue !== 0 && statusValue !== 1)) {
    return res.status(400).json({ message: 'Estado inválido' });
  }

  const formattedFechaRegistro = new Date(fechaRegistro).toISOString().split('T')[0];
  const formattedVigencia = new Date(vigencia).toISOString().split('T')[0];

  const query = `
  UPDATE cupones
  SET cupon = ?, descripcion = ?, fechaRegistro = ?, vigencia = ?, status = ?
  WHERE idCupon = ?`;


  connection.query(query, [cupon, descripcion, formattedFechaRegistro, formattedVigencia, statusValue, req.params.id], (error, results) => {
    console.log('Datos enviados a la consulta:', [cupon, descripcion, formattedFechaRegistro, formattedVigencia, statusValue, req.params.id]);
    console.log('Resultados de la consulta:', results);
    
    if (error) {
      console.error('Error en la consulta de actualización:', error);
      res.status(400).json({ message: error.message });
    } else {
      if (results.affectedRows === 0) {
        res.status(404).json({ message: 'Cupón no encontrado' });
      } else {
        res.json({
          idCupon: req.params.id,
          cupon,
          descripcion,
          fechaRegistro: formattedFechaRegistro,
          vigencia: formattedVigencia,
          status: statusValue
        });
      }
    }
  });  
});


// cupones  por us
app.get('/cuponesxus/:idUsuario', (req, res) => {
  const { idUsuario } = req.params; // Obteniendo el parámetro de la URL
  const query = 'SELECT * FROM cupones WHERE idUsuario = ?';
  
  connection.query(query, [idUsuario], (error, results) => { // Usando parámetros para evitar inyección SQL
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    
    // Convertir status numérico a texto
    const mappedResults = results.map(cupon => ({
      ...cupon,
      status: cupon.status === 1 ? 'activo' : 'inactivo'
    }));
    
    res.json(mappedResults);
  });
});

// Eliminar un cupón
app.delete('/cupones/:id', (req, res) => {
  const query = 'DELETE FROM cupones WHERE idCupon = ?';
  connection.query(query, [req.params.id], (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ message: 'Cupón no encontrado' });
    } else {
      res.json({ message: 'Cupón eliminado' });
    }
  });
});
//END Cupones - Pedro


//Ofertas - Pedro
//Obtener todos los ofertas
app.get('/ofertas', (req, res) => {
  const query = 'SELECT * FROM ofertas';
  connection.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else {
      // Convertir status numérico a texto
      const mappedResults = results.map(oferta => ({
        ...oferta,
        status: oferta.status === 1 ? 'activo' : 'inactivo'
      }));
      res.json(mappedResults);
    }
  });
});

// Agregar un nuevo cupón
app.post('/ofertas-nuevo', (req, res) => {
  const { oferta, descripcion, fechaRegistro, vigencia, status } = req.body;

  // Asegurarse de que status es un número entero
  const statusValue = parseInt(status, 10);

  if (isNaN(statusValue)) {
    return res.status(400).json({ message: 'Estado inválido' });
  }

  const formattedFechaRegistro = new Date(fechaRegistro).toISOString().split('T')[0];
  const formattedVigencia = new Date(vigencia).toISOString().split('T')[0];

  const query = `
    INSERT INTO ofertas (oferta, descripcion, fechaRegistro, vigencia, status)
    VALUES (?, ?, ?, ?, ?)`;

  connection.query(query, [oferta, descripcion, formattedFechaRegistro, formattedVigencia, statusValue], (error, results) => {
    if (error) {
      console.error('Error en la consulta de inserción:', error);
      res.status(400).json({ message: error.message });
    } else {
      res.status(201).json({
        idOferta: results.insertId,
        oferta,
        descripcion,
        fechaRegistro: formattedFechaRegistro,
        vigencia: formattedVigencia,
        status: statusValue
      });
    }
  });
});


// Banckend para las suscripciones, crud y compra 
// Ruta para obtener las suscripciones
app.get('/suscripciones', (req, res) => {
  connection.query('SELECT * FROM suscripcion', (err, results) => {
    if (err) return res.status(500).json({ error: err });

    const suscripciones = results.map(suscripcion => {
      let beneficios = [];
      //console.log(`Beneficios antes de parsear para id_sub ${suscripcion.id_sub}:`, suscripcion.beneficios);
      // Verifica si beneficios es un array y asígnalo directamente
      if (Array.isArray(suscripcion.beneficios)) {
        beneficios = suscripcion.beneficios;
      } else if (suscripcion.beneficios) {
        // Si es un string, intenta parsear
        try {
          beneficios = JSON.parse(suscripcion.beneficios);
        } catch (parseError) {
          console.error(`Error parsing beneficios for id_sub ${suscripcion.id_sub}:`, parseError);
          beneficios = []; // Asignar un valor por defecto en caso de error
        }
      }
      return { ...suscripcion, beneficios };
    });
    res.json(suscripciones);
  });
});

// Ruta para agregar una nueva suscripción
app.post('/suscripcion', (req, res) => {
  const { nombre_sub, descripcion_sub, duracion_sub, precio_sub, beneficios } = req.body;
  // Validar que los campos necesarios estén presentes
  if (!nombre_sub || !descripcion_sub || !duracion_sub || !precio_sub || !beneficios) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }
  connection.query(
    'INSERT INTO suscripcion (nombre_sub, descripcion_sub, duracion_sub, precio_sub, beneficios) VALUES (?, ?, ?, ?, ?)',
    [nombre_sub, descripcion_sub, duracion_sub, precio_sub, JSON.stringify(beneficios)],
    (err) => {
      if (err) {
        console.error('Error en la consulta:', err);
        return res.status(500).json({ error: 'Error al agregar la suscripción. Intente nuevamente.' });
      }
      res.status(201).json({ message: 'Suscripción agregada con éxito' });
    }
  );
});

// Ruta para obtener una suscripción por ID
app.get('/api/suscripcion/:id_sub', (req, res) => {
  const { id_sub } = req.params;
  connection.query('SELECT * FROM suscripcion WHERE id_sub = ?', [id_sub], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Suscripción no encontrada' });
    res.json(results[0]);
  });
});

// Ruta para actualizar una suscripción por ID
app.put('/api/suscripcion/:id_sub', (req, res) => {
  const { id_sub } = req.params;
  const { nombre_sub, descripcion_sub, duracion_sub, precio_sub, beneficios } = req.body;
  try {
    // Asegúrate de que esto sea un array o una cadena válida
    const beneficiosJson = JSON.stringify(beneficios);
    const query = 'UPDATE suscripcion SET nombre_sub = ?, descripcion_sub = ?, duracion_sub = ?, precio_sub = ?, beneficios = ? WHERE id_sub = ?';
    connection.query(query, [nombre_sub, descripcion_sub, duracion_sub, precio_sub, beneficiosJson, id_sub], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Suscripción no encontrada' });
      }
      res.json({ message: 'Suscripción actualizada exitosamente' });
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error al procesar los beneficios.' });
  }
});

// Ruta para eliminar una suscripción
app.delete('/suscripcion/:id_sub', (req, res) => {
  const { id_sub } = req.params;
  connection.query('DELETE FROM suscripcion WHERE id_sub = ?', [id_sub], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.sendStatus(204); // No content
  });
});

// Ruta para comprar una suscripción
app.post('/comprar-suscripcion', (req, res) => {
  const { idUsuario, id_sub } = req.body;
  connection.query('SELECT * FROM suscripcion WHERE id_sub = ?', [id_sub], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ error: 'Suscripción no encontrada' });
    const suscripcion = results[0];
    // Actualizar el rol del usuario
    connection.query('UPDATE usuario SET idRol = ? WHERE idUsuario = ?', [id_sub, idUsuario], (err) => {
      if (err) return res.status(500).json({ error: err });
      // Guardar la suscripción del usuario
      const fechaFin = new Date(Date.now() + suscripcion.duracion_sub * 24 * 60 * 60 * 1000);
      connection.query('INSERT INTO usuarioxsub (idUsuario, id_sub, fecha_inicio, fecha_fin) VALUES (?, ?, NOW(), ?)', [idUsuario, id_sub, fechaFin], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.status(201).json({ message: 'Suscripción realizada con éxito' });
      });
    });
  });
});
//Termino el backend para las suscripciones

// Ruta para obtener las temporadas
app.get('/temporada', (req, res) => {
  connection.query('SELECT * FROM temporada', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.get('/usuariogetidrol', (req, res) => {
  const query = 'SELECT * FROM usuario where idRol = 3';
  connection.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ message: 'nop' });
    } else {
      res.json(results);
    }
  });
});

// Endpoint para guardar un producto en la tabla
app.post('/guardar-favorito', (req, res) => {
  const { idProducto, idUsuario } = req.body;

  // Asegúrate de que los valores se envían correctamente
  if (! idProducto || ! idUsuario) {
    return res.status(400).json({ error: 'idProducto y idUsuario son requeridos' });
  }

  // Consulta para insertar el nuevo favorito
  const query = 'INSERT INTO producto_fav (idProducto, idUsuario, fecha_reg) VALUES (?, ?, NOW())';

  connection.query(query, [idProducto, idUsuario], (err, results) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ error: 'Error al guardar el favorito' });
    }
    res.status(201).json({ message: 'Favorito guardado con éxito', id: results.insertId });
  });
});

// Endpoint para obtener los favoritos
app.get('/favoritos/:idUsuario', (req, res) => {
  const { idUsuario } = req.params;
  const query = 'SELECT idProducto FROM producto_fav WHERE idUsuario = ?';
  connection.query(query, [idUsuario], (err, results) => {
    if (err) {
      console.error('Error retrieving favorites:', err);
      return res.status(500).json({ error: 'Error al obtener los favoritos' });
    }
    res.status(200).json(results);
  });
});

// Ruta para eliminar de favoritos
app.delete('/favoritosdelete/:idUsuario/:idProducto', (req, res) => {
  const { idUsuario, idProducto } = req.params; // Desestructuramos ambos parámetros
  connection.query('DELETE FROM producto_fav WHERE idUsuario = ? AND idProducto = ?', [idUsuario, idProducto], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.sendStatus(204); // No content
  });
});


// Obtener comentarios por ID de producto
app.get('/comentarios/:idProducto', (req, res) => {
  const query = `
    SELECT c.*, u.nombre, u.email 
    FROM comentarios c 
    JOIN usuario u ON c.idUsuario = u.idUsuario 
    WHERE c.idProducto = ?`;
  
  connection.query(query, [req.params.idProducto], (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else {
      res.json(results);
    }
  });
});


// Agregar un comentario
app.post('/comentarios', (req, res) => {
  const { idUsuario, idProducto, comentario, valoracion } = req.body;
  const query = 'INSERT INTO comentarios (idUsuario, idProducto, comentario, fecha, valoracion) VALUES (?, ?, ?, NOW(), ?)';
  connection.query(query, [idUsuario, idProducto, comentario, valoracion], (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else {
      res.json({ idComentario: results.insertId, idUsuario, idProducto, comentario, fecha: new Date(), valoracion });
    }
  });
});

/* 
app.post('/registro-vendedor', (req, res) => {
  const { nom_empresa, direccion, telefono, pais, estado, codigo_postal, rfc, idUsuario, idRol, idSuscripcion } = req.body;

  const query = `
    INSERT INTO vendedor (nom_empresa, direccion, telefono, pais, estado, codigo_postal, rfc, idUsuario, idRol, idSuscripcion, fecha_registro)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `;

  connection.query(query, [nom_empresa, direccion, telefono, pais, estado, codigo_postal, rfc, idUsuario, idRol, idSuscripcion], (error, results) => {
    if (error) {
      console.error('Error al registrar el vendedor:', error);
      return res.status(500).send('Error en el servidor');
    }
    res.status(201).send('Vendedor registrado exitosamente');
  });
}); */



// Ruta para obtener el rol basado en la suscripción
/* app.get('/suscripcion/:id_sub', (req, res) => {
  const { id_sub } = req.params;

  // Asumiendo que tienes una tabla de suscripciones que relaciona el id_sub con el idRol
  const query = 'SELECT idRol FROM suscripciones WHERE id_sub = ?';

  connection.query(query, [id_sub], (error, results) => {
    if (error) {
      console.error('Error al obtener el rol de la suscripción:', error);
      return res.status(500).send('Error en el servidor');
    }
    if (results.length === 0) {
      return res.status(404).send('Suscripción no encontrada');
    }
    res.send(results[0]); // Devuelve el idRol
  });
}); */


app.post('/registro-vendedor', (req, res) => {
  const { nom_empresa, direccion, telefono, pais, estado, codigo_postal, rfc, idUsuario, id_sub } = req.body;

  console.log(req.body); // Verifica los datos recibidos

  // Obtén el idRol asociado a la suscripción
  const suscripcionQuery = 'SELECT idRol FROM suscripcion WHERE id_sub = ?';
  connection.query(suscripcionQuery, [id_sub], (err, results) => {
    if (err) {
      console.error('Error al obtener el rol de la suscripción:', err.message);
      return res.status(500).send('Error al obtener el rol de la suscripción');
    }

    if (results.length === 0) {
      return res.status(400).send('Suscripción no encontrada.');
    }

    const idRol = results[0].idRol;
    const fechaRegistro = new Date(); // Nueva línea para obtener la fecha actual

    // Inserta el vendedor
    const insertQuery = 'INSERT INTO vendedor (nom_empresa, direccion, telefono, pais, estado, codigo_postal, rfc, idUsuario, idRol, id_sub, fecha_registro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    connection.query(insertQuery, [nom_empresa, direccion, telefono, pais, estado, codigo_postal, rfc, idUsuario, idRol, id_sub, fechaRegistro], (err, result) => {
      if (err) {
        console.error('Error al registrar el vendedor:', err.message);
        return res.status(500).send('Error al registrar el vendedor');
      }

      // Actualiza el idRol del usuario
      const updateQuery = 'UPDATE usuario SET idRol = ? WHERE idUsuario = ?';
      connection.query(updateQuery, [idRol, idUsuario], (err, result) => {
        if (err) {
          console.error('Error al actualizar el rol del usuario:', err.message);
          return res.status(500).send('Error al actualizar el rol del usuario');
        }

        res.status(201).send('Vendedor registrado y rol actualizado.');
      });
    });
  });
});



// Ruta para obtener el perfil del vendedor
app.get('/vendedor/:idUsuario', (req, res) => {
  const { idUsuario } = req.params;

  const query = 'SELECT * FROM vendedor WHERE idUsuario = ?';
  
  connection.query(query, [idUsuario], (error, results) => {
    if (error) {
      console.error('Error al obtener el vendedor:', error);
      return res.status(500).send('Error en el servidor');
    }
    res.send(results[0]);
  });
});

// Ruta para verificar si el vendedor tiene una empresa
app.get('/empresa/verificar/:idUsuario', (req, res) => {
  const { idUsuario } = req.params;

  const query = 'SELECT * FROM vendedor WHERE idUsuario = ?';
  
  connection.query(query, [idUsuario], (error, results) => {
    if (error) {
      console.error('Error al verificar el vendedor:', error);
      return res.status(500).send('Error en el servidor');
    }
    
    if (results.length > 0) {
      res.json({ existe: true, vendedor: results[0] }); // Si existe, devuelve el vendedor
    } else {
      res.json({ existe: false }); // Si no existe, devuelve false
    }
  });
});


// Endpoint para obtener el id_sub basado en idRol
app.get('/suscripcion/:idRol', (req, res) => {
  const rolId = req.params.idRol;
  const query = 'SELECT id_sub, idRol FROM suscripcion WHERE idRol = ?';
  
  connection.query(query, [rolId], (error, results) => {
    if (error) {
      console.error('Error en la consulta de suscripción:', error);
      return res.status(500).send('Error en la consulta de suscripción');
    }

    if (results.length === 0) {
      return res.status(404).send('Suscripción no encontrada');
    }

    res.json(results[0]); // Devuelve el primer resultado
  });
});





app.listen(3001, () => {
  console.log(`Server is running on port: ${port}`);
});
