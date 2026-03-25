import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import URULogo from "@/components/URULogo";
import { FlaskConical, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [cedula, setCedula] = useState("");
  const [usuario, setUsuario] = useState("");
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [confirmarClave, setConfirmarClave] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (clave !== confirmarClave) {
      toast({ title: "Error", description: "Las claves no coinciden", variant: "destructive" });
      return;
    }

    if (clave.length < 8) {
      toast({ title: "Error", description: "La clave debe tener al menos 8 caracteres", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      await register({
        email: correo,
        password: clave,
        user_na: usuario || undefined,
        person_ci: cedula || undefined,
        person_na: nombre || undefined,
        person_ln: apellido || undefined,
      });
      toast({
        title: "Registro exitoso",
        description: "Revise su correo para verificar su cuenta.",
      });
      navigate("/login");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.alerts?.join(", ") || err.message);
      } else {
        setError("Error de conexión. Intente de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-5 bg-[url('/uru-blue-bg.png')] bg-cover bg-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-20 w-64 h-64 border border-foreground/20 rounded-full" />
        <div className="absolute bottom-20 left-20 w-96 h-96 border border-foreground/20 rounded-full" />
      </div>

      <div className="w-full max-w-md px-6 relative z-10">
        <div className="bg-card border border-border rounded-xl p-8 shadow-2xl">
          <div className="text-center mb-3">
            <div className="flex justify-center mb-3">
              <div className="bg-primary/20 p-3 rounded-full">
                <FlaskConical className="w-8 h-8 text-accent" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-1">Registro</h1>
            <p className="text-muted-foreground text-sm">Crear nueva cuenta</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-foreground">Nombre</Label>
                <Input value={nombre} onChange={(e) => setNombre(e.target.value)} required disabled={isLoading}
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground h-9 text-sm" placeholder="Nombre" />
              </div>
              <div className="space-y-1">
                <Label className="text-foreground">Apellido</Label>
                <Input value={apellido} onChange={(e) => setApellido(e.target.value)} required disabled={isLoading}
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground h-9 text-sm" placeholder="Apellido" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-foreground">Cédula</Label>
                <Input value={cedula} onChange={(e) => setCedula(e.target.value)}  disabled={isLoading}
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground h-9 text-sm" placeholder="V-12345678" />
              </div>
              <div className="space-y-1">
                <Label className="text-foreground">Usuario</Label>
                <Input value={usuario} onChange={(e) => setUsuario(e.target.value)} disabled={isLoading}
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground h-9 text-sm" placeholder="Usuario" />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-foreground">Correo electrónico</Label>
              <Input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required disabled={isLoading}
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground h-9 text-sm" placeholder="correo@ejemplo.com" />
            </div>

            <div className="space-y-1">
              <Label className="text-foreground">Clave (mínimo 8 caracteres)</Label>
              <Input type="password" value={clave} onChange={(e) => setClave(e.target.value)} required disabled={isLoading}
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground h-9 text-sm" placeholder="Mínimo 8 caracteres" />
            </div>

            <div className="space-y-1">
              <Label className="text-foreground">Confirmar clave</Label>
              <Input type="password" value={confirmarClave} onChange={(e) => setConfirmarClave(e.target.value)} required disabled={isLoading}
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground h-9 text-sm" placeholder="Repita su clave" />
              {clave && confirmarClave && clave !== confirmarClave && (
                <p className="text-destructive text-xs">Las claves no coinciden</p>
              )}
            </div>

            {error && <p className="text-destructive text-sm text-center">{error}</p>}

            <Button type="submit" className="w-full bg-primary hover:bg-accent text-primary-foreground font-semibold h-9 text-sm" disabled={isLoading}>
              {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Registrando...</> : "Registrarse"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-accent hover:text-accent/80 text-sm transition-colors">
              Ya tengo cuenta - Iniciar sesión
            </Link>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <URULogo size="sm" />
        </div>
      </div>
    </div>
  );
};

export default Register;