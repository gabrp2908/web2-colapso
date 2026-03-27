import { useMemo, useState, type ReactNode } from "react";
import { Bell, CheckCheck, Clock, Info, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useNotificationList, useUpdateNotification } from "@/hooks/useSecurity";
import { useAuth } from "@/contexts/AuthContext";


interface Notificacion {
  id: number;
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
  tipo: "info" | "alerta" | "exito";
}

type NotificationRow = {
  notification_id: number;
  notification_ty?: string | null;
  notification_tit?: string | null;
  notification_msg?: string | null;
  notification_read?: boolean;
  notification_dt?: string | null;
};

const tipoIcon: Record<Notificacion["tipo"], ReactNode> = {
  info: <Info className="w-4 h-4 text-blue-400" />,
  alerta: <AlertTriangle className="w-4 h-4 text-amber-400" />,
  exito: <CheckCheck className="w-4 h-4 text-emerald-400" />,
};

function toRelativeDate(value?: string | null): string {
  if (!value) return "Ahora";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return "Ahora";

  const diffMs = Date.now() - dt.getTime();
  const diffMin = Math.max(1, Math.floor(diffMs / 60000));
  if (diffMin < 60) return `Hace ${diffMin} min`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `Hace ${diffHours} hora${diffHours === 1 ? "" : "s"}`;

  const diffDays = Math.floor(diffHours / 24);
  return `Hace ${diffDays} día${diffDays === 1 ? "" : "s"}`;
}

function mapType(value?: string | null): Notificacion["tipo"] {
  const type = (value ?? "").toLowerCase();
  if (type.includes("warn") || type.includes("alert") || type.includes("devolution")) return "alerta";
  if (type.includes("success") || type.includes("exito")) return "exito";
  return "info";
}

const NotificationsPanel = () => {
  const [readIds, setReadIds] = useState<Set<number>>(new Set());
  const [processingIds, setProcessingIds] = useState<Set<number>>(new Set());
  const [mostrarTodas, setMostrarTodas] = useState(false);
  const { user } = useAuth();
  const updateNotification = useUpdateNotification();
  const { data: notificationsResponse } = useNotificationList(
    user?.userId ? { user_id: user.userId } : undefined
  );

  const notificaciones: Notificacion[] = useMemo(() => {
    const rows = ((notificationsResponse?.data as NotificationRow[] | undefined) ?? []);
    return rows.map((row) => ({
      id: row.notification_id,
      titulo: row.notification_tit ?? "Notificación",
      mensaje: row.notification_msg ?? "",
      fecha: toRelativeDate(row.notification_dt),
      leida: Boolean(row.notification_read) || readIds.has(row.notification_id),
      tipo: mapType(row.notification_ty),
    }));
  }, [notificationsResponse, readIds]);

  const noLeidas = notificaciones.filter((n) => !n.leida).length;

  const marcarTodasLeidas = async () => {
    const unreadIds = notificaciones.filter((n) => !n.leida).map((n) => n.id);
    if (unreadIds.length === 0) return;

    setReadIds((prev) => {
      const next = new Set(prev);
      unreadIds.forEach((id) => next.add(id));
      return next;
    });

    setProcessingIds((prev) => {
      const next = new Set(prev);
      unreadIds.forEach((id) => next.add(id));
      return next;
    });

    const results = await Promise.allSettled(
      unreadIds.map((id) => updateNotification.mutateAsync({ id, notification_read: true }))
    );

    const failedIds = unreadIds.filter((_, idx) => results[idx].status === "rejected");
    if (failedIds.length > 0) {
      setReadIds((prev) => {
        const next = new Set(prev);
        failedIds.forEach((id) => next.delete(id));
        return next;
      });
    }

    setProcessingIds((prev) => {
      const next = new Set(prev);
      unreadIds.forEach((id) => next.delete(id));
      return next;
    });
  };

  const marcarLeida = async (id: number) => {
    if (processingIds.has(id)) return;

    setProcessingIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });

    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });

    try {
      await updateNotification.mutateAsync({ id, notification_read: true });
    } catch {
      setReadIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const visibles = mostrarTodas ? notificaciones : notificaciones.slice(0, 4);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white dark:text-foreground hover:bg-white/10 dark:hover:bg-secondary relative">
          <Bell className="w-5 h-5" />
          {noLeidas > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
              {noLeidas}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 bg-card border-border">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="font-semibold text-sm text-foreground">Notificaciones</h3>
          {noLeidas > 0 && (
            <Button variant="ghost" size="sm" className="text-xs text-accent h-auto py-1" onClick={() => void marcarTodasLeidas()}>
              Marcar todas como leídas
            </Button>
          )}
        </div>
        <div className="max-h-[350px] overflow-y-auto overflow-x-hidden">
          {notificaciones.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-8">Sin notificaciones</p>
          ) : (
            <>
              {visibles.map((n) => (
                <button
                  key={n.id}
                  onClick={() => void marcarLeida(n.id)}
                  className={`w-full text-left px-4 py-3 border-b border-border last:border-0 transition-colors hover:bg-secondary/50 ${
                    !n.leida ? "bg-secondary/30" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="mt-0.5 shrink-0">{tipoIcon[n.tipo]}</div>
                    <div className="min-w-0">
                      <p className={`text-sm font-medium ${!n.leida ? "text-foreground" : "text-muted-foreground"}`}>
                        {n.titulo}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.mensaje}</p>
                      <p className="text-[10px] text-muted-foreground/70 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {n.fecha}
                      </p>
                    </div>
                    {!n.leida && <span className="w-2 h-2 bg-accent rounded-full mt-1.5 shrink-0" />}
                  </div>
                </button>
              ))}
              {!mostrarTodas && notificaciones.length > 4 && (
                <div className="p-2 border-t border-border mt-auto sticky bottom-0 bg-card">
                  <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground hover:text-foreground" onClick={() => setMostrarTodas(true)}>
                    Ver más...
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPanel;
