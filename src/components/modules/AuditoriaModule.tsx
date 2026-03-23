import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClipboardList, Search, Shield, UserCheck, Settings, AlertTriangle, LogIn, LogOut, FileEdit, Trash2, Eye } from "lucide-react";

interface RegistroAuditoria {
  id: string;
  fecha: string;
  hora: string;
  usuario: string;
  rol: string;
  accion: "login" | "logout" | "crear" | "editar" | "eliminar" | "consultar" | "permiso";
  modulo: string;
  descripcion: string;
  ip: string;
}

const mockRegistros: RegistroAuditoria[] = [
  { id: "AUD-001", fecha: "2025-03-15", hora: "08:12:34", usuario: "admin", rol: "admin", accion: "login", modulo: "Sistema", descripcion: "Inicio de sesión exitoso", ip: "192.168.1.10" },
  { id: "AUD-002", fecha: "2025-03-15", hora: "08:15:02", usuario: "admin", rol: "admin", accion: "permiso", modulo: "Permisos", descripcion: "Asignó rol supervisor a María García", ip: "192.168.1.10" },
  { id: "AUD-003", fecha: "2025-03-15", hora: "09:01:45", usuario: "jperez", rol: "supervisor", accion: "crear", modulo: "Inventario", descripcion: "Registró nuevo equipo: Osciloscopio Digital EQ-012", ip: "192.168.1.22" },
  { id: "AUD-004", fecha: "2025-03-15", hora: "09:30:10", usuario: "mgarcia", rol: "supervisor", accion: "editar", modulo: "Inventario", descripcion: "Actualizó ubicación de Multímetro Fluke a Lab B", ip: "192.168.1.35" },
  { id: "AUD-005", fecha: "2025-03-14", hora: "14:22:18", usuario: "ltorres", rol: "usuario", accion: "consultar", modulo: "Préstamos", descripcion: "Consultó estado de préstamo PR-045", ip: "192.168.1.41" },
  { id: "AUD-006", fecha: "2025-03-14", hora: "15:10:55", usuario: "admin", rol: "admin", accion: "eliminar", modulo: "Usuarios", descripcion: "Eliminó cuenta de usuario inactivo: rdiaz", ip: "192.168.1.10" },
  { id: "AUD-007", fecha: "2025-03-14", hora: "16:45:30", usuario: "jperez", rol: "supervisor", accion: "editar", modulo: "Mantenimiento", descripcion: "Cambió estado de EQ-004 a Fuera de Servicio", ip: "192.168.1.22" },
  { id: "AUD-008", fecha: "2025-03-13", hora: "10:05:12", usuario: "ltorres", rol: "usuario", accion: "crear", modulo: "Solicitudes", descripcion: "Creó solicitud de préstamo SOL-089", ip: "192.168.1.41" },
  { id: "AUD-009", fecha: "2025-03-13", hora: "11:30:00", usuario: "mgarcia", rol: "supervisor", accion: "consultar", modulo: "Reportes", descripcion: "Generó reporte de préstamos del mes", ip: "192.168.1.35" },
  { id: "AUD-010", fecha: "2025-03-13", hora: "17:00:22", usuario: "admin", rol: "admin", accion: "logout", modulo: "Sistema", descripcion: "Cierre de sesión", ip: "192.168.1.10" },
];

const accionConfig: Record<RegistroAuditoria["accion"], { label: string; icon: React.ReactNode; className: string }> = {
  login: { label: "Inicio Sesión", icon: <LogIn className="w-3 h-3" />, className: "bg-emerald-600 hover:bg-emerald-700" },
  logout: { label: "Cierre Sesión", icon: <LogOut className="w-3 h-3" />, className: "bg-secondary text-secondary-foreground" },
  crear: { label: "Crear", icon: <FileEdit className="w-3 h-3" />, className: "bg-blue-600 hover:bg-blue-700" },
  editar: { label: "Editar", icon: <Settings className="w-3 h-3" />, className: "bg-amber-500 hover:bg-amber-600 text-white" },
  eliminar: { label: "Eliminar", icon: <Trash2 className="w-3 h-3" />, className: "bg-destructive hover:bg-destructive/90" },
  consultar: { label: "Consultar", icon: <Eye className="w-3 h-3" />, className: "bg-muted text-muted-foreground" },
  permiso: { label: "Permiso", icon: <Shield className="w-3 h-3" />, className: "bg-violet-600 hover:bg-violet-700 text-white" },
};

const AuditoriaModule = () => {
  const [busqueda, setBusqueda] = useState("");
  const [filtroAccion, setFiltroAccion] = useState("todos");
  const [filtroModulo, setFiltroModulo] = useState("todos");

  const modulos = [...new Set(mockRegistros.map((r) => r.modulo))];

  const filtered = mockRegistros.filter((r) => {
    const matchBusqueda =
      r.usuario.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.id.toLowerCase().includes(busqueda.toLowerCase());
    const matchAccion = filtroAccion === "todos" || r.accion === filtroAccion;
    const matchModulo = filtroModulo === "todos" || r.modulo === filtroModulo;
    return matchBusqueda && matchAccion && matchModulo;
  });

  const totalHoy = mockRegistros.filter((r) => r.fecha === "2025-03-15").length;
  const loginCount = mockRegistros.filter((r) => r.accion === "login").length;
  const criticalCount = mockRegistros.filter((r) => r.accion === "eliminar" || r.accion === "permiso").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ClipboardList className="w-6 h-6 text-accent" />
        <h2 className="text-xl font-bold text-foreground">Auditoría del Sistema</h2>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <ClipboardList className="w-8 h-8 text-accent" />
            <div>
              <p className="text-2xl font-bold text-foreground">{totalHoy}</p>
              <p className="text-sm text-muted-foreground">Acciones Hoy</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <UserCheck className="w-8 h-8 text-emerald-500" />
            <div>
              <p className="text-2xl font-bold text-foreground">{loginCount}</p>
              <p className="text-sm text-muted-foreground">Inicios de Sesión</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <AlertTriangle className="w-8 h-8 text-destructive" />
            <div>
              <p className="text-2xl font-bold text-foreground">{criticalCount}</p>
              <p className="text-sm text-muted-foreground">Acciones Críticas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar por usuario o descripción..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="pl-10" />
        </div>
        <Select value={filtroAccion} onValueChange={setFiltroAccion}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Acción" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas las acciones</SelectItem>
            <SelectItem value="login">Inicio Sesión</SelectItem>
            <SelectItem value="logout">Cierre Sesión</SelectItem>
            <SelectItem value="crear">Crear</SelectItem>
            <SelectItem value="editar">Editar</SelectItem>
            <SelectItem value="eliminar">Eliminar</SelectItem>
            <SelectItem value="consultar">Consultar</SelectItem>
            <SelectItem value="permiso">Permiso</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filtroModulo} onValueChange={setFiltroModulo}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Módulo" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los módulos</SelectItem>
            {modulos.map((m) => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Log Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha / Hora</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Acción</TableHead>
                <TableHead>Módulo</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((reg) => {
                const cfg = accionConfig[reg.accion];
                return (
                  <TableRow key={reg.id}>
                    <TableCell className="whitespace-nowrap text-xs">
                      <div>{reg.fecha}</div>
                      <div className="text-muted-foreground">{reg.hora}</div>
                    </TableCell>
                    <TableCell className="font-medium">{reg.usuario}</TableCell>
                    <TableCell><Badge variant="outline" className="capitalize">{reg.rol}</Badge></TableCell>
                    <TableCell>
                      <Badge className={`gap-1 ${cfg.className}`}>{cfg.icon}{cfg.label}</Badge>
                    </TableCell>
                    <TableCell>{reg.modulo}</TableCell>
                    <TableCell className="max-w-[250px] truncate text-sm">{reg.descripcion}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{reg.ip}</TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">No se encontraron registros</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditoriaModule;
