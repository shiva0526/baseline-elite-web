
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Users, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TournamentRegistrationForm from '@/components/tournaments/TournamentRegistrationForm';
import { supabase } from '@/integrations/supabase/client';

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

const Tournaments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [upcomingTournament, setUpcomingTournament] = useState<Tournament | null>(null);
  const [pastTournaments, setPastTournaments] = useState<Tournament[]>([]);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load tournament data
    const fetchTournaments = () => {
      setIsLoading(true);
      
      try {
        // Mock upcoming tournament data - you can replace this with Supabase data later
        const mockUpcoming: Tournament = {
          id: 1,
          title: "BaseLine Summer Championship 2025",
          date: "2025-07-15",
          location: "BaseLine Elite Center",
          description: "Join our premier summer tournament featuring competitive matches across all age groups. This tournament will showcase the best talent from our academy and visiting teams.",
          matchType: "5v5",
          ageGroups: ["U-12", "U-14", "U-16", "U-18"],
          registrationOpen: "2025-06-01",
          registrationClose: "2025-07-10",
          requiredFields: [
            "Team Name",
            "Captain First Name",
            "Captain Last Name", 
            "Player 2 First Name",
            "Player 2 Last Name",
            "Player 3 First Name", 
            "Player 3 Last Name",
            "Player 4 First Name",
            "Player 4 Last Name",
            "Player 5 First Name",
            "Player 5 Last Name",
            "Substitute 1 First Name",
            "Substitute 1 Last Name",
            "Substitute 2 First Name", 
            "Substitute 2 Last Name",
            "Substitute 3 First Name",
            "Substitute 3 Last Name",
            "Email",
            "Phone Number",
            "Team Logo",
            "Any Questions?"
          ],
          status: 'upcoming'
        };

        const mockPast: Tournament[] = [
          {
            id: 2,
            title: "Winter Elite Showdown",
            date: "2024-12-10",
            location: "BaseLine Elite Center",
            description: "Our winter championship brought together the best young talent in competitive basketball.",
            matchType: "5v5",
            ageGroups: ["U-14", "U-16"],
            registrationOpen: "2024-11-01",
            registrationClose: "2024-12-01",
            requiredFields: ["player_name", "age"],
            status: 'completed'
          },
          {
            id: 3,
            title: "Spring Skills Tournament",
            date: "2024-04-20",
            location: "BaseLine Elite Center",
            description: "A skills-focused tournament emphasizing fundamentals and technique.",
            matchType: "3v3",
            ageGroups: ["U-12", "U-14"],
            registrationOpen: "2024-03-01",
            registrationClose: "2024-04-10",
            requiredFields: ["player_name", "age"],
            status: 'completed'
          }
        ];

        // Add more upcoming tournaments for testing
        const allTournaments = [
          mockUpcoming,
          {
            id: 4,
            title: "Winter Elite Championship 2025",
            date: "2025-12-15", 
            location: "BaseLine Elite Center",
            description: "End the year with our premier winter tournament featuring the best teams.",
            matchType: "5v5",
            ageGroups: ["U-16", "U-18"],
            registrationOpen: "2025-11-01",
            registrationClose: "2025-11-30",
            requiredFields: [
              "Team Name",
              "Captain First Name",
              "Captain Last Name", 
              "Player 2 First Name",
              "Player 2 Last Name",
              "Player 3 First Name", 
              "Player 3 Last Name",
              "Player 4 First Name",
              "Player 4 Last Name",
              "Player 5 First Name",
              "Player 5 Last Name",
              "Substitute 1 First Name",
              "Substitute 1 Last Name",
              "Email",
              "Phone Number",
              "Any Questions?"
            ],
            status: 'upcoming' as const
          }
        ];

        // Filter tournaments based on registration deadline
        const today = new Date();
        const upcoming = allTournaments.filter(tournament => {
          const closeDate = new Date(tournament.registrationClose);
          return closeDate >= today;
        });

        const pastFromUpcoming = allTournaments.filter(tournament => {
          const closeDate = new Date(tournament.registrationClose);
          return closeDate < today;
        });

        // Set upcoming tournaments (show only first one for simplicity)
        setUpcomingTournament(upcoming.length > 0 ? upcoming[0] : null);
        
        // Combine past tournaments
        setPastTournaments([...mockPast, ...pastFromUpcoming]);
      } catch (error) {
        console.error('Error fetching tournaments:', error);
        toast({
          title: "Error loading tournaments",
          description: "There was a problem loading tournament data.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTournaments();
  }, [toast]);

  const handleRegister = () => {
    if (!upcomingTournament) return;
    
    // Check if registration is still open
    const today = new Date();
    const closeDate = new Date(upcomingTournament.registrationClose);
    
    if (today > closeDate) {
      toast({
        title: "Registration closed",
        description: "The registration period for this tournament has ended.",
        variant: "destructive"
      });
      return;
    }
    
    setShowRegistrationForm(true);
  };

  const handleRegistrationComplete = () => {
    setShowRegistrationForm(false);
    toast({
      title: "Registration successful!",
      description: "Your team has been registered for the tournament.",
    });
  };

  const handleRegistrationCancel = () => {
    setShowRegistrationForm(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      
      <div className="flex-1 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">BaseLine Elite Tournaments</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Join our competitive basketball tournaments and showcase your skills. Our tournaments are designed to provide a professional competitive environment for players of all levels.
            </p>
          </div>
          
          {/* Upcoming Tournament */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 gradient-text text-center">Upcoming Tournament</h2>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-baseline-yellow"></div>
              </div>
            ) : upcomingTournament ? (
              <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 shadow-xl">
                <div className="md:flex">
                  <div className="md:w-2/3 p-6">
                    <h3 className="text-2xl font-bold mb-2">{upcomingTournament.title}</h3>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-baseline-yellow text-black">
                        {upcomingTournament.matchType}
                      </span>
                      
                      {upcomingTournament.ageGroups.map(age => (
                        <span key={age} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-200">
                          {age}
                        </span>
                      ))}
                    </div>
                    
                    <p className="text-gray-300 mb-6">{upcomingTournament.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center">
                        <CalendarDays className="h-5 w-5 text-baseline-yellow mr-2" />
                        <span>{formatDate(upcomingTournament.date)}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-baseline-yellow mr-2" />
                        <span>{upcomingTournament.location}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-baseline-yellow mr-2" />
                        <span>{upcomingTournament.matchType} Format</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-baseline-yellow mr-2" />
                        <span>Registration closes: {formatDate(upcomingTournament.registrationClose)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-1/3 bg-gradient-to-br from-gray-800 to-black p-6 flex flex-col justify-center items-center">
                    <p className="text-center mb-4 font-medium">Ready to compete?</p>
                    <Button 
                      onClick={handleRegister} 
                      className="button-primary w-full py-6"
                    >
                      Register Now
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 p-8 text-center">
                <h3 className="text-xl font-medium text-gray-400">No upcoming tournaments at this time</h3>
                <p className="mt-2 text-gray-500">Check back soon for new tournament announcements!</p>
              </div>
            )}
          </section>
          
          {/* Past Tournaments */}
          <section>
            <h2 className="text-2xl font-bold mb-6 gradient-text text-center">Past Tournaments</h2>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-baseline-yellow"></div>
              </div>
            ) : pastTournaments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pastTournaments.map(tournament => (
                  <div 
                    key={tournament.id}
                    className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 p-6"
                  >
                    <h3 className="text-xl font-bold mb-2">{tournament.title}</h3>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-200">
                        {tournament.matchType}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-200">
                        {formatDate(tournament.date)}
                      </span>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-3">{tournament.description}</p>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{tournament.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 p-8 text-center">
                <h3 className="text-xl font-medium text-gray-400">No past tournaments</h3>
                <p className="mt-2 text-gray-500">Check back after our upcoming events!</p>
              </div>
            )}
          </section>
        </div>
      </div>
      
      {/* Registration Modal */}
      {showRegistrationForm && upcomingTournament && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <TournamentRegistrationForm
            tournament={upcomingTournament}
            onComplete={handleRegistrationComplete}
            onCancel={handleRegistrationCancel}
          />
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default Tournaments;
