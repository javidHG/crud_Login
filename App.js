import React, { useState, useEffect } from "react";
import "./App.css";
import Axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import Register from "./Register";
import Login from "./Login";

function App() {
  const [especialidad, setEspecialidad] = useState("");
  const [fecha, setFecha] = useState("");
  const [doctor, setDoctor] = useState("");
  const [centro, setCentro] = useState("");
  const [agendasList, setAgendas] = useState([]);
  const [id, setId] = useState(null);
  const [editar, setEditar] = useState(false);
  const [autenticado, setAutenticado] = useState(false); // Estado para el control de autenticación

  // Las funciones de CRUD como add, update, deleteCita, etc. se mantienen igual
  const add = () => {
    const formattedFecha = fecha.split("T")[0];
    Axios.post("http://localhost:3001/create", {
      especialidad,
      fecha: formattedFecha,
      doctor,
      centro,
    }).then(() => {
      getAgendas();
      limpiarCampos();
      Swal.fire({
        title: "<strong>Registro exitoso</strong>",
        html: "<i>La cita a sido registrada con exito</i>",
        icon: "success",
      });
    });
  };

  const update = () => {
    const formattedFecha = fecha.split("T")[0];
    Axios.put("http://localhost:3001/update", {
      id,
      especialidad,
      fecha: formattedFecha,
      doctor,
      centro,
    }).then(() => {
      getAgendas();
      limpiarCampos();
      Swal.fire({
        title: "<strong>Registro Actualizado</strong>",
        html: "<i>La cita a sido actualizada con exito</i>",
        icon: "success",
      });
    });
  };

  const deleteCita = (id) => {
    Swal.fire({
      title: "Confirmar eliminación?",
      html: "<i>¿Realmente desea eliminar este registro?</i>",
      text: "No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Sí, eliminar!",
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:3001/delete/${id}`)
          .then(() => {
            getAgendas();
            limpiarCampos();
            Swal.fire("Eliminado", "Registro eliminado", "success");
          })
          .catch((error) => {
            Swal.fire({
              icon: 'error',
              title: 'Oopss..',
              text: 'No se logró eliminar el registro',
              footer: JSON.parse(JSON.stringify(error)).message==="Network Error"?"Intente mas tarde":JSON.parse(JSON.stringify(error)).message
            });
          });
      }
    });
  };

  const limpiarCampos = () => {
    setEspecialidad("");
    setFecha("");
    setDoctor("");
    setCentro("");
    setId("");
    setEditar(false);
  };

  const editarCita = (val) => {
    setEditar(true);
    setEspecialidad(val.especialidad);
    setFecha(val.fecha);
    setDoctor(val.doctor);
    setCentro(val.centro);
    setId(val.id);
  };

  const getAgendas = () => {
    Axios.get("http://localhost:3001/agendas").then((response) => {
      setAgendas(response.data);
    });
  };

  useEffect(() => {
    getAgendas();
  }, []);

  const formatFecha = (fecha) => {
    const opciones = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Intl.DateTimeFormat("es-ES", opciones).format(new Date(fecha));
  };

  const handleLoginSuccess = () => {
    setAutenticado(true); // Actualiza el estado si el login es exitoso
  };

  return (
    <div className="container">
      {autenticado ? (
        <div>
          <div className="card text-center">
            <div className="card-header">
              Gestión de agendamiento de citas médicas
            </div>
            <div className="card-body">
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">
                  Especialidad:
                </span>
                <input
                  type="text"
                  onChange={(event) => setEspecialidad(event.target.value)}
                  className="form-control"
                  value={especialidad}
                  placeholder="Especialidad"
                  aria-label="Especialidad"
                  aria-describedby="basic-addon1"
                />
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">
                  Fecha:
                </span>
                <input
                  type="datetime-local"
                  onChange={(event) => setFecha(event.target.value)}
                  className="form-control"
                  value={fecha}
                  placeholder="Fecha"
                  aria-label="Fecha"
                  aria-describedby="basic-addon1"
                />
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">
                  Doctor:
                </span>
                <input
                  type="text"
                  onChange={(event) => setDoctor(event.target.value)}
                  className="form-control"
                  value={doctor}
                  placeholder="Doctor"
                  aria-label="Doctor"
                  aria-describedby="basic-addon1"
                />
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">
                  Centro médico:
                </span>
                <input
                  type="text"
                  onChange={(event) => setCentro(event.target.value)}
                  className="form-control"
                  value={centro}
                  placeholder="Centro médico"
                  aria-label="Centro médico"
                  aria-describedby="basic-addon1"
                />
              </div>
            </div>

            <div className="card-footer text-body-secondary">
              {editar ? (
                <div>
                  <button className="btn btn-warning m-2" onClick={update}>
                    Actualizar
                  </button>
                  <button className="btn btn-info m-2" onClick={limpiarCampos}>
                    Cancelar
                  </button>
                </div>
              ) : (
                <button className="btn btn-success" onClick={add}>
                  Registrar
                </button>
              )}
            </div>
          </div>

          <table className="table table-striped mt-4">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Especialidad</th>
                <th scope="col">Fecha</th>
                <th scope="col">Doctor</th>
                <th scope="col">Centro</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {agendasList.map((val) => (
                <tr key={val.id}>
                  <th>{val.id}</th>
                  <td>{val.especialidad}</td>
                  <td>{formatFecha(val.fecha)}</td>
                  <td>{val.doctor}</td>
                  <td>{val.centro}</td>
                  <td>
                    <div className="btn-group" role="group">
                      <button
                        type="button"
                        onClick={() => editarCita(val)}
                        className="btn btn-info"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          deleteCita(val.id);
                        }}
                        className="btn btn-danger"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <h1>Registro</h1>
          <Register />
          <h1>Inicio de sesión</h1>
          <Login onLoginSuccess={handleLoginSuccess} />
        </div>
      )}
    </div>
  );
}

export default App;
