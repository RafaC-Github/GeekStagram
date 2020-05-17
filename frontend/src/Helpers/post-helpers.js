import Axios from 'axios'

export  async function toggleLike(post){
   const url = `/api/posts/${post._id}/likes`;

    if(post.estaLike){
        await Axios.delete(url, {});

    }else{
        await Axios.post(url, {});
    }
}