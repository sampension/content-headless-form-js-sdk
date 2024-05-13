import { useEffect, useState } from 'react';
import authService from '../authService';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import { FormStorage } from '@episerver/forms-sdk';

function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");

    useEffect(() => {
        const storage = window.sessionStorage;
        authService.getUser().then((user) => {
            if(user && user.expired) {
                authService.refreshAccessToken().then((_) => {
                    authService.getUser().then((_user) => { 
                        user = _user;
                        storage["form_access_token"] = _user?.access_token;
                    })
                })
            }

            if (user && !user.expired) {
                setIsLoggedIn(true);
                setUsername(user.profile.name || "");
                storage["form_access_token"] = user.access_token;
            }
        });
    }, [])

    return (
        <nav className="Page-container LoginBar">
            {isLoggedIn ? <LogoutButton username={username} /> : <LoginButton />}
        </nav>
    );
}

export default Header;
