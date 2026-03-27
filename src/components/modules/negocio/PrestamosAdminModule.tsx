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
import { useRequestList, useAcceptRequest, useRejectRequest, useRegisterLoan, useLoanList, useRequestDetail, useCreateRequest } from "@/hooks/useLoan";
import { useUserList } from "@/hooks/useSecurity";
import { useInventoryList } from "@/hooks/useInventory";
import { parseLoanDate, formatLoanDateYmd } from "@/lib/loanStatus";
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

function normalizeRequestStatus(row: RequestRow): string {
  const statusSource = String(row.movement_status ?? row.movement_type_de ?? "").toLowerCase();

  if (statusSource.includes("rechaz") || statusSource === "rejected") return "rejected";
  if (statusSource.includes("acept") || statusSource === "approved") return "approved";
  if (statusSource.includes("solicit") || statusSource === "requested" || statusSource === "pending") {
    return "pending";
  }

  return statusSource || "pending";
}

interface Props {
  onBack: () => void;
}

type ViewMode = "requests" | "loans";

type RegisterLine = {
  inventory_id: number;
  movement_detail_am: number;
  movement_detail_ob?: string;
};

function toDateYmd(value?: string | null): string {
  return formatLoanDateYmd(value);
}

function getLoanState(row: RequestRow): "active" | "overdue" {
  const est = parseLoanDate(row.movement_estimated_return_dt);
  if (!est) return "active";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  est.setHours(0, 0, 0, 0);
  return est < today ? "overdue" : "active";
}

function getErrorMessage(err: any, fallback: string): string {
  const alerts = Array.isArray(err?.alerts) ? err.alerts.filter(Boolean) : [];
  if (alerts.length > 0) return alerts.join(" | ");
  return err?.message ?? fallback;
}

const PrestamosAdminModule = ({ onBack }: Props) => {
  const [viewMode, setViewMode] = useState<ViewMode>("requests");
  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [acceptDialog, setAcceptDialog] = useState<RequestRow | null>(null);
  const [rejectDialog, setRejectDialog] = useState<RequestRow | null>(null);
  const [registerDialog, setRegisterDialog] = useState<RequestRow | null>(null);
  const [registerObservation, setRegisterObservation] = useState("");
  const [createFromScratchDialog, setCreateFromScratchDialog] = useState(false);
  const [estimatedReturn, setEstimatedReturn] = useState("");
  const [approveNote, setApproveNote] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [scratchUserId, setScratchUserId] = useState("");
  const [scratchEstimatedReturn, setScratchEstimatedReturn] = useState("");
  const [scratchObservation, setScratchObservation] = useState("");
  const [scratchLines, setScratchLines] = useState<Array<{ inventory_id: string; movement_detail_am: string; movement_detail_ob: string }>>([
    { inventory_id: "", movement_detail_am: "1", movement_detail_ob: "" },
  ]);

  const { data, isLoading, isError, error, refetch } = useRequestList();
  const { data: loanData, isLoading: loansLoading, isError: loansError, error: loansErrorData, refetch: refetchLoans } = useLoanList();
  const acceptRequest = useAcceptRequest();
  const rejectRequest = useRejectRequest();
  const registerLoan = useRegisterLoan();
  const createRequest = useCreateRequest();
  const { data: usersData } = useUserList();
  const { data: inventoryData } = useInventoryList();

  const registerRequestId = Number(registerDialog?.movement_id ?? 0);
  const { data: registerDetailResponse } = useRequestDetail(registerRequestId);

  const requests: RequestRow[] = Array.isArray(data?.data) ? data.data : [];
  const loans: RequestRow[] = Array.isArray(loanData?.data) ? loanData.data : [];
  const users: RequestRow[] = Array.isArray(usersData?.data) ? usersData.data : [];
  const inventory: RequestRow[] = Array.isArray(inventoryData?.data) ? inventoryData.data : [];

  const registerDetails = Array.isArray(registerDetailResponse?.data?.details)
    ? (registerDetailResponse?.data?.details as RegisterLine[])
    : [];

  const filtered = requests.filter((r) => {
    const status = normalizeRequestStatus(r);
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
      const normalized = normalizeRequestStatus(r);
      return normalized === status;
    }).length;

    const filteredLoans = loans.filter((r) => {
      const id = String(r.movement_id ?? "");
      const user = String(r.user_na ?? r.user_name ?? r.user_full_name ?? "").toLowerCase();
      const note = String(r.movement_ob ?? "").toLowerCase();
      const status = getLoanState(r);
      const textMatch =
        id.includes(search) ||
        user.includes(search.toLowerCase()) ||
        note.includes(search.toLowerCase());
      const statusMatch = filtro === "todos" || filtro === status;
      return textMatch && statusMatch;
    });

    const activeLoansCount = loans.filter((row) => getLoanState(row) === "active").length;
    const overdueLoansCount = loans.filter((row) => getLoanState(row) === "overdue").length;

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
      await refetch();
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
      await refetch();
      toast({ title: "Solicitud rechazada", description: `Solicitud ${rejectDialog.movement_id} rechazada.` });
      setRejectDialog(null);
      setRejectReason("");
    } catch (err: any) {
      toast({ title: "Error", description: err?.message ?? "No se pudo rechazar la solicitud", variant: "destructive" });
    }
  };

  const handleRegisterLoan = async (row: RequestRow) => {
    try {
      await registerLoan.mutateAsync({
        movement_id: Number(row.movement_id),
      });
      await refetch();
      toast({ title: "Préstamo registrado", description: `Solicitud ${row.movement_id} convertida en préstamo.` });
    } catch (err: any) {
      toast({ title: "Error", description: err?.message ?? "No se pudo registrar el préstamo", variant: "destructive" });
    }
  };

  const handleOpenRegisterLoan = (row: RequestRow) => {
    setRegisterDialog(row);
    setRegisterObservation("");
  };

  const handleRegisterFromApproved = async () => {
    if (!registerDialog) return;

    const sanitizedDetails = registerDetails
      .map((detail) => ({
        inventory_id: Number(detail.inventory_id),
        movement_detail_am: Number(detail.movement_detail_am),
        movement_detail_ob:
          detail.movement_detail_ob != null && String(detail.movement_detail_ob).trim().length > 0
            ? String(detail.movement_detail_ob)
            : undefined,
      }))
      .filter(
        (detail) =>
          Number.isInteger(detail.inventory_id) &&
          detail.inventory_id > 0 &&
          Number.isInteger(detail.movement_detail_am) &&
          detail.movement_detail_am > 0
      );

    try {
      await registerLoan.mutateAsync({
        movement_id: Number(registerDialog.movement_id),
        movement_ob: registerObservation || undefined,
        details: sanitizedDetails.length > 0 ? sanitizedDetails : undefined,
      });
      await Promise.all([refetch(), refetchLoans()]);
      toast({
        title: "Préstamo registrado",
        description: `Solicitud ${registerDialog.movement_id} convertida en préstamo.`,
      });
      setRegisterDialog(null);
      setRegisterObservation("");
    } catch (err: any) {
      toast({ title: "Error", description: getErrorMessage(err, "No se pudo registrar el préstamo"), variant: "destructive" });
    }
  };

  const addScratchLine = () => {
    setScratchLines((prev) => [...prev, { inventory_id: "", movement_detail_am: "1", movement_detail_ob: "" }]);
  };

  const removeScratchLine = (idx: number) => {
    setScratchLines((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== idx)));
  };

  const updateScratchLine = (idx: number, patch: Partial<{ inventory_id: string; movement_detail_am: string; movement_detail_ob: string }>) => {
    setScratchLines((prev) => prev.map((line, i) => (i === idx ? { ...line, ...patch } : line)));
  };

  const resetScratchForm = () => {
    setScratchUserId("");
    setScratchEstimatedReturn("");
    setScratchObservation("");
    setScratchLines([{ inventory_id: "", movement_detail_am: "1", movement_detail_ob: "" }]);
  };

  const handleCreateLoanFromScratch = async () => {
    const userId = Number(scratchUserId);
    if (!Number.isInteger(userId) || userId <= 0) {
      toast({ title: "Usuario requerido", description: "Seleccione un usuario válido.", variant: "destructive" });
      return;
    }

    if (!scratchEstimatedReturn) {
      toast({ title: "Fecha requerida", description: "Indique fecha estimada de retorno.", variant: "destructive" });
      return;
    }

    const parsedLines = scratchLines
      .map((line) => ({
        inventory_id: Number(line.inventory_id),
        movement_detail_am: Number(line.movement_detail_am),
        movement_detail_ob: line.movement_detail_ob?.trim() || undefined,
      }))
      .filter((line) => Number.isInteger(line.inventory_id) && line.inventory_id > 0 && Number.isInteger(line.movement_detail_am) && line.movement_detail_am > 0);

    if (parsedLines.length === 0) {
      toast({ title: "Detalles requeridos", description: "Agregue al menos un item válido para el préstamo.", variant: "destructive" });
      return;
    }

    try {
      const created = await createRequest.mutateAsync({
        user_id: userId,
        movement_ob: scratchObservation?.trim() || "Préstamo generado por supervisor",
        details: parsedLines,
      });

      const movementId = Number((created as any)?.data?.movement_id ?? 0);
      if (!Number.isInteger(movementId) || movementId <= 0) {
        throw new Error("No se obtuvo movement_id de la solicitud creada");
      }

      await acceptRequest.mutateAsync({
        movement_id: movementId,
        movement_estimated_return_dt: scratchEstimatedReturn,
      });

      await registerLoan.mutateAsync({
        movement_id: movementId,
      });

      await Promise.all([refetch(), refetchLoans()]);
      toast({ title: "Préstamo creado", description: `Se creó y registró el préstamo #${movementId}.` });
      setCreateFromScratchDialog(false);
      resetScratchForm();
    } catch (err: any) {
      toast({ title: "Error", description: err?.message ?? "No se pudo crear el préstamo desde cero", variant: "destructive" });
    }
  };

  if (isLoading || loansLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
        <span className="text-muted-foreground">Cargando datos...</span>
      </div>
    );
  }

  if (isError || loansError) {
    return (
      <div className="flex items-center justify-center py-12 text-destructive">
        <AlertCircle className="w-5 h-5 mr-2" />
        <span>{(error as any)?.message ?? (loansErrorData as any)?.message ?? "Error al cargar datos"}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BackButton onClick={onBack} />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <HandCoins className="w-7 h-7 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Gestión de Préstamos y Solicitudes</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "requests" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setViewMode("requests");
              setFiltro("todos");
              setSearch("");
            }}
          >
            Solicitudes
          </Button>
          <Button
            variant={viewMode === "loans" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setViewMode("loans");
              setFiltro("todos");
              setSearch("");
            }}
          >
            Préstamos
          </Button>
          <Button size="sm" onClick={() => setCreateFromScratchDialog(true)}>
            Crear desde cero
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {viewMode === "requests" ? (
          <>
            <Card><CardContent className="p-4 flex items-center gap-3"><Clock className="w-5 h-5 text-amber-500" /><div><p className="text-2xl font-bold text-foreground">{countByStatus("pending")}</p><p className="text-xs text-muted-foreground">Pendientes</p></div></CardContent></Card>
            <Card><CardContent className="p-4 flex items-center gap-3"><CheckCircle className="w-5 h-5 text-emerald-500" /><div><p className="text-2xl font-bold text-foreground">{countByStatus("approved")}</p><p className="text-xs text-muted-foreground">Aprobadas</p></div></CardContent></Card>
            <Card><CardContent className="p-4 flex items-center gap-3"><AlertTriangle className="w-5 h-5 text-destructive" /><div><p className="text-2xl font-bold text-foreground">{countByStatus("rejected")}</p><p className="text-xs text-muted-foreground">Rechazadas</p></div></CardContent></Card>
          </>
        ) : (
          <>
            <Card><CardContent className="p-4 flex items-center gap-3"><HandCoins className="w-5 h-5 text-primary" /><div><p className="text-2xl font-bold text-foreground">{loans.length}</p><p className="text-xs text-muted-foreground">Total préstamos</p></div></CardContent></Card>
            <Card><CardContent className="p-4 flex items-center gap-3"><CheckCircle className="w-5 h-5 text-emerald-500" /><div><p className="text-2xl font-bold text-foreground">{activeLoansCount}</p><p className="text-xs text-muted-foreground">Al día</p></div></CardContent></Card>
            <Card><CardContent className="p-4 flex items-center gap-3"><AlertTriangle className="w-5 h-5 text-destructive" /><div><p className="text-2xl font-bold text-foreground">{overdueLoansCount}</p><p className="text-xs text-muted-foreground">Vencidos</p></div></CardContent></Card>
          </>
        )}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-base">{viewMode === "requests" ? "Solicitudes de Préstamo" : "Préstamos Activos"}</CardTitle>
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {(viewMode === "requests" ? ["todos", "pending", "approved", "rejected"] : ["todos", "active", "overdue"]).map(f => (
                  <button key={f} onClick={() => setFiltro(f)} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filtro === f ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
                    {f === "todos" ? "Todos" : (f === "active" ? "Al día" : f === "overdue" ? "Vencidos" : estadoBadge[f]?.label ?? f)}
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
                <TableHead>{viewMode === "requests" ? "Fecha Solicitud" : "Fecha Estimada Retorno"}</TableHead>
                <TableHead>Estado</TableHead>
                {viewMode === "requests" && <TableHead>Acciones</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {(viewMode === "requests" ? filtered : filteredLoans).map((r) => {
                const status = normalizeRequestStatus(r);
                const badge = estadoBadge[status] ?? estadoBadge.pending;
                const isPending = status === "pending";
                const isApproved = status === "approved";
                const loanState = getLoanState(r);

                return (
                <TableRow key={r.movement_id}>
                  <TableCell className="font-mono text-xs">{r.movement_id}</TableCell>
                  <TableCell className="font-medium">{r.user_na ?? r.user_name ?? r.user_full_name ?? `Usuario #${r.user_id ?? "—"}`}</TableCell>
                  <TableCell>{r.movement_ob ?? "—"}</TableCell>
                  <TableCell>{toDateYmd(r.movement_estimated_return_dt) || toDateYmd(r.movement_booking_dt) || "—"}</TableCell>
                  <TableCell>
                    {viewMode === "requests" ? (
                      <Badge variant="outline" className={badge.className}>{badge.label}</Badge>
                    ) : (
                      <Badge variant="outline" className={loanState === "overdue" ? estadoBadge.overdue.className : estadoBadge.active.className}>
                        {loanState === "overdue" ? "Vencido" : "Al día"}
                      </Badge>
                    )}
                  </TableCell>
                  {viewMode === "requests" && <TableCell>
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
                      ) : isApproved ? (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleOpenRegisterLoan(r)}
                          disabled={registerLoan.isPending}
                        >
                          {registerLoan.isPending ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <HandCoins className="w-4 h-4 mr-1" />}
                          Registrar préstamo
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">Sin acciones</span>
                      )}
                    </div>
                  </TableCell>}
                </TableRow>
              )})}
              {(viewMode === "requests" ? filtered.length : filteredLoans.length) === 0 && (
                <TableRow><TableCell colSpan={viewMode === "requests" ? 6 : 5} className="text-center text-muted-foreground py-8">No se encontraron {viewMode === "requests" ? "solicitudes" : "préstamos"}</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!registerDialog} onOpenChange={(open) => !open && setRegisterDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar préstamo</DialogTitle>
            <DialogDescription>
              Confirme el registro del préstamo para la solicitud {registerDialog?.movement_id ?? ""}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Detalles de la solicitud</Label>
              <div className="max-h-36 overflow-y-auto rounded-md border border-border p-2 text-sm">
                {registerDetails.length === 0 ? (
                  <span className="text-muted-foreground">Sin detalles cargados.</span>
                ) : (
                  registerDetails.map((d, idx) => (
                    <div key={`${d.inventory_id}-${idx}`} className="flex items-center justify-between py-1 border-b border-border last:border-0">
                      <span>Inventario #{d.inventory_id}</span>
                      <span className="font-semibold">x{d.movement_detail_am}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Observación (opcional)</Label>
              <Textarea
                value={registerObservation}
                onChange={(e) => setRegisterObservation(e.target.value)}
                placeholder="Observación para registro de préstamo"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRegisterDialog(null)}>Cancelar</Button>
            <Button onClick={handleRegisterFromApproved} disabled={registerLoan.isPending}>
              {registerLoan.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Registrando...</> : "Confirmar registro"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={createFromScratchDialog} onOpenChange={(open) => {
        if (!open) resetScratchForm();
        setCreateFromScratchDialog(open);
      }}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Crear préstamo desde cero</DialogTitle>
            <DialogDescription>
              Crea solicitud, la aprueba y registra el préstamo en una sola acción.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Usuario</Label>
                <select
                  value={scratchUserId}
                  onChange={(e) => setScratchUserId(e.target.value)}
                  className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
                >
                  <option value="">Seleccione usuario</option>
                  {users.map((u) => (
                    <option key={u.user_id} value={String(u.user_id)}>
                      {u.user_na ?? u.user_em ?? `Usuario #${u.user_id}`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Fecha estimada de retorno</Label>
                <Input
                  type="date"
                  value={scratchEstimatedReturn}
                  onChange={(e) => setScratchEstimatedReturn(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Observación</Label>
              <Textarea
                value={scratchObservation}
                onChange={(e) => setScratchObservation(e.target.value)}
                placeholder="Observación del préstamo"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Items del préstamo</Label>
                <Button size="sm" variant="outline" onClick={addScratchLine}>Agregar item</Button>
              </div>
              <div className="space-y-2">
                {scratchLines.map((line, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-[1fr_120px_1fr_auto] gap-2 items-center">
                    <select
                      value={line.inventory_id}
                      onChange={(e) => updateScratchLine(idx, { inventory_id: e.target.value })}
                      className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
                    >
                      <option value="">Seleccione inventario</option>
                      {inventory
                        .filter((inv) => Number(inv.inventory_qt ?? 0) > 0)
                        .map((inv) => (
                          <option key={inv.inventory_id} value={String(inv.inventory_id)}>
                            {(inv.item_na ?? `Inv #${inv.inventory_id}`)} (disp: {inv.inventory_qt ?? 0})
                          </option>
                        ))}
                    </select>
                    <Input
                      type="number"
                      min={1}
                      value={line.movement_detail_am}
                      onChange={(e) => updateScratchLine(idx, { movement_detail_am: e.target.value })}
                    />
                    <Input
                      value={line.movement_detail_ob}
                      onChange={(e) => updateScratchLine(idx, { movement_detail_ob: e.target.value })}
                      placeholder="Observación item"
                    />
                    <Button variant="destructive" size="sm" onClick={() => removeScratchLine(idx)}>Quitar</Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateFromScratchDialog(false)}>Cancelar</Button>
            <Button
              onClick={handleCreateLoanFromScratch}
              disabled={createRequest.isPending || acceptRequest.isPending || registerLoan.isPending}
            >
              {(createRequest.isPending || acceptRequest.isPending || registerLoan.isPending)
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Procesando...</>
                : "Crear préstamo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
