import React, { useState } from 'react';
import { Camera, Save } from 'lucide-react';
import { User } from '../../types';

interface ProfileSettingsProps {
  user: User;
  onSave: (user: Partial<User>) => Promise<void>;
  theme: 'light' | 'dark';
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  user,
  onSave,
  theme,
}) => {
  const [formData, setFormData] = useState({
    name: user.name,
    organization: user.organization,
    contactDetails: user.contactDetails || '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`rounded-lg p-6 ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
      <h3 className="text-lg font-semibold mb-6">Profile Information</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user.name.charAt(0)}
            </div>
            <button
              type="button"
              className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
            >
              <Camera size={16} />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Full Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full px-4 py-2 rounded-lg border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600'
                : 'bg-white border-gray-300'
            } focus:ring-2 focus:ring-blue-500`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Organization</label>
          <input
            type="text"
            value={formData.organization}
            onChange={(e) =>
              setFormData({ ...formData, organization: e.target.value })
            }
            className={`w-full px-4 py-2 rounded-lg border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600'
                : 'bg-white border-gray-300'
            } focus:ring-2 focus:ring-blue-500`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Contact Details
          </label>
          <textarea
            value={formData.contactDetails}
            onChange={(e) =>
              setFormData({ ...formData, contactDetails: e.target.value })
            }
            rows={3}
            className={`w-full px-4 py-2 rounded-lg border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600'
                : 'bg-white border-gray-300'
            } focus:ring-2 focus:ring-blue-500`}
          />
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <Save size={18} />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};
