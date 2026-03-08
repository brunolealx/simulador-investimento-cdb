// /app/components/Resultado.tsx
type ResultadoProps = {
    valor: string;
    rendaMensal?: string | null; // opcional
};

export default function Resultado({ valor, rendaMensal }: ResultadoProps) {
    return (
        <div className="mt-6 bg-green-50 border-l-4 border-green-500 p-6 rounded-xl text-gray-800">
            <p className="text-lg font-semibold">
                Valor final acumulado: <span className="text-green-700">R$ {valor}</span>
            </p>
            {rendaMensal && (
                <p className="mt-2 text-lg font-medium">
                    Renda mensal estimada: <span className="text-yellow-700">R$ {rendaMensal}</span>
                </p>
            )}
        </div>
    );
}