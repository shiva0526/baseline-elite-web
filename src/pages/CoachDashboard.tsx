
import { useState } from 'react';
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
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data for players
const initialPlayers = [
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
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [newPlayer, setNewPlayer] = useState({ name: '', program: '3-Day' as Program });
  const [announcementText, setAnnouncementText] = useState('');
  
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
  };
  
  const handlePublishAnnouncement = () => {
    if (!announcementText) return;
    // This would typically store the announcement to be shown on the home page
    alert(`Announcement published: ${announcementText}`);
    setAnnouncementText('');
  };
  
  const handleCreateTournament = () => {
    // This would typically save the tournament data
    alert('Tournament created successfully!');
  };
  
  const handleLogout = () => {
    // Clear any auth state/tokens
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
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <h2 className="text-xl font-bold mb-6">Create New Tournament</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Tournament Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Tournament Title</label>
                    <input
                      type="text"
                      value={tournamentForm.title}
                      onChange={(e) => setTournamentForm({ ...tournamentForm, title: e.target.value })}
                      className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2"
                      placeholder="Enter tournament title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <input
                      type="date"
                      value={tournamentForm.date}
                      onChange={(e) => setTournamentForm({ ...tournamentForm, date: e.target.value })}
                      className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Location</label>
                    <input
                      type="text"
                      value={tournamentForm.location}
                      onChange={(e) => setTournamentForm({ ...tournamentForm, location: e.target.value })}
                      className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2"
                      placeholder="Enter location"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Match Type</label>
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
                      <label className="block text-sm font-medium mb-1">Registration Opens</label>
                      <input
                        type="date"
                        value={tournamentForm.registrationOpen}
                        onChange={(e) => setTournamentForm({ ...tournamentForm, registrationOpen: e.target.value })}
                        className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Registration Closes</label>
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
                  <label className="block text-sm font-medium mb-1">Age Groups</label>
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
                  <label className="block text-sm font-medium mb-1">Required Information</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'Team Name', 
                      'Player Names', 
                      'Player Ages', 
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
              
              {/* Mock tournament with registrations */}
              <div className="mb-8 p-4 border border-gray-700 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">BaseLine Summer Championship</h3>
                  <span className="bg-green-900 text-green-300 px-3 py-1 rounded-full text-xs">Registration Open</span>
                </div>
                
                <p className="text-sm text-gray-400 mb-4">Registration closes: June 10, 2025</p>
                
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h4 className="font-medium">Current Registrations</h4>
                      <p className="text-sm text-gray-400">8 teams registered</p>
                    </div>
                    
                    <Button className="flex items-center">
                      <Download size={16} className="mr-2" /> Export to Excel
                    </Button>
                  </div>
                  
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
                        <td className="py-3 px-4">Baseline Ballers</td>
                        <td className="py-3 px-4">John Doe<br/><span className="text-xs text-gray-400">john@example.com</span></td>
                        <td className="py-3 px-4">U17</td>
                        <td className="py-3 px-4">5</td>
                        <td className="py-3 px-4 text-center"><span className="bg-green-900 text-green-300 px-2 py-0.5 rounded-full text-xs">Paid</span></td>
                      </tr>
                      <tr className="border-t border-gray-700">
                        <td className="py-3 px-4">Slam Dunkers</td>
                        <td className="py-3 px-4">Jane Smith<br/><span className="text-xs text-gray-400">jane@example.com</span></td>
                        <td className="py-3 px-4">U15</td>
                        <td className="py-3 px-4">4</td>
                        <td className="py-3 px-4 text-center"><span className="bg-yellow-900 text-yellow-300 px-2 py-0.5 rounded-full text-xs">Pending</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Past tournament */}
              <div className="p-4 border border-gray-700 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Winter Elite Showdown</h3>
                  <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs">Completed</span>
                </div>
                
                <p className="text-sm text-gray-400 mb-4">Date: December 10, 2024</p>
                
                <Button className="flex items-center">
                  <Download size={16} className="mr-2" /> Download Results
                </Button>
              </div>
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
    </div>
  );
};

export default CoachDashboard;
