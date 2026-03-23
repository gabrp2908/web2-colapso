import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { PackageSearch, Search, CheckCircle, Clock, AlertTriangle, RotateCcw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import BackButton from "@/components/BackButton";

interface Devolucion {
  id: string;
  prestamoId: string;
  usuario: string;
  cedula: string;
  componente: string;
  cantidadPrestada: number;
  cantidadDevuelta: number;
  fechaDevolucion: string;
  estado: "completa" | "parcial" | "pendiente" | "con_daños";
  observaciones: string;
  recibidoPor: string;
}

const initialDevoluciones: Devolucion[] = [
  { id: "D001", prestamoId: "P003", usuario: "Luis Pérez", cedula: "55667788", componente: "LED Rojo 5mm", cantidadPrestada: 20, cantidadDevuelta: 20, fechaDevolucion: "2025-02-24", estado: "completa", observaciones: "En buen estado", recibidoPor: "Supervisor Pérez" },
  { id: "D002", prestamoId: "P005", usuario: "Pedro Rojas", cedula: "44556677", componente: "Protoboard", cantidadPrestada: 2, cantidadDevuelta: 1, fechaDevolucion: "2025-01-30", estado: "parcial", observaciones: "Falta 1 unidad", recibidoPor: "Supervisor López" },
  { id: "D003", prestamoId: "P002", usuario: "Ana Martínez", cedula: "11223344", componente: "Capacitor 100µF", cantidadPrestada: 5, cantidadDevuelta: 0, fechaDevolucion: "", estado: "pendiente", observaciones: "", recibidoPor: "" },
  { id: "D004", prestamoId: "P006", usuario: "Rosa Díaz", cedula: "33445566", componente: "Multímetro Fluke", cantidadPrestada: 1, cantidadDevuelta: 1, fechaDevolucion: "2025-03-10", estado: "con_daños", observaciones: "Pantalla con rayones, cable dañado", recibidoPor: "Supervisor Pérez" },
];

const estadoConfig: Record<string, { variant: "default" | "destructive" | "secondary" | "outline"; label: string }> = {
  completa: { variant: "default", label: "Completa" },
  parcial: { variant: "outline", label: "Parcial" },
  pendiente: { variant: "secondary", label: "Pendiente" },
  con_daños: { variant: "destructive", label: "Con Daños" },
};

interface Props {
  onBack: () => void;
}

const DevolucionesAdminModule = ({ onBack }: Props) => {
  const [devoluciones, setDevoluciones] = useState(initialDevoluciones);
  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState<Devolucion | null>(null);

  const [form, setForm] = useState({ cantidadDevuelta: "", fechaDevolucion: "", estado: "completa" as Devolucion["estado"], observaciones: "", recibidoPor: "" });

  const filtered = devoluciones.filter(d => {
    const matchSearch = d.usuario.toLowerCase().includes(search.toLowerCase()) || d.componente.toLowerCase().includes(search.toLowerCase()) || d.cedula.includes(search);
    const matchFiltro = filtro === "todos" || d.estado === filtro;
    return matchSearch && matchFiltro;
  });

  const completas = devoluciones.filter(d => d.estado === "completa").length;
  const pendientes = devoluciones.filter(d => d.estado === "pendiente").length;
  const conDaños = devoluciones.filter(d => d.estado === "con_daños").length;

  const openProcess = (d: Devolucion) => {
    setSelected(d);
    setForm({
      cantidadDevuelta: String(d.cantidadDevuelta || d.cantidadPrestada),
      fechaDevolucion: d.fechaDevolucion || new Date().toISOString().split("T")[0],
      estado: d.estado === "pendiente" ? "completa" : d.estado,
      observaciones: d.observaciones,
      recibidoPor: d.recibidoPor || "Admin",
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!selected) return;
    const cant = parseInt(form.cantidadDevuelta);
    if (isNaN(cant) || cant < 0 || cant > selected.cantidadPrestada) {
      toast({ title: "Error", description: "Cantidad inválida", variant: "destructive" });
      return;
    }
    setDevoluciones(prev => prev.map(d => d.id === selected.id ? {
      ...d,
      cantidadDevuelta: cant,
      fechaDevolucion: form.fechaDevolucion,
      estado: form.estado,
      observaciones: form.observaciones,
      recibidoPor: form.recibidoPor || "Admin",
    } : d));
    toast({ title: "Devolución actualizada", description: `Devolución ${selected.id} procesada exitosamente` });
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <BackButton onClick={onBack} />
      <div className="flex items-center gap-3">
        <PackageSearch className="w-7 h-7 text-primary" />
        <h2 className="text-xl font-bold text-foreground">Gestión de Devoluciones</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><CheckCircle className="w-5 h-5 text-primary" /><div><p className="text-2xl font-bold text-foreground">{completas}</p><p className="text-xs text-muted-foreground">Completas</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><Clock className="w-5 h-5 text-accent" /><div><p className="text-2xl font-bold text-foreground">{pendientes}</p><p className="text-xs text-muted-foreground">Pendientes</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><AlertTriangle className="w-5 h-5 text-destructive" /><div><p className="text-2xl font-bold text-foreground">{conDaños}</p><p className="text-xs text-muted-foreground">Con Daños</p></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-base">Registro de Devoluciones</CardTitle>
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {["todos", "completa", "parcial", "pendiente", "con_daños"].map(f => (
                  <button key={f} onClick={() => setFiltro(f)} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filtro === f ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
                    {f === "con_daños" ? "Con Daños" : f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
              <div className="relative w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Buscar..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Préstamo</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Componente</TableHead>
                <TableHead>Prestada</TableHead>
                <TableHead>Devuelta</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Recibido Por</TableHead>
                <TableHead>Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(d => (
                <TableRow key={d.id}>
                  <TableCell className="font-mono text-xs">{d.id}</TableCell>
                  <TableCell className="font-mono text-xs">{d.prestamoId}</TableCell>
                  <TableCell className="font-medium">{d.usuario}</TableCell>
                  <TableCell>{d.componente}</TableCell>
                  <TableCell>{d.cantidadPrestada}</TableCell>
                  <TableCell>{d.cantidadDevuelta}</TableCell>
                  <TableCell>{d.fechaDevolucion || "—"}</TableCell>
                  <TableCell><Badge variant={estadoConfig[d.estado].variant}>{estadoConfig[d.estado].label}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{d.recibidoPor || "—"}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => openProcess(d)}>
                      <RotateCcw className="w-3.5 h-3.5 mr-1" />Procesar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && <TableRow><TableCell colSpan={10} className="text-center text-muted-foreground py-8">No se encontraron devoluciones</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Procesar Devolución</DialogTitle>
            <DialogDescription>Actualice los datos de la devolución de {selected?.componente} por {selected?.usuario}.</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cantidad Devuelta (máx: {selected.cantidadPrestada})</Label>
                <Input type="number" min={0} max={selected.cantidadPrestada} value={form.cantidadDevuelta} onChange={e => setForm({ ...form, cantidadDevuelta: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Fecha Devolución</Label>
                <Input type="date" value={form.fechaDevolucion} onChange={e => setForm({ ...form, fechaDevolucion: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Estado</Label>
                <Select value={form.estado} onValueChange={v => setForm({ ...form, estado: v as Devolucion["estado"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completa">Completa</SelectItem>
                    <SelectItem value="parcial">Parcial</SelectItem>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="con_daños">Con Daños</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Recibido Por</Label>
                <Input value={form.recibidoPor} onChange={e => setForm({ ...form, recibidoPor: e.target.value })} />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Observaciones</Label>
                <Input placeholder="Estado del componente, daños, etc." value={form.observaciones} onChange={e => setForm({ ...form, observaciones: e.target.value })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DevolucionesAdminModule;
