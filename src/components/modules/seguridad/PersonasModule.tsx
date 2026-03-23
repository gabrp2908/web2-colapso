import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UserCircle, Search, Mail, Phone } from "lucide-react";
import BackButton from "@/components/BackButton";

interface Persona {
  id: string;
  cedula: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  tipo: "estudiante" | "docente" | "administrativo";
  facultad: string;
}

const mockPersonas: Persona[] = [
  { id: "P001", cedula: "12345678", nombre: "Carlos", apellido: "García", email: "cgarcia@uru.edu", telefono: "0414-1234567", tipo: "estudiante", facultad: "Ingeniería" },
  { id: "P002", cedula: "87654321", nombre: "María", apellido: "López", email: "mlopez@uru.edu", telefono: "0424-7654321", tipo: "docente", facultad: "Ingeniería" },
  { id: "P003", cedula: "23456789", nombre: "Ana", apellido: "Martínez", email: "amartinez@uru.edu", telefono: "0412-2345678", tipo: "estudiante", facultad: "Ciencias" },
  { id: "P004", cedula: "34567890", nombre: "Luis", apellido: "Rodríguez", email: "lrodriguez@uru.edu", telefono: "0416-3456789", tipo: "docente", facultad: "Ingeniería" },
  { id: "P005", cedula: "56789012", nombre: "Pedro", apellido: "Ramírez", email: "pramirez@uru.edu", telefono: "0426-5678901", tipo: "administrativo", facultad: "Rectorado" },
];

const tipoBadge: Record<string, string> = {
  estudiante: "bg-blue-600 hover:bg-blue-700",
  docente: "bg-emerald-600 hover:bg-emerald-700",
  administrativo: "bg-amber-500 hover:bg-amber-600 text-white",
};

const PersonasModule = ({ onBack }: { onBack: () => void }) => {
  const [busqueda, setBusqueda] = useState("");

  const filtered = mockPersonas.filter((p) =>
    `${p.nombre} ${p.apellido}`.toLowerCase().includes(busqueda.toLowerCase()) || p.cedula.includes(busqueda)
  );

  return (
    <div className="space-y-6">
      <BackButton onClick={onBack} />
      <div className="flex items-center gap-3">
        <UserCircle className="w-6 h-6 text-accent" />
        <h2 className="text-xl font-bold text-foreground">Registro de Personas</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {(["estudiante", "docente", "administrativo"] as const).map((tipo) => (
          <Card key={tipo}>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground capitalize">{tipo}s</p>
              <p className="text-2xl font-bold text-foreground">{mockPersonas.filter((p) => p.tipo === tipo).length}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Buscar por nombre o cédula..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="pl-10" />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cédula</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Facultad</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.cedula}</TableCell>
                  <TableCell className="font-medium">{p.nombre} {p.apellido}</TableCell>
                  <TableCell className="text-muted-foreground"><span className="flex items-center gap-1"><Mail className="w-3 h-3" />{p.email}</span></TableCell>
                  <TableCell className="text-muted-foreground"><span className="flex items-center gap-1"><Phone className="w-3 h-3" />{p.telefono}</span></TableCell>
                  <TableCell><Badge className={tipoBadge[p.tipo]}>{p.tipo.charAt(0).toUpperCase() + p.tipo.slice(1)}</Badge></TableCell>
                  <TableCell>{p.facultad}</TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No se encontraron personas</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonasModule;
