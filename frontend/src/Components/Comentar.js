import React, {useState} from 'react';


export default function Comentar({onSubmitComentario, mostrarError}){


    const [mensaje, setMensaje]= useState('');

    async function onSubmit(e){
        e.preventeDefault();

    }

    return(
        <form className="Post__comentario-form-container" onSubmit={onSubmit}>
            <input type="text" placeholder="Comentario..." maxLength="180" value={mensaje} onChange={e=> setMensaje(e.target.value)}/>
            <button type="submit">Enviar</button>
        </form>
    )
}
