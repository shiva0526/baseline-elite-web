
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
    
    // Validate form
    const missingFields = tournament.requiredFields.filter(field => 
      !formData[field] || formData[field].trim() === ''
    );
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing information",
        description: `Please fill in all required fields: ${missingFields.join(', ')}`,
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
          registrationDate: new Date().toISOString()
        };
        
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
            <label className="block text-sm font-medium mb-1">Team Name</label>
            <input
              type="text"
              value={formData[field] || ''}
              onChange={e => handleChange(field, e.target.value)}
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2"
              placeholder="Enter your team name"
            />
          </div>
        );
      case 'Age Group':
        return (
          <div key={field}>
            <label className="block text-sm font-medium mb-1">Age Group</label>
            <select
              value={formData[field] || ''}
              onChange={e => handleChange(field, e.target.value)}
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2"
            >
              <option value="">Select age group</option>
              <option value="U15">U15</option>
              <option value="U16">U16</option>
              <option value="U17">U17</option>
              <option value="U18">U18</option>
              <option value="U19">U19</option>
            </select>
          </div>
        );
      case 'Contact Name':
        return (
          <div key={field}>
            <label className="block text-sm font-medium mb-1">Contact Name</label>
            <input
              type="text"
              value={formData[field] || ''}
              onChange={e => handleChange(field, e.target.value)}
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2"
              placeholder="Enter contact person's name"
            />
          </div>
        );
      case 'Phone Number':
        return (
          <div key={field}>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              value={formData[field] || ''}
              onChange={e => handleChange(field, e.target.value)}
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2"
              placeholder="Enter contact phone number"
            />
          </div>
        );
      case 'Email':
        return (
          <div key={field}>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={formData[field] || ''}
              onChange={e => handleChange(field, e.target.value)}
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2"
              placeholder="Enter contact email"
            />
          </div>
        );
      case 'Player Names':
        return (
          <div key={field}>
            <label className="block text-sm font-medium mb-1">Player Names</label>
            <textarea
              value={formData[field] || ''}
              onChange={e => handleChange(field, e.target.value)}
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 min-h-[100px]"
              placeholder="Enter player names (one per line)"
            />
          </div>
        );
      case 'Payment Screenshot':
        return (
          <div key={field}>
            <label className="block text-sm font-medium mb-1">Payment Screenshot</label>
            <div className="border border-dashed border-gray-700 rounded-md p-4 text-center bg-gray-800/50">
              <p className="text-sm text-gray-400 mb-2">Upload payment confirmation screenshot</p>
              <Button type="button" variant="outline" className="w-full">
                Upload Image
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                (This is a mock upload button - in a real app, this would upload to a server)
              </p>
            </div>
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
      
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {tournament.requiredFields.map(field => renderFormField(field))}
        
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
