import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HomeCss from "../styles/HomeCss";

function Home() {

    const navigate = useNavigate();

    const Jesi = () => {
        localStorage.setItem("Sitio", "Jesi");
        navigate("/orders");
    }

    const Senigalia = () => {
        localStorage.setItem("Sitio", "Senigalia");
        navigate("/");
    }

    return (
        <div className="container">
            <HomeCss />
            <div style={{height:200}}></div>
            <div className="buttons-container">
                <button className="image-button" onClick={Jesi}
                style={{ backgroundImage: 'url(/img/)' }}>
                    <div className="overlay">Agricola Atienza</div>
                </button>
                <button className="image-button" onClick={Senigalia}
                style={{ backgroundImage: 'url(/img/Senigalia.jpg)' }}>
                    <div className="overlay">Transformaciones Subagri</div>
                </button>
            </div>
        </div>
    );
    
}

export default Home;
