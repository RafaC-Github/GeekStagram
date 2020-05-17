import React, { useState } from 'react';


export default function Comentar({ onSubmitComentario, mostrarError }) {


    const [mensaje, setMensaje] = useState('');
    const [enviandoComentario, setEnviandoComentario] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();
        if (enviandoComentario) {
            return;
        }

        try {
            setEnviandoComentario(true);
            await onSubmitComentario(mensaje);
            setMensaje('');
            setEnviandoComentario(false);
        } catch (error) {
            setEnviandoComentario(false);
            mostrarError('No se pudo enviar el comentario');
            console.log(error)


        }
    }

    return (
        <form className="Post__comentario-form-container" onSubmit={onSubmit}>
            <input type="text" placeholder="Comentario..." maxLength="180" value={mensaje} onChange={e => setMensaje(e.target.value)} />
            <button type="submit">Enviar</button>
        </form>
    )
}
