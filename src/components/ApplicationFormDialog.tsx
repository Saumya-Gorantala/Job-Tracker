import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useApp, ExtendedApplication, JobMode } from "@/context/AppContext";
import { ApplicationStatus, JobCategory } from "@/data/mockData";
import { cn } from "@/lib/utils";

const categories: JobCategory[] = [
  "Software Developer",
  "Design",
  "Data",
  "Product",
  "Marketing",
  "Other",
];

const statuses: ApplicationStatus[] = [
  "saved",
  "applied",
  "interview",
  "offer",
  "rejected",
];

const jobModes: { value: JobMode; label: string }[] = [
  { value: "onsite", label: "On-site" },
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
];

interface ApplicationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application?: ExtendedApplication | null;
}

export function ApplicationFormDialog({
  open,
  onOpenChange,
  application,
}: ApplicationFormDialogProps) {
  const { addApplication, updateApplication } = useApp();
  const isEditing = !!application;

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    location: "",
    salary: "",
    category: "" as JobCategory | "",
    status: "saved" as ApplicationStatus,
    jobMode: "onsite" as JobMode,
    dateApplied: new Date(),
    notes: "",
    jobDescriptionLink: "",
    resumeVersion: "v2.1",
  });

  useEffect(() => {
    if (application) {
      setFormData({
        company: application.company,
        role: application.role,
        location: application.location,
        salary: application.salary.toString(),
        category: application.category,
        status: application.status,
        jobMode: application.jobMode || "onsite",
        dateApplied: application.dateApplied || application.createdAt,
        notes: application.notes || "",
        jobDescriptionLink: application.jobDescriptionLink || "",
        resumeVersion: application.resumeVersion,
      });
    } else {
      setFormData({
        company: "",
        role: "",
        location: "",
        salary: "",
        category: "",
        status: "saved",
        jobMode: "onsite",
        dateApplied: new Date(),
        notes: "",
        jobDescriptionLink: "",
        resumeVersion: "v2.1",
      });
    }
  }, [application, open]);

  const handleSubmit = () => {
    if (!formData.company || !formData.role || !formData.category) {
      return;
    }

    const appData = {
      company: formData.company,
      role: formData.role,
      location: formData.location,
      salary: parseInt(formData.salary) || 0,
      category: formData.category as JobCategory,
      status: formData.status,
      jobMode: formData.jobMode,
      dateApplied: formData.dateApplied,
      notes: formData.notes,
      jobDescriptionLink: formData.jobDescriptionLink,
      resumeVersion: formData.resumeVersion,
    };

    if (isEditing && application) {
      updateApplication(application.id, appData);
    } else {
      addApplication(appData);
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Application" : "Add New Application"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the job application details." : "Track a new job application. Fill in the details below."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="company">Company *</Label>
            <Input
              id="company"
              placeholder="e.g., Google"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Role *</Label>
            <Input
              id="role"
              placeholder="e.g., Software Engineer Intern"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., San Francisco, CA"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="salary">Salary (per year)</Label>
              <Input
                id="salary"
                type="number"
                placeholder="e.g., 100000"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(v) => setFormData({ ...formData, category: v as JobCategory })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(v) => setFormData({ ...formData, status: v as ApplicationStatus })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      <span className="capitalize">{status}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="jobMode">Job Mode</Label>
              <Select
                value={formData.jobMode}
                onValueChange={(v) => setFormData({ ...formData, jobMode: v as JobMode })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  {jobModes.map((mode) => (
                    <SelectItem key={mode.value} value={mode.value}>
                      {mode.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Date Applied</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.dateApplied && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dateApplied ? format(formData.dateApplied, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.dateApplied}
                    onSelect={(date) => date && setFormData({ ...formData, dateApplied: date })}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="jobLink">Job Description Link</Label>
            <Input
              id="jobLink"
              type="url"
              placeholder="https://..."
              value={formData.jobDescriptionLink}
              onChange={(e) => setFormData({ ...formData, jobDescriptionLink: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this application..."
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {isEditing ? "Save Changes" : "Add Application"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
