import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Users, Plus, Edit, Trash2, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import BackButton from "@/components/BackButton";

interface Grupo {
  id: string;
  nombre: string;
  descripcion: string;
  miembros: number;
  estado: "activo" | "inactivo";
}

const mockGrupos: Grupo[] = [
  { id: "G001", nombre: "Estudiantes Electrónica", descripcion: "Estudiantes de la carrera de Ingeniería Electrónica", miembros: 45, estado: "activo" },
  { id: "G002", nombre: "Docentes Laboratorio", descripcion: "Profesores asignados a los laboratorios", miembros: 8, estado: "activo" },
  { id: "G003", nombre: "Supervisores", descripcion: "Personal supervisor de los laboratorios", miembros: 5, estado: "activo" },
  { id: "G004", nombre: "Estudiantes Informática", descripcion: "Estudiantes de Ingeniería en Informática", miembros: 60, estado: "activo" },
  { id: "G005", nombre: "Mantenimiento", descripcion: "Personal de mantenimiento de equipos", miembros: 3, estado: "inactivo" },
];

const GruposModule = ({ onBack }: { onBack: () => void }) => {
  const [grupos, setGrupos] = useState(mockGrupos);
  const [busqueda, setBusqueda] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editGrupo, setEditGrupo] = useState<Grupo | null>(null);
  const [form, setForm] = useState({ nombre: "", descripcion: "" });

  const filtered = grupos.filter((g) => g.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  const handleSave = () => {
    if (!form.nombre) { toast({ title: "Error", description: "Ingrese un nombre.", variant: "destructive" }); return; }
    if (editGrupo) {
      setGrupos((prev) => prev.map((g) => g.id === editGrupo.id ? { ...g, nombre: form.nombre, descripcion: form.descripcion } : g));
      toast({ title: "Grupo actualizado" });
    } else {
      setGrupos((prev) => [...prev, { id: `G${String(prev.length + 1).padStart(3, "0")}`, nombre: form.nombre, descripcion: form.descripcion, miembros: 0, estado: "activo" }]);
      toast({ title: "Grupo creado" });
    }
    setDialogOpen(false);
  };

  const handleDelete = (g: Grupo) => {
    setGrupos((prev) => prev.filter((x) => x.id !== g.id));
    toast({ title: "Grupo eliminado" });
  };

  return (
    <div className="space-y-6">
      <BackButton onClick={onBack} />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-accent" />
          <h2 className="text-xl font-bold text-foreground">Gestión de Grupos</h2>
        </div>
        <Button size="sm" onClick={() => { setEditGrupo(null); setForm({ nombre: "", descripcion: "" }); setDialogOpen(true); }}><Plus className="w-4 h-4 mr-1" /> Nuevo Grupo</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Buscar grupo..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="pl-10" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((g) => (
          <Card key={g.id} className="hover:border-accent transition-colors">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-foreground">{g.nombre}</h3>
                <Badge variant={g.estado === "activo" ? "default" : "secondary"}>{g.estado === "activo" ? "Activo" : "Inactivo"}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{g.descripcion}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground"><Users className="w-3.5 h-3.5 inline mr-1" />{g.miembros} miembros</span>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => { setEditGrupo(g); setForm({ nombre: g.nombre, descripcion: g.descripcion }); setDialogOpen(true); }}><Edit className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(g)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editGrupo ? "Editar Grupo" : "Nuevo Grupo"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Nombre</Label><Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} /></div>
            <div className="space-y-2"><Label>Descripción</Label><Textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} rows={3} /></div>
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

export default GruposModule;
