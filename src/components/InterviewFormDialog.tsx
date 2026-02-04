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
import { useApp, ExtendedApplication } from "@/context/AppContext";
import { InterviewType, InterviewStatus } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface InterviewFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application?: ExtendedApplication | null;
}

const interviewTypes: { value: InterviewType; label: string }[] = [
  { value: "phone", label: "Phone" },
  { value: "video", label: "Video" },
  { value: "onsite", label: "On-site" },
];

const interviewStatuses: { value: InterviewStatus; label: string }[] = [
  { value: "upcoming", label: "Upcoming" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export function InterviewFormDialog({
  open,
  onOpenChange,
  application,
}: InterviewFormDialogProps) {
  const { updateApplication, applications } = useApp();
  const isEditing = !!application?.interviewDate;

  const [selectedAppId, setSelectedAppId] = useState("");
  const [formData, setFormData] = useState({
    interviewDate: new Date(),
    interviewTime: "10:00",
    interviewType: "video" as InterviewType,
    interviewStatus: "upcoming" as InterviewStatus,
    recruiterName: "",
    recruiterEmail: "",
    notes: "",
  });

  useEffect(() => {
    if (application) {
      setSelectedAppId(application.id);
      const interviewDate = application.interviewDate || new Date();
      setFormData({
        interviewDate,
        interviewTime: format(interviewDate, "HH:mm"),
        interviewType: application.interviewType || "video",
        interviewStatus: application.interviewStatus || "upcoming",
        recruiterName: application.recruiterName || "",
        recruiterEmail: application.recruiterEmail || "",
        notes: application.notes || "",
      });
    } else {
      setSelectedAppId("");
      setFormData({
        interviewDate: new Date(),
        interviewTime: "10:00",
        interviewType: "video",
        interviewStatus: "upcoming",
        recruiterName: "",
        recruiterEmail: "",
        notes: "",
      });
    }
  }, [application, open]);

  const handleSubmit = () => {
    const appId = application?.id || selectedAppId;
    if (!appId) {
      return;
    }

    // Combine date and time
    const [hours, minutes] = formData.interviewTime.split(":").map(Number);
    const interviewDateTime = new Date(formData.interviewDate);
    interviewDateTime.setHours(hours, minutes, 0, 0);

    updateApplication(appId, {
      status: "interview",
      interviewDate: interviewDateTime,
      interviewType: formData.interviewType,
      interviewStatus: formData.interviewStatus,
      recruiterName: formData.recruiterName || undefined,
      recruiterEmail: formData.recruiterEmail || undefined,
      notes: formData.notes || undefined,
    });

    onOpenChange(false);
  };

  // Filter to only show applications that don't already have interviews (for new interviews)
  const availableApplications = applications.filter(
    (app) => !app.interviewDate || app.id === application?.id
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Interview" : "Schedule Interview"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the interview details." : "Add interview details for an application."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {!application && (
            <div className="grid gap-2">
              <Label htmlFor="application">Select Application *</Label>
              <Select
                value={selectedAppId}
                onValueChange={setSelectedAppId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose an application" />
                </SelectTrigger>
                <SelectContent>
                  {availableApplications.map((app) => (
                    <SelectItem key={app.id} value={app.id}>
                      {app.company} - {app.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {application && (
            <div className="rounded-lg bg-muted p-3">
              <p className="font-medium">{application.company}</p>
              <p className="text-sm text-muted-foreground">{application.role}</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Interview Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.interviewDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.interviewDate ? format(formData.interviewDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.interviewDate}
                    onSelect={(date) => date && setFormData({ ...formData, interviewDate: date })}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={formData.interviewTime}
                onChange={(e) => setFormData({ ...formData, interviewTime: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Interview Type</Label>
              <Select
                value={formData.interviewType}
                onValueChange={(v) => setFormData({ ...formData, interviewType: v as InterviewType })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {interviewTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.interviewStatus}
                onValueChange={(v) => setFormData({ ...formData, interviewStatus: v as InterviewStatus })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {interviewStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="recruiterName">Recruiter Name</Label>
              <Input
                id="recruiterName"
                placeholder="e.g., John Smith"
                value={formData.recruiterName}
                onChange={(e) => setFormData({ ...formData, recruiterName: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="recruiterEmail">Recruiter Email</Label>
              <Input
                id="recruiterEmail"
                type="email"
                placeholder="e.g., john@company.com"
                value={formData.recruiterEmail}
                onChange={(e) => setFormData({ ...formData, recruiterEmail: e.target.value })}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this interview..."
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
            {isEditing ? "Save Changes" : "Schedule Interview"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
