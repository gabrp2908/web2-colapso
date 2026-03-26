import { useMemo, useState } from "react";
import { BarChart3, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateReport, useReportList } from "@/hooks/useBusiness";
import { toast } from "@/hooks/use-toast";

type ReportSummary = {
  id: number;
  report_ty: "overdue_loans" | "solvency" | "devolution_stats";
  report_na: string;
  report_de?: string;
};

type ReportGenerated = {
  id: number;
  report_ty: string;
  report_na: string;
  generated_dt: string;
  summary?: Record<string, number>;
  data?: Array<Record<string, unknown>>;
};

const ReportesModule = () => {
  const { data, isLoading } = useReportList();
  const createReport = useCreateReport();
  const [selectedType, setSelectedType] = useState<ReportSummary["report_ty"]>("solvency");
  const [generated, setGenerated] = useState<ReportGenerated | null>(null);

  const catalog: ReportSummary[] = useMemo(() => {
    const rows = data?.data;
    return Array.isArray(rows) ? (rows as ReportSummary[]) : [];
  }, [data]);

  const onGenerate = async () => {
    try {
      const response = await createReport.mutateAsync({ report_ty: selectedType });
      setGenerated((response?.data as ReportGenerated | undefined) ?? null);
      toast({ title: "Reporte generado", description: "Se obtuvo información actualizada del backend" });
    } catch {
      toast({ title: "Error", description: "No se pudo generar el reporte", variant: "destructive" });
    }
  };

  const summaryEntries = Object.entries(generated?.summary ?? {});
  const rows = Array.isArray(generated?.data) ? generated.data : [];
  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2"><BarChart3 className="w-6 h-6 text-primary" /> Reportes</h2>
        <p className="text-sm text-muted-foreground">Reportes analíticos en tiempo real desde backend</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 space-y-4">
        <div className="flex items-center gap-3">
          <Select value={selectedType} onValueChange={(v) => setSelectedType(v as ReportSummary["report_ty"])}>
            <SelectTrigger className="w-[260px]"><SelectValue placeholder="Seleccione reporte" /></SelectTrigger>
            <SelectContent>
              {catalog.map((c) => (
                <SelectItem key={c.id} value={c.report_ty}>{c.report_na}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={onGenerate} disabled={createReport.isPending || isLoading}>Generar</Button>
        </div>

        {generated && (
          <div className="space-y-3">
            <div>
              <p className="text-base font-semibold text-foreground">{generated.report_na}</p>
              <p className="text-xs text-muted-foreground">Generado: {new Date(generated.generated_dt).toLocaleString()}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {summaryEntries.map(([key, value]) => (
                <div key={key} className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">{key}</p>
                  <p className="text-xl font-bold text-foreground">{value}</p>
                </div>
              ))}
            </div>

            <div className="overflow-auto border border-border rounded-lg">
              {rows.length === 0 ? (
                <p className="text-sm text-muted-foreground p-4">Sin filas para mostrar.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-secondary/40 border-b border-border">
                      {columns.map((col) => (
                        <th key={col} className="text-left p-2 font-medium text-muted-foreground">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, idx) => (
                      <tr key={idx} className="border-b border-border last:border-0">
                        {columns.map((col) => (
                          <td key={`${idx}-${col}`} className="p-2 text-foreground">{String(row[col] ?? "-")}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-card border border-border rounded-xl p-4">
        <p className="text-sm font-semibold text-foreground flex items-center gap-2"><FileText className="w-4 h-4" /> Catálogo disponible</p>
        <ul className="mt-2 text-sm text-muted-foreground space-y-1">
          {catalog.map((c) => (
            <li key={c.id}>#{c.id} {c.report_na}</li>
          ))}
          {catalog.length === 0 && <li>No hay tipos de reporte disponibles.</li>}
        </ul>
      </div>
    </div>
  );
};

export default ReportesModule;
