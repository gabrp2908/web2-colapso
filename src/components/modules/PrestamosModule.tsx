import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { HandCoins, Search, Clock, AlertTriangle, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { useLoanList } from "@/hooks/useLoan";

const estadoBadge: Record<string, { className: string; label: string }> = {
  active: { className: "bg-primary/20 text-primary border-primary/30", label: "Activo" },
  overdue: { className: "bg-destructive/20 text-destructive border-destructive/30", label: "Vencido" },
  returned: { className: "bg-muted text-muted-foreground border-border", label: "Devuelto" },
  pending: { className: "bg-amber-500/20 text-amber-400 border-amber-500/30", label: "Pendiente" },
};

const getEstadoBadge = (status: string) => {
  return estadoBadge[status] ?? { className: "bg-secondary text-secondary-foreground", label: status };
};

const PrestamosModule = () => {
  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState<string>("todos");

  const { data, isLoading, isError, error } = useLoanList();

  const loans: any[] = Array.isArray(data?.data) ? data.data : [];

  const filtered = loans.filter((p: any) => {
    const name = p.item_na ?? p.componente ?? "";
    const id = String(p.movement_id ?? p.id ?? "");
    const matchSearch =
      String(name).toLowerCase().includes(search.toLowerCase()) ||
      id.toLowerCase().includes(search.toLowerCase());

    if (filtro === "todos") return matchSearch;
    const status = p.movement_status ?? p.estado ?? "";
    return matchSearch && status === filtro;
  });

  const countByStatus = (status: string) =>
    loans.filter((p: any) => (p.movement_status ?? p.estado) === status).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
        <span className="text-muted-foreground">Cargando préstamos...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-12 text-destructive">
        <AlertCircle className="w-5 h-5 mr-2" />
        <span>{(error as any)?.message ?? "Error al cargar préstamos"}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <HandCoins className="w-7 h-7 text-primary" />
        <h2 className="text-xl font-bold text-foreground">Mis Préstamos</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><Clock className="w-5 h-5 text-primary" /><div><p className="text-2xl font-bold text-foreground">{countByStatus("active")}</p><p className="text-xs text-muted-foreground">Activos</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><AlertTriangle className="w-5 h-5 text-destructive" /><div><p className="text-2xl font-bold text-foreground">{countByStatus("overdue")}</p><p className="text-xs text-muted-foreground">Vencidos</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><CheckCircle className="w-5 h-5 text-accent" /><div><p className="text-2xl font-bold text-foreground">{countByStatus("returned")}</p><p className="text-xs text-muted-foreground">Devueltos</p></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-base">Historial de Préstamos</CardTitle>
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {["todos", "active", "overdue", "returned"].map((f) => (
                  <button key={f} onClick={() => setFiltro(f)} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filtro === f ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
                    {f === "todos" ? "Todos" : getEstadoBadge(f).label}
                  </button>
                ))}
              </div>
              <div className="relative w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Buscar..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Observación</TableHead>
                <TableHead>Fecha Préstamo</TableHead>
                <TableHead>Fecha Estimada Retorno</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p: any) => {
                const status = p.movement_status ?? "pending";
                const badge = getEstadoBadge(status);
                return (
                  <TableRow key={p.movement_id}>
                    <TableCell className="font-mono text-xs">{p.movement_id}</TableCell>
                    <TableCell>{p.movement_ob ?? "—"}</TableCell>
                    <TableCell>{p.movement_booking_dt ?? "—"}</TableCell>
                    <TableCell>{p.movement_estimated_return_dt ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={badge.className}>{badge.label}</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No se encontraron préstamos</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrestamosModule;
