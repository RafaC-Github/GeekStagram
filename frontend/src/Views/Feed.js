import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom'
import Main from '../Components/Main'
import Axios from 'axios'
import Loading from '../Components/Loading'
import Post from '../Components/Post'

async function cargarPosts(fechaDelUltimoPost) {
    const query = fechaDelUltimoPost ? `?fecha=${fechaDelUltimoPost}` : '';
    const { data: nuevosPosts } = await Axios.get(`http://localhost:3001/api/posts/feed${query}`);
    
    return nuevosPosts;
}

const NUMERO_DE_POSTS_POR_PANTALLA = 3;

export default function Feed({ mostrarError, usuario }) {
    const [posts, setPosts] = useState([]);
    const [cargandoPostIniciales, setCargandoPostIniciales] = useState(true);
    const[cargandoMasPosts, setCargandoMasPosts ]= useState(false);
    const [todosLosPostsCargados, setTodosLosPostsCargados]=  useState(false);


    useEffect(() => {
        async function cargarPostsIniciales() {
            try {
                const nuevosPosts = await cargarPosts();
                setPosts(nuevosPosts);
                console.log(nuevosPosts);
                setCargandoPostIniciales(false);
                revisarSiHayMasPosts(nuevosPosts);
            } catch (error) {
                mostrarError('No se puede cargar el feed')
                console.log(error);
            }
        }
        cargarPostsIniciales()
    }, [])

    function actualizarPost(postOriginal, postActualizado){
        setPosts(posts=>{
            const postActualizados = posts.map(post=>{
                if(post !== postOriginal){
                    return post;
                }
                return postActualizado;
            })
            return postActualizados;
        })
    }

    async function cargarMasPosts(){

        if(cargandoMasPosts){
            return;

        }
        try{

            setCargandoMasPosts(true);
            const fechaDelUltimoPost= posts[posts.length -1].fecha_creado;
            const nuevosPosts = await cargarPosts(fechaDelUltimoPost);
            setPosts(viejosPosts =>[...viejosPosts, ...nuevosPosts]);
            setCargandoMasPosts(false);
            revisarSiHayMasPosts(nuevosPosts);

        }catch(error){
            mostrarError('No se puede cargar el resto de las imágenes')
            setCargandoMasPosts(false);

        }
    }

    function revisarSiHayMasPosts(nuevosPosts){
            if(nuevosPosts.length < NUMERO_DE_POSTS_POR_PANTALLA){
                setTodosLosPostsCargados(true);

            }

    }

    if (cargandoPostIniciales) {
        return (
            <Main center>
                <Loading />
            </Main>
        )

    }

    if(!cargandoPostIniciales && posts.lenght === 0){
        return (
        <Main center>
            <NoSiguesANadie/>
            </Main>
            )

    }

    return (
        <Main center>
            <div className="Feed">
                {
                    posts.map(post =>(<Post key={post._id} post={post} actualizarPost={actualizarPost} mostrarError={mostrarError} usuario={usuario}/>))
                }
                <CargarMasPosts onClick={cargarMasPosts} todosLosPostCargados={todosLosPostsCargados}/>
            </div>
        </Main>
    );
}

function NoSiguesANadie() {
    return (
        <div className="NoSiguesANadie">
            <p className="NoSiguesANadie__mensaje">
                No hay contenido ya que no sigues a nadie o no han publicado fotos
            </p>

        <div className="text-center">
        <Link to="/explore" className="NoSiguesANadie__boton">Explorar el contenido global</Link>
        </div>
        </div>
        )
}
function CargarMasPosts({ onClick, todosLosPostCargados }){
    if(todosLosPostCargados){
        return <div className="Feed__no-hay-mas-posts">No hay mas imágenes</div>

    }
    return (
        <button className="Feed__cargar-mas" onClick={onClick}>
            Ver más
        </button>
    )

}