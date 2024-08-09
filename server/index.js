const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "proyecto_citas"
});

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


app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;

    db.query('DELETE FROM agendas WHERE id =?',id,
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.listen(3001, () => {
    console.log("Corriendo en el puerto 3001");
});
