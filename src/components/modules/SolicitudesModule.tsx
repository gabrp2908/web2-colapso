import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { Plus, Clock, CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRequestList, useCreateRequest } from "@/hooks/useLoan";
import { useInventoryList } from "@/hooks/useInventory";

const estadoConfig: Record<string, { icon: React.ReactNode; class: string; label: string }> = {
  pending: { icon: <Clock className="w-3.5 h-3.5" />, class: "bg-amber-500/20 text-amber-400 border-amber-500/30", label: "Pendiente" },
  approved: { icon: <CheckCircle className="w-3.5 h-3.5" />, class: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", label: "Aprobada" },
  rejected: { icon: <XCircle className="w-3.5 h-3.5" />, class: "bg-red-500/20 text-red-400 border-red-500/30", label: "Rechazada" },
};

const SolicitudesModule = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inventoryId, setInventoryId] = useState("");
  const [cantidad, setCantidad] = useState("1");
  const [motivo, setMotivo] = useState("");
  const { toast } = useToast();

  const { data, isLoading, isError, error } = useRequestList();
  const { data: invData } = useInventoryList();
  const createRequest = useCreateRequest();

  const solicitudes: any[] = Array.isArray(data?.data) ? data.data : [];
  const inventoryItems: any[] = Array.isArray(invData?.data) ? invData.data : [];

  const handleSubmit = async () => {
    if (!inventoryId || !motivo) {
      toast({ title: "Error", description: "Complete todos los campos.", variant: "destructive" });
      return;
    }
    try {
      await createRequest.mutateAsync({
        user_id: 0, // el backend usa la sesión activa
        movement_ob: motivo,
        details: [{ inventory_id: Number(inventoryId), movement_detail_am: parseInt(cantidad) || 1 }],
      });
      setInventoryId("");
      setCantidad("1");
      setMotivo("");
      setDialogOpen(false);
      toast({ title: "Solicitud enviada", description: "La solicitud se creó exitosamente." });
    } catch (err: any) {
      toast({ title: "Error", description: err?.message ?? "Error al crear solicitud", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
        <span className="text-muted-foreground">Cargando solicitudes...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-12 text-destructive">
        <AlertCircle className="w-5 h-5 mr-2" />
        <span>{(error as any)?.message ?? "Error al cargar solicitudes"}</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Mis Solicitudes</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" /> Nueva Solicitud
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Solicitar Préstamo de Componente</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Componente (Inventario)</Label>
                <select
                  value={inventoryId}
                  onChange={(e) => setInventoryId(e.target.value)}
                  className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground"
                >
                  <option value="">Seleccione...</option>
                  {inventoryItems.map((item: any) => (
                    <option key={item.inventory_id} value={item.inventory_id}>
                      {item.item_na ?? `Inv #${item.inventory_id}`} (Disp: {item.inventory_qt ?? 0})
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Cantidad</Label>
                <Input type="number" min="1" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Motivo</Label>
                <Textarea placeholder="Describa el motivo del préstamo..." value={motivo} onChange={(e) => setMotivo(e.target.value)} rows={3} />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
              <Button onClick={handleSubmit} disabled={createRequest.isPending}>
                {createRequest.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Enviando...</> : "Enviar Solicitud"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead>ID</TableHead>
              <TableHead>Observación</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-center">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {solicitudes.map((sol: any) => {
              const status = sol.movement_status ?? "pending";
              const cfg = estadoConfig[status] ?? estadoConfig.pending;
              return (
                <TableRow key={sol.movement_id} className="border-border">
                  <TableCell className="font-mono text-accent">{sol.movement_id}</TableCell>
                  <TableCell className="font-medium">{sol.movement_ob ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{sol.movement_created_dt ?? sol.created_at ?? "—"}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={`gap-1 ${cfg.class}`}>
                      {cfg.icon}
                      {cfg.label}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
            {solicitudes.length === 0 && (
              <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No tiene solicitudes</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SolicitudesModule;
