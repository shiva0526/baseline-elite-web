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
  Check,
  Menu,
  Clock,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from 'framer-motion';

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

interface Announcement {
  id: number;
  text: string;
  duration: '24hours' | '48hours' | 'manual';
  createdAt: number;
  expiresAt?: number;
}

const CoachDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [newPlayer, setNewPlayer] = useState({ name: '', program: '3-Day' as Program });
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementDuration, setAnnouncementDuration] = useState<'24hours' | '48hours' | 'manual'>('24hours');
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Announcement | null>(null);
  const [upcomingTournament, setUpcomingTournament] = useState<Tournament | null>(null);
  const [pastTournaments, setPastTournaments] = useState<Tournament[]>([]);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [tournamentToCancel, setTournamentToCancel] = useState<number | null>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [playerToRemove, setPlayerToRemove] = useState<Player | null>(null);
  
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
  
  // Load tournaments and announcements on component mount
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
    
    // Load current announcement
    const storedAnnouncement = localStorage.getItem('currentAnnouncement');
    if (storedAnnouncement) {
      const announcement = JSON.parse(storedAnnouncement);
      const now = Date.now();
      
      // Check if announcement has expired
      if (announcement.expiresAt && now > announcement.expiresAt) {
        localStorage.removeItem('currentAnnouncement');
        localStorage.removeItem('announcement');
      } else {
        setCurrentAnnouncement(announcement);
      }
    }
    
    // Listen for storage events to update data in real time
    const handleStorageChange = () => {
      const registrationsData = localStorage.getItem('tournamentRegistrations');
      if (registrationsData) {
        setRegistrations(JSON.parse(registrationsData));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // Check for expired announcements periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentAnnouncement && currentAnnouncement.expiresAt) {
        const now = Date.now();
        if (now > currentAnnouncement.expiresAt) {
          setCurrentAnnouncement(null);
          localStorage.removeItem('currentAnnouncement');
          localStorage.removeItem('announcement');
          window.dispatchEvent(new Event('storage'));
        }
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [currentAnnouncement]);
  
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
        const updatedAttendance = attendance[playerId] || [];
        const isDayPresent = updatedAttendance.includes(day);
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

  const handleRemovePlayer = (player: Player) => {
    setPlayerToRemove(player);
    setShowRemoveConfirm(true);
  };

  const confirmRemovePlayer = () => {
    if (!playerToRemove) return;

    setPlayers(prev => prev.filter(p => p.id !== playerToRemove.id));
    
    setAttendance(prev => {
      const { [playerToRemove.id]: removed, ...rest } = prev;
      return rest;
    });

    toast({
      title: "Player removed",
      description: `${playerToRemove.name} has been removed from the program.`,
    });

    setShowRemoveConfirm(false);
    setPlayerToRemove(null);
  };

  const cancelRemovePlayer = () => {
    setShowRemoveConfirm(false);
    setPlayerToRemove(null);
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
    
    const now = Date.now();
    let expiresAt;
    
    switch (announcementDuration) {
      case '24hours':
        expiresAt = now + (24 * 60 * 60 * 1000);
        break;
      case '48hours':
        expiresAt = now + (48 * 60 * 60 * 1000);
        break;
      case 'manual':
        expiresAt = undefined;
        break;
    }
    
    const announcement: Announcement = {
      id: now,
      text: announcementText,
      duration: announcementDuration,
      createdAt: now,
      expiresAt
    };
    
    // Save announcement
    localStorage.setItem('announcement', announcementText);
    localStorage.setItem('currentAnnouncement', JSON.stringify(announcement));
    setCurrentAnnouncement(announcement);
    
    toast({
      title: "Announcement published",
      description: `The announcement has been published and will ${
        announcementDuration === 'manual' 
          ? 'remain until manually canceled' 
          : `expire in ${announcementDuration === '24hours' ? '24' : '48'} hours`
      }.`,
    });
    
    setAnnouncementText('');
    window.dispatchEvent(new Event('storage'));
  };
  
  const handleCancelAnnouncement = () => {
    setCurrentAnnouncement(null);
    localStorage.removeItem('currentAnnouncement');
    localStorage.removeItem('announcement');
    window.dispatchEvent(new Event('storage'));
    
    toast({
      title: "Announcement canceled",
      description: "The announcement has been removed from the homepage.",
    });
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
    
    // Trigger storage event to update other components
    window.dispatchEvent(new Event('storage'));
    
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
      
      // Trigger storage event to update other components
      window.dispatchEvent(new Event('storage'));
      
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
    
    // Filter registrations for the current tournament
    const currentTournamentRegistrations = registrations.filter(
      reg => reg.tournamentId === upcomingTournament?.id
    );
    
    if (currentTournamentRegistrations.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no registrations for this tournament yet.",
        variant: "destructive"
      });
      return;
    }
    
    // Define ordered headers for better CSV structure
    const orderedHeaders = [
      'Team Name',
      'Captain First Name',
      'Captain Last Name',
      'Player 2 First Name',
      'Player 2 Last Name',
      'Player 3 First Name',
      'Player 3 Last Name',
      'Player 4 First Name',
      'Player 4 Last Name',
      'Player 5 First Name',
      'Player 5 Last Name',
      'Substitute 1 First Name',
      'Substitute 1 Last Name',
      'Substitute 2 First Name',
      'Substitute 2 Last Name',
      'Substitute 3 First Name',
      'Substitute 3 Last Name',
      'Email',
      'Phone Number',
      'Any Questions?',
      'Registration Date'
    ];
    
    // Create CSV content with proper escaping
    const escapeCSVField = (field: any) => {
      if (field === null || field === undefined) return '';
      const str = String(field);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };
    
    const headers = orderedHeaders.join(',');
    const rows = currentTournamentRegistrations.map(reg => 
      orderedHeaders.map(header => escapeCSVField(reg[header] || '')).join(',')
    );
    
    const csvContent = [headers, ...rows].join('\n');
    
    // Create and trigger download with tournament name
    const tournamentName = upcomingTournament?.title.replace(/[^a-zA-Z0-9]/g, '_') || 'tournament';
    const filename = `${tournamentName}_registrations_${new Date().toISOString().slice(0, 10)}.csv`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export successful",
      description: `${currentTournamentRegistrations.length} tournament registrations exported to CSV.`,
    });
  };
  
  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/login');
  };
  
  // Filter players by program
  const threeDayPlayers = players.filter(p => p.program === '3-Day');
  const fiveDayPlayers = players.filter(p => p.program === '5-Day');

  const formatTimeRemaining = (expiresAt: number) => {
    const now = Date.now();
    const timeLeft = expiresAt - now;
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Dashboard Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/80 backdrop-blur-lg border-b border-gray-800/50 sticky top-0 z-30"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden mr-2 text-gray-300 hover:text-white"
              >
                <Menu size={20} />
              </Button>
              <img src="/images/Logo-Baseline-copy.png" alt="BaseLine Academy" className="h-12 mr-4" />
              <div>
                <h1 className="text-xl font-bold">Coach Dashboard</h1>
                <p className="text-sm text-gray-400">Manage your academy</p>
              </div>
            </div>
            
            <Button variant="ghost" onClick={handleLogout} className="text-gray-300 hover:text-white">
              <LogOut size={18} className="mr-2" /> Logout
            </Button>
          </div>
        </div>
      </motion.header>
      
      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="attendance" className="w-full">
          {/* Mobile Navigation */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:hidden mb-6"
          >
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="attendance" className="text-xs">
                <Calendar className="mr-1 h-3 w-3" /> Attendance
              </TabsTrigger>
              <TabsTrigger value="players" className="text-xs">
                <Users className="mr-1 h-3 w-3" /> Players
              </TabsTrigger>
            </TabsList>
            <TabsList className="grid grid-cols-3 w-full mt-2">
              <TabsTrigger value="tournaments" className="text-xs">
                <Award className="mr-1 h-3 w-3" /> Tournaments
              </TabsTrigger>
              <TabsTrigger value="registrations" className="text-xs">
                <FileSpreadsheet className="mr-1 h-3 w-3" /> Registrations
              </TabsTrigger>
              <TabsTrigger value="announcements" className="text-xs">
                <Bell className="mr-1 h-3 w-3" /> Announcements
              </TabsTrigger>
            </TabsList>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden lg:block"
          >
            <TabsList className="grid grid-cols-5 w-full mb-8 bg-gray-900/50 backdrop-blur-sm">
              <TabsTrigger value="attendance" className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" /> Attendance
              </TabsTrigger>
              <TabsTrigger value="players" className="flex items-center">
                <Users className="mr-2 h-4 w-4" /> Players
              </TabsTrigger>
              <TabsTrigger value="tournaments" className="flex items-center">
                <Award className="mr-2 h-4 w-4" /> Tournaments
              </TabsTrigger>
              <TabsTrigger value="registrations" className="flex items-center">
                <FileSpreadsheet className="mr-2 h-4 w-4" /> Registrations
              </TabsTrigger>
              <TabsTrigger value="announcements" className="flex items-center">
                <Bell className="mr-2 h-4 w-4" /> Announcements
              </TabsTrigger>
            </TabsList>
          </motion.div>
          
          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/40 backdrop-blur-lg rounded-xl border border-gray-800/50 p-6 shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-6 text-baseline-yellow">Weekly Attendance Tracker</h2>
              
              {/* 3-Day Program */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-baseline-yellow flex items-center">
                  <div className="w-3 h-3 bg-baseline-yellow rounded-full mr-2"></div>
                  3-Day Program
                </h3>
                
                <div className="overflow-x-auto rounded-lg border border-gray-800/50">
                  <table className="w-full border-collapse bg-gray-900/30">
                    <thead>
                      <tr>
                        <th className="text-left py-3 px-4 bg-gray-800/50 font-medium">Player Name</th>
                        {weekdays.map((day) => (
                          <th key={day} className="py-3 px-4 bg-gray-800/50 text-center font-medium text-sm">{day}</th>
                        ))}
                        <th className="py-3 px-4 bg-gray-800/50 text-center font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {threeDayPlayers.length > 0 ? (
                        threeDayPlayers.map((player) => (
                          <motion.tr 
                            key={player.id} 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="border-t border-gray-800/30 hover:bg-gray-800/20 transition-colors"
                          >
                            <td className="py-3 px-4 font-medium">{player.name}</td>
                            {weekdays.map((day) => (
                              <td key={`${player.id}-${day}`} className="py-3 px-4 text-center">
                                <input
                                  type="checkbox"
                                  checked={attendance[player.id]?.includes(day) || false}
                                  onChange={() => handleAttendanceChange(player.id, day)}
                                  className="h-5 w-5 rounded accent-baseline-yellow cursor-pointer transition-transform hover:scale-110"
                                />
                              </td>
                            ))}
                            <td className="py-3 px-4 text-center font-bold text-baseline-yellow">
                              {attendance[player.id]?.length || 0}
                            </td>
                          </motion.tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-gray-400">
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
                <h3 className="text-lg font-semibold mb-4 text-baseline-yellow flex items-center">
                  <div className="w-3 h-3 bg-baseline-yellow rounded-full mr-2"></div>
                  5-Day Program
                </h3>
                
                <div className="overflow-x-auto rounded-lg border border-gray-800/50">
                  <table className="w-full border-collapse bg-gray-900/30">
                    <thead>
                      <tr>
                        <th className="text-left py-3 px-4 bg-gray-800/50 font-medium">Player Name</th>
                        {weekdays.map((day) => (
                          <th key={day} className="py-3 px-4 bg-gray-800/50 text-center font-medium text-sm">{day}</th>
                        ))}
                        <th className="py-3 px-4 bg-gray-800/50 text-center font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fiveDayPlayers.length > 0 ? (
                        fiveDayPlayers.map((player) => (
                          <motion.tr 
                            key={player.id} 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="border-t border-gray-800/30 hover:bg-gray-800/20 transition-colors"
                          >
                            <td className="py-3 px-4 font-medium">{player.name}</td>
                            {weekdays.map((day) => (
                              <td key={`${player.id}-${day}`} className="py-3 px-4 text-center">
                                <input
                                  type="checkbox"
                                  checked={attendance[player.id]?.includes(day) || false}
                                  onChange={() => handleAttendanceChange(player.id, day)}
                                  className="h-5 w-5 rounded accent-baseline-yellow cursor-pointer transition-transform hover:scale-110"
                                />
                              </td>
                            ))}
                            <td className="py-3 px-4 text-center font-bold text-baseline-yellow">
                              {attendance[player.id]?.length || 0}
                            </td>
                          </motion.tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-gray-400">
                            No players in the 5-Day Program
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button className="bg-baseline-yellow text-black hover:bg-baseline-yellow/90 transition-all duration-200">
                  Save Attendance
                </Button>
                
                <Button variant="outline" className="border-gray-600 hover:bg-gray-800">
                  Reset Weekly Attendance
                </Button>
              </div>
            </motion.div>
          </TabsContent>
          
          {/* Players Tab */}
          <TabsContent value="players" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Add New Player */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-900/40 backdrop-blur-lg rounded-xl border border-gray-800/50 p-6 shadow-2xl"
              >
                <h2 className="text-xl font-bold mb-6 text-baseline-yellow">Add New Player</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Player Name</label>
                    <input
                      type="text"
                      value={newPlayer.name}
                      onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                      className="w-full rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm px-4 py-3 focus:border-baseline-yellow focus:ring-1 focus:ring-baseline-yellow transition-all"
                      placeholder="Enter player name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Program Type</label>
                    <select
                      value={newPlayer.program}
                      onChange={(e) => setNewPlayer({ ...newPlayer, program: e.target.value as Program })}
                      className="w-full rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm px-4 py-3 focus:border-baseline-yellow focus:ring-1 focus:ring-baseline-yellow transition-all"
                    >
                      <option value="3-Day">3-Day Program</option>
                      <option value="5-Day">5-Day Program</option>
                    </select>
                  </div>
                  
                  <Button onClick={handleAddPlayer} className="w-full bg-baseline-yellow text-black hover:bg-baseline-yellow/90 transition-all duration-200">
                    <Plus size={18} className="mr-2" /> Add Player
                  </Button>
                </div>
              </motion.div>
              
              {/* Player Management */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-900/40 backdrop-blur-lg rounded-xl border border-gray-800/50 p-6 shadow-2xl"
              >
                <h2 className="text-xl font-bold mb-6 text-baseline-yellow">Player Management</h2>
                
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  <AnimatePresence mode="popLayout">
                    {players.map((player) => (
                      <motion.div
                        key={player.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
                        layout
                        className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4 hover:bg-gray-800/50 transition-all duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-white mb-1">{player.name}</h3>
                            <div className="flex items-center space-x-3 text-sm text-gray-400">
                              <span className="px-2 py-1 bg-baseline-yellow/20 text-baseline-yellow rounded-full text-xs">
                                {player.program}
                              </span>
                              <span className="flex items-center">
                                <User size={12} className="mr-1" />
                                ID: {player.id}
                              </span>
                              <span className="flex items-center">
                                <CheckCircle size={12} className="mr-1" />
                                {player.attendedClasses} classes
                              </span>
                            </div>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemovePlayer(player)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 hover:scale-105"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {players.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      <Users size={48} className="mx-auto mb-4 opacity-50" />
                      <p>No players added yet</p>
                      <p className="text-sm">Add your first player to get started!</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </TabsContent>
          
          {/* Tournaments Tab */}
          <TabsContent value="tournaments" className="space-y-8">
            {/* Current Tournament Status */}
            {upcomingTournament && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900/40 backdrop-blur-lg rounded-xl border border-gray-800/50 p-6 shadow-2xl mb-8"
              >
                <h2 className="text-xl font-bold mb-6 text-baseline-yellow">Current Tournament</h2>
                
                <div className="bg-black/30 border border-gray-800/50 rounded-lg p-6">
                  <div className="flex flex-col lg:flex-row justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{upcomingTournament.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-gray-800/50 px-3 py-1 rounded-full text-xs backdrop-blur-sm">
                          {upcomingTournament.date}
                        </span>
                        <span className="bg-gray-800/50 px-3 py-1 rounded-full text-xs backdrop-blur-sm">
                          {upcomingTournament.matchType}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs backdrop-blur-sm ${
                          upcomingTournament.status === 'cancelled' 
                            ? 'bg-red-900/30 text-red-200 border border-red-800/50' 
                            : 'bg-green-900/30 text-green-200 border border-green-800/50'
                        }`}>
                          {upcomingTournament.status === 'cancelled' ? 'Cancelled' : 'Active'}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-4">{upcomingTournament.description}</p>
                    </div>
                    
                    <div className="mt-4 lg:mt-0">
                      {upcomingTournament.status !== 'cancelled' && (
                        <Button 
                          variant="destructive"
                          onClick={() => handleCancelTournament(upcomingTournament.id)}
                          className="flex items-center bg-red-600 hover:bg-red-700"
                        >
                          <Trash2 size={16} className="mr-2" /> Cancel Tournament
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Create New Tournament */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/40 backdrop-blur-lg rounded-xl border border-gray-800/50 p-6 shadow-2xl"
            >
              <h2 className="text-xl font-bold mb-6 text-baseline-yellow">Create New Tournament</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Tournament Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Tournament Title*</label>
                    <input
                      type="text"
                      value={tournamentForm.title}
                      onChange={(e) => setTournamentForm({ ...tournamentForm, title: e.target.value })}
                      className="w-full rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm px-4 py-3 focus:border-baseline-yellow focus:ring-1 focus:ring-baseline-yellow transition-all"
                      placeholder="Enter tournament title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Date*</label>
                    <input
                      type="date"
                      value={tournamentForm.date}
                      onChange={(e) => setTournamentForm({ ...tournamentForm, date: e.target.value })}
                      className="w-full rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm px-4 py-3 focus:border-baseline-yellow focus:ring-1 focus:ring-baseline-yellow transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Location*</label>
                    <input
                      type="text"
                      value={tournamentForm.location}
                      onChange={(e) => setTournamentForm({ ...tournamentForm, location: e.target.value })}
                      className="w-full rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm px-4 py-3 focus:border-baseline-yellow focus:ring-1 focus:ring-baseline-yellow transition-all"
                      placeholder="Enter location"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Match Type*</label>
                    <select
                      value={tournamentForm.matchType}
                      onChange={(e) => setTournamentForm({ ...tournamentForm, matchType: e.target.value })}
                      className="w-full rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm px-4 py-3 focus:border-baseline-yellow focus:ring-1 focus:ring-baseline-yellow transition-all"
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
                    <label className="block text-sm font-medium mb-2 text-gray-300">Description</label>
                    <textarea
                      value={tournamentForm.description}
                      onChange={(e) => setTournamentForm({ ...tournamentForm, description: e.target.value })}
                      className="w-full rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm px-4 py-3 min-h-[80px] focus:border-baseline-yellow focus:ring-1 focus:ring-baseline-yellow transition-all resize-none"
                      placeholder="Enter tournament description"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Registration Opens*</label>
                      <input
                        type="date"
                        value={tournamentForm.registrationOpen}
                        onChange={(e) => setTournamentForm({ ...tournamentForm, registrationOpen: e.target.value })}
                        className="w-full rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm px-4 py-3 focus:border-baseline-yellow focus:ring-1 focus:ring-baseline-yellow transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Registration Closes*</label>
                      <input
                        type="date"
                        value={tournamentForm.registrationClose}
                        onChange={(e) => setTournamentForm({ ...tournamentForm, registrationClose: e.target.value })}
                        className="w-full rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm px-4 py-3 focus:border-baseline-yellow focus:ring-1 focus:ring-baseline-yellow transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Age Groups & Required Fields */}
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-3 text-gray-300">Age Groups*</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['U15', 'U16', 'U17', 'U18', 'U19'].map((age) => (
                      <label key={age} className="flex items-center space-x-2 cursor-pointer">
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
                        <span className="text-sm">{age}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-3 text-gray-300">Required Information*</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      'Team Name', 
                      'Player Names', 
                      'Age', 
                      'Contact Name',
                      'Phone Number', 
                      'Email', 
                      'Payment Screenshot'
                    ].map((field) => (
                      <label key={field} className="flex items-center space-x-2 cursor-pointer">
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
                        <span className="text-sm">{field}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Button onClick={handleCreateTournament} className="bg-baseline-yellow text-black hover:bg-baseline-yellow/90 transition-all duration-200">
                  <Award size={18} className="mr-2" /> Create Tournament
                </Button>
              </div>
            </motion.div>
          </TabsContent>
          
          {/* Registrations Tab */}
          <TabsContent value="registrations" className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/40 backdrop-blur-lg rounded-xl border border-gray-800/50 p-6 shadow-2xl"
            >
              <h2 className="text-xl font-bold mb-6 text-baseline-yellow">Tournament Registrations</h2>
              
              {/* Registrations for upcoming tournament */}
              {upcomingTournament && (
                <div className="mb-8 p-6 border border-gray-700/50 rounded-lg bg-gray-800/20 backdrop-blur-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <h3 className="text-lg font-semibold mb-2 sm:mb-0">{upcomingTournament.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs backdrop-blur-sm ${
                      upcomingTournament.status === 'cancelled' 
                        ? 'bg-red-900/50 text-red-300 border border-red-800/50' 
                        : 'bg-green-900/50 text-green-300 border border-green-800/50'
                    }`}>
                      {upcomingTournament.status === 'cancelled' ? 'Cancelled' : 'Registration Open'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-4">Registration closes: {upcomingTournament.registrationClose}</p>
                  
                  <div className="bg-gray-800/30 p-4 rounded-lg backdrop-blur-sm border border-gray-700/50">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                      <div>
                        <h4 className="font-medium">Current Registrations</h4>
                        <p className="text-sm text-gray-400">{registrations.length} teams registered</p>
                      </div>
                      
                      <Button 
                        className="mt-2 sm:mt-0 flex items-center bg-baseline-yellow text-black hover:bg-baseline-yellow/90"
                        onClick={handleExportRegistrations}
                        disabled={registrations.length === 0}
                      >
                        <Download size={16} className="mr-2" /> Export to CSV
                      </Button>
                    </div>
                    
                    {registrations.length > 0 ? (
                      <div className="overflow-x-auto rounded-lg border border-gray-700/50">
                        <table className="w-full border-collapse bg-gray-900/30">
                          <thead>
                            <tr className="bg-gray-800/50">
                              <th className="text-left py-3 px-4 font-medium">Team Name</th>
                              <th className="text-left py-3 px-4 font-medium">Contact</th>
                              <th className="text-left py-3 px-4 font-medium">Age Group</th>
                              <th className="text-left py-3 px-4 font-medium">Players</th>
                              <th className="text-center py-3 px-4 font-medium">Payment</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-t border-gray-700/30 hover:bg-gray-800/20 transition-colors">
                              <td className="py-3 px-4">{registrations[0]['Team Name'] || 'N/A'}</td>
                              <td className="py-3 px-4">
                                {registrations[0]['Contact Name'] || 'N/A'}
                                <br/>
                                <span className="text-xs text-gray-400">{registrations[0]['Email'] || 'N/A'}</span>
                              </td>
                              <td className="py-3 px-4">{registrations[0]['Age Group'] || 'N/A'}</td>
                              <td className="py-3 px-4">{registrations[0]['player_1_name'] ? '1+' : 'N/A'}</td>
                              <td className="py-3 px-4 text-center">
                                <span className="bg-yellow-900/50 text-yellow-300 px-2 py-1 rounded-full text-xs border border-yellow-800/50">
                                  Pending
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-8">No registrations yet</p>
                    )}
                  </div>
                </div>
              )}
              
              {/* Past tournament */}
              {pastTournaments.length > 0 && (
                <div className="p-6 border border-gray-700/50 rounded-lg bg-gray-800/20 backdrop-blur-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <h3 className="text-lg font-semibold mb-2 sm:mb-0">{pastTournaments[0].title}</h3>
                    <span className="bg-gray-700/50 text-gray-300 px-3 py-1 rounded-full text-xs backdrop-blur-sm border border-gray-600/50">
                      Completed
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-4">Date: {pastTournaments[0].date}</p>
                  
                  <Button className="flex items-center bg-baseline-yellow text-black hover:bg-baseline-yellow/90">
                    <Download size={16} className="mr-2" /> Download Results
                  </Button>
                </div>
              )}
            </motion.div>
          </TabsContent>
          
          {/* Announcements Tab */}
          <TabsContent value="announcements" className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/40 backdrop-blur-lg rounded-xl border border-gray-800/50 p-6 shadow-2xl"
            >
              <h2 className="text-xl font-bold mb-6 text-baseline-yellow">Manage Announcements</h2>
              
              {/* Current Announcement Status */}
              {currentAnnouncement && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-4 border border-green-800/50 rounded-lg bg-green-900/20 backdrop-blur-sm"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <CheckCircle size={16} className="text-green-400 mr-2" />
                        <span className="text-green-400 font-medium text-sm">Active Announcement</span>
                      </div>
                      <p className="text-gray-300 mb-2">{currentAnnouncement.text}</p>
                      {currentAnnouncement.expiresAt && (
                        <p className="text-xs text-gray-400 flex items-center">
                          <Clock size={12} className="mr-1" />
                          {formatTimeRemaining(currentAnnouncement.expiresAt)}
                        </p>
                      )}
                      {currentAnnouncement.duration === 'manual' && (
                        <p className="text-xs text-gray-400 flex items-center">
                          <Clock size={12} className="mr-1" />
                          Active until manually canceled
                        </p>
                      )}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleCancelAnnouncement}
                      className="mt-2 sm:mt-0 border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                    >
                      Cancel Now
                    </Button>
                  </div>
                </motion.div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Announcement Text</label>
                  <textarea
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm px-4 py-3 min-h-[100px] focus:border-baseline-yellow focus:ring-1 focus:ring-baseline-yellow transition-all resize-none"
                    placeholder="Enter announcement text for the home page..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-3 text-gray-300">Display Duration</label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        value="24hours"
                        checked={announcementDuration === '24hours'}
                        onChange={(e) => setAnnouncementDuration(e.target.value as '24hours' | '48hours' | 'manual')}
                        className="accent-baseline-yellow"
                      />
                      <span className="text-sm">Show for 24 hours</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        value="48hours"
                        checked={announcementDuration === '48hours'}
                        onChange={(e) => setAnnouncementDuration(e.target.value as '24hours' | '48hours' | 'manual')}
                        className="accent-baseline-yellow"
                      />
                      <span className="text-sm">Show for 48 hours</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        value="manual"
                        checked={announcementDuration === 'manual'}
                        onChange={(e) => setAnnouncementDuration(e.target.value as '24hours' | '48hours' | 'manual')}
                        className="accent-baseline-yellow"
                      />
                      <span className="text-sm">Show until manually canceled</span>
                    </label>
                  </div>
                </div>
                
                <Button onClick={handlePublishAnnouncement} className="bg-baseline-yellow text-black hover:bg-baseline-yellow/90 transition-all duration-200">
                  <Bell size={18} className="mr-2" /> Publish Announcement
                </Button>
                
                <div className="bg-gray-800/30 p-4 rounded-lg mt-6 backdrop-blur-sm border border-gray-700/50">
                  <h3 className="text-sm font-medium mb-3 text-gray-300">Preview</h3>
                  <div className="border border-gray-700/50 rounded-lg p-4 bg-black/30 backdrop-blur-sm">
                    <p className="text-gray-300">{announcementText || "Your announcement will appear here..."}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Remove Player Confirmation Dialog */}
      <AnimatePresence>
        {showRemoveConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-gray-900/90 backdrop-blur-lg rounded-xl border border-gray-700/50 max-w-md w-full p-6 shadow-2xl"
            >
              <div className="text-center mb-6">
                <div className="mx-auto mb-4 w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                  <Trash2 size={24} className="text-red-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Remove Player?</h3>
                <p className="text-gray-300">
                  Are you sure you want to remove{' '}
                  <span className="font-semibold text-baseline-yellow">
                    {playerToRemove?.name}
                  </span>{' '}
                  from the program? This action cannot be undone.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 border-gray-600 hover:bg-gray-800" 
                  onClick={cancelRemovePlayer}
                >
                  <X size={18} className="mr-2" /> Cancel
                </Button>
                
                <Button 
                  variant="destructive" 
                  className="flex-1 bg-red-600 hover:bg-red-700" 
                  onClick={confirmRemovePlayer}
                >
                  <Check size={18} className="mr-2" /> Remove Player
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmCancel && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-gray-900/90 backdrop-blur-lg rounded-xl border border-gray-700/50 max-w-md w-full p-6 shadow-2xl"
            >
              <h3 className="text-xl font-bold mb-4">Cancel Tournament?</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to cancel this tournament? This will remove it from the public view and cannot be undone.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 border-gray-600 hover:bg-gray-800" 
                  onClick={() => setShowConfirmCancel(false)}
                >
                  <X size={18} className="mr-2" /> No, Keep It
                </Button>
                
                <Button 
                  variant="destructive" 
                  className="flex-1 bg-red-600 hover:bg-red-700" 
                  onClick={confirmCancelTournament}
                >
                  <Check size={18} className="mr-2" /> Yes, Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CoachDashboard;
