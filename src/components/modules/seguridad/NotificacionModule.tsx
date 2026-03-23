import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, Save, Mail, MessageSquare, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import BackButton from "@/components/BackButton";

interface PlantillaNotificacion {
  id: string;
  nombre: string;
  evento: string;
  canal: "email" | "sistema" | "ambos";
  activa: boolean;
}

const mockPlantillas: PlantillaNotificacion[] = [
  { id: "NT-001", nombre: "Préstamo Vencido", evento: "Cuando un préstamo supera la fecha límite", canal: "ambos", activa: true },
  { id: "NT-002", nombre: "Solicitud Aprobada", evento: "Al aprobar una solicitud de préstamo", canal: "sistema", activa: true },
  { id: "NT-003", nombre: "Solicitud Rechazada", evento: "Al rechazar una solicitud", canal: "email", activa: true },
  { id: "NT-004", nombre: "Recordatorio 24h", evento: "24 horas antes del vencimiento", canal: "ambos", activa: true },
  { id: "NT-005", nombre: "Componente Agotado", evento: "Stock del componente llega a 0", canal: "sistema", activa: false },
  { id: "NT-006", nombre: "Nuevo Usuario", evento: "Al registrar un nuevo usuario", canal: "email", activa: true },
  { id: "NT-007", nombre: "Mantenimiento Programado", evento: "Aviso de mantenimiento de equipos", canal: "ambos", activa: false },
];

const canalConfig: Record<string, { label: string; icon: React.ReactNode }> = {
  email: { label: "Email", icon: <Mail className="w-3 h-3" /> },
  sistema: { label: "Sistema", icon: <MessageSquare className="w-3 h-3" /> },
  ambos: { label: "Ambos", icon: <Bell className="w-3 h-3" /> },
};

const NotificacionModule = ({ onBack }: { onBack: () => void }) => {
  const [plantillas, setPlantillas] = useState(mockPlantillas);
  const [config, setConfig] = useState({ emailServer: "smtp.uru.edu", puerto: "587", remitente: "sistema@uru.edu", intervaloMinutos: "30" });

  const togglePlantilla = (id: string) => {
    setPlantillas((prev) => prev.map((p) => p.id === id ? { ...p, activa: !p.activa } : p));
  };

  const handleSave = () => {
    toast({ title: "Configuración guardada", description: "Las plantillas de notificación se actualizaron." });
  };

  return (
    <div className="space-y-6">
      <BackButton onClick={onBack} />
      <div className="flex items-center gap-3">
        <Bell className="w-6 h-6 text-accent" />
        <h2 className="text-xl font-bold text-foreground">Configuración de Notificaciones</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Plantillas Activas</p><p className="text-2xl font-bold text-emerald-500">{plantillas.filter(p => p.activa).length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Plantillas</p><p className="text-2xl font-bold text-foreground">{plantillas.length}</p></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><Clock className="w-6 h-6 text-accent" /><div><p className="text-sm text-muted-foreground">Intervalo</p><p className="text-lg font-bold text-foreground">{config.intervaloMinutos} min</p></div></CardContent></Card>
      </div>

      {/* Templates */}
      <div>
        <h3 className="text-base font-semibold text-foreground mb-3">Plantillas de Notificación</h3>
        <div className="space-y-2">
          {plantillas.map((p) => (
            <Card key={p.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground">{p.nombre}</span>
                    <Badge variant="outline" className="gap-1">{canalConfig[p.canal].icon}{canalConfig[p.canal].label}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{p.evento}</p>
                </div>
                <Switch checked={p.activa} onCheckedChange={() => togglePlantilla(p.id)} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Server config */}
      <Card>
        <CardContent className="p-5 space-y-4">
          <h3 className="text-base font-semibold text-foreground">Configuración del Servidor de Email</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Servidor SMTP</Label><Input value={config.emailServer} onChange={(e) => setConfig({ ...config, emailServer: e.target.value })} /></div>
            <div className="space-y-2"><Label>Puerto</Label><Input value={config.puerto} onChange={(e) => setConfig({ ...config, puerto: e.target.value })} /></div>
            <div className="space-y-2"><Label>Remitente</Label><Input value={config.remitente} onChange={(e) => setConfig({ ...config, remitente: e.target.value })} /></div>
            <div className="space-y-2"><Label>Intervalo de envío (min)</Label><Input value={config.intervaloMinutos} onChange={(e) => setConfig({ ...config, intervaloMinutos: e.target.value })} /></div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave}><Save className="w-4 h-4 mr-2" />Guardar Configuración</Button>
    </div>
  );
};

export default NotificacionModule;
