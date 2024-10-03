import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// Registra todos los componentes de Chart.js
Chart.register(...registerables);

const ComAnalisisNegocio = () => {
    const [data, setData] = useState([]);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:3001/analisisVentas");
                setData(response.data);
            } catch (error) {
                console.error("Error al obtener datos de ventas:", error);
            }
        };
        fetchData();
    }, []);
    
    const chartData = {
        labels: data.map(item => item.fecha),
        datasets: [{
            label: 'Ventas Totales',
            data: data.map(item => item.total_ventas),
            borderColor: 'rgba(75,192,192,1)',
            backgroundColor: 'rgba(75,192,192,0.2)',
            fill: true,
        }]
    };

    return (
        <div>
            <h2>Análisis de Ventas</h2>
            <Line data={chartData} />
        </div>
    );
};

export default ComAnalisisNegocio;