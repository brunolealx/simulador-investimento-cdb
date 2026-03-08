"use client";

import { useState, useEffect } from "react";
import Resultado from "./Resultado";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

interface SelicData {
    data: string;
    valor: number;
}

export default function FormSimulador() {
    const [selic, setSelic] = useState<number>(13.75);
    const [aporte, setAporte] = useState<number>(1000);
    const [anos, setAnos] = useState<number>(5);
    const [resultado, setResultado] = useState<string | null>(null);
    const [rendaMensal, setRendaMensal] = useState<string | null>(null);
    const [dadosGrafico, setDadosGrafico] = useState<number[]>([]);

    // ✅ Busca a Selic automaticamente
    useEffect(() => {
        async function fetchSelic() {
            try {
                const res = await fetch(
                    "https://api.bcb.gov.br/dados/serie/bcdata.sgs.11/dados/ultimos/1?formato=json"
                );
                const data: SelicData[] = await res.json();
                setSelic(data[0]?.valor || 13.75); // fallback
            } catch (error) {
                console.error("Erro ao buscar Selic:", error);
                setSelic(13.75);
            }
        }
        fetchSelic();
    }, []);

    const calcularCDB = () => {
        const meses = anos * 12;
        const i = selic / 12 / 100;
        const valores: number[] = [];
        let acumulado = 0;

        for (let m = 1; m <= meses; m++) {
            acumulado = (acumulado + aporte) * (1 + i);
            valores.push(parseFloat(acumulado.toFixed(2)));
        }

        setDadosGrafico(valores);
        setResultado(valores[valores.length - 1].toFixed(2));

        const renda = valores[valores.length - 1] * 0.01;
        setRendaMensal(renda.toFixed(2));
    };

    const data = {
        labels: dadosGrafico.map((_, idx) => `Mês ${idx + 1}`),
        datasets: [
            {
                label: "CDB Acumulado",
                data: dadosGrafico,
                fill: true,
                backgroundColor: "rgba(59, 130, 246, 0.2)",
                borderColor: "#3b82f6",
                tension: 0.3,
                pointRadius: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "top" as const, labels: { font: { size: 14 } } },
            tooltip: { mode: "index" as const, intersect: false },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (tickValue: string | number) => {
                        const num = typeof tickValue === "number" ? tickValue : parseFloat(tickValue);
                        return `R$ ${num.toLocaleString()}`;
                    },
                },
            },
            x: {
                ticks: { font: { size: 12 } },
            },
        },
    };

    return (
        <div className="page-container">
            <h1 className="title text-3xl mb-8 text-center">Simulador de CDB</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                    <label className="text-secondary block mb-1">Selic anual (%)</label>
                    <input
                        type="number"
                        value={selic}
                        onChange={(e) => setSelic(parseFloat(e.target.value))}
                        className="input-field"
                    />
                </div>

                <div>
                    <label className="text-secondary block mb-1">Investimento/mês (R$)</label>
                    <input
                        type="number"
                        value={aporte}
                        onChange={(e) => setAporte(parseFloat(e.target.value))}
                        className="input-field"
                    />
                </div>

                <div>
                    <label className="text-secondary block mb-1">Tempo (anos)</label>
                    <input
                        type="number"
                        value={anos}
                        onChange={(e) => setAnos(parseInt(e.target.value))}
                        className="input-field"
                    />
                </div>
            </div>

            <button onClick={calcularCDB} className="btn">
                Calcular
            </button>

            {resultado && <Resultado valor={resultado} rendaMensal={rendaMensal} />}

            {dadosGrafico.length > 0 && (
                <div className="card mt-10">
                    <Line data={data} options={options} />
                </div>
            )}
        </div>
    );
}