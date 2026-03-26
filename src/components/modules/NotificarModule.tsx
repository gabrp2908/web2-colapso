import { useMemo, useState } from "react";
import { Send, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useCreateNotification, useNotificationList, useUserList } from "@/hooks/useSecurity";

interface NotificacionEnviada {
  id: number;
  destinatario: string;
  tipo: string;
  mensaje: string;
  fecha: string;
}

type UserRow = {
  user_id: number;
  user_na?: string | null;
  user_em?: string | null;
};

type NotificationRow = {
  notification_id: number;
  user_id: number;
  notification_ty?: string | null;
  notification_msg?: string | null;
  notification_dt?: string | null;
};

const NotificarModule = () => {
  const { data: usersResponse } = useUserList();
  const { data: notificationsResponse } = useNotificationList();
  const createNotification = useCreateNotification();

  const [destinatarioTipo, setDestinatarioTipo] = useState<"usuario" | "todos">("usuario");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [tipo, setTipo] = useState("");
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");

  const users = useMemo(() => {
    const rows = usersResponse?.data;
    return Array.isArray(rows) ? (rows as UserRow[]) : [];
  }, [usersResponse]);

  const userMap = useMemo(() => {
    return new Map<number, UserRow>(users.map((u) => [u.user_id, u]));
  }, [users]);

  const historial: NotificacionEnviada[] = useMemo(() => {
    const rows = notificationsResponse?.data;
    if (!Array.isArray(rows)) return [];
    return (rows as NotificationRow[]).map((n) => {
      const targetUser = userMap.get(Number(n.user_id));
      const displayName = targetUser?.user_na || targetUser?.user_em || `Usuario #${n.user_id}`;
      return {
        id: Number(n.notification_id ?? 0),
        destinatario: displayName,
        tipo: String(n.notification_ty ?? "info"),
        mensaje: String(n.notification_msg ?? ""),
        fecha: new Date(String(n.notification_dt ?? new Date().toISOString())).toISOString().split("T")[0],
      };
    });
  }, [notificationsResponse, userMap]);

  const enviarNotificacion = async () => {
    if (!tipo || !mensaje.trim() || !asunto.trim()) {
      toast.error("Complete todos los campos antes de enviar.");
      return;
    }

    const destinationUserIds =
      destinatarioTipo === "usuario"
        ? (() => {
            const userId = Number(selectedUserId);
            return Number.isInteger(userId) && userId > 0 ? [userId] : [];
          })()
        : users.map((u) => u.user_id);

    if (destinationUserIds.length === 0) {
      toast.error("Seleccione un destinatario válido.");
      return;
    }

    try {
      const results = await Promise.allSettled(
        destinationUserIds.map((userId) =>
          createNotification.mutateAsync({
            user_id: userId,
            notification_ty: tipo,
            notification_tit: asunto,
            notification_msg: mensaje,
          })
        )
      );

      const okCount = results.filter((r) => r.status === "fulfilled").length;
      const failCount = results.length - okCount;

      setTipo("");
      setAsunto("");
      setMensaje("");

      if (failCount === 0) {
        toast.success(`Notificación enviada a ${okCount} destinatario(s)`);
      } else {
        toast.warning(`Enviadas: ${okCount}. Fallidas: ${failCount}.`);
      }
    } catch {
      toast.error("No se pudo enviar la notificación");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Notificar Usuarios</h2>
        <p className="text-sm text-muted-foreground">Envíe notificaciones reales por backend y consulte el historial</p>
      </div>

      {/* Manual notification form */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-base font-semibold text-foreground mb-4">Enviar Notificación Manual</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Modo de destinatario</label>
            <Select value={destinatarioTipo} onValueChange={(v) => setDestinatarioTipo(v as "usuario" | "todos") }>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Seleccione modo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usuario">Usuario específico</SelectItem>
                <SelectItem value="todos">Todos los usuarios</SelectItem>
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
                <SelectItem value="warning">Vencimiento</SelectItem>
                <SelectItem value="reminder">Recordatorio</SelectItem>
                <SelectItem value="info">Información</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {destinatarioTipo === "usuario" && (
          <div className="mb-4">
            <label className="text-sm text-muted-foreground mb-1.5 block">Destinatario</label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Seleccione usuario" />
              </SelectTrigger>
              <SelectContent>
                {users.map((u) => (
                  <SelectItem key={u.user_id} value={String(u.user_id)}>
                    {(u.user_na || "Sin nombre")} {u.user_em ? `(${u.user_em})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {destinatarioTipo === "todos" && (
          <div className="mb-4 rounded-lg border border-border bg-secondary/20 px-3 py-2 text-xs text-muted-foreground flex items-center gap-2">
            <Users className="w-4 h-4" />
            Se enviará la notificación a todos los usuarios disponibles ({users.length}).
          </div>
        )}
        <div className="mb-4">
          <label className="text-sm text-muted-foreground mb-1.5 block">Asunto</label>
          <Input
            placeholder="Título de la notificación"
            value={asunto}
            onChange={(e) => setAsunto(e.target.value)}
            className="bg-background border-border"
          />
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
                <tr key={String(n.id)} className="border-b border-border last:border-0 hover:bg-secondary/30">
                  <td className="p-3 text-foreground">{n.fecha}</td>
                  <td className="p-3 text-foreground">{n.destinatario}</td>
                  <td className="p-3">
                    <Badge variant="outline" className={
                      n.tipo === "warning" ? "bg-red-500/15 text-red-400 border-red-500/30" :
                      n.tipo === "urgent" ? "bg-amber-500/15 text-amber-400 border-amber-500/30" :
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
