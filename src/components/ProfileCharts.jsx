import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];

export function ProfileCharts({ profileData, totalResponses }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / totalResponses) * 100).toFixed(1);
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-sm text-blue-600">
            Respostas: {data.value} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const prepareChartData = (data) => {
    return Object.entries(data).map(([key, value]) => ({
      name: key,
      value: value,
      percentage: ((value / totalResponses) * 100).toFixed(1)
    }));
  };

  const sexoData = prepareChartData(profileData.sexo || {});
  const idadeData = prepareChartData(profileData.idade || {});
  const escolaridadeData = prepareChartData(profileData.escolaridade || {});
  const funcionarioData = prepareChartData(profileData.funcionarioPublico || {});

  return (
    <div className="space-y-6">
      {/* Sexo */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Distribuição por Sexo
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Histograma */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Frequência</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={sexoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Pizza */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Percentual</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={sexoData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {sexoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Idade */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Distribuição por Idade
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={idadeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Escolaridade */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Distribuição por Escolaridade
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={escolaridadeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 11 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Funcionário Público */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Funcionário Público
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Histograma */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Frequência</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={funcionarioData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Pizza */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Percentual</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={funcionarioData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {funcionarioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Resumo Estatístico */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Resumo do Perfil dos Respondentes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{totalResponses}</p>
            <p className="text-sm text-gray-600">Total de Respostas</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {Object.keys(profileData.sexo || {}).length}
            </p>
            <p className="text-sm text-gray-600">Categorias de Sexo</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">
              {Object.keys(profileData.escolaridade || {}).length}
            </p>
            <p className="text-sm text-gray-600">Níveis de Escolaridade</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              {Object.keys(profileData.idade || {}).length}
            </p>
            <p className="text-sm text-gray-600">Faixas Etárias</p>
          </div>
        </div>
      </div>
    </div>
  );
}

