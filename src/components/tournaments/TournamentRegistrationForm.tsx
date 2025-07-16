
import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";

interface TournamentRegistrationFormProps {
  tournament: {
    id: number;
    title: string;
    requiredFields: string[];
  };
  onComplete: () => void;
  onCancel: () => void;
}

const TournamentRegistrationForm = ({
  tournament,
  onComplete,
  onCancel
}: TournamentRegistrationFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Define required fields that must be filled
    const essentialFields = ['Team Name', 'Captain First Name', 'Captain Last Name', 'Email', 'Phone Number'];
    
    // Validate essential fields
    const missingEssentialFields = essentialFields.filter(field => 
      !formData[field] || formData[field].trim() === ''
    );
    
    if (missingEssentialFields.length > 0) {
      toast({
        title: "Missing information",
        description: `Please fill in all required fields: ${missingEssentialFields.join(', ')}`,
        variant: "destructive"
      });
      return;
    }
    
    // Submit form
    setIsSubmitting(true);
    
    // In a real application, this would be an API call
    setTimeout(() => {
      try {
        // Add the tournament ID and registration date to the form data
        const registrationData = {
          ...formData,
          tournamentId: tournament.id,
          tournamentTitle: tournament.title,
          registrationDate: new Date().toISOString()
        };
        
        // Debug log to ensure proper tournament ID
        console.log('Registering for tournament:', {
          tournamentId: tournament.id,
          tournamentTitle: tournament.title,
          registrationData
        });
        
        // Get existing registrations or initialize empty array
        const existingRegistrations = JSON.parse(
          localStorage.getItem('tournamentRegistrations') || '[]'
        );
        
        // Add new registration
        existingRegistrations.push(registrationData);
        
        // Save to localStorage
        localStorage.setItem(
          'tournamentRegistrations', 
          JSON.stringify(existingRegistrations)
        );
        
        // Trigger a storage event for other components to react
        window.dispatchEvent(new Event('storage'));
        
        // Complete registration
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
    }, 1000); // Simulate network delay
  };

  // Determine which form fields to display based on required fields
  const renderFormField = (field: string) => {
    switch (field) {
      case 'Team Name':
        return (
          <div key={field}>
            <label className="block text-sm font-medium mb-1">Team Name *</label>
            <input
              type="text"
              value={formData[field] || ''}
              onChange={e => handleChange(field, e.target.value)}
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2"
              placeholder="Enter your team name"
              required
            />
          </div>
        );
      
      case 'Captain First Name':
      case 'Captain Last Name':
        return (
          <div key={field}>
            <label className="block text-sm font-medium mb-1">{field} *</label>
            <input
              type="text"
              value={formData[field] || ''}
              onChange={e => handleChange(field, e.target.value)}
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2"
              placeholder={`Enter captain's ${field.toLowerCase().includes('first') ? 'first' : 'last'} name`}
              required
            />
          </div>
        );

      case 'Player 2 First Name':
      case 'Player 2 Last Name':
      case 'Player 3 First Name':
      case 'Player 3 Last Name':
      case 'Player 4 First Name':
      case 'Player 4 Last Name':
      case 'Player 5 First Name':
      case 'Player 5 Last Name':
        const playerNum = field.split(' ')[1];
        const nameType = field.includes('First') ? 'first' : 'last';
        return (
          <div key={field}>
            <label className="block text-sm font-medium mb-1">{field}</label>
            <input
              type="text"
              value={formData[field] || ''}
              onChange={e => handleChange(field, e.target.value)}
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2"
              placeholder={`Enter player ${playerNum} ${nameType} name`}
            />
          </div>
        );

      case 'Substitute 1 First Name':
      case 'Substitute 1 Last Name':
      case 'Substitute 2 First Name':
      case 'Substitute 2 Last Name':
      case 'Substitute 3 First Name':
      case 'Substitute 3 Last Name':
        const subNum = field.split(' ')[1];
        const subNameType = field.includes('First') ? 'first' : 'last';
        return (
          <div key={field}>
            <label className="block text-sm font-medium mb-1">{field}</label>
            <input
              type="text"
              value={formData[field] || ''}
              onChange={e => handleChange(field, e.target.value)}
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2"
              placeholder={`Enter substitute ${subNum} ${subNameType} name`}
            />
          </div>
        );

      case 'Email':
        return (
          <div key={field}>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input
              type="email"
              value={formData[field] || ''}
              onChange={e => handleChange(field, e.target.value)}
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2"
              placeholder="Enter contact email"
              required
            />
          </div>
        );

      case 'Phone Number':
        return (
          <div key={field}>
            <label className="block text-sm font-medium mb-1">Phone Number *</label>
            <input
              type="tel"
              value={formData[field] || ''}
              onChange={e => handleChange(field, e.target.value)}
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2"
              placeholder="Enter contact phone number"
              required
            />
          </div>
        );

      case 'Team Logo':
        return (
          <div key={field}>
            <label className="block text-sm font-medium mb-1">Team Logo</label>
            <div className="border border-dashed border-gray-700 rounded-md p-4 text-center bg-gray-800/50">
              <p className="text-sm text-gray-400 mb-2">Upload your team logo</p>
              <Button type="button" variant="outline" className="w-full">
                Choose File
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Supported formats: JPG, PNG, GIF (Max 5MB)
              </p>
            </div>
          </div>
        );

      case 'Any Questions?':
        return (
          <div key={field}>
            <label className="block text-sm font-medium mb-1">Any Questions?</label>
            <textarea
              value={formData[field] || ''}
              onChange={e => handleChange(field, e.target.value)}
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 min-h-[100px]"
              placeholder="Any questions or special requests for your team?"
              rows={4}
            />
          </div>
        );

      default:
        return (
          <div key={field}>
            <label className="block text-sm font-medium mb-1">{field}</label>
            <input
              type="text"
              value={formData[field] || ''}
              onChange={e => handleChange(field, e.target.value)}
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2"
              placeholder={`Enter ${field.toLowerCase()}`}
            />
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
      <div className="p-4 border-b border-gray-800 flex justify-between items-center">
        <h2 className="text-xl font-bold">Register for {tournament.title}</h2>
        <button onClick={onCancel} className="rounded-full p-1 hover:bg-gray-800">
          <X size={20} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Team Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-baseline-yellow border-b border-gray-700 pb-2">Team Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tournament.requiredFields.filter(field => 
              field === 'Team Name' || field === 'Team Logo'
            ).map(field => renderFormField(field))}
          </div>
        </div>

        {/* Captain Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-baseline-yellow border-b border-gray-700 pb-2">Captain Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderFormField('Captain First Name')}
            {renderFormField('Captain Last Name')}
          </div>
        </div>

        {/* Players Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-baseline-yellow border-b border-gray-700 pb-2">Players</h3>
          {[2, 3, 4, 5].map(num => (
            <div key={`player-${num}`} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderFormField(`Player ${num} First Name`)}
              {renderFormField(`Player ${num} Last Name`)}
            </div>
          ))}
        </div>

        {/* Substitutes Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-baseline-yellow border-b border-gray-700 pb-2">Substitutes</h3>
          {[1, 2, 3].map(num => (
            <div key={`substitute-${num}`} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderFormField(`Substitute ${num} First Name`)}
              {renderFormField(`Substitute ${num} Last Name`)}
            </div>
          ))}
        </div>

        {/* Contact Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-baseline-yellow border-b border-gray-700 pb-2">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tournament.requiredFields.filter(field => 
              field === 'Email' || field === 'Phone Number'
            ).map(field => renderFormField(field))}
          </div>
        </div>

        {/* Additional Information Section */}
        {tournament.requiredFields.includes('Any Questions?') && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-baseline-yellow border-b border-gray-700 pb-2">Additional Information</h3>
            {renderFormField('Any Questions?')}
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
            {isSubmitting ? 'Submitting...' : 'Register'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TournamentRegistrationForm;
