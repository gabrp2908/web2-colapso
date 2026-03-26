import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Search, Plus, Edit, Trash2, Loader2, AlertCircle, Link2, Unlink } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import BackButton from "@/components/BackButton";
import {
  useProfileList, useCreateProfile, useUpdateProfile, useDeleteProfile,
  useSubsystemList, useMenuList, useOptionList,
  useAssignSubsystem, useRevokeSubsystem, useAssignMenu, useRevokeMenu, useAssignOption, useRevokeOption
} from "@/hooks/useSecurity";

const PerfilModule = ({ onBack }: { onBack: () => void }) => {
  const [busqueda, setBusqueda] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [form, setForm] = useState({ profile_na: "", profile_de: "" });

  const { data, isLoading, isError, error, refetch } = useProfileList();
  const { data: subsData } = useSubsystemList();
  const { data: menuData } = useMenuList();
  const { data: optData } = useOptionList();
  const createMut = useCreateProfile();
  const updateMut = useUpdateProfile();
  const deleteMut = useDeleteProfile();

  const assignSubMut = useAssignSubsystem();
  const revokeSubMut = useRevokeSubsystem();
  const assignMenuMut = useAssignMenu();
  const revokeMenuMut = useRevokeMenu();
  const assignOptMut = useAssignOption();
  const revokeOptMut = useRevokeOption();

  const profiles: any[] = Array.isArray(data?.data) ? data.data : [];
  const subsystems: any[] = Array.isArray(subsData?.data) ? subsData.data : [];
  const menus: any[] = Array.isArray(menuData?.data) ? menuData.data : [];
  const options: any[] = Array.isArray(optData?.data) ? optData.data : [];

  const filtered = profiles.filter((p: any) => (p.profile_na ?? "").toLowerCase().includes(busqueda.toLowerCase()));

  const openNew = () => { setEditItem(null); setForm({ profile_na: "", profile_de: "" }); setDialogOpen(true); };
  const openEdit = (p: any) => { setEditItem(p); setForm({ profile_na: p.profile_na ?? "", profile_de: p.profile_de ?? "" }); setDialogOpen(true); };

  const handleSave = async () => {
    if (!form.profile_na.trim()) { toast({ title: "Error", description: "El nombre es requerido", variant: "destructive" }); return; }
    try {
      if (editItem) {
        await updateMut.mutateAsync({ profile_id: editItem.profile_id, ...form });
        toast({ title: "Perfil actualizado" });
      } else {
        await createMut.mutateAsync(form);
        toast({ title: "Perfil creado" });
      }
      setDialogOpen(false);
    } catch (err: any) {
      toast({ title: "Error", description: err?.message ?? "Error al guardar", variant: "destructive" });
    }
  };

  const handleDelete = async (p: any) => {
    try { await deleteMut.mutateAsync(p.profile_id); toast({ title: "Perfil eliminado" }); }
    catch (err: any) { toast({ title: "Error", description: err?.message, variant: "destructive" }); }
  };

  // ── Security assignments ────────────────────────
  const handleAssign = async (type: "subsystem" | "menu" | "option", id: number) => {
    if (!selectedProfile) return;
    try {
      if (type === "subsystem") await assignSubMut.mutateAsync({ profileId: selectedProfile.profile_id, subsystemId: id });
      else if (type === "menu") await assignMenuMut.mutateAsync({ profileId: selectedProfile.profile_id, menuId: id });
      else await assignOptMut.mutateAsync({ profileId: selectedProfile.profile_id, optionId: id });
      toast({ title: "Asignación exitosa" });
    } catch (err: any) { toast({ title: "Error", description: err?.message, variant: "destructive" }); }
  };

  const handleRevoke = async (type: "subsystem" | "menu" | "option", id: number) => {
    if (!selectedProfile) return;
    try {
      if (type === "subsystem") await revokeSubMut.mutateAsync({ profileId: selectedProfile.profile_id, subsystemId: id });
      else if (type === "menu") await revokeMenuMut.mutateAsync({ profileId: selectedProfile.profile_id, menuId: id });
      else await revokeOptMut.mutateAsync({ profileId: selectedProfile.profile_id, optionId: id });
      toast({ title: "Revocación exitosa" });
    } catch (err: any) { toast({ title: "Error", description: err?.message, variant: "destructive" }); }
  };

  if (isLoading) return <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary mr-2" /><span className="text-muted-foreground">Cargando perfiles...</span></div>;
  if (isError) return <div className="flex items-center justify-center py-12 text-destructive"><AlertCircle className="w-5 h-5 mr-2" /><span>{(error as any)?.message ?? "Error"}</span></div>;

  return (
    <div className="space-y-6">
      <BackButton onClick={onBack} />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-accent" />
          <h2 className="text-xl font-bold text-foreground">Gestión de Perfiles</h2>
        </div>
        <Button size="sm" onClick={openNew}><Plus className="w-4 h-4 mr-1" /> Nuevo Perfil</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Perfiles</p><p className="text-2xl font-bold text-foreground">{profiles.length}</p></CardContent></Card>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Buscar perfil..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="pl-10" />
      </div>

      <Card><CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p: any) => (
              <TableRow key={p.profile_id}>
                <TableCell className="font-mono text-xs">{p.profile_id}</TableCell>
                <TableCell className="font-medium">{p.profile_na}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{p.profile_de ?? "—"}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Button size="sm" variant="outline" onClick={() => { setSelectedProfile(p); setAssignDialogOpen(true); }} title="Asignaciones de seguridad"><Link2 className="w-4 h-4 mr-1" /> Permisos</Button>
                  <Button size="icon" variant="ghost" onClick={() => openEdit(p)}><Edit className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(p)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No hay perfiles</TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent></Card>

      {/* CRUD Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editItem ? "Editar Perfil" : "Nuevo Perfil"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Nombre</Label><Input value={form.profile_na} onChange={(e) => setForm({ ...form, profile_na: e.target.value })} /></div>
            <div className="space-y-2"><Label>Descripción</Label><Input value={form.profile_de} onChange={(e) => setForm({ ...form, profile_de: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={createMut.isPending || updateMut.isPending}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Security Assignments Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Asignaciones — {selectedProfile?.profile_na}</DialogTitle>
            <DialogDescription>Asigne o revoque subsistemas, menús y opciones a este perfil.</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="subsystems">
            <TabsList className="w-full">
              <TabsTrigger value="subsystems" className="flex-1">Subsistemas ({subsystems.length})</TabsTrigger>
              <TabsTrigger value="menus" className="flex-1">Menús ({menus.length})</TabsTrigger>
              <TabsTrigger value="options" className="flex-1">Opciones ({options.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="subsystems" className="space-y-2 mt-3">
              {subsystems.map((s: any) => {
                const isAssigned = (selectedProfile?.subsystem_ids || []).includes(s.subsystem_id);
                return (
                  <div key={s.subsystem_id} className={`flex items-center justify-between p-2 rounded-lg border transition-colors ${isAssigned ? 'bg-primary/5 border-primary/30' : 'bg-card border-border'}`}>
                    <span className="text-sm font-medium">{s.subsystem_na}</span>
                    <div className="flex gap-1">
                      {isAssigned ? (
                        <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => handleRevoke("subsystem", s.subsystem_id)} disabled={revokeSubMut.isPending}><Unlink className="w-3.5 h-3.5 mr-1" /> Revocar</Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => handleAssign("subsystem", s.subsystem_id)} disabled={assignSubMut.isPending}><Link2 className="w-3.5 h-3.5 mr-1" /> Asignar</Button>
                      )}
                    </div>
                  </div>
                );
              })}
              {subsystems.length === 0 && <p className="text-center text-muted-foreground py-4">No hay subsistemas</p>}
            </TabsContent>

            <TabsContent value="menus" className="space-y-2 mt-3">
              {menus.map((m: any) => {
                const isAssigned = (selectedProfile?.menu_ids || []).includes(m.menu_id);
                return (
                  <div key={m.menu_id} className={`flex items-center justify-between p-2 rounded-lg border transition-colors ${isAssigned ? 'bg-primary/5 border-primary/30' : 'bg-card border-border'}`}>
                    <span className="text-sm font-medium">{m.menu_na}</span>
                    <div className="flex gap-1">
                      {isAssigned ? (
                        <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => handleRevoke("menu", m.menu_id)} disabled={revokeMenuMut.isPending}><Unlink className="w-3.5 h-3.5 mr-1" /> Revocar</Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => handleAssign("menu", m.menu_id)} disabled={assignMenuMut.isPending}><Link2 className="w-3.5 h-3.5 mr-1" /> Asignar</Button>
                      )}
                    </div>
                  </div>
                );
              })}
              {menus.length === 0 && <p className="text-center text-muted-foreground py-4">No hay menús</p>}
            </TabsContent>

            <TabsContent value="options" className="space-y-2 mt-3">
              {options.map((o: any) => {
                const isAssigned = (selectedProfile?.option_ids || []).includes(o.option_id);
                return (
                  <div key={o.option_id} className={`flex items-center justify-between p-2 rounded-lg border transition-colors ${isAssigned ? 'bg-primary/5 border-primary/30' : 'bg-card border-border'}`}>
                    <span className="text-sm font-medium">{o.option_na}</span>
                    <div className="flex gap-1">
                      {isAssigned ? (
                        <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => handleRevoke("option", o.option_id)} disabled={revokeOptMut.isPending}><Unlink className="w-3.5 h-3.5 mr-1" /> Revocar</Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => handleAssign("option", o.option_id)} disabled={assignOptMut.isPending}><Link2 className="w-3.5 h-3.5 mr-1" /> Asignar</Button>
                      )}
                    </div>
                  </div>
                );
              })}
              {options.length === 0 && <p className="text-center text-muted-foreground py-4">No hay opciones</p>}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PerfilModule;
