import { useState } from "react";
import { format, isToday, isTomorrow, isPast } from "date-fns";
import { 
  Plus, 
  Bell, 
  Clock, 
  Calendar, 
  FileText,
  Check,
  X,
  AlarmClock,
  Pencil
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ReminderFormDialog } from "@/components/ReminderFormDialog";
import { useApp } from "@/context/AppContext";
import { Reminder } from "@/data/mockData";
import { cn } from "@/lib/utils";

const Reminders = () => {
  const { reminders, applications, toggleReminderComplete } = useApp();
  const [showCompleted, setShowCompleted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);

  const filteredReminders = reminders.filter((r) =>
    showCompleted ? true : !r.completed
  );

  const sortedReminders = filteredReminders.sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  const getCategoryIcon = (category: Reminder["category"]) => {
    switch (category) {
      case "follow-up":
        return <Bell className="h-4 w-4" />;
      case "deadline":
        return <Clock className="h-4 w-4" />;
      case "interview-prep":
        return <FileText className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: Reminder["category"]) => {
    switch (category) {
      case "follow-up":
        return "bg-status-applied/20 text-status-applied border-status-applied/30";
      case "deadline":
        return "bg-status-rejected/20 text-status-rejected border-status-rejected/30";
      case "interview-prep":
        return "bg-status-interview/20 text-status-interview border-status-interview/30";
    }
  };

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    if (isPast(date)) return "Overdue";
    return format(date, "MMM d");
  };

  const getLinkedApplication = (applicationId?: string) => {
    if (!applicationId) return null;
    return applications.find((a) => a.id === applicationId);
  };

  const handleEditReminder = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setIsDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingReminder(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reminders</h1>
          <p className="text-muted-foreground">
            Stay on top of your follow-ups and deadlines
          </p>
        </div>
        <Button 
          className="gap-2 shadow-lg hover:shadow-purple-glow transition-shadow"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add Reminder
        </Button>
      </div>

      {/* Toggle */}
      <div className="flex items-center gap-3">
        <Switch
          id="show-completed"
          checked={showCompleted}
          onCheckedChange={setShowCompleted}
        />
        <Label htmlFor="show-completed" className="text-sm text-muted-foreground">
          Show completed reminders
        </Label>
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {sortedReminders.length > 0 ? (
          sortedReminders.map((reminder) => {
            const linkedApp = getLinkedApplication(reminder.applicationId);
            const isOverdue = isPast(reminder.date) && !reminder.completed;

            return (
              <HoverCard key={reminder.id} openDelay={300} closeDelay={100}>
                <HoverCardTrigger asChild>
                  <Card
                    className={cn(
                      "group cursor-pointer transition-all duration-300 hover-lift",
                      reminder.completed && "opacity-60"
                    )}
                  >
                    <CardContent className="flex items-center gap-4 p-4">
                      <Button
                        variant="outline"
                        size="icon"
                        className={cn(
                          "h-8 w-8 shrink-0 rounded-full transition-all",
                          reminder.completed &&
                            "bg-status-offer text-white border-status-offer"
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleReminderComplete(reminder.id);
                        }}
                      >
                        {reminder.completed && <Check className="h-4 w-4" />}
                      </Button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3
                            className={cn(
                              "font-medium text-foreground",
                              reminder.completed && "line-through"
                            )}
                          >
                            {reminder.title}
                          </h3>
                          {isOverdue && (
                            <Badge variant="destructive" className="text-xs">
                              Overdue
                            </Badge>
                          )}
                        </div>
                        {reminder.description && (
                          <p className="mt-1 text-sm text-muted-foreground truncate">
                            {reminder.description}
                          </p>
                        )}
                        {linkedApp && (
                          <p className="mt-1 text-xs text-primary">
                            Linked: {linkedApp.company} - {linkedApp.role}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <Badge
                          variant="outline"
                          className={cn("gap-1", getCategoryColor(reminder.category))}
                        >
                          {getCategoryIcon(reminder.category)}
                          <span className="capitalize">
                            {reminder.category.replace("-", " ")}
                          </span>
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span
                            className={cn(
                              isOverdue && "text-status-rejected font-medium"
                            )}
                          >
                            {getDateLabel(reminder.date)}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditReminder(reminder);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </HoverCardTrigger>

                <HoverCardContent side="right" className="w-64 animate-scale-in">
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => toggleReminderComplete(reminder.id)}
                      >
                        {reminder.completed ? (
                          <>
                            <X className="mr-1 h-3 w-3" /> Undo
                          </>
                        ) : (
                          <>
                            <Check className="mr-1 h-3 w-3" /> Complete
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleEditReminder(reminder)}
                      >
                        <Pencil className="mr-1 h-3 w-3" /> Edit
                      </Button>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Bell className="h-16 w-16 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium text-foreground">
              No reminders
            </h3>
            <p className="mt-1 text-muted-foreground">
              {showCompleted
                ? "You haven't created any reminders yet."
                : "All reminders are completed. Great job!"}
            </p>
          </div>
        )}
      </div>

      {/* Reminder Form Dialog */}
      <ReminderFormDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        reminder={editingReminder}
      />
    </div>
  );
};

export default Reminders;
