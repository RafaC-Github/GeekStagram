import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom'
import Main from '../Components/Main'
import Axios from 'axios'
import Loading from '../Components/Loading'
import Post from '../Components/Post'

async function cargarPosts(fechaDelUltimoPost) {
    const query = fechaDelUltimoPost ? `?fecha=${fechaDelUltimoPost}` : '';
    const { data: nuevosPosts } = await Axios.get(`/api/posts/feed${query}`)

    return nuevosPosts;
}


export default function Feed({ mostrarError }) {
    const [posts, setPosts] = useState([]);
    const [cargandoPostsIniciales, setCargandoPostsIniciales] = useState(true);
    useEffect(() => {
        async function cargarPostsIniciales() {
            try {
                const nuevosPosts = await cargarPosts();
                setPosts(nuevosPosts);
                console.log(nuevosPosts);
                setCargandoPostsIniciales(false);
            } catch (error) {
                mostrarError('No se puede cargar el feed')
                console.log(error);
            }
        }
        cargarPostsIniciales()
    }, [])

    if (cargandoPostsIniciales) {
        return (
            <Main center>
                <Loading />
            </Main>
        )

    }

    if(!cargandoPostsIniciales && posts.lenght === 0){
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
                    posts.map(post =>(<Post key={post._id} post={post}/>))
                }
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