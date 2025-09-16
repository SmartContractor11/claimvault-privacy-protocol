import { DashboardHeader } from "@/components/DashboardHeader";
import { WalletConnection } from "@/components/WalletConnection";
import { ClaimsVault } from "@/components/ClaimsVault";
import { PrivacyManager } from "@/components/PrivacyManager";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-corporate">
      <DashboardHeader />
      
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <WalletConnection />
        <ClaimsVault />
        <PrivacyManager />
      </div>
    </div>
  );
};

export default Index;
