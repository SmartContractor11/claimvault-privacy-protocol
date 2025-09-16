import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Vault, Upload, Lock, ShieldCheck, Eye, EyeOff } from "lucide-react";
import vaultIcon from "@/assets/vault-icon.svg";

export function ClaimsVault() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [claims, setClaims] = useState([
    {
      id: "CLM-001",
      type: "Auto Accident",
      status: "encrypted",
      submittedAt: "2024-03-15",
      amount: "$12,500"
    },
    {
      id: "CLM-002", 
      type: "Property Damage",
      status: "evaluating",
      submittedAt: "2024-03-10",
      amount: "$8,200"
    }
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate claim submission with encryption
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const newClaim = {
      id: `CLM-${String(claims.length + 1).padStart(3, '0')}`,
      type: "New Claim",
      status: "encrypted",
      submittedAt: new Date().toISOString().split('T')[0],
      amount: "Pending"
    };
    
    setClaims([newClaim, ...claims]);
    setIsSubmitting(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'encrypted': return 'text-encrypted bg-encrypted/10 border-encrypted/20';
      case 'evaluating': return 'text-warning bg-warning/10 border-warning/20';
      case 'approved': return 'text-success bg-success/10 border-success/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'encrypted': return <EyeOff className="h-3 w-3" />;
      case 'evaluating': return <Eye className="h-3 w-3" />;
      case 'approved': return <ShieldCheck className="h-3 w-3" />;
      default: return <Lock className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* File Vault Header */}
      <Card className="bg-gradient-trust border-vault/20">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center">
            <img src={vaultIcon} alt="Secure Vault" className="w-full h-full opacity-80" />
          </div>
          <CardTitle className="text-2xl text-vault">Confidential Claims Vault</CardTitle>
          <CardDescription className="text-lg">
            Your claim details remain encrypted until smart contract evaluation completes
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Submit New Claim */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Submit New Claim
          </CardTitle>
          <CardDescription>
            All information will be encrypted and protected from bias during evaluation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="claimType">Claim Type</Label>
                <Input id="claimType" placeholder="e.g., Auto Accident, Property Damage" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="claimAmount">Estimated Amount</Label>
                <Input id="claimAmount" type="number" placeholder="0.00" required />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Claim Description</Label>
              <Textarea 
                id="description" 
                placeholder="Provide detailed information about your claim..."
                className="min-h-[100px]"
                required 
              />
            </div>

              <div className="space-y-2">
                <Label>Supporting Documents</Label>
                <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                  <Vault className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Drop files here or click to upload
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    All files will be encrypted upon upload
                  </p>
                </div>
              </div>

            <Button 
              type="submit" 
              variant="corporate" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Encrypting & Submitting...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Submit Encrypted Claim
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Claims History */}
      <Card>
        <CardHeader>
          <CardTitle>Your Claims History</CardTitle>
          <CardDescription>
            Track the status of your confidential insurance claims
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {claims.map((claim) => (
              <div key={claim.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-vault/10 rounded-lg">
                    <Vault className="h-4 w-4 text-vault" />
                  </div>
                  <div>
                    <div className="font-medium">{claim.id}</div>
                    <div className="text-sm text-muted-foreground">{claim.type}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-medium">{claim.amount}</div>
                    <div className="text-sm text-muted-foreground">{claim.submittedAt}</div>
                  </div>
                  
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(claim.status)}`}>
                    {getStatusIcon(claim.status)}
                    {claim.status === 'encrypted' ? 'Encrypted' : 
                     claim.status === 'evaluating' ? 'Evaluating' : 
                     claim.status === 'approved' ? 'Approved' : claim.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}