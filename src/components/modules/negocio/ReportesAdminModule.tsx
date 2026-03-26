import BackButton from "@/components/BackButton";
import ReportesModule from "@/components/modules/ReportesModule";

interface Props {
  onBack: () => void;
}

const ReportesAdminModule = ({ onBack }: Props) => {
  return (
    <div className="space-y-6">
      <BackButton onClick={onBack} />
      <ReportesModule />
    </div>
  );
};

export default ReportesAdminModule;
