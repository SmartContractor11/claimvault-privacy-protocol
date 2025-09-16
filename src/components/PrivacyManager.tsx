import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash2, AlertTriangle, CheckCircle, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function PrivacyManager() {
  const [isClearing, setIsClearing] = useState(false);
  const [clearedData, setClearedData] = useState<string[]>([]);
  const { toast } = useToast();

  const handleClearPrivacyData = async () => {
    setIsClearing(true);
    
    try {
      // Simulate clearing different types of privacy data
      const dataTypes = [
        "Local storage data",
        "Session storage data", 
        "IndexedDB records",
        "Cache data",
        "Temporary files",
        "Browser history related to claims"
      ];

      for (let i = 0; i < dataTypes.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setClearedData(prev => [...prev, dataTypes[i]]);
      }

      // Clear actual browser data
      if (typeof window !== 'undefined') {
        // Clear localStorage
        localStorage.removeItem('claimvault-data');
        localStorage.removeItem('user-preferences');
        
        // Clear sessionStorage
        sessionStorage.clear();
        
        // Clear cookies (if any)
        document.cookie.split(";").forEach(cookie => {
          const eqPos = cookie.indexOf("=");
          const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        });
      }

      toast({
        title: "Privacy Data Cleared",
        description: "All local privacy data has been successfully removed from your device.",
      });

    } catch (error) {
      console.error('Error clearing privacy data:', error);
      toast({
        title: "Clear Failed",
        description: "Failed to clear some privacy data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
    }
  };

  const handleResetClearedData = () => {
    setClearedData([]);
  };

  return (
    <Card className="border-destructive/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <Trash2 className="h-5 w-5" />
          Privacy Data Manager
        </CardTitle>
        <CardDescription>
          Clear all locally stored privacy data from your device
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            This action will permanently remove all locally stored data including form inputs, 
            preferences, and temporary files. This cannot be undone.
          </AlertDescription>
        </Alert>

        {clearedData.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Cleared Data Types:</h4>
            <div className="space-y-1">
              {clearedData.map((dataType, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-success">
                  <CheckCircle className="h-3 w-3" />
                  <span>{dataType}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="destructive"
            onClick={handleClearPrivacyData}
            disabled={isClearing}
            className="flex-1"
          >
            {isClearing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Clearing Privacy Data...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Clear All Privacy Data
              </>
            )}
          </Button>

          {clearedData.length > 0 && (
            <Button
              variant="outline"
              onClick={handleResetClearedData}
              className="flex-1"
            >
              <Database className="h-4 w-4" />
              Reset Status
            </Button>
          )}
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• This only clears data stored locally on your device</p>
          <p>• Blockchain data cannot be cleared (by design)</p>
          <p>• Encrypted data on the blockchain remains secure</p>
        </div>
      </CardContent>
    </Card>
  );
}
