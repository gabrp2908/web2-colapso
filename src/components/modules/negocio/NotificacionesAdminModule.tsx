import BackButton from "@/components/BackButton";
import NotificarModule from "@/components/modules/NotificarModule";

interface Props {
  onBack: () => void;
}

const NotificacionesAdminModule = ({ onBack }: Props) => {
  return (
    <div className="space-y-6">
      <BackButton onClick={onBack} />
      <NotificarModule />
    </div>
  );
};

export default NotificacionesAdminModule;
