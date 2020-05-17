import React, { useState } from 'react';
import {Link} from 'react-router-dom'
import Main from '../Components/Main'

export default function Login({login, mostrarError}){

    const [emailYPassword, setemailYPassword] = useState({
        email: '',
        
        password: '',
        
    })


    function handleInputChange(e) {
        setemailYPassword({
            ...emailYPassword,
            [e.target.name]: e.target.value
        })

    }

    async function handleSubmit(e){
        e.preventDefault();

        try{
            await login(emailYPassword.email, emailYPassword.password)

        }catch(error){
            mostrarError(error.response.data);
            console.log(error);

        }

    }


    return (
        <Main center>
            <div className="FormContainer">
                <h1 className="Form__titulo">Geekstagram</h1>
                <div>
                    <form onSubmit={handleSubmit}>
                    <input type="email" name="email" placeholder="Email" className="Form__field"  onChange={handleInputChange} value={emailYPassword.email} required/>
                    <input type="password" name="password" placeholder="Contraseña" className="Form__field"  onChange={handleInputChange} value={emailYPassword.password}required />
                    <button className="Form__submit" type="submit">Iniciar sesión</button>
                    <p className="FormContainer__info"> No tienes cuenta?<Link to="/signup">Registrarse</Link></p>

                    </form>
                </div>
            </div>

        </Main>
    )
}