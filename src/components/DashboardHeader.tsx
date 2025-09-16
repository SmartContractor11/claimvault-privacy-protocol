import { Lock, Users, FileText } from "lucide-react";
import claimsHeroBg from "@/assets/claims-hero-bg.jpg";
import claimsLogo from "@/assets/claims-logo.svg";

export function DashboardHeader() {
  return (
    <div className="relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${claimsHeroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-trust" />
      
      <div className="relative px-6 py-12 md:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-2xl">
              <img src={claimsLogo} alt="Claims Vault Logo" className="h-12 w-12" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-vault mb-6 leading-tight">
            Claims Processing with{" "}
            <span className="bg-gradient-secure bg-clip-text text-transparent">
              Guaranteed Privacy
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-foreground/80 mb-8 max-w-3xl mx-auto leading-relaxed">
            Submit confidential insurance claims with complete privacy protection. 
            Your sensitive data remains encrypted until smart contract evaluation is complete, 
            ensuring unbiased processing.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 p-4 bg-card/80 backdrop-blur-sm rounded-lg border border-border/50">
              <Lock className="h-6 w-6 text-encrypted flex-shrink-0" />
              <div className="text-left">
                <div className="font-semibold text-sm">End-to-End Encryption</div>
                <div className="text-xs text-muted-foreground">Zero-knowledge privacy</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-card/80 backdrop-blur-sm rounded-lg border border-border/50">
              <FileText className="h-6 w-6 text-primary flex-shrink-0" />
              <div className="text-left">
                <div className="font-semibold text-sm">Smart Contract Security</div>
                <div className="text-xs text-muted-foreground">Automated evaluation</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-card/80 backdrop-blur-sm rounded-lg border border-border/50">
              <Users className="h-6 w-6 text-success flex-shrink-0" />
              <div className="text-left">
                <div className="font-semibold text-sm">Bias Prevention</div>
                <div className="text-xs text-muted-foreground">Fair processing guaranteed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}