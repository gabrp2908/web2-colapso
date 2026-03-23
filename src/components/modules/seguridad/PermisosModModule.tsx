import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Key, Save, Shield } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import BackButton from "@/components/BackButton";

const roles = ["usuario", "supervisor", "admin"];
const modulos = ["Solicitudes", "Préstamos", "Inventario", "Devoluciones", "Reportes", "Solvencia", "Ubicación", "Notificar", "Mantenimiento", "Auditoría"];
const acciones = ["Leer", "Crear", "Editar", "Eliminar"];

type PermisoMatrix = Record<string, Record<string, boolean>>;

const initialPermisos: Record<string, PermisoMatrix> = {
  usuario: Object.fromEntries(modulos.map((m) => [m, { Leer: ["Solicitudes", "Préstamos", "Solvencia"].includes(m), Crear: m === "Solicitudes", Editar: false, Eliminar: false }])),
  supervisor: Object.fromEntries(modulos.map((m) => [m, { Leer: !["Mantenimiento", "Auditoría"].includes(m), Crear: ["Inventario", "Devoluciones", "Notificar"].includes(m), Editar: ["Inventario", "Ubicación"].includes(m), Eliminar: false }])),
  admin: Object.fromEntries(modulos.map((m) => [m, { Leer: true, Crear: true, Editar: true, Eliminar: true }])),
};

const PermisosModModule = ({ onBack }: { onBack: () => void }) => {
  const [rolSeleccionado, setRolSeleccionado] = useState("usuario");
  const [permisos, setPermisos] = useState(initialPermisos);

  const matrix = permisos[rolSeleccionado];

  const togglePermiso = (modulo: string, accion: string) => {
    setPermisos((prev) => ({
      ...prev,
      [rolSeleccionado]: {
        ...prev[rolSeleccionado],
        [modulo]: {
          ...prev[rolSeleccionado][modulo],
          [accion]: !prev[rolSeleccionado][modulo][accion],
        },
      },
    }));
  };

  const handleSave = () => {
    toast({ title: "Permisos guardados", description: `Matriz de permisos para ${rolSeleccionado} actualizada.` });
  };

  const totalActivos = Object.values(matrix).reduce((sum, accMap) => sum + Object.values(accMap).filter(Boolean).length, 0);

  return (
    <div className="space-y-6">
      <BackButton onClick={onBack} />
      <div className="flex items-center gap-3">
        <Key className="w-6 h-6 text-accent" />
        <h2 className="text-xl font-bold text-foreground">Matriz de Permisos</h2>
      </div>

      <div className="flex items-center gap-4">
        <Select value={rolSeleccionado} onValueChange={setRolSeleccionado}>
          <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {roles.map((r) => (
              <SelectItem key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Badge variant="outline" className="gap-1"><Shield className="w-3 h-3" />{totalActivos} permisos activos</Badge>
      </div>

      <Card>
        <CardContent className="p-0 overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left p-3 text-muted-foreground font-medium">Módulo</th>
                {acciones.map((a) => (
                  <th key={a} className="text-center p-3 text-muted-foreground font-medium">{a}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modulos.map((modulo) => (
                <tr key={modulo} className="border-b border-border last:border-0 hover:bg-secondary/30">
                  <td className="p-3 font-medium text-foreground">{modulo}</td>
                  {acciones.map((accion) => (
                    <td key={accion} className="text-center p-3">
                      <Switch
                        checked={matrix[modulo]?.[accion] ?? false}
                        onCheckedChange={() => togglePermiso(modulo, accion)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Button onClick={handleSave}><Save className="w-4 h-4 mr-2" />Guardar Permisos</Button>
    </div>
  );
};

export default PermisosModModule;
