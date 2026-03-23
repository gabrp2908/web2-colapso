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
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus, Clock, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Solicitud {
  id: string;
  componente: string;
  cantidad: number;
  fecha: string;
  motivo: string;
  estado: "pendiente" | "aprobada" | "rechazada";
}

const mockSolicitudes: Solicitud[] = [
  { id: "SOL-001", componente: "Arduino UNO R3", cantidad: 2, fecha: "2026-02-28", motivo: "Práctica de microcontroladores", estado: "aprobada" },
  { id: "SOL-002", componente: "Protoboard 830 puntos", cantidad: 1, fecha: "2026-03-01", motivo: "Proyecto de circuitos", estado: "pendiente" },
  { id: "SOL-003", componente: "Multímetro Digital", cantidad: 1, fecha: "2026-02-25", motivo: "Laboratorio de mediciones", estado: "rechazada" },
];

const componentesDisponibles = [
  "Resistencia 1kΩ", "Capacitor 100µF", "LED Rojo 5mm", "Transistor 2N2222",
  "Protoboard 830 puntos", "Multímetro Digital", "Arduino UNO R3",
  "Cable Jumper M-M", "Fuente de Poder 12V", "Osciloscopio Rigol",
];

const estadoConfig: Record<Solicitud["estado"], { icon: React.ReactNode; class: string }> = {
  pendiente: { icon: <Clock className="w-3.5 h-3.5" />, class: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  aprobada: { icon: <CheckCircle className="w-3.5 h-3.5" />, class: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  rechazada: { icon: <XCircle className="w-3.5 h-3.5" />, class: "bg-red-500/20 text-red-400 border-red-500/30" },
};

const SolicitudesModule = () => {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>(mockSolicitudes);
  const [componente, setComponente] = useState("");
  const [cantidad, setCantidad] = useState("1");
  const [motivo, setMotivo] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!componente || !motivo) {
      toast({ title: "Error", description: "Complete todos los campos.", variant: "destructive" });
      return;
    }
    const nueva: Solicitud = {
      id: `SOL-${String(solicitudes.length + 1).padStart(3, "0")}`,
      componente,
      cantidad: parseInt(cantidad) || 1,
      fecha: new Date().toISOString().split("T")[0],
      motivo,
      estado: "pendiente",
    };
    setSolicitudes([nueva, ...solicitudes]);
    setComponente("");
    setCantidad("1");
    setMotivo("");
    setDialogOpen(false);
    toast({ title: "Solicitud enviada", description: `Se creó la solicitud ${nueva.id} exitosamente.` });
  };

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
                <Label>Componente</Label>
                <Select value={componente} onValueChange={setComponente}>
                  <SelectTrigger><SelectValue placeholder="Seleccione un componente" /></SelectTrigger>
                  <SelectContent>
                    {componentesDisponibles.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Cantidad</Label>
                <Input type="number" min="1" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Motivo</Label>
                <Textarea
                  placeholder="Describa el motivo del préstamo..."
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button onClick={handleSubmit}>Enviar Solicitud</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead>ID</TableHead>
              <TableHead>Componente</TableHead>
              <TableHead className="text-center">Cant.</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Motivo</TableHead>
              <TableHead className="text-center">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {solicitudes.map((sol) => {
              const cfg = estadoConfig[sol.estado];
              return (
                <TableRow key={sol.id} className="border-border">
                  <TableCell className="font-mono text-accent">{sol.id}</TableCell>
                  <TableCell className="font-medium">{sol.componente}</TableCell>
                  <TableCell className="text-center">{sol.cantidad}</TableCell>
                  <TableCell className="text-muted-foreground">{sol.fecha}</TableCell>
                  <TableCell className="text-muted-foreground max-w-[200px] truncate">{sol.motivo}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={`gap-1 ${cfg.class}`}>
                      {cfg.icon}
                      {sol.estado.charAt(0).toUpperCase() + sol.estado.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SolicitudesModule;
