import React, { useEffect, useState } from 'react';
import './LoginSignin.css';
import { useDispatch, useSelector } from 'react-redux';
import { requestUser, login } from '../generalSlice'

const LoginSignin = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const covers = ['cover1', 'cover2', 'cover3', 'cover4', 'cover5'];
    const [mode, setMode] = useState('login');
    const [visibilityPass, setVisibilityPass] = useState('hide');
    const dispatch = useDispatch();
    const general = useSelector(state => state.general);
    const [signupObj, setSignupObj] = useState({fin: "",name: "", gender: "", surname: "", father: "",birth: "" });
    const [signupSeriaNotFound,setSignupSeriaNotFound] = useState(false);
    const [signupPhoneNotFound,setSignupPhoneNotFound] = useState(false);
    const [passwordsMatchError,setPasswordsMatchError] = useState(false);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentImageIndex(prevIndex =>
                prevIndex === covers.length - 1 ? 0 : prevIndex + 1
            );
        }, 10000);

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

    function showHidePass(e) {
        visibilityPass === 'hide' ?
            setVisibilityPass('show') :
            setVisibilityPass('hide');
    }

    function loginSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        let fin = formData.get('fin').toUpperCase();
        let pass = formData.get('pass')
        fetch(`http://localhost:5000/getTable?path=users&owner=${fin}&password=${pass}`)
            .then(r => r.json())
            .then(data => {
                if (data.length) {
                    dispatch(requestUser(data[0]));
                }
                else {
                    console.warn("Istifadeci tapilmadi")
                }
            });
    }

    function signupSubmit(e) {
        e.preventDefault();
        let formData = new FormData(e.target);
        let seria = "AA" + formData.get("seria");
        let phone = formData.get('phone-prefix') + formData.get("phone").split(" ").join("").trim();
        let password = formData.get('passwordSignup');
        let rePassword = formData.get('rePasswordSignup');
        if (password === rePassword) {
            setPasswordsMatchError(false);
        }
        else {
            setPasswordsMatchError(true);
        }
        fetch('http://localhost:5000/getTable?path=internet/persons&seria=' + seria)
        .then(r => r.json())
        .then(data => {
            if (data.length) {
                setSignupSeriaNotFound(false)
            }
            else {
                setSignupSeriaNotFound(true)
            }

            fetch('http://localhost:5000/getTable?path=internet/accounts/mobileOperators&number=' + phone)
            .then(r => r.json())
            .then(d => {
                if (d.length) {
                    setSignupPhoneNotFound(false);

                }
                else {
                    setSignupPhoneNotFound(true);
                }
                if (d.length && data.length && password === rePassword) {
                    //Signup burada yazilacaq
                    console.log("Teleb ugurlu")
                }
            })
        })
        
    }

    function finKeyUp(e) {
        e.target.value = e.target.value.toUpperCase();
        if (e.target.value.length === 7) {
            e.target.parentElement.parentElement.nextSibling.children[0].children[0].focus();
        }
    }

    function codeOnChange(e) {
        const input = e.target;

        if (input.name.substring(input.name.length - 1, input.name.length) === '4') {
            [...input.parentElement.children]
                .forEach(i => {
                    i.disabled = true;
                })
            let code = '';
            [...input.parentElement.children].forEach(i => {
                code += i.value;
            })
            if (String(general.requsetedUser.verCode) === code) {
                let user = { ...general.requsetedUser };
                delete user.verCode;
                dispatch(login(user))
                dispatch(requestUser(null))
            }
            else {
                [...input.parentElement.children]
                    .forEach(i => {
                        i.style.color = 'red';
                        i.style.borderColor = 'red';
                        i.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
                    })
            }
        }
        else {
            input.nextSibling.disabled = false;
            e.target.nextSibling.focus();
            [...[...input.parentElement.children].filter(i => i !== input.nextSibling)]
                .forEach(i => {
                    i.disabled = true;
                })
        }

    }

    function codeOnKeyup(e) {
        let input = e.target;
        if (e.key === 'Backspace') {
            input.value = ''
            if (input.name.substring(input.name.length - 1, input.name.length) !== '1') {
                input.previousSibling.disabled = false;
                e.target.previousSibling.value = '';
                e.target.previousSibling.focus();
                [...[...input.parentElement.children].filter(i => i !== input.previousSibling)]
                    .forEach(i => {
                        i.disabled = true;
                    })
            }
        }
    }

    function seriaKeyUp(e) {
        const seria = "AA" + e.target.value;
        fetch('http://localhost:5000/getTable?path=internet/persons&seria=' + seria)
            .then(r => r.json())
            .then(data => {
                if (data.length) 
                setSignupObj(data[0]);
                else 
                setSignupObj({fin: "",name: "", gender: "", surname: "", father: "",birth: "" })
            })
    }

    useEffect(() => {

        if (Boolean(general.requsetedUser)) {
            const code = general.requsetedUser.verCode;
            const phone = general.requsetedUser.phone;
            alert(`${phone} nömrəsinə göndərilən mesaj:
"Sizin zwallet hesabınıza giriş üçün təhlükəsizlik kodu: ${code}
Bu kodu heç kim ilə paylaşmayın"`)
        };
    }, [general.requsetedUser])


    return (
        <div className={`LoginSignin ${covers[currentImageIndex]}`}>
            <div className="main">
                <div className="header">
                    <h3 className={mode === 'login' ? 'switched-gray' : ''}>Giriş</h3>
                    <label className="switch">
                        <input type="checkbox" onChange={switchChange} />
                        <span className="slider round"></span>
                    </label>
                    <h3 className={mode === 'signup' ? 'switched-blue' : ''}>Qeydiyyat</h3>
                </div>

                {
                    mode === 'login' ?
                        <form className='login-form' autoComplete='off' onSubmit={loginSubmit}>
                            <label htmlFor="fin">FİN
                                <div className="fin visible-input">
                                    <input key={'fin'} defaultValue={'9ZARX18'} type="text" name='fin' id='fin' onChange={finKeyUp} placeholder='1ABCDEF' required pattern=".{7}" title="FİN 7 simvoldan ibarət olmalıdır" />
                                </div>
                            </label>
                            <label htmlFor="pass">Şifrə
                                <div className="pass non-visible-input">
                                    <input defaultValue={'aaaaaaaaaa'} type={visibilityPass === 'show' ? "text" : "password"} name='pass' id='pass' placeholder={visibilityPass === 'show' ? "12345678" : '**********'} required />
                                    <span onClick={showHidePass} >{visibilityPass === 'hide' ? "Göstər" : "Gizlət"}</span>
                                </div>
                            </label>
                            <button type='submit'>Daxil ol</button>
                        </form>
                        : mode === 'signup' &&
                        <form onSubmit={signupSubmit} className='singup-form' autoComplete='off'>
                            <label htmlFor="seria">Seriya nömrəsi
                                <div className="seria visible-input">
                                    <span>AA</span>
                                    <input key={'seria'} type="number" name='seria' id='seria' placeholder='1111111' onChange={seriaKeyUp} required/>
                                </div>
                            </label>
                            <label htmlFor="fin">FİN
                                <div className="fin visible-input">
                                    <input defaultValue={signupObj.fin} key={'finSignUp'} type="text" name='fin' id='fin' disabled />
                                </div>
                            </label>
                            <label htmlFor="name">Ad
                                <div className="ad visible-input">
                                    <input defaultValue={signupObj.name} key={'nameSignUp'} type="text" name='name' id='name' disabled />
                                </div>
                            </label>
                            <label htmlFor="surname">Soyad
                                <div className="soyad visible-input">
                                    <input defaultValue={signupObj.surname} key={'surnameSignUp'} type="text" name='surname' id='surname' disabled />
                                </div>
                            </label>
                            <label htmlFor="father">Ata adı
                                <div className="ata visible-input">
                                    <input defaultValue={signupObj.father} key={'fatherSignUp'} type="text" name='father' id='father' disabled />
                                </div>
                            </label>
                            <label className='radio'>
                                <label>Kişi
                                    <input className='test' checked={signupObj.gender === "M" && 'checked'} type="radio" name='gender' value='M' disabled/>
                                </label>
                                <label>Qadın
                                    <input checked={signupObj.gender === "F" && 'checked'} type="radio" name='gender' value='F' disabled/>
                                </label>
                            </label>
                            <label htmlFor="birth">Doğum tarixi
                                <div className="birth visible-input">
                                    <input defaultValue={signupObj.birth} key={'birthSignUp'} type="date" name='birth' id='birth' disabled />
                                </div>
                            </label>
                            <label htmlFor="phone">Telefon nömrəsi
                                <div className="phone visible-input">
                                    <select name="phone-prefix" required>
                                        <option value="050">050</option>
                                        <option value="051">051</option>
                                        <option value="070">070</option>
                                        <option value="077">077</option>
                                        <option value="055">055</option>
                                    </select>
                                    <input key={'phone'} type="text" name='phone' id='phone' placeholder='123 45 67' required/>
                                </div>
                            </label>
                            <label htmlFor="passwordSignup">Şifrə
                                <div className="passwordSignup non-visible-input">
                                    <input type={visibilityPass === 'show' ? "text" : "password"} name='passwordSignup' id='passwordSignup' placeholder={visibilityPass === 'show' ? "12345678" : '**********'} required minLength={8} />
                                    <span onClick={showHidePass} >{visibilityPass === 'hide' ? "Göstər" : "Gizlət"}</span>
                                </div>
                            </label>
                            <label htmlFor="rePasswordSignup">Şifrənin təkrarı
                                <div className="rePasswordSignup non-visible-input">
                                    <input type={visibilityPass === 'show' ? "text" : "password"} name='rePasswordSignup' id='rePasswordSignup' placeholder={visibilityPass === 'show' ? "12345678" : '**********'} required />
                                    <span onClick={showHidePass} >{visibilityPass === 'hide' ? "Göstər" : "Gizlət"}</span>
                                </div>
                            </label>
                            {
                                (signupSeriaNotFound || signupPhoneNotFound || passwordsMatchError) &&
                                <div className="sign-up-alert">
                                {
                                    signupSeriaNotFound &&
                                    <p>Seria nömrəsi doğru deyil</p>
                                }
                                {           
                                    signupPhoneNotFound && 
                                    <p>Telefon nömrəsi doğru deyil</p>
                                }
                                {
                                    passwordsMatchError && 
                                    <p>Şifrələr uyğunlaşmır</p>
                                }
                            </div>
                            }
                            <button type='submit'>Qeydiyyatdan keç</button>
                        </form>
                }

            </div>
            {
                Boolean(general.requsetedUser) &&
                <div className="login-request-cover">
                    <div>
                        <p>{general.requsetedUser.phone.substring(0, 3)} *** ** {general.requsetedUser.phone.substring(general.requsetedUser.phone.length - 2, general.requsetedUser.phone.length)} nömrəsinə göndərilmiş 4 rəqəmli şifrəni daxil edin.</p>
                        <form>
                            {
                                [1, 2, 3, 4].map(i => (
                                    <input type='number' name={`digit${i}`} maxLength={1} key={i} onChange={codeOnChange} onKeyUp={codeOnKeyup} disabled={i !== 1} />
                                ))
                            }
                        </form>
                    </div>
                </div>
            }

        </div>
    );
};

export default LoginSignin;
