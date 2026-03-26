import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, ShieldCheck, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLoanList } from "@/hooks/useLoan";

const SolvenciaModule = () => {
  const { user } = useAuth();
  const { data, isLoading, isError, error } = useLoanList(
    user?.userId ? { user_id: user.userId } : undefined
  );

  const loans: any[] = Array.isArray(data?.data) ? data.data : [];

  const activos = loans.filter((l: any) => l.loan_status === "active" || l.loan_status === "activo").length;
  const vencidos = loans.filter((l: any) => l.loan_status === "overdue" || l.loan_status === "vencido").length;
  const devueltos = loans.filter((l: any) => l.loan_status === "returned" || l.loan_status === "devuelto").length;
  const esSolvente = vencidos === 0 && activos === 0;

  if (isLoading) return <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary mr-2" /><span className="text-muted-foreground">Consultando solvencia...</span></div>;
  if (isError) return <div className="flex items-center justify-center py-12 text-destructive"><AlertCircle className="w-5 h-5 mr-2" /><span>{(error as any)?.message ?? "Error"}</span></div>;

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-foreground">Estado de Solvencia</h2>

      <Card className={`border-2 ${esSolvente ? "border-emerald-500/40 bg-emerald-500/5" : "border-amber-500/40 bg-amber-500/5"}`}>
        <CardHeader className="pb-2 flex-row items-center gap-3 space-y-0">
          <ShieldCheck className={`w-8 h-8 ${esSolvente ? "text-emerald-400" : "text-amber-400"}`} />
          <div>
            <CardTitle className="text-lg">{esSolvente ? "Solvente" : "No Solvente"}</CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5">
              {esSolvente
                ? "No tienes préstamos pendientes. Puedes solicitar nuevos componentes."
                : `Tienes ${activos} préstamo(s) activo(s) y ${vencidos} vencido(s). Devuélvelos para estar solvente.`}
            </p>
          </div>
        </CardHeader>
      </Card>

      {user && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Usuario</p>
            <p className="text-lg font-bold text-foreground">{user.username ?? "—"}</p>
            <p className="text-sm text-muted-foreground mt-1">{user.email ?? ""}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-3 gap-3">
        <Card><CardContent className="pt-4 pb-4 text-center"><p className="text-2xl font-bold text-amber-400">{activos}</p><p className="text-xs text-muted-foreground mt-1">Activos</p></CardContent></Card>
        <Card><CardContent className="pt-4 pb-4 text-center"><p className="text-2xl font-bold text-red-400">{vencidos}</p><p className="text-xs text-muted-foreground mt-1">Vencidos</p></CardContent></Card>
        <Card><CardContent className="pt-4 pb-4 text-center"><p className="text-2xl font-bold text-emerald-400">{devueltos}</p><p className="text-xs text-muted-foreground mt-1">Devueltos</p></CardContent></Card>
      </div>
    </div>
  );
};

export default SolvenciaModule;
