import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Search, Filter, Download } from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface ComponenteInventario {
  codigo: string;
  nombre: string;
  cantidad: number;
  ubicacion: string;
  estado: "disponible" | "prestado" | "mantenimiento" | "agotado";
}

const mockInventario: ComponenteInventario[] = [
  { codigo: "RES-001", nombre: "Resistencia 1kΩ", cantidad: 150, ubicacion: "Estante A-1", estado: "disponible" },
  { codigo: "CAP-002", nombre: "Capacitor 100µF", cantidad: 80, ubicacion: "Estante A-2", estado: "disponible" },
  { codigo: "LED-003", nombre: "LED Rojo 5mm", cantidad: 200, ubicacion: "Estante B-1", estado: "disponible" },
  { codigo: "TRA-004", nombre: "Transistor 2N2222", cantidad: 0, ubicacion: "Estante B-3", estado: "agotado" },
  { codigo: "PRO-005", nombre: "Protoboard 830 puntos", cantidad: 5, ubicacion: "Gabinete C-1", estado: "prestado" },
  { codigo: "MUL-006", nombre: "Multímetro Digital", cantidad: 10, ubicacion: "Gabinete D-1", estado: "disponible" },
  { codigo: "OSC-007", nombre: "Osciloscopio Rigol", cantidad: 2, ubicacion: "Mesa Central", estado: "mantenimiento" },
  { codigo: "CAB-008", nombre: "Cable Jumper M-M", cantidad: 300, ubicacion: "Estante A-3", estado: "disponible" },
  { codigo: "FUE-009", nombre: "Fuente de Poder 12V", cantidad: 8, ubicacion: "Gabinete D-2", estado: "prestado" },
  { codigo: "ARD-010", nombre: "Arduino UNO R3", cantidad: 15, ubicacion: "Gabinete C-2", estado: "disponible" },
];

const estadoBadge: Record<ComponenteInventario["estado"], string> = {
  disponible: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  prestado: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  mantenimiento: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  agotado: "bg-red-500/20 text-red-400 border-red-500/30",
};

const InventarioModule = () => {
  const [search, setSearch] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");

  const filtered = mockInventario.filter((item) => {
    const matchSearch =
      item.nombre.toLowerCase().includes(search.toLowerCase()) ||
      item.codigo.toLowerCase().includes(search.toLowerCase());
    const matchEstado = filtroEstado === "todos" || item.estado === filtroEstado;
    return matchSearch && matchEstado;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Inventario de Componentes</h2>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="w-4 h-4" /> Exportar
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por código o nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filtroEstado} onValueChange={setFiltroEstado}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="disponible">Disponible</SelectItem>
            <SelectItem value="prestado">Prestado</SelectItem>
            <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
            <SelectItem value="agotado">Agotado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead>Código</TableHead>
              <TableHead>Componente</TableHead>
              <TableHead className="text-center">Cantidad</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead className="text-center">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.codigo} className="border-border">
                <TableCell className="font-mono text-accent">{item.codigo}</TableCell>
                <TableCell className="font-medium">{item.nombre}</TableCell>
                <TableCell className="text-center">{item.cantidad}</TableCell>
                <TableCell className="text-muted-foreground">{item.ubicacion}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className={estadoBadge[item.estado]}>
                    {item.estado.charAt(0).toUpperCase() + item.estado.slice(1)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No se encontraron componentes.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-muted-foreground text-right">
        Mostrando {filtered.length} de {mockInventario.length} componentes
      </p>
    </div>
  );
};

export default InventarioModule;
