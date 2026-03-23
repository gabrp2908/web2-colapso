import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area } from "recharts";
import { BarChart3, Download, TrendingUp, Users, Package, AlertTriangle } from "lucide-react";
import BackButton from "@/components/BackButton";

const prestamosPorMes = [
  { mes: "Ene", prestamos: 24, devoluciones: 20 },
  { mes: "Feb", prestamos: 18, devoluciones: 16 },
  { mes: "Mar", prestamos: 32, devoluciones: 28 },
  { mes: "Abr", prestamos: 27, devoluciones: 25 },
  { mes: "May", prestamos: 41, devoluciones: 35 },
  { mes: "Jun", prestamos: 35, devoluciones: 33 },
  { mes: "Jul", prestamos: 20, devoluciones: 18 },
  { mes: "Ago", prestamos: 29, devoluciones: 27 },
  { mes: "Sep", prestamos: 38, devoluciones: 34 },
  { mes: "Oct", prestamos: 33, devoluciones: 30 },
  { mes: "Nov", prestamos: 45, devoluciones: 40 },
  { mes: "Dic", prestamos: 22, devoluciones: 20 },
];

const componentesSolicitados = [
  { nombre: "Resistencias", cantidad: 85, fill: "hsl(var(--primary))" },
  { nombre: "Capacitores", cantidad: 62, fill: "hsl(170, 60%, 45%)" },
  { nombre: "Protoboard", cantidad: 48, fill: "hsl(45, 80%, 55%)" },
  { nombre: "Multímetro", cantidad: 37, fill: "hsl(340, 65%, 50%)" },
  { nombre: "Osciloscopio", cantidad: 25, fill: "hsl(270, 55%, 55%)" },
  { nombre: "Cables", cantidad: 70, fill: "hsl(140, 50%, 45%)" },
];

const usuariosActivos = [
  { mes: "Ene", usuarios: 15 }, { mes: "Feb", usuarios: 12 }, { mes: "Mar", usuarios: 22 },
  { mes: "Abr", usuarios: 18 }, { mes: "May", usuarios: 28 }, { mes: "Jun", usuarios: 25 },
  { mes: "Jul", usuarios: 14 }, { mes: "Ago", usuarios: 20 }, { mes: "Sep", usuarios: 26 },
  { mes: "Oct", usuarios: 23 }, { mes: "Nov", usuarios: 30 }, { mes: "Dic", usuarios: 16 },
];

const incidenciasPorMes = [
  { mes: "Ene", daños: 2, perdidas: 1 }, { mes: "Feb", daños: 1, perdidas: 0 }, { mes: "Mar", daños: 3, perdidas: 1 },
  { mes: "Abr", daños: 0, perdidas: 0 }, { mes: "May", daños: 4, perdidas: 2 }, { mes: "Jun", daños: 2, perdidas: 1 },
  { mes: "Jul", daños: 1, perdidas: 0 }, { mes: "Ago", daños: 2, perdidas: 1 }, { mes: "Sep", daños: 3, perdidas: 0 },
  { mes: "Oct", daños: 1, perdidas: 1 }, { mes: "Nov", daños: 5, perdidas: 2 }, { mes: "Dic", daños: 1, perdidas: 0 },
];

const COLORS = componentesSolicitados.map(c => c.fill);

const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  color: "hsl(var(--foreground))",
};

interface Props {
  onBack: () => void;
}

const ReportesAdminModule = ({ onBack }: Props) => {
  const [periodo, setPeriodo] = useState("anual");

  const totalPrestamos = prestamosPorMes.reduce((s, m) => s + m.prestamos, 0);
  const totalDevoluciones = prestamosPorMes.reduce((s, m) => s + m.devoluciones, 0);
  const tasaDevolucion = ((totalDevoluciones / totalPrestamos) * 100).toFixed(1);
  const totalIncidencias = incidenciasPorMes.reduce((s, m) => s + m.daños + m.perdidas, 0);

  return (
    <div className="space-y-6">
      <BackButton onClick={onBack} />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-7 h-7 text-primary" />
          <div>
            <h2 className="text-xl font-bold text-foreground">Reportes y Estadísticas</h2>
            <p className="text-sm text-muted-foreground">Panel administrativo de métricas del sistema</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="mensual">Mensual</SelectItem>
              <SelectItem value="trimestral">Trimestral</SelectItem>
              <SelectItem value="anual">Anual</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline"><Download className="w-4 h-4 mr-2" />Exportar</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><TrendingUp className="w-5 h-5 text-primary" /><div><p className="text-2xl font-bold text-foreground">{totalPrestamos}</p><p className="text-xs text-muted-foreground">Préstamos Totales</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><Package className="w-5 h-5 text-accent" /><div><p className="text-2xl font-bold text-foreground">{tasaDevolucion}%</p><p className="text-xs text-muted-foreground">Tasa Devolución</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><Users className="w-5 h-5 text-primary" /><div><p className="text-2xl font-bold text-foreground">{usuariosActivos.reduce((s, m) => s + m.usuarios, 0)}</p><p className="text-xs text-muted-foreground">Usuarios Activos (Año)</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><AlertTriangle className="w-5 h-5 text-destructive" /><div><p className="text-2xl font-bold text-foreground">{totalIncidencias}</p><p className="text-xs text-muted-foreground">Incidencias</p></div></CardContent></Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Préstamos vs Devoluciones */}
        <Card className="p-5">
          <h3 className="text-base font-semibold text-foreground mb-4">Préstamos vs Devoluciones</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={prestamosPorMes}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="mes" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Bar dataKey="prestamos" name="Préstamos" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="devoluciones" name="Devoluciones" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Componentes más solicitados */}
        <Card className="p-5">
          <h3 className="text-base font-semibold text-foreground mb-4">Componentes Más Solicitados</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={componentesSolicitados} dataKey="cantidad" nameKey="nombre" cx="50%" cy="50%" outerRadius={90} label={({ nombre, percent }) => `${nombre} ${(percent * 100).toFixed(0)}%`} labelLine={{ stroke: "hsl(var(--muted-foreground))" }}>
                  {componentesSolicitados.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend formatter={v => <span className="text-muted-foreground">{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Usuarios activos */}
        <Card className="p-5">
          <h3 className="text-base font-semibold text-foreground mb-4">Usuarios Activos por Mes</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usuariosActivos}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="mes" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="usuarios" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Incidencias */}
        <Card className="p-5">
          <h3 className="text-base font-semibold text-foreground mb-4">Incidencias (Daños y Pérdidas)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={incidenciasPorMes}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="mes" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Line type="monotone" dataKey="daños" name="Daños" stroke="hsl(var(--destructive))" strokeWidth={2} />
                <Line type="monotone" dataKey="perdidas" name="Pérdidas" stroke="hsl(45, 80%, 55%)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReportesAdminModule;
