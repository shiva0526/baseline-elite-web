import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  Award, 
  User, 
  FileSpreadsheet, 
  Bell, 
  LogOut,
  Plus,
  Download,
  Trash2,
  X,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from "@/components/ui/use-toast";

// Tournament interface
interface Tournament {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  matchType: string;
  ageGroups: string[];
  registrationOpen: string;
  registrationClose: string;
  requiredFields: string[];
  status?: 'upcoming' | 'completed' | 'cancelled';
}

// Mock data for players
const initialPlayers: Player[] = [
  { id: 1, name: 'Michael Jordan', program: '5-Day', attendedClasses: 15 },
  { id: 2, name: 'LeBron James', program: '3-Day', attendedClasses: 8 },
  { id: 3, name: 'Kevin Durant', program: '5-Day', attendedClasses: 12 },
  { id: 4, name: 'Stephen Curry', program: '3-Day', attendedClasses: 7 },
  { id: 5, name: 'Giannis Antetokounmpo', program: '5-Day', attendedClasses: 14 },
  { id: 6, name: 'Joel Embiid', program: '3-Day', attendedClasses: 9 },
];

// Days of the week for attendance
const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

type Program = '3-Day' | '5-Day';

interface Player {
  id: number;
  name: string;
  program: Program;
  attendedClasses: number;
}

const CoachDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [newPlayer, setNewPlayer] = useState({ name: '', program: '3-Day' as Program });
  const [announcementText, setAnnouncementText] = useState('');
  const [upcomingTournament, setUpcomingTournament] = useState<Tournament | null>(null);
  const [pastTournaments, setPastTournaments] = useState<Tournament[]>([]);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [tournamentToCancel, setTournamentToCancel] = useState<number | null>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  
  // Tournament Form State
  const [tournamentForm, setTournamentForm] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    matchType: '3v3',
    ageGroups: [] as string[],
    registrationOpen: '',
    registrationClose: '',
    requiredFields: [] as string[]
  });
  
  // Attendance tracking
  const [attendance, setAttendance] = useState<Record<number, string[]>>(
    initialPlayers.reduce((acc, player) => {
      acc[player.id] = [];
      return acc;
    }, {} as Record<number, string[]>)
  );
  
  // Load tournaments on component mount
  useEffect(() => {
    // Load upcoming tournament
    const storedUpcoming = localStorage.getItem('upcomingTournament');
    if (storedUpcoming) {
      setUpcomingTournament(JSON.parse(storedUpcoming));
    }
    
    // Load past tournaments
    const storedPast = localStorage.getItem('pastTournaments');
    if (storedPast) {
      setPastTournaments(JSON.parse(storedPast));
    }
    
    // Load registrations
    const storedRegistrations = localStorage.getItem('tournamentRegistrations');
    if (storedRegistrations) {
      setRegistrations(JSON.parse(storedRegistrations));
    }
  }, []);
  
  const handleAttendanceChange = (playerId: number, day: string) => {
    setAttendance(prev => {
      const playerAttendance = [...(prev[playerId] || [])];
      const dayIndex = playerAttendance.indexOf(day);
      
      if (dayIndex === -1) {
        playerAttendance.push(day);
      } else {
        playerAttendance.splice(dayIndex, 1);
      }
      
      return { ...prev, [playerId]: playerAttendance };
    });
    
    // Update player's attended classes
    setPlayers(prev => prev.map(player => {
      if (player.id === playerId) {
        // Get the updated attendance status after the change
        const updatedAttendance = attendance[playerId] || [];
        const isDayPresent = updatedAttendance.includes(day);
        
        // If the day wasn't in the attendance before, we're adding it now
        // Otherwise, we're removing it
        const attendanceChange = isDayPresent ? 0 : 1;
        
        return { 
          ...player, 
          attendedClasses: player.attendedClasses + attendanceChange 
        };
      }
      return player;
    }));
  };
  
  const handleAddPlayer = () => {
    if (!newPlayer.name) return;
    
    const newPlayerId = Math.max(0, ...players.map(p => p.id)) + 1;
    
    setPlayers([
      ...players,
      { 
        id: newPlayerId, 
        name: newPlayer.name, 
        program: newPlayer.program, 
        attendedClasses: 0 
      }
    ]);
    
    setAttendance(prev => ({
      ...prev,
      [newPlayerId]: []
    }));
    
    setNewPlayer({ name: '', program: '3-Day' });
    
    toast({
      title: "Player added",
      description: `${newPlayer.name} has been added to the ${newPlayer.program} program.`,
    });
  };
  
  const handlePublishAnnouncement = () => {
    if (!announcementText) {
      toast({
        title: "Empty announcement",
        description: "Please enter an announcement before publishing.",
        variant: "destructive"
      });
      return;
    }
    
    // Save announcement to localStorage
    localStorage.setItem('announcement', announcementText);
    
    toast({
      title: "Announcement published",
      description: "The announcement has been published to the home page.",
    });
    
    setAnnouncementText('');
  };
  
  const handleCreateTournament = () => {
    // Validate form
    if (!tournamentForm.title || !tournamentForm.date || !tournamentForm.location) {
      toast({
        title: "Missing information",
        description: "Please fill in all required tournament details.",
        variant: "destructive"
      });
      return;
    }
    
    if (tournamentForm.ageGroups.length === 0) {
      toast({
        title: "Missing age groups",
        description: "Please select at least one age group.",
        variant: "destructive"
      });
      return;
    }
    
    if (tournamentForm.requiredFields.length === 0) {
      toast({
        title: "Missing required fields",
        description: "Please select at least one required field for registration.",
        variant: "destructive"
      });
      return;
    }
    
    // Create new tournament
    const newTournament: Tournament = {
      id: Date.now(),
      ...tournamentForm,
      status: 'upcoming'
    };
    
    // Save as upcoming tournament
    localStorage.setItem('upcomingTournament', JSON.stringify(newTournament));
    setUpcomingTournament(newTournament);
    
    // Reset form
    setTournamentForm({
      title: '',
      date: '',
      location: '',
      description: '',
      matchType: '3v3',
      ageGroups: [],
      registrationOpen: '',
      registrationClose: '',
      requiredFields: []
    });
    
    toast({
      title: "Tournament created",
      description: "The tournament has been published to the website.",
    });
  };
  
  const handleCancelTournament = (tournamentId: number) => {
    setTournamentToCancel(tournamentId);
    setShowConfirmCancel(true);
  };
  
  const confirmCancelTournament = () => {
    if (upcomingTournament && upcomingTournament.id === tournamentToCancel) {
      // Update tournament status to cancelled
      const updatedTournament = { ...upcomingTournament, status: 'cancelled' as const };
      localStorage.setItem('upcomingTournament', JSON.stringify(updatedTournament));
      setUpcomingTournament(updatedTournament);
      
      toast({
        title: "Tournament cancelled",
        description: "The tournament has been cancelled and removed from the public view.",
      });
    }
    
    setShowConfirmCancel(false);
    setTournamentToCancel(null);
  };
  
  const handleExportRegistrations = () => {
    if (registrations.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no registrations for this tournament yet.",
        variant: "destructive"
      });
      return;
    }
    
    // Create CSV content
    const headers = Object.keys(registrations[0]).join(',');
    const rows = registrations.map(reg => Object.values(reg).join(','));
    const csvContent = [headers, ...rows].join('\n');
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `tournament_registrations_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export successful",
      description: "Tournament registrations have been exported to CSV.",
    });
  };
  
  const handleLogout = () => {
    // Clear user role
    localStorage.removeItem('userRole');
    navigate('/login');
  };
  
  // Filter players by program
  const threeDayPlayers = players.filter(p => p.program === '3-Day');
  const fiveDayPlayers = players.filter(p => p.program === '5-Day');
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Dashboard Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img src="/images/Logo-Baseline-copy.png" alt="BaseLine Academy" className="h-12 mr-4" />
              <h1 className="text-xl font-bold">Coach Dashboard</h1>
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
        <Tabs defaultValue="attendance" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full mb-8">
            <TabsTrigger value="attendance">
              <Calendar className="mr-2 h-4 w-4" /> Attendance
            </TabsTrigger>
            <TabsTrigger value="players">
              <Users className="mr-2 h-4 w-4" /> Players
            </TabsTrigger>
            <TabsTrigger value="tournaments">
              <Award className="mr-2 h-4 w-4" /> Tournaments
            </TabsTrigger>
            <TabsTrigger value="registrations">
              <FileSpreadsheet className="mr-2 h-4 w-4" /> Registrations
            </TabsTrigger>
            <TabsTrigger value="announcements">
              <Bell className="mr-2 h-4 w-4" /> Announcements
            </TabsTrigger>
          </TabsList>
          
          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-8">
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <h2 className="text-xl font-bold mb-6">Weekly Attendance Tracker</h2>
              
              {/* 3-Day Program */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-baseline-yellow">3-Day Program</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="text-left py-2 px-4 bg-gray-800 rounded-tl-lg">Player Name</th>
                        {weekdays.map((day) => (
                          <th key={day} className="py-2 px-4 bg-gray-800 text-center">{day}</th>
                        ))}
                        <th className="py-2 px-4 bg-gray-800 text-center rounded-tr-lg">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {threeDayPlayers.length > 0 ? (
                        threeDayPlayers.map((player) => (
                          <tr key={player.id} className="border-t border-gray-800">
                            <td className="py-3 px-4">{player.name}</td>
                            {weekdays.map((day) => (
                              <td key={`${player.id}-${day}`} className="py-3 px-4 text-center">
                                <input
                                  type="checkbox"
                                  checked={attendance[player.id]?.includes(day) || false}
                                  onChange={() => handleAttendanceChange(player.id, day)}
                                  className="h-5 w-5 rounded accent-baseline-yellow cursor-pointer"
                                />
                              </td>
                            ))}
                            <td className="py-3 px-4 text-center font-semibold">
                              {attendance[player.id]?.length || 0}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="py-4 text-center text-gray-400">
                            No players in the 3-Day Program
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* 5-Day Program */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-baseline-yellow">5-Day Program</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="text-left py-2 px-4 bg-gray-800 rounded-tl-lg">Player Name</th>
                        {weekdays.map((day) => (
                          <th key={day} className="py-2 px-4 bg-gray-800 text-center">{day}</th>
                        ))}
                        <th className="py-2 px-4 bg-gray-800 text-center rounded-tr-lg">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fiveDayPlayers.length > 0 ? (
                        fiveDayPlayers.map((player) => (
                          <tr key={player.id} className="border-t border-gray-800">
                            <td className="py-3 px-4">{player.name}</td>
                            {weekdays.map((day) => (
                              <td key={`${player.id}-${day}`} className="py-3 px-4 text-center">
                                <input
                                  type="checkbox"
                                  checked={attendance[player.id]?.includes(day) || false}
                                  onChange={() => handleAttendanceChange(player.id, day)}
                                  className="h-5 w-5 rounded accent-baseline-yellow cursor-pointer"
                                />
                              </td>
                            ))}
                            <td className="py-3 px-4 text-center font-semibold">
                              {attendance[player.id]?.length || 0}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="py-4 text-center text-gray-400">
                            No players in the 5-Day Program
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="mt-8 flex justify-between">
                <Button className="button-primary">
                  Save Attendance
                </Button>
                
                <Button variant="outline">
                  Reset Weekly Attendance
                </Button>
              </div>
            </div>
          </TabsContent>
          
          {/* Players Tab */}
          <TabsContent value="players" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Add New Player */}
              <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
                <h2 className="text-xl font-bold mb-6">Add New Player</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Player Name</label>
                    <input
                      type="text"
                      value={newPlayer.name}
                      onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                      className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2"
                      placeholder="Enter player name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Program Type</label>
                    <select
                      value={newPlayer.program}
                      onChange={(e) => setNewPlayer({ ...newPlayer, program: e.target.value as Program })}
                      className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2"
                    >
                      <option value="3-Day">3-Day Program</option>
                      <option value="5-Day">5-Day Program</option>
                    </select>
                  </div>
                  
                  <Button onClick={handleAddPlayer} className="button-primary">
                    <Plus size={18} className="mr-2" /> Add Player
                  </Button>
                </div>
              </div>
              
              {/* View Players */}
              <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
                <h2 className="text-xl font-bold mb-6">All Players</h2>
                
                <div className="overflow-y-auto max-h-[400px]">
                  <table className="w-full border-collapse">
                    <thead className="sticky top-0 bg-gray-900">
                      <tr>
                        <th className="text-left py-2 px-4 bg-gray-800 rounded-tl-lg">Name</th>
                        <th className="py-2 px-4 bg-gray-800 text-center">Program</th>
                        <th className="py-2 px-4 bg-gray-800 text-center rounded-tr-lg">Classes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {players.map((player) => (
                        <tr key={player.id} className="border-t border-gray-800">
                          <td className="py-3 px-4">{player.name}</td>
                          <td className="py-3 px-4 text-center">{player.program}</td>
                          <td className="py-3 px-4 text-center">{player.attendedClasses}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Tournaments Tab */}
          <TabsContent value="tournaments" className="space-y-8">
            {/* Current Tournament Status */}
            {upcomingTournament && (
              <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-8">
                <h2 className="text-xl font-bold mb-6">Current Tournament</h2>
                
                <div className="bg-black border border-gray-800 rounded-lg p-6">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{upcomingTournament.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-gray-800 px-2 py-0.5 rounded-full text-xs">
                          {upcomingTournament.date}
                        </span>
                        <span className="bg-gray-800 px-2 py-0.5 rounded-full text-xs">
                          {upcomingTournament.matchType}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          upcomingTournament.status === 'cancelled' 
                            ? 'bg-red-900/30 text-red-200' 
                            : 'bg-green-900/30 text-green-200'
                        }`}>
                          {upcomingTournament.status === 'cancelled' ? 'Cancelled' : 'Active'}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-4">{upcomingTournament.description}</p>
                    </div>
                    
                    <div className="mt-4 md:mt-0">
                      {upcomingTournament.status !== 'cancelled' && (
                        <Button 
                          variant="destructive"
                          onClick={() => handleCancelTournament(upcomingTournament.id)}
                          className="flex items-center"
                        >
                          <Trash2 size={16} className="mr-2" /> Cancel Tournament
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Create New Tournament */}
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <h2 className="text-xl font-bold mb-6">Create New Tournament</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Tournament Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Tournament Title*</label>
                    <input
                      type="text"
                      value={tournamentForm.title}
                      onChange={(e) => setTournamentForm({ ...tournamentForm, title: e.target.value })}
                      className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2"
                      placeholder="Enter tournament title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Date*</label>
                    <input
                      type="date"
                      value={tournamentForm.date}
                      onChange={(e) => setTournamentForm({ ...tournamentForm, date: e.target.value })}
                      className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Location*</label>
                    <input
                      type="text"
                      value={tournamentForm.location}
                      onChange={(e) => setTournamentForm({ ...tournamentForm, location: e.target.value })}
                      className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2"
                      placeholder="Enter location"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Match Type*</label>
                    <select
                      value={tournamentForm.matchType}
                      onChange={(e) => setTournamentForm({ ...tournamentForm, matchType: e.target.value })}
                      className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2"
                    >
                      <option value="3v3">3v3</option>
                      <option value="5v5">5v5</option>
                      <option value="1v1">1v1</option>
                    </select>
                  </div>
                </div>
                
                {/* Additional Tournament Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={tournamentForm.description}
                      onChange={(e) => setTournamentForm({ ...tournamentForm, description: e.target.value })}
                      className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 min-h-[80px]"
                      placeholder="Enter tournament description"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Registration Opens*</label>
                      <input
                        type="date"
                        value={tournamentForm.registrationOpen}
                        onChange={(e) => setTournamentForm({ ...tournamentForm, registrationOpen: e.target.value })}
                        className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Registration Closes*</label>
                      <input
                        type="date"
                        value={tournamentForm.registrationClose}
                        onChange={(e) => setTournamentForm({ ...tournamentForm, registrationClose: e.target.value })}
                        className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Age Groups & Required Fields */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Age Groups*</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['U15', 'U16', 'U17', 'U18', 'U19'].map((age) => (
                      <label key={age} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={tournamentForm.ageGroups.includes(age)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setTournamentForm({
                                ...tournamentForm,
                                ageGroups: [...tournamentForm.ageGroups, age]
                              });
                            } else {
                              setTournamentForm({
                                ...tournamentForm,
                                ageGroups: tournamentForm.ageGroups.filter(a => a !== age)
                              });
                            }
                          }}
                          className="rounded accent-baseline-yellow"
                        />
                        <span>{age}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Required Information*</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'Team Name', 
                      'Player Names', 
                      'Age', 
                      'Contact Name',
                      'Phone Number', 
                      'Email', 
                      'Payment Screenshot'
                    ].map((field) => (
                      <label key={field} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={tournamentForm.requiredFields.includes(field)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setTournamentForm({
                                ...tournamentForm,
                                requiredFields: [...tournamentForm.requiredFields, field]
                              });
                            } else {
                              setTournamentForm({
                                ...tournamentForm,
                                requiredFields: tournamentForm.requiredFields.filter(f => f !== field)
                              });
                            }
                          }}
                          className="rounded accent-baseline-yellow"
                        />
                        <span>{field}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Button onClick={handleCreateTournament} className="button-primary">
                  <Award size={18} className="mr-2" /> Create Tournament
                </Button>
              </div>
            </div>
          </TabsContent>
          
          {/* Registrations Tab */}
          <TabsContent value="registrations" className="space-y-8">
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <h2 className="text-xl font-bold mb-6">Tournament Registrations</h2>
              
              {/* Registrations for upcoming tournament */}
              {upcomingTournament && (
                <div className="mb-8 p-4 border border-gray-700 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">{upcomingTournament.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      upcomingTournament.status === 'cancelled' 
                        ? 'bg-red-900 text-red-300' 
                        : 'bg-green-900 text-green-300'
                    }`}>
                      {upcomingTournament.status === 'cancelled' ? 'Cancelled' : 'Registration Open'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-4">Registration closes: {upcomingTournament.registrationClose}</p>
                  
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h4 className="font-medium">Current Registrations</h4>
                        <p className="text-sm text-gray-400">{registrations.length} teams registered</p>
                      </div>
                      
                      <Button 
                        className="flex items-center"
                        onClick={handleExportRegistrations}
                        disabled={registrations.length === 0}
                      >
                        <Download size={16} className="mr-2" /> Export to CSV
                      </Button>
                    </div>
                    
                    {registrations.length > 0 ? (
                      <table className="w-full border-collapse">
                        <thead>
                          <tr>
                            <th className="text-left py-2 px-4">Team Name</th>
                            <th className="text-left py-2 px-4">Contact</th>
                            <th className="text-left py-2 px-4">Age Group</th>
                            <th className="text-left py-2 px-4">Players</th>
                            <th className="text-center py-2 px-4">Payment</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-t border-gray-700">
                            <td className="py-3 px-4">{registrations[0]['Team Name'] || 'N/A'}</td>
                            <td className="py-3 px-4">{registrations[0]['Contact Name'] || 'N/A'}<br/><span className="text-xs text-gray-400">{registrations[0]['Email'] || 'N/A'}</span></td>
                            <td className="py-3 px-4">{registrations[0]['Age Group'] || 'N/A'}</td>
                            <td className="py-3 px-4">{registrations[0]['player_1_name'] ? '1+' : 'N/A'}</td>
                            <td className="py-3 px-4 text-center"><span className="bg-yellow-900 text-yellow-300 px-2 py-0.5 rounded-full text-xs">Pending</span></td>
                          </tr>
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-center text-gray-500 py-4">No registrations yet</p>
                    )}
                  </div>
                </div>
              )}
              
              {/* Past tournament */}
              {pastTournaments.length > 0 && (
                <div className="p-4 border border-gray-700 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">{pastTournaments[0].title}</h3>
                    <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs">Completed</span>
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-4">Date: {pastTournaments[0].date}</p>
                  
                  <Button className="flex items-center">
                    <Download size={16} className="mr-2" /> Download Results
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Announcements Tab */}
          <TabsContent value="announcements" className="space-y-8">
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <h2 className="text-xl font-bold mb-6">Publish Home Page Announcement</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Announcement Text</label>
                  <textarea
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 min-h-[100px]"
                    placeholder="Enter announcement text for the home page..."
                  />
                </div>
                
                <Button onClick={handlePublishAnnouncement} className="button-primary">
                  <Bell size={18} className="mr-2" /> Publish Announcement
                </Button>
                
                <div className="bg-gray-800 p-4 rounded-lg mt-4">
                  <h3 className="text-sm font-medium mb-2">Preview</h3>
                  <div className="border border-gray-700 rounded p-4 bg-black">
                    <p className="text-gray-300">{announcementText || "Your announcement will appear here..."}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Confirmation Dialog */}
      {showConfirmCancel && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg border border-gray-700 max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Cancel Tournament?</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to cancel this tournament? This will remove it from the public view and cannot be undone.
            </p>
            
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => setShowConfirmCancel(false)}
              >
                <X size={18} className="mr-2" /> No, Keep It
              </Button>
              
              <Button 
                variant="destructive" 
                className="w-full" 
                onClick={confirmCancelTournament}
              >
                <Check size={18} className="mr-2" /> Yes, Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoachDashboard;
