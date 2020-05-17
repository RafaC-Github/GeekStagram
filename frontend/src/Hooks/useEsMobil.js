import { useState, useEffect } from 'react';

export default function useEsMobil() {
    const[esEsMobil, setEsMoBil] = useState(null);

    useEffect(() => {
        const mql = window.matchMedia('(min-width: 576px)');

        mql.addListener(revisarSiEsMobil);

        function revisarSiEsMobil() {
            if (mql.matches) {
                setEsMoBil(false);
            } else {
                setEsMoBil(true);
            }
        }
        revisarSiEsMobil();

        return()=> mql.removeListener(revisarSiEsMobil);
    },[])

    return esEsMobil;
}