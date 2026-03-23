import { useState } from "react";
import { MapPin, Search, Layers, Box } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Ubicacion {
  id: string;
  componente: string;
  cantidad: number;
  laboratorio: string;
  estante: string;
  nivel: string;
  estado: "disponible" | "ocupado" | "mantenimiento";
}

const mockUbicaciones: Ubicacion[] = [
  { id: "U001", componente: "Resistencias 1kΩ", cantidad: 120, laboratorio: "Lab A", estante: "E1", nivel: "Nivel 2", estado: "disponible" },
  { id: "U002", componente: "Capacitores 100µF", cantidad: 45, laboratorio: "Lab A", estante: "E2", nivel: "Nivel 1", estado: "disponible" },
  { id: "U003", componente: "Protoboard", cantidad: 8, laboratorio: "Lab B", estante: "E1", nivel: "Nivel 3", estado: "ocupado" },
  { id: "U004", componente: "Multímetro Fluke", cantidad: 5, laboratorio: "Lab B", estante: "E3", nivel: "Nivel 1", estado: "mantenimiento" },
  { id: "U005", componente: "Osciloscopio Rigol", cantidad: 3, laboratorio: "Lab C", estante: "E1", nivel: "Nivel 1", estado: "disponible" },
  { id: "U006", componente: "Cables Banana", cantidad: 60, laboratorio: "Lab A", estante: "E3", nivel: "Nivel 2", estado: "disponible" },
  { id: "U007", componente: "Fuente de Poder", cantidad: 4, laboratorio: "Lab C", estante: "E2", nivel: "Nivel 1", estado: "ocupado" },
  { id: "U008", componente: "Generador de Señales", cantidad: 2, laboratorio: "Lab C", estante: "E1", nivel: "Nivel 2", estado: "disponible" },
  { id: "U009", componente: "LEDs surtidos", cantidad: 200, laboratorio: "Lab A", estante: "E1", nivel: "Nivel 1", estado: "disponible" },
  { id: "U010", componente: "Transistores 2N2222", cantidad: 0, laboratorio: "Lab B", estante: "E2", nivel: "Nivel 3", estado: "mantenimiento" },
];

const laboratorios = ["Todos", "Lab A", "Lab B", "Lab C"];

const estadoBadge: Record<Ubicacion["estado"], { label: string; className: string }> = {
  disponible: { label: "Disponible", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  ocupado: { label: "Ocupado", className: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  mantenimiento: { label: "Mantenimiento", className: "bg-red-500/15 text-red-400 border-red-500/30" },
};

const UbicacionModule = () => {
  const [busqueda, setBusqueda] = useState("");
  const [labFiltro, setLabFiltro] = useState("Todos");

  const filtered = mockUbicaciones.filter((u) => {
    const matchBusqueda = u.componente.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.estante.toLowerCase().includes(busqueda.toLowerCase());
    const matchLab = labFiltro === "Todos" || u.laboratorio === labFiltro;
    return matchBusqueda && matchLab;
  });

  const resumen = {
    total: mockUbicaciones.length,
    disponibles: mockUbicaciones.filter((u) => u.estado === "disponible").length,
    ocupados: mockUbicaciones.filter((u) => u.estado === "ocupado").length,
    mantenimiento: mockUbicaciones.filter((u) => u.estado === "mantenimiento").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Ubicación de Componentes</h2>
        <p className="text-sm text-muted-foreground">Localización física de componentes en los laboratorios</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Box className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Total</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{resumen.total}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <p className="text-sm text-muted-foreground">Disponibles</p>
          </div>
          <p className="text-2xl font-bold text-emerald-400">{resumen.disponibles}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-4 h-4 text-amber-400" />
            <p className="text-sm text-muted-foreground">Ocupados</p>
          </div>
          <p className="text-2xl font-bold text-amber-400">{resumen.ocupados}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-4 h-4 text-red-400" />
            <p className="text-sm text-muted-foreground">Mantenimiento</p>
          </div>
          <p className="text-2xl font-bold text-red-400">{resumen.mantenimiento}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar componente o estante..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-9 bg-card border-border"
          />
        </div>
        <div className="flex gap-2">
          {laboratorios.map((lab) => (
            <button
              key={lab}
              onClick={() => setLabFiltro(lab)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                labFiltro === lab
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-foreground hover:bg-secondary"
              }`}
            >
              {lab}
            </button>
          ))}
        </div>
      </div>

      {/* Location cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((u) => (
          <div
            key={u.id}
            className="bg-card border border-border rounded-xl p-4 hover:border-accent transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-foreground text-sm">{u.componente}</h3>
              <Badge variant="outline" className={estadoBadge[u.estado].className}>
                {estadoBadge[u.estado].label}
              </Badge>
            </div>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" />
                <span>{u.laboratorio} → {u.estante} → {u.nivel}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Box className="w-3.5 h-3.5" />
                <span>Cantidad: <span className="text-foreground font-medium">{u.cantidad}</span></span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No se encontraron componentes con los filtros aplicados.
        </div>
      )}
    </div>
  );
};

export default UbicacionModule;
