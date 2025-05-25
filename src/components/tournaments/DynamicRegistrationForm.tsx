
import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";

interface Player {
  name: string;
  age: string;
  phone: string;
}

interface DynamicRegistrationFormProps {
  tournament: {
    id: number;
    title: string;
    matchType: string;
    requiredFields: string[];
  };
  onComplete: () => void;
  onCancel: () => void;
}

const DynamicRegistrationForm = ({
  tournament,
  onComplete,
  onCancel
}: DynamicRegistrationFormProps) => {
  const { toast } = useToast();
  const [teamName, setTeamName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determine team size based on match type
  const getTeamSize = () => {
    if (tournament.matchType.includes('3v3') || tournament.matchType.includes('3vs3')) {
      return { min: 4, max: 4, description: '3 players + 1 substitute' };
    } else if (tournament.matchType.includes('5v5') || tournament.matchType.includes('5vs5')) {
      return { min: 6, max: 7, description: '5 players + 1-2 substitutes' };
    }
    return { min: 5, max: 7, description: '5-7 players' };
  };

  const teamSize = getTeamSize();

  // Initialize players array when component mounts
  useState(() => {
    const initialPlayers = Array.from({ length: teamSize.min }, () => ({
      name: '',
      age: '',
      phone: ''
    }));
    setPlayers(initialPlayers);
  });

  const updatePlayer = (index: number, field: keyof Player, value: string) => {
    const updatedPlayers = [...players];
    updatedPlayers[index] = { ...updatedPlayers[index], [field]: value };
    setPlayers(updatedPlayers);
  };

  const addPlayer = () => {
    if (players.length < teamSize.max) {
      setPlayers([...players, { name: '', age: '', phone: '' }]);
    }
  };

  const removePlayer = (index: number) => {
    if (players.length > teamSize.min) {
      const updatedPlayers = players.filter((_, i) => i !== index);
      setPlayers(updatedPlayers);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentScreenshot(file);
    }
  };

  const validateForm = () => {
    if (!teamName.trim()) {
      toast({
        title: "Missing team name",
        description: "Please enter your team name.",
        variant: "destructive"
      });
      return false;
    }

    if (!contactName.trim() || !contactPhone.trim() || !contactEmail.trim()) {
      toast({
        title: "Missing contact information",
        description: "Please fill in all contact details.",
        variant: "destructive"
      });
      return false;
    }

    const invalidPlayers = players.some(player => 
      !player.name.trim() || !player.age.trim() || !player.phone.trim()
    );

    if (invalidPlayers) {
      toast({
        title: "Incomplete player information",
        description: "Please fill in all player details.",
        variant: "destructive"
      });
      return false;
    }

    if (players.length < teamSize.min || players.length > teamSize.max) {
      toast({
        title: "Invalid team size",
        description: `Team must have ${teamSize.min}-${teamSize.max} players for ${tournament.matchType}.`,
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
    
    // Simulate submission
    setTimeout(() => {
      try {
        const registrationData = {
          tournamentId: tournament.id,
          teamName,
          contactName,
          contactPhone,
          contactEmail,
          players,
          paymentScreenshot: paymentScreenshot?.name || null,
          registrationDate: new Date().toISOString(),
          matchType: tournament.matchType
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
          <p className="text-sm text-gray-400">{tournament.matchType} - {teamSize.description}</p>
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
            <label className="block text-sm font-medium mb-1">Team Name *</label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2"
              placeholder="Enter your team name"
              required
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-baseline-yellow">Contact Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Contact Name *</label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2"
                placeholder="Contact person's name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number *</label>
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
          
          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2"
              placeholder="Contact email address"
              required
            />
          </div>
        </div>

        {/* Players Information */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-baseline-yellow">
              Players ({players.length}/{teamSize.max})
            </h3>
            {players.length < teamSize.max && (
              <Button type="button" onClick={addPlayer} variant="outline" size="sm">
                Add Player
              </Button>
            )}
          </div>
          
          {players.map((player, index) => (
            <div key={index} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">Player {index + 1}</h4>
                {players.length > teamSize.min && (
                  <Button 
                    type="button" 
                    onClick={() => removePlayer(index)}
                    variant="ghost" 
                    size="sm"
                    className="text-red-400 hover:text-red-300"
                  >
                    Remove
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Name *</label>
                  <input
                    type="text"
                    value={player.name}
                    onChange={(e) => updatePlayer(index, 'name', e.target.value)}
                    className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm"
                    placeholder="Player name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Age *</label>
                  <input
                    type="number"
                    value={player.age}
                    onChange={(e) => updatePlayer(index, 'age', e.target.value)}
                    className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm"
                    placeholder="Age"
                    min="10"
                    max="25"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Phone *</label>
                  <input
                    type="tel"
                    value={player.phone}
                    onChange={(e) => updatePlayer(index, 'phone', e.target.value)}
                    className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm"
                    placeholder="Phone number"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Screenshot */}
        {tournament.requiredFields.includes('Payment Screenshot') && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-baseline-yellow">Payment Confirmation</h3>
            
            <div className="border border-dashed border-gray-700 rounded-md p-6 text-center bg-gray-800/50">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-400 mb-4">Upload payment confirmation screenshot</p>
              
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="payment-upload"
              />
              
              <label htmlFor="payment-upload">
                <Button type="button" variant="outline" className="cursor-pointer" asChild>
                  <span>{paymentScreenshot ? paymentScreenshot.name : 'Choose File'}</span>
                </Button>
              </label>
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

export default DynamicRegistrationForm;
