
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, FileSpreadsheet, Award, LogOut, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data
const playerData = {
  name: "Alex Johnson",
  age: 16,
  program: "5-Day",
  coach: "Coach Williams",
  startDate: "January 15, 2025",
  attendanceRate: "85%",
  totalClasses: 45,
  nextClass: "Monday, May 26, 2025 at 4:00 PM"
};

const paymentHistory = [
  { id: 1, date: "May 1, 2025", amount: "$250.00", description: "Monthly Program Fee", status: "Paid" },
  { id: 2, date: "April 1, 2025", amount: "$250.00", description: "Monthly Program Fee", status: "Paid" },
  { id: 3, date: "March 1, 2025", amount: "$250.00", description: "Monthly Program Fee", status: "Paid" }
];

const upcomingEvents = [
  { 
    id: 1, 
    title: "BaseLine Summer Championship",
    date: "June 15, 2025",
    registered: true
  },
  { 
    id: 2, 
    title: "Skills Workshop",
    date: "July 10, 2025",
    registered: false
  }
];

const recentAttendance = [
  { date: "May 22, 2025", present: true },
  { date: "May 20, 2025", present: true },
  { date: "May 19, 2025", present: false },
  { date: "May 17, 2025", present: true },
  { date: "May 15, 2025", present: true },
];

const ParentDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  const handleLogout = () => {
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Dashboard Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img src="/images/Logo-Baseline-copy.png" alt="BaseLine Academy" className="h-12 mr-4" />
              <h1 className="text-xl font-bold">Parent Dashboard</h1>
            </div>
            
            <div className="flex space-x-4">
              <Button variant="ghost" onClick={handleLogout} className="text-gray-300">
                <LogOut size={18} className="mr-2" /> Logout
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-1 md:grid-cols-3 w-full mb-8">
            <TabsTrigger value="overview">
              <UserCircle className="mr-2 h-4 w-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="attendance">
              <Calendar className="mr-2 h-4 w-4" /> Attendance
            </TabsTrigger>
            <TabsTrigger value="tournaments">
              <Award className="mr-2 h-4 w-4" /> Tournaments
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Player Profile */}
              <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 col-span-2">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-xl font-bold">Player Profile</h2>
                </div>
                
                <div className="flex flex-col md:flex-row">
                  <div className="bg-gray-800 rounded-full w-24 h-24 flex items-center justify-center mb-4 md:mb-0 md:mr-6">
                    <UserCircle size={64} className="text-gray-400" />
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold">{playerData.name}</h3>
                      <p className="text-gray-400">Age: {playerData.age}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Program</p>
                        <p>{playerData.program}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Coach</p>
                        <p>{playerData.coach}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Start Date</p>
                        <p>{playerData.startDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Attendance Rate</p>
                        <p>{playerData.attendanceRate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Next Class */}
              <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 flex flex-col">
                <h2 className="text-xl font-bold mb-6">Next Class</h2>
                
                <div className="flex-1 flex flex-col justify-center items-center text-center">
                  <Calendar size={48} className="text-baseline-yellow mb-4" />
                  <p className="text-lg font-medium mb-1">Monday, May 26, 2025</p>
                  <p className="text-gray-400">4:00 PM - 6:00 PM</p>
                </div>
              </div>
            </div>
            
            {/* Payment History */}
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Payment History</h2>
                <Button variant="outline" size="sm">
                  <FileSpreadsheet size={16} className="mr-2" /> View All
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left py-2 px-4 bg-gray-800 rounded-tl-lg">Date</th>
                      <th className="text-left py-2 px-4 bg-gray-800">Description</th>
                      <th className="text-right py-2 px-4 bg-gray-800">Amount</th>
                      <th className="text-center py-2 px-4 bg-gray-800 rounded-tr-lg">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentHistory.map((payment) => (
                      <tr key={payment.id} className="border-t border-gray-800">
                        <td className="py-3 px-4">{payment.date}</td>
                        <td className="py-3 px-4">{payment.description}</td>
                        <td className="py-3 px-4 text-right">{payment.amount}</td>
                        <td className="py-3 px-4">
                          <span className="inline-block w-full text-center bg-green-900 text-green-300 px-2 py-0.5 rounded-full text-xs">
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          
          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-8">
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <h2 className="text-xl font-bold mb-6">Attendance History</h2>
              
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-400">Total Classes Attended</p>
                  <p className="text-3xl font-bold">{playerData.totalClasses}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400">Attendance Rate</p>
                  <p className="text-3xl font-bold text-baseline-yellow">{playerData.attendanceRate}</p>
                </div>
                
                <div>
                  <Button variant="outline" size="sm">
                    View Full Calendar
                  </Button>
                </div>
              </div>
              
              <h3 className="font-medium mb-4">Recent Classes</h3>
              <div className="space-y-2">
                {recentAttendance.map((record, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                  >
                    <p>{record.date}</p>
                    <span 
                      className={`px-3 py-1 rounded-full text-xs ${
                        record.present 
                          ? 'bg-green-900 text-green-300' 
                          : 'bg-red-900 text-red-300'
                      }`}
                    >
                      {record.present ? 'Present' : 'Absent'}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <h3 className="font-medium mb-4">Monthly Attendance</h3>
                {/* Placeholder for attendance chart */}
                <div className="bg-gray-800 rounded-lg p-4 h-64 flex items-center justify-center">
                  <p className="text-gray-400">Attendance chart would be displayed here</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Tournaments Tab */}
          <TabsContent value="tournaments" className="space-y-8">
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <h2 className="text-xl font-bold mb-6">Upcoming Tournaments</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="border border-gray-800 rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-2">{event.title}</h3>
                    <p className="text-gray-400 mb-4">{event.date}</p>
                    
                    {event.registered ? (
                      <div className="bg-green-900/30 border border-green-800 text-green-200 px-4 py-2 rounded text-center">
                        Registered
                      </div>
                    ) : (
                      <Button className="button-primary w-full">
                        Register
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <h2 className="text-xl font-bold mb-6">Past Tournament Results</h2>
              
              <div className="border border-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2">Winter Elite Showdown</h3>
                <p className="text-gray-400 mb-4">December 10, 2024</p>
                
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Player Stats</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Points</p>
                      <p className="text-lg font-medium">24</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Rebounds</p>
                      <p className="text-lg font-medium">8</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Assists</p>
                      <p className="text-lg font-medium">5</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Steals</p>
                      <p className="text-lg font-medium">3</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Button variant="outline" className="w-full">
                    <FileSpreadsheet size={16} className="mr-2" /> View Full Results
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ParentDashboard;
