import { DashboardHeader } from "@/components/DashboardHeader";
import { WalletConnection } from "@/components/WalletConnection";
import { ClaimsVault } from "@/components/ClaimsVault";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-corporate">
      <DashboardHeader />
      
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <WalletConnection />
        <ClaimsVault />
      </div>
    </div>
  );
};

export default Index;
