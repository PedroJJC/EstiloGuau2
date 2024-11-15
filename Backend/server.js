//#region Conexiòn
const express = require('express');
const mysql = require('mysql2/promise');
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

let connection;

// Conexión a la base de datos
async function initializeDBConnection() {
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '12345',
      database: 'bdestiloguau'
    });
    console.log('Conexión a la base de datos establecida');
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    process.exit(1); // Termina el proceso si no se puede conectar
  }
}
initializeDBConnection();


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
//#endregion

// Rutas
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

///#Joel
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const encodedPassword = Buffer.from(password).toString('base64'); // Codificar la contraseña

  try {
    const query = `
      SELECT u.*, v.idVendedor 
      FROM usuario u
      LEFT JOIN vendedor v ON u.idUsuario = v.idUsuario 
      WHERE u.email = ? AND u.password = ?`;
    const [results] = await connection.query(query, [email, encodedPassword]); // Usar await para la consulta

    if (results.length > 0) {
      // Usuario autenticado correctamente
      res.status(200).json({ message: 'Login exitoso', user: results[0] });
    } else {
      // Credenciales incorrectas
      res.status(401).json({ message: 'Credenciales incorrectas' });
    }
  } catch (error) {
    console.error('Error al realizar la consulta:', error); // Log para el error
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

app.post('/registro', async (req, res) => {
  const query = 'INSERT INTO usuario (idRol, nombre, apellido, email, password, fecha_creacion, foto) VALUES (?, ?, ?, ?, ?, NOW(), ?)';
  const { idRol = 1, nombre, apellido, email, password } = req.body;
  const encoded = Buffer.from(password).toString("base64");
  const fotoPorDefecto = '1721157608571-logo.png';

  try {
    await connection.execute(query, [idRol, nombre, apellido, email, encoded, fotoPorDefecto]);
    res.status(201).json({ message: "Usuario Agregado" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post('/new-user', upload.single('foto'), async (req, res) => {
  console.log('hola');

  const { idRol, nombre, apellido, email, password, fecha_creacion } = req.body;
  let foto = '1721157608571-logo.png';
  const encoded = Buffer.from(password).toString("base64");
  const query = 'INSERT INTO usuario (idRol, nombre, apellido, email, password, fecha_creacion, foto) VALUES (?, ?, ?, ?, ?, ?, ?)';

  try {
    console.log(req.body);
    const [results] = await connection.execute(query, [idRol, nombre, apellido, email, encoded, fecha_creacion, foto]);
    res.status(201).json({ message: "Usuario agregado" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/usuariosget', async (req, res) => {
  const query = 'SELECT * FROM usuario JOIN rol';

  try {
    const [results] = await connection.execute(query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'nop' });
  }
});

app.get('/usuarioget/:idUsuario', async (req, res) => {
  const query = 'SELECT * FROM usuario WHERE idUsuario = ?';

  try {
    const [results] = await connection.execute(query, [req.params.idUsuario]);

    if (results.length === 0) {
      res.status(404).json({ message: 'Usuario no encontrado' });
    } else {
      res.json(results[0]);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/*
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
});*/

app.get('/comprasxus/:idUsuario', async (req, res) => {
  const idUsuario = req.params.idUsuario;

  if (!idUsuario) {
    return res.status(400).json({ message: 'ID de usuario es requerido.' });
  }

  const query = `
       SELECT 
    producto.producto AS nombre_producto, 
    producto.descripcion, 
    inventario.precio,
    SUBSTRING_INDEX(producto.foto, ',', 1) AS primera_foto,
    tallas.Talla AS nombre_talla,  -- Cambia aquí para obtener el nombre de la talla
    compra.cantidad_producto,
    compra.idUsuario,
    compra.idCompra,
    CONCAT(usuario.nombre, ' ', usuario.apellido) AS cliente 
FROM 
    compra 
JOIN 
    producto ON compra.idProducto = producto.idProducto
JOIN 
    inventario ON inventario.idProducto = producto.idProducto
JOIN 
    tallas ON tallas.idTalla = inventario.idTalla
JOIN 
    usuario ON compra.idUsuario = usuario.idUsuario
WHERE 
    compra.idUsuario = ?;`;

  try {
    const [results] = await connection.execute(query, [idUsuario]);

    const totalCompras = results.length;
    const puntosGanados = Math.floor(totalCompras / 5) * 0.5;

    if (puntosGanados > 0) {
      const [puntosResult] = await connection.execute(
        `SELECT * FROM puntos_fidelidad WHERE idUsuario = ?`,
        [idUsuario]
      );

      if (puntosResult.length > 0) {
        const ultimaActualizacion = puntosResult[0].fecha;

        if (totalCompras > (puntosResult[0].puntos / 0.5) * 5) {
          await connection.execute(
            `UPDATE puntos_fidelidad SET puntos = puntos + ? WHERE idUsuario = ?`,
            [puntosGanados, idUsuario]
          );
        }
        res.json(results);
      } else {
        await connection.execute(
          `INSERT INTO puntos_fidelidad (idUsuario, puntos, fecha) VALUES (?, ?, NOW())`,
          [idUsuario, puntosGanados]
        );
        res.json(results);
      }
    } else {
      res.json(results);
    }
  } catch (error) {
    console.error('Error en la ruta /comprasxus:', error);
    res.status(500).json({ message: error.message });
  }
});

app.get('/todas-compras/:idUsuario', async (req, res) => {
  const idUsuario = req.params.idUsuario;

  if (!idUsuario) {
    return res.status(400).json({ message: 'ID de usuario es requerido.' });
  }

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
        usuario.nombre AS cliente
    FROM 
        compra 
    JOIN 
        producto ON compra.idProducto = producto.idProducto
    JOIN
        tallas ON producto.idTalla = tallas.idTalla
    JOIN
        usuario ON compra.idUsuario = usuario.idUsuario
    WHERE 
        compra.idUsuario = ?
    ORDER BY 
        compra.idCompra DESC`;

  try {
    const [results] = await connection.execute(query, [idUsuario]);
    res.json(results);
  } catch (error) {
    console.error('Error en la ruta /todas-compras:', error);
    res.status(500).json({ message: error.message });
  }
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
app.put('/usuarioupdate/:idUsuario', upload.single('foto'), async (req, res) => {
  const { idRol, nombre, apellido, email, password } = req.body;
  const foto = req.file ? req.file.filename : null; // Nombre del archivo de imagen guardado por Multer, si se proporciona uno nuevo

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

  try {
    // Ejecutar la consulta de actualización de manera asincrónica
    const [results] = await connection.execute(updateQuery, queryParams);

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({
      idUsuario: req.params.idUsuario,
      idRol,
      nombre,
      apellido,
      email,
      password,
      foto
    });
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    res.status(400).json({ message: error.message });
  }
});

app.delete('/usuariodelete/:idUsuario', async (req, res) => {
  const query = 'DELETE FROM usuario WHERE idUsuario = ?';

  try {
    const [results] = await connection.execute(query, [req.params.idUsuario]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    res.status(500).json({ message: error.message });
  }
});

///#JoelEnd
//Obtener todos los registros
app.get('/all-rol', async (req, res) => {
  const query = 'SELECT * FROM rol';

  try {
    const [results] = await connection.execute(query);
    res.json(results);
  } catch (error) {
    console.error('Error al obtener roles:', error);
    res.status(500).json({ message: 'Error al obtener roles' });
  }
});

//Obtener registro por ID
app.get('/id-rol/:idrol', async (req, res) => {
  const query = 'SELECT * FROM rol WHERE idrol = ?;';

  try {
    const [results] = await connection.execute(query, [req.params.idrol]);

    if (results.length === 0) {
      res.status(404).json({ message: 'Rol no encontrado' });
    } else {
      res.json(results[0]);
    }
  } catch (error) {
    console.error('Error en la consulta:', error);
    res.status(500).json({ message: error.message });
  }
});

//Crear un nuevo rol
app.post('/new-rol', async (req, res) => {
  const query = 'INSERT INTO rol (rol) VALUES (?)';
  const { rol } = req.body;

  try {
    const [results] = await connection.execute(query, [rol]);
    res.status(201).json({ id: results.insertId, rol });
  } catch (error) {
    console.error('Error al insertar el rol:', error);
    res.status(400).json({ message: error.message });
  }
});

//Actulizar regstro 
app.put('/id-rol/:idrol', async (req, res) => {
  const { rol } = req.body; // Suponiendo que estás enviando el nuevo nombre del rol en el cuerpo de la solicitud
  const checkQuery = 'SELECT * FROM rol WHERE idrol = ?';
  const updateQuery = 'UPDATE rol SET rol = ? WHERE idrol = ?';

  try {
    // Verificar si el rol existe
    const [checkResults] = await connection.execute(checkQuery, [req.params.idrol]);

    if (checkResults.length === 0) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }

    // Actualizar el rol
    await connection.execute(updateQuery, [rol, req.params.idrol]);
    res.json({ message: 'Rol actualizado exitosamente', idrol: req.params.idrol, rol });
  } catch (error) {
    console.error('Error al actualizar el rol:', error);
    res.status(500).json({ message: error.message });
  }
});

//Eliminar registro
app.delete('/id-rol/:idrol', async (req, res) => {
  const queryCheck = 'SELECT * FROM rol WHERE idrol = ?';
  const queryDelete = 'DELETE FROM rol WHERE idrol = ?';

  try {
    // Verificar si el rol existe
    const [checkResults] = await connection.execute(queryCheck, [req.params.idrol]);

    if (checkResults.length === 0) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }

    // Eliminar el rol
    await connection.execute(queryDelete, [req.params.idrol]);
    res.json({ message: 'Rol eliminado' });
  } catch (error) {
    console.error('Error al eliminar el rol:', error);
    res.status(500).json({ message: error.message });
  }
});

//Ruta para obtener todas las compras
app.get('/compras', async (req, res) => {
  const query = `
SELECT
    c.idCompra,
    p.descripcion AS descripcion_producto,
    i.precio,
    p.foto,
    t.talla AS talla,
    c.cantidad_producto,
    CONCAT(u.nombre, ' ', u.apellido) AS cliente
FROM
    compra c
JOIN inventario i on i.idProducto = c.idProducto
JOIN
    producto p ON c.idProducto = p.idProducto
JOIN
    usuario u ON c.idUsuario = u.idUsuario
JOIN
    tallas t ON i.idTalla = t.idTalla

ORDER BY
    c.fecha_compra DESC
  `;

  try {
    const [results] = await connection.execute(query);

    if (results.length === 0) {
      return res.status(404).json({ message: 'No se encontraron compras' });
    }

    res.json(results);
  } catch (error) {
    console.error('Error al obtener las compras:', error);
    res.status(500).json({ message: error.message });
  }
});

// Ruta para obtener las compras recientes
app.get('/clientes-recientes', async (req, res) => {
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

  try {
    const [results] = await connection.execute(query);

    if (results.length === 0) {
      return res.status(404).json({ message: 'No se encontraron clientes recientes' });
    }

    res.json(results); // Enviar resultados como JSON
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    res.status(500).json({ error: 'Error al obtener las compras recientes' });
  }
});

//Pedro PERMISOS
// Obtener todos los permisos
/*
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
*/

//Pedro TALLAS
// Obtener todas las tallas
app.get('/tallas', async (req, res) => {
  const query = 'SELECT * FROM tallas';
  try {
    const [results] = await connection.execute(query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener una talla por ID
app.get('/tallas/:id', async (req, res) => {
  const query = 'SELECT * FROM tallas WHERE idTalla = ?';

  try {
    const [results] = await connection.execute(query, [req.params.id]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'Talla no encontrada' });
    }

    res.json(results[0]);
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    res.status(500).json({ message: error.message });
  }
});

// Crear una nueva talla
app.post('/talla-nueva', async (req, res) => {
  const { talla } = req.body;

  // Validar que 'talla' no esté vacío y tenga un tamaño razonable
  if (!talla || talla.length > 20) {
    return res.status(400).json({ message: 'Talla inválida o demasiado larga' });
  }

  const query = 'INSERT INTO tallas (talla) VALUES (?)';

  try {
    const [results] = await connection.execute(query, [talla]);
    res.status(201).json({ id: results.insertId, talla });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Actualizar una talla
app.put('/tallas/:id', async (req, res) => {
  const { talla } = req.body;
  const query = 'UPDATE tallas SET talla = ? WHERE idTalla = ?';

  try {
    const [results] = await connection.execute(query, [talla, req.params.id]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Talla no encontrada' });
    }

    res.json({ id: req.params.id, talla });
  } catch (error) {
    console.error('Error al ejecutar la consulta de actualización:', error);
    res.status(400).json({ message: error.message });
  }
});

// Eliminar una talla
app.delete('/tallas/:id', async (req, res) => {
  const query = 'DELETE FROM tallas WHERE idTalla = ?';

  try {
    const [results] = await connection.execute(query, [req.params.id]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Talla no encontrada' });
    }

    res.json({ message: 'Talla eliminada' });
  } catch (error) {
    console.error('Error al ejecutar la consulta de eliminación:', error);
    res.status(500).json({ message: error.message });
  }
});

// Obtener todos las ofertas
// Ruta para obtener todas las ofertas
app.get('/all-ofertas', async (req, res) => {
  const query = 'SELECT * FROM ofertas';
  try {
    const [results] = await connection.execute(query); // Cambiado a execute
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message }); // Manejo de errores
  }
});

//Pedro PRODUCTOS
// Obtener todos los productos
app.get('/productos', async (req, res) => {
  const query = 'SELECT p.*, vendedor.nom_empresa AS tienda,  MIN(i.precio) AS precio, SUBSTRING_INDEX(p.foto, \',\', 1) AS primera_foto,MAX(o.oferta) AS porcentaje_descuento,   GROUP_CONCAT(DISTINCT i.idTalla ORDER BY i.idTalla ASC) AS tallas_disponibles, GROUP_CONCAT(DISTINCT i.precio ORDER BY i.precio ASC) AS precios, GROUP_CONCAT(DISTINCT o.idOferta ORDER BY o.idOferta ASC) AS ofertas FROM  producto p LEFT JOIN  inventario i ON p.idProducto = i.idProducto  LEFT JOIN ofertas o ON i.idOferta = o.idOferta LEFT JOIN vendedor ON p.idVendedor = vendedor.idVendedor GROUP BY p.idProducto'
  try {
    const [results] = await connection.execute(query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener todos los productos por idUs
// Ruta para obtener productos por idVendedor
app.get('/productosidus/:idVendedor', async (req, res) => {
  const query = 'SELECT * FROM producto WHERE idVendedor = ?';
  //console.log(`Consultando productos para idVendedor: ${req.params.idVendedor}`); // Log para verificar el idVendedor
  try {
    const [results] = await connection.execute(query, [req.params.idVendedor]);
    if (results.length === 0) {
      console.log('No se encontraron productos'); // Log si no hay resultados
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(results);
  } catch (error) {
    console.error('Error en la consulta:', error); // Log de error
    res.status(500).json({ message: error.message });
  }
});

// Obtener un producto por ID
app.get('/productos/:id', async (req, res) => {
  const query = 'SELECT p.*, o.oferta AS porcentaje_descuento, t.idTalla as idTalla, t.Talla as Talla, i.precio as precio FROM producto p LEFT JOIN inventario i ON p.idProducto = i.idProducto LEFT JOIN ofertas o ON i.idOferta = o.idOferta LEFT JOIN tallas t on t.idTalla = i.idTalla WHERE p.idProducto = ?';
  try {
    const [results] = await connection.execute(query, [req.params.id]);
    if (results.length === 0) {
      res.status(404).json({ message: 'Producto no encontrado' });
    } else {
      res.json(results[0]);
     console.log(results[0])
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.get('/productosprecios/:idProducto/:Talla', async (req, res) => {
  console.log("entre productosprecio")
  const query = 'select precio, o.Oferta from inventario as i JOIN tallas t on  t.idTalla = i.idTalla JOIN ofertas o on o.idOferta = i.idOferta where idProducto = ? and talla = ?';
  try {
    const [results] = await connection.execute(query, [req.params.idProducto, req.params.Talla]);
    if (results.length === 0) {
      res.status(404).json({ message: 'Producto no encontrado' });
    } else {
      res.json(results[0]);
     console.log(results[0])
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




//Tallas por idProducto
app.get('/tallasxidproducto/:id', async (req, res) => {
  console.log("entre tallasxidproducto!")
  const query = 'SELECT t.Talla as Talla FROM producto p LEFT JOIN inventario i ON p.idProducto = i.idProducto LEFT JOIN tallas t on t.idTalla = i.idTalla WHERE p.idProducto = ?;';
  try {
    const [results] = await connection.execute(query, [req.params.id]);
    if (results.length === 0) {
      res.status(404).json({ message: 'Producto no encontrado' });
    } else {
      res.json(results);
     // console.log("si es este")
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener un producto por ID
app.get('/detalleproducto/:id', async (req, res) => {
  const query = 'SELECT * FROM producto WHERE idProducto = ?';

  try {
    const [results] = await connection.execute(query, [req.params.id]);
    if (results.length === 0) {
      res.status(404).json({ message: 'Producto no encontrado' });
    } else {
      res.json(results[0]);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Agregar Producto
app.post('/producto-nuevo', upload.array('foto', 4), async (req, res) => {
 // console.log("Datos recibidos:", req.body);
//console.log("Archivos recibidos:", req.files);
  const { idVendedor, sku, producto, Marca, precios, idTemporada, descripcion, ofertas, fecha_ingreso, cantidades, tallas } = req.body;
  const fotos = req.files.map(file => file.filename); // Obtener los nombres de los archivos subidos

  // Convertir el array de fotos a un string JSON
  const fotosString = JSON.stringify(fotos);

  try {
    // 1. Insertar en la tabla de productos
    const queryProducto = 'INSERT INTO producto (idVendedor, sku, producto, Marca, idTemporada, descripcion, foto, fecha_ingreso) VALUES (?, ?,  ?, ?, ?, ?, ?, ?)';
    const [resultProducto] = await connection.query(queryProducto, [idVendedor, sku, producto, Marca, idTemporada, descripcion, fotosString, fecha_ingreso]);

    // 2. Insertar en la tabla de inventario
    tallas.forEach(async (e, i) => {
      const queryInventario = 'INSERT INTO inventario (idProducto, idTalla, Existencias, precio, idOferta) VALUES (?,?,?,?,?)';
      await connection.query(queryInventario, [resultProducto.insertId, e, cantidades[i], precios[i], ofertas[i]]);
    });



    res.status(201).json({ message: 'Producto agregado correctamente', id: resultProducto.insertId });
  } catch (error) {
    console.error('Error al agregar el producto:', error);
    res.status(500).json({ message: error.message });
  }
});

// Actualizar un producto
app.put('/productos/:id', upload.array('foto', 4), async (req, res) => {
  const { producto, sku, Marca, precio, idTalla, descripcion, idOferta, fecha_ingreso, cantidad, idUsuario, idTemporada } = req.body;
  let foto = '';

  if (req.files && req.files.length > 0) {
    foto = req.files.map(file => file.filename).join(','); // Une los nombres de los archivos con comas
  }

  const updateQuery = foto
    ? 'UPDATE producto SET producto = ?, sku = ?, Marca = ?, precio = ?, idTalla = ?, descripcion = ?, foto = ?, idOferta=?, fecha_ingreso=?, cantidad=?, idUsuario=?, idTemporada=? WHERE idProducto = ?'
    : 'UPDATE producto SET producto = ?, sku = ?, Marca = ?, precio = ?, idTalla = ?, descripcion = ?, idOferta=?, fecha_ingreso=?, cantidad=?, idUsuario=?, idTemporada=? WHERE idProducto = ?';

  const queryParams = foto
    ? [producto, sku, Marca, precio, idTalla, descripcion, foto, idOferta, fecha_ingreso, cantidad, idUsuario, idTemporada, req.params.id]
    : [producto, sku, Marca, precio, idTalla, descripcion, idOferta, fecha_ingreso, cantidad, idUsuario, idTemporada, req.params.id];

  try {
    const [results] = await connection.execute(updateQuery, queryParams);

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json({ id: req.params.id, producto, sku, Marca, precio, idTalla, descripcion, foto, idOferta, fecha_ingreso, cantidad, idUsuario, idTemporada });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Eliminar un producto
app.delete('/productos/:id', async (req, res) => {
  const query = 'DELETE FROM producto WHERE idProducto = ?';

  try {
    const [results] = await connection.execute(query, [req.params.id]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Eliminar la imagen de un producto
app.delete('/productos/:id/foto', async (req, res) => {
  const { id } = req.params;
  const query = 'UPDATE producto SET foto = "" WHERE idProducto = ?'; // Cambiar a un valor vacío

  try {
    const [results] = await connection.execute(query, [id]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json({ message: 'Imagen eliminada exitosamente' });
  } catch (error) {
    console.error(`Error al eliminar la imagen del producto con ID ${id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al eliminar la imagen' });
  }
});

//Pedro RECIBOS
// Obtener todos los recibos
/*
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
*/

//Publicidad
/*
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
*/

//Dashboard
//Ventas mensuales
app.get('/ventas/mensuales', async (req, res) => {
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

  try {
    const [results] = await connection.execute(query, [anioActual, mesActual]);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Ventas mensuales por IDUsuario
app.get('/ventas/mensuales/:idVendedor', async (req, res) => {
  // Obtener el año y mes actual
  const fechaActual = new Date();
  const anioActual = fechaActual.getFullYear();
  const mesActual = fechaActual.getMonth() + 1; // Los meses en JavaScript son base 0 (enero = 0), por lo que sumamos 1

  // Consulta SQL corregida
  const query = `
   SELECT 
    YEAR(compra.fecha_compra) AS anio, 
    MONTH(compra.fecha_compra) AS mes, 
    SUM(inventario.precio * compra.cantidad_producto) AS total_ventas
FROM 
    compra
JOIN 
    producto ON compra.idProducto = producto.idProducto
JOIN 
    inventario ON inventario.idProducto = producto.idProducto
WHERE 
    YEAR(compra.fecha_compra) = ? 
    AND MONTH(compra.fecha_compra) = ?
    AND producto.idVendedor = ?
GROUP BY 
    YEAR(compra.fecha_compra), 
    MONTH(compra.fecha_compra);
  `;

  try {
    const [results] = await connection.execute(query, [anioActual, mesActual, req.params.idVendedor]);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ventas de la semana
app.get('/ventas/semana', async (req, res) => {
  const inicioSemana = moment().startOf('week').format('YYYY-MM-DD');
  const finSemana = moment().endOf('week').format('YYYY-MM-DD');

  const query = `
    SELECT SUM(precio * cantidad_producto) AS total_ventas_semana
    FROM compra
    JOIN producto ON compra.idProducto = producto.idProducto
    WHERE fecha_compra BETWEEN ? AND ?
  `;

  try {
    const [results] = await connection.execute(query, [inicioSemana, finSemana]);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ventas de la semana x IDUSUARIO
app.get('/ventas/semana/:idVendedor', async (req, res) => {
  const inicioSemana = moment().startOf('week').format('YYYY-MM-DD');
  const finSemana = moment().endOf('week').format('YYYY-MM-DD');

  const query = `
    SELECT 
      SUM(precio * cantidad_producto) AS total_ventas_semana
    FROM 
      compra
    JOIN 
      producto ON compra.idProducto = producto.idProducto
      JOIN 
    inventario ON inventario.idProducto = producto.idProducto
    WHERE 
      fecha_compra BETWEEN ? AND ?
      AND producto.idVendedor = ?
  `;

  try {
    const [results] = await connection.execute(query, [inicioSemana, finSemana, req.params.idVendedor]);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ventas del día
app.get('/ventas/dia', async (req, res) => {
  const fechaHoy = moment().format('YYYY-MM-DD');

  const query = `
    SELECT SUM(precio * cantidad_producto) AS total_ventas_dia
    FROM compra
    JOIN producto ON compra.idProducto = producto.idProducto
    WHERE fecha_compra = ?
  `;

  try {
    const [results] = await connection.execute(query, [fechaHoy]);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ventas del día x idUsuario
app.get('/ventas/dia/:idVendedor', async (req, res) => {
  const fechaHoy = moment().format('YYYY-MM-DD');

  const query = `
    SELECT 
      SUM(precio * cantidad_producto) AS total_ventas_dia
    FROM 
      compra
    JOIN 
      producto ON compra.idProducto = producto.idProducto
      JOIN 
    inventario ON inventario.idProducto = producto.idProducto
    WHERE 
      fecha_compra = ?
      AND producto.idVendedor = ?
  `;

  try {
    const [results] = await connection.execute(query, [fechaHoy, req.params.idVendedor]);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ganancias mensuales Grafica
app.get('/ganancias/mensuales', async (req, res) => {
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

  try {
    const [results] = await connection.execute(query, [fechaInicio.format('YYYY-MM-DD'), fechaActual.format('YYYY-MM-DD')]);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/ganancias/mensuales/:idVendedor', async (req, res) => {
  // Obtener la fecha actual y la fecha hace 6 meses
  const fechaActual = moment(); // Fecha actual
  const fechaInicio = moment().subtract(6, 'months'); // Fecha hace 6 meses

  const query = `
    SELECT YEAR(fecha_compra) AS anio, MONTH(fecha_compra) AS mes, SUM(inventario.precio * cantidad_producto) AS total_ganancias
    FROM compra
    JOIN producto ON compra.idProducto = producto.idProducto
     JOIN inventario ON inventario.idProducto = producto.idProducto
    WHERE fecha_compra BETWEEN ? AND ?
    AND producto.idVendedor = ?
    GROUP BY YEAR(fecha_compra), MONTH(fecha_compra)
    ORDER BY anio, mes;
  `;

  try {
    const [results] = await connection.execute(query, [fechaInicio.format('YYYY-MM-DD'), fechaActual.format('YYYY-MM-DD'), req.params.idVendedor]);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/mas-vendidos', async (req, res) => {
  const fechaActual = new Date();
  const anioActual = fechaActual.getFullYear();
  const mesActual = fechaActual.getMonth() + 1; // Sumamos 1 porque los meses van de 0 a 11 en JavaScript

  const query = `
    SELECT 
      producto.producto AS nombre_producto, 
      producto.descripcion, 
      inventario.precio, 
inventario.idTalla,
tallas.talla,
      SUBSTRING_INDEX(producto.foto, ',', 1) AS primera_foto,
      SUM(compra.cantidad_producto) AS total_vendido
    FROM compra
Join inventario on inventario.idProducto = compra.idProducto
join tallas on tallas.idTalla = inventario.idTalla
    JOIN producto ON compra.idProducto = producto.idProducto
    WHERE 
   YEAR(compra.fecha_compra) = 2024
      AND MONTH(compra.fecha_compra) = 10
    GROUP BY producto.producto, producto.descripcion, inventario.precio, primera_foto, inventario.idTalla,
tallas.talla
    ORDER BY total_vendido DESC
    LIMIT 5;
  `;

  try {
    const [results] = await connection.execute(query, [anioActual, mesActual]);

    if (results.length === 0) {
      res.status(404).json({ message: 'Productos no encontrados' });
    } else {
      res.json(results);
    }
  } catch (error) {
    console.error('Error en la consulta:', error);
    res.status(500).json({ message: 'Error en la consulta' });
  }
});

//Productos más vendidos x idUsuario
app.get('/mas-vendidos/:idVendedor', async (req, res) => {
  const { idVendedor } = req.params;
  const fechaActual = new Date();
  const anioActual = fechaActual.getFullYear();
  const mesActual = fechaActual.getMonth() + 1; // Sumamos 1 porque los meses van de 0 a 11 en JavaScript

  const query = `
    SELECT 
      producto.producto AS nombre_producto, 
      producto.descripcion, 
      inventario.precio, 
      SUBSTRING_INDEX(producto.foto, ',', 1) AS primera_foto,
      SUM(compra.cantidad_producto) AS total_vendido
    FROM 
      compra
    JOIN 
      producto ON compra.idProducto = producto.idProducto
Join inventario on inventario.idProducto = producto.idProducto
    WHERE 
      producto.idVendedor = ?
      AND YEAR(compra.fecha_compra) = ?
      AND MONTH(compra.fecha_compra) = ?
    GROUP BY 
      producto.producto, 
      producto.descripcion, 
      inventario.precio, 
      primera_foto
    ORDER BY 
      total_vendido DESC
    LIMIT 5;
  `;

  try {
    const [results] = await connection.execute(query, [idVendedor, anioActual, mesActual]);

    if (results.length === 0) {
      res.status(404).json({ message: 'Productos no encontrados' });
    } else {
      res.json(results);
    }
  } catch (error) {
    console.error('Error en la consulta:', error);
    res.status(500).json({ message: 'Error en la consulta' });
  }
});

//Tienda

app.post('/nueva-compra', async (req, res) => {
  const { idUsuario, idProducto, cantidad_producto, idTalla, precio } = req.body;
  const fechaCompra = new Date().toISOString().slice(0, 10); // Obtener la fecha actual en formato YYYY-MM-DD
  let existencias = 0;
  let success = false;
  

const queryconsulta = 'SELECT  i.existencias FROM inventario i JOIN producto p ON p.idProducto = i.idProducto WHERE p.idProducto = ? AND i.idTalla = ?'
try {
  const [results] = await connection.execute(queryconsulta, [idProducto, idTalla]);
  console.log(results[0].existencias);

   existencias = results[0].existencias;

  if (results.length === 0) {
    return res.status(404).json({ message: 'No se encontraron compras' });
  }

  if (existencias > 0) {
    const query = 'INSERT INTO compra (idUsuario, idProducto, cantidad_producto, fecha_compra, idTalla, precio, entregado) VALUES (?, ?, ?, ?, ?, ?, ?)';
    await connection.query(query, [idUsuario, idProducto, cantidad_producto, fechaCompra , idTalla, precio, false], (error, results) => {
      if (error) {
        res.status(400).json({ message: error.message });
        console.log("se insertó con exito");
      } else {
        success = true;
        console.log("se insertó con exito");
  }});
  }
  if (success = true ){
    const queryUpdate = 'UPDATE inventario AS i JOIN producto AS p ON p.idProducto = i.idProducto SET i.existencias = i.existencias - ? WHERE p.idProducto = ? AND i.idTalla = ?;'
        await connection.query(queryUpdate, [cantidad_producto, idProducto , idTalla], (error, results) => {
          if (error) {
            res.status(400).json({ message: error.message });
          } else {
            success = true;
            console.log("se actualizó con exito");
      }});
  }
  
  res.json(results);
} catch (error) {
  console.error('Error al obtener las compras:', error);
  res.status(500).json({ message: error.message });
}

});


//Cupones - Pedro
// Obtener todos los cupones
app.get('/cupones', async (req, res) => {
  const query = 'SELECT * FROM cupones';
  try {
    // Ejecutar la consulta de forma asincrónica
    const [results] = await connection.execute(query);

    // Convertir status numérico a texto
    const mappedResults = results.map(cupon => ({
      ...cupon,
      status: cupon.status === 1 ? 'activo' : 'inactivo'
    }));

    res.json(mappedResults);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener un cupón por ID
app.get('/cupones/:id', async (req, res) => {
  const query = 'SELECT * FROM cupones WHERE idCupon = ?';

  try {
    // Ejecutar la consulta de forma asincrónica
    const [results] = await connection.execute(query, [req.params.id]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'Cupón no encontrado' });
    }

    const cupon = results[0];
    res.json({
      ...cupon,
      status: cupon.status === 1 ? 'activo' : 'inactivo'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Agregar un nuevo cupón
app.post('/cupones-nuevo', async (req, res) => {
  const { idUsuario, cupon, descripcion, fechaRegistro, vigencia, status } = req.body;

  // Asegurarse de que `status` es un número entero
  const statusValue = parseInt(status, 10);

  if (isNaN(statusValue)) {
    return res.status(400).json({ message: 'Estado inválido' });
  }

  // Formatear las fechas al formato 'YYYY-MM-DD'
  const formattedFechaRegistro = new Date(fechaRegistro).toISOString().split('T')[0];
  const formattedVigencia = new Date(vigencia).toISOString().split('T')[0];

  const query = `
    INSERT INTO cupones (idUsuario, cupon, descripcion, fechaRegistro, vigencia, status)
    VALUES (?, ?, ?, ?, ?, ?)`;

  try {
    // Ejecutar la inserción de forma asincrónica
    const [results] = await connection.execute(query, [idUsuario, cupon, descripcion, formattedFechaRegistro, formattedVigencia, statusValue]);

    // Retornar la respuesta con el nuevo cupón creado
    res.status(201).json({
      idCupon: results.insertId,
      idUsuario,
      cupon,
      descripcion,
      fechaRegistro: formattedFechaRegistro,
      vigencia: formattedVigencia,
      status: statusValue
    });
  } catch (error) {
    console.error('Error en la consulta de inserción:', error);
    res.status(500).json({ message: error.message });
  }
});

// Actualizar un cupón
app.put('/cupones/:id', async (req, res) => {
  const { cupon, descripcion, fechaRegistro, vigencia, status } = req.body;
  const { id } = req.params;

  // Convertir `status` a número
  const statusValue = parseInt(status, 10);

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

  try {
    // Ejecuta la actualización de forma asincrónica
    const [results] = await connection.execute(query, [cupon, descripcion, formattedFechaRegistro, formattedVigencia, statusValue, id]);

    // Verificar si el cupón fue encontrado y actualizado
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Cupón no encontrado' });
    }

    // Devolver los datos actualizados
    res.json({
      idCupon: id,
      cupon,
      descripcion,
      fechaRegistro: formattedFechaRegistro,
      vigencia: formattedVigencia,
      status: statusValue
    });
  } catch (error) {
    console.error('Error en la consulta de actualización:', error);
    res.status(500).json({ message: error.message });
  }
});

// cupones  por us
app.get('/cuponesxus/:idVendedor', async (req, res) => {
  const { idVendedor } = req.params; // Obtener idVendedor desde los parámetros de la URL

  const query = 'SELECT * FROM cupones WHERE idVendedor = ?';

  try {
    // Ejecuta la consulta directamente con connection.execute, que soporta promesas
    const [results] = await connection.execute(query, [idVendedor]);

    // Convertir status numérico a texto
    const mappedResults = results.map(cupon => ({
      ...cupon,
      status: cupon.status === 1 ? 'activo' : 'inactivo'
    }));

    // Enviar los resultados mapeados como respuesta
    res.json(mappedResults);
  } catch (error) {
    console.error('Error en la consulta:', error); // Log del error
    res.status(500).json({ message: error.message });
  }
});

// Eliminar un cupón
app.delete('/cupones/:id', async (req, res) => {
  const query = 'DELETE FROM cupones WHERE idCupon = ?';

  try {
    // Ejecutar la consulta de forma asincrónica
    const [results] = await connection.execute(query, [req.params.id]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Cupón no encontrado' });
    }

    res.json({ message: 'Cupón eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//END Cupones - Pedro

//Ofertas - Pedro
//Obtener todos los ofertas
app.get('/ofertas', async (req, res) => {
  const query = 'SELECT * FROM ofertas';
  try {
    const [results] = await connection.execute(query); // Usar execute para la consulta
    // Convertir status numérico a texto
    const mappedResults = results.map(oferta => ({
      ...oferta,
      status: oferta.status === 1 ? 'activo' : 'inactivo'
    }));
    res.json(mappedResults);
  } catch (error) {
    res.status(500).json({ message: error.message }); // Manejo de errores
  }
});

// Agregar un nuevo cupón
app.post('/ofertas-nuevo', async (req, res) => {
  const { oferta, descripcion, fechaRegistro, vigencia, status, idUsuario } = req.body; // Asegúrate de incluir idUsuario

  // Asegurarse de que status es un número entero
  const statusValue = parseInt(status, 10);

  if (isNaN(statusValue)) {
    return res.status(400).json({ message: 'Estado inválido' });
  }

  const formattedFechaRegistro = new Date(fechaRegistro).toISOString().split('T')[0];
  const formattedVigencia = new Date(vigencia).toISOString().split('T')[0];

  const query = `
    INSERT INTO ofertas (oferta, descripcion, fechaRegistro, vigencia, status, idUsuario)  -- Incluye idUsuario
    VALUES (?, ?, ?, ?, ?, ?)`;

  try {
    const [results] = await connection.execute(query, [oferta, descripcion, formattedFechaRegistro, formattedVigencia, statusValue, idUsuario]);

    res.status(201).json({
      idOferta: results.insertId,
      oferta,
      descripcion,
      fechaRegistro: formattedFechaRegistro,
      vigencia: formattedVigencia,
      status: statusValue
    });
  } catch (error) {
    console.error('Error en la consulta de inserción:', error);
    res.status(400).json({ message: error.message });
  }
});


// Banckend para las suscripciones, crud y compra 
// Ruta para obtener las suscripciones
app.get('/suscripciones', async (req, res) => {
  const query = 'SELECT * FROM suscripcion';

  try {
    const [results] = await connection.execute(query);

    const suscripciones = results.map(suscripcion => {
      let beneficios = [];

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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ruta para agregar una nueva suscripción
app.post('/suscripcion', async (req, res) => {
  const { nombre_sub, descripcion_sub, duracion_sub, precio_sub, beneficios } = req.body;

  // Validar que los campos necesarios estén presentes
  if (!nombre_sub || !descripcion_sub || !duracion_sub || !precio_sub || !beneficios) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  // Validar que precio_sub es un número
  const precioNumber = parseFloat(precio_sub);
  if (isNaN(precioNumber) || precioNumber <= 0) {
    return res.status(400).json({ error: 'El precio debe ser un número válido y mayor que cero.' });
  }

  const query = `
    INSERT INTO suscripcion (nombre_sub, descripcion_sub, duracion_sub, precio_sub, beneficios)
    VALUES (?, ?, ?, ?, ?)`;

  try {
    // Ejecutar la consulta a la base de datos
    const [results] = await connection.execute(query, [nombre_sub, descripcion_sub, duracion_sub, precioNumber, JSON.stringify(beneficios)]);

    // Retornar una respuesta exitosa con el ID de la nueva suscripción
    res.status(201).json({
      message: 'Suscripción agregada con éxito',
      idSuscripcion: results.insertId
    });
  } catch (err) {
    console.error('Error en la consulta:', err);
    res.status(500).json({ error: 'Error al agregar la suscripción. Intente nuevamente.' });
  }
});

// Ruta para obtener una suscripción por ID
app.get('/api/suscripcion/:id_sub', async (req, res) => {
  const { id_sub } = req.params;

  const query = 'SELECT * FROM suscripcion WHERE id_sub = ?';

  try {
    // Ejecutar la consulta a la base de datos
    const [results] = await connection.execute(query, [id_sub]);

    // Verificar si se encontraron resultados
    if (results.length === 0) {
      return res.status(404).json({ message: 'Suscripción no encontrada' });
    }

    // Retornar el primer resultado
    res.json(results[0]);
  } catch (err) {
    console.error('Error al obtener la suscripción:', err);
    res.status(500).json({ error: err.message });
  }
});

// Ruta para actualizar una suscripción por ID
app.put('/api/suscripcion/:id_sub', async (req, res) => {
  const { id_sub } = req.params;
  const { nombre_sub, descripcion_sub, duracion_sub, precio_sub, beneficios } = req.body;

  try {
    // Asegúrate de que los beneficios estén correctamente formateados como una cadena JSON
    const beneficiosJson = JSON.stringify(beneficios);
    const query = 'UPDATE suscripcion SET nombre_sub = ?, descripcion_sub = ?, duracion_sub = ?, precio_sub = ?, beneficios = ? WHERE id_sub = ?';

    // Ejecutar la consulta utilizando el método execute
    const [results] = await connection.execute(query, [nombre_sub, descripcion_sub, duracion_sub, precio_sub, beneficiosJson, id_sub]);

    // Verificar si se afectaron filas (es decir, si se actualizó la suscripción)
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Suscripción no encontrada' });
    }

    // Enviar respuesta de éxito
    res.json({ message: 'Suscripción actualizada exitosamente' });
  } catch (error) {
    // Manejo de errores, especialmente con los beneficios
    console.error('Error al procesar los beneficios:', error);
    res.status(500).json({ error: 'Error al procesar los beneficios o actualizar la suscripción.' });
  }
});

// Ruta para eliminar una suscripción
app.delete('/suscripcion/:id_sub', async (req, res) => {
  const { id_sub } = req.params;

  try {
    const query = 'DELETE FROM suscripcion WHERE id_sub = ?';
    // Ejecutar la consulta de eliminación de forma asincrónica
    const [results] = await connection.execute(query, [id_sub]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Suscripción no encontrada' });
    }

    // Responder con un código 204 indicando que la eliminación fue exitosa y no hay contenido
    res.sendStatus(204);
  } catch (error) {
    console.error('Error al eliminar la suscripción:', error);
    res.status(500).json({ error: 'Error al eliminar la suscripción. Intente nuevamente.' });
  }
});

// Ruta para comprar una suscripción
app.post('/comprar-suscripcion', async (req, res) => {
  const { idUsuario, id_sub } = req.body;

  try {
    // Verificar si la suscripción existe
    const [suscripcionResults] = await connection.execute('SELECT * FROM suscripcion WHERE id_sub = ?', [id_sub]);

    if (suscripcionResults.length === 0) {
      return res.status(404).json({ error: 'Suscripción no encontrada' });
    }

    const suscripcion = suscripcionResults[0];

    // Actualizar el rol del usuario
    await connection.execute('UPDATE usuario SET idRol = ? WHERE idUsuario = ?', [id_sub, idUsuario]);

    // Calcular la fecha de fin de la suscripción
    const fechaFin = new Date(Date.now() + suscripcion.duracion_sub * 24 * 60 * 60 * 1000);

    // Guardar la suscripción del usuario
    await connection.execute('INSERT INTO usuarioxsub (idUsuario, id_sub, fecha_inicio, fecha_fin) VALUES (?, ?, NOW(), ?)', [idUsuario, id_sub, fechaFin]);

    // Responder con éxito
    res.status(201).json({ message: 'Suscripción realizada con éxito' });

  } catch (err) {
    console.error('Error al realizar la compra de suscripción:', err);
    res.status(500).json({ error: 'Error al procesar la suscripción. Intente nuevamente.' });
  }
});
//Termino el backend para las suscripciones

// Ruta para obtener las temporadas
app.get('/temporada', async (req, res) => {
  try {
    const [results] = await connection.execute('SELECT * FROM temporada'); // Cambiado a execute
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message }); // Manejo de errores
  }
});

// Ruta para obtener usuarios con rol específico
app.get('/usuariogetidrol', async (req, res) => { // Agregando async aquí
  const query = 'SELECT * FROM usuario WHERE idRol = 3';
  try {
    const [results] = await connection.execute(query); // Cambiado a execute
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios', error: error.message }); // Manejo de errores
  }
});

// Endpoint para guardar un producto en la tabla
app.post('/guardar-favorito', async (req, res) => {
  const { idProducto, idUsuario } = req.body;

  // Asegúrate de que los valores se envían correctamente
  if (!idProducto || !idUsuario) {
    return res.status(400).json({ error: 'idProducto y idUsuario son requeridos' });
  }

  try {
    // Consulta para insertar el nuevo favorito
    const query = 'INSERT INTO producto_fav (idProducto, idUsuario, fecha_reg) VALUES (?, ?, NOW())';

    // Ejecutar la consulta de inserción
    const [results] = await connection.execute(query, [idProducto, idUsuario]);

    // Responder con éxito
    res.status(201).json({ message: 'Favorito guardado con éxito', id: results.insertId });

  } catch (err) {
    console.error('Error al guardar el favorito:', err);
    res.status(500).json({ error: 'Error al guardar el favorito' });
  }
});

// Endpoint para obtener los favoritos
app.get('/favoritos/:idUsuario', async (req, res) => {
  const { idUsuario } = req.params;

  try {
    const query = 'SELECT idProducto FROM producto_fav WHERE idUsuario = ?';

    // Ejecutar la consulta de selección
    const [results] = await connection.execute(query, [idUsuario]);

    // Responder con los resultados
    res.status(200).json(results);

  } catch (err) {
    console.error('Error retrieving favorites:', err);
    res.status(500).json({ error: 'Error al obtener los favoritos' });
  }
});

// Ruta para eliminar de favoritos
app.delete('/favoritosdelete/:idUsuario/:idProducto', async (req, res) => {
  const { idUsuario, idProducto } = req.params;

  try {
    // Consulta para eliminar el favorito
    const query = 'DELETE FROM producto_fav WHERE idUsuario = ? AND idProducto = ?';

    // Ejecutar la consulta de eliminación
    const [results] = await connection.execute(query, [idUsuario, idProducto]);

    // Si no se encontró el favorito a eliminar
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Favorito no encontrado' });
    }

    // Si se eliminó correctamente
    res.sendStatus(204); // No content

  } catch (err) {
    console.error('Error deleting favorite:', err);
    res.status(500).json({ error: 'Error al eliminar el favorito' });
  }
});

// Obtener comentarios por ID de producto
app.get('/comentarios/:idProducto', async (req, res) => {
  const query = `
    SELECT c.*, u.nombre, u.email 
    FROM comentarios c 
    JOIN usuario u ON c.idUsuario = u.idUsuario 
    WHERE c.idProducto = ?`;

  try {
    const [results] = await connection.execute(query, [req.params.idProducto]);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Agregar un comentario
app.post('/comentarios', async (req, res) => {
  const { idUsuario, idProducto, comentario, valoracion } = req.body;
  const query = 'INSERT INTO comentarios (idUsuario, idProducto, comentario, fecha, valoracion) VALUES (?, ?, ?, NOW(), ?)';
  try {
    const [results] = await connection.execute(query, [idUsuario, idProducto, comentario, valoracion]);
    res.json({
      idComentario: results.insertId,
      idUsuario,
      idProducto,
      comentario,
      fecha: new Date(),
      valoracion
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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

app.post('/registro-vendedor', async (req, res) => {
  const { nom_empresa, direccion, telefono, pais, estado, codigo_postal, rfc, idUsuario, id_sub } = req.body;

  console.log(req.body); // Verifica los datos recibidos

  try {
    // Obtén el idRol asociado a la suscripción
    const suscripcionQuery = 'SELECT idRol FROM suscripcion WHERE id_sub = ?';
    const [suscripcionResults] = await connection.execute(suscripcionQuery, [id_sub]);

    if (suscripcionResults.length === 0) {
      return res.status(400).send('Suscripción no encontrada.');
    }

    const idRol = suscripcionResults[0].idRol;
    const fechaRegistro = new Date(); // Nueva línea para obtener la fecha actual

    // Inserta el vendedor
    const insertQuery = 'INSERT INTO vendedor (nom_empresa, direccion, telefono, pais, estado, codigo_postal, rfc, idUsuario, idRol, id_sub, fecha_registro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const [insertResult] = await connection.execute(insertQuery, [nom_empresa, direccion, telefono, pais, estado, codigo_postal, rfc, idUsuario, idRol, id_sub, fechaRegistro]);

    // Actualiza el idRol del usuario
    const updateQuery = 'UPDATE usuario SET idRol = ? WHERE idUsuario = ?';
    await connection.execute(updateQuery, [idRol, idUsuario]);

    res.status(201).send('Vendedor registrado y rol actualizado.');
  } catch (err) {
    console.error('Error al registrar el vendedor:', err.message);
    res.status(500).send('Error al registrar el vendedor o actualizar el rol del usuario.');
  }
});

// Ruta para obtener el perfil del vendedor
app.get('/vendedor/:idUsuario', async (req, res) => {
  const { idUsuario } = req.params;

  const query = 'SELECT * FROM vendedor WHERE idUsuario = ?';

  try {
    const [results] = await connection.execute(query, [idUsuario]);

    if (results.length === 0) {
      return res.status(404).send('Vendedor no encontrado');
    }

    res.send(results[0]);
  } catch (error) {
    console.error('Error al obtener el vendedor:', error);
    res.status(500).send('Error en el servidor');
  }
});

app.get('/all-vendedor', async (req, res) => {
  const query = 'SELECT * FROM vendedor';

  try {
    const [results] = await connection.execute(query);
    res.send(results);
  } catch (error) {
    console.error('Error al obtener los vendedores:', error);
    res.status(500).send('Error en el servidor');
  }
});

// Ruta para verificar si el vendedor tiene una empresa
app.get('/empresa/verificar/:idUsuario', async (req, res) => {
  const { idUsuario } = req.params;

  try {
    const [results] = await connection.execute('SELECT * FROM vendedor WHERE idUsuario = ?', [idUsuario]);

    if (results.length > 0) {
      res.json({ existe: true, vendedor: results[0] }); // Si existe, devuelve el vendedor
    } else {
      res.json({ existe: false }); // Si no existe, devuelve false
    }
  } catch (error) {
    console.error('Error al verificar el vendedor:', error);
    res.status(500).send('Error en el servidor');
  }
});

// Endpoint para obtener el id_sub basado en idRol
app.get('/suscripcion/:idRol', async (req, res) => {
  const rolId = req.params.idRol;

  try {
    const [results] = await connection.execute('SELECT id_sub, idRol FROM suscripcion WHERE idRol = ?', [rolId]);

    if (results.length === 0) {
      return res.status(404).send('Suscripción no encontrada');
    }

    res.json(results[0]); // Devuelve el primer resultado
  } catch (error) {
    console.error('Error en la consulta de suscripción:', error);
    res.status(500).send('Error en la consulta de suscripción');
  }
});

app.get('/suscripciones-activas/:idUsuario', async (req, res) => {
  const { idUsuario } = req.params;

  try {
    const [results] = await connection.execute('SELECT COUNT(*) AS totalSuscripciones FROM vendedor WHERE idUsuario = ?', [idUsuario]);

    res.json({ totalSuscripciones: results[0].totalSuscripciones });
  } catch (err) {
    console.error('Error en la consulta:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/puntos-fidelidad/:idUsuario', async (req, res) => {
  const { idUsuario } = req.params;

  try {
    const [results] = await connection.execute('SELECT SUM(puntos) AS totalPuntos FROM puntos_fidelidad WHERE idUsuario = ?', [idUsuario]);

    res.json({ totalPuntos: results[0].totalPuntos || 0 });
  } catch (error) {
    console.error('Error en la consulta de puntos fidelidad:', error);
    res.status(500).json({ message: error.message });
  }
});

app.put('/vendedor/:idVendedor', async (req, res) => {
  const { idVendedor } = req.params;
  const { nom_empresa, telefono, direccion, codigo_postal, pais, estado, rfc } = req.body;

  const query = `
    UPDATE vendedor 
    SET nom_empresa = ?, telefono = ?, direccion = ?, codigo_postal = ?, pais = ?, estado = ?, rfc = ? 
    WHERE idVendedor = ?
  `;

  try {
    const [results] = await connection.execute(query, [nom_empresa, telefono, direccion, codigo_postal, pais, estado, rfc, idVendedor]);

    // Verificamos si la actualización afectó alguna fila
    if (results.affectedRows > 0) {
      res.json({ message: 'Vendedor actualizado exitosamente' });
    } else {
      res.status(404).json({ message: 'Vendedor no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar el vendedor:', error);
    res.status(500).json({ message: 'Error al actualizar el vendedor' });
  }
});

/* 
app.post('/compras', async (req, res) => {
  // lógica para registrar la compra
  // luego verifica la cantidad de compras
  const { idUsuario } = req.body;

  const compras = await connection.query('SELECT COUNT(*) AS totalCompras FROM compra WHERE idUsuario = ?', [idUsuario]);
  if (compras[0].totalCompras >= 5) {
    // Otorgar puntos
    await connection.query('INSERT INTO puntos_fidelidad (idUsuario, puntos, fecha) VALUES (?, ?, ?)', [idUsuario, 10, new Date()]);
  }
});
 */

app.get('/cuponesvigentes/:idUsuario', async (req, res) => {
  const { idUsuario } = req.params;

  const query = `
    SELECT * 
    FROM cupones 
    JOIN cuponxusuario ON cupones.idCupon = cuponxusuario.idCupon
    WHERE cuponxusuario.idUsuario = ?
  `;

  try {
    const [results] = await connection.execute(query, [idUsuario]);

    res.json(results);
  } catch (error) {
    console.error('Error al obtener los cupones vigentes:', error);
    res.status(500).json({ message: error.message });
  }
});

// Endpoint para obtener productos por cupón 
app.get('/aplicar-cupon/:idVendedor', async (req, res) => {
  const { idVendedor } = req.params; // Extraer idVendedor de los parámetros de la ruta

  const query = `
    SELECT producto.*, cupones.idVendedor
    FROM cupones
    JOIN producto ON producto.idVendedor = cupones.idVendedor
    WHERE cupones.idVendedor = ?;
  `;

  try {
    const [results] = await connection.execute(query, [idVendedor]);

    if (results.length === 0) {
      return res.status(404).send('Productos no encontrados');
    }

    res.json(results); // Devuelve los productos encontrados
  } catch (error) {
    console.error('Error en la consulta de productos:', error);
    res.status(500).send('Error en la consulta de productos');
  }
});

// Ruta para obtener el inventario por idProducto
app.get('/registros/:id', async (req, res) => {
  const idProducto = req.params.id;
  // console.log('idProducto recibido:', idProducto); // Verifica el id recibido

  const query = `
      SELECT 
          i.idProducto,
          i.idTalla,
          i.Existencias,
          i.precio,
          i.idOferta,
          o.oferta AS porcentaje_descuento
      FROM 
          inventario i
      LEFT JOIN 
          ofertas o ON i.idOferta = o.idOferta
      WHERE 
          i.idProducto = ?;`;

  try {
    const [results] = await connection.execute(query, [idProducto]);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/registros/:id', upload.array('foto', 4), async (req, res) => { 
  const { idProducto, IdVendedor, Marca, producto, sku, descripcion, fecha_ingreso, idTemporada, porcentaje_descuento, idTalla, Talla, precio } = req.body;

  let foto = '';
  if (req.files && req.files.length > 0) {
    foto = req.files.map(file => file.filename).join(','); // Une los nombres de los archivos con comas
  }

  const updateQuery = foto
    ? 'UPDATE producto SET sku = ?, producto = ?, Marca = ?, descripcion = ?, foto = ? WHERE idProducto = ?'
    : 'UPDATE producto SET sku = ?, producto = ?, Marca = ?, descripcion = ? WHERE idProducto = ?';

  const queryParams = foto
    ? [producto, sku, Marca, descripcion, foto, req.params.id]
    : [producto, sku, Marca, descripcion, req.params.id];

  try {
    const [results] = await connection.execute(updateQuery, queryParams);

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ message: error.message });
  }
  
  try {
    const registros = JSON.parse(req.body.registros); // Asegúrate de enviar `registros` en JSON

    // Eliminar todos los registros previos del inventario para el producto especificado
    const deleteInventoryQuery = `DELETE FROM inventario WHERE idProducto = ?`;
    await connection.execute(deleteInventoryQuery, [req.params.id]);

    // Insertar los nuevos registros de inventario
    const insertInventoryQuery = `INSERT INTO inventario (idProducto, idTalla, Existencias, precio, idOferta) VALUES (?, ?, ?, ?, ?)`;

    for (const registro of registros) {
      const { idTalla, Existencias, precio, idOferta } = registro;
      const queryParamsInventario = [req.params.id, idTalla, Existencias, precio, idOferta];

      await connection.execute(insertInventoryQuery, queryParamsInventario);
    }

    // Enviar una sola respuesta después de actualizar todo
    res.json({ id: req.params.id, producto, sku, Marca, descripcion, foto });
    console.log("Inventario actualizado con éxito");

  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});



//#region DATOS PERFIL VENDEDOR
app.get('/total-compras/:idUsuario', async (req, res) => {
  const idUsuario = req.params.idUsuario;

  const query = `
      SELECT 
          COUNT(compra.idCompra) AS total_compras
      FROM 
          compra
      JOIN 
          producto ON compra.idProducto = producto.idProducto
      JOIN 
          inventario ON inventario.idProducto = producto.idProducto
      JOIN 
          tallas ON tallas.idTalla = inventario.idTalla
      JOIN 
          usuario ON compra.idUsuario = usuario.idUsuario
      WHERE 
          compra.idUsuario = ?;
  `;

  try {
    const [results] = await connection.execute(query, [idUsuario]);
    res.json(results);  // Retorna el total de compras
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/suscripcionname/:idUsuario', async (req, res) => {
  const idUsuario = req.params.idUsuario;
  
  const query = `
     select nombre_sub from suscripcion
JOIN usuarioxsub on usuarioxsub.id_sub = suscripcion.id_sub
where idUsuario = ?`;

  try {
    const [results] = await connection.execute(query, [idUsuario]);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/total-clientes/:idVendedor', async (req, res) => {
  const idVendedor = req.params.idVendedor; // El id del usuario logueado

  const query = `
    SELECT 
        COUNT(DISTINCT compra.idUsuario) AS total_clientes
    FROM 
        compra
    JOIN 
        producto ON compra.idProducto = producto.idProducto
    JOIN 
        inventario ON inventario.idProducto = producto.idProducto
    JOIN 
        usuario ON compra.idUsuario = usuario.idUsuario
    WHERE 
        producto.idVendedor = ?;
  `;

  try {
    const [results] = await connection.execute(query, [idVendedor]);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//#endregion


app.listen(3001, () => {
  console.log(`Server is running on port: ${port}`);
});
