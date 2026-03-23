import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Waypoints, Search, Lock, Unlock } from "lucide-react";
import BackButton from "@/components/BackButton";

interface Metodo {
  id: string;
  nombre: string;
  httpVerb: "GET" | "POST" | "PUT" | "DELETE";
  modulo: string;
  descripcion: string;
  autenticado: boolean;
  activo: boolean;
}

const mockMetodos: Metodo[] = [
  { id: "M001", nombre: "/api/prestamos", httpVerb: "GET", modulo: "Préstamos", descripcion: "Listar préstamos", autenticado: true, activo: true },
  { id: "M002", nombre: "/api/prestamos", httpVerb: "POST", modulo: "Préstamos", descripcion: "Crear préstamo", autenticado: true, activo: true },
  { id: "M003", nombre: "/api/inventario", httpVerb: "GET", modulo: "Inventario", descripcion: "Listar inventario", autenticado: true, activo: true },
  { id: "M004", nombre: "/api/inventario", httpVerb: "PUT", modulo: "Inventario", descripcion: "Actualizar componente", autenticado: true, activo: true },
  { id: "M005", nombre: "/api/reportes", httpVerb: "GET", modulo: "Reportes", descripcion: "Generar reporte", autenticado: true, activo: true },
  { id: "M006", nombre: "/api/usuarios", httpVerb: "DELETE", modulo: "Seguridad", descripcion: "Eliminar usuario", autenticado: true, activo: false },
  { id: "M007", nombre: "/api/notificaciones", httpVerb: "POST", modulo: "Notificaciones", descripcion: "Enviar notificación", autenticado: true, activo: true },
  { id: "M008", nombre: "/api/solvencia", httpVerb: "GET", modulo: "Préstamos", descripcion: "Consultar solvencia", autenticado: false, activo: true },
];

const verbColor: Record<string, string> = {
  GET: "bg-emerald-600 hover:bg-emerald-700",
  POST: "bg-blue-600 hover:bg-blue-700",
  PUT: "bg-amber-500 hover:bg-amber-600 text-white",
  DELETE: "bg-destructive hover:bg-destructive/90",
};

const MetodosModule = ({ onBack }: { onBack: () => void }) => {
  const [busqueda, setBusqueda] = useState("");

  const filtered = mockMetodos.filter((m) =>
    m.nombre.toLowerCase().includes(busqueda.toLowerCase()) || m.modulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <BackButton onClick={onBack} />
      <div className="flex items-center gap-3">
        <Waypoints className="w-6 h-6 text-accent" />
        <h2 className="text-xl font-bold text-foreground">Métodos del Sistema</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {(["GET", "POST", "PUT", "DELETE"] as const).map((verb) => (
          <Card key={verb}>
            <CardContent className="p-4">
              <Badge className={verbColor[verb]}>{verb}</Badge>
              <p className="text-2xl font-bold text-foreground mt-2">{mockMetodos.filter((m) => m.httpVerb === verb).length}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Buscar endpoint o módulo..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="pl-10" />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Verbo</TableHead>
                <TableHead>Endpoint</TableHead>
                <TableHead>Módulo</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Auth</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((m) => (
                <TableRow key={m.id}>
                  <TableCell><Badge className={verbColor[m.httpVerb]}>{m.httpVerb}</Badge></TableCell>
                  <TableCell className="font-mono text-sm">{m.nombre}</TableCell>
                  <TableCell>{m.modulo}</TableCell>
                  <TableCell className="text-muted-foreground">{m.descripcion}</TableCell>
                  <TableCell>{m.autenticado ? <Lock className="w-4 h-4 text-amber-500" /> : <Unlock className="w-4 h-4 text-muted-foreground" />}</TableCell>
                  <TableCell><Badge variant={m.activo ? "default" : "secondary"}>{m.activo ? "Activo" : "Inactivo"}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetodosModule;
