import { useState } from "react";
import { Key, Search, UserCircle, ShieldCheck, ShieldAlert, Shield, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface UsuarioPermiso {
  id: string;
  nombre: string;
  cedula: string;
  rol: "usuario" | "supervisor" | "admin";
  permisos: Record<string, boolean>;
}

const permisosDisponibles = [
  { key: "solicitudes", label: "Solicitudes" },
  { key: "prestamos", label: "Préstamos" },
  { key: "devoluciones", label: "Devoluciones" },
  { key: "inventario", label: "Inventario" },
  { key: "reportes", label: "Reportes" },
  { key: "solvencia", label: "Solvencia" },
  { key: "ubicacion", label: "Ubicación" },
  { key: "notificar", label: "Notificar" },
];

const mockUsuarios: UsuarioPermiso[] = [
  { id: "1", nombre: "Carlos García", cedula: "12345678", rol: "usuario", permisos: { solicitudes: true, prestamos: true, solvencia: true, devoluciones: false, inventario: false, reportes: false, ubicacion: false, notificar: false } },
  { id: "2", nombre: "María López", cedula: "87654321", rol: "supervisor", permisos: { solicitudes: false, prestamos: true, solvencia: false, devoluciones: true, inventario: true, reportes: true, ubicacion: true, notificar: true } },
  { id: "4", nombre: "Ana Martínez", cedula: "23456789", rol: "usuario", permisos: { solicitudes: true, prestamos: true, solvencia: true, devoluciones: false, inventario: false, reportes: false, ubicacion: false, notificar: false } },
  { id: "5", nombre: "Luis Rodríguez", cedula: "34567890", rol: "supervisor", permisos: { solicitudes: false, prestamos: true, solvencia: false, devoluciones: true, inventario: true, reportes: true, ubicacion: true, notificar: true } },
  { id: "6", nombre: "Pedro Ramírez", cedula: "56789012", rol: "usuario", permisos: { solicitudes: true, prestamos: true, solvencia: true, devoluciones: false, inventario: false, reportes: false, ubicacion: false, notificar: false } },
];

const rolBadge: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
  usuario: { label: "Usuario", icon: <Shield className="w-3 h-3" />, className: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  supervisor: { label: "Supervisor", icon: <ShieldCheck className="w-3 h-3" />, className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  admin: { label: "Admin", icon: <ShieldAlert className="w-3 h-3" />, className: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
};

const PermisosModule = () => {
  const [usuarios, setUsuarios] = useState<UsuarioPermiso[]>(mockUsuarios);
  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("todos");
  const [editando, setEditando] = useState<UsuarioPermiso | null>(null);
  const [permisosTemp, setPermisosTemp] = useState<Record<string, boolean>>({});
  const [rolTemp, setRolTemp] = useState<string>("");

  const filtered = usuarios.filter((u) => {
    const matchBusqueda = u.nombre.toLowerCase().includes(busqueda.toLowerCase()) || u.cedula.includes(busqueda);
    const matchRol = filtroRol === "todos" || u.rol === filtroRol;
    return matchBusqueda && matchRol;
  });

  const abrirEditor = (usuario: UsuarioPermiso) => {
    setEditando(usuario);
    setPermisosTemp({ ...usuario.permisos });
    setRolTemp(usuario.rol);
  };

  const guardarCambios = () => {
    if (!editando) return;
    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === editando.id
          ? { ...u, rol: rolTemp as UsuarioPermiso["rol"], permisos: { ...permisosTemp } }
          : u
      )
    );
    toast.success(`Permisos de ${editando.nombre} actualizados`);
    setEditando(null);
  };

  const totalPermisos = (permisos: Record<string, boolean>) =>
    Object.values(permisos).filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Asignar Permisos</h2>
        <p className="text-sm text-muted-foreground">Gestione roles y permisos de acceso a módulos por usuario</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {(["usuario", "supervisor", "admin"] as const).map((rol) => {
          const count = usuarios.filter((u) => u.rol === rol).length;
          const badge = rolBadge[rol];
          return (
            <div key={rol} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                {badge.icon}
                <p className="text-sm text-muted-foreground">{badge.label}s</p>
              </div>
              <p className="text-2xl font-bold text-foreground">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o cédula..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-9 bg-card border-border"
          />
        </div>
        <Select value={filtroRol} onValueChange={setFiltroRol}>
          <SelectTrigger className="w-40 bg-card border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los roles</SelectItem>
            <SelectItem value="usuario">Usuario</SelectItem>
            <SelectItem value="supervisor">Supervisor</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="text-left p-3 text-muted-foreground font-medium">Usuario</th>
              <th className="text-left p-3 text-muted-foreground font-medium">Cédula</th>
              <th className="text-left p-3 text-muted-foreground font-medium">Rol</th>
              <th className="text-left p-3 text-muted-foreground font-medium">Permisos</th>
              <th className="text-right p-3 text-muted-foreground font-medium">Acción</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <UserCircle className="w-5 h-5 text-muted-foreground" />
                    <span className="text-foreground font-medium">{u.nombre}</span>
                  </div>
                </td>
                <td className="p-3 text-muted-foreground">{u.cedula}</td>
                <td className="p-3">
                  <Badge variant="outline" className={`${rolBadge[u.rol].className} gap-1`}>
                    {rolBadge[u.rol].icon}
                    {rolBadge[u.rol].label}
                  </Badge>
                </td>
                <td className="p-3 text-muted-foreground">
                  {totalPermisos(u.permisos)} / {permisosDisponibles.length} módulos
                </td>
                <td className="p-3 text-right">
                  <Button size="sm" variant="outline" onClick={() => abrirEditor(u)}>
                    <Key className="w-3.5 h-3.5 mr-1" />
                    Editar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit dialog */}
      <Dialog open={!!editando} onOpenChange={(open) => !open && setEditando(null)}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <Key className="w-5 h-5" />
              Permisos — {editando?.nombre}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Role selector */}
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Rol del usuario</label>
              <Select value={rolTemp} onValueChange={setRolTemp}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usuario">Usuario</SelectItem>
                  <SelectItem value="supervisor">Supervisor</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Permission toggles */}
            <div>
              <label className="text-sm text-muted-foreground mb-3 block">Acceso a módulos</label>
              <div className="space-y-3">
                {permisosDisponibles.map((p) => (
                  <div key={p.key} className="flex items-center justify-between">
                    <span className="text-sm text-foreground">{p.label}</span>
                    <Switch
                      checked={permisosTemp[p.key] ?? false}
                      onCheckedChange={(checked) =>
                        setPermisosTemp((prev) => ({ ...prev, [p.key]: checked }))
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditando(null)}>
              Cancelar
            </Button>
            <Button onClick={guardarCambios}>
              <Save className="w-4 h-4 mr-2" />
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PermisosModule;
