import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa los estilos de Bootstrap

// Componente Login
const Login = ({ onLoginSuccess }) => {
    // Definición de los estados locales para manejar el valor de username y password
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Función que se ejecuta cuando se envía el formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene el comportamiento por defecto del formulario (recarga la página)
        try {
            // Envía los datos de username y password al servidor usando POST
            const response = await axios.post('http://localhost:3001/login', { username, password });
            // Guarda el token recibido en el localStorage
            localStorage.setItem('token', response.data.token);
            alert('Inicio de sesión exitoso'); // Muestra un mensaje de éxito
            onLoginSuccess(); // Llama a la función que notifica que el login fue exitoso
        } catch (err) {
            console.error(err); // Muestra el error en la consola
            alert('Credenciales inválidas'); // Muestra un mensaje de error
        }
    };

    // Renderiza el formulario de inicio de sesión con estilos de Bootstrap
    return (
        <form onSubmit={handleSubmit} className="container mt-5">
            <div className="mb-3">
                <label htmlFor="username" className="form-label">Nombre de usuario</label>
                <input
                    type="text"
                    className="form-control"
                    id="username"
                    placeholder="Nombre de usuario"
                    value={username} // Valor actual del estado username
                    onChange={(e) => setUsername(e.target.value)} // Actualiza el estado username
                />
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Contraseña</label>
                <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Contraseña"
                    value={password} // Valor actual del estado password
                    onChange={(e) => setPassword(e.target.value)} // Actualiza el estado password
                />
            </div>
            <button type="submit" className="btn btn-primary">Iniciar sesión</button>
        </form>
    );
};

export default Login; // Exporta el componente para que pueda ser utilizado en otros lugares
