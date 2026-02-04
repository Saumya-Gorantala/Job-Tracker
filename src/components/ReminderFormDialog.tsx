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
import { useApp } from "@/context/AppContext";
import { Reminder } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface ReminderFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reminder?: Reminder | null;
}

export function ReminderFormDialog({
  open,
  onOpenChange,
  reminder,
}: ReminderFormDialogProps) {
  const { addReminder, updateReminder, applications } = useApp();
  const isEditing = !!reminder;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date(),
    category: "follow-up" as Reminder["category"],
    applicationId: "",
  });

  useEffect(() => {
    if (reminder) {
      setFormData({
        title: reminder.title,
        description: reminder.description || "",
        date: reminder.date,
        category: reminder.category,
        applicationId: reminder.applicationId || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        date: new Date(),
        category: "follow-up",
        applicationId: "",
      });
    }
  }, [reminder, open]);

  const handleSubmit = () => {
    if (!formData.title) {
      return;
    }

    const reminderData = {
      title: formData.title,
      description: formData.description || undefined,
      date: formData.date,
      category: formData.category,
      applicationId: formData.applicationId || undefined,
      completed: reminder?.completed || false,
    };

    if (isEditing && reminder) {
      updateReminder(reminder.id, reminderData);
    } else {
      addReminder(reminderData);
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Reminder" : "Add New Reminder"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the reminder details." : "Create a reminder to stay organized."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Follow up with recruiter"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add details..."
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => date && setFormData({ ...formData, date })}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(v) => setFormData({ ...formData, category: v as Reminder["category"] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="follow-up">Follow-up</SelectItem>
                  <SelectItem value="deadline">Deadline</SelectItem>
                  <SelectItem value="interview-prep">Interview Prep</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="application">Link to Application (optional)</Label>
            <Select
              value={formData.applicationId}
              onValueChange={(v) => setFormData({ ...formData, applicationId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select application" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {applications.map((app) => (
                  <SelectItem key={app.id} value={app.id}>
                    {app.company} - {app.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {isEditing ? "Save Changes" : "Add Reminder"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
