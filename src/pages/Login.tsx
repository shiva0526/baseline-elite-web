
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, UserCog, User } from 'lucide-react';
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
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center py-24 px-4">
        <div className="w-full max-w-md">
          <div className="bg-gray-900 rounded-lg shadow-xl border border-gray-800 overflow-hidden backdrop-blur-md">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-800 to-black p-6 border-b border-gray-800">
              <h2 className="text-2xl font-bold text-center">
                Welcome to <span className="gradient-text">BaseLine Academy</span>
              </h2>
            </div>
            
            {/* Content */}
            <div className="p-6">
              {stage === 'select-role' ? (
                <>
                  <p className="text-center text-gray-300 mb-8">
                    Please select your role to continue
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleRoleSelect('coach')}
                      className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center transition-all duration-200 hover:border-baseline-yellow"
                    >
                      <UserCog size={48} className="text-baseline-yellow mb-4" />
                      <span className="text-lg font-medium">Coach Login</span>
                    </button>
                    
                    <button
                      onClick={() => handleRoleSelect('parent')}
                      className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center transition-all duration-200 hover:border-baseline-yellow"
                    >
                      <User size={48} className="text-baseline-yellow mb-4" />
                      <span className="text-lg font-medium">Parent Login</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={handleBackToRoles}
                    className="flex items-center text-gray-400 hover:text-baseline-yellow mb-6"
                  >
                    <ChevronLeft size={16} className="mr-1" /> Back to roles
                  </button>
                  
                  <h3 className="text-xl font-bold mb-6">
                    {selectedRole === 'coach' ? 'Coach Login' : 'Parent Login'}
                  </h3>
                  
                  {error && (
                    <div className="bg-red-900/30 border border-red-800 text-red-200 px-4 py-2 rounded mb-4">
                      {error}
                    </div>
                  )}
                  
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2"
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                    
                    <div className="pt-2">
                      <Button
                        type="submit"
                        className="button-primary w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Logging in...' : 'Login'}
                      </Button>
                    </div>
                    
                    <div className="text-center text-sm text-gray-500 pt-2">
                      <p>
                        {selectedRole === 'coach' ? 
                          'Demo account: coach@baseline.com / coach123' : 
                          'Demo account: parent@baseline.com / parent123'}
                      </p>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;
