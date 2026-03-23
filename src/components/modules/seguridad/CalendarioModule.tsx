import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import BackButton from "@/components/BackButton";

interface PeriodoAcademico {
  id: string;
  nombre: string;
  tipo: "semestre" | "intensivo" | "vacaciones" | "especial";
  fechaInicio: string;
  fechaFin: string;
  estado: "activo" | "próximo" | "finalizado";
}

const mockPeriodos: PeriodoAcademico[] = [
  { id: "PA-001", nombre: "Semestre 2025-I", tipo: "semestre", fechaInicio: "2025-01-13", fechaFin: "2025-05-30", estado: "activo" },
  { id: "PA-002", nombre: "Intensivo 2025-I", tipo: "intensivo", fechaInicio: "2025-06-02", fechaFin: "2025-07-11", estado: "próximo" },
  { id: "PA-003", nombre: "Vacaciones Jul-Ago", tipo: "vacaciones", fechaInicio: "2025-07-14", fechaFin: "2025-08-29", estado: "próximo" },
  { id: "PA-004", nombre: "Semestre 2025-II", tipo: "semestre", fechaInicio: "2025-09-01", fechaFin: "2026-01-16", estado: "próximo" },
  { id: "PA-005", nombre: "Semestre 2024-II", tipo: "semestre", fechaInicio: "2024-09-02", fechaFin: "2025-01-10", estado: "finalizado" },
  { id: "PA-006", nombre: "Jornada de Investigación", tipo: "especial", fechaInicio: "2025-04-07", fechaFin: "2025-04-11", estado: "activo" },
];

const tipoColor: Record<string, string> = {
  semestre: "bg-blue-600 hover:bg-blue-700",
  intensivo: "bg-amber-500 hover:bg-amber-600 text-white",
  vacaciones: "bg-emerald-600 hover:bg-emerald-700",
  especial: "bg-violet-600 hover:bg-violet-700 text-white",
};

const estadoColor: Record<string, string> = {
  activo: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  "próximo": "bg-blue-500/15 text-blue-400 border-blue-500/30",
  finalizado: "bg-secondary text-secondary-foreground",
};

const CalendarioModule = ({ onBack }: { onBack: () => void }) => {
  const [periodos, setPeriodos] = useState(mockPeriodos);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editPeriodo, setEditPeriodo] = useState<PeriodoAcademico | null>(null);
  const [form, setForm] = useState({ nombre: "", tipo: "semestre", fechaInicio: "", fechaFin: "" });

  const handleSave = () => {
    if (!form.nombre || !form.fechaInicio || !form.fechaFin) {
      toast({ title: "Error", description: "Complete todos los campos.", variant: "destructive" });
      return;
    }
    if (editPeriodo) {
      setPeriodos((prev) => prev.map((p) => p.id === editPeriodo.id ? { ...p, ...form, tipo: form.tipo as PeriodoAcademico["tipo"] } : p));
      toast({ title: "Periodo actualizado" });
    } else {
      setPeriodos((prev) => [...prev, { id: `PA-${String(prev.length + 1).padStart(3, "0")}`, ...form, tipo: form.tipo as PeriodoAcademico["tipo"], estado: "próximo" as const }]);
      toast({ title: "Periodo creado" });
    }
    setDialogOpen(false);
  };

  const handleDelete = (p: PeriodoAcademico) => {
    setPeriodos((prev) => prev.filter((x) => x.id !== p.id));
    toast({ title: "Periodo eliminado" });
  };

  const openNew = () => { setEditPeriodo(null); setForm({ nombre: "", tipo: "semestre", fechaInicio: "", fechaFin: "" }); setDialogOpen(true); };
  const openEdit = (p: PeriodoAcademico) => { setEditPeriodo(p); setForm({ nombre: p.nombre, tipo: p.tipo, fechaInicio: p.fechaInicio, fechaFin: p.fechaFin }); setDialogOpen(true); };

  return (
    <div className="space-y-6">
      <BackButton onClick={onBack} />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarDays className="w-6 h-6 text-accent" />
          <h2 className="text-xl font-bold text-foreground">Calendario Académico</h2>
        </div>
        <Button size="sm" onClick={openNew}><Plus className="w-4 h-4 mr-1" /> Nuevo Periodo</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {periodos.map((p) => (
          <Card key={p.id} className="hover:border-accent transition-colors">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <Badge className={tipoColor[p.tipo]}>{p.tipo.charAt(0).toUpperCase() + p.tipo.slice(1)}</Badge>
                <Badge variant="outline" className={estadoColor[p.estado]}>{p.estado.charAt(0).toUpperCase() + p.estado.slice(1)}</Badge>
              </div>
              <h3 className="font-semibold text-foreground mb-2">{p.nombre}</h3>
              <div className="text-sm text-muted-foreground space-y-1 mb-3">
                <p>Inicio: <span className="text-foreground">{p.fechaInicio}</span></p>
                <p>Fin: <span className="text-foreground">{p.fechaFin}</span></p>
              </div>
              <div className="flex justify-end gap-1">
                <Button size="icon" variant="ghost" onClick={() => openEdit(p)}><Edit className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => handleDelete(p)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editPeriodo ? "Editar Periodo" : "Nuevo Periodo"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Nombre</Label><Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} /></div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="semestre">Semestre</SelectItem>
                  <SelectItem value="intensivo">Intensivo</SelectItem>
                  <SelectItem value="vacaciones">Vacaciones</SelectItem>
                  <SelectItem value="especial">Especial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Fecha Inicio</Label><Input type="date" value={form.fechaInicio} onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })} /></div>
              <div className="space-y-2"><Label>Fecha Fin</Label><Input type="date" value={form.fechaFin} onChange={(e) => setForm({ ...form, fechaFin: e.target.value })} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarioModule;
