import React, { useEffect, useState } from 'react';
import './LoginSignin.css';

const LoginSignin = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const covers = ['cover1', 'cover2','cover3','cover4','cover5'];
    const [mode, setMode] = useState('login');

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentImageIndex(prevIndex =>
                prevIndex === covers.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000);

        return () => clearInterval(intervalId);
    }, [covers.length]);

    function switchChange(e) {
        switch (mode) {
            case 'login':
                setMode('signup')
                break;
            case 'signup':
                setMode('login')
                break;
            default:
                break;
        }
    }


    return (
        <div className={`LoginSignin ${covers[currentImageIndex]}`}>
            <div className="main">
                <div className="header">
                    <h3 className={mode === 'login' && 'switched-gray'}>Log in</h3>
                    <label className="switch">
                        <input type="checkbox" onChange={switchChange} />
                        <span className="slider round"></span>
                    </label>
                    <h3 className={mode === 'signup' && 'switched-blue'}>Sign up</h3>
                </div>

                {
                    mode === 'login' &&
                    <form className='login-form' autoComplete='off'>
                        <label htmlFor="fin">FIN
                            <div className="fin visible-input">
                                <input type="text" name='fin' id='fin' placeholder='1ABCDEF' autoCapitalize='characters'/>
                            </div></label>
                        <label htmlFor="pass">Şifrə
                            <div className="pass non-visible-input">
                                <input type="password" name='pass' id='pass' placeholder='**********' />
                            </div></label>
                    </form>
                }

            </div>
        </div>
    );
};

export default LoginSignin;
