import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Search, Filter, Download, Loader2, AlertCircle } from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useInventoryList } from "@/hooks/useInventory";

const InventarioModule = () => {
  const [search, setSearch] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");

  const { data, isLoading, isError, error } = useInventoryList();

  const items: any[] = Array.isArray(data?.data) ? data.data : [];

  const filtered = items.filter((item: any) => {
    const nombre = item.item_na ?? item.nombre ?? "";
    const codigo = item.item_cod ?? item.codigo ?? "";
    const matchSearch =
      String(nombre).toLowerCase().includes(search.toLowerCase()) ||
      String(codigo).toLowerCase().includes(search.toLowerCase());

    if (filtroEstado === "todos") return matchSearch;

    const qty = item.inventory_qt ?? item.cantidad ?? 0;
    if (filtroEstado === "disponible") return matchSearch && qty > 0;
    if (filtroEstado === "agotado") return matchSearch && qty === 0;
    return matchSearch;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
        <span className="text-muted-foreground">Cargando inventario...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-12 text-destructive">
        <AlertCircle className="w-5 h-5 mr-2" />
        <span>{(error as any)?.message ?? "Error al cargar el inventario"}</span>
      </div>
    );
  }

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
            <SelectItem value="agotado">Agotado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead>ID</TableHead>
              <TableHead>Componente</TableHead>
              <TableHead className="text-center">Cantidad</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead className="text-center">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item: any) => {
              const qty = item.inventory_qt ?? 0;
              const estado = qty > 0 ? "disponible" : "agotado";
              const estadoClass = qty > 0
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                : "bg-red-500/20 text-red-400 border-red-500/30";

              return (
                <TableRow key={item.inventory_id} className="border-border">
                  <TableCell className="font-mono text-accent">{item.inventory_id}</TableCell>
                  <TableCell className="font-medium">{item.item_na ?? "—"}</TableCell>
                  <TableCell className="text-center">{qty}</TableCell>
                  <TableCell className="text-muted-foreground">{item.location_na ?? item.location_id ?? "—"}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={estadoClass}>
                      {estado.charAt(0).toUpperCase() + estado.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
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
        Mostrando {filtered.length} de {items.length} componentes
      </p>
    </div>
  );
};

export default InventarioModule;
