import React, { useState, useEffect } from 'react';
import Main from '../Components/Main'
import { Link } from 'react-router-dom'
import Loading from '../Components/Loading'
import Comentar from '../Components/Comentar'
import Avatar from '../Components/Avatar'
import BotonLike from '../Components/BotonLike'
import Axios from 'axios'
import RecursoNoExiste from '../Components/RecursoNoExiste'
import {toggleLike, comentar} from '../Helpers/post-helpers'


export default function PostVista({ mostrarError, match, usuario }) {

    const postId = match.params.id;

    const [post, setPost] = useState(null);

    const [loading, setLoading] = useState(true);

    const [postNoExiste, setPostNoExiste] = useState(false);

    const [enviandoLike, setEnviandoLike]= useState(false); 


    useEffect(() => {
        async function cargarPost() {
            try {
                const { data: post } = await Axios.get(`/api/posts/${postId}`);
                setPost(post);
                setLoading(false);
            } catch (error) {
                if (error.response && (error.response.satus === 404 || error.response.status === 400)) {
                    setPostNoExiste(true);

                } else {
                    mostrarError('No se puede cargar el Post');
                }
                setLoading(false);

            }
        }
        cargarPost();
    }, [postId]);


    async function onSubmitComentario(mensaje){
        const postActualizado = await comentar(post, mensaje, usuario);
            setPost(postActualizado);
    }

    async function onSubmitLike(){
        if(enviandoLike){
            return;
        }

        try{
            setEnviandoLike(true)
           const postActualizado =  await toggleLike(post);
           setPost(postActualizado);
            setEnviandoLike(false); 
        }catch(error){
            setEnviandoLike(false);
            mostrarError('No se pudo enviar el like')
            console.log(error);
        }

    }

    if (loading) {
        return (<Main center><Loading /></Main>);
    }
    if (postNoExiste) {
        return <RecursoNoExiste mensaje="El post no existe "></RecursoNoExiste>
    }

    if (post == null) {
        return null;
    }

    return <Main center>
        <Post {...post} onSubmitComentario={onSubmitComentario}  onSubmitLike={onSubmitLike}/>
    </Main>
}

function Post({
    comentarios,
    caption,
    url,
    usuario,
    estaLike,
    onSubmitLike,
    onSubmitComentario
}) {
    return (
        <div className="Post">
            <div className="Post__image-container">
                <img src={url} alt={caption}></img>
            </div>
            <div className="Post__side-bar">
                <Avatar usuario={usuario}></Avatar>
                <div className="Post__comentarios-y-like">
                    <Comentarios usuario={usuario} caption={caption} comentarios={comentarios}></Comentarios>
                    <div className="Post__like">
                        <BotonLike onSubmitLike={onSubmitLike} like={estaLike}></BotonLike>
                    </div>
                    <Comentar onSubmitComentario={onSubmitComentario}></Comentar>
                </div>
            </div>
        </div>
    )
}

function Comentarios({ usuario, caption, comentarios }) {
    return (
        <ul className="Post__comentarios">
            <li className="Post__comentario">
                <Link to={`/perfil/${usuario.username}`} className="Post__autor-comentario">
                    <b>{usuario.username}</b>
                </Link><br></br>
                {caption}
            </li>
            {
                comentarios.map(comentario => (
                    <li className="Post__comentario" key={comentario._id}>
                        <Link to={`/perfil/${comentario.usuario.username}`} className="Post__autor-comentario">
                            <b>{comentario.usuario.username}</b>
                        </Link><br></br>
                        {comentario.mensaje}
                    </li>
                ))
            }
        </ul>
    );
}
