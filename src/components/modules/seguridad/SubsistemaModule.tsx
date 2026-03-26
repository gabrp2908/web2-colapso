import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Settings, Search, Plus, Trash2, Edit, Loader2, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import BackButton from "@/components/BackButton";
import { useSubsystemList, useCreateSubsystem, useUpdateSubsystem, useDeleteSubsystem } from "@/hooks/useSecurity";

const SubsistemaModule = ({ onBack }: { onBack: () => void }) => {
  const [busqueda, setBusqueda] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editSubsystem, setEditSubsystem] = useState<any>(null);
  const [form, setForm] = useState({ subsystem_na: "" });

  const { data, isLoading, isError, error } = useSubsystemList();
  const createMut = useCreateSubsystem();
  const updateMut = useUpdateSubsystem();
  const deleteMut = useDeleteSubsystem();

  const subsistemas: any[] = Array.isArray(data?.data) ? data.data : [];
  const filtered = subsistemas.filter((s: any) => (s.subsystem_na ?? "").toLowerCase().includes(busqueda.toLowerCase()));

  const openNew = () => { setEditSubsystem(null); setForm({ subsystem_na: "" }); setDialogOpen(true); };
  const openEdit = (s: any) => { setEditSubsystem(s); setForm({ subsystem_na: s.subsystem_na ?? "" }); setDialogOpen(true); };

  const handleSave = async () => {
    if (!form.subsystem_na.trim()) { toast({ title: "Error", description: "El nombre es requerido", variant: "destructive" }); return; }
    try {
      if (editSubsystem) {
        await updateMut.mutateAsync({ subsystem_id: editSubsystem.subsystem_id, subsystem_na: form.subsystem_na });
        toast({ title: "Subsistema actualizado" });
      } else {
        await createMut.mutateAsync(form);
        toast({ title: "Subsistema creado" });
      }
      setDialogOpen(false);
    } catch (err: any) { 
      toast({ title: "Error", description: err?.message, variant: "destructive" }); 
    }
  };

  const handleDelete = async (s: any) => {
    try { await deleteMut.mutateAsync(s.subsystem_id); toast({ title: "Subsistema eliminado" }); }
    catch (err: any) { toast({ title: "Error", description: err?.message, variant: "destructive" }); }
  };

  if (isLoading) return <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary mr-2" /><span className="text-muted-foreground">Cargando subsistemas...</span></div>;
  if (isError) return <div className="flex items-center justify-center py-12 text-destructive"><AlertCircle className="w-5 h-5 mr-2" /><span>{(error as any)?.message ?? "Error"}</span></div>;

  return (
    <div className="space-y-6">
      <BackButton onClick={onBack} />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3"><Settings className="w-6 h-6 text-accent" /><h2 className="text-xl font-bold text-foreground">Subsistemas</h2></div>
        <Button size="sm" onClick={openNew}><Plus className="w-4 h-4 mr-1" /> Nuevo</Button>
      </div>

      <div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Buscar..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="pl-10" /></div>

      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Nombre</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.map((ss: any) => (
              <TableRow key={ss.subsystem_id}>
                <TableCell className="font-mono text-xs">{ss.subsystem_id}</TableCell>
                <TableCell className="font-medium">{ss.subsystem_na}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(ss)}><Edit className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(ss)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-8">No hay subsistemas</TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent></Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editSubsystem ? "Editar Subsistema" : "Nuevo Subsistema"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Nombre</Label><Input value={form.subsystem_na} onChange={(e) => setForm({ subsystem_na: e.target.value })} /></div>
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

export default SubsistemaModule;
