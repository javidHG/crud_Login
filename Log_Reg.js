import React from 'react';
import Register from './Register';
import Login from './Login';

const App = () => {
    return (
        <div>
            <h1>Registro</h1>
            <Register />
            <h1>Inicio de sesión</h1>
            <Login />
        </div>
    );
};

export default App;
