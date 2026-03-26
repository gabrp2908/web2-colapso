import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PackageSearch, Search, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useCreateDevolution, useDevolutionList } from "@/hooks/useBusiness";
import { devolutionService } from "@/lib/api/services/business";

type DevolutionSummary = {
  movement_id: number;
  user_id: number;
  movement_booking_dt?: string;
  movement_estimated_return_dt?: string;
  total_items: number;
  returned_items: number;
  pending_items: number;
  damaged_items: number;
};

type DevolutionDetail = {
  movement_detail_id: number;
  movement_detail_am: number;
  pending_am?: number;
};

type DevolutionEntity = {
  movement_id: number;
  details?: DevolutionDetail[];
};

const DevolucionesModule = () => {
  const { data, isLoading, refetch } = useDevolutionList();
  const registerMutation = useCreateDevolution();

  const devoluciones: DevolutionSummary[] = useMemo(() => {
    const rows = data?.data;
    return Array.isArray(rows) ? (rows as DevolutionSummary[]) : [];
  }, [data]);

  const [search, setSearch] = useState("");
  const [selectedMovement, setSelectedMovement] = useState<DevolutionSummary | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [observaciones, setObservaciones] = useState("");
  const [condition, setCondition] = useState<"good" | "damaged" | "partial">("good");

  const filtered = devoluciones.filter(
    (p) =>
      String(p.movement_id).includes(search) ||
      String(p.user_id).includes(search)
  );

  const activos = devoluciones.filter((p) => p.pending_items > 0).length;
  const vencidos = devoluciones.filter((p) => p.damaged_items > 0).length;

  const handleDevolucion = async () => {
    if (!selectedMovement) return;

    try {
      const response = await devolutionService.get(selectedMovement.movement_id);
      const entity = response?.data as DevolutionEntity | undefined;
      const details = Array.isArray(entity?.details) ? entity.details : [];

      if (details.length === 0) {
        toast({ title: "Error", description: "No se encontraron detalles del movimiento", variant: "destructive" });
        return;
      }

      const payloadDetails = details.map((detail) => ({
        movement_detail_id: detail.movement_detail_id,
        returned_am: Math.max(0, Number(detail.pending_am ?? detail.movement_detail_am ?? 0)),
        condition,
      }));

      await registerMutation.mutateAsync({
        movement_id: selectedMovement.movement_id,
        devolution_ob: observaciones,
        details: payloadDetails,
      });

      toast({ title: "Devolución registrada", description: `Movimiento #${selectedMovement.movement_id} actualizado` });
      setDialogOpen(false);
      setSelectedMovement(null);
      setObservaciones("");
      setCondition("good");
      await refetch();
    } catch {
      toast({ title: "Error", description: "No se pudo registrar la devolución", variant: "destructive" });
      return;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <PackageSearch className="w-7 h-7 text-primary" />
        <h2 className="text-xl font-bold text-foreground">Devoluciones</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><Clock className="w-5 h-5 text-primary" /><div><p className="text-2xl font-bold text-foreground">{activos}</p><p className="text-xs text-muted-foreground">Activos</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><AlertTriangle className="w-5 h-5 text-destructive" /><div><p className="text-2xl font-bold text-foreground">{vencidos}</p><p className="text-xs text-muted-foreground">Vencidos</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><CheckCircle className="w-5 h-5 text-accent" /><div><p className="text-2xl font-bold text-foreground">{devoluciones.length}</p><p className="text-xs text-muted-foreground">Total</p></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-base">Movimientos de Devolución</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar por movimiento o usuario..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && <p className="text-sm text-muted-foreground mb-4">Cargando devoluciones...</p>}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Movimiento</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Devueltos</TableHead>
                <TableHead>Pendientes</TableHead>
                <TableHead>Dañados</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.movement_id}>
                  <TableCell className="font-mono text-xs">#{p.movement_id}</TableCell>
                  <TableCell>{p.user_id}</TableCell>
                  <TableCell>{p.total_items}</TableCell>
                  <TableCell>{p.returned_items}</TableCell>
                  <TableCell>{p.pending_items}</TableCell>
                  <TableCell>{p.damaged_items}</TableCell>
                  <TableCell>
                    <Badge variant={p.pending_items > 0 ? "secondary" : p.damaged_items > 0 ? "destructive" : "default"}>
                      {p.pending_items > 0 ? "Pendiente" : p.damaged_items > 0 ? "Con daños" : "Completa"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" onClick={() => { setSelectedMovement(p); setDialogOpen(true); }}>
                      Registrar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No se encontraron devoluciones</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Devolución</DialogTitle>
            <DialogDescription>Confirme el registro de devolución para el movimiento seleccionado.</DialogDescription>
          </DialogHeader>
          {selectedMovement && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Movimiento:</span> <span className="font-medium text-foreground">#{selectedMovement.movement_id}</span></div>
                <div><span className="text-muted-foreground">Usuario:</span> <span className="font-medium text-foreground">{selectedMovement.user_id}</span></div>
              </div>
              <div className="space-y-2">
                <Label>Condición de devolución</Label>
                <Select value={condition} onValueChange={(v) => setCondition(v as "good" | "damaged" | "partial") }>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="good">Buena</SelectItem>
                    <SelectItem value="partial">Parcial</SelectItem>
                    <SelectItem value="damaged">Dañada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Observaciones (opcional)</Label>
                <Input placeholder="Estado del componente, daños, etc." value={observaciones} onChange={(e) => setObservaciones(e.target.value)} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleDevolucion} disabled={registerMutation.isPending}>Confirmar Devolución</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DevolucionesModule;
