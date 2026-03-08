"use client";

import { useState } from "react";
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

export default function SimuladorCDB() {
  const [selic, setSelic] = useState<number>(13.75);
  const [aporte, setAporte] = useState<number>(1000);
  const [anos, setAnos] = useState<number>(5);
  const [resultado, setResultado] = useState<string | null>(null);
  const [rendaMensal, setRendaMensal] = useState<string | null>(null);
  const [dadosGrafico, setDadosGrafico] = useState<number[]>([]);

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

    const renda = valores[valores.length - 1] * 0.01; // 1% do valor final
    setRendaMensal(renda.toFixed(2));
  };

  const data = {
    labels: dadosGrafico.map((_, idx) => `Mês ${idx + 1}`),
    datasets: [
      {
        label: "CDB Acumulado",
        data: dadosGrafico,
        fill: true,
        backgroundColor: "rgba(16, 185, 129, 0.15)",
        borderColor: "#10B981",
        tension: 0.3,
        pointRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const, labels: { font: { size: 14 }, color: "#E5E7EB" } },
      tooltip: { mode: "index" as const, intersect: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#E5E7EB",
          callback: (tickValue: string | number) => {
            const num = typeof tickValue === "number" ? tickValue : parseFloat(tickValue);
            return `R$ ${num.toLocaleString()}`;
          },
        },
        grid: {
          color: "#374151", // linhas do grid
        },
      },
      x: {
        ticks: { color: "#E5E7EB", font: { size: 12 } },
        grid: {
          color: "#374151", // linhas do grid
        },
      },
    },
  };

  return (
    <main className="min-h-screen flex justify-center items-start bg-gray-900 p-6">
      <div className="w-full max-w-4xl bg-gray-800 rounded-xl p-8 shadow-lg shadow-black/50">
        {/* Título */}
        <h1 className="text-3xl font-extrabold text-white text-center mb-2 tracking-tight">
          Simulador de CDB
        </h1>
        <p className="text-center text-sm text-gray-400 mb-8">
          Desenvolvido por Bruno Leal
        </p>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Selic */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-200">Selic anual (%)</label>
            <input
              type="number"
              value={selic || ""}
              onChange={(e) => setSelic(parseFloat(e.target.value) || 0)}
              placeholder="13,75"
              className="w-full p-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-gray-700 text-white transition-all"
            />
          </div>

          {/* Investimento */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-200">Investimento/mês (R$)</label>
            <input
              type="number"
              value={aporte || ""}
              onChange={(e) => setAporte(parseFloat(e.target.value) || 0)}
              placeholder="1000"
              className="w-full p-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-gray-700 text-white transition-all"
            />
          </div>

          {/* Tempo */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-200">Tempo (anos)</label>
            <input
              type="number"
              value={anos || ""}
              onChange={(e) => setAnos(parseInt(e.target.value) || 0)}
              placeholder="5"
              className="w-full p-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-gray-700 text-white transition-all"
            />
          </div>
        </div>

        {/* Botão */}
        <button
          onClick={calcularCDB}
          className="w-full mt-8 bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-md shadow-black/50"
        >
          Calcular Rendimento
        </button>

        {/* Resultado */}
        {resultado && (
          <div className="mt-8 bg-gray-700 p-4 rounded-lg border border-gray-600">
            <p className="text-sm uppercase tracking-wider font-semibold text-gray-300">Resultado Estimado</p>
            <p className="text-3xl font-bold text-white mt-1">R$ {resultado}</p>
            {rendaMensal && (
              <p className="text-sm text-gray-300 mt-2">
                Renda Mensal Aproximada: R$ {rendaMensal}
              </p>
            )}
          </div>
        )}

        {/* Gráfico */}
        {dadosGrafico.length > 0 && (
          <div className="mt-10 p-6 bg-gray-700 rounded-lg border border-gray-600">
            <Line data={data} options={options} />
          </div>
        )}
      </div>
    </main>
  );
}