import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { HandCoins, Search, Clock, AlertTriangle, CheckCircle, Plus, Edit, Trash2, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import BackButton from "@/components/BackButton";

interface PrestamoAdmin {
  id: string;
  usuario: string;
  cedula: string;
  componente: string;
  cantidad: number;
  fechaPrestamo: string;
  fechaLimite: string;
  estado: "activo" | "vencido" | "devuelto" | "cancelado";
  aprobadoPor: string;
}

const initialPrestamos: PrestamoAdmin[] = [
  { id: "P001", usuario: "Carlos García", cedula: "12345678", componente: "Resistencia 1kΩ", cantidad: 10, fechaPrestamo: "2025-03-01", fechaLimite: "2025-03-15", estado: "activo", aprobadoPor: "Supervisor Pérez" },
  { id: "P002", usuario: "Ana Martínez", cedula: "11223344", componente: "Capacitor 100µF", cantidad: 5, fechaPrestamo: "2025-02-20", fechaLimite: "2025-03-05", estado: "vencido", aprobadoPor: "Supervisor López" },
  { id: "P003", usuario: "Luis Pérez", cedula: "55667788", componente: "LED Rojo 5mm", cantidad: 20, fechaPrestamo: "2025-02-10", fechaLimite: "2025-02-25", estado: "devuelto", aprobadoPor: "Supervisor Pérez" },
  { id: "P004", usuario: "María López", cedula: "99887766", componente: "Arduino UNO R3", cantidad: 1, fechaPrestamo: "2025-03-05", fechaLimite: "2025-03-20", estado: "activo", aprobadoPor: "Supervisor López" },
  { id: "P005", usuario: "Pedro Rojas", cedula: "44556677", componente: "Protoboard", cantidad: 2, fechaPrestamo: "2025-01-15", fechaLimite: "2025-02-01", estado: "cancelado", aprobadoPor: "Admin" },
];

const estadoBadge: Record<string, { variant: "default" | "destructive" | "secondary" | "outline"; label: string }> = {
  activo: { variant: "default", label: "Activo" },
  vencido: { variant: "destructive", label: "Vencido" },
  devuelto: { variant: "secondary", label: "Devuelto" },
  cancelado: { variant: "outline", label: "Cancelado" },
};

interface Props {
  onBack: () => void;
}

const PrestamosAdminModule = ({ onBack }: Props) => {
  const [prestamos, setPrestamos] = useState(initialPrestamos);
  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editando, setEditando] = useState<PrestamoAdmin | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<PrestamoAdmin | null>(null);

  const [form, setForm] = useState({ usuario: "", cedula: "", componente: "", cantidad: "1", fechaPrestamo: "", fechaLimite: "", estado: "activo" as PrestamoAdmin["estado"] });

  const filtered = prestamos.filter((p) => {
    const matchSearch = p.usuario.toLowerCase().includes(search.toLowerCase()) || p.componente.toLowerCase().includes(search.toLowerCase()) || p.cedula.includes(search);
    const matchFiltro = filtro === "todos" || p.estado === filtro;
    return matchSearch && matchFiltro;
  });

  const activos = prestamos.filter(p => p.estado === "activo").length;
  const vencidos = prestamos.filter(p => p.estado === "vencido").length;
  const totalUsuarios = new Set(prestamos.map(p => p.cedula)).size;

  const openNew = () => {
    setEditando(null);
    setForm({ usuario: "", cedula: "", componente: "", cantidad: "1", fechaPrestamo: "", fechaLimite: "", estado: "activo" });
    setDialogOpen(true);
  };

  const openEdit = (p: PrestamoAdmin) => {
    setEditando(p);
    setForm({ usuario: p.usuario, cedula: p.cedula, componente: p.componente, cantidad: String(p.cantidad), fechaPrestamo: p.fechaPrestamo, fechaLimite: p.fechaLimite, estado: p.estado });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.usuario || !form.cedula || !form.componente || !form.fechaPrestamo || !form.fechaLimite) {
      toast({ title: "Error", description: "Complete todos los campos obligatorios", variant: "destructive" });
      return;
    }
    if (editando) {
      setPrestamos(prev => prev.map(p => p.id === editando.id ? { ...p, ...form, cantidad: parseInt(form.cantidad) } : p));
      toast({ title: "Préstamo actualizado", description: `Préstamo ${editando.id} modificado exitosamente` });
    } else {
      const nuevo: PrestamoAdmin = { id: `P${String(prestamos.length + 1).padStart(3, "0")}`, ...form, cantidad: parseInt(form.cantidad), aprobadoPor: "Admin" };
      setPrestamos(prev => [...prev, nuevo]);
      toast({ title: "Préstamo registrado", description: `Nuevo préstamo creado para ${form.usuario}` });
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (!deleteDialog) return;
    setPrestamos(prev => prev.filter(p => p.id !== deleteDialog.id));
    toast({ title: "Préstamo eliminado", description: `Préstamo ${deleteDialog.id} eliminado` });
    setDeleteDialog(null);
  };

  return (
    <div className="space-y-6">
      <BackButton onClick={onBack} />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <HandCoins className="w-7 h-7 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Gestión de Préstamos</h2>
        </div>
        <Button onClick={openNew}><Plus className="w-4 h-4 mr-2" />Nuevo Préstamo</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><Clock className="w-5 h-5 text-primary" /><div><p className="text-2xl font-bold text-foreground">{activos}</p><p className="text-xs text-muted-foreground">Activos</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><AlertTriangle className="w-5 h-5 text-destructive" /><div><p className="text-2xl font-bold text-foreground">{vencidos}</p><p className="text-xs text-muted-foreground">Vencidos</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><Users className="w-5 h-5 text-accent" /><div><p className="text-2xl font-bold text-foreground">{totalUsuarios}</p><p className="text-xs text-muted-foreground">Usuarios</p></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-base">Todos los Préstamos</CardTitle>
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {["todos", "activo", "vencido", "devuelto", "cancelado"].map(f => (
                  <button key={f} onClick={() => setFiltro(f)} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filtro === f ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
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
                <TableHead>Usuario</TableHead>
                <TableHead>Cédula</TableHead>
                <TableHead>Componente</TableHead>
                <TableHead>Cant.</TableHead>
                <TableHead>Fecha Préstamo</TableHead>
                <TableHead>Fecha Límite</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Aprobado Por</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.id}</TableCell>
                  <TableCell className="font-medium">{p.usuario}</TableCell>
                  <TableCell className="text-xs">{p.cedula}</TableCell>
                  <TableCell>{p.componente}</TableCell>
                  <TableCell>{p.cantidad}</TableCell>
                  <TableCell>{p.fechaPrestamo}</TableCell>
                  <TableCell>{p.fechaLimite}</TableCell>
                  <TableCell><Badge variant={estadoBadge[p.estado].variant}>{estadoBadge[p.estado].label}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{p.aprobadoPor}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteDialog(p)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && <TableRow><TableCell colSpan={10} className="text-center text-muted-foreground py-8">No se encontraron préstamos</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editando ? "Editar Préstamo" : "Nuevo Préstamo"}</DialogTitle>
            <DialogDescription>{editando ? "Modifique los datos del préstamo." : "Complete los datos para registrar un nuevo préstamo."}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Usuario</Label><Input value={form.usuario} onChange={e => setForm({ ...form, usuario: e.target.value })} /></div>
            <div className="space-y-2"><Label>Cédula</Label><Input value={form.cedula} onChange={e => setForm({ ...form, cedula: e.target.value })} /></div>
            <div className="space-y-2"><Label>Componente</Label><Input value={form.componente} onChange={e => setForm({ ...form, componente: e.target.value })} /></div>
            <div className="space-y-2"><Label>Cantidad</Label><Input type="number" min={1} value={form.cantidad} onChange={e => setForm({ ...form, cantidad: e.target.value })} /></div>
            <div className="space-y-2"><Label>Fecha Préstamo</Label><Input type="date" value={form.fechaPrestamo} onChange={e => setForm({ ...form, fechaPrestamo: e.target.value })} /></div>
            <div className="space-y-2"><Label>Fecha Límite</Label><Input type="date" value={form.fechaLimite} onChange={e => setForm({ ...form, fechaLimite: e.target.value })} /></div>
            {editando && (
              <div className="space-y-2 col-span-2">
                <Label>Estado</Label>
                <Select value={form.estado} onValueChange={v => setForm({ ...form, estado: v as PrestamoAdmin["estado"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="vencido">Vencido</SelectItem>
                    <SelectItem value="devuelto">Devuelto</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>{editando ? "Guardar Cambios" : "Registrar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Préstamo</DialogTitle>
            <DialogDescription>¿Está seguro de eliminar el préstamo {deleteDialog?.id} de {deleteDialog?.usuario}? Esta acción no se puede deshacer.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PrestamosAdminModule;
