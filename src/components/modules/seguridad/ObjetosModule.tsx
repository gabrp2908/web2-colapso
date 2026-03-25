import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Box, Search, Plus, Trash2, Loader2, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import BackButton from "@/components/BackButton";
import { useObjectList, useCreateObject, useDeleteObject } from "@/hooks/useSecurity";

const ObjetosModule = ({ onBack }: { onBack: () => void }) => {
  const [busqueda, setBusqueda] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ object_na: "" });

  const { data, isLoading, isError, error } = useObjectList();
  const createMut = useCreateObject();
  const deleteMut = useDeleteObject();

  const objetos: any[] = Array.isArray(data?.data) ? data.data : [];
  const filtered = objetos.filter((o: any) => (o.object_na ?? "").toLowerCase().includes(busqueda.toLowerCase()));

  const handleCreate = async () => {
    if (!form.object_na.trim()) { toast({ title: "Error", description: "El nombre es requerido", variant: "destructive" }); return; }
    try { await createMut.mutateAsync(form); toast({ title: "Objeto creado" }); setDialogOpen(false); }
    catch (err: any) { toast({ title: "Error", description: err?.message, variant: "destructive" }); }
  };

  const handleDelete = async (o: any) => {
    try { await deleteMut.mutateAsync(o.object_id); toast({ title: "Objeto eliminado" }); }
    catch (err: any) { toast({ title: "Error", description: err?.message, variant: "destructive" }); }
  };

  if (isLoading) return <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary mr-2" /><span className="text-muted-foreground">Cargando objetos...</span></div>;
  if (isError) return <div className="flex items-center justify-center py-12 text-destructive"><AlertCircle className="w-5 h-5 mr-2" /><span>{(error as any)?.message ?? "Error"}</span></div>;

  return (
    <div className="space-y-6">
      <BackButton onClick={onBack} />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3"><Box className="w-6 h-6 text-accent" /><h2 className="text-xl font-bold text-foreground">Objetos de Negocio</h2></div>
        <Button size="sm" onClick={() => { setForm({ object_na: "" }); setDialogOpen(true); }}><Plus className="w-4 h-4 mr-1" /> Nuevo</Button>
      </div>

      <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Objetos</p><p className="text-2xl font-bold text-foreground">{objetos.length}</p></CardContent></Card>

      <div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Buscar..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="pl-10" /></div>

      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Nombre</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.map((o: any) => (
              <TableRow key={o.object_id}>
                <TableCell className="font-mono text-xs">{o.object_id}</TableCell>
                <TableCell className="font-medium">{o.object_na}</TableCell>
                <TableCell className="text-right"><Button size="icon" variant="ghost" onClick={() => handleDelete(o)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button></TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-8">No hay objetos</TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent></Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nuevo Objeto</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2"><div className="space-y-2"><Label>Nombre</Label><Input value={form.object_na} onChange={(e) => setForm({ object_na: e.target.value })} /></div></div>
          <DialogFooter><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button><Button onClick={handleCreate} disabled={createMut.isPending}>Guardar</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ObjetosModule;
