import React from 'react';
import Admin from '../components/Admin/Administrador';
import api from '../api';
import { useState, useEffect } from 'react';

function AdministradorPage() {

    const [users, setUsers] = useState([]);

    const fetchData = () => {
        //Si el sitio es Jesi, una url diferente se usará para obtener los datos
        api.get("/api/users/")
            .then((res) => {
                setUsers(res.data);
            })
            .catch(() => {
                // Llama a `showErrorAndLogout` si ocurre un error
                showErrorAndLogout();
            });
    };

    // Carga los datos iniciales
    useEffect(() => {
        fetchData();
       // sort order by date

    }, []);

    return <Admin users={users} fetchData={fetchData} />;
}

export default AdministradorPage;
