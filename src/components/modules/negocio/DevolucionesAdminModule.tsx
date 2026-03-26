import BackButton from "@/components/BackButton";
import DevolucionesModule from "@/components/modules/DevolucionesModule";

interface Props {
  onBack: () => void;
}

const DevolucionesAdminModule = ({ onBack }: Props) => {
  return (
    <div className="space-y-6">
      <BackButton onClick={onBack} />
      <DevolucionesModule />
    </div>
  );
};

export default DevolucionesAdminModule;
