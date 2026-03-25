import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDays, Plus, Edit, Trash2, Loader2, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import BackButton from "@/components/BackButton";
import { useLapseList, useCreateLapse, useUpdateLapse, useDeleteLapse } from "@/hooks/useCatalogues";

const CalendarioModule = ({ onBack }: { onBack: () => void }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ lapse_de: "", lapse_start_dt: "", lapse_close_dt: "" });

  const { data, isLoading, isError, error } = useLapseList();
  const createMut = useCreateLapse();
  const updateMut = useUpdateLapse();
  const deleteMut = useDeleteLapse();

  const periodos: any[] = Array.isArray(data?.data) ? data.data : [];

  const handleSave = async () => {
    if (!form.lapse_de || !form.lapse_start_dt || !form.lapse_close_dt) {
      toast({ title: "Error", description: "Complete todos los campos.", variant: "destructive" });
      return;
    }
    try {
      if (editItem) {
        await updateMut.mutateAsync({ lapse_id: editItem.lapse_id, ...form });
        toast({ title: "Periodo actualizado" });
      } else {
        await createMut.mutateAsync(form);
        toast({ title: "Periodo creado" });
      }
      setDialogOpen(false);
    } catch (err: any) {
      toast({ title: "Error", description: err?.message ?? "Error al guardar", variant: "destructive" });
    }
  };

  const handleDelete = async (p: any) => {
    try { await deleteMut.mutateAsync(p.lapse_id); toast({ title: "Periodo eliminado" }); }
    catch (err: any) { toast({ title: "Error", description: err?.message ?? "Error al eliminar", variant: "destructive" }); }
  };

  const openNew = () => { setEditItem(null); setForm({ lapse_de: "", lapse_start_dt: "", lapse_close_dt: "" }); setDialogOpen(true); };
  const openEdit = (p: any) => { setEditItem(p); setForm({ lapse_de: p.lapse_de ?? "", lapse_start_dt: p.lapse_start_dt ?? "", lapse_close_dt: p.lapse_close_dt ?? "" }); setDialogOpen(true); };

  if (isLoading) return <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary mr-2" /><span className="text-muted-foreground">Cargando periodos...</span></div>;
  if (isError) return <div className="flex items-center justify-center py-12 text-destructive"><AlertCircle className="w-5 h-5 mr-2" /><span>{(error as any)?.message ?? "Error al cargar periodos"}</span></div>;

  return (
    <div className="space-y-6">
      <BackButton onClick={onBack} />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarDays className="w-6 h-6 text-accent" />
          <h2 className="text-xl font-bold text-foreground">Calendario Académico</h2>
        </div>
        <Button size="sm" onClick={openNew}><Plus className="w-4 h-4 mr-1" /> Nuevo Periodo</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {periodos.map((p: any) => {
          const isActive = p.lapse_act === true || p.lapse_act === 1;
          return (
            <Card key={p.lapse_id} className="hover:border-accent transition-colors">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="outline" className={isActive ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" : "bg-secondary text-secondary-foreground"}>
                    {isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
                <h3 className="font-semibold text-foreground mb-2">{p.lapse_de}</h3>
                <div className="text-sm text-muted-foreground space-y-1 mb-3">
                  <p>Inicio: <span className="text-foreground">{p.lapse_start_dt ?? "—"}</span></p>
                  <p>Fin: <span className="text-foreground">{p.lapse_close_dt ?? "—"}</span></p>
                </div>
                <div className="flex justify-end gap-1">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(p)}><Edit className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(p)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {periodos.length === 0 && <div className="text-center py-8 text-muted-foreground">No hay periodos registrados.</div>}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editItem ? "Editar Periodo" : "Nuevo Periodo"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Descripción</Label><Input value={form.lapse_de} onChange={(e) => setForm({ ...form, lapse_de: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Fecha Inicio</Label><Input type="date" value={form.lapse_start_dt} onChange={(e) => setForm({ ...form, lapse_start_dt: e.target.value })} /></div>
              <div className="space-y-2"><Label>Fecha Fin</Label><Input type="date" value={form.lapse_close_dt} onChange={(e) => setForm({ ...form, lapse_close_dt: e.target.value })} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={createMut.isPending || updateMut.isPending}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarioModule;
