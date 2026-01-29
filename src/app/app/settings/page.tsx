"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  Loader2,
  Settings,
  KeyRound,
  Pencil,
  ImagePlus,
  Trash2,
} from "lucide-react";
import type { Profile } from "@/types";
import Image from "next/image";

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [stageName, setStageName] = useState("");
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      setEmail(user.email || "");

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile(data);
        setDisplayName(data.display_name || "");
        setStageName(data.stage_name || "");
      }
    }

    loadProfile();
  }, [supabase]);

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName,
          stage_name: stageName || null,
        })
        .eq("id", profile.id);

      if (error) throw error;

      router.refresh();
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/login");
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      const response = await fetch("/api/account/delete", {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.error) {
        alert(`Failed to delete account: ${data.error}`);
        return;
      }

      // Sign out and redirect to home
      await supabase.auth.signOut();
      router.refresh();
      router.push("/");
    } catch (error) {
      console.error("Delete account error:", error);
      alert("Failed to delete account. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleSetPassword = async () => {
    setPasswordMessage(null);
    setPasswordSuccess(false);

    if (newPassword !== confirmPassword) {
      setPasswordMessage("Passwords don't match");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordMessage("Password must be at least 8 characters");
      return;
    }

    setPasswordSaving(true);

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setPasswordMessage(error.message);
    } else {
      setPasswordMessage("Password saved successfully");
      setPasswordSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
    }
    setPasswordSaving(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be less than 2MB");
      return;
    }

    setAvatarUploading(true);

    try {
      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${profile.id}/avatar.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`;

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrl })
        .eq("id", profile.id);

      if (updateError) throw updateError;

      // Update local state
      setProfile({ ...profile, avatar_url: avatarUrl });
      router.refresh();
    } catch (error) {
      console.error("Error uploading avatar:", error);
      const message = error instanceof Error ? error.message : "Unknown error";
      alert(`Failed to upload avatar: ${message}`);
    } finally {
      setAvatarUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleAvatarRemove = async () => {
    if (!profile?.avatar_url) return;

    setAvatarUploading(true);

    try {
      // Extract file path from URL
      const url = new URL(profile.avatar_url);
      const pathMatch = url.pathname.match(/\/avatars\/(.+)/);
      if (pathMatch) {
        const filePath = pathMatch[1].split("?")[0];
        await supabase.storage.from("avatars").remove([filePath]);
      }

      // Clear avatar URL in profile
      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: null })
        .eq("id", profile.id);

      if (error) throw error;

      setProfile({ ...profile, avatar_url: null });
      router.refresh();
    } catch (error) {
      console.error("Error removing avatar:", error);
      const message = error instanceof Error ? error.message : "Unknown error";
      alert(`Failed to remove avatar: ${message}`);
    } finally {
      setAvatarUploading(false);
    }
  };

  return (
    <div className="pt-16 lg:pt-0 lg:h-screen lg:overflow-auto">
      <div className="max-w-3xl mx-auto px-6 py-8 lg:py-10 xl:py-14 space-y-6">
        <h1 className="text-2xl md:text-3xl lg:text-4xl">Settings</h1>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4 text-teal" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                {profile?.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.display_name || "User"}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      disabled={avatarUploading}
                      className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-teal text-teal-foreground flex items-center justify-center hover:bg-teal/90 transition-colors disabled:opacity-50"
                    >
                      {avatarUploading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Pencil className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImagePlus className="mr-2 h-4 w-4" />
                      {profile?.avatar_url ? "Change photo" : "Upload photo"}
                    </DropdownMenuItem>
                    {profile?.avatar_url && (
                      <DropdownMenuItem
                        onClick={handleAvatarRemove}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove photo
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
              <div>
                <p className="font-medium">{displayName || "No name set"}</p>
                <p className="text-sm text-muted-foreground">{email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">Full name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stageName">Stage name</Label>
              <Input
                id="stageName"
                value={stageName}
                onChange={(e) => setStageName(e.target.value)}
                placeholder="Your stage name (optional)"
              />
            </div>

            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-teal" />
              Password
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Set or change your password to sign in without a Magic Link.
            </p>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
              />
            </div>

            {passwordMessage && (
              <p
                className={`text-sm ${passwordSuccess ? "text-teal" : "text-destructive"}`}
              >
                {passwordMessage}
              </p>
            )}

            <Button
              onClick={handleSetPassword}
              disabled={passwordSaving || !newPassword || !confirmPassword}
            >
              {passwordSaving ? "Saving..." : "Save Password"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="h-4 w-4 text-teal" />
              Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-3">
                Permanently delete your account and all your data. This action
                cannot be undone.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={deleting}>
                    {deleting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Deleting...
                      </>
                    ) : (
                      "Delete Account"
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete your account and all your
                      data, including all sessions and drafts. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-destructive text-white hover:bg-destructive/90"
                    >
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
