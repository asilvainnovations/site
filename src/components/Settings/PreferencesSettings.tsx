import React, { useState } from 'react';
import { UserSettings } from '../../types';

interface PreferencesSettingsProps {
  settings: Partial<UserSettings>;
  onSave: (settings: Partial<UserSettings>) => Promise<void>;
  theme: 'light' | 'dark';
}

export const PreferencesSettings: React.FC<PreferencesSettingsProps> = ({
  settings,
  onSave,
  theme,
}) => {
  const [formData, setFormData] = useState(settings);
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
      <h3 className="text-lg font-semibold mb-6">Preferences</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Language</label>
            <select
              value={formData.language || 'en'}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  language: e.target.value as 'en' | 'es' | 'fr' | 'tl',
                })
              }
              className={`w-full px-4 py-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-white border-gray-300'
              } focus:ring-2 focus:ring-blue-500`}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="tl">Tagalog</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Timezone</label>
            <select
              value={formData.timezone || 'UTC'}
              onChange={(e) =>
                setFormData({ ...formData, timezone: e.target.value })
              }
              className={`w-full px-4 py-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-white border-gray-300'
              } focus:ring-2 focus:ring-blue-500`}
            >
              <option value="UTC">UTC</option>
              <option value="Asia/Manila">Manila</option>
              <option value="Asia/Bangkok">Bangkok</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            AI Assistant Style
          </label>
          <select
            value={formData.aiAssistantStyle || 'detailed'}
            onChange={(e) =>
              setFormData({
                ...formData,
                aiAssistantStyle: e.target.value as
                  | 'concise'
                  | 'detailed'
                  | 'technical',
              })
            }
            className={`w-full px-4 py-2 rounded-lg border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600'
                : 'bg-white border-gray-300'
            } focus:ring-2 focus:ring-blue-500`}
          >
            <option value="concise">Concise</option>
            <option value="detailed">Detailed</option>
            <option value="technical">Technical</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.aiSuggestionsEnabled || false}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  aiSuggestionsEnabled: e.target.checked,
                })
              }
              className="w-4 h-4 accent-blue-600"
            />
            <span className="text-sm">Enable AI suggestions in dashboard</span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.offlineMode || false}
              onChange={(e) =>
                setFormData({ ...formData, offlineMode: e.target.checked })
              }
              className="w-4 h-4 accent-blue-600"
            />
            <span className="text-sm">Enable offline mode</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </button>
      </form>
    </div>
  );
};
