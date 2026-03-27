import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Clock, CheckCircle, XCircle, Loader2, AlertCircle, ShoppingCart, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRequestList, useCreateRequest } from "@/hooks/useLoan";
import { useInventoryList } from "@/hooks/useInventory";
import { useCategoryList } from "@/hooks/useCatalogues";
import { useAuth } from "@/contexts/AuthContext";
import { formatLoanDateYmd } from "@/lib/loanStatus";

const estadoConfig: Record<string, { icon: React.ReactNode; class: string; label: string }> = {
  pending: { icon: <Clock className="w-3.5 h-3.5" />, class: "bg-amber-500/20 text-amber-400 border-amber-500/30", label: "Pendiente" },
  approved: { icon: <CheckCircle className="w-3.5 h-3.5" />, class: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", label: "Aprobada" },
  rejected: { icon: <XCircle className="w-3.5 h-3.5" />, class: "bg-red-500/20 text-red-400 border-red-500/30", label: "Rechazada" },
};

interface CartItem {
  inv: any;
  qty: number;
}

function normalizeRequestStatus(value: unknown): "pending" | "approved" | "rejected" {
  const status = String(value ?? "").toLowerCase();
  if (status.includes("rechaz") || status === "rejected") return "rejected";
  if (status.includes("acept") || status === "approved") return "approved";
  return "pending";
}

function formatRequestDate(...values: Array<unknown>): string {
  for (const value of values) {
    const formatted = formatLoanDateYmd(value);
    if (formatted) return formatted;
  }
  return "—";
}

const SolicitudesModule = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [catFiltro, setCatFiltro] = useState("");
  const [motivo, setMotivo] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: reqData, isLoading: reqLoading, isError: reqIsError, error: reqError } = useRequestList(
    user?.userId ? { user_id: user.userId } : undefined
  );
  const { data: invData, isLoading: invLoading } = useInventoryList();
  const { data: catData, isLoading: catLoading } = useCategoryList();
  const createRequest = useCreateRequest();

  const solicitudes: any[] = Array.isArray(reqData?.data) ? reqData.data : [];
  const inventoryItems: any[] = Array.isArray(invData?.data) ? invData.data : [];
  const categories: any[] = Array.isArray(catData?.data) ? catData.data : [];

  const filteredInventory = useMemo(() => {
    return inventoryItems.filter((i) => {
      const matchBusqueda = (i.item_na || "").toLowerCase().includes(busqueda.toLowerCase());
      const matchCat = catFiltro ? String(i.category_id) === catFiltro : true;
      const hasStock = (i.inventory_qt ?? 0) > 0;
      return matchBusqueda && matchCat && hasStock;
    });
  }, [inventoryItems, busqueda, catFiltro]);

  const isComponente = (catId?: number) => {
    const cat = categories.find(c => c.category_id === catId);
    return cat ? cat.category_type_id === 1 : true; // 1: componente, 2: equipo (asumido)
  };

  const toggleCartItem = (inv: any, checked: boolean) => {
    if (checked) {
      setCart(prev => [...prev, { inv, qty: 1 }]);
    } else {
      setCart(prev => prev.filter(c => c.inv.inventory_id !== inv.inventory_id));
    }
  };

  const updateCartQty = (invId: number, newQty: number) => {
    setCart(prev => prev.map(c => c.inv.inventory_id === invId ? { ...c, qty: newQty } : c));
  };

  const handleSubmit = async () => {
    if (cart.length === 0) {
      toast({ title: "Carrito vacío", description: "Seleccione al menos un ítem.", variant: "destructive" });
      return;
    }
    if (!motivo.trim()) {
      toast({ title: "Falta Motivo", description: "Debe ingresar el motivo de la solicitud.", variant: "destructive" });
      return;
    }

    try {
      await createRequest.mutateAsync({
        user_id: user?.userId || 0, // Fallback, el back lo reemplaza por la sesión
        movement_ob: motivo,
        details: cart.map(c => ({
          inventory_id: c.inv.inventory_id,
          movement_detail_am: c.qty
        })),
      });

      // Reset
      setCart([]);
      setMotivo("");
      setBusqueda("");
      setCatFiltro("");
      setDialogOpen(false);
      toast({ title: "Solicitud enviada", description: "La solicitud ha sido registrada." });
    } catch (err: any) {
      toast({ title: "Error", description: err?.message ?? "Error al crear solicitud", variant: "destructive" });
    }
  };

  if (reqLoading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary mr-2" /><span className="text-muted-foreground">Cargando solicitudes...</span></div>;
  }

  if (reqIsError) {
    return <div className="flex items-center justify-center py-12 text-destructive"><AlertCircle className="w-5 h-5 mr-2" /><span>{(reqError as any)?.message ?? "Error"}</span></div>;
  }

  return (
    <div className="space-y-4">
      {/* HEADER PRINCIPAL */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Mis Solicitudes</h2>

        {/* MODAL GIGANTE DE NUEVA SOLICITUD */}
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          if(!open) setCart([]); // limpiar al cerrar
          setDialogOpen(open);
        }}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2"><Plus className="w-4 h-4" /> Nueva Solicitud</Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-6xl h-[85vh] max-h-[85vh] flex flex-col bg-card border-border p-0 overflow-hidden">
            <DialogHeader className="px-6 py-4 border-b border-border bg-muted/30">
              <DialogTitle className="flex items-center gap-2"><ShoppingCart className="w-5 h-5 text-primary" /> Crear Requisición de Inventario</DialogTitle>
            </DialogHeader>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-[280px_1fr_320px] overflow-hidden">
              
              {/* COL 1: FILTROS Y MOTIVO */}
              <div className="bg-muted/10 border-r border-border p-5 flex flex-col gap-6 overflow-y-auto">
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-foreground flex items-center gap-2"><Search className="w-4 h-4" /> Búsqueda</h3>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Nombre o Código</Label>
                    <Input placeholder="Buscar ítem..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Categoría</Label>
                    <select
                      value={catFiltro}
                      onChange={(e) => setCatFiltro(e.target.value)}
                      className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground"
                    >
                      <option value="">Todas las categorías</option>
                      {categories.map((c: any) => (
                        <option key={c.category_id} value={c.category_id}>{c.category_de}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2 mt-auto">
                  <Label className="text-xs text-muted-foreground">Motivo de Solicitud *</Label>
                  <Textarea 
                    placeholder="Describa para qué necesita estos ítems..." 
                    value={motivo} 
                    onChange={(e) => setMotivo(e.target.value)} 
                    rows={6}
                    className="resize-none"
                  />
                </div>
              </div>

              {/* COL 2: INVENTARIO DISPONIBLE */}
              <div className="flex flex-col bg-background overflow-hidden relative">
                {invLoading || catLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : null}
                
                <div className="p-3 border-b border-border bg-muted/20 flex justify-between items-center">
                  <span className="text-xs font-medium text-muted-foreground">Inventario Disponible ({filteredInventory.length})</span>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="grid gap-2">
                    {filteredInventory.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground text-sm">No hay ítems disponibles bajo estos filtros.</div>
                    ) : (
                      filteredInventory.map(item => {
                        const inCart = cart.find(c => c.inv.inventory_id === item.inventory_id);
                        const isComp = isComponente(item.category_id);
                        const stock = item.inventory_qt ?? 0;

                        return (
                          <div key={item.inventory_id} className={`flex items-center gap-4 p-3 rounded-lg border transition-colors ${inCart ? 'bg-primary/5 border-primary/30' : 'bg-card border-border hover:border-border/80'}`}>
                            <Checkbox 
                              checked={!!inCart} 
                              onCheckedChange={(c) => toggleCartItem(item, !!c)} 
                              id={`item-${item.inventory_id}`}
                            />
                            
                            <div className="flex-1 min-w-0">
                              <Label htmlFor={`item-${item.inventory_id}`} className="font-medium text-sm text-foreground cursor-pointer truncate block">
                                {item.item_na || `Inv #${item.inventory_id}`}
                              </Label>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className={`text-[10px] uppercase ${isComp ? 'text-emerald-500 border-emerald-500/30' : 'text-blue-500 border-blue-500/30'}`}>
                                  {isComp ? 'Componente' : 'Equipo'}
                                </Badge>
                                <span className="text-xs text-muted-foreground">Disp: {stock}</span>
                              </div>
                            </div>

                            {inCart && (
                              <div className="w-24 shrink-0">
                                {isComp ? (
                                  <Input 
                                    type="number" 
                                    min={1} 
                                    max={stock} 
                                    value={inCart.qty} 
                                    onChange={(e) => {
                                      let val = parseInt(e.target.value);
                                      if (isNaN(val) || val < 1) val = 1;
                                      if (val > stock) val = stock;
                                      updateCartQty(item.inventory_id, val);
                                    }}
                                    className="h-8 text-center text-sm"
                                  />
                                ) : (
                                  <Input type="number" value={1} disabled className="h-8 text-center bg-muted text-sm opacity-50" />
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* COL 3: CARRITO */}
              <div className="bg-muted/10 border-l border-border flex flex-col overflow-hidden">
                <div className="p-4 border-b border-border bg-card">
                  <h3 className="font-semibold text-sm text-foreground">Seleccionados ({cart.length})</h3>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {cart.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-xs">Aún no ha seleccionado ningún ítem.</div>
                  ) : (
                    cart.map((c) => (
                      <div key={c.inv.inventory_id} className="bg-card border border-border rounded-md p-3 relative group">
                        <p className="text-sm font-medium text-foreground pr-6 truncate">{c.inv.item_na}</p>
                        <p className="text-xs text-muted-foreground mt-1">Cant: <span className="font-bold text-primary">{c.qty}</span></p>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="absolute right-1 top-1 h-6 w-6 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => toggleCartItem(c.inv, false)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-4 border-t border-border bg-card">
                  <Button 
                    className="w-full" 
                    size="lg" 
                    onClick={handleSubmit} 
                    disabled={cart.length === 0 || createRequest.isPending}
                  >
                    {createRequest.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Procesando...</> : "Enviar Solicitud"}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* TABLA PRINCIPAL DE SOLICITUDES */}
      <Card className="overflow-hidden">
        <div className="max-h-[60vh] overflow-y-auto">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0 z-10 backdrop-blur-md">
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="w-24">ID</TableHead>
                <TableHead>Observación</TableHead>
                <TableHead className="w-48">Fecha</TableHead>
                <TableHead className="text-center w-32">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {solicitudes.map((sol: any) => {
                const status = normalizeRequestStatus(sol.movement_status ?? sol.movement_type_de);
                const cfg = estadoConfig[status] ?? estadoConfig.pending;
                return (
                  <TableRow key={sol.movement_id} className="border-border hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono text-xs text-accent">{sol.movement_id}</TableCell>
                    <TableCell className="font-medium text-sm">{sol.movement_ob ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{formatRequestDate(sol.movement_created_dt, sol.created_at, sol.movement_booking_dt)}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={`gap-1 w-full justify-center ${cfg.class}`}>
                        {cfg.icon}
                        {cfg.label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
              {solicitudes.length === 0 && (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-12">No tiene solicitudes registradas</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default SolicitudesModule;
