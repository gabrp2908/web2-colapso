import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wrench, Search, Plus, Pencil, Trash2, Package, AlertTriangle, Loader2, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useComponentList, useCreateComponent, useUpdateComponent, useDeleteComponent, useEquipmentList, useCreateEquipment, useUpdateEquipment, useDeleteEquipment, useCategoryList, useLocationList } from "@/hooks/useCatalogues";

type ItemType = "equipo" | "componente";

const MantenimientoModule = () => {
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<"todos" | ItemType>("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [currentType, setCurrentType] = useState<ItemType>("componente");
  const [registroActual, setRegistroActual] = useState<any>({ item_cod: "", item_na: "", category_id: "", location_id: "" });
  const [registroEliminar, setRegistroEliminar] = useState<any>(null);

  // States for location selectors
  const [locLab, setLocLab] = useState<string>("");
  const [locEstante, setLocEstante] = useState<string>("");
  const [locGaveta, setLocGaveta] = useState<string>("");

  const { data: compData, isLoading: compLoading } = useComponentList();
  const { data: equipData, isLoading: equipLoading } = useEquipmentList();
  const { data: catData } = useCategoryList();
  const { data: locData } = useLocationList();

  const createComp = useCreateComponent();
  const updateComp = useUpdateComponent();
  const deleteComp = useDeleteComponent();
  const createEquip = useCreateEquipment();
  const updateEquip = useUpdateEquipment();
  const deleteEquip = useDeleteEquipment();

  const components: any[] = Array.isArray(compData?.data) ? compData.data.map((c: any) => ({ ...c, tipo: "componente" })) : [];
  const equipment: any[] = Array.isArray(equipData?.data) ? equipData.data.map((e: any) => ({ ...e, tipo: "equipo" })) : [];
  const categories: any[] = Array.isArray(catData?.data) ? catData.data : [];
  const locations: any[] = Array.isArray(locData?.data) ? locData.data : [];

  const allItems = [...components, ...equipment];
  const isLoading = compLoading || equipLoading;

  // -- Location Helper Logic --
  // Derive unique labs
  const labs = useMemo(() => Array.from(new Set(locations.map(l => l.location_de))).sort(), [locations]);
  
  // Derive estantes for selected lab
  const estantes = useMemo(() => {
    if (!locLab) return [];
    const filtered = locations.filter(l => l.location_de === locLab);
    return Array.from(new Set(filtered.map(l => l.location_sh))).sort((a, b) => Number(a) - Number(b));
  }, [locations, locLab]);

  // Derive gavetas for selected lab + estante
  const gavetas = useMemo(() => {
    if (!locLab || !locEstante) return [];
    const filtered = locations.filter(l => l.location_de === locLab && String(l.location_sh) === locEstante);
    return Array.from(new Set(filtered.map(l => l.location_dr))).sort((a, b) => Number(a) - Number(b));
  }, [locations, locLab, locEstante]);

  // Auto-resolve location_id when lab, estante, and gaveta are selected
  useMemo(() => {
    if (locLab && locEstante && locGaveta) {
      const match = locations.find(l => 
        l.location_de === locLab && 
        String(l.location_sh) === locEstante && 
        String(l.location_dr) === locGaveta
      );
      if (match) {
        setRegistroActual((prev: any) => ({ ...prev, location_id: match.location_id }));
      }
    }
  }, [locLab, locEstante, locGaveta, locations]);

  const setLocationById = (locId: number) => {
    const loc = locations.find(l => l.location_id === locId);
    if (loc) {
      setLocLab(loc.location_de);
      setLocEstante(String(loc.location_sh));
      setLocGaveta(String(loc.location_dr));
    } else {
      setLocLab(""); setLocEstante(""); setLocGaveta("");
    }
  };

  const formatLocation = (locId: number) => {
    const loc = locations.find(l => l.location_id === locId);
    if (!loc) return "—";
    return `Lab ${loc.location_de} | Est. ${loc.location_sh} | Gav. ${loc.location_dr}`;
  };

  const filtered = allItems.filter((r: any) => {
    const matchBusqueda = (r.item_na ?? "").toLowerCase().includes(busqueda.toLowerCase()) || String(r.item_cod ?? "").includes(busqueda);
    const matchTipo = filtroTipo === "todos" || r.tipo === filtroTipo;
    return matchBusqueda && matchTipo;
  });

  const handleNuevo = (tipo: ItemType) => {
    setModoEdicion(false);
    setCurrentType(tipo);
    setRegistroActual({ item_cod: "", item_na: "", category_id: "", location_id: "" });
    setLocLab(""); setLocEstante(""); setLocGaveta("");
    setDialogOpen(true);
  };

  const handleEditar = (reg: any) => {
    setModoEdicion(true);
    setCurrentType(reg.tipo);
    setRegistroActual(reg);
    if (reg.location_id) setLocationById(reg.location_id);
    else { setLocLab(""); setLocEstante(""); setLocGaveta(""); }
    setDialogOpen(true);
  };

  const handleEliminar = (reg: any) => { setRegistroEliminar(reg); setDeleteDialogOpen(true); };

  const confirmarEliminar = async () => {
    if (!registroEliminar) return;
    try {
      if (registroEliminar.tipo === "componente") await deleteComp.mutateAsync(registroEliminar.item_id);
      else await deleteEquip.mutateAsync(registroEliminar.item_id);
      toast({ title: "Registro eliminado", description: `"${registroEliminar.item_na}" fue eliminado.` });
    } catch (err: any) { toast({ title: "Error", description: err?.message, variant: "destructive" }); }
    setDeleteDialogOpen(false);
    setRegistroEliminar(null);
  };

  const handleGuardar = async () => {
    if (!registroActual.item_na?.trim()) { toast({ title: "Error", description: "El nombre es obligatorio.", variant: "destructive" }); return; }
    if (!registroActual.location_id) { toast({ title: "Error", description: "Localización incompleta (Lab, Estante, Gaveta).", variant: "destructive" }); return; }
    
    const params = {
      item_cod: Number(registroActual.item_cod) || 0,
      item_na: registroActual.item_na,
      category_id: Number(registroActual.category_id) || 1,
      location_id: Number(registroActual.location_id),
    };

    try {
      if (modoEdicion) {
        const updateParams = { item_id: registroActual.item_id, ...params };
        if (currentType === "componente") await updateComp.mutateAsync(updateParams);
        else await updateEquip.mutateAsync(updateParams);
        toast({ title: "Registro actualizado" });
      } else {
        if (currentType === "componente") await createComp.mutateAsync(params);
        else await createEquip.mutateAsync(params);
        toast({ title: "Registro creado" });
      }
      setDialogOpen(false);
    } catch (err: any) { toast({ title: "Error", description: err?.message, variant: "destructive" }); }
  };

  const counts = { total: allItems.length, equipos: equipment.length, componentes: components.length };

  if (isLoading) return <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary mr-2" /><span className="text-muted-foreground">Cargando inventario...</span></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3"><Wrench className="w-6 h-6 text-accent" /><h2 className="text-xl font-bold text-foreground">Mantenimiento de Inventario</h2></div>
        <div className="flex gap-2">
          <Button onClick={() => handleNuevo("componente")} variant="outline" className="gap-2"><Plus className="w-4 h-4" /> Componente</Button>
          <Button onClick={() => handleNuevo("equipo")} className="gap-2"><Plus className="w-4 h-4" /> Equipo</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="flex items-center gap-4 p-4"><Package className="w-8 h-8 text-accent" /><div><p className="text-2xl font-bold text-foreground">{counts.total}</p><p className="text-sm text-muted-foreground">Total</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-4 p-4"><Wrench className="w-8 h-8 text-blue-500" /><div><p className="text-2xl font-bold text-foreground">{counts.equipos}</p><p className="text-sm text-muted-foreground">Equipos</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-4 p-4"><Package className="w-8 h-8 text-emerald-500" /><div><p className="text-2xl font-bold text-foreground">{counts.componentes}</p><p className="text-sm text-muted-foreground">Componentes</p></div></CardContent></Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Buscar por código o nombre..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="pl-10" /></div>
        <Select value={filtroTipo} onValueChange={(v) => setFiltroTipo(v as any)}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Tipo" /></SelectTrigger>
          <SelectContent><SelectItem value="todos">Todos</SelectItem><SelectItem value="equipo">Equipos</SelectItem><SelectItem value="componente">Componentes</SelectItem></SelectContent>
        </Select>
      </div>

      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Código</TableHead><TableHead>Nombre</TableHead><TableHead>Tipo</TableHead><TableHead>Ubicación</TableHead><TableHead className="text-right">Acciones</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {filtered.map((reg: any) => (
              <TableRow key={`${reg.tipo}-${reg.item_id}`} onDoubleClick={() => handleEditar(reg)} className="cursor-pointer hover:bg-muted/50 transition-colors">
                <TableCell className="font-mono text-xs text-accent">{reg.item_cod}</TableCell>
                <TableCell className="font-medium">{reg.item_na}</TableCell>
                <TableCell><Badge variant="outline" className={reg.tipo === "equipo" ? "border-blue-500/30 text-blue-400" : "border-emerald-500/30 text-emerald-400"}>{reg.tipo === "equipo" ? "Equipo" : "Componente"}</Badge></TableCell>
                <TableCell className="text-muted-foreground text-xs whitespace-nowrap">{formatLocation(reg.location_id)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); handleEditar(reg); }}><Pencil className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); handleEliminar(reg); }}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No se encontraron registros</TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent></Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{modoEdicion ? "Editar" : "Nuevo"} {currentType === "equipo" ? "Equipo" : "Componente"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Código</Label><Input type="number" value={registroActual.item_cod} onChange={(e) => setRegistroActual({ ...registroActual, item_cod: e.target.value })} /></div>
              <div className="space-y-2">
                <Label>Categoría</Label>
                <select value={registroActual.category_id} onChange={(e) => setRegistroActual({ ...registroActual, category_id: e.target.value })} className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground">
                  <option value="">Seleccione...</option>
                  {categories.map((c: any) => <option key={c.category_id} value={c.category_id}>{c.category_de}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2"><Label>Nombre *</Label><Input value={registroActual.item_na} onChange={(e) => setRegistroActual({ ...registroActual, item_na: e.target.value })} /></div>
            
            <div className="grid grid-cols-3 gap-3 p-3 bg-secondary/50 rounded-lg border border-border mt-2">
              <div className="space-y-2">
                <Label className="text-xs">Laboratorio</Label>
                <select value={locLab} onChange={(e) => { setLocLab(e.target.value); setLocEstante(""); setLocGaveta(""); }} className="w-full rounded-md border border-border bg-secondary px-2 py-1.5 text-xs text-foreground">
                  <option value="">Selec...</option>
                  {labs.map(l => <option key={String(l)} value={String(l)}>{l}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Estante</Label>
                <select value={locEstante} onChange={(e) => { setLocEstante(e.target.value); setLocGaveta(""); }} disabled={!locLab} className="w-full rounded-md border border-border bg-secondary px-2 py-1.5 text-xs text-foreground disabled:opacity-50">
                  <option value="">Selec...</option>
                  {estantes.map(e => <option key={String(e)} value={String(e)}>{e}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Gaveta</Label>
                <select value={locGaveta} onChange={(e) => setLocGaveta(e.target.value)} disabled={!locEstante} className="w-full rounded-md border border-border bg-secondary px-2 py-1.5 text-xs text-foreground disabled:opacity-50">
                  <option value="">Selec...</option>
                  {gavetas.map(g => <option key={String(g)} value={String(g)}>{g}</option>)}
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleGuardar}>{modoEdicion ? "Guardar Cambios" : "Crear"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-destructive" /> Confirmar Eliminación</DialogTitle>
            <DialogDescription>¿Eliminar <strong>"{registroEliminar?.item_na}"</strong>? Esta acción no se puede deshacer.</DialogDescription>
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
