import React, { useState, useEffect } from 'react';
import Nav from './Components/Nav.js'
import Signup from './Views/ Signup'
import Login from './Views/Login'
import Axios from 'axios'
import { setToken, deleteToken, getToken, initAxiosInterceptors } from './Helpers/auth-helpers'
import Loading from './Components/Loading'
import Main from './Components/Main.js';
 

initAxiosInterceptors(); //cargar token si hay alguno para reconocer usuario


export default function App() {
  const [usuario, setUsuario] = useState(null) // es null porque no sabemos si hay usuario autentificado
 
  const [cargandoUsuario, setCargandoUsuario] = useState(true);
  useEffect(()=>{

    async function cargarUsuario(){

    if(!getToken()){
      setCargandoUsuario(false);
      return;
    }
    try{
      const { data:usuario}= await Axios.get('http://localhost:3001/api/usuarios/whoami');
      setUsuario(usuario);
      setCargandoUsuario(false);
    }catch(error){
      console.log(error);
    

    }
  }
  cargarUsuario();

  }, []);

  async function login(email, password) {
    const { data } = await Axios.post('http://localhost:3001/api/usuarios/login', { email, password });

    setUsuario(data.usuario);
    setToken(data.token);
  }

  async function signup(usuario) {
    const { data } = await Axios.post('http://localhost:3001/api/usuarios/signup', usuario);

    setUsuario(data.usuario);
    setToken(data.token);
  }

  function logout(){
    setUsuario(null);
    deleteToken();

  }

  if(cargandoUsuario){
    return (
      <Main center>
        <Loading/>
      </Main>
    )
  }


  return (
    <div className="ContenedorTemporal">
      <Nav />
      {/*    <Signup signup={signup}/>*/}
      <Login login={login} />
      <div>{JSON.stringify(usuario)}</div>
    </div>
  );
}
