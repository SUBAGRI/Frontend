import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/SearchBar.css";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import api from "../../api";


function Admin({ users, fetchData }) {

    const [actualUsers, setActualUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [isMenuActive, setIsMenuActive] = useState(false);
    const [isDocsActive, setIsDocsActive] = useState(false); // Estado para controlar la visibilidad de `Docs`
    const navigate = useNavigate();

    // Media query para detectar el esquema de color preferido del usuario
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const [isDarkMode, setIsDarkMode] = useState(darkModeMediaQuery.matches);

    const [search, setSearch] = useState('');

    // Confirmacion de eliminacion
    const deleteUser = async (user) => {
        const result = await Swal.fire({
            title: 'Cancella utente?',
            text: "No può cambiare in seguito",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: "Sì, cancellarlo!",
            customClass: isDarkMode ? 'swal2-dark' : '',
        });

        if (result.isConfirmed) {
            // Lógica para manejar la confirmación
            handleDeleteUser(user);
        }
    };

    // Manejar el finalizado del pedido
    const handleDeleteUser = async (user) => {
        try {
            await api.delete(`/api/deleteuser/${user.id}/`);
            // Muestra una notificación de éxito con SweetAlert2 que se cierra automáticamente después de 3 segundos
            await Swal.fire({
                icon: 'success',
                title: 'Utente cancellato definitivamente',
                text: "L'utente è stato cancellato.",
                timer: 2000, // Cierra automáticamente después de 3 segundos (3000 milisegundos)
                timerProgressBar: true, // Muestra una barra de progreso mientras cuenta el tiempo
                customClass: isDarkMode ? 'swal2-dark' : '',
            });

            // Vuelve a cargar los datos después de actualizar el pedido
            fetchData();

        } catch (error) {
            // Muestra una notificación de error con SweetAlert2 que se cierra automáticamente después de 3 segundos
            await Swal.fire({
                icon: 'error',
                title: 'Errore',
                text: "L'utente non può essere cancellato",
                timer: 2000, // Cierra automáticamente después de 3 segundos
                timerProgressBar: true, // Muestra una barra de progreso mientras cuenta el tiempo
            });
        }
    };


    const toggleMenu = () => {
        setIsMenuActive(!isMenuActive);
    };

    const toggleDocsMenu = () => {
        setIsDocsActive(!isDocsActive);
    };

    useEffect(() => {
        if (users.length > 0) {
            setActualUsers(users);
        }
    }, [users]);

    const addUser = async (e) => {
        navigate('/register');
    };

    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    useEffect(() => {
        if (search.length > 0) {
            setFilteredUsers(actualUsers.filter((user) => user.username.toLowerCase().includes(search.toLowerCase())));
        } else {
            setFilteredUsers(actualUsers);
        }
    }, [search, actualUsers]);


    return (
        <div className="">
            <nav className="navbar is-primary" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <a
                        role="button"
                        className={`navbar-burger burger ${isMenuActive ? "is-active" : ""}`}
                        aria-label="menu"
                        aria-expanded="false"
                        data-target="navbarMenu"
                        onClick={toggleMenu}
                    >
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </a>
                </div>

                <div id="navbarMenu" className={`navbar-menu ${isMenuActive ? "is-active" : ""}`}>
                    <div className="navbar-start">
                        <div className="navbar-item is-hoverable">
                            <Link className="navbar-item" to="/">Home</Link>

                            <p className="navbar-link" onClick={toggleDocsMenu}>
                                Docs
                            </p>
                            <div className={`navbar-dropdown is-boxed ${isDocsActive ? "" : "is-hidden"}`}>
                                <a className="navbar-item" href="/Orders">Ordini</a>
                                <a className="navbar-item" href="cover.html">Support</a>
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <div className="navbar-item">
                            <p style={{ fontSize: '2rem' }}>Admin</p>
                        </div>
                    </div>

                    <div className="navbar-end">
                        <div className="navbar-item">
                            <div className="buttons">

                                <Link className="button is-danger" to="/logout">
                                    <span className="icon">
                                        <i className="fa fa-user-times"></i>
                                    </span>
                                    <span>Log out</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="columns control m-2 p-2">
                <div className="column">
                    <div className="input-wrapper" style={{ maxWidth: '300px' }}>
                        <FaSearch id="search-icon" />
                        <input
                            type="text"
                            placeholder="Navigazione..."
                            value={search}
                            onChange={handleSearch}
                        />
                    </div>

                </div>
                <div className="column is-narrow">
                    <button className="button is-success" onClick={addUser}>
                        <span className="icon">
                            <i className="fas fa-plus-circle"></i>
                        </span>
                        <span>Crea usuario</span>
                    </button>
                </div>
            </div>
            <div className="columns is-centered">
                <div className="column is-half" style={{ overflowX: 'auto' }}>
                    <div className="table-container">
                        <table className="table is-striped is-hoverable is-fullwidth">
                            <thead className="thead-light">
                                <tr>
                                    <th>ID</th>
                                    <th className="is-fullwidth">Username</th>
                                    <th className="has-text-centered">Cancella</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.username}</td>
                                        
                                        <td className="has-text-centered">
                                            <button onClick={(e) => deleteUser(user)} className="button mr-3 fa fa-trash-o" disabled={user.username === 'Admin'} ></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Admin;