
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Award } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// Mock data for tournaments
const upcomingTournament = {
  id: 1,
  title: "BaseLine Summer Championship",
  date: "June 15, 2025",
  location: "BaseLine Academy Court",
  description: "Join us for the annual BaseLine Summer Championship! This 3v3 tournament is open for U15-U19 age groups. Showcase your skills and compete for incredible prizes.",
  matchType: "3v3",
  ageGroups: ["U15", "U16", "U17", "U18", "U19"],
  registrationOpen: "May 1, 2025",
  registrationClose: "June 10, 2025"
};

const pastTournaments = [
  {
    id: 101,
    title: "Winter Elite Showdown",
    date: "December 10, 2024",
    location: "BaseLine Academy Court",
    description: "The Winter Elite Showdown brought together top talents from the region for an intense 5v5 competition.",
    images: ["/images/placeholder.svg", "/images/placeholder.svg"],
    results: "Team Phoenix - Champions"
  },
  {
    id: 102,
    title: "Fall Basketball Classic",
    date: "September 25, 2024",
    location: "City Sports Arena",
    description: "Our annual Fall Classic featured exciting matches between 20 teams across all age groups.",
    images: ["/images/placeholder.svg", "/images/placeholder.svg"],
    results: "Team Warriors - Champions"
  }
];

const Tournaments = () => {
  const [showRegistration, setShowRegistration] = useState(false);
  
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* Page Content */}
      <div className="pt-24 pb-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-gray-900 to-black py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              BaseLine <span className="gradient-text">Tournaments</span>
            </h1>
            <p className="text-gray-300 text-xl max-w-2xl">
              Compete at the highest level and showcase your skills. Our tournaments bring together the best basketball talent in the region.
            </p>
          </div>
        </div>
        
        {/* Upcoming Tournament */}
        <section className="bg-gray-900 py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center mb-8">
              <Calendar className="text-baseline-yellow mr-2" size={24} />
              <h2 className="text-2xl md:text-3xl font-bold">Upcoming Tournament</h2>
            </div>
            
            {upcomingTournament ? (
              <div className="bg-black border border-gray-800 rounded-lg p-6 md:p-8 hover:border-baseline-yellow transition-all duration-300">
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="md:w-2/3">
                    <h3 className="text-2xl font-bold mb-2">{upcomingTournament.title}</h3>
                    <div className="flex flex-wrap gap-4 mb-4">
                      <span className="bg-gray-800 px-3 py-1 rounded-full text-sm flex items-center">
                        <Calendar size={16} className="mr-1" /> {upcomingTournament.date}
                      </span>
                      <span className="bg-gray-800 px-3 py-1 rounded-full text-sm">
                        {upcomingTournament.location}
                      </span>
                      <span className="bg-gray-800 px-3 py-1 rounded-full text-sm">
                        {upcomingTournament.matchType}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-gray-300 mb-4">{upcomingTournament.description}</p>
                      <div className="mb-2">
                        <span className="font-medium">Age Groups:</span>{' '}
                        {upcomingTournament.ageGroups.join(', ')}
                      </div>
                      <div>
                        <span className="font-medium">Registration Period:</span>{' '}
                        {upcomingTournament.registrationOpen} - {upcomingTournament.registrationClose}
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-1/3 flex justify-center md:justify-end items-start mt-6 md:mt-0">
                    <Button 
                      className="button-primary text-lg px-8 py-6" 
                      onClick={() => setShowRegistration(true)}
                    >
                      Register Now
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-black border border-gray-800 rounded-lg p-8 text-center">
                <p className="text-gray-400 text-xl">No upcoming tournaments at the moment.</p>
                <p className="text-gray-500">Check back soon for new events!</p>
              </div>
            )}
          </div>
        </section>
        
        {/* Registration Form - Conditionally rendered */}
        {showRegistration && (
          <section className="py-16 bg-black">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h3 className="text-2xl font-bold mb-6">
                  Register for {upcomingTournament.title}
                </h3>
                
                <p className="text-gray-300 mb-8">
                  Please fill out the registration form below. All fields are required.
                </p>
                
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                  <form className="space-y-6">
                    {/* Team Information */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium">Team Information</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Team Name</label>
                          <input 
                            type="text" 
                            className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2"
                            placeholder="Enter team name"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Age Group</label>
                          <select className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2">
                            <option value="">Select age group</option>
                            {upcomingTournament.ageGroups.map(age => (
                              <option key={age} value={age}>{age}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    {/* Contact Information */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium">Contact Information</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Contact Name</label>
                          <input 
                            type="text" 
                            className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2"
                            placeholder="Full name"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Phone Number</label>
                          <input 
                            type="tel" 
                            className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2"
                            placeholder="Your phone number"
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-1">Email Address</label>
                          <input 
                            type="email" 
                            className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2"
                            placeholder="Your email address"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Player Information */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium">Player Information</h4>
                      <p className="text-sm text-gray-400">Please provide information for all players (maximum 5)</p>
                      
                      {[1, 2, 3].map((player) => (
                        <div key={player} className="border border-gray-700 rounded-md p-4">
                          <h5 className="font-medium mb-3">Player {player}</h5>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Full Name</label>
                              <input 
                                type="text" 
                                className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2"
                                placeholder="Player's full name"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-1">Age</label>
                              <input 
                                type="number" 
                                className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2"
                                placeholder="Player's age"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <div>
                        <Button variant="outline" className="w-full">
                          <Users className="mr-2 h-4 w-4" /> Add Another Player
                        </Button>
                      </div>
                    </div>
                    
                    {/* Payment Information */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium">Payment Confirmation</h4>
                      <p className="text-sm text-gray-400">
                        Registration fee: $100 per team. Please upload your payment confirmation.
                      </p>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Payment Screenshot</label>
                        <input 
                          type="file" 
                          className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2"
                          accept="image/*"
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-4 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => setShowRegistration(false)}
                      >
                        Cancel
                      </Button>
                      
                      <Button type="submit" className="button-primary w-full">
                        Submit Registration
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>
        )}
        
        {/* Past Tournaments */}
        <section className="bg-black py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center mb-8">
              <Award className="text-baseline-yellow mr-2" size={24} />
              <h2 className="text-2xl md:text-3xl font-bold">Past Tournaments</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {pastTournaments.map((tournament) => (
                <div key={tournament.id} className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-baseline-yellow transition-all duration-300">
                  {/* Image Gallery */}
                  <div className="grid grid-cols-2 gap-1 h-40">
                    {tournament.images.map((img, i) => (
                      <div key={i} className="bg-gray-800 h-40">
                        <img src={img} alt={tournament.title} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{tournament.title}</h3>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="bg-gray-800 px-2 py-0.5 rounded-full text-xs">
                        {tournament.date}
                      </span>
                      <span className="bg-gray-800 px-2 py-0.5 rounded-full text-xs">
                        {tournament.location}
                      </span>
                    </div>
                    
                    <p className="text-gray-300 mb-3">{tournament.description}</p>
                    
                    <div className="border-t border-gray-800 pt-3">
                      <p className="text-baseline-yellow font-medium">{tournament.results}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default Tournaments;
