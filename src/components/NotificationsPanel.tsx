import { useState } from "react";
import { Bell, CheckCheck, Clock, Info, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";


interface Notificacion {
  id: string;
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
  tipo: "info" | "alerta" | "exito";
}

const mockNotificaciones: Notificacion[] = [
  { id: "1", titulo: "Solicitud aprobada", mensaje: "Tu solicitud SOL-001 fue aprobada por el supervisor.", fecha: "Hace 5 min", leida: false, tipo: "exito" },
  { id: "2", titulo: "Devolución pendiente", mensaje: "Tienes una devolución pendiente del Multímetro Digital.", fecha: "Hace 1 hora", leida: false, tipo: "alerta" },
  { id: "3", titulo: "Nuevo componente", mensaje: "Se agregaron 50 unidades de Resistencia 1kΩ al inventario.", fecha: "Hace 3 horas", leida: false, tipo: "info" },
  { id: "4", titulo: "Mantenimiento programado", mensaje: "El Osciloscopio Rigol estará en mantenimiento hasta el viernes.", fecha: "Ayer", leida: true, tipo: "info" },
  { id: "5", titulo: "Solicitud rechazada", mensaje: "Tu solicitud SOL-003 fue rechazada. Motivo: sin stock.", fecha: "Hace 2 días", leida: true, tipo: "alerta" },
];

const tipoIcon: Record<Notificacion["tipo"], React.ReactNode> = {
  info: <Info className="w-4 h-4 text-blue-400" />,
  alerta: <AlertTriangle className="w-4 h-4 text-amber-400" />,
  exito: <CheckCheck className="w-4 h-4 text-emerald-400" />,
};

const NotificationsPanel = () => {
  const [notificaciones, setNotificaciones] = useState(mockNotificaciones);
  const [mostrarTodas, setMostrarTodas] = useState(false);

  const noLeidas = notificaciones.filter((n) => !n.leida).length;

  const marcarTodasLeidas = () => {
    setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
  };

  const marcarLeida = (id: string) => {
    setNotificaciones((prev) =>
      prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
    );
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
            <Button variant="ghost" size="sm" className="text-xs text-accent h-auto py-1" onClick={marcarTodasLeidas}>
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
                  onClick={() => marcarLeida(n.id)}
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
