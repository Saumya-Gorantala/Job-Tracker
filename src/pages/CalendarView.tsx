import { useState } from "react";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday
} from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Video, Bell, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useApp } from "@/context/AppContext";
import { CalendarEvent } from "@/data/mockData";
import { cn } from "@/lib/utils";

const CalendarView = () => {
  const { applications, reminders } = useApp();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Generate calendar events from applications and reminders
  const events: CalendarEvent[] = [
    ...applications
      .filter((app) => app.interviewDate)
      .map((app) => ({
        id: `interview-${app.id}`,
        title: `${app.company} Interview`,
        date: app.interviewDate!,
        type: "interview" as const,
        applicationId: app.id,
      })),
    ...reminders.map((reminder) => ({
      id: `reminder-${reminder.id}`,
      title: reminder.title,
      date: reminder.date,
      type: reminder.category === "deadline" ? "deadline" as const : "reminder" as const,
      reminderId: reminder.id,
    })),
  ];

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Pad days to start from Sunday
  const startDay = monthStart.getDay();
  const paddedDays = Array(startDay).fill(null).concat(days);

  const getEventsForDay = (date: Date) => {
    return events.filter((event) => isSameDay(event.date, date));
  };

  const getEventColor = (type: CalendarEvent["type"]) => {
    switch (type) {
      case "interview":
        return "bg-status-interview text-white";
      case "reminder":
        return "bg-status-applied text-white";
      case "deadline":
        return "bg-status-rejected text-white";
    }
  };

  const getEventIcon = (type: CalendarEvent["type"]) => {
    switch (type) {
      case "interview":
        return <Video className="h-3 w-3" />;
      case "reminder":
        return <Bell className="h-3 w-3" />;
      case "deadline":
        return <Clock className="h-3 w-3" />;
    }
  };

  const handleDayClick = (date: Date) => {
    const dayEvents = getEventsForDay(date);
    if (dayEvents.length > 0) {
      setSelectedDate(date);
      setIsDialogOpen(true);
    }
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
        <p className="text-muted-foreground">
          View your interviews, reminders, and deadlines
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            {format(currentMonth, "MMMM yyyy")}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentMonth(new Date())}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Week days header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="p-2 text-center text-sm font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {paddedDays.map((day, index) => {
              if (!day) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const dayEvents = getEventsForDay(day);
              const hasEvents = dayEvents.length > 0;

              return (
                <div
                  key={day.toISOString()}
                  onClick={() => handleDayClick(day)}
                  className={cn(
                    "aspect-square p-1 rounded-lg border border-transparent transition-all duration-200 cursor-pointer",
                    !isSameMonth(day, currentMonth) && "opacity-40",
                    isToday(day) && "border-primary bg-primary/5",
                    hasEvents && "hover:border-primary/50 hover:bg-accent"
                  )}
                >
                  <div className="h-full flex flex-col">
                    <span
                      className={cn(
                        "text-sm font-medium text-center",
                        isToday(day) && "text-primary font-bold"
                      )}
                    >
                      {format(day, "d")}
                    </span>
                    <div className="flex-1 flex flex-col gap-0.5 mt-1 overflow-hidden">
                      {dayEvents.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className={cn(
                            "flex items-center gap-1 rounded px-1 py-0.5 text-xs truncate",
                            getEventColor(event.type)
                          )}
                        >
                          {getEventIcon(event.type)}
                          <span className="truncate hidden sm:inline">{event.title}</span>
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <span className="text-xs text-muted-foreground text-center">
                          +{dayEvents.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap items-center gap-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-status-interview" />
              <span className="text-sm text-muted-foreground">Interview</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-status-applied" />
              <span className="text-sm text-muted-foreground">Reminder</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-status-rejected" />
              <span className="text-sm text-muted-foreground">Deadline</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Day Events Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Events for {selectedDate && format(selectedDate, "MMMM d, yyyy")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {selectedDate &&
              getEventsForDay(selectedDate).map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-3 rounded-lg border border-border p-3 transition-all hover:bg-accent"
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg",
                      event.type === "interview" && "bg-status-interview/20 text-status-interview",
                      event.type === "reminder" && "bg-status-applied/20 text-status-applied",
                      event.type === "deadline" && "bg-status-rejected/20 text-status-rejected"
                    )}
                  >
                    {getEventIcon(event.type)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{event.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="capitalize">
                        {event.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {format(event.date, "h:mm a")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarView;
