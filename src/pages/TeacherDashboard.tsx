
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Calendar, Clock, Check } from "lucide-react";

// Sample student data
const initialStudents = [
  { id: 1, name: "Michael Jordan", present: false },
  { id: 2, name: "LeBron James", present: false },
  { id: 3, name: "Stephen Curry", present: false },
  { id: 4, name: "Kobe Bryant", present: false },
  { id: 5, name: "Kevin Durant", present: false },
  { id: 6, name: "Giannis Antetokounmpo", present: false },
  { id: 7, name: "Luka Dončić", present: false },
  { id: 8, name: "Nikola Jokić", present: false },
];

const TeacherDashboard = () => {
  const [students, setStudents] = useState(initialStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAttendanceChange = (id: number) => {
    setStudents(
      students.map(student =>
        student.id === id ? { ...student, present: !student.present } : student
      )
    );
  };

  const handleSelectAll = (selectAll: boolean) => {
    setStudents(
      students.map(student => ({ ...student, present: selectAll }))
    );
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Attendance Submitted",
        description: `Attendance for ${date} has been recorded successfully.`,
      });
    }, 1500);
  };

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
                Teacher <span className="gradient-text">Dashboard</span>
              </h1>
              <p className="text-gray-400">Manage student attendance and performance</p>
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
            <div className="flex items-center mb-6">
              <Calendar size={24} className="text-baseline-yellow mr-2" />
              <h2 className="text-xl font-bold">Manage Attendance</h2>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
            </div>
            
            <div className="mb-4 flex items-center gap-2">
              <Checkbox 
                id="select-all"
                checked={students.every(s => s.present)}
                onCheckedChange={(checked) => handleSelectAll(checked === true)}
                className="border-baseline-yellow data-[state=checked]:bg-baseline-yellow data-[state=checked]:text-black"
              />
              <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                Select All
              </label>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="py-3 px-4 text-left">Attendance</th>
                    <th className="py-3 px-4 text-left">Student Name</th>
                    <th className="py-3 px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="border-b border-gray-800 hover:bg-gray-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <Checkbox 
                          checked={student.present}
                          onCheckedChange={() => handleAttendanceChange(student.id)}
                          className="border-baseline-yellow data-[state=checked]:bg-baseline-yellow data-[state=checked]:text-black"
                        />
                      </td>
                      <td className="py-3 px-4">{student.name}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          student.present 
                            ? "bg-green-900/30 text-green-400 border border-green-500/30" 
                            : "bg-red-900/30 text-red-400 border border-red-500/30"
                        }`}>
                          {student.present ? "Present" : "Absent"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredStudents.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                No students found matching your search.
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-baseline-yellow text-black hover:bg-baseline-yellow/80 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    Submit Attendance
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 animate-fade-in">
              <div className="flex items-center mb-4">
                <Calendar size={20} className="text-baseline-yellow mr-2" />
                <h3 className="text-lg font-semibold">Upcoming Sessions</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex justify-between border-b border-gray-800 pb-2">
                  <span>Advanced Dribbling</span>
                  <span className="text-gray-400">Tomorrow, 4:00 PM</span>
                </li>
                <li className="flex justify-between border-b border-gray-800 pb-2">
                  <span>Shooting Fundamentals</span>
                  <span className="text-gray-400">Wed, 5:30 PM</span>
                </li>
                <li className="flex justify-between border-b border-gray-800 pb-2">
                  <span>Defense Workshop</span>
                  <span className="text-gray-400">Fri, 6:00 PM</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 animate-fade-in">
              <div className="flex items-center mb-4">
                <Clock size={20} className="text-baseline-yellow mr-2" />
                <h3 className="text-lg font-semibold">Recent Activity</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex justify-between border-b border-gray-800 pb-2">
                  <span>Attendance Submitted</span>
                  <span className="text-gray-400">Today, 10:15 AM</span>
                </li>
                <li className="flex justify-between border-b border-gray-800 pb-2">
                  <span>Performance Notes Added</span>
                  <span className="text-gray-400">Yesterday, 5:30 PM</span>
                </li>
                <li className="flex justify-between border-b border-gray-800 pb-2">
                  <span>New Student Registered</span>
                  <span className="text-gray-400">May 18, 11:20 AM</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TeacherDashboard;
