import React, { useState } from 'react';
import Main from '../Components/Main'
import virus from '../Images/virus.png'
import {Link} from 'react-router-dom'

export default function Signup({signup, mostrarError}) {
    const [usuario, setUsuario] = useState({
        email: '',
        username: '',
        password: '',
        bio: '',
        nombre: ''
    })



    function handleInputChange(e) {
        setUsuario({
            ...usuario,
            [e.target.name]: e.target.value
        })

    }

    async function handleSubmit(e){
        e.preventDefault();

        try{
           await signup(usuario)
            

        }catch(error){
            mostrarError(error.response.date);
            console.log(error);

        }

    }



    return (
        <Main center={true}>
            <div className="Signup">
                <img src={virus} className="Signup__img" alt=""></img>
                <div className="FormContainer">
                    <h1 className="Form__titulo">Geekstagram</h1>
                    <p className="FormContainer__info">
                        Regístrate
                    </p>


                    
                        <form onSubmit={handleSubmit}>
                            <input type="text" name="nombre" placeholder="Nombre y Apellido" className="Form__field" minlenght="3" maxLength="35" required onChange={handleInputChange} value={usuario.nombre} />
                    
                            <input type="text" name="username" placeholder="Nick" className="Form__field" minlenght="3" maxLength="30" required onChange={handleInputChange} value={usuario.username} />
                        
                            <input type="text" name="bio" placeholder="Sobre ti..." className="Form__field" required maxLength="150" onChange={handleInputChange} value={usuario.bio} />
                        
                            <input type="email" name="email" placeholder="Email" className="Form__field" required onChange={handleInputChange} value={usuario.email} />
                       
                            <input type="password" name="password" placeholder="Contraseña" className="Form__field" required onChange={handleInputChange} value={usuario.password} />
                            <button className="Form__submit" type="submit">Registrarse</button>
                        </form>
                        
                        <p className="FormCointainer_info">¿Ya tienes cuenta?<Link to="/login"> Login</Link></p>
                   




                </div>
            </div>
        </Main>
    );
} 