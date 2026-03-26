import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { HandCoins, Search, Clock, AlertTriangle, CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useRequestList, useAcceptRequest, useRejectRequest } from "@/hooks/useLoan";
import BackButton from "@/components/BackButton";

const estadoBadge: Record<string, { className: string; label: string }> = {
  pending: { className: "bg-amber-500/20 text-amber-400 border-amber-500/30", label: "Pendiente" },
  approved: { className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", label: "Aprobada" },
  rejected: { className: "bg-red-500/20 text-red-400 border-red-500/30", label: "Rechazada" },
  active: { className: "bg-primary/20 text-primary border-primary/30", label: "Activo" },
  returned: { className: "bg-muted text-muted-foreground border-border", label: "Devuelto" },
  overdue: { className: "bg-destructive/20 text-destructive border-destructive/30", label: "Vencido" },
};

type RequestRow = Record<string, any>;

interface Props {
  onBack: () => void;
}

const PrestamosAdminModule = ({ onBack }: Props) => {
  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [acceptDialog, setAcceptDialog] = useState<RequestRow | null>(null);
  const [rejectDialog, setRejectDialog] = useState<RequestRow | null>(null);
  const [estimatedReturn, setEstimatedReturn] = useState("");
  const [approveNote, setApproveNote] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  const { data, isLoading, isError, error } = useRequestList();
  const acceptRequest = useAcceptRequest();
  const rejectRequest = useRejectRequest();

  const requests: RequestRow[] = Array.isArray(data?.data) ? data.data : [];

  const filtered = requests.filter((r) => {
    const rawStatus = String(r.movement_status ?? "pending").toLowerCase();
    const status = rawStatus === "requested" ? "pending" : rawStatus;
    const id = String(r.movement_id ?? "");
    const user = String(r.user_na ?? r.user_name ?? r.user_full_name ?? "").toLowerCase();
    const note = String(r.movement_ob ?? "").toLowerCase();
    const textMatch =
      id.includes(search) ||
      user.includes(search.toLowerCase()) ||
      note.includes(search.toLowerCase());
    const statusMatch = filtro === "todos" || status === filtro;
    return textMatch && statusMatch;
  });

  const countByStatus = (status: string) =>
    requests.filter((r) => {
      const rawStatus = String(r.movement_status ?? "pending").toLowerCase();
      const normalized = rawStatus === "requested" ? "pending" : rawStatus;
      return normalized === status;
    }).length;

  const openAcceptDialog = (r: RequestRow) => {
    setAcceptDialog(r);
    setApproveNote("");
    const today = new Date();
    today.setDate(today.getDate() + 7);
    setEstimatedReturn(today.toISOString().slice(0, 10));
  };

  const handleAccept = async () => {
    if (!acceptDialog) return;
    if (!estimatedReturn) {
      toast({ title: "Falta fecha", description: "Indique la fecha estimada de retorno.", variant: "destructive" });
      return;
    }

    try {
      await acceptRequest.mutateAsync({
        movement_id: Number(acceptDialog.movement_id),
        movement_estimated_return_dt: estimatedReturn,
        movement_ob: approveNote || undefined,
      });
      toast({ title: "Solicitud aprobada", description: `Solicitud ${acceptDialog.movement_id} aprobada correctamente.` });
      setAcceptDialog(null);
    } catch (err: any) {
      toast({ title: "Error", description: err?.message ?? "No se pudo aprobar la solicitud", variant: "destructive" });
    }
  };

  const handleReject = async () => {
    if (!rejectDialog) return;
    if (!rejectReason.trim()) {
      toast({ title: "Falta motivo", description: "Ingrese un motivo de rechazo.", variant: "destructive" });
      return;
    }

    try {
      await rejectRequest.mutateAsync({
        movement_id: Number(rejectDialog.movement_id),
        movement_ob: rejectReason.trim(),
      });
      toast({ title: "Solicitud rechazada", description: `Solicitud ${rejectDialog.movement_id} rechazada.` });
      setRejectDialog(null);
      setRejectReason("");
    } catch (err: any) {
      toast({ title: "Error", description: err?.message ?? "No se pudo rechazar la solicitud", variant: "destructive" });
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
    <div className="space-y-6">
      <BackButton onClick={onBack} />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <HandCoins className="w-7 h-7 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Gestión de Solicitudes</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><Clock className="w-5 h-5 text-amber-500" /><div><p className="text-2xl font-bold text-foreground">{countByStatus("pending")}</p><p className="text-xs text-muted-foreground">Pendientes</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><CheckCircle className="w-5 h-5 text-emerald-500" /><div><p className="text-2xl font-bold text-foreground">{countByStatus("approved")}</p><p className="text-xs text-muted-foreground">Aprobadas</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><AlertTriangle className="w-5 h-5 text-destructive" /><div><p className="text-2xl font-bold text-foreground">{countByStatus("rejected")}</p><p className="text-xs text-muted-foreground">Rechazadas</p></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-base">Solicitudes de Préstamo</CardTitle>
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {["todos", "pending", "approved", "rejected"].map(f => (
                  <button key={f} onClick={() => setFiltro(f)} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filtro === f ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
                    {f === "todos" ? "Todos" : estadoBadge[f]?.label ?? f}
                  </button>
                ))}
              </div>
              <div className="relative w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Buscar..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Observación</TableHead>
                <TableHead>Fecha Solicitud</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => {
                const rawStatus = String(r.movement_status ?? "pending").toLowerCase();
                const status = rawStatus === "requested" ? "pending" : rawStatus;
                const badge = estadoBadge[status] ?? estadoBadge.pending;
                const isPending = status === "pending";

                return (
                <TableRow key={r.movement_id}>
                  <TableCell className="font-mono text-xs">{r.movement_id}</TableCell>
                  <TableCell className="font-medium">{r.user_na ?? r.user_name ?? r.user_full_name ?? `Usuario #${r.user_id ?? "—"}`}</TableCell>
                  <TableCell>{r.movement_ob ?? "—"}</TableCell>
                  <TableCell>{r.movement_created_dt ?? r.created_at ?? "—"}</TableCell>
                  <TableCell><Badge variant="outline" className={badge.className}>{badge.label}</Badge></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {isPending ? (
                        <>
                          <Button variant="outline" size="sm" onClick={() => openAcceptDialog(r)} disabled={acceptRequest.isPending || rejectRequest.isPending}>
                            <CheckCircle className="w-4 h-4 mr-1" /> Aprobar
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => setRejectDialog(r)} disabled={acceptRequest.isPending || rejectRequest.isPending}>
                            <XCircle className="w-4 h-4 mr-1" /> Rechazar
                          </Button>
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground">Sin acciones</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )})}
              {filtered.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No se encontraron solicitudes</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!acceptDialog} onOpenChange={(open) => !open && setAcceptDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aprobar Solicitud</DialogTitle>
            <DialogDescription>
              Defina la fecha estimada de retorno para la solicitud {acceptDialog?.movement_id ?? ""}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Fecha estimada de retorno</Label>
              <Input type="date" value={estimatedReturn} onChange={(e) => setEstimatedReturn(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Observación (opcional)</Label>
              <Textarea
                value={approveNote}
                onChange={(e) => setApproveNote(e.target.value)}
                placeholder="Observación para la aprobación"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAcceptDialog(null)}>Cancelar</Button>
            <Button onClick={handleAccept} disabled={acceptRequest.isPending}>
              {acceptRequest.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Aprobando...</> : "Confirmar aprobación"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!rejectDialog} onOpenChange={(open) => !open && setRejectDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rechazar Solicitud</DialogTitle>
            <DialogDescription>
              Indique el motivo de rechazo para la solicitud {rejectDialog?.movement_id ?? ""}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Motivo de rechazo</Label>
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Motivo del rechazo"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialog(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleReject} disabled={rejectRequest.isPending}>
              {rejectRequest.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Rechazando...</> : "Confirmar rechazo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PrestamosAdminModule;
