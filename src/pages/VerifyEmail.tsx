import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { verifyEmail, requestEmailVerification } from "@/lib/api/services/auth";
import { ApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import URULogo from "@/components/URULogo";
import { MailCheck, Loader2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [email] = useState(location.state?.email || "");
  const [inputEmail, setInputEmail] = useState(email);
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length < 6) {
      setError("Introduzca un código válido de 6 caracteres.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await verifyEmail(code);
      toast({
        title: "Correo verificado",
        description: "Tu cuenta ha sido activada exitosamente. Inicia sesión.",
      });
      navigate("/login");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.alerts?.join(", ") || err.message);
      } else {
        setError("Error validando el código.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!inputEmail) {
      setError("Por favor introduzca su correo para solicitar el reenvío.");
      return;
    }

    setError("");
    setIsResending(true);

    try {
      await requestEmailVerification(inputEmail);
      toast({
        title: "Código enviado",
        description: `Se ha enviado un nuevo código a ${inputEmail}`,
      });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.alerts?.join(", ") || err.message);
      } else {
        setError("Error solicitando el reenvío.");
      }
    } finally {
      setIsResending(false);
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
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/20 p-4 rounded-full">
                <MailCheck className="w-8 h-8 text-accent" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Verifica tu correo</h1>
            <p className="text-muted-foreground text-sm">
              Ingresa el código de 6 dígitos que enviamos a tu dirección de correo electrónico
              {email ? ` (${email})` : ""}.
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            {!email && (
              <div className="space-y-1.5 hidden">
                {/* Se esconde a menos que necesite pedirlo explícitamente para el reenvío, pero como el backend actual envía el OTP, podemos pedirlo abajo solo si no lo tiene. */}
              </div>
            )}
            
            <div className="space-y-1.5">
              <Label className="text-foreground">Código de autenticación</Label>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                required
                disabled={isLoading}
                autoComplete="off"
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground text-center tracking-widest text-lg font-mono uppercase font-bold uppercase transition-all"
                placeholder="XXXXXX"
                maxLength={6}
              />
            </div>

            {error && <p className="text-destructive text-sm text-center">{error}</p>}

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-accent text-primary-foreground font-semibold py-2"
              disabled={isLoading || code.length < 5}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verificando...
                </>
              ) : (
                "Verificar cuenta"
              )}
            </Button>
          </form>

          <div className="mt-6 border-t border-border pt-5">
            <div className="space-y-3">
              <p className="text-center text-xs text-muted-foreground">¿No recibiste el correo o saliste sin validar?</p>
              {!email && (
                <Input
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  disabled={isResending}
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground h-9 text-sm"
                  placeholder="Escribe tu correo electrónico aquí"
                  type="email"
                />
              )}
              <Button
                type="button"
                variant="outline"
                className="w-full border-border bg-card hover:bg-secondary text-foreground flex items-center gap-2"
                onClick={handleResend}
                disabled={isResending || !inputEmail}
              >
                {isResending ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Enviando nuevo código...</>
                ) : (
                  <><Send className="w-4 h-4" /> Enviar código de nuevo</>
                )}
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-accent hover:text-accent/80 text-sm transition-colors font-medium">
              Volver al inicio de sesión
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

export default VerifyEmail;
