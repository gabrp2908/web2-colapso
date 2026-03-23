import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wrench, Search, Plus, Pencil, Trash2, Package, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface RegistroInventario {
  id: string;
  codigo: string;
  nombre: string;
  tipo: "equipo" | "componente";
  cantidad: number;
  ubicacion: string;
  estado: "disponible" | "prestado" | "mantenimiento" | "agotado";
  descripcion: string;
}

const datosIniciales: RegistroInventario[] = [
  { id: "1", codigo: "RES-001", nombre: "Resistencia 1kΩ", tipo: "componente", cantidad: 150, ubicacion: "Estante A-1", estado: "disponible", descripcion: "Resistencia de carbón 1/4W" },
  { id: "2", codigo: "CAP-002", nombre: "Capacitor 100µF", tipo: "componente", cantidad: 80, ubicacion: "Estante A-2", estado: "disponible", descripcion: "Capacitor electrolítico 25V" },
  { id: "3", codigo: "OSC-007", nombre: "Osciloscopio Rigol", tipo: "equipo", cantidad: 2, ubicacion: "Mesa Central", estado: "mantenimiento", descripcion: "Osciloscopio digital 100MHz 2 canales" },
  { id: "4", codigo: "MUL-006", nombre: "Multímetro Digital", tipo: "equipo", cantidad: 10, ubicacion: "Gabinete D-1", estado: "disponible", descripcion: "Multímetro Fluke True RMS" },
  { id: "5", codigo: "ARD-010", nombre: "Arduino UNO R3", tipo: "equipo", cantidad: 15, ubicacion: "Gabinete C-2", estado: "disponible", descripcion: "Placa de desarrollo Arduino UNO Rev3" },
  { id: "6", codigo: "LED-003", nombre: "LED Rojo 5mm", tipo: "componente", cantidad: 0, ubicacion: "Estante B-1", estado: "agotado", descripcion: "LED indicador rojo difuso" },
  { id: "7", codigo: "PRO-005", nombre: "Protoboard 830 puntos", tipo: "equipo", cantidad: 5, ubicacion: "Gabinete C-1", estado: "prestado", descripcion: "Protoboard de 830 puntos de contacto" },
  { id: "8", codigo: "FUE-009", nombre: "Fuente de Poder 12V", tipo: "equipo", cantidad: 8, ubicacion: "Gabinete D-2", estado: "prestado", descripcion: "Fuente regulada 12V 5A" },
];

const estadoConfig: Record<RegistroInventario["estado"], { label: string; className: string }> = {
  disponible: { label: "Disponible", className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  prestado: { label: "Prestado", className: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  mantenimiento: { label: "Mantenimiento", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  agotado: { label: "Agotado", className: "bg-red-500/20 text-red-400 border-red-500/30" },
};

const registroVacio: Omit<RegistroInventario, "id"> = {
  codigo: "", nombre: "", tipo: "componente", cantidad: 0, ubicacion: "", estado: "disponible", descripcion: "",
};

const MantenimientoModule = () => {
  const [registros, setRegistros] = useState<RegistroInventario[]>(datosIniciales);
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroEstado, setFiltroEstado] = useState("todos");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [registroActual, setRegistroActual] = useState<Omit<RegistroInventario, "id"> & { id?: string }>(registroVacio);
  const [registroEliminar, setRegistroEliminar] = useState<RegistroInventario | null>(null);

  const filtered = registros.filter((r) => {
    const matchBusqueda = r.nombre.toLowerCase().includes(busqueda.toLowerCase()) || r.codigo.toLowerCase().includes(busqueda.toLowerCase());
    const matchTipo = filtroTipo === "todos" || r.tipo === filtroTipo;
    const matchEstado = filtroEstado === "todos" || r.estado === filtroEstado;
    return matchBusqueda && matchTipo && matchEstado;
  });

  const handleNuevo = () => {
    setModoEdicion(false);
    setRegistroActual({ ...registroVacio });
    setDialogOpen(true);
  };

  const handleEditar = (reg: RegistroInventario) => {
    setModoEdicion(true);
    setRegistroActual({ ...reg });
    setDialogOpen(true);
  };

  const handleEliminar = (reg: RegistroInventario) => {
    setRegistroEliminar(reg);
    setDeleteDialogOpen(true);
  };

  const confirmarEliminar = () => {
    if (!registroEliminar) return;
    setRegistros((prev) => prev.filter((r) => r.id !== registroEliminar.id));
    setDeleteDialogOpen(false);
    toast({ title: "Registro eliminado", description: `"${registroEliminar.nombre}" fue eliminado del inventario.` });
    setRegistroEliminar(null);
  };

  const handleGuardar = () => {
    if (!registroActual.codigo.trim() || !registroActual.nombre.trim()) {
      toast({ title: "Error", description: "Código y nombre son obligatorios.", variant: "destructive" });
      return;
    }

    if (modoEdicion && registroActual.id) {
      setRegistros((prev) =>
        prev.map((r) => (r.id === registroActual.id ? { ...registroActual, id: registroActual.id } as RegistroInventario : r))
      );
      toast({ title: "Registro actualizado", description: `"${registroActual.nombre}" fue modificado correctamente.` });
    } else {
      const nuevo: RegistroInventario = {
        ...registroActual,
        id: crypto.randomUUID(),
      };
      setRegistros((prev) => [...prev, nuevo]);
      toast({ title: "Registro agregado", description: `"${registroActual.nombre}" fue añadido al inventario.` });
    }
    setDialogOpen(false);
  };

  const counts = {
    total: registros.length,
    equipos: registros.filter((r) => r.tipo === "equipo").length,
    componentes: registros.filter((r) => r.tipo === "componente").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Wrench className="w-6 h-6 text-accent" />
          <h2 className="text-xl font-bold text-foreground">Mantenimiento de Inventario</h2>
        </div>
        <Button onClick={handleNuevo} className="gap-2">
          <Plus className="w-4 h-4" /> Agregar Registro
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <Package className="w-8 h-8 text-accent" />
            <div>
              <p className="text-2xl font-bold text-foreground">{counts.total}</p>
              <p className="text-sm text-muted-foreground">Total Registros</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <Wrench className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold text-foreground">{counts.equipos}</p>
              <p className="text-sm text-muted-foreground">Equipos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <Package className="w-8 h-8 text-emerald-500" />
            <div>
              <p className="text-2xl font-bold text-foreground">{counts.componentes}</p>
              <p className="text-sm text-muted-foreground">Componentes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar por código o nombre..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="pl-10" />
        </div>
        <Select value={filtroTipo} onValueChange={setFiltroTipo}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Tipo" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los tipos</SelectItem>
            <SelectItem value="equipo">Equipos</SelectItem>
            <SelectItem value="componente">Componentes</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filtroEstado} onValueChange={setFiltroEstado}>
          <SelectTrigger className="w-[170px]"><SelectValue placeholder="Estado" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los estados</SelectItem>
            <SelectItem value="disponible">Disponible</SelectItem>
            <SelectItem value="prestado">Prestado</SelectItem>
            <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
            <SelectItem value="agotado">Agotado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-center">Cantidad</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((reg) => (
                <TableRow key={reg.id}>
                  <TableCell className="font-mono text-xs text-accent">{reg.codigo}</TableCell>
                  <TableCell className="font-medium">{reg.nombre}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={reg.tipo === "equipo" ? "border-blue-500/30 text-blue-400" : "border-emerald-500/30 text-emerald-400"}>
                      {reg.tipo === "equipo" ? "Equipo" : "Componente"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">{reg.cantidad}</TableCell>
                  <TableCell className="text-muted-foreground">{reg.ubicacion}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={estadoConfig[reg.estado].className}>
                      {estadoConfig[reg.estado].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="outline" onClick={() => handleEditar(reg)}>
                        <Pencil className="w-3 h-3 mr-1" /> Editar
                      </Button>
                      <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => handleEliminar(reg)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">No se encontraron registros</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground text-right">Mostrando {filtered.length} de {registros.length} registros</p>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{modoEdicion ? "Editar Registro" : "Agregar Nuevo Registro"}</DialogTitle>
            <DialogDescription>
              {modoEdicion ? "Modifica las características del equipo o componente." : "Ingresa los datos del nuevo equipo o componente."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Código *</Label>
                <Input value={registroActual.codigo} onChange={(e) => setRegistroActual({ ...registroActual, codigo: e.target.value })} placeholder="Ej: RES-001" />
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={registroActual.tipo} onValueChange={(v) => setRegistroActual({ ...registroActual, tipo: v as "equipo" | "componente" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equipo">Equipo</SelectItem>
                    <SelectItem value="componente">Componente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Nombre *</Label>
              <Input value={registroActual.nombre} onChange={(e) => setRegistroActual({ ...registroActual, nombre: e.target.value })} placeholder="Nombre del equipo o componente" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cantidad</Label>
                <Input type="number" min={0} value={registroActual.cantidad} onChange={(e) => setRegistroActual({ ...registroActual, cantidad: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="space-y-2">
                <Label>Estado</Label>
                <Select value={registroActual.estado} onValueChange={(v) => setRegistroActual({ ...registroActual, estado: v as RegistroInventario["estado"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disponible">Disponible</SelectItem>
                    <SelectItem value="prestado">Prestado</SelectItem>
                    <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                    <SelectItem value="agotado">Agotado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Ubicación</Label>
              <Input value={registroActual.ubicacion} onChange={(e) => setRegistroActual({ ...registroActual, ubicacion: e.target.value })} placeholder="Ej: Estante A-1" />
            </div>
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea value={registroActual.descripcion} onChange={(e) => setRegistroActual({ ...registroActual, descripcion: e.target.value })} rows={2} placeholder="Descripción del equipo o componente..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleGuardar}>{modoEdicion ? "Guardar Cambios" : "Agregar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" /> Confirmar Eliminación
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar <strong>"{registroEliminar?.nombre}"</strong> ({registroEliminar?.codigo}) del inventario? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={confirmarEliminar}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MantenimientoModule;
