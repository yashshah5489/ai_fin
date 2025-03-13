import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@shared/schema";
import { Check } from "lucide-react";

interface UserProfileFormProps {
  user: Omit<User, 'password'>;
  onSubmit: (data: Partial<User>) => Promise<void>;
}

export default function UserProfileForm({ user, onSubmit }: UserProfileFormProps) {
  const [formData, setFormData] = useState({
    username: user.username || "",
    fullName: user.fullName || "",
    email: user.email || "",
    profileImage: user.profileImage || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    
    try {
      await onSubmit(formData);
      setSuccessMessage("Profile updated successfully");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            disabled
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">Cannot be changed</p>
        </div>
        
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="profileImage">Profile Image URL</Label>
          <Input
            id="profileImage"
            name="profileImage"
            value={formData.profileImage}
            onChange={handleChange}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">Enter a URL for your avatar image</p>
        </div>
      </div>
      
      <div>
        <Button
          type="submit"
          className="bg-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
        
        {successMessage && (
          <div className="ml-4 inline-flex items-center text-sm text-green-600">
            <Check className="h-4 w-4 mr-1" />
            {successMessage}
          </div>
        )}
      </div>
    </form>
  );
}
