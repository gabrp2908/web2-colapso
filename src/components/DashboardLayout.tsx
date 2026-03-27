import { ReactNode, useState, useMemo, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import type { MenuStructure, SecuritySubsystem, SecurityMenu } from "@/lib/api/types";
import URULogo from "./URULogo";
import NotificationsPanel from "./NotificationsPanel";
import BackButton from "./BackButton";
import ThemeToggle from "./ThemeToggle";

// ── Module imports ──────────────────────────────────
import InventarioModule from "./modules/InventarioModule";
import SolicitudesModule from "./modules/SolicitudesModule";
import SolvenciaModule from "./modules/SolvenciaModule";
import ReportesModule from "./modules/ReportesModule";
import DevolucionesModule from "./modules/DevolucionesModule";
import PrestamosModule from "./modules/PrestamosModule";
import NotificarModule from "./modules/NotificarModule";
import MantenimientoModule from "./modules/MantenimientoModule";
import PrestamosAdminModule from "./modules/negocio/PrestamosAdminModule";
import DevolucionesAdminModule from "./modules/negocio/DevolucionesAdminModule";
import NotificacionesAdminModule from "./modules/negocio/NotificacionesAdminModule";
import ReportesAdminModule from "./modules/negocio/ReportesAdminModule";
import UsuariosModule from "./modules/seguridad/UsuariosModule";


import PerfilModule from "./modules/seguridad/PerfilModule";
import SubsistemaModule from "./modules/seguridad/SubsistemaModule";
import ObjetosModule from "./modules/seguridad/ObjetosModule";
import MetodosModule from "./modules/seguridad/MetodosModule";
import NotificacionModule from "./modules/seguridad/NotificacionModule";
import CalendarioModule from "./modules/seguridad/CalendarioModule";

import {
  User, LogOut, ChevronRight, Menu, X,
  FileText, HandCoins, ShieldCheck, PackageSearch, MapPin, BarChart3,
  Send, Settings, Building2, Users, UserCircle, Key, Blocks,
  Box, Waypoints, CalendarDays, Lock, Bell, Wrench, ClipboardList, Loader2, LayoutGrid
} from "lucide-react";
import { Button } from "./ui/button";
import { useRequestList } from "@/hooks/useLoan";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "./ui/select";

// ── Mapeo módulo → componente (key normalizado) ─────

type ModuleRenderer = (onBack: () => void) => ReactNode;

const moduleRegistry: Record<string, ModuleRenderer> = {
  solicitudes: (b) => <><BackButton onClick={b} /><SolicitudesModule /></>,
  prestamos: (b) => <><BackButton onClick={b} /><PrestamosModule /></>,
  solvencia: (b) => <><BackButton onClick={b} /><SolvenciaModule /></>,
  devoluciones: (b) => <><BackButton onClick={b} /><DevolucionesModule /></>,
  inventario: (b) => <><BackButton onClick={b} /><InventarioModule /></>,
  reportes: (b) => <><BackButton onClick={b} /><ReportesModule /></>,
  notificar: (b) => <><BackButton onClick={b} /><NotificarModule /></>,
  permisos: (b) => <PerfilModule onBack={b} />,
  mantenimiento: (b) => <><BackButton onClick={b} /><MantenimientoModule /></>,
  prestamos_admin: (b) => <PrestamosAdminModule onBack={b} />,
  devoluciones_admin: (b) => <DevolucionesAdminModule onBack={b} />,
  notificaciones_admin: (b) => <NotificacionesAdminModule onBack={b} />,
  reportes_admin: (b) => <ReportesAdminModule onBack={b} />,
  usuarios: (b) => <UsuariosModule onBack={b} />,


  perfil: (b) => <PerfilModule onBack={b} />,
  perfiles: (b) => <PerfilModule onBack={b} />,
  subsistema: (b) => <SubsistemaModule onBack={b} />,
  subsistemas: (b) => <SubsistemaModule onBack={b} />,
  objetos: (b) => <ObjetosModule onBack={b} />,
  metodos: (b) => <MetodosModule onBack={b} />,
  notificacion: (b) => <NotificacionModule onBack={b} />,
  calendario: (b) => <CalendarioModule onBack={b} />,
};

function formatNavigationLabel(name: string): string {
  const lower = name.toLowerCase().trim();

  if (lower === "perfil") return "Perfiles";
  if (lower === "perfiles") return "Perfiles";
  if (lower === "subsistema") return "Subsistemas";
  if (lower === "subsistemas") return "Subsistemas";

  return name;
}

/** Mapeo de nombre de opción/menú a key del registry */
function resolveModuleKey(name: string): string {
  const lower = name.toLowerCase().trim();
  const aliasMap: Record<string, string> = {
    "inventario": "inventario",
    "inventory": "inventario",
    "solicitudes": "solicitudes",
    "requests": "solicitudes",
    "préstamos": "prestamos",
    "prestamos": "prestamos",
    "loans": "prestamos",
    "solvencia": "solvencia",
    "devoluciones": "devoluciones",
    "devolutions": "devoluciones",
    "ubicación": "ubicacion",
    "ubicacion": "ubicacion",
    "location": "ubicacion",
    "reportes": "reportes",
    "reports": "reportes",
    "notificar": "notificar",
    "notify": "notificar",
    "permisos": "permisos",
    "permissions": "permisos",
    "mantenimiento": "mantenimiento",
    "maintenance": "mantenimiento",
    "usuarios": "usuarios",
    "users": "usuarios",
    "personas": "personas",
    "persons": "personas",
    "grupos": "grupos",
    "groups": "grupos",
    "perfil": "perfil",
    "perfiles": "perfil",
    "profile": "perfil",
    "profiles": "perfil",
    "subsistema": "subsistema",
    "subsistemas": "subsistema",
    "subsystem": "subsistema",
    "subsystems": "subsistema",
    "objetos": "objetos",
    "objects": "objetos",
    "métodos": "metodos",
    "metodos": "metodos",
    "methods": "metodos",
    "calendario": "calendario",
    "calendar": "calendario",
    "calendario académico": "calendario",
    "notificación": "notificacion",
    "notificacion": "notificacion",
    "notification": "notificacion",
  };
  return aliasMap[lower] ?? lower.replace(/\s+/g, "_");
}

function resolveRoleAwareModuleKey(key: string, canReviewAllRequests: boolean): string {
  if (canReviewAllRequests && (key === "solicitudes" || key === "prestamos")) return "prestamos_admin";
  return key;
}

function resolveRoleAwareLabel(label: string, key: string): string {
  if (key === "prestamos_admin") return "Gestion Solicitudes";
  return formatNavigationLabel(label);
}

/** Mapeo de nombre a icono */
const iconMap: Record<string, ReactNode> = {
  solicitudes: <FileText className="w-5 h-5" />,
  prestamos: <HandCoins className="w-5 h-5" />,
  solvencia: <ShieldCheck className="w-5 h-5" />,
  devoluciones: <PackageSearch className="w-5 h-5" />,
  inventario: <Blocks className="w-5 h-5" />,
  ubicacion: <MapPin className="w-5 h-5" />,
  reportes: <BarChart3 className="w-5 h-5" />,
  notificar: <Send className="w-5 h-5" />,
  permisos: <Key className="w-5 h-5" />,
  mantenimiento: <Wrench className="w-5 h-5" />,
  usuarios: <Users className="w-5 h-5" />,
  personas: <UserCircle className="w-5 h-5" />,
  grupos: <Users className="w-5 h-5" />,
  perfil: <User className="w-5 h-5" />,
  perfiles: <User className="w-5 h-5" />,
  subsistema: <Settings className="w-5 h-5" />,
  subsistemas: <Settings className="w-5 h-5" />,
  objetos: <Box className="w-5 h-5" />,
  metodos: <Waypoints className="w-5 h-5" />,
  permisos_mod: <Key className="w-5 h-5" />,
  notificacion: <Bell className="w-5 h-5" />,
  calendario: <CalendarDays className="w-5 h-5" />,
  prestamos_admin: <HandCoins className="w-5 h-5" />,
  devoluciones_admin: <PackageSearch className="w-5 h-5" />,
  notificaciones_admin: <Bell className="w-5 h-5" />,
  reportes_admin: <BarChart3 className="w-5 h-5" />,
};

const subsystemIconMap: Record<string, ReactNode> = {
  seguridad: <Lock className="w-5 h-5" />,
  security: <Lock className="w-5 h-5" />,
  negocio: <Building2 className="w-5 h-5" />,
  business: <Building2 className="w-5 h-5" />,
};

function getIcon(key: string): ReactNode {
  return iconMap[key] ?? subsystemIconMap[key.toLowerCase()] ?? <LayoutGrid className="w-5 h-5" />;
}

function getSubsystemIcon(name: string): ReactNode {
  const key = name.toLowerCase().trim();
  return subsystemIconMap[key] ?? <LayoutGrid className="w-5 h-5" />;
}

// ── Fallback (cuando el backend no tiene navegación configurada) ─────

interface FallbackItem { label: string; key: string; }

const fallbackItems: FallbackItem[] = [
  { label: "Solicitudes", key: "solicitudes" },
  { label: "Préstamos", key: "prestamos" },
  { label: "Solvencia", key: "solvencia" },
  { label: "Devoluciones", key: "devoluciones" },
  { label: "Inventario", key: "inventario" },

  { label: "Reportes", key: "reportes" },
  { label: "Notificar", key: "notificar" },
  { label: "Permisos", key: "permisos" },
];

// ── Tipo de vista ───────────────────────────────────

type ViewState =
  | { type: "home" }
  | { type: "subsystem"; subsystemId: number }
  | { type: "module"; moduleKey: string; parentSubsystemId?: number };

// ── DashboardLayout ─────────────────────────────────

const DashboardLayout = ({ children }: { children?: ReactNode }) => {
  const { user, navigation, loading, logout, switchProfile } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState<ViewState>({ type: "home" });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSwitchingProfile, setIsSwitchingProfile] = useState(false);

  const availableProfiles = useMemo(() => {
    return user?.profiles || [];
  }, [user]);

  const activeProfileName = useMemo(() => {
    if (!user?.activeProfileId) return "";
    const active = availableProfiles.find((p) => p.id === user.activeProfileId);
    return (active?.profile_na ?? "").toLowerCase();
  }, [availableProfiles, user?.activeProfileId]);

  const canReviewAllRequests =
    activeProfileName === "supervisor" ||
    activeProfileName === "super_admin" ||
    activeProfileName === "security_admin";

  const { data: requestsResponse } = useRequestList(
    canReviewAllRequests ? undefined : user?.userId ? { user_id: user.userId } : undefined
  );

  const pendingRequestsCount = useMemo(() => {
    if (!canReviewAllRequests) return 0;
    const rows = Array.isArray(requestsResponse?.data) ? requestsResponse.data : [];
    return rows.filter((row) => {
      const status = String(row.movement_status ?? row.movement_type_de ?? "").toLowerCase();
      return status === "pending" || status === "requested" || status.includes("solicit");
    }).length;
  }, [canReviewAllRequests, requestsResponse]);

  const hasDynamicNav = navigation.length > 0;

  const selectedProfileValue = useMemo(() => {
    if (!user?.activeProfileId) return undefined;
    const active = String(user.activeProfileId);
    return availableProfiles.some((p) => String(p.id) === active) ? active : undefined;
  }, [availableProfiles, user?.activeProfileId]);

  /** Sidebar items derivados de la navegación dinámica o fallback */
  const sidebarItems = useMemo(() => {
    if (!hasDynamicNav) {
      const seen = new Set<string>();
      const items: { label: string; key: string; icon: ReactNode; subsystemId?: number }[] = [];
      for (const f of fallbackItems) {
        const mappedKey = resolveRoleAwareModuleKey(f.key, canReviewAllRequests);
        if (seen.has(mappedKey)) continue;
        seen.add(mappedKey);
        items.push({
          label: resolveRoleAwareLabel(f.label, mappedKey),
          key: mappedKey,
          icon: getIcon(mappedKey),
        });
      }
      return items;
    }

    if (navigation.length === 1) {
      const onlySubsystem = navigation[0];
      const flatItems: { label: string; key: string; icon: ReactNode; subsystemId?: number }[] = [];
      const seen = new Set<string>();

      for (const menu of onlySubsystem.menus ?? []) {
        const hasOptions = (menu.options?.length ?? 0) > 0;
        if (hasOptions) {
          for (const option of menu.options ?? []) {
            const key = resolveRoleAwareModuleKey(
              resolveModuleKey(option.option_na),
              canReviewAllRequests
            );
            if (seen.has(key)) continue;
            seen.add(key);
            flatItems.push({
              label: resolveRoleAwareLabel(option.option_na, key),
              key,
              icon: getIcon(key),
            });
          }
          continue;
        }

        const key = resolveRoleAwareModuleKey(resolveModuleKey(menu.menu_na), canReviewAllRequests);
        if (seen.has(key)) continue;
        seen.add(key);
        flatItems.push({
          label: resolveRoleAwareLabel(menu.menu_na, key),
          key,
          icon: getIcon(key),
        });
      }

      if (flatItems.length > 0) return flatItems;
    }

    // Subsistemas con un solo menú y pocas opciones → mostrar menús directamente
    // Subsistemas con múltiples menús → mostrar como grupo expandible
    const items: { label: string; key: string; icon: ReactNode; subsystemId?: number }[] = [];
    const seen = new Set<string>();

    for (const sub of navigation) {
      const menus = sub.menus ?? [];
      if (menus.length === 0) continue;

      if (menus.length === 1 && (menus[0].options?.length ?? 0) <= 1) {
        // Subsistema con 1 menú y 0-1 opciones → render plano
        const key = resolveRoleAwareModuleKey(resolveModuleKey(menus[0].menu_na), canReviewAllRequests);
        if (seen.has(key)) continue;
        seen.add(key);
        items.push({
          label: resolveRoleAwareLabel(menus[0].menu_na, key),
          key,
          icon: getIcon(key),
        });
      } else {
        // Subsistema con múltiples menús → render como grupo
        items.push({
          label: sub.subsystem_na,
          key: `subsystem_${sub.subsystem_id}`,
          icon: getSubsystemIcon(sub.subsystem_na),
          subsystemId: sub.subsystem_id,
        });
      }
    }

    return items;
  }, [navigation, hasDynamicNav, canReviewAllRequests]);

  useEffect(() => {
    if (!canReviewAllRequests) return;
    if (view.type === "module" && view.moduleKey === "solicitudes") {
      setView({ type: "module", moduleKey: "prestamos_admin" });
    }
  }, [canReviewAllRequests, view]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { replace: true });
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const displayName = user.username || user.email || `User #${user.userId}`;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try { await logout(); navigate("/login"); } catch { navigate("/login"); } finally { setIsLoggingOut(false); }
  };

  const handleProfileChange = async (val: string) => {
    const profileId = Number(val);
    if (!Number.isInteger(profileId) || profileId <= 0 || isSwitchingProfile) return;
    setIsSwitchingProfile(true);
    try {
      await switchProfile(profileId);
    } finally {
      setIsSwitchingProfile(false);
    }
  };

  const handleSidebarClick = (item: { key: string; subsystemId?: number }) => {
    if (item.subsystemId != null) {
      setView({ type: "subsystem", subsystemId: item.subsystemId });
    } else {
      setView({ type: "module", moduleKey: item.key });
    }
  };

  const goHome = () => setView({ type: "home" });

  const activeKey = view.type === "module" ? view.moduleKey : view.type === "subsystem" ? `subsystem_${view.subsystemId}` : "";

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      {/* Header */}
      <header className="bg-[rgb(27,67,152)] text-white dark:bg-card dark:text-foreground border-b border-border px-4 py-3 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white dark:text-foreground hover:bg-white/10 dark:hover:bg-secondary">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <URULogo size="sm" />
        </div>
        <div className="flex items-center gap-2">
          {canReviewAllRequests && (
            <button
              type="button"
              onClick={() => setView({ type: "module", moduleKey: "prestamos_admin" })}
              className="hidden sm:flex items-center gap-2 rounded-full border border-white/30 dark:border-border bg-white/10 dark:bg-secondary/40 px-3 py-1 hover:bg-white/20 dark:hover:bg-secondary/60 transition-colors"
              title="Ir a gestion de solicitudes"
            >
              <ClipboardList className="w-4 h-4" />
              <span className="text-xs font-semibold">Pendientes: {pendingRequestsCount}</span>
            </button>
          )}
          <ThemeToggle />
          <NotificationsPanel />
          <Button variant="ghost" size="icon" onClick={handleLogout} disabled={isLoggingOut} title="Cerrar sesión" className="text-white dark:text-foreground hover:bg-white/10 dark:hover:bg-secondary text-destructive hover:text-destructive">
            {isLoggingOut ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`relative bg-card border-r border-border transition-all duration-300 shrink-0 ${sidebarOpen ? "w-56" : "w-0 overflow-hidden"}`}>
          <nav className="p-3 space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleSidebarClick(item)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeKey === item.key ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
              </button>
            ))}
          </nav>
          
          {user && availableProfiles.length > 0 && (
            <div className={`p-4 mt-auto border-t border-border bg-card absolute bottom-0 w-full transition-opacity duration-300 ${sidebarOpen ? "opacity-100 h-auto" : "opacity-0 h-0 overflow-hidden pointer-events-none p-0 border-0"}`}>
              <p className="text-xs font-semibold text-muted-foreground mb-2 text-center">Perfil Activo</p>
              <Select 
                value={selectedProfileValue}
                onValueChange={handleProfileChange}
                disabled={isSwitchingProfile}
              >
                <SelectTrigger className="w-full text-xs h-8 border-accent/30 bg-secondary/50">
                  <SelectValue placeholder={isSwitchingProfile ? "Cambiando perfil..." : "Seleccionar Perfil..."} />
                </SelectTrigger>
                <SelectContent>
                  {availableProfiles.map(p => (
                    <SelectItem key={p.id} value={p.id.toString()} className="text-xs">{p.profile_na}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">
          {children || <MainContent view={view} navigation={navigation} hasDynamicNav={hasDynamicNav} sidebarItems={sidebarItems} onNavigate={setView} goHome={goHome} canReviewAllRequests={canReviewAllRequests} />}
        </main>
      </div>
    </div>
  );
};

// ── Main Content Renderer ──────────────────────────

interface MainContentProps {
  view: ViewState;
  navigation: MenuStructure;
  hasDynamicNav: boolean;
  sidebarItems: { label: string; key: string; icon: ReactNode; subsystemId?: number }[];
  onNavigate: (v: ViewState) => void;
  goHome: () => void;
  canReviewAllRequests: boolean;
}

const MainContent = ({ view, navigation, hasDynamicNav, sidebarItems, onNavigate, goHome, canReviewAllRequests }: MainContentProps) => {
  // Renderizar módulo específico
  if (view.type === "module") {
    const renderer = moduleRegistry[view.moduleKey];
    const backTarget = view.parentSubsystemId != null
      ? () => onNavigate({ type: "subsystem", subsystemId: view.parentSubsystemId! })
      : goHome;

    if (renderer) return <>{renderer(backTarget)}</>;

    return (
      <div className="text-center py-12">
        <BackButton onClick={backTarget} />
        <p className="text-muted-foreground mt-4">Módulo &quot;{view.moduleKey}&quot; no implementado aún.</p>
      </div>
    );
  }

  // Renderizar subsistema (grid de menús/opciones)
  if (view.type === "subsystem") {
    const sub = navigation.find((s) => s.subsystem_id === view.subsystemId);
    if (!sub) return <p className="text-muted-foreground">Subsistema no encontrado.</p>;

    const allItems = (sub.menus ?? []).flatMap((menu) => {
      // Si el menú tiene opciones, mostrar las opciones
      if (menu.options && menu.options.length > 0) {
        return menu.options.map((opt) => ({
          label: resolveRoleAwareLabel(opt.option_na, resolveRoleAwareModuleKey(resolveModuleKey(opt.option_na), canReviewAllRequests)),
          key: resolveRoleAwareModuleKey(resolveModuleKey(opt.option_na), canReviewAllRequests),
        }));
      }
      // Si no tiene opciones, mostrar el menú como item
      const key = resolveRoleAwareModuleKey(resolveModuleKey(menu.menu_na), canReviewAllRequests);
      return [{ label: resolveRoleAwareLabel(menu.menu_na, key), key }];
    });

    const seen = new Set<string>();
    const dedupedItems = allItems.filter((item) => {
      if (seen.has(item.key)) return false;
      seen.add(item.key);
      return true;
    });

    return (
      <div>
        <BackButton onClick={goHome} />
        <h2 className="text-xl font-bold text-foreground mb-6">{sub.subsystem_na}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {dedupedItems.map((item) => (
            <button
              key={item.key}
              onClick={() => onNavigate({ type: "module", moduleKey: item.key, parentSubsystemId: view.subsystemId })}
              className="bg-card hover:bg-secondary border border-border rounded-xl p-5 flex flex-col items-center gap-3 transition-all hover:scale-105 hover:border-accent group"
            >
              <div className="text-accent group-hover:text-lab-blue-glow transition-colors [&>svg]:w-8 [&>svg]:h-8">
                {getIcon(item.key)}
              </div>
              <span className="text-sm font-medium text-foreground text-center">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Home: grid de todos los items del sidebar
  return (
    <div>
      <h2 className="text-xl font-bold text-foreground mb-2">Bienvenido al Sistema</h2>
      <p className="text-sm text-muted-foreground mb-6">
        {hasDynamicNav ? "Navegación cargada desde el servidor" : "Seleccione un módulo para comenzar"}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {sidebarItems.map((item) => (
          <button
            key={item.key}
            onClick={() => {
              if (item.subsystemId != null) {
                onNavigate({ type: "subsystem", subsystemId: item.subsystemId });
              } else {
                onNavigate({ type: "module", moduleKey: item.key });
              }
            }}
            className="bg-card hover:bg-secondary border border-border rounded-xl p-5 flex flex-col items-center gap-3 transition-all hover:scale-105 hover:border-accent group"
          >
            <div className="text-accent group-hover:text-lab-blue-glow transition-colors [&>svg]:w-8 [&>svg]:h-8">
              {item.icon}
            </div>
            <span className="text-sm font-medium text-foreground text-center">{formatNavigationLabel(item.label)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DashboardLayout;
