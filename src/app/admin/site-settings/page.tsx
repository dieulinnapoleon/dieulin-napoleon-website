"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Save, Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { listDocs, setDoc } from "@/lib/admin-api";
import { getFirebaseClient } from "@/lib/firebase-client";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const SETTING_KEYS = [
  { key: "site_title", label: "Site Title", type: "text" },
  { key: "site_description", label: "Site Description", type: "textarea" },
  { key: "hero_title", label: "Hero Title", type: "text" },
  { key: "hero_subtitle", label: "Hero Subtitle", type: "textarea" },
  { key: "cta_title", label: "CTA Section Title", type: "text" },
  { key: "cta_subtitle", label: "CTA Section Subtitle", type: "textarea" },
  { key: "contact_email", label: "Contact Email", type: "text" },
  { key: "analytics_id", label: "Analytics / GA ID", type: "text" },
];

export default function AdminSiteSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const fetchSettings = useCallback(async () => {
    try {
      const docs = await listDocs<{ id: string; value: string }>("siteSettings");
      const mapped = docs.reduce((acc, doc) => { acc[doc.id] = doc.value; return acc; }, {} as Record<string, string>);
      setSettings(mapped);
      if (mapped.profile_photo_url) setPhotoUrl(mapped.profile_photo_url);
    } catch (err: any) { toast.error("Failed to load settings"); }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(settings)) {
        await setDoc("siteSettings", key, { value });
      }
      toast.success("Settings saved");
    } catch (err: any) { toast.error(err.message || "Failed to save settings"); }
    setSaving(false);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Please select a JPG, PNG, or WebP image");
      return;
    }
    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handlePhotoUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { storage } = getFirebaseClient();
      const ext = file.name.split(".").pop() || "jpg";
      const storageRef = ref(storage, "profile/dieulin-profile-photo." + ext);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      // Save URL to Firestore
      await setDoc("siteSettings", "profile_photo_url", { value: url });
      setPhotoUrl(url);
      setPreview(null);
      toast.success("Profile photo uploaded");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    }
    setUploading(false);
  };

  const handlePhotoRemove = async () => {
    if (!confirm("Remove profile photo?")) return;
    try {
      await setDoc("siteSettings", "profile_photo_url", { value: "" });
      setPhotoUrl("");
      setPreview(null);
      toast.success("Profile photo removed");
    } catch (err: any) { toast.error("Failed to remove photo"); }
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

      {/* Profile Photo Section */}
      <div className="admin-card mb-6">
        <h2 className="font-display text-lg font-semibold text-navy mb-4">Profile Photo</h2>
        <p className="text-sm text-gray-500 mb-4">Upload a professional portrait. Appears in the homepage hero. JPG, PNG, or WebP, max 5MB.</p>
        <div className="flex items-start gap-6">
          <div className="w-32 h-32 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden shrink-0">
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : photoUrl ? (
              <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon size={32} className="text-gray-300" />
            )}
          </div>
          <div className="space-y-3">
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoSelect}
              className="hidden"
            />
            <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()}>
              <Upload size={14} /> Choose Photo
            </Button>
            {preview && (
              <div className="flex gap-2">
                <Button size="sm" onClick={handlePhotoUpload} loading={uploading}>
                  <Save size={14} /> Upload
                </Button>
                <Button size="sm" variant="outline" onClick={() => { setPreview(null); if (fileRef.current) fileRef.current.value = ""; }}>
                  <X size={14} /> Cancel
                </Button>
              </div>
            )}
            {photoUrl && !preview && (
              <button onClick={handlePhotoRemove} className="text-xs text-red-400 hover:text-red-600">
                Remove photo
              </button>
            )}
          </div>
        </div>
      </div>

      {/* General Settings */}
      <div className="admin-card space-y-6">
        {SETTING_KEYS.map((setting) => (
          <div key={setting.key}>
            <label className="block text-sm font-medium text-navy mb-1">{setting.label}</label>
            {setting.type === "textarea" ? (
              <textarea value={settings[setting.key] ?? ""} onChange={(e) => setSettings({ ...settings, [setting.key]: e.target.value })} className="input-field" rows={3} />
            ) : (
              <input value={settings[setting.key] ?? ""} onChange={(e) => setSettings({ ...settings, [setting.key]: e.target.value })} className="input-field" />
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
