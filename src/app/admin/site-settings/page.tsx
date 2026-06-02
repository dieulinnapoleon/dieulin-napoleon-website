'use client';

import { useEffect, useState, useCallback } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { listDocs, setDoc } from '@/lib/admin-api';

const SETTING_KEYS = [
  { key: 'site_title', label: 'Site Title', type: 'text' },
  { key: 'site_description', label: 'Site Description', type: 'textarea' },
  { key: 'hero_title', label: 'Hero Title', type: 'text' },
  { key: 'hero_subtitle', label: 'Hero Subtitle', type: 'textarea' },
  { key: 'cta_title', label: 'CTA Section Title', type: 'text' },
  { key: 'cta_subtitle', label: 'CTA Section Subtitle', type: 'textarea' },
  { key: 'contact_email', label: 'Contact Email', type: 'text' },
  { key: 'analytics_id', label: 'Analytics / GA ID', type: 'text' },
];

export default function AdminSiteSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchSettings = useCallback(async () => {
    try {
      const docs = await listDocs<{ id: string; value: string }>('siteSettings');
      const mapped = docs.reduce((acc, doc) => { acc[doc.id] = doc.value; return acc; }, {} as Record<string, string>);
      setSettings(mapped);
    } catch (err: any) { toast.error('Failed to load settings'); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(settings)) {
        await setDoc('siteSettings', key, { value });
      }
      toast.success('Settings saved');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save settings');
    }
    setSaving(false);
  };

  if (loading) return <div className="text-gray-500">Loading settings...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy">Site Settings</h1>
          <p className="text-sm text-gray-500">Global configuration for your website</p>
        </div>
      </div>

      <div className="admin-card space-y-6">
        {SETTING_KEYS.map((setting) => (
          <div key={setting.key}>
            <label className="block text-sm font-medium text-navy mb-1">{setting.label}</label>
            {setting.type === 'textarea' ? (
              <textarea value={settings[setting.key] ?? ''} onChange={(e) => setSettings({ ...settings, [setting.key]: e.target.value })} className="input-field" rows={3} />
            ) : (
              <input value={settings[setting.key] ?? ''} onChange={(e) => setSettings({ ...settings, [setting.key]: e.target.value })} className="input-field" />
            )}
          </div>
        ))}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
          <Button onClick={handleSave} loading={saving}><Save size={16} /> Save Settings</Button>
        </div>
      </div>
    </div>
  );
}
