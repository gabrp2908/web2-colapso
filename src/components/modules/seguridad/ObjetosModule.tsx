import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Box, Search, Database, FileText, Settings } from "lucide-react";
import BackButton from "@/components/BackButton";

interface ObjetoSistema {
  id: string;
  nombre: string;
  tipo: "tabla" | "vista" | "procedimiento" | "funcion";
  subsistema: string;
  descripcion: string;
  registros: number;
}

const mockObjetos: ObjetoSistema[] = [
  { id: "OBJ-001", nombre: "tbl_usuarios", tipo: "tabla", subsistema: "Seguridad", descripcion: "Tabla principal de usuarios del sistema", registros: 245 },
  { id: "OBJ-002", nombre: "tbl_prestamos", tipo: "tabla", subsistema: "Préstamos", descripcion: "Registro de préstamos activos e históricos", registros: 1520 },
  { id: "OBJ-003", nombre: "vw_solvencia", tipo: "vista", subsistema: "Préstamos", descripcion: "Vista de estado de solvencia por usuario", registros: 180 },
  { id: "OBJ-004", nombre: "sp_registrar_prestamo", tipo: "procedimiento", subsistema: "Préstamos", descripcion: "Procedimiento para registrar nuevos préstamos", registros: 0 },
  { id: "OBJ-005", nombre: "fn_calcular_mora", tipo: "funcion", subsistema: "Préstamos", descripcion: "Calcula días de mora de un préstamo", registros: 0 },
  { id: "OBJ-006", nombre: "tbl_inventario", tipo: "tabla", subsistema: "Inventario", descripcion: "Catálogo de componentes en inventario", registros: 890 },
  { id: "OBJ-007", nombre: "tbl_auditoria", tipo: "tabla", subsistema: "Auditoría", descripcion: "Log de acciones del sistema", registros: 15420 },
  { id: "OBJ-008", nombre: "vw_reportes_mensuales", tipo: "vista", subsistema: "Reportería", descripcion: "Vista consolidada de reportes mensuales", registros: 12 },
];

const tipoConfig: Record<string, { icon: React.ReactNode; className: string }> = {
  tabla: { icon: <Database className="w-3 h-3" />, className: "bg-blue-600 hover:bg-blue-700" },
  vista: { icon: <FileText className="w-3 h-3" />, className: "bg-emerald-600 hover:bg-emerald-700" },
  procedimiento: { icon: <Settings className="w-3 h-3" />, className: "bg-amber-500 hover:bg-amber-600 text-white" },
  funcion: { icon: <Box className="w-3 h-3" />, className: "bg-violet-600 hover:bg-violet-700 text-white" },
};

const ObjetosModule = ({ onBack }: { onBack: () => void }) => {
  const [busqueda, setBusqueda] = useState("");

  const filtered = mockObjetos.filter((o) =>
    o.nombre.toLowerCase().includes(busqueda.toLowerCase()) || o.subsistema.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <BackButton onClick={onBack} />
      <div className="flex items-center gap-3">
        <Box className="w-6 h-6 text-accent" />
        <h2 className="text-xl font-bold text-foreground">Objetos del Sistema</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {(["tabla", "vista", "procedimiento", "funcion"] as const).map((tipo) => (
          <Card key={tipo}>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground capitalize">{tipo === "funcion" ? "Funciones" : `${tipo}s`}</p>
              <p className="text-2xl font-bold text-foreground">{mockObjetos.filter((o) => o.tipo === tipo).length}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Buscar objeto o subsistema..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="pl-10" />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Subsistema</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">Registros</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-xs">{o.id}</TableCell>
                  <TableCell className="font-mono font-medium text-sm">{o.nombre}</TableCell>
                  <TableCell><Badge className={`gap-1 ${tipoConfig[o.tipo].className}`}>{tipoConfig[o.tipo].icon}{o.tipo.charAt(0).toUpperCase() + o.tipo.slice(1)}</Badge></TableCell>
                  <TableCell>{o.subsistema}</TableCell>
                  <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">{o.descripcion}</TableCell>
                  <TableCell className="text-right font-mono">{o.registros > 0 ? o.registros.toLocaleString() : "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ObjetosModule;
