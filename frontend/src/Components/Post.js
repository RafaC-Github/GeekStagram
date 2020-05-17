import React, {useState} from 'react';
import Avatar from './Avatar'
import BotonLike from './BotonLike'
import {Link} from 'react-router-dom'
import Comentar from './Comentar'
import {toggleLike, comentar} from '../Helpers/post-helpers'


export default function Post({post, actualizarPost, mostrarError, usuario}){
    const{
        numLikes,
        numComentarios,
        comentarios,
        _id,
        caption,
        url,
        usuario: usuarioDelPost,
        estaLike,
    } = post;

    const [enviandoLike, setEnviandoLike] = useState(false);


    async function onSubmitLike(){
        if(enviandoLike){
            return;
        }

        try{
            setEnviandoLike(true)
           const postActualizado =  await toggleLike(post);
           actualizarPost(post, postActualizado);
            setEnviandoLike(false) 
        }catch(error){
            setEnviandoLike(false);
            mostrarError('No se pudo enviar el like')
            console.log(error);
        }

    }

    async function onSubmitComentario(mensaje){
        const postActualizado = await comentar(post, mensaje, usuario);
        actualizarPost(post, postActualizado);

    }

    return(
        <div className="Post-Componente">
            <Avatar usuario={usuarioDelPost}/>
            <img src={url} className="Post-Componente__img" alt={caption}></img>
            <div className="Post-Componente__acciones">
                <div className="Post-Componente__like-container">
                    <BotonLike onSubmitLike={onSubmitLike} like={estaLike}></BotonLike>
                </div>
                <p> {numLikes} Likes</p>
                <ul>
                    <li>
                        <Link to={`/perfil/${usuarioDelPost.username}`}><b>{usuarioDelPost.username}</b></Link>
                        {'  '}
                        {caption}
                    </li>
                    <VerTodosLosComentarios _id={_id} numComentarios={numComentarios}/>
                    <Comentarios comentarios={comentarios} ></Comentarios>
                </ul>
            </div>
            <Comentar onSubmitComentario={onSubmitComentario} />
        </div>
    )

}

function VerTodosLosComentarios({_id, numComentarios}){

    if(numComentarios<4){
        return null;

    }

    return <li className="text-grey-dark">
        <Link to={`/post/${_id}`}>
            Ver los {numComentarios} comentarios
        </Link>
    </li>
}

function Comentarios ({comentarios}){
    if(comentarios.lenght === 0){
        return null;
    }

    return comentarios.map((comentario)=>{
        return(
            <li key={comentario._id}>
                <Link to={`/perfil/${comentario.usuario.username}`}>
        <b>{comentario.usuario.username}</b>
                </Link>{' '}
                {comentario.mensaje}
            </li>
        )
    })
}