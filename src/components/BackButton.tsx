import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const BackButton = ({ onClick, label = "Regresar" }: { onClick: () => void; label?: string }) => (
  <Button variant="ghost" size="sm" onClick={onClick} className="gap-2 text-muted-foreground hover:text-foreground mb-4">
    <ArrowLeft className="w-4 h-4" />
    {label}
  </Button>
);

export default BackButton;
