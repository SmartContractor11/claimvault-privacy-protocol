import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Check, Link } from "lucide-react";
import { useAccount } from 'wagmi';

export function WalletConnection() {
  const { address, isConnected } = useAccount();

  if (isConnected && address) {
    return (
      <Card className="border-success/20 bg-success/5">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <Check className="h-5 w-5 text-success" />
            </div>
            <div>
              <CardTitle className="text-lg">Wallet Connected</CardTitle>
              <CardDescription className="text-success font-medium">
                {`${address.slice(0, 6)}...${address.slice(-4)}`}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link className="h-4 w-4" />
              <span>Secure connection established</span>
            </div>
            <ConnectButton />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Connect Wallet</CardTitle>
              <CardDescription>
                Secure your identity to submit confidential claims
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      <CardContent>
        <ConnectButton />
      </CardContent>
    </Card>
  );
}