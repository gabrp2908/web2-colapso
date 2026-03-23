import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { CheckCircle, AlertTriangle, Clock, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Prestamo {
  id: string;
  componente: string;
  cantidad: number;
  fechaPrestamo: string;
  fechaLimite: string;
  estado: "activo" | "vencido" | "devuelto";
}

const mockPrestamos: Prestamo[] = [
  { id: "PRE-001", componente: "Arduino UNO R3", cantidad: 2, fechaPrestamo: "2026-02-20", fechaLimite: "2026-03-06", estado: "activo" },
  { id: "PRE-002", componente: "Multímetro Digital", cantidad: 1, fechaPrestamo: "2026-02-10", fechaLimite: "2026-02-24", estado: "vencido" },
  { id: "PRE-003", componente: "Protoboard 830 puntos", cantidad: 1, fechaPrestamo: "2026-02-15", fechaLimite: "2026-02-28", estado: "devuelto" },
  { id: "PRE-004", componente: "Cable Jumper M-M", cantidad: 10, fechaPrestamo: "2026-02-25", fechaLimite: "2026-03-10", estado: "activo" },
  { id: "PRE-005", componente: "Fuente de Poder 12V", cantidad: 1, fechaPrestamo: "2026-01-20", fechaLimite: "2026-02-03", estado: "devuelto" },
];

const estadoConfig: Record<Prestamo["estado"], { icon: React.ReactNode; class: string; label: string }> = {
  activo: { icon: <Clock className="w-3.5 h-3.5" />, class: "bg-amber-500/20 text-amber-400 border-amber-500/30", label: "Activo" },
  vencido: { icon: <AlertTriangle className="w-3.5 h-3.5" />, class: "bg-red-500/20 text-red-400 border-red-500/30", label: "Vencido" },
  devuelto: { icon: <CheckCircle className="w-3.5 h-3.5" />, class: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", label: "Devuelto" },
};

const SolvenciaModule = () => {
  const activos = mockPrestamos.filter((p) => p.estado === "activo").length;
  const vencidos = mockPrestamos.filter((p) => p.estado === "vencido").length;
  const devueltos = mockPrestamos.filter((p) => p.estado === "devuelto").length;
  const esSolvente = vencidos === 0 && activos === 0;

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-foreground">Estado de Solvencia</h2>

      {/* Status card */}
      <Card className={`border-2 ${esSolvente ? "border-emerald-500/40 bg-emerald-500/5" : "border-amber-500/40 bg-amber-500/5"}`}>
        <CardHeader className="pb-2 flex-row items-center gap-3 space-y-0">
          <ShieldCheck className={`w-8 h-8 ${esSolvente ? "text-emerald-400" : "text-amber-400"}`} />
          <div>
            <CardTitle className="text-lg">
              {esSolvente ? "Solvente" : "No Solvente"}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5">
              {esSolvente
                ? "No tienes préstamos pendientes. Puedes solicitar nuevos componentes."
                : `Tienes ${activos} préstamo(s) activo(s) y ${vencidos} vencido(s). Devuélvelos para estar solvente.`}
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <p className="text-2xl font-bold text-amber-400">{activos}</p>
            <p className="text-xs text-muted-foreground mt-1">Activos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <p className="text-2xl font-bold text-red-400">{vencidos}</p>
            <p className="text-xs text-muted-foreground mt-1">Vencidos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">{devueltos}</p>
            <p className="text-xs text-muted-foreground mt-1">Devueltos</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead>ID</TableHead>
              <TableHead>Componente</TableHead>
              <TableHead className="text-center">Cant.</TableHead>
              <TableHead>Préstamo</TableHead>
              <TableHead>Límite</TableHead>
              <TableHead className="text-center">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockPrestamos.map((p) => {
              const cfg = estadoConfig[p.estado];
              return (
                <TableRow key={p.id} className="border-border">
                  <TableCell className="font-mono text-accent">{p.id}</TableCell>
                  <TableCell className="font-medium">{p.componente}</TableCell>
                  <TableCell className="text-center">{p.cantidad}</TableCell>
                  <TableCell className="text-muted-foreground">{p.fechaPrestamo}</TableCell>
                  <TableCell className="text-muted-foreground">{p.fechaLimite}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={`gap-1 ${cfg.class}`}>
                      {cfg.icon} {cfg.label}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SolvenciaModule;
