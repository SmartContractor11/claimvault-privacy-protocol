import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Vault, Upload, Lock, CheckCircle, Eye, EyeOff, Database, AlertCircle } from "lucide-react";
import { useClaimVault } from "@/hooks/useClaimVault";
import { useToast } from "@/hooks/use-toast";
import vaultIcon from "@/assets/vault-icon.svg";

export function ClaimsVault() {
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

  const { submitClaim, vaultMetrics, isSubmitting, isConnected, error } = useClaimVault();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to submit a claim.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const claimType = formData.get('claimType') as string;
    const description = formData.get('description') as string;
    const amount = formData.get('claimAmount') as string;

    try {
      // Submit claim to smart contract with FHE encryption
      const txHash = await submitClaim(claimType, description, amount);
      
      toast({
        title: "Claim Submitted Successfully",
        description: `Your claim has been encrypted and submitted to the blockchain. Transaction: ${txHash?.slice(0, 10)}...`,
      });

      // Add to local state for immediate UI update
      const newClaim = {
        id: `CLM-${String(claims.length + 1).padStart(3, '0')}`,
        type: claimType,
        status: "encrypted",
        submittedAt: new Date().toISOString().split('T')[0],
        amount: `$${amount}`
      };
      
      setClaims([newClaim, ...claims]);
      
      // Reset form
      (e.target as HTMLFormElement).reset();
      
    } catch (err) {
      console.error('Error submitting claim:', err);
      toast({
        title: "Submission Failed",
        description: "Failed to submit claim. Please try again.",
        variant: "destructive",
      });
    }
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
      case 'approved': return <CheckCircle className="h-3 w-3" />;
      default: return <Database className="h-3 w-3" />;
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
                <Input id="claimType" name="claimType" placeholder="e.g., Auto Accident, Property Damage" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="claimAmount">Estimated Amount</Label>
                <Input id="claimAmount" name="claimAmount" type="number" placeholder="0.00" required />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Claim Description</Label>
              <Textarea 
                id="description" 
                name="description"
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

            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">Error: {error.message}</span>
              </div>
            )}

            {!isConnected && (
              <div className="flex items-center gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg text-warning">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">Please connect your wallet to submit claims</span>
              </div>
            )}

            <Button 
              type="submit" 
              variant="corporate" 
              className="w-full"
              disabled={isSubmitting || !isConnected}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Encrypting & Submitting to Blockchain...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Submit Encrypted Claim to Smart Contract
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