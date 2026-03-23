import { useState } from "react";
import { Send, AlertTriangle, Clock, User, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface UsuarioVencido {
  id: string;
  nombre: string;
  cedula: string;
  componente: string;
  fechaLimite: string;
  diasVencido: number;
}

const mockVencidos: UsuarioVencido[] = [
  { id: "1", nombre: "Carlos García", cedula: "12345678", componente: "Multímetro Fluke", fechaLimite: "2025-03-01", diasVencido: 16 },
  { id: "2", nombre: "Ana Martínez", cedula: "23456789", componente: "Protoboard", fechaLimite: "2025-03-10", diasVencido: 7 },
  { id: "3", nombre: "Luis Rodríguez", cedula: "34567890", componente: "Osciloscopio Rigol", fechaLimite: "2025-03-05", diasVencido: 12 },
  { id: "4", nombre: "María Fernández", cedula: "45678901", componente: "Fuente de Poder", fechaLimite: "2025-03-12", diasVencido: 5 },
];

interface NotificacionEnviada {
  id: string;
  destinatario: string;
  tipo: string;
  mensaje: string;
  fecha: string;
}

const mockHistorial: NotificacionEnviada[] = [
  { id: "N1", destinatario: "Carlos García", tipo: "Vencimiento", mensaje: "Su préstamo del Multímetro ha vencido.", fecha: "2025-03-14" },
  { id: "N2", destinatario: "Ana Martínez", tipo: "Recordatorio", mensaje: "Recuerde devolver el Protoboard.", fecha: "2025-03-13" },
];

const NotificarModule = () => {
  const [destinatario, setDestinatario] = useState("");
  const [tipo, setTipo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [historial, setHistorial] = useState<NotificacionEnviada[]>(mockHistorial);

  const enviarNotificacion = () => {
    if (!destinatario || !tipo || !mensaje.trim()) {
      toast.error("Complete todos los campos antes de enviar.");
      return;
    }
    const usuario = mockVencidos.find((u) => u.id === destinatario);
    const nueva: NotificacionEnviada = {
      id: `N${Date.now()}`,
      destinatario: usuario?.nombre || "Desconocido",
      tipo,
      mensaje,
      fecha: new Date().toISOString().split("T")[0],
    };
    setHistorial([nueva, ...historial]);
    setDestinatario("");
    setTipo("");
    setMensaje("");
    toast.success(`Notificación enviada a ${usuario?.nombre}`);
  };

  const notificarDirecto = (usuario: UsuarioVencido) => {
    const msg = `Estimado(a) ${usuario.nombre}, su préstamo del componente "${usuario.componente}" venció el ${usuario.fechaLimite}. Tiene ${usuario.diasVencido} día(s) de retraso. Por favor acérquese al laboratorio para regularizar su situación.`;
    const nueva: NotificacionEnviada = {
      id: `N${Date.now()}`,
      destinatario: usuario.nombre,
      tipo: "Vencimiento",
      mensaje: msg,
      fecha: new Date().toISOString().split("T")[0],
    };
    setHistorial([nueva, ...historial]);
    toast.success(`Notificación de vencimiento enviada a ${usuario.nombre}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Notificar Usuarios</h2>
        <p className="text-sm text-muted-foreground">Envíe notificaciones a usuarios con préstamos vencidos o recordatorios</p>
      </div>

      {/* Users with overdue loans */}
      <div>
        <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          Préstamos Vencidos
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {mockVencidos.map((u) => (
            <div
              key={u.id}
              className="bg-card border border-border rounded-xl p-4 flex items-center justify-between hover:border-accent transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="font-medium text-foreground text-sm truncate">{u.nombre}</span>
                </div>
                <p className="text-xs text-muted-foreground ml-6">{u.componente}</p>
                <div className="flex items-center gap-2 ml-6 mt-1">
                  <Clock className="w-3 h-3 text-red-400" />
                  <span className="text-xs text-red-400">{u.diasVencido} días de retraso</span>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => notificarDirecto(u)}
                className="shrink-0 ml-3"
              >
                <Send className="w-3.5 h-3.5 mr-1" />
                Notificar
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Manual notification form */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-base font-semibold text-foreground mb-4">Enviar Notificación Manual</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Destinatario</label>
            <Select value={destinatario} onValueChange={setDestinatario}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Seleccionar usuario" />
              </SelectTrigger>
              <SelectContent>
                {mockVencidos.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.nombre} — {u.cedula}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Tipo</label>
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Tipo de notificación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Vencimiento">Vencimiento</SelectItem>
                <SelectItem value="Recordatorio">Recordatorio</SelectItem>
                <SelectItem value="Información">Información</SelectItem>
                <SelectItem value="Urgente">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mb-4">
          <label className="text-sm text-muted-foreground mb-1.5 block">Mensaje</label>
          <Textarea
            placeholder="Escriba el mensaje de la notificación..."
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            className="bg-background border-border min-h-[80px]"
          />
        </div>
        <Button onClick={enviarNotificacion}>
          <Send className="w-4 h-4 mr-2" />
          Enviar Notificación
        </Button>
      </div>

      {/* History */}
      <div>
        <h3 className="text-base font-semibold text-foreground mb-3">Historial de Notificaciones</h3>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left p-3 text-muted-foreground font-medium">Fecha</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Destinatario</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Tipo</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Mensaje</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((n) => (
                <tr key={n.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                  <td className="p-3 text-foreground">{n.fecha}</td>
                  <td className="p-3 text-foreground">{n.destinatario}</td>
                  <td className="p-3">
                    <Badge variant="outline" className={
                      n.tipo === "Vencimiento" ? "bg-red-500/15 text-red-400 border-red-500/30" :
                      n.tipo === "Urgente" ? "bg-amber-500/15 text-amber-400 border-amber-500/30" :
                      "bg-blue-500/15 text-blue-400 border-blue-500/30"
                    }>
                      {n.tipo}
                    </Badge>
                  </td>
                  <td className="p-3 text-muted-foreground max-w-xs truncate">{n.mensaje}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NotificarModule;
