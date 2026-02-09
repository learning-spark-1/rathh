import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const getDeviceType = (): string => {
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "Tablet";
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return "Mobile";
  return "Desktop";
};

const getBrowserName = (): string => {
  const ua = navigator.userAgent;
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Safari")) return "Safari";
  if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";
  return "Browser";
};

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const { login } = useAuth();

  const handleSimulateLogin = () => {
    const deviceType = getDeviceType();
    const browserName = getBrowserName();
    const username = `${deviceType}-${browserName}-User`;
    
    login(username);
    onClose();
    toast.success("Logged in successfully!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-serif text-center">Coming Soon</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            We are still working on the full authentication system.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          <Button 
            onClick={handleSimulateLogin}
            className="w-full h-12 text-base bg-primary hover:bg-primary/90"
          >
            Simulate Login
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
