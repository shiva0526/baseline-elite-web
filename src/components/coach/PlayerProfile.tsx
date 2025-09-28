import { useState } from 'react';
import { ArrowLeft, User, Star, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Player {
  id: number;
  name: string;
  program: string;
  attendedClasses: number;
  phone: string;
  avatar: string | null;
}

interface PlayerProfileProps {
  player: Player;
  onBack: () => void;
}

interface PlayerStats {
  totalMatches: number;
  wins: number;
  losses: number;
}

interface PerformanceEntry {
  id: string;
  campTitle: string;
  timeRange: string;
  generalRating: number;
  skillsRating: number;
  coachName: string;
  date: string;
  notes: string;
  isShared: boolean;
}

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  readonly?: boolean;
}

// Star Rating Component
const StarRating = ({ rating, maxRating = 5, readonly = true }: StarRatingProps) => {
  return (
    <div className="flex gap-1">
      {[...Array(maxRating)].map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${
            index < rating 
              ? 'fill-baseline-yellow text-baseline-yellow' 
              : 'fill-gray-600 text-gray-600'
          }`}
        />
      ))}
    </div>
  );
};

const PlayerProfile = ({ player, onBack }: PlayerProfileProps) => {
  // Load player stats from localStorage
  const getPlayerStats = (): PlayerStats => {
    const stored = localStorage.getItem(`player_stats_${player.id}`);
    return stored ? JSON.parse(stored) : { totalMatches: 0, wins: 0, losses: 0 };
  };

  const getPlayerPerformance = (): PerformanceEntry[] => {
    const stored = localStorage.getItem(`player_performance_${player.id}`);
    return stored ? JSON.parse(stored) : [
      {
        id: '1',
        campTitle: 'Basketball Annual Camp',
        timeRange: '5:00 PM – 6:15 PM',
        generalRating: 4,
        skillsRating: 3,
        coachName: 'Coach Johnson',
        date: '2024-01-15',
        notes: 'Great improvement in shooting form and defensive stance.',
        isShared: true
      },
      {
        id: '2',
        campTitle: 'Advanced Skills Training',
        timeRange: '4:00 PM – 5:30 PM',
        generalRating: 5,
        skillsRating: 4,
        coachName: 'Coach Smith',
        date: '2024-01-20',
        notes: 'Excellent ball handling skills. Needs work on free throws.',
        isShared: false
      }
    ];
  };

  const [playerStats] = useState<PlayerStats>(getPlayerStats());
  const [performanceEntries] = useState<PerformanceEntry[]>(getPlayerPerformance());
  const [showShared, setShowShared] = useState(true);
  
  // Generate initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Extract age and gender (mock data for now)
  const playerAge = "25"; // Mock data
  const playerGender = "Male"; // Mock data

  return (
    <div className="min-h-screen bg-black">
      {/* Header with back button */}
      <div className="border-b border-white/10 bg-black">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2 text-white hover:text-baseline-yellow hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-white">Player Profile</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Player Info Section */}
        <Card className="mb-6 bg-gradient-to-r from-baseline-yellow/20 to-white/10 border-baseline-yellow/30">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {player.avatar ? (
                  <img
                    src={player.avatar}
                    alt={player.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-baseline-yellow"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-baseline-yellow/20 flex items-center justify-center border-2 border-baseline-yellow">
                    <span className="text-xl font-semibold text-baseline-yellow">
                      {getInitials(player.name)}
                    </span>
                  </div>
                )}
              </div>

              {/* Player Details */}
              <div className="flex-1 space-y-2">
                <h2 className="text-3xl font-bold text-white">{player.name}</h2>
                <div className="flex flex-wrap gap-4 text-gray-300">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {playerAge} Years | {playerGender}
                  </span>
                  <span>Phone: {player.phone}</span>
                  <span>Program: {player.program}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-white/10 border-baseline-yellow/30">
            <TabsTrigger 
              value="stats" 
              className="relative text-white data-[state=active]:bg-baseline-yellow data-[state=active]:text-black data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-gradient-to-r data-[state=active]:after:from-baseline-yellow data-[state=active]:after:to-yellow-400"
            >
              Stats
            </TabsTrigger>
            <TabsTrigger 
              value="performance" 
              className="relative text-white data-[state=active]:bg-baseline-yellow data-[state=active]:text-black data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-gradient-to-r data-[state=active]:after:from-baseline-yellow data-[state=active]:after:to-yellow-400"
            >
              Performance
            </TabsTrigger>
            <TabsTrigger 
              value="attendance" 
              className="relative text-white data-[state=active]:bg-baseline-yellow data-[state=active]:text-black data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-gradient-to-r data-[state=active]:after:from-baseline-yellow data-[state=active]:after:to-yellow-400"
            >
              Attendance
            </TabsTrigger>
          </TabsList>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-6">
            {/* Overall Stats */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Overall Stats</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-white/10 border-white/20">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-baseline-yellow mb-2">
                      {playerStats.totalMatches}
                    </div>
                    <div className="text-sm text-gray-300">Total Matches</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/10 border-white/20">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      {playerStats.wins}
                    </div>
                    <div className="text-sm text-gray-300">Wins</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/10 border-white/20">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-red-400 mb-2">
                      {playerStats.losses}
                    </div>
                    <div className="text-sm text-gray-300">Losses</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Shots Details Section */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Shots Details</h3>
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-8 text-center">
                  <div className="text-gray-300">
                    <div className="text-lg mb-2">No shot statistics available yet</div>
                    <p className="text-sm">Shot statistics will be displayed here once data is available.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            {/* Toggle Button */}
            <div className="flex justify-center mb-6">
              <div className="flex bg-white/10 rounded-lg p-1 border border-white/20">
                <Button
                  variant={showShared ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setShowShared(true)}
                  className={`px-6 py-2 rounded-md transition-all ${
                    showShared 
                      ? 'bg-baseline-yellow text-black shadow-md' 
                      : 'text-white hover:bg-white/10 hover:text-baseline-yellow'
                  }`}
                >
                  Shared
                </Button>
                <Button
                  variant={!showShared ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setShowShared(false)}
                  className={`px-6 py-2 rounded-md transition-all ${
                    !showShared 
                      ? 'bg-baseline-yellow text-black shadow-md' 
                      : 'text-white hover:bg-white/10 hover:text-baseline-yellow'
                  }`}
                >
                  Draft
                </Button>
              </div>
            </div>

            {/* Performance Entries */}
            <div className="space-y-4">
              {performanceEntries
                .filter(entry => entry.isShared === showShared)
                .map((entry) => (
                  <Card key={entry.id} className="bg-white/10 border-white/20 hover:bg-white/15 transition-colors">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <h4 className="text-lg font-semibold text-baseline-yellow">
                              {entry.campTitle}
                            </h4>
                            <p className="text-sm text-gray-300">{entry.timeRange}</p>
                          </div>
                          <Badge variant="outline" className="border-baseline-yellow/50 text-baseline-yellow w-fit">
                            {entry.date}
                          </Badge>
                        </div>

                        {/* Ratings */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-300">General Attributes</span>
                              <StarRating rating={entry.generalRating} />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-300">Skills</span>
                              <StarRating rating={entry.skillsRating} />
                            </div>
                          </div>
                        </div>

                        {/* Notes */}
                        {entry.notes && (
                          <div className="bg-black/30 rounded-lg p-4">
                            <p className="text-sm text-gray-200">{entry.notes}</p>
                          </div>
                        )}

                        {/* Coach Name */}
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <User className="h-4 w-4" />
                          <span>Coach: {entry.coachName}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              
              {performanceEntries.filter(entry => entry.isShared === showShared).length === 0 && (
                <Card className="bg-white/10 border-white/20">
                  <CardContent className="p-8 text-center">
                    <div className="text-gray-300">
                      <div className="text-lg mb-2">
                        No {showShared ? 'shared' : 'draft'} performance entries
                      </div>
                      <p className="text-sm">
                        {showShared 
                          ? 'No shared feedback available yet.' 
                          : 'No draft feedback available yet.'
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Feedback Button */}
            <div className="flex justify-center pt-6">
              <Button 
                className="bg-gradient-to-r from-baseline-yellow to-yellow-400 text-black font-semibold px-8 py-3 rounded-lg hover:shadow-lg hover:shadow-baseline-yellow/20 transition-all"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Add Feedback
              </Button>
            </div>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-baseline-yellow mb-2">
                    {player.attendedClasses}
                  </div>
                  <div className="text-sm text-gray-300">Total Classes Attended</div>
                </div>
                <div className="text-center text-gray-300">
                  <p className="text-sm">Detailed attendance history will be available in future updates.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PlayerProfile;