import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Waypoints, Search, Plus, Trash2, Loader2, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import BackButton from "@/components/BackButton";
import { useMethodList, useCreateMethod, useDeleteMethod, useObjectList } from "@/hooks/useSecurity";

const MetodosModule = ({ onBack }: { onBack: () => void }) => {
  const [busqueda, setBusqueda] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ method_na: "", object_id: "" });

  const { data, isLoading, isError, error } = useMethodList();
  const { data: objData } = useObjectList();
  const createMut = useCreateMethod();
  const deleteMut = useDeleteMethod();

  const metodos: any[] = Array.isArray(data?.data) ? data.data : [];
  const objetos: any[] = Array.isArray(objData?.data) ? objData.data : [];
  const filtered = metodos.filter((m: any) => (m.method_na ?? "").toLowerCase().includes(busqueda.toLowerCase()));

  const handleCreate = async () => {
    if (!form.method_na.trim() || !form.object_id) { toast({ title: "Error", description: "Nombre y objeto son requeridos", variant: "destructive" }); return; }
    try { await createMut.mutateAsync({ method_na: form.method_na, object_id: Number(form.object_id) }); toast({ title: "Método creado" }); setDialogOpen(false); }
    catch (err: any) { toast({ title: "Error", description: err?.message, variant: "destructive" }); }
  };

  const handleDelete = async (m: any) => {
    try { await deleteMut.mutateAsync(m.method_id); toast({ title: "Método eliminado" }); }
    catch (err: any) { toast({ title: "Error", description: err?.message, variant: "destructive" }); }
  };

  if (isLoading) return <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary mr-2" /><span className="text-muted-foreground">Cargando métodos...</span></div>;
  if (isError) return <div className="flex items-center justify-center py-12 text-destructive"><AlertCircle className="w-5 h-5 mr-2" /><span>{(error as any)?.message ?? "Error"}</span></div>;

  return (
    <div className="space-y-6">
      <BackButton onClick={onBack} />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3"><Waypoints className="w-6 h-6 text-accent" /><h2 className="text-xl font-bold text-foreground">Métodos</h2></div>
        <Button size="sm" onClick={() => { setForm({ method_na: "", object_id: "" }); setDialogOpen(true); }}><Plus className="w-4 h-4 mr-1" /> Nuevo</Button>
      </div>

      <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Métodos</p><p className="text-2xl font-bold text-foreground">{metodos.length}</p></CardContent></Card>

      <div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Buscar..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="pl-10" /></div>

      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Nombre</TableHead><TableHead>Objeto ID</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.map((m: any) => (
              <TableRow key={m.method_id}>
                <TableCell className="font-mono text-xs">{m.method_id}</TableCell>
                <TableCell className="font-medium">{m.method_na}</TableCell>
                <TableCell className="text-muted-foreground">{m.object_id ?? "—"}</TableCell>
                <TableCell className="text-right"><Button size="icon" variant="ghost" onClick={() => handleDelete(m)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button></TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No hay métodos</TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent></Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nuevo Método</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Nombre</Label><Input value={form.method_na} onChange={(e) => setForm({ ...form, method_na: e.target.value })} /></div>
            <div className="space-y-2">
              <Label>Objeto de Negocio</Label>
              <select value={form.object_id} onChange={(e) => setForm({ ...form, object_id: e.target.value })} className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground">
                <option value="">Seleccione...</option>
                {objetos.map((o: any) => <option key={o.object_id} value={o.object_id}>{o.object_na}</option>)}
              </select>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button><Button onClick={handleCreate} disabled={createMut.isPending}>Guardar</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MetodosModule;
