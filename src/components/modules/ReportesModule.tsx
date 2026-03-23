import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const prestamosPorMes = [
  { mes: "Ene", prestamos: 24 },
  { mes: "Feb", prestamos: 18 },
  { mes: "Mar", prestamos: 32 },
  { mes: "Abr", prestamos: 27 },
  { mes: "May", prestamos: 41 },
  { mes: "Jun", prestamos: 35 },
  { mes: "Jul", prestamos: 20 },
  { mes: "Ago", prestamos: 29 },
  { mes: "Sep", prestamos: 38 },
  { mes: "Oct", prestamos: 33 },
  { mes: "Nov", prestamos: 45 },
  { mes: "Dic", prestamos: 22 },
];

const componentesSolicitados = [
  { nombre: "Resistencias", cantidad: 85, fill: "hsl(213, 80%, 45%)" },
  { nombre: "Capacitores", cantidad: 62, fill: "hsl(170, 60%, 45%)" },
  { nombre: "Protoboard", cantidad: 48, fill: "hsl(45, 80%, 55%)" },
  { nombre: "Multímetro", cantidad: 37, fill: "hsl(340, 65%, 50%)" },
  { nombre: "Osciloscopio", cantidad: 25, fill: "hsl(270, 55%, 55%)" },
  { nombre: "Cables", cantidad: 70, fill: "hsl(140, 50%, 45%)" },
];

const COLORS = componentesSolicitados.map(c => c.fill);

const ReportesModule = () => {
  const totalPrestamos = prestamosPorMes.reduce((sum, m) => sum + m.prestamos, 0);
  const mesMax = prestamosPorMes.reduce((a, b) => (a.prestamos > b.prestamos ? a : b));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Reportes</h2>
        <p className="text-sm text-muted-foreground">Estadísticas de préstamos y componentes</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Total Préstamos (Año)</p>
          <p className="text-2xl font-bold text-foreground">{totalPrestamos}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Mes con más actividad</p>
          <p className="text-2xl font-bold text-foreground">{mesMax.mes} ({mesMax.prestamos})</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Componentes distintos</p>
          <p className="text-2xl font-bold text-foreground">{componentesSolicitados.length}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar chart */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-base font-semibold text-foreground mb-4">Préstamos por Mes</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={prestamosPorMes}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(216, 30%, 22%)" />
                <XAxis dataKey="mes" tick={{ fill: "hsl(215, 20%, 65%)", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(215, 20%, 65%)", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(216, 45%, 12%)",
                    border: "1px solid hsl(216, 30%, 22%)",
                    borderRadius: "8px",
                    color: "hsl(210, 40%, 98%)",
                  }}
                />
                <Bar dataKey="prestamos" fill="hsl(213, 80%, 45%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie chart */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-base font-semibold text-foreground mb-4">Componentes Más Solicitados</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={componentesSolicitados}
                  dataKey="cantidad"
                  nameKey="nombre"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ nombre, percent }) => `${nombre} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: "hsl(215, 20%, 65%)" }}
                >
                  {componentesSolicitados.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(216, 45%, 12%)",
                    border: "1px solid hsl(216, 30%, 22%)",
                    borderRadius: "8px",
                    color: "hsl(210, 40%, 98%)",
                  }}
                />
                <Legend
                  formatter={(value) => <span style={{ color: "hsl(215, 20%, 65%)" }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportesModule;
