import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants';
import { Input } from './Input';
import "../../styles/Login.css";
import { FormProvider, useForm } from 'react-hook-form';
import useErrorAndLogout from "../Utils/ErrorBd";


function Form({ route, method }) {
    const methods = useForm();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate();
    const showErrorAndLogout = useErrorAndLogout();

    const name = method === "login" ? "Login" : "Register";

    useEffect(() => {
        setFormData({ username: '', password: '' });
        if (localStorage.getItem(ACCESS_TOKEN)) {
            if (method === "login") {
                navigate('/');
            }
        }

    }, []);

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        const inputValue = type === 'checkbox' ? checked : value;
        setFormData({ ...formData, [name]: inputValue });
    };

    const handleSubmit = methods.handleSubmit(async (e) => {
        try {
            const res = await api.post(route, {
                username: formData.username,
                password: formData.password
            });
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate('/');
            } else {
                navigate('/Admin/');
            }
        } catch (error) {
            showErrorAndLogout();
        } finally {
        }
    });

    return (
        <section className="hero is-success is-fullheight">
            <div className="hero-body">
                <div className="container has-text-centered">
                    <div className="column is-4 is-offset-4">
                        <h3 className="title has-text-black">{name}</h3>
                        <hr className="login-hr"></hr>
                        <p className="subtitle ha-text-black">Please {name} to proceed.</p>
                        <div className="box" style={{margin:'', backgroundColor: '#00D1B2' }}>
                            <br/>
                            <figure >
                                <img src="img/logo.png" style={{width:320}}></img>
                            </figure>
                            <br/>
                            <FormProvider {...methods}>
                                <form onSubmit={e => e.preventDefault()} noValidate>
                                    <div className="field">
                                        <div className="control">   
                                            <Input
                                                type="text"
                                                name="username"
                                                className="input is-large"
                                                value={formData.username}
                                                placeholder="Your Username"
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="field">
                                        <div className="control">
                                            <Input
                                                type="password"
                                                name="password"
                                                className="input is-large"
                                                value={formData.password}
                                                placeholder="Your Password"
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    
                                    <button className="button is-block is-info is-large is-fullwidth" onClick={handleSubmit}>{name} <i className="fa fa-sign-in" aria-hidden="true"></i></button>
                                </form>
                            </FormProvider>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Form;
