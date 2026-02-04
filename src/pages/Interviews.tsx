import { useState } from "react";
import { format } from "date-fns";
import { 
  Video, 
  Phone, 
  MapPin, 
  Calendar as CalendarIcon,
  Clock,
  FileText,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Pencil
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InterviewFormDialog } from "@/components/InterviewFormDialog";
import { useApp, ExtendedApplication } from "@/context/AppContext";
import { InterviewStatus } from "@/data/mockData";
import { cn } from "@/lib/utils";

const Interviews = () => {
  const { applications } = useApp();
  const [activeTab, setActiveTab] = useState<InterviewStatus | "all">("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState<ExtendedApplication | null>(null);

  // Get only applications with interview status
  const interviews = applications.filter(
    (app) => app.status === "interview" && app.interviewDate
  );

  const filteredInterviews =
    activeTab === "all"
      ? interviews
      : interviews.filter((i) => i.interviewStatus === activeTab);

  const getInterviewIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-5 w-5" />;
      case "phone":
        return <Phone className="h-5 w-5" />;
      case "onsite":
        return <MapPin className="h-5 w-5" />;
      default:
        return <CalendarIcon className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: InterviewStatus) => {
    const styles: Record<InterviewStatus, string> = {
      upcoming: "bg-status-interview/20 text-status-interview border-status-interview/30",
      completed: "bg-status-offer/20 text-status-offer border-status-offer/30",
      cancelled: "bg-status-rejected/20 text-status-rejected border-status-rejected/30",
    };
    return styles[status];
  };

  const handleEditInterview = (interview: ExtendedApplication) => {
    setEditingInterview(interview);
    setIsDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingInterview(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Interviews</h1>
          <p className="text-muted-foreground">
            Manage and track your scheduled interviews
          </p>
        </div>
        <Button 
          className="gap-2 shadow-lg hover:shadow-purple-glow transition-shadow"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add Interview
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as InterviewStatus | "all")}>
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredInterviews.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredInterviews.map((interview) => (
                <HoverCard key={interview.id} openDelay={300} closeDelay={100}>
                  <HoverCardTrigger asChild>
                    <Card className="group cursor-pointer transition-all duration-300 hover-lift hover:shadow-card-hover">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                              {getInterviewIcon(interview.interviewType || "video")}
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">
                                {interview.company}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {interview.role}
                              </p>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditInterview(interview)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit Interview
                              </DropdownMenuItem>
                              <DropdownMenuItem>Reschedule</DropdownMenuItem>
                              <DropdownMenuItem>Add Notes</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="mt-4 space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-foreground">
                              {interview.interviewDate &&
                                format(interview.interviewDate, "EEEE, MMMM d, yyyy")}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-foreground">
                              {interview.interviewDate &&
                                format(interview.interviewDate, "h:mm a")}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={cn("capitalize", getStatusBadge(interview.interviewStatus!))}
                            >
                              {interview.interviewStatus}
                            </Badge>
                            <Badge variant="secondary" className="capitalize">
                              {interview.interviewType}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </HoverCardTrigger>

                  <HoverCardContent side="right" className="w-80 animate-scale-in">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold">{interview.company}</h4>
                        <p className="text-sm text-muted-foreground">{interview.role}</p>
                      </div>

                      {interview.recruiterName && (
                        <div className="text-sm">
                          <p className="text-muted-foreground">Recruiter:</p>
                          <p className="font-medium">{interview.recruiterName}</p>
                          {interview.recruiterEmail && (
                            <p className="text-muted-foreground">{interview.recruiterEmail}</p>
                          )}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleEditInterview(interview)}
                        >
                          <Pencil className="mr-2 h-3 w-3" />
                          Edit
                        </Button>
                        <Button variant="default" size="sm" className="flex-1">
                          <MessageSquare className="mr-2 h-3 w-3" />
                          Notes
                        </Button>
                      </div>

                      {interview.notes && (
                        <div className="rounded-lg bg-muted p-3">
                          <p className="text-sm text-muted-foreground">{interview.notes}</p>
                        </div>
                      )}
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <CalendarIcon className="h-16 w-16 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium text-foreground">
                No interviews found
              </h3>
              <p className="mt-1 text-muted-foreground">
                {activeTab === "all"
                  ? "You don't have any interviews scheduled yet."
                  : `No ${activeTab} interviews.`}
              </p>
              <Button 
                className="mt-4 gap-2"
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Schedule Interview
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Interview Form Dialog */}
      <InterviewFormDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        application={editingInterview}
      />
    </div>
  );
};

export default Interviews;
