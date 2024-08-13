const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());  // bodyParser.json() es equivalente a express.json()

// Configuración de la base de datos
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Javid212416",
    database: "proyecto_citas"
});

db.connect(err => {
    if (err) throw err;
    console.log("Conectado a la base de datos");
});

// Ruta para crear una cita
app.post("/create", (req, res) => {
    const { especialidad, fecha, doctor, centro } = req.body;

    db.query('INSERT INTO agendas(especialidad, fecha, doctor, centro) VALUES (?,?,?,?)',
        [especialidad, fecha, doctor, centro],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error al registrar la cita");
            } else {
                res.send(result);
            }
        }
    );
});

// Ruta para obtener todas las agendas
app.get("/agendas", (req, res) => {
    db.query('SELECT * FROM agendas',
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error al obtener las agendas");
            } else {
                res.send(result);
            }
        }
    );
});

// Ruta para actualizar una cita
app.put("/update", (req, res) => {
    const { id, especialidad, fecha, doctor, centro } = req.body;

    db.query(
        'UPDATE agendas SET especialidad=?, fecha=?, doctor=?, centro=? WHERE id =?',
        [especialidad, fecha, doctor, centro, id],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error al actualizar la cita");
            } else {
                res.send(result);
            }
        }
    );
});

// Ruta para eliminar una cita
app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;

    db.query('DELETE FROM agendas WHERE id =?', id,
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

// Ruta de registro de usuario
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).json({ error: err });
        db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.status(201).json({ message: 'Usuario registrado' });
        });
    });
});

// Ruta de inicio de sesión
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length === 0) return res.status(401).json({ message: 'Credenciales inválidas' });

        bcrypt.compare(password, results[0].password, (err, isMatch) => {
            if (err) return res.status(500).json({ error: err });
            if (!isMatch) return res.status(401).json({ message: 'Credenciales inválidas' });

            const token = jwt.sign({ id: results[0].id }, 'secret_key', { expiresIn: '1h' });
            res.json({ token });
        });
    });
});

// Configuración del puerto
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor en el puerto ${PORT}`);
});
