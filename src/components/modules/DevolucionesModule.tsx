import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PackageSearch, Search, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Prestamo {
  id: string;
  usuario: string;
  cedula: string;
  componente: string;
  cantidad: number;
  fechaPrestamo: string;
  fechaLimite: string;
  estado: "activo" | "vencido";
}

const mockPrestamos: Prestamo[] = [
  { id: "P001", usuario: "Carlos García", cedula: "12345678", componente: "Resistencia 1kΩ", cantidad: 10, fechaPrestamo: "2025-03-01", fechaLimite: "2025-03-15", estado: "activo" },
  { id: "P002", usuario: "Ana Martínez", cedula: "11223344", componente: "Capacitor 100µF", cantidad: 5, fechaPrestamo: "2025-02-20", fechaLimite: "2025-03-05", estado: "vencido" },
  { id: "P003", usuario: "Luis Pérez", cedula: "55667788", componente: "LED Rojo 5mm", cantidad: 20, fechaPrestamo: "2025-03-05", fechaLimite: "2025-03-20", estado: "activo" },
  { id: "P004", usuario: "María López", cedula: "99887766", componente: "Arduino UNO R3", cantidad: 1, fechaPrestamo: "2025-02-28", fechaLimite: "2025-03-10", estado: "vencido" },
  { id: "P005", usuario: "Pedro Rojas", cedula: "44556677", componente: "Protoboard", cantidad: 2, fechaPrestamo: "2025-03-08", fechaLimite: "2025-03-22", estado: "activo" },
];

const DevolucionesModule = () => {
  const [prestamos, setPrestamos] = useState(mockPrestamos);
  const [search, setSearch] = useState("");
  const [selectedPrestamo, setSelectedPrestamo] = useState<Prestamo | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cantidadDevuelta, setCantidadDevuelta] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const filtered = prestamos.filter(
    (p) =>
      p.usuario.toLowerCase().includes(search.toLowerCase()) ||
      p.componente.toLowerCase().includes(search.toLowerCase()) ||
      p.cedula.includes(search)
  );

  const activos = prestamos.filter((p) => p.estado === "activo").length;
  const vencidos = prestamos.filter((p) => p.estado === "vencido").length;

  const handleDevolucion = () => {
    if (!selectedPrestamo) return;
    const cant = parseInt(cantidadDevuelta);
    if (isNaN(cant) || cant <= 0 || cant > selectedPrestamo.cantidad) {
      toast({ title: "Error", description: "Cantidad inválida", variant: "destructive" });
      return;
    }
    setPrestamos((prev) => prev.filter((p) => p.id !== selectedPrestamo.id));
    toast({ title: "Devolución registrada", description: `${selectedPrestamo.componente} devuelto por ${selectedPrestamo.usuario}` });
    setDialogOpen(false);
    setCantidadDevuelta("");
    setObservaciones("");
    setSelectedPrestamo(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <PackageSearch className="w-7 h-7 text-primary" />
        <h2 className="text-xl font-bold text-foreground">Devoluciones</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><Clock className="w-5 h-5 text-primary" /><div><p className="text-2xl font-bold text-foreground">{activos}</p><p className="text-xs text-muted-foreground">Activos</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><AlertTriangle className="w-5 h-5 text-destructive" /><div><p className="text-2xl font-bold text-foreground">{vencidos}</p><p className="text-xs text-muted-foreground">Vencidos</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><CheckCircle className="w-5 h-5 text-accent" /><div><p className="text-2xl font-bold text-foreground">{prestamos.length}</p><p className="text-xs text-muted-foreground">Total</p></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-base">Préstamos Pendientes</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar por usuario, cédula o componente..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Componente</TableHead>
                <TableHead>Cant.</TableHead>
                <TableHead>Fecha Préstamo</TableHead>
                <TableHead>Fecha Límite</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.id}</TableCell>
                  <TableCell>{p.usuario}</TableCell>
                  <TableCell>{p.componente}</TableCell>
                  <TableCell>{p.cantidad}</TableCell>
                  <TableCell>{p.fechaPrestamo}</TableCell>
                  <TableCell>{p.fechaLimite}</TableCell>
                  <TableCell>
                    <Badge variant={p.estado === "vencido" ? "destructive" : "default"}>
                      {p.estado === "vencido" ? "Vencido" : "Activo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" onClick={() => { setSelectedPrestamo(p); setCantidadDevuelta(String(p.cantidad)); setDialogOpen(true); }}>
                      Devolver
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No se encontraron préstamos</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Devolución</DialogTitle>
            <DialogDescription>Confirme los datos de la devolución del componente.</DialogDescription>
          </DialogHeader>
          {selectedPrestamo && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Usuario:</span> <span className="font-medium text-foreground">{selectedPrestamo.usuario}</span></div>
                <div><span className="text-muted-foreground">Componente:</span> <span className="font-medium text-foreground">{selectedPrestamo.componente}</span></div>
              </div>
              <div className="space-y-2">
                <Label>Cantidad a devolver (máx: {selectedPrestamo.cantidad})</Label>
                <Input type="number" min={1} max={selectedPrestamo.cantidad} value={cantidadDevuelta} onChange={(e) => setCantidadDevuelta(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Observaciones (opcional)</Label>
                <Input placeholder="Estado del componente, daños, etc." value={observaciones} onChange={(e) => setObservaciones(e.target.value)} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleDevolucion}>Confirmar Devolución</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DevolucionesModule;
