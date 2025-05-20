
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User, Eye, EyeOff, Mail, Lock } from "lucide-react";

const Login = () => {
  const [role, setRole] = useState<string>("teacher");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRoleChange = (value: string) => {
    if (value) setRole(value);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple validation
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Success",
        description: "Login successful!",
      });
      
      // Redirect based on role
      if (role === "teacher") {
        navigate("/teacher-dashboard");
      } else {
        navigate("/parent-dashboard");
      }
    }, 1500);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-lg p-8 shadow-2xl animate-fade-in">
        <div className="flex justify-center mb-6">
          <img 
            src="/images/Logo-Baseline-copy.png" 
            alt="BaseLine Elite Logo" 
            className="h-14 mb-2" 
          />
        </div>
        
        <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-6">
          Welcome to <span className="gradient-text">BaseLine Elite</span>
        </h2>
        
        <div className="mb-8">
          <ToggleGroup
            type="single"
            value={role}
            onValueChange={handleRoleChange}
            className="justify-center space-x-2 mb-6"
          >
            <ToggleGroupItem 
              value="teacher" 
              aria-label="Toggle teacher" 
              className={`flex items-center gap-2 w-32 justify-center ${role === "teacher" ? "bg-baseline-yellow text-black" : ""}`}
            >
              <User size={16} />
              Teacher
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="parent" 
              aria-label="Toggle parent" 
              className={`flex items-center gap-2 w-32 justify-center ${role === "parent" ? "bg-baseline-yellow text-black" : ""}`}
            >
              <Users size={16} />
              Parent
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="pl-10 bg-gray-800 border-gray-700"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <button
                type="button"
                onClick={() => toast({
                  title: "Password Reset",
                  description: "Check your email for reset instructions",
                })}
                className="text-sm text-baseline-yellow hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="pl-10 pr-10 bg-gray-800 border-gray-700"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-baseline-yellow hover:bg-baseline-yellow/80 text-black font-semibold"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></span>
                Logging in...
              </span>
            ) : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
