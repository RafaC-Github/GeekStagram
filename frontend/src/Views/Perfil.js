import React, { useState, useEffect } from 'react';
import Main from '../Components/Main'
import Loading from '../Components/Loading'
import Grid from '../Components/Grid'
import RecursoNoExiste from '../Components/RecursoNoExiste'
import Axios from 'axios'
import stringToColor from 'string-to-color'
import toggleSiguiendo from '../Helpers/amistad-helpers'
import useEsMobil from '../Hooks/useEsMobil'

export default function Perfil({ mostrarError, usuario, match, logout }) {
    const username = match.params.username;
    const [usuarioDueñoDelPerfil, setUsuarioDueñoDelPerfil] = useState(null);
    const [cargandoPerfil, setCargandoPerfil] = useState(true);
    const [posts, setPosts] = useState([]);
    const [perfilNoExiste, setPerfilNoExiste] = useState(false);
    const [subiendoImagen, setSubiendoImagen] = useState(false);
    const [enviandoAmistad, setEnviandoAmistad] = useState(false);
    const esMobil = useEsMobil();

    useEffect(() => {
        async function cargarPostYUsuario() {
            try {
                setCargandoPerfil(true);
                const { data: usuario } = await Axios.get(`/api/usuarios/${username}`);
                const { data: posts } = await Axios.get(`/api/posts/usuario/${usuario._id}`);

                setUsuarioDueñoDelPerfil(usuario);
                setPosts(posts);
                setCargandoPerfil(false);
            } catch (error) {
                if (error.response && (error.response.status === 404 || error.response.status === 400)) {
                    setPerfilNoExiste(true);
                } else {
                    mostrarError('No se pudo cargar el perfil')
                }
            } setCargandoPerfil(false);

        }
        cargarPostYUsuario();

    }, [username]);

    function esElPerfilDeLaPersonaLogin() {
        return usuario._id === usuarioDueñoDelPerfil._id;
    }

    async function handleImagenSeleccionada(event) {
        try {
            setSubiendoImagen(true);
            const file = event.target.files[0];
            const config = {
                headers: {
                    'Content-Type': file.type
                }
            }
            const { data } = await Axios.post('/api/usuarios/upload', file, config);
            setUsuarioDueñoDelPerfil({ ...usuarioDueñoDelPerfil, imagen: data.url })
            setSubiendoImagen(false);

        } catch (error) {
            mostrarError(error.response.data);
            setSubiendoImagen(false);
            console.log(error);
        }
    }

    async function onToggleSiguiendo() {
        if (enviandoAmistad) {
            return;
        }
        try {
            setEnviandoAmistad(true);
            const usuarioActualizado = await toggleSiguiendo(usuarioDueñoDelPerfil);
            setUsuarioDueñoDelPerfil(usuarioActualizado);
            setEnviandoAmistad(false);
        } catch (error) {
            mostrarError('No se pudo realizar la operación')
            setEnviandoAmistad(false);
            console.log(error);

        }
    }

    if (cargandoPerfil) {
        return (
            <Main center>
                <Loading />
            </Main>
        )
    }

    if (perfilNoExiste) {
        return (
            <RecursoNoExiste mensaje="El perfil no existe"></RecursoNoExiste>
        )
    }

    if (usuario == null) {
        return null;

    }



    return (
        <Main>
            <div className="Perfil">
                <ImagenAvatar
                    esElPerfilDeLaPersonaLogin={esElPerfilDeLaPersonaLogin()}
                    usuarioDueñoDelPerfil={usuarioDueñoDelPerfil}
                    handleImagenSeleccionada={handleImagenSeleccionada}
                    subiendoImagen={subiendoImagen}
                />
                <div className="Perfil__bio-container">
                    <div className="Perfil__bio-heading">
                        <h2 className="capitalize">{usuarioDueñoDelPerfil.username}</h2>
                        {!esElPerfilDeLaPersonaLogin()
                            &&
                            (<BotonSeguir
                                siguiendo={usuarioDueñoDelPerfil.siguiendo}
                                toggleSiguiendo={onToggleSiguiendo}
                            ></BotonSeguir>
                            )}

                        {esElPerfilDeLaPersonaLogin() && <BotonLogout logout={logout}></BotonLogout>}
                    </div>
                    {!esMobil &&  <DescripcionPerfil usuarioDueñoDelPerfil={usuarioDueñoDelPerfil}/>}
                   
                </div>
                </div>
                    {esMobil &&  (<DescripcionPerfil usuarioDueñoDelPerfil={usuarioDueñoDelPerfil}/>)}
                   
                <div className="Perfil__separador"></div>
                {posts.length >0 ? <Grid posts={posts}></Grid> : <NoHaPosteadoFotos/>}
            
        </Main>
    )

}
function DescripcionPerfil({ usuarioDueñoDelPerfil }) {
    return (
        <div className="Perfil__descripcion">
            <h2 className="Perfil__nombre">{usuarioDueñoDelPerfil.nombre}</h2>
            <p>{usuarioDueñoDelPerfil.bio}</p>
            <p className="Perfil__estadisticas">
                <b>{usuarioDueñoDelPerfil.numSiguiendo}</b> following
                <span className="ml-4">
                    <b>{usuarioDueñoDelPerfil.numSeguidores}</b> followers
                </span>
            </p>
        </div>
    )

}

function ImagenAvatar({
    esElPerfilDeLaPersonaLogin,
    usuarioDueñoDelPerfil,
    handleImagenSeleccionada,
    subiendoImagen
}) {
    let contenido;
    if (subiendoImagen) {
        contenido = <Loading />

    } else if (esElPerfilDeLaPersonaLogin) {
        contenido = (
            <label className="Perfil__img-placeholder Perfil__img-placeholder--pointer"
                style={{
                    backgroundImage: usuarioDueñoDelPerfil.imagen ? `url(${usuarioDueñoDelPerfil.imagen})` : null,
                    backgroundColor: stringToColor(usuarioDueñoDelPerfil.username)
                }}>

                <input type="file" onChange={handleImagenSeleccionada} className="hidden" name="imagen"></input>
            </label>
        )

    } else {
        contenido = (
            <div className="Perfil__img-placeholder"
                style={{
                    backgroundImage: usuarioDueñoDelPerfil.imagen ? `url(${usuarioDueñoDelPerfil.imagen})` : null,
                    backgroundColor: stringToColor(usuarioDueñoDelPerfil.username)
                }}></div>
        )
    }
    return <div className="Perfil__img-container">{contenido}</div>
}

function BotonSeguir({ siguiendo, toggleSiguiendo }) {
    return (
        <button onClick={toggleSiguiendo} className="Perfil__boton-seguir">
            {
                siguiendo ? 'Unfollow' : 'Follow'
            }
        </button>
    )

}

function BotonLogout({ logout }) {
    return (
        <button className="Perfil__boton-logout" onClick={logout}>Desconectarse</button>
    )
}

function NoHaPosteadoFotos(){
    return <p className="text-center">No hay nada subido</p>
}


