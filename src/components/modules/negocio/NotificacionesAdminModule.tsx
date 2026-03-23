import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Bell, Search, Send, Plus, Trash2, Mail, AlertTriangle, CheckCircle, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import BackButton from "@/components/BackButton";

interface Notificacion {
  id: string;
  destinatario: string;
  destinatarioTipo: "usuario" | "grupo" | "todos";
  tipo: "vencimiento" | "recordatorio" | "informacion" | "urgente" | "sistema";
  asunto: string;
  mensaje: string;
  fecha: string;
  estado: "enviada" | "pendiente" | "leida" | "fallida";
}

const initialNotificaciones: Notificacion[] = [
  { id: "N001", destinatario: "Carlos García", destinatarioTipo: "usuario", tipo: "vencimiento", asunto: "Préstamo vencido", mensaje: "Su préstamo del Multímetro Fluke ha vencido. Por favor acérquese al laboratorio.", fecha: "2025-03-15", estado: "enviada" },
  { id: "N002", destinatario: "Todos los usuarios", destinatarioTipo: "todos", tipo: "informacion", asunto: "Horario especial", mensaje: "El laboratorio estará cerrado el viernes 21 de marzo por mantenimiento general.", fecha: "2025-03-14", estado: "leida" },
  { id: "N003", destinatario: "Ana Martínez", destinatarioTipo: "usuario", tipo: "recordatorio", asunto: "Recordatorio de devolución", mensaje: "Recuerde devolver el Protoboard antes del viernes.", fecha: "2025-03-13", estado: "enviada" },
  { id: "N004", destinatario: "Grupo Supervisores", destinatarioTipo: "grupo", tipo: "sistema", asunto: "Actualización de inventario", mensaje: "Se han añadido 50 nuevos componentes al inventario del Lab A.", fecha: "2025-03-12", estado: "leida" },
  { id: "N005", destinatario: "Luis Rodríguez", destinatarioTipo: "usuario", tipo: "urgente", asunto: "Componente dañado", mensaje: "Se reportó daño en el osciloscopio prestado. Contacte al supervisor.", fecha: "2025-03-11", estado: "fallida" },
];

const tipoBadge: Record<string, { className: string; label: string }> = {
  vencimiento: { className: "bg-destructive/15 text-destructive border-destructive/30", label: "Vencimiento" },
  recordatorio: { className: "bg-amber-500/15 text-amber-500 border-amber-500/30", label: "Recordatorio" },
  informacion: { className: "bg-blue-500/15 text-blue-500 border-blue-500/30", label: "Información" },
  urgente: { className: "bg-red-600/15 text-red-500 border-red-600/30", label: "Urgente" },
  sistema: { className: "bg-muted text-muted-foreground border-border", label: "Sistema" },
};

const estadoBadge: Record<string, { variant: "default" | "destructive" | "secondary" | "outline"; label: string }> = {
  enviada: { variant: "default", label: "Enviada" },
  pendiente: { variant: "secondary", label: "Pendiente" },
  leida: { variant: "outline", label: "Leída" },
  fallida: { variant: "destructive", label: "Fallida" },
};

interface Props {
  onBack: () => void;
}

const NotificacionesAdminModule = ({ onBack }: Props) => {
  const [notificaciones, setNotificaciones] = useState(initialNotificaciones);
  const [search, setSearch] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<Notificacion | null>(null);

  const [form, setForm] = useState({ destinatario: "", destinatarioTipo: "usuario" as Notificacion["destinatarioTipo"], tipo: "informacion" as Notificacion["tipo"], asunto: "", mensaje: "" });

  const filtered = notificaciones.filter(n => {
    const matchSearch = n.destinatario.toLowerCase().includes(search.toLowerCase()) || n.asunto.toLowerCase().includes(search.toLowerCase());
    const matchTipo = filtroTipo === "todos" || n.tipo === filtroTipo;
    return matchSearch && matchTipo;
  });

  const enviadas = notificaciones.filter(n => n.estado === "enviada").length;
  const pendientes = notificaciones.filter(n => n.estado === "pendiente").length;
  const fallidas = notificaciones.filter(n => n.estado === "fallida").length;

  const openNew = () => {
    setForm({ destinatario: "", destinatarioTipo: "usuario", tipo: "informacion", asunto: "", mensaje: "" });
    setDialogOpen(true);
  };

  const handleSend = () => {
    if (!form.destinatario || !form.asunto || !form.mensaje) {
      toast({ title: "Error", description: "Complete todos los campos", variant: "destructive" });
      return;
    }
    const nueva: Notificacion = {
      id: `N${String(notificaciones.length + 1).padStart(3, "0")}`,
      ...form,
      fecha: new Date().toISOString().split("T")[0],
      estado: "enviada",
    };
    setNotificaciones(prev => [nueva, ...prev]);
    toast({ title: "Notificación enviada", description: `Enviada a ${form.destinatario}` });
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (!deleteDialog) return;
    setNotificaciones(prev => prev.filter(n => n.id !== deleteDialog.id));
    toast({ title: "Notificación eliminada", description: `${deleteDialog.id} eliminada` });
    setDeleteDialog(null);
  };

  return (
    <div className="space-y-6">
      <BackButton onClick={onBack} />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="w-7 h-7 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Gestión de Notificaciones</h2>
        </div>
        <Button onClick={openNew}><Plus className="w-4 h-4 mr-2" />Nueva Notificación</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><Mail className="w-5 h-5 text-primary" /><div><p className="text-2xl font-bold text-foreground">{enviadas}</p><p className="text-xs text-muted-foreground">Enviadas</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><CheckCircle className="w-5 h-5 text-accent" /><div><p className="text-2xl font-bold text-foreground">{pendientes}</p><p className="text-xs text-muted-foreground">Pendientes</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><AlertTriangle className="w-5 h-5 text-destructive" /><div><p className="text-2xl font-bold text-foreground">{fallidas}</p><p className="text-xs text-muted-foreground">Fallidas</p></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-base">Historial de Notificaciones</CardTitle>
            <div className="flex items-center gap-3">
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los tipos</SelectItem>
                  <SelectItem value="vencimiento">Vencimiento</SelectItem>
                  <SelectItem value="recordatorio">Recordatorio</SelectItem>
                  <SelectItem value="informacion">Información</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                  <SelectItem value="sistema">Sistema</SelectItem>
                </SelectContent>
              </Select>
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
                <TableHead>Fecha</TableHead>
                <TableHead>Destinatario</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Asunto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(n => (
                <TableRow key={n.id}>
                  <TableCell className="font-mono text-xs">{n.id}</TableCell>
                  <TableCell className="text-xs">{n.fecha}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {n.destinatarioTipo === "todos" ? <Users className="w-3.5 h-3.5 text-muted-foreground" /> : <Mail className="w-3.5 h-3.5 text-muted-foreground" />}
                      <span className="font-medium">{n.destinatario}</span>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline" className={tipoBadge[n.tipo].className}>{tipoBadge[n.tipo].label}</Badge></TableCell>
                  <TableCell className="max-w-[200px] truncate">{n.asunto}</TableCell>
                  <TableCell><Badge variant={estadoBadge[n.estado].variant}>{estadoBadge[n.estado].label}</Badge></TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteDialog(n)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No se encontraron notificaciones</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* New Notification Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva Notificación</DialogTitle>
            <DialogDescription>Redacte y envíe una notificación a usuarios o grupos.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Destinatario</Label>
                <Select value={form.destinatarioTipo} onValueChange={v => setForm({ ...form, destinatarioTipo: v as Notificacion["destinatarioTipo"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usuario">Usuario</SelectItem>
                    <SelectItem value="grupo">Grupo</SelectItem>
                    <SelectItem value="todos">Todos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Destinatario</Label>
                <Input placeholder={form.destinatarioTipo === "todos" ? "Todos los usuarios" : "Nombre..."} value={form.destinatario} onChange={e => setForm({ ...form, destinatario: e.target.value })} disabled={form.destinatarioTipo === "todos"} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={form.tipo} onValueChange={v => setForm({ ...form, tipo: v as Notificacion["tipo"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vencimiento">Vencimiento</SelectItem>
                    <SelectItem value="recordatorio">Recordatorio</SelectItem>
                    <SelectItem value="informacion">Información</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                    <SelectItem value="sistema">Sistema</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Asunto</Label>
                <Input value={form.asunto} onChange={e => setForm({ ...form, asunto: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Mensaje</Label>
              <Textarea placeholder="Escriba el contenido de la notificación..." value={form.mensaje} onChange={e => setForm({ ...form, mensaje: e.target.value })} className="min-h-[100px]" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSend}><Send className="w-4 h-4 mr-2" />Enviar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Notificación</DialogTitle>
            <DialogDescription>¿Está seguro de eliminar la notificación {deleteDialog?.id}?</DialogDescription>
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

export default NotificacionesAdminModule;
