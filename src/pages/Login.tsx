
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, UserCog, User, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

type Role = 'coach' | 'parent' | null;
type LoginStage = 'select-role' | 'login-form';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [stage, setStage] = useState<LoginStage>('select-role');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setStage('login-form');
  };

  const handleBackToRoles = () => {
    setStage('select-role');
    setSelectedRole(null);
    setEmail('');
    setPassword('');
    setError('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    console.log('Attempting login with:', { email, password, role: selectedRole });
    
    setTimeout(() => {
      if (email === 'coach@baseline.com' && password === 'coach123' && selectedRole === 'coach') {
        localStorage.setItem('userRole', 'coach');
        
        toast({
          title: "Login successful!",
          description: "Welcome back, Coach!",
        });
        
        navigate('/coach-dashboard');
      } else if (email === 'parent@baseline.com' && password === 'parent123' && selectedRole === 'parent') {
        localStorage.setItem('userRole', 'parent');
        
        toast({
          title: "Login successful!",
          description: "Welcome to your dashboard!",
        });
        
        navigate('/parent-dashboard');
      } else {
        setError('Invalid email or password');
        console.log('Login failed: Invalid credentials');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex flex-col relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-baseline-yellow/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-baseline-yellow/5 rounded-full blur-2xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/5 rounded-full blur-lg animate-pulse delay-300"></div>
      </div>
      
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center py-24 px-4 relative z-10">
        <div className="w-full max-w-md">
          {/* Glassmorphism Card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden relative">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-baseline-yellow/20 via-transparent to-baseline-yellow/20 opacity-20"></div>
            
            {/* Header */}
            <div className="relative bg-gradient-to-r from-baseline-yellow/20 via-baseline-yellow/10 to-baseline-yellow/20 p-6 border-b border-white/10">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-baseline-yellow to-yellow-400 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <img src="/images/Logo-Baseline-copy.png" alt="Logo" className="w-12 h-12" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Welcome to BaseLine Academy
                </h2>
                <p className="text-gray-300/80 text-sm mt-2">
                  Your journey to basketball excellence starts here
                </p>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-8 relative">
              {stage === 'select-role' ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2">Choose Your Role</h3>
                    <p className="text-gray-300/80 text-sm">
                      Select how you'd like to access the platform
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {/* Coach Login Card */}
                    <button
                      onClick={() => handleRoleSelect('coach')}
                      className="group relative overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:from-baseline-yellow/20 hover:to-yellow-400/10 border border-gray-700/50 hover:border-baseline-yellow/50 rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-baseline-yellow/0 to-baseline-yellow/0 group-hover:from-baseline-yellow/10 group-hover:to-transparent transition-all duration-300"></div>
                      <div className="relative flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-baseline-yellow to-yellow-400 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <UserCog size={24} className="text-black" />
                        </div>
                        <div className="text-left">
                          <h4 className="text-lg font-semibold text-white group-hover:text-baseline-yellow transition-colors">
                            Coach Portal
                          </h4>
                          <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                            Manage players, tournaments & attendance
                          </p>
                        </div>
                      </div>
                    </button>
                    
                    {/* Parent Login Card */}
                    <button
                      onClick={() => handleRoleSelect('parent')}
                      className="group relative overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:from-baseline-yellow/20 hover:to-yellow-400/10 border border-gray-700/50 hover:border-baseline-yellow/50 rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-baseline-yellow/0 to-baseline-yellow/0 group-hover:from-baseline-yellow/10 group-hover:to-transparent transition-all duration-300"></div>
                      <div className="relative flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <User size={24} className="text-white" />
                        </div>
                        <div className="text-left">
                          <h4 className="text-lg font-semibold text-white group-hover:text-baseline-yellow transition-colors">
                            Parent Portal
                          </h4>
                          <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                            Track your child's progress & schedule
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Back Button */}
                  <button
                    onClick={handleBackToRoles}
                    className="flex items-center text-gray-400 hover:text-baseline-yellow transition-colors group"
                  >
                    <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" /> 
                    Back to role selection
                  </button>
                  
                  {/* Form Header */}
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedRole === 'coach' 
                          ? 'bg-gradient-to-br from-baseline-yellow to-yellow-400' 
                          : 'bg-gradient-to-br from-blue-500 to-blue-600'
                      }`}>
                        {selectedRole === 'coach' ? (
                          <UserCog size={20} className="text-black" />
                        ) : (
                          <User size={20} className="text-white" />
                        )}
                      </div>
                      <h3 className="text-xl font-bold">
                        {selectedRole === 'coach' ? 'Coach Login' : 'Parent Login'}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg backdrop-blur-sm animate-fade-in">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                        {error}
                      </div>
                    </div>
                  )}
                  
                  {/* Login Form */}
                  <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Email Address</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-xl border border-gray-600/50 bg-white/5 backdrop-blur-sm px-4 py-3 text-white placeholder-gray-400 focus:border-baseline-yellow/50 focus:ring-2 focus:ring-baseline-yellow/20 focus:outline-none transition-all duration-300"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-xl border border-gray-600/50 bg-white/5 backdrop-blur-sm px-4 py-3 pr-12 text-white placeholder-gray-400 focus:border-baseline-yellow/50 focus:ring-2 focus:ring-baseline-yellow/20 focus:outline-none transition-all duration-300"
                            placeholder="Enter your password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-baseline-yellow transition-colors"
                          >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Login Button */}
                    <div className="pt-2">
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 bg-gradient-to-r from-baseline-yellow to-yellow-400 hover:from-yellow-400 hover:to-baseline-yellow text-black font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2"></div>
                            Signing in...
                          </div>
                        ) : (
                          'Sign In'
                        )}
                      </Button>
                    </div>
                    
                    {/* Demo Credentials */}
                    <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
                      <p className="text-center text-xs text-gray-400 mb-2">Demo Credentials:</p>
                      <div className="text-center text-xs space-y-1">
                        <p className="text-baseline-yellow">
                          {selectedRole === 'coach' ? 
                            'coach@baseline.com / coach123' : 
                            'parent@baseline.com / parent123'}
                        </p>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
          
          {/* Additional Visual Elements */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Secure • Fast • Reliable
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;
