
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, User, Activity } from "lucide-react";

const ParentDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    navigate("/login");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <main className="flex-grow section-padding">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
                Parent <span className="gradient-text">Dashboard</span>
              </h1>
              <p className="text-gray-400">Track your child's progress and schedule</p>
            </div>
            <Button 
              variant="outline" 
              className="border-baseline-yellow text-baseline-yellow hover:bg-baseline-yellow hover:text-black"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8 animate-fade-in">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-baseline-yellow/20 rounded-full p-3">
                <User size={32} className="text-baseline-yellow" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Welcome, David Johnson!</h2>
                <p className="text-gray-400">Parent of Michael Johnson</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex flex-col items-center">
                <h3 className="text-gray-400 mb-1">Attendance Rate</h3>
                <p className="text-2xl font-bold text-baseline-yellow">92%</p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex flex-col items-center">
                <h3 className="text-gray-400 mb-1">Sessions Completed</h3>
                <p className="text-2xl font-bold text-baseline-yellow">24</p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex flex-col items-center">
                <h3 className="text-gray-400 mb-1">Next Session</h3>
                <p className="text-2xl font-bold text-baseline-yellow">Today, 5:00 PM</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 animate-fade-in">
              <div className="flex items-center mb-4">
                <Calendar size={20} className="text-baseline-yellow mr-2" />
                <h3 className="text-lg font-semibold">Upcoming Schedule</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex justify-between items-center border-b border-gray-800 pb-2">
                  <div>
                    <p>Advanced Dribbling</p>
                    <p className="text-sm text-gray-400">Coach: James Wilson</p>
                  </div>
                  <p className="text-gray-400">Today, 5:00 PM</p>
                </li>
                <li className="flex justify-between items-center border-b border-gray-800 pb-2">
                  <div>
                    <p>Shooting Fundamentals</p>
                    <p className="text-sm text-gray-400">Coach: Sarah Lee</p>
                  </div>
                  <p className="text-gray-400">Wed, 5:30 PM</p>
                </li>
                <li className="flex justify-between items-center border-b border-gray-800 pb-2">
                  <div>
                    <p>Team Practice</p>
                    <p className="text-sm text-gray-400">Coach: Mark Davis</p>
                  </div>
                  <p className="text-gray-400">Sat, 10:00 AM</p>
                </li>
              </ul>
              <Button variant="ghost" className="mt-4 text-baseline-yellow hover:text-baseline-yellow/80">
                View Full Schedule
              </Button>
            </div>
            
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 animate-fade-in">
              <div className="flex items-center mb-4">
                <Activity size={20} className="text-baseline-yellow mr-2" />
                <h3 className="text-lg font-semibold">Recent Performance</h3>
              </div>
              <div className="space-y-4">
                <div className="mb-2">
                  <div className="flex justify-between mb-1">
                    <span>Ball Handling</span>
                    <span className="text-baseline-yellow">8/10</span>
                  </div>
                  <div className="w-full bg-gray-800 h-2 rounded-full">
                    <div className="bg-baseline-yellow h-2 rounded-full" style={{ width: "80%" }}></div>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between mb-1">
                    <span>Shooting</span>
                    <span className="text-baseline-yellow">7/10</span>
                  </div>
                  <div className="w-full bg-gray-800 h-2 rounded-full">
                    <div className="bg-baseline-yellow h-2 rounded-full" style={{ width: "70%" }}></div>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between mb-1">
                    <span>Defense</span>
                    <span className="text-baseline-yellow">9/10</span>
                  </div>
                  <div className="w-full bg-gray-800 h-2 rounded-full">
                    <div className="bg-baseline-yellow h-2 rounded-full" style={{ width: "90%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Teamwork</span>
                    <span className="text-baseline-yellow">8/10</span>
                  </div>
                  <div className="w-full bg-gray-800 h-2 rounded-full">
                    <div className="bg-baseline-yellow h-2 rounded-full" style={{ width: "80%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mt-6 animate-fade-in">
            <div className="flex items-center mb-4">
              <Clock size={20} className="text-baseline-yellow mr-2" />
              <h3 className="text-lg font-semibold">Coach's Notes</h3>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
              <div className="flex justify-between mb-1">
                <span className="font-medium">May 18, 2025</span>
                <span className="text-gray-400">Coach James Wilson</span>
              </div>
              <p className="text-gray-300">
                Michael is showing great progress with his shooting form. His 3-point accuracy has improved significantly over the past two weeks. We'll continue to focus on quick release drills in the upcoming sessions.
              </p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="flex justify-between mb-1">
                <span className="font-medium">May 15, 2025</span>
                <span className="text-gray-400">Coach Sarah Lee</span>
              </div>
              <p className="text-gray-300">
                Michael demonstrated excellent court awareness during today's scrimmage. His defensive positioning has improved, though we should work on lateral quickness. He shows great leadership potential with his teammates.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ParentDashboard;
