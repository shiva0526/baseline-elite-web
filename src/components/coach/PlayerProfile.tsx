import { useState } from 'react';
import { ArrowLeft, Trophy, Target, Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Player {
  id: number;
  name: string;
  program: string;
  attendedClasses: number;
  phone: string;
  avatar: string | null;
  age?: number;
  gender?: string;
}

interface PlayerProfileProps {
  player: Player;
  onBack: () => void;
}

const PlayerProfile = ({ player, onBack }: PlayerProfileProps) => {
  const [activeTab, setActiveTab] = useState('stats');

  // Mock stats data
  const playerStats = {
    totalMatches: 0,
    wins: 0,
    losses: 0,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="hover:bg-muted"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Player Profile</h1>
      </div>

      {/* Top Section with Gradient Background */}
      <div className="relative bg-gradient-to-br from-green-500 via-blue-500 to-purple-600 p-6 text-white">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24 border-4 border-white/20">
            <AvatarImage src={player.avatar || ''} alt={player.name} />
            <AvatarFallback className="bg-white/20 text-white text-xl font-semibold">
              {player.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">{player.name}</h2>
            <p className="text-white/80">
              {player.age || 16} Years | {player.gender || 'Male'}
            </p>
            <p className="text-white/80 font-medium">{player.phone}</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-4 pt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50">
            <TabsTrigger 
              value="stats" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              Stats
            </TabsTrigger>
            <TabsTrigger 
              value="performance"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              Performance
            </TabsTrigger>
            <TabsTrigger 
              value="attendance"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              Attendance
            </TabsTrigger>
          </TabsList>

          {/* Stats Tab Content */}
          <TabsContent value="stats" className="mt-6 space-y-6">
            {/* Overall Stats Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Overall Stats</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-2">
                      <Trophy className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-sm text-blue-800">Total Matches</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-blue-900">{playerStats.totalMatches}</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-green-600" />
                      <CardTitle className="text-sm text-green-800">Wins</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-green-900">{playerStats.wins}</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-2">
                      <X className="h-5 w-5 text-red-600" />
                      <CardTitle className="text-sm text-red-800">Loss</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-red-900">{playerStats.losses}</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Shots Details Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Shots Details</h3>
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="space-y-4">
                    <Target className="h-12 w-12 text-muted-foreground mx-auto" />
                    <div>
                      <h4 className="text-lg font-medium text-muted-foreground">No Shot Data Available</h4>
                      <p className="text-sm text-muted-foreground mt-2">
                        Shot statistics will appear here once the player starts participating in matches.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab Content */}
          <TabsContent value="performance" className="mt-6">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="space-y-4">
                  <Trophy className="h-12 w-12 text-muted-foreground mx-auto" />
                  <div>
                    <h4 className="text-lg font-medium text-muted-foreground">Performance Data Coming Soon</h4>
                    <p className="text-sm text-muted-foreground mt-2">
                      Detailed performance analytics will be available here.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendance Tab Content */}
          <TabsContent value="attendance" className="mt-6">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="space-y-4">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto" />
                  <div>
                    <h4 className="text-lg font-medium text-muted-foreground">Attendance Tracking</h4>
                    <p className="text-sm text-muted-foreground mt-2">
                      Classes attended: {player.attendedClasses}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Program: {player.program}
                    </p>
                  </div>
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