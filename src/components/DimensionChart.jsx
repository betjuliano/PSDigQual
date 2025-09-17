import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function DimensionChart({ dimensionAverages, goals }) {
  const data = [
    {
      name: 'Qualidade do Sistema (QS)',
      'Média Atual': dimensionAverages.QS || 0,
      'Meta': goals.QS || 4,
      dimension: 'QS'
    },
    {
      name: 'Qualidade da Operação (QO)',
      'Média Atual': dimensionAverages.QO || 0,
      'Meta': goals.QO || 4,
      dimension: 'QO'
    },
    {
      name: 'Qualidade da Informação (QI)',
      'Média Atual': dimensionAverages.QI || 0,
      'Meta': goals.QI || 4,
      dimension: 'QI'
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Avaliação por Dimensão
      </h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            interval={0}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            domain={[0, 5]}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="Média Atual" 
            fill="#3b82f6" 
            radius={[4, 4, 0, 0]}
            name="Média Atual"
          />
          <Bar 
            dataKey="Meta" 
            fill="#93c5fd" 
            radius={[4, 4, 0, 0]}
            name="Meta"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

