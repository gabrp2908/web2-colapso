import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, Search, Edit, Power } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import BackButton from "@/components/BackButton";

interface Subsistema {
  id: string;
  nombre: string;
  descripcion: string;
  version: string;
  estado: "activo" | "inactivo" | "mantenimiento";
  modulos: number;
}

const mockSubsistemas: Subsistema[] = [
  { id: "SS-001", nombre: "Gestión de Préstamos", descripcion: "Administración de solicitudes y préstamos de componentes", version: "2.1.0", estado: "activo", modulos: 4 },
  { id: "SS-002", nombre: "Inventario", descripcion: "Control de stock y ubicación de componentes", version: "1.8.3", estado: "activo", modulos: 3 },
  { id: "SS-003", nombre: "Reportería", descripcion: "Generación de reportes y estadísticas", version: "1.5.1", estado: "activo", modulos: 2 },
  { id: "SS-004", nombre: "Notificaciones", descripcion: "Sistema de alertas y notificaciones a usuarios", version: "1.2.0", estado: "activo", modulos: 2 },
  { id: "SS-005", nombre: "Auditoría", descripcion: "Registro y seguimiento de actividades del sistema", version: "1.0.0", estado: "mantenimiento", modulos: 1 },
  { id: "SS-006", nombre: "Calendario Académico", descripcion: "Gestión de periodos y fechas académicas", version: "0.9.0", estado: "inactivo", modulos: 1 },
];

const estadoConfig: Record<string, { label: string; className: string }> = {
  activo: { label: "Activo", className: "bg-emerald-600 hover:bg-emerald-700" },
  inactivo: { label: "Inactivo", className: "bg-secondary text-secondary-foreground" },
  mantenimiento: { label: "Mantenimiento", className: "bg-amber-500 hover:bg-amber-600 text-white" },
};

const SubsistemaModule = ({ onBack }: { onBack: () => void }) => {
  const [subsistemas, setSubsistemas] = useState(mockSubsistemas);
  const [busqueda, setBusqueda] = useState("");

  const filtered = subsistemas.filter((s) => s.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  const toggleEstado = (ss: Subsistema) => {
    const nuevoEstado = ss.estado === "activo" ? "inactivo" : "activo";
    setSubsistemas((prev) => prev.map((s) => s.id === ss.id ? { ...s, estado: nuevoEstado } : s));
    toast({ title: `Subsistema ${nuevoEstado}`, description: `${ss.nombre} cambiado a ${nuevoEstado}.` });
  };

  return (
    <div className="space-y-6">
      <BackButton onClick={onBack} />
      <div className="flex items-center gap-3">
        <Settings className="w-6 h-6 text-accent" />
        <h2 className="text-xl font-bold text-foreground">Subsistemas</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total</p><p className="text-2xl font-bold text-foreground">{subsistemas.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Activos</p><p className="text-2xl font-bold text-emerald-500">{subsistemas.filter(s => s.estado === "activo").length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Módulos Totales</p><p className="text-2xl font-bold text-foreground">{subsistemas.reduce((a, s) => a + s.modulos, 0)}</p></CardContent></Card>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Buscar subsistema..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="pl-10" />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Versión</TableHead>
                <TableHead>Módulos</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((ss) => (
                <TableRow key={ss.id}>
                  <TableCell className="font-mono text-xs">{ss.id}</TableCell>
                  <TableCell className="font-medium">{ss.nombre}</TableCell>
                  <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">{ss.descripcion}</TableCell>
                  <TableCell><Badge variant="outline">{ss.version}</Badge></TableCell>
                  <TableCell>{ss.modulos}</TableCell>
                  <TableCell><Badge className={estadoConfig[ss.estado].className}>{estadoConfig[ss.estado].label}</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" onClick={() => toggleEstado(ss)}><Power className="w-3 h-3 mr-1" />{ss.estado === "activo" ? "Desactivar" : "Activar"}</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubsistemaModule;
