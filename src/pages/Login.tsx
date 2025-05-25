
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, UserCog, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
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
    
    // Simulate network delay
    setTimeout(() => {
      // Mock authentication with hardcoded credentials
      if (email === 'coach@baseline.com' && password === 'coach123' && selectedRole === 'coach') {
        // Store user role in localStorage
        localStorage.setItem('userRole', 'coach');
        
        toast({
          title: "Login successful!",
          description: "Welcome back, Coach!",
        });
        
        // Redirect to coach dashboard
        navigate('/coach-dashboard');
      } else if (email === 'parent@baseline.com' && password === 'parent123' && selectedRole === 'parent') {
        // Store user role in localStorage
        localStorage.setItem('userRole', 'parent');
        
        toast({
          title: "Login successful!",
          description: "Welcome to your dashboard!",
        });
        
        // Redirect to parent dashboard
        navigate('/parent-dashboard');
      } else {
        setError('Invalid email or password');
        console.log('Login failed: Invalid credentials');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center py-24 px-4">
        <div className="w-full max-w-md">
          <div className="relative">
            {/* Glassmorphism Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20"></div>
            
            <div className="relative bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
              {/* Header with Sports Theme */}
              <div className="relative bg-gradient-to-r from-baseline-yellow via-yellow-400 to-baseline-yellow p-6 text-center">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-yellow-500/20"></div>
                <div className="relative">
                  <h2 className="text-2xl font-bold text-black mb-2">
                    Welcome to <span className="font-black">BaseLine Academy</span>
                  </h2>
                  <p className="text-black/80 text-sm">Elite Basketball Training Platform</p>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-8">
                {stage === 'select-role' ? (
                  <div className="animate-fade-in">
                    <div className="text-center mb-8">
                      <h3 className="text-xl font-semibold mb-2">Choose Your Role</h3>
                      <p className="text-gray-400 text-sm">Select how you want to access the platform</p>
                    </div>
                    
                    <div className="space-y-4">
                      <button
                        onClick={() => handleRoleSelect('coach')}
                        className="w-full group relative overflow-hidden bg-gradient-to-r from-gray-800 to-gray-700 hover:from-baseline-yellow/20 hover:to-yellow-600/20 border border-gray-600 hover:border-baseline-yellow/50 rounded-xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-baseline-yellow/20 rounded-lg group-hover:bg-baseline-yellow/30 transition-colors">
                            <UserCog size={24} className="text-baseline-yellow" />
                          </div>
                          <div className="text-left">
                            <h4 className="font-semibold text-lg">Coach Login</h4>
                            <p className="text-gray-400 text-sm">Manage teams, players & events</p>
                          </div>
                        </div>
                      </button>
                      
                      <button
                        onClick={() => handleRoleSelect('parent')}
                        className="w-full group relative overflow-hidden bg-gradient-to-r from-gray-800 to-gray-700 hover:from-baseline-yellow/20 hover:to-yellow-600/20 border border-gray-600 hover:border-baseline-yellow/50 rounded-xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-baseline-yellow/20 rounded-lg group-hover:bg-baseline-yellow/30 transition-colors">
                            <User size={24} className="text-baseline-yellow" />
                          </div>
                          <div className="text-left">
                            <h4 className="font-semibold text-lg">Parent Login</h4>
                            <p className="text-gray-400 text-sm">Track your child's progress</p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="animate-fade-in">
                    <button
                      onClick={handleBackToRoles}
                      className="flex items-center text-gray-400 hover:text-baseline-yellow mb-6 transition-colors"
                    >
                      <ChevronLeft size={16} className="mr-1" /> Back to roles
                    </button>
                    
                    <div className="text-center mb-8">
                      <div className="p-3 bg-baseline-yellow/20 rounded-lg inline-block mb-4">
                        {selectedRole === 'coach' ? 
                          <UserCog size={32} className="text-baseline-yellow" /> : 
                          <User size={32} className="text-baseline-yellow" />
                        }
                      </div>
                      <h3 className="text-xl font-bold">
                        {selectedRole === 'coach' ? 'Coach Portal' : 'Parent Portal'}
                      </h3>
                      <p className="text-gray-400 text-sm">Enter your credentials to continue</p>
                    </div>
                    
                    {error && (
                      <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6 backdrop-blur-sm animate-shake">
                        <p className="text-sm font-medium">{error}</p>
                      </div>
                    )}
                    
                    <form onSubmit={handleLogin} className="space-y-6">
                      <div className="space-y-4">
                        <div className="relative">
                          <label className="block text-sm font-medium mb-2 text-gray-300">Email Address</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-600 bg-gray-800/50 backdrop-blur-sm focus:border-baseline-yellow focus:ring-2 focus:ring-baseline-yellow/20 transition-all"
                              placeholder="Enter your email"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="relative">
                          <label className="block text-sm font-medium mb-2 text-gray-300">Password</label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full pl-12 pr-12 py-3 rounded-lg border border-gray-600 bg-gray-800/50 backdrop-blur-sm focus:border-baseline-yellow focus:ring-2 focus:ring-baseline-yellow/20 transition-all"
                              placeholder="Enter your password"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-baseline-yellow to-yellow-400 hover:from-yellow-400 hover:to-baseline-yellow text-black font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black mr-2"></div>
                            Signing in...
                          </div>
                        ) : (
                          'Sign In'
                        )}
                      </Button>
                      
                      <div className="text-center">
                        <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                          <p className="text-xs text-gray-400 mb-2 font-medium">Demo Credentials:</p>
                          <p className="text-xs text-baseline-yellow">
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
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;
