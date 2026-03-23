import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { HandCoins, Search, Clock, AlertTriangle, CheckCircle } from "lucide-react";

interface Prestamo {
  id: string;
  componente: string;
  cantidad: number;
  fechaPrestamo: string;
  fechaLimite: string;
  estado: "activo" | "vencido" | "devuelto";
}

const mockPrestamos: Prestamo[] = [
  { id: "P001", componente: "Resistencia 1kΩ", cantidad: 10, fechaPrestamo: "2025-03-01", fechaLimite: "2025-03-15", estado: "activo" },
  { id: "P002", componente: "Capacitor 100µF", cantidad: 5, fechaPrestamo: "2025-02-20", fechaLimite: "2025-03-05", estado: "vencido" },
  { id: "P003", componente: "LED Rojo 5mm", cantidad: 20, fechaPrestamo: "2025-02-10", fechaLimite: "2025-02-25", estado: "devuelto" },
  { id: "P004", componente: "Arduino UNO R3", cantidad: 1, fechaPrestamo: "2025-03-05", fechaLimite: "2025-03-20", estado: "activo" },
  { id: "P005", componente: "Protoboard", cantidad: 2, fechaPrestamo: "2025-01-15", fechaLimite: "2025-02-01", estado: "devuelto" },
];

const estadoBadge: Record<string, { variant: "default" | "destructive" | "secondary"; label: string }> = {
  activo: { variant: "default", label: "Activo" },
  vencido: { variant: "destructive", label: "Vencido" },
  devuelto: { variant: "secondary", label: "Devuelto" },
};

const PrestamosModule = () => {
  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState<string>("todos");

  const filtered = mockPrestamos.filter((p) => {
    const matchSearch = p.componente.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
    const matchFiltro = filtro === "todos" || p.estado === filtro;
    return matchSearch && matchFiltro;
  });

  const activos = mockPrestamos.filter((p) => p.estado === "activo").length;
  const vencidos = mockPrestamos.filter((p) => p.estado === "vencido").length;
  const devueltos = mockPrestamos.filter((p) => p.estado === "devuelto").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <HandCoins className="w-7 h-7 text-primary" />
        <h2 className="text-xl font-bold text-foreground">Mis Préstamos</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><Clock className="w-5 h-5 text-primary" /><div><p className="text-2xl font-bold text-foreground">{activos}</p><p className="text-xs text-muted-foreground">Activos</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><AlertTriangle className="w-5 h-5 text-destructive" /><div><p className="text-2xl font-bold text-foreground">{vencidos}</p><p className="text-xs text-muted-foreground">Vencidos</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><CheckCircle className="w-5 h-5 text-accent" /><div><p className="text-2xl font-bold text-foreground">{devueltos}</p><p className="text-xs text-muted-foreground">Devueltos</p></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-base">Historial de Préstamos</CardTitle>
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {["todos", "activo", "vencido", "devuelto"].map((f) => (
                  <button key={f} onClick={() => setFiltro(f)} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filtro === f ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
              <div className="relative w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Buscar componente..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Componente</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Fecha Préstamo</TableHead>
                <TableHead>Fecha Límite</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.id}</TableCell>
                  <TableCell>{p.componente}</TableCell>
                  <TableCell>{p.cantidad}</TableCell>
                  <TableCell>{p.fechaPrestamo}</TableCell>
                  <TableCell>{p.fechaLimite}</TableCell>
                  <TableCell>
                    <Badge variant={estadoBadge[p.estado].variant}>{estadoBadge[p.estado].label}</Badge>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No se encontraron préstamos</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrestamosModule;
