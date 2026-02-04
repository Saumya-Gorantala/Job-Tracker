import { useState, useRef } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  Linkedin, 
  Bell, 
  Sun, 
  Moon,
  FileText,
  Download,
  Trash2,
  Camera,
  Save,
  Upload
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useApp } from "@/context/AppContext";
import { mockUserProfile } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { resumeVersions, addResumeVersion } = useApp();
  const [profile, setProfile] = useState(mockUserProfile);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Your data is being prepared for download.",
    });
  };

  const handleThemeToggle = (checked: boolean) => {
    setIsDarkMode(checked);
    document.documentElement.classList.toggle("dark", checked);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleUploadResume = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Generate a new version number
      const latestVersion = resumeVersions[0] || "v2.1";
      const versionNum = parseFloat(latestVersion.replace("v", ""));
      const newVersion = `v${(versionNum + 0.1).toFixed(1)}`;
      
      addResumeVersion(newVersion);
      
      toast({
        title: "Resume Uploaded",
        description: `${file.name} has been uploaded as Resume ${newVersion}`,
      });
    }
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <div className="relative group">
              <Avatar className="h-24 w-24 border-4 border-primary/20">
                <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {getInitials(profile.name)}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="secondary"
                size="icon"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-foreground">{profile.name}</h2>
              <p className="text-muted-foreground">{profile.email}</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                {resumeVersions.slice(0, 3).map((version) => (
                  <Badge key={version} variant="secondary">
                    Resume {version}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Update your personal details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  value={profile.phone || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="linkedin"
                  type="url"
                  value={profile.linkedinUrl || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, linkedinUrl: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Preferences
          </CardTitle>
          <CardDescription>
            Customize your notification and display settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isDarkMode ? (
                <Moon className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Sun className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">
                  Switch to dark theme
                </p>
              </div>
            </div>
            <Switch checked={isDarkMode} onCheckedChange={handleThemeToggle} />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive email updates about your applications
              </p>
            </div>
            <Switch
              checked={profile.notifications.email}
              onCheckedChange={(checked) =>
                setProfile({
                  ...profile,
                  notifications: { ...profile.notifications, email: checked },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive push notifications on your device
              </p>
            </div>
            <Switch
              checked={profile.notifications.push}
              onCheckedChange={(checked) =>
                setProfile({
                  ...profile,
                  notifications: { ...profile.notifications, push: checked },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Reminder Alerts</p>
              <p className="text-sm text-muted-foreground">
                Get notified about upcoming reminders
              </p>
            </div>
            <Switch
              checked={profile.notifications.reminders}
              onCheckedChange={(checked) =>
                setProfile({
                  ...profile,
                  notifications: { ...profile.notifications, reminders: checked },
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Resume Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Resume Versions
          </CardTitle>
          <CardDescription>
            Manage your saved resume versions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {resumeVersions.map((version, index) => (
            <div
              key={version}
              className="flex items-center justify-between rounded-lg border border-border p-4 transition-all hover:bg-accent"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Resume {version}</p>
                  <p className="text-sm text-muted-foreground">
                    {index === 0 ? "Latest version" : `Uploaded ${index + 1} versions ago`}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          ))}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            className="hidden"
          />
          <Button variant="outline" className="w-full gap-2" onClick={handleUploadResume}>
            <Upload className="h-4 w-4" />
            Upload New Resume
          </Button>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" onClick={handleExportData} className="w-full gap-2">
            <Download className="h-4 w-4" />
            Export All Data
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full gap-2">
                <Trash2 className="h-4 w-4" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  account and remove all your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
