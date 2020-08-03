import React, { Fragment } from 'react';
import {Link} from 'react-router-dom'
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faCamera} from '@fortawesome/free-solid-svg-icons'
import { faCompass, faUser} from '@fortawesome/free-regular-svg-icons'

export default function Nav({usuario}){
    return(
        <nav className="Nav">
            <ul className="Nav__links">
                <li>
                <Link className="Nav__link" to="/">Geesktagram</Link>
                </li>
                {usuario && <LoginRoutes usuario={usuario}/>}
            </ul>
        </nav>
    )
}

function LoginRoutes({usuario}){
    return (
        <Fragment>
            <li className="Nav__link-push">
                <Link className="Nav__link" to="/upload">
                    <FontAwesomeIcon icon={faCamera}/>
                </Link>
            </li>
            <li className="Nav__link-margin-left">
                <Link className="Nav__link" to="/explore">
                    <FontAwesomeIcon icon={faCompass}/>
                </Link>
            </li>
            <li className="Nav__link-margin-left">
                <Link className="Nav__link" to={`/perfil/${usuario.username}`}>
                    <FontAwesomeIcon icon={faUser}/>
                </Link>
            </li>
        </Fragment>
    )
}