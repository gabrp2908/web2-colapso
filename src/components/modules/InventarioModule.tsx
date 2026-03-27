import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Search, Filter, Loader2, AlertCircle, Plus, Pencil } from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useInventoryList, useCreateInventory, useUpdateInventory } from "@/hooks/useInventory";
import { useComponentList, useEquipmentList, useLocationList } from "@/hooks/useCatalogues";

type InventoryRow = Record<string, any>;
type ItemOption = { item_id: number; item_na: string; item_cod?: number; tipo: "componente" | "equipo" };

const InventarioModule = () => {
  const [search, setSearch] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<InventoryRow | null>(null);
  const [form, setForm] = useState({ item_id: "", location_id: "", inventory_qt: "1" });

  const { data, isLoading, isError, error } = useInventoryList();
  const { data: compData } = useComponentList();
  const { data: equipData } = useEquipmentList();
  const { data: locData } = useLocationList();
  const createInventory = useCreateInventory();
  const updateInventory = useUpdateInventory();

  const items: InventoryRow[] = Array.isArray(data?.data) ? data.data : [];
  const components: ItemOption[] = Array.isArray(compData?.data)
    ? compData.data.map((i: any) => ({ item_id: Number(i.item_id), item_na: i.item_na, item_cod: i.item_cod, tipo: "componente" as const }))
    : [];
  const equipment: ItemOption[] = Array.isArray(equipData?.data)
    ? equipData.data.map((i: any) => ({ item_id: Number(i.item_id), item_na: i.item_na, item_cod: i.item_cod, tipo: "equipo" as const }))
    : [];
  const availableItems = useMemo(() => [...components, ...equipment], [components, equipment]);
  const locations: any[] = Array.isArray(locData?.data) ? locData.data : [];

  const formatLocation = (row: InventoryRow) => {
    if (row.location_de != null && row.location_sh != null && row.location_dr != null) {
      return `Lab ${row.location_de} | Est. ${row.location_sh} | Gav. ${row.location_dr}`;
    }
    if (row.location_na != null) return String(row.location_na);
    if (row.location_id != null) return `Ubicacion #${row.location_id}`;
    return "—";
  };

  const formatLocationOption = (loc: any) => `Lab ${loc.location_de} | Est. ${loc.location_sh} | Gav. ${loc.location_dr}`;

  const resetForm = () => {
    setForm({ item_id: "", location_id: "", inventory_qt: "1" });
    setEditingRow(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (row: InventoryRow) => {
    setEditingRow(row);
    setForm({
      item_id: String(row.item_id ?? ""),
      location_id: String(row.location_id ?? ""),
      inventory_qt: String(row.inventory_qt ?? 0),
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const itemId = Number(form.item_id);
    const locationId = Number(form.location_id);
    const quantity = Number(form.inventory_qt);

    if (!editingRow && (!Number.isInteger(itemId) || itemId <= 0)) {
      toast({ title: "Item requerido", description: "Seleccione un item valido.", variant: "destructive" });
      return;
    }
    if (!Number.isInteger(locationId) || locationId <= 0) {
      toast({ title: "Ubicacion requerida", description: "Seleccione una ubicacion valida.", variant: "destructive" });
      return;
    }
    if (!Number.isInteger(quantity) || quantity < 0) {
      toast({ title: "Cantidad invalida", description: "Ingrese una cantidad valida.", variant: "destructive" });
      return;
    }

    try {
      if (editingRow) {
        await updateInventory.mutateAsync({
          inventory_id: Number(editingRow.inventory_id),
          inventory_qt: quantity,
          location_id: locationId,
        });
        toast({ title: "Inventario actualizado", description: `Registro #${editingRow.inventory_id} actualizado.` });
      } else {
        await createInventory.mutateAsync({
          item_id: itemId,
          location_id: locationId,
          inventory_qt: quantity,
        });
        toast({ title: "Inventario registrado", description: "Nuevo registro creado correctamente." });
      }
      setDialogOpen(false);
      resetForm();
    } catch (err: any) {
      toast({ title: "Error", description: err?.message ?? "No se pudo guardar el inventario.", variant: "destructive" });
    }
  };

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
        <h2 className="text-xl font-bold text-foreground">Inventario</h2>
        <Button size="sm" className="gap-2" onClick={openCreateDialog}>
          <Plus className="w-4 h-4" /> Registrar inventario
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
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item: InventoryRow) => {
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
                  <TableCell className="text-muted-foreground text-xs whitespace-nowrap">{formatLocation(item)}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={estadoClass}>
                      {estado.charAt(0).toUpperCase() + estado.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" onClick={() => openEditDialog(item)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No se encontraron componentes.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-muted-foreground text-right">
        Mostrando {filtered.length} de {items.length} registros
      </p>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingRow ? "Editar inventario" : "Registrar inventario"}</DialogTitle>
            <DialogDescription>
              {editingRow ? "Actualice cantidad y ubicacion del registro." : "Complete item, cantidad y ubicacion para crear el registro."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label>Item</Label>
              <select
                value={form.item_id}
                onChange={(e) => setForm((prev) => ({ ...prev, item_id: e.target.value }))}
                disabled={!!editingRow}
                className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground disabled:opacity-60"
              >
                <option value="">Seleccione item...</option>
                {availableItems.map((opt) => (
                  <option key={`${opt.tipo}-${opt.item_id}`} value={String(opt.item_id)}>
                    {opt.item_na} ({opt.tipo}){opt.item_cod ? ` - ${opt.item_cod}` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Cantidad</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.inventory_qt}
                  onChange={(e) => setForm((prev) => ({ ...prev, inventory_qt: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Ubicacion</Label>
                <select
                  value={form.location_id}
                  onChange={(e) => setForm((prev) => ({ ...prev, location_id: e.target.value }))}
                  className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground"
                >
                  <option value="">Seleccione ubicacion...</option>
                  {locations.map((loc: any) => (
                    <option key={loc.location_id} value={String(loc.location_id)}>
                      {formatLocationOption(loc)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={createInventory.isPending || updateInventory.isPending}>
              {editingRow ? "Guardar cambios" : "Registrar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventarioModule;
