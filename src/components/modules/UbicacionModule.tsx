import { useState } from "react";
import { MapPin, Search, Box, Loader2, AlertCircle, Plus, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useLocationList, useCreateLocation, useUpdateLocation, useDeleteLocation } from "@/hooks/useCatalogues";
import { useToast } from "@/hooks/use-toast";

const UbicacionModule = () => {
  const [busqueda, setBusqueda] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ location_na: "", location_de: "" });
  const { toast } = useToast();

  const { data, isLoading, isError, error } = useLocationList();
  const createMut = useCreateLocation();
  const updateMut = useUpdateLocation();
  const deleteMut = useDeleteLocation();

  const locations: any[] = Array.isArray(data?.data) ? data.data : [];

  const filtered = locations.filter((u: any) => {
    const name = u.location_na ?? "";
    return name.toLowerCase().includes(busqueda.toLowerCase());
  });

  const openNew = () => { setEditItem(null); setForm({ location_na: "", location_de: "" }); setDialogOpen(true); };
  const openEdit = (item: any) => { setEditItem(item); setForm({ location_na: item.location_na ?? "", location_de: item.location_de ?? "" }); setDialogOpen(true); };

  const handleSave = async () => {
    if (!form.location_na.trim()) { toast({ title: "Error", description: "El nombre es requerido", variant: "destructive" }); return; }
    try {
      if (editItem) {
        await updateMut.mutateAsync({ location_id: editItem.location_id, ...form });
        toast({ title: "Ubicación actualizada" });
      } else {
        await createMut.mutateAsync(form);
        toast({ title: "Ubicación creada" });
      }
      setDialogOpen(false);
    } catch (err: any) {
      toast({ title: "Error", description: err?.message ?? "Error al guardar", variant: "destructive" });
    }
  };

  const handleDelete = async (item: any) => {
    try {
      await deleteMut.mutateAsync(item.location_id);
      toast({ title: "Ubicación eliminada" });
    } catch (err: any) {
      toast({ title: "Error", description: err?.message ?? "Error al eliminar", variant: "destructive" });
    }
  };

  if (isLoading) return <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary mr-2" /><span className="text-muted-foreground">Cargando ubicaciones...</span></div>;
  if (isError) return <div className="flex items-center justify-center py-12 text-destructive"><AlertCircle className="w-5 h-5 mr-2" /><span>{(error as any)?.message ?? "Error al cargar ubicaciones"}</span></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Ubicaciones</h2>
          <p className="text-sm text-muted-foreground">Gestión de ubicaciones físicas</p>
        </div>
        <Button size="sm" onClick={openNew}><Plus className="w-4 h-4 mr-1" /> Nueva Ubicación</Button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar ubicación..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="pl-9 bg-card border-border" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((u: any) => (
          <div key={u.location_id} className="bg-card border border-border rounded-xl p-4 hover:border-accent transition-colors">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-foreground text-sm">{u.location_na}</h3>
              <Badge variant="outline" className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30">Activa</Badge>
            </div>
            <div className="space-y-1.5 text-sm mb-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" />
                <span>{u.location_de ?? "Sin descripción"}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Box className="w-3.5 h-3.5" />
                <span>ID: <span className="text-foreground font-medium">{u.location_id}</span></span>
              </div>
            </div>
            <div className="flex justify-end gap-1">
              <Button size="icon" variant="ghost" onClick={() => openEdit(u)}><Edit className="w-4 h-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => handleDelete(u)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && <div className="text-center py-8 text-muted-foreground">No se encontraron ubicaciones.</div>}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editItem ? "Editar Ubicación" : "Nueva Ubicación"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Nombre</Label><Input value={form.location_na} onChange={(e) => setForm({ ...form, location_na: e.target.value })} /></div>
            <div className="space-y-2"><Label>Descripción</Label><Input value={form.location_de} onChange={(e) => setForm({ ...form, location_de: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={createMut.isPending || updateMut.isPending}>
              {(createMut.isPending || updateMut.isPending) ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UbicacionModule;
