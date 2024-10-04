const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require('bcrypt');
const saltRounds = 10;

app.use(cors());
app.use(express.json());

// INDICACIÓN GENERAL DE USO DE BASE DE DATOS
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "12345",
    database: "vinocostero_db"
});

// OPERACIONES DE BASE DE DATOS CON LA TABLA DE "USUARIOS" -----------------------------------------------
// Crear un nuevo usuario con contraseña encriptada
app.post("/create", (req, res) => {
    const { nombre, contrasenia, correo, numero, rol } = req.body;

    // Encriptar la contraseña antes de guardarla
    bcrypt.hash(contrasenia, saltRounds, (err, hash) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error al encriptar la contraseña');
        } else {
            db.query(
                'INSERT INTO usuarios(nombre_usuario, contrasenia, correo_electronico, numero_telefono) VALUES(?,?,?,?)',
                [nombre, hash, correo, numero],
                (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.send(result);
                    }
                }
            );
        }
    });
});

// Obtener registros de usuarios
app.get("/registros", (req, res) => {
    db.query('SELECT * FROM usuarios', (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

// Actualizar un usuario con nueva contraseña encriptada
app.put("/update", (req, res) => {
    const id = req.body.id;
    const nombre = req.body.nombre;
    const contrasenia = req.body.contrasenia;
    const correo = req.body.correo;
    const numero = req.body.numero;

    // Crear la consulta base
    let query = 'UPDATE usuarios SET nombre_usuario=?, correo_electronico=?, numero_telefono=? WHERE id_usuario=?';
    let values = [nombre, correo, numero, id];

    // Si la contraseña fue enviada, actualizarla
    if (contrasenia) {
        query = 'UPDATE usuarios SET nombre_usuario=?, contrasenia=?, correo_electronico=?, numero_telefono=? WHERE id_usuario=?';
        const hashedPassword = bcrypt.hashSync(contrasenia, 10); // Encriptar la nueva contraseña
        values = [nombre, hashedPassword, correo, numero, id];
    }

    db.query(query, values, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

// Eliminar un usuario y sus roles
app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;

    // Iniciar una transacción para asegurar que ambas eliminaciones se realicen correctamente
    db.beginTransaction((err) => {
        if (err) {
            return res.status(500).send({ error: "Error al iniciar la transacción" });
        }

        // Eliminar los roles del usuario
        db.query('DELETE FROM usuario_roles WHERE id_usuario = ?', [id], (err) => {
            if (err) {
                return db.rollback(() => {
                    console.log(err);
                    return res.status(500).send({ error: "Error al eliminar los roles del usuario" });
                });
            }

            // Eliminar el usuario
            db.query('DELETE FROM usuarios WHERE id_usuario = ?', [id], (err, result) => {
                if (err) {
                    return db.rollback(() => {
                        console.log(err);
                        return res.status(500).send({ error: "Error al eliminar el usuario" });
                    });
                }

                // Confirmar la transacción
                db.commit((err) => {
                    if (err) {
                        return db.rollback(() => {
                            console.log(err);
                            return res.status(500).send({ error: "Error al confirmar la transacción" });
                        });
                    }
                    res.send(result); // Responder con el resultado de la eliminación
                });
            });
        });
    });
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Consulta a la base de datos para verificar las credenciales
    db.query("SELECT * FROM usuarios WHERE nombre_usuario = ?", [username], (err, result) => {
        if (err) {
            console.log("Error en la consulta de la base de datos:", err);
            return res.status(500).json({ error: "Error en el servidor al consultar la base de datos" });
        }
        
        // Verificar si el usuario existe
        if (result.length === 0) {
            return res.status(200).json({ authenticated: false, message: "Usuario o Contraseña incorrecta" });
        }

        const usuario = result[0];

        // Comparar la contraseña encriptada
        bcrypt.compare(password, usuario.contrasenia, (err, isMatch) => {
            if (err) {
                console.log("Error al comparar la contraseña:", err);
                return res.status(500).json({ error: "Error al comparar la contraseña" });
            }

            // Verificar si las contraseñas coinciden
            if (isMatch) {
                // Obtener el rol del usuario
                const rolQuery = `
                    SELECT ur.id_rol
                    FROM usuario_roles ur
                    WHERE ur.id_usuario = ?;
                `;

                db.query(rolQuery, [usuario.id_usuario], (err, rolResult) => {
                    if (err) {
                        console.log("Error al obtener el rol del usuario:", err);
                        return res.status(500).json({ error: "Error al obtener el rol del usuario" });
                    }

                    // Verificar si el rol existe
                    if (rolResult.length === 0) {
                        return res.status(200).json({ authenticated: true, message: "Inicio de sesión exitoso", rol: null });
                    }

                    const id_rol = rolResult[0].id_rol;
                    const ip_acceso = req.ip; // Obtener la IP de acceso

                    // Eliminar todos los registros en rol_acceso
                    db.query("DELETE FROM rol_acceso", (err) => {
                        if (err) {
                            console.log("Error al eliminar en rol_acceso:", err);
                            return res.status(500).json({ error: "Error al eliminar el acceso del usuario" });
                        }

                        // Insertar el nuevo registro en rol_acceso
                        db.query("INSERT INTO rol_acceso (ip_acceso, nombre_usuario, id_rol) VALUES (?, ?, ?)", [ip_acceso, usuario.nombre_usuario, id_rol], (err) => {
                            if (err) {
                                console.log("Error al insertar en rol_acceso:", err);
                                return res.status(500).json({ error: "Error al almacenar el acceso del usuario" });
                            }

                            return res.status(200).json({ authenticated: true, message: "Inicio de sesión exitoso", rol: id_rol });
                        });
                    });
                });
            } else {
                return res.status(200).json({ authenticated: false, message: "Usuario o Contraseña incorrecta" });
            }
        });
    });
});

// Identificar Usuarios y sus Roles
app.get('/usuarios', (req, res) => {
    const query = `
      SELECT u.id_usuario, u.nombre_usuario, u.correo_electronico, u.numero_telefono, IFNULL(r.nombre_rol, 'SIN ROL ASIGNADO') AS rol FROM usuarios u LEFT JOIN usuario_roles ur ON u.id_usuario = ur.id_usuario LEFT JOIN roles r ON ur.id_rol = r.id_rol;`;
  
    // Utilizar la variable db para la consulta
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error al obtener los usuarios:', err);
        res.status(500).send('Error en el servidor');
      } else {
        res.json(results);
      }
    });
  });

// Actualizar el rol de un usuario
app.put('/actualizar_rol/:id_usuario', (req, res) => {
    const id_usuario = req.params.id_usuario;
    const { id_rol } = req.body;
  
    console.log(`Actualizando rol para el usuario ID: ${id_usuario} con rol ID: ${id_rol}`);
  
    // Verificar si el rol es válido
    const queryCheckRole = `SELECT * FROM roles WHERE id_rol = ?`;
  
    db.query(queryCheckRole, [id_rol], (err, roleResult) => {
      if (err) {
        console.error('Error al verificar el rol:', err);
        return res.status(500).send('Error en el servidor al verificar el rol');
      } 
  
      if (roleResult.length === 0) {
        console.log(`Rol ID: ${id_rol} no encontrado`);
        return res.status(400).send('El rol especificado no es válido');
      }
  
      // Si el rol es válido, actualiza el rol del usuario
      const queryUpdateRole = `
        INSERT INTO usuario_roles (id_usuario, id_rol) 
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE id_rol = VALUES(id_rol);`;
  
      db.query(queryUpdateRole, [id_usuario, id_rol], (err, result) => {
        if (err) {
          console.error('Error al actualizar el rol del usuario:', err);
          res.status(500).send('Error en el servidor al actualizar el rol');
        } else {
          console.log(`Rol actualizado correctamente para el usuario ID: ${id_usuario}, nuevo rol ID: ${id_rol}`);
          res.send('Rol actualizado correctamente');
        }
      });
    });
  });

// Endpoint para obtener el rol de acceso del usuario
app.get('/rol-acceso', (req, res) => {
    const query = "SELECT id_rol FROM rol_acceso LIMIT 1"; // Obtener solo un registro, puedes ajustar según tus necesidades

    db.query(query, (err, result) => {
        if (err) {
            // Mensaje de error en la terminal
            console.error("Error al obtener el rol de acceso:", err);
            return res.status(500).json({ error: "Error al obtener el rol de acceso" });
        }

        // Verificar si se encontró el rol
        if (result.length === 0) {
            return res.status(200).json({ rol: null }); // Devolver null si no se encontró el rol
        }

        const id_rol = result[0].id_rol; // Obtener el id_rol de la primera fila
        return res.status(200).json({ rol: id_rol }); // Devolver el rol encontrado
    });
});

// OPERACIONES DE BASE DE DATOS CON LA TABLA DE "PRODUCCION_VINOS" -----------------------------------------------

// Crear un nuevo registro de producción de vinos
app.post("/createProduccion", (req, res) => {
    const { nombre_vino, tipo_vino, cantidad_producida, fecha_produccion, estado_lote, descripcion, precio_unitario } = req.body;

    // Convertir fecha_produccion al formato YYYY-MM-DD
    const formattedDate = new Date(fecha_produccion).toISOString().split('T')[0];

    db.query(
        'INSERT INTO produccion_vinos (nombre_vino, tipo_vino, cantidad_producida, fecha_produccion, estado_lote, descripcion, precio_unitario) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [nombre_vino, tipo_vino, cantidad_producida, formattedDate, estado_lote, descripcion, precio_unitario],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error al crear el registro");
            } else {
                res.send(result);
            }
        }
    );
});

// Obtener todos los registros de producción de vinos
app.get("/registrosProduccion", (req, res) => {
    db.query('SELECT * FROM produccion_vinos', (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error al obtener los registros");
        } else {
            res.send(result);
        }
    });
});

// Actualizar un registro de producción de vinos
app.put("/updateProduccion", (req, res) => {
    const { id_lote, nombre_vino, tipo_vino, cantidad_producida, fecha_produccion, estado_lote, descripcion, precio_unitario } = req.body;

    // Convertir fecha_produccion al formato YYYY-MM-DD
    const formattedDate = new Date(fecha_produccion).toISOString().split('T')[0];

    db.query(
        'UPDATE produccion_vinos SET nombre_vino=?, tipo_vino=?, cantidad_producida=?, fecha_produccion=?, estado_lote=?, descripcion=?, precio_unitario=? WHERE id_lote=?',
        [nombre_vino, tipo_vino, cantidad_producida, formattedDate, estado_lote, descripcion, precio_unitario, id_lote],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error al actualizar el registro");
            } else {
                res.send(result);
            }
        }
    );
});

// Eliminar un registro de producción de vinos
app.delete("/deleteProduccion/:id_lote", (req, res) => {
    const id_lote = req.params.id_lote;

    db.query('DELETE FROM produccion_vinos WHERE id_lote=?', id_lote, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error al eliminar el registro");
        } else {
            res.send(result);
        }
    });
});

// OPERACIONES DE BASE DE DATOS CON LA TABLA DE "LOTES_PRODUCCION" -----------------------------------------------

app.post("/createLote", (req, res) => {
    const { numero_lote, fecha_inicio, descripcion, cantidad_producida, estado_lote, id_vino } = req.body;

    db.query(
        'INSERT INTO lotes_produccion (numero_lote, fecha_inicio, descripcion, cantidad_producida, estado_lote, id_vino) VALUES (?, ?, ?, ?, ?, ?)',
        [numero_lote, fecha_inicio, descripcion, cantidad_producida, estado_lote, id_vino],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error al crear el lote");
            } else {
                res.send(result);
            }
        }
    );
});

app.get("/lotes", (req, res) => {
    db.query('SELECT * FROM lotes_produccion', (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error al obtener los lotes");
        } else {
            res.send(result);
        }
    });
});

app.put("/updateLote", (req, res) => {
    const { id_lote, numero_lote, fecha_inicio, fecha_fin, estado_lote, descripcion, cantidad_producida, id_vino } = req.body;

    db.query(
        'UPDATE lotes_produccion SET numero_lote = ?, fecha_inicio = ?, fecha_fin = ?, estado_lote = ?, descripcion = ?, cantidad_producida = ?, id_vino = ? WHERE id_lote = ?',
        [numero_lote, fecha_inicio, fecha_fin, estado_lote, descripcion, cantidad_producida, id_vino, id_lote],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error al actualizar el lote");
            } else {
                res.send(result);
            }
        }
    );
});

app.delete("/deleteLote/:id_lote", (req, res) => {
    const id_lote = req.params.id_lote;

    db.query('DELETE FROM lotes_produccion WHERE id_lote = ?', [id_lote], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error al eliminar el lote");
        } else {
            res.send(result);
        }
    });
});

// OPERACIONES DE BASE DE DATOS CON LA TABLA DE "X" -----------------------------------------------

// Crear comprador
app.post("/createComprador", (req, res) => {
    const nombre = req.body.nombre;
    const direccion = req.body.direccion;
    const historial_compras = req.body.historial_compras || '';

    db.query(
        'INSERT INTO compradores(nombre, direccion, historial_compras) VALUES(?, ?, ?)',
        [nombre, direccion, historial_compras],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

// Obtener todos los compradores
app.get("/registrosCompradores", (req, res) => {
    db.query('SELECT * FROM compradores',
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

// Actualizar comprador
app.put("/updateComprador", (req, res) => {
    const id = req.body.id;
    const nombre = req.body.nombre;
    const direccion = req.body.direccion;
    const historial_compras = req.body.historial_compras;

    db.query(
        'UPDATE compradores SET nombre=?, direccion=?, historial_compras=? WHERE id=?',
        [nombre, direccion, historial_compras, id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

// Eliminar comprador
app.delete("/deleteComprador/:id", (req, res) => {
    const id = req.params.id;

    db.query('DELETE FROM compradores WHERE id=?', id,
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});


// OPERACIONES DE BASE DE DATOS CON LA TABLA DE "LOGISTICA_REQUERIMIENTOS" -----------------------------------------------

// Crear requerimiento
app.post("/createRequerimiento", (req, res) => {
    const insumo = req.body.insumo;
    const cantidad = req.body.cantidad;
    const proveedor = req.body.proveedor;

    db.query(
        'INSERT INTO logistica_requerimientos(insumo, cantidad, proveedor) VALUES(?, ?, ?)',
        [insumo, cantidad, proveedor],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

// Obtener todos los requerimientos
app.get("/registrosRequerimientos", (req, res) => {
    db.query('SELECT * FROM logistica_requerimientos',
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

// Actualizar requerimiento
app.put("/updateRequerimiento", (req, res) => {
    const id = req.body.id;
    const insumo = req.body.insumo;
    const cantidad = req.body.cantidad;
    const proveedor = req.body.proveedor;

    db.query(
        'UPDATE logistica_requerimientos SET insumo=?, cantidad=?, proveedor=? WHERE id=?',
        [insumo, cantidad, proveedor, id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

// Eliminar requerimiento
app.delete("/deleteRequerimiento/:id", (req, res) => {
    const id = req.params.id;

    db.query('DELETE FROM logistica_requerimientos WHERE id=?', id,
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});


// OPERACIONES DE BASE DE DATOS CON LA TABLA DE "Análisis de Negocios" -----------------------------------------------

app.get("/analisisVentas", (req, res) => {
    db.query(`SELECT fecha, SUM(total) AS total_ventas FROM ventas GROUP BY fecha ORDER BY fecha ASC`, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error al obtener los datos de ventas");
        }
        res.send(result);
    });
});

app.get("/margenesGanancia", (req, res) => {
    const query = `SELECT DATE(fecha) AS fecha, 
                          SUM(precio * cantidad) - (SELECT SUM(costo) FROM costos WHERE DATE(fecha) = DATE(costo.fecha_produccion)) AS margen_ganancia
                   FROM ventas 
                   GROUP BY DATE(fecha)`;
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error al obtener márgenes de ganancia" });
        }
        res.json(result);
    });
});

// INDICACIÓN DE PUERTO A UTILIZAR
app.listen(3001,()=>{
    console.log("Corriendo en el puerto 3001 FUNCIONA")
})