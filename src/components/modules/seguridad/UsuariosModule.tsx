import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Search, Plus, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import BackButton from "@/components/BackButton";

interface Usuario {
  id: string;
  username: string;
  nombre: string;
  email: string;
  estado: "activo" | "inactivo" | "bloqueado";
  ultimoAcceso: string;
}

const mockUsuarios: Usuario[] = [
  { id: "U001", username: "cgarcia", nombre: "Carlos García", email: "cgarcia@uru.edu", estado: "activo", ultimoAcceso: "2025-03-15 08:30" },
  { id: "U002", username: "mlopez", nombre: "María López", email: "mlopez@uru.edu", estado: "activo", ultimoAcceso: "2025-03-14 14:20" },
  { id: "U003", username: "amartinez", nombre: "Ana Martínez", email: "amartinez@uru.edu", estado: "inactivo", ultimoAcceso: "2025-02-28 09:15" },
  { id: "U004", username: "lrodriguez", nombre: "Luis Rodríguez", email: "lrodriguez@uru.edu", estado: "activo", ultimoAcceso: "2025-03-15 10:45" },
  { id: "U005", username: "pramirez", nombre: "Pedro Ramírez", email: "pramirez@uru.edu", estado: "bloqueado", ultimoAcceso: "2025-03-01 16:00" },
];

const estadoConfig: Record<string, { label: string; className: string }> = {
  activo: { label: "Activo", className: "bg-emerald-600 hover:bg-emerald-700" },
  inactivo: { label: "Inactivo", className: "bg-secondary text-secondary-foreground" },
  bloqueado: { label: "Bloqueado", className: "bg-destructive hover:bg-destructive/90" },
};

const UsuariosModule = ({ onBack }: { onBack: () => void }) => {
  const [usuarios, setUsuarios] = useState(mockUsuarios);
  const [busqueda, setBusqueda] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState<Usuario | null>(null);
  const [form, setForm] = useState({ username: "", nombre: "", email: "", estado: "activo" });

  const filtered = usuarios.filter((u) =>
    u.nombre.toLowerCase().includes(busqueda.toLowerCase()) || u.username.toLowerCase().includes(busqueda.toLowerCase())
  );

  const openNew = () => {
    setEditUser(null);
    setForm({ username: "", nombre: "", email: "", estado: "activo" });
    setDialogOpen(true);
  };

  const openEdit = (u: Usuario) => {
    setEditUser(u);
    setForm({ username: u.username, nombre: u.nombre, email: u.email, estado: u.estado });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.username || !form.nombre || !form.email) {
      toast({ title: "Error", description: "Complete todos los campos.", variant: "destructive" });
      return;
    }
    if (editUser) {
      setUsuarios((prev) => prev.map((u) => u.id === editUser.id ? { ...u, ...form, estado: form.estado as Usuario["estado"] } : u));
      toast({ title: "Usuario actualizado", description: `${form.nombre} actualizado correctamente.` });
    } else {
      const nuevo: Usuario = { id: `U${String(usuarios.length + 1).padStart(3, "0")}`, ...form, estado: form.estado as Usuario["estado"], ultimoAcceso: "—" };
      setUsuarios((prev) => [...prev, nuevo]);
      toast({ title: "Usuario creado", description: `${form.nombre} registrado correctamente.` });
    }
    setDialogOpen(false);
  };

  const handleDelete = (u: Usuario) => {
    setUsuarios((prev) => prev.filter((x) => x.id !== u.id));
    toast({ title: "Usuario eliminado", description: `${u.nombre} eliminado del sistema.` });
  };

  return (
    <div className="space-y-6">
      <BackButton onClick={onBack} />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-accent" />
          <h2 className="text-xl font-bold text-foreground">Gestión de Usuarios</h2>
        </div>
        <Button size="sm" onClick={openNew}><Plus className="w-4 h-4 mr-1" /> Nuevo Usuario</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><CheckCircle className="w-6 h-6 text-emerald-500" /><div><p className="text-2xl font-bold text-foreground">{usuarios.filter(u => u.estado === "activo").length}</p><p className="text-xs text-muted-foreground">Activos</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><XCircle className="w-6 h-6 text-muted-foreground" /><div><p className="text-2xl font-bold text-foreground">{usuarios.filter(u => u.estado === "inactivo").length}</p><p className="text-xs text-muted-foreground">Inactivos</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><XCircle className="w-6 h-6 text-destructive" /><div><p className="text-2xl font-bold text-foreground">{usuarios.filter(u => u.estado === "bloqueado").length}</p><p className="text-xs text-muted-foreground">Bloqueados</p></div></CardContent></Card>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Buscar usuario..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="pl-10" />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Último Acceso</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-mono text-xs">{u.id}</TableCell>
                  <TableCell className="font-medium">{u.username}</TableCell>
                  <TableCell>{u.nombre}</TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell><Badge className={estadoConfig[u.estado].className}>{estadoConfig[u.estado].label}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{u.ultimoAcceso}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(u)}><Edit className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(u)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No se encontraron usuarios</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editUser ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Username</Label><Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /></div>
            <div className="space-y-2"><Label>Nombre completo</Label><Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} /></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={form.estado} onValueChange={(v) => setForm({ ...form, estado: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                  <SelectItem value="bloqueado">Bloqueado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsuariosModule;
