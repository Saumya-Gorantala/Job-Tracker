import { 
  Briefcase, 
  Calendar, 
  Gift, 
  Bell,
  TrendingUp,
  Clock
} from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/context/AppContext";
import { ApplicationStatus, formatSalary } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const Dashboard = () => {
  const { applications, reminders } = useApp();

  const getStatusCounts = (): Record<ApplicationStatus, number> => {
    return {
      saved: applications.filter(app => app.status === 'saved').length,
      applied: applications.filter(app => app.status === 'applied').length,
      interview: applications.filter(app => app.status === 'interview').length,
      offer: applications.filter(app => app.status === 'offer').length,
      rejected: applications.filter(app => app.status === 'rejected').length,
    };
  };

  const statusCounts = getStatusCounts();

  const upcomingInterviews = applications
    .filter(app => app.status === 'interview' && app.interviewDate && app.interviewStatus === 'upcoming')
    .sort((a, b) => (a.interviewDate!.getTime() - b.interviewDate!.getTime()))
    .slice(0, 5);

  const pendingReminders = reminders.filter(r => !r.completed).sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 5);

  const totalApplications = applications.length;

  const recentActivity = applications
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Track your internship applications at a glance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Applications"
          value={totalApplications}
          description="Across all stages"
          icon={Briefcase}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Interviews Scheduled"
          value={statusCounts.interview}
          description="Upcoming interviews"
          icon={Calendar}
          iconClassName="bg-status-interview/20 text-status-interview"
        />
        <StatsCard
          title="Offers Received"
          value={statusCounts.offer}
          description="Congratulations!"
          icon={Gift}
          iconClassName="bg-status-offer/20 text-status-offer"
        />
        <StatsCard
          title="Pending Follow-ups"
          value={pendingReminders.length}
          description="Tasks to complete"
          icon={Bell}
          iconClassName="bg-status-applied/20 text-status-applied"
        />
      </div>

      {/* Mini Kanban Preview */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Application Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {(Object.keys(statusCounts) as Array<keyof typeof statusCounts>).map((status) => (
              <div 
                key={status}
                className={cn(
                  "flex min-w-[140px] flex-col items-center rounded-xl border-2 p-4 transition-all duration-300 hover:scale-105",
                  status === 'saved' && "border-status-saved/30 bg-status-saved/10",
                  status === 'applied' && "border-status-applied/30 bg-status-applied/10",
                  status === 'interview' && "border-status-interview/30 bg-status-interview/10",
                  status === 'offer' && "border-status-offer/30 bg-status-offer/10",
                  status === 'rejected' && "border-status-rejected/30 bg-status-rejected/10",
                )}
              >
                <div className={cn(
                  "mb-2 h-3 w-3 rounded-full",
                  status === 'saved' && "bg-status-saved",
                  status === 'applied' && "bg-status-applied",
                  status === 'interview' && "bg-status-interview",
                  status === 'offer' && "bg-status-offer",
                  status === 'rejected' && "bg-status-rejected",
                )} />
                <span className="text-2xl font-bold text-foreground">
                  {statusCounts[status]}
                </span>
                <span className="text-xs capitalize text-muted-foreground">
                  {status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Interviews */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Upcoming Interviews
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingInterviews.length > 0 ? (
              upcomingInterviews.map((interview) => (
                <div 
                  key={interview.id}
                  className="group flex items-center justify-between rounded-lg border border-border p-3 transition-all duration-200 hover:border-primary/50 hover:bg-accent"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-status-interview/20 text-status-interview font-semibold">
                      {interview.company.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{interview.company}</p>
                      <p className="text-sm text-muted-foreground">{interview.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">
                      {interview.interviewDate && format(interview.interviewDate, "MMM d")}
                    </p>
                    <Badge variant="outline" className="capitalize">
                      {interview.interviewType}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No upcoming interviews
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((app) => (
              <div 
                key={app.id}
                className="group flex items-center justify-between rounded-lg border border-border p-3 transition-all duration-200 hover:border-primary/50 hover:bg-accent"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg font-semibold text-white",
                    app.status === 'saved' && "bg-status-saved",
                    app.status === 'applied' && "bg-status-applied",
                    app.status === 'interview' && "bg-status-interview",
                    app.status === 'offer' && "bg-status-offer",
                    app.status === 'rejected' && "bg-status-rejected",
                  )}>
                    {app.company.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{app.company}</p>
                    <p className="text-sm text-muted-foreground">{app.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="capitalize" variant="secondary">
                    {app.status}
                  </Badge>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatSalary(app.salary)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
