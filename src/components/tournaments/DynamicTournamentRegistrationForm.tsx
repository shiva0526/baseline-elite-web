
import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";

interface Tournament {
  id: number;
  title: string;
  matchType: string;
  requiredFields: string[];
}

interface DynamicTournamentRegistrationFormProps {
  tournament: Tournament;
  onComplete: () => void;
  onCancel: () => void;
}

interface PlayerInfo {
  name: string;
  age: string;
  phone: string;
}

const DynamicTournamentRegistrationForm = ({
  tournament,
  onComplete,
  onCancel
}: DynamicTournamentRegistrationFormProps) => {
  const { toast } = useToast();
  const [teamName, setTeamName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [players, setPlayers] = useState<PlayerInfo[]>([]);
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determine team size based on match type
  const getTeamRequirements = (matchType: string) => {
    if (matchType === '3v3' || matchType === '3vs3') {
      return { min: 4, max: 4, description: '3 players + 1 substitute' };
    } else if (matchType === '5v5' || matchType === '5vs5') {
      return { min: 6, max: 7, description: '5 players + 1-2 substitutes' };
    }
    return { min: 1, max: 10, description: 'Variable team size' };
  };

  const teamReqs = getTeamRequirements(tournament.matchType);

  // Initialize players array with correct size
  useState(() => {
    const initialPlayers = Array(teamReqs.min).fill(null).map(() => ({
      name: '',
      age: '',
      phone: ''
    }));
    setPlayers(initialPlayers);
  });

  const updatePlayer = (index: number, field: keyof PlayerInfo, value: string) => {
    setPlayers(prev => prev.map((player, i) => 
      i === index ? { ...player, [field]: value } : player
    ));
  };

  const addPlayer = () => {
    if (players.length < teamReqs.max) {
      setPlayers(prev => [...prev, { name: '', age: '', phone: '' }]);
    }
  };

  const removePlayer = (index: number) => {
    if (players.length > teamReqs.min) {
      setPlayers(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentFile(file);
    }
  };

  const validateForm = () => {
    if (!teamName.trim()) {
      toast({
        title: "Missing team name",
        description: "Please enter a team name.",
        variant: "destructive"
      });
      return false;
    }

    if (!contactName.trim() || !contactEmail.trim() || !contactPhone.trim()) {
      toast({
        title: "Missing contact information",
        description: "Please fill in all contact details.",
        variant: "destructive"
      });
      return false;
    }

    const invalidPlayers = players.filter(p => !p.name.trim() || !p.age.trim() || !p.phone.trim());
    if (invalidPlayers.length > 0) {
      toast({
        title: "Incomplete player information",
        description: "Please fill in all player details (name, age, phone).",
        variant: "destructive"
      });
      return false;
    }

    if (players.length < teamReqs.min || players.length > teamReqs.max) {
      toast({
        title: "Invalid team size",
        description: `Team must have ${teamReqs.min}${teamReqs.max !== teamReqs.min ? `-${teamReqs.max}` : ''} players.`,
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      try {
        const registrationData = {
          tournamentId: tournament.id,
          teamName,
          contactName,
          contactEmail,
          contactPhone,
          players,
          paymentSubmitted: !!paymentFile,
          registrationDate: new Date().toISOString()
        };
        
        const existingRegistrations = JSON.parse(
          localStorage.getItem('tournamentRegistrations') || '[]'
        );
        
        existingRegistrations.push(registrationData);
        localStorage.setItem('tournamentRegistrations', JSON.stringify(existingRegistrations));
        
        window.dispatchEvent(new Event('storage'));
        onComplete();
      } catch (error) {
        console.error('Error saving registration:', error);
        toast({
          title: "Registration failed",
          description: "There was a problem saving your registration. Please try again.",
          variant: "destructive"
        });
        setIsSubmitting(false);
      }
    }, 1000);
  };

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-4 border-b border-gray-800 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Register for {tournament.title}</h2>
          <p className="text-sm text-gray-400">
            {tournament.matchType} format - {teamReqs.description}
          </p>
        </div>
        <button onClick={onCancel} className="rounded-full p-1 hover:bg-gray-800">
          <X size={20} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Team Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-baseline-yellow">Team Information</h3>
          
          <div>
            <label className="block text-sm font-medium mb-1">Team Name*</label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2"
              placeholder="Enter team name"
              required
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-baseline-yellow">Contact Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Contact Name*</label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2"
                placeholder="Contact person name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email*</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2"
                placeholder="Contact email"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number*</label>
            <input
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2"
              placeholder="Contact phone number"
              required
            />
          </div>
        </div>

        {/* Player Information */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-baseline-yellow">Player Information</h3>
            <div className="text-sm text-gray-400">
              {players.length}/{teamReqs.max} players
            </div>
          </div>
          
          {players.map((player, index) => (
            <div key={index} className="border border-gray-700 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">
                  Player {index + 1} {index >= (tournament.matchType === '3v3' ? 3 : 5) && 
                  <span className="text-baseline-yellow">(Substitute)</span>}
                </h4>
                {players.length > teamReqs.min && (
                  <button
                    type="button"
                    onClick={() => removePlayer(index)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Name*</label>
                  <input
                    type="text"
                    value={player.name}
                    onChange={(e) => updatePlayer(index, 'name', e.target.value)}
                    className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2"
                    placeholder="Player name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Age*</label>
                  <input
                    type="number"
                    value={player.age}
                    onChange={(e) => updatePlayer(index, 'age', e.target.value)}
                    className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2"
                    placeholder="Age"
                    min="1"
                    max="50"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Phone*</label>
                  <input
                    type="tel"
                    value={player.phone}
                    onChange={(e) => updatePlayer(index, 'phone', e.target.value)}
                    className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2"
                    placeholder="Phone number"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
          
          {players.length < teamReqs.max && (
            <button
              type="button"
              onClick={addPlayer}
              className="w-full border-2 border-dashed border-gray-700 rounded-lg p-4 text-gray-400 hover:border-baseline-yellow hover:text-baseline-yellow transition-colors"
            >
              + Add Player (Optional Substitute)
            </button>
          )}
        </div>

        {/* Payment Upload */}
        {tournament.requiredFields.includes('Payment Screenshot') && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-baseline-yellow">Payment Confirmation</h3>
            
            <div className="border border-dashed border-gray-700 rounded-md p-6 text-center bg-gray-800/50">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="text-sm">
                <label htmlFor="payment-upload" className="cursor-pointer">
                  <span className="text-baseline-yellow hover:text-baseline-yellow/80">Upload payment screenshot</span>
                  <input
                    id="payment-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </label>
              </div>
              {paymentFile && (
                <p className="text-sm text-green-400 mt-2">
                  ✓ {paymentFile.name}
                </p>
              )}
            </div>
          </div>
        )}
        
        <div className="pt-4 flex space-x-4">
          <Button
            type="button"
            variant="outline"
            className="w-1/2"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            className="w-1/2 button-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Register Team'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DynamicTournamentRegistrationForm;
