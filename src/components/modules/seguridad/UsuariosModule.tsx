import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Users, Search, Plus, Edit, Trash2, Loader2, AlertCircle, Shield, Link2, Unlink } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import BackButton from "@/components/BackButton";
import { 
  useUserList, useCreateUser, useUpdateUser, useDeleteUser,
  useProfileList, useAssignProfile, useRevokeProfile
} from "@/hooks/useSecurity";

const UsuariosModule = ({ onBack }: { onBack: () => void }) => {
  const [busqueda, setBusqueda] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [form, setForm] = useState({ user_em: "", user_pw: "", user_na: "" });

  const { data, isLoading, isError, error } = useUserList();
  const { data: profData } = useProfileList();
  const createMut = useCreateUser();
  const updateMut = useUpdateUser();
  const deleteMut = useDeleteUser();
  const assignMut = useAssignProfile();
  const revokeMut = useRevokeProfile();

  const usuarios: any[] = Array.isArray(data?.data) ? data.data : [];
  const profiles: any[] = Array.isArray(profData?.data) ? profData.data : [];

  const filtered = usuarios.filter((u: any) => {
    const email = u.user_em ?? "";
    const name = u.user_na ?? email;
    return name.toLowerCase().includes(busqueda.toLowerCase()) || email.toLowerCase().includes(busqueda.toLowerCase());
  });

  const openNew = () => { setEditUser(null); setForm({ user_em: "", user_pw: "", user_na: "" }); setDialogOpen(true); };
  const openEdit = (u: any) => { setEditUser(u); setForm({ user_em: u.user_em ?? "", user_pw: "", user_na: u.user_na ?? "" }); setDialogOpen(true); };

  const handleSave = async () => {
    try {
      if (editUser) {
        await updateMut.mutateAsync({ user_id: editUser.user_id, user_em: form.user_em, user_na: form.user_na });
        toast({ title: "Usuario actualizado" });
      } else {
        if (!form.user_em || !form.user_pw) { toast({ title: "Error", description: "Email y clave son requeridos", variant: "destructive" }); return; }
        await createMut.mutateAsync({ user_em: form.user_em, user_pw: form.user_pw, user_na: form.user_na });
        toast({ title: "Usuario creado" });
      }
      setDialogOpen(false);
    } catch (err: any) {
      toast({ title: "Error", description: err?.message ?? "Error al guardar", variant: "destructive" });
    }
  };

  const handleDelete = async (u: any) => {
    try { await deleteMut.mutateAsync(u.user_id); toast({ title: "Usuario eliminado" }); }
    catch (err: any) { toast({ title: "Error", description: err?.message ?? "Error al eliminar", variant: "destructive" }); }
  };

  const handleAssignProfile = async (profileId: number) => {
    if (!selectedUser) return;
    try {
      await assignMut.mutateAsync({ userId: selectedUser.user_id, profileId });
      toast({ title: "Perfil asignado" });
    } catch (err: any) { toast({ title: "Error", description: err?.message, variant: "destructive" }); }
  };

  const handleRevokeProfile = async (profileId: number) => {
    if (!selectedUser) return;
    try {
      await revokeMut.mutateAsync({ userId: selectedUser.user_id, profileId });
      toast({ title: "Perfil revocado" });
    } catch (err: any) { toast({ title: "Error", description: err?.message, variant: "destructive" }); }
  };

  if (isLoading) return <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary mr-2" /><span className="text-muted-foreground">Cargando usuarios...</span></div>;
  if (isError) return <div className="flex items-center justify-center py-12 text-destructive"><AlertCircle className="w-5 h-5 mr-2" /><span>{(error as any)?.message ?? "Error al cargar usuarios"}</span></div>;

  return (
    <div className="space-y-6">
      <BackButton onClick={onBack} />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-accent" />
          <h2 className="text-xl font-bold text-foreground">Gestión de Usuarios</h2>
        </div>
        <Button size="sm" onClick={openNew}><Plus className="w-4 h-4 mr-1" /> Nuevo Usuario</Button>
      </div>



      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Buscar usuario..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="pl-10" />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Perfiles</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u: any) => (
                <TableRow key={u.user_id}>
                  <TableCell className="font-mono text-xs">{u.user_id}</TableCell>
                  <TableCell className="font-medium">{u.user_na ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{u.user_em ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono">{u.profile_ids?.length || 0}</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button size="sm" variant="outline" onClick={() => { setSelectedUser(u); setAssignDialogOpen(true); }} title="Asignar perfiles"><Shield className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => openEdit(u)}><Edit className="w-4 h-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No se encontraron usuarios</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editUser ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Username</Label><Input value={form.user_na} onChange={(e) => setForm({ ...form, user_na: e.target.value })} /></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.user_em} onChange={(e) => setForm({ ...form, user_em: e.target.value })} /></div>
            {!editUser && <div className="space-y-2"><Label>Clave</Label><Input type="password" value={form.user_pw} onChange={(e) => setForm({ ...form, user_pw: e.target.value })} /></div>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={createMut.isPending || updateMut.isPending}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Perfiles de Usuario</DialogTitle>
            <DialogDescription>Asigna o revoca perfiles para <b>{selectedUser?.user_na ?? selectedUser?.user_em}</b>.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4 max-h-[60vh] overflow-y-auto">
            {profiles.map(p => {
              const isAssigned = (selectedUser?.profile_ids || []).includes(p.profile_id);
              return (
                <div key={p.profile_id} className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${isAssigned ? 'bg-primary/5 border-primary/30' : 'bg-card border-border'}`}>
                  <div>
                    <p className="text-sm font-medium">{p.profile_na}</p>
                    <p className="text-xs text-muted-foreground">{p.profile_de}</p>
                  </div>
                  <div>
                    {isAssigned ? (
                      <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => handleRevokeProfile(p.profile_id)} disabled={revokeMut.isPending}><Unlink className="w-3.5 h-3.5 mr-1" /> Revocar</Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => handleAssignProfile(p.profile_id)} disabled={assignMut.isPending}><Link2 className="w-3.5 h-3.5 mr-1" /> Asignar</Button>
                    )}
                  </div>
                </div>
              );
            })}
            {profiles.length === 0 && <div className="text-center py-8 text-muted-foreground text-sm">No hay perfiles registrados en el sistema.</div>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsuariosModule;
