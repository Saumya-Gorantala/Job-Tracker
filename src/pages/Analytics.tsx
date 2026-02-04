import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Target,
  FileText,
  Award
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { ApplicationStatus } from "@/data/mockData";
import { cn } from "@/lib/utils";

const Analytics = () => {
  const { applications, resumeVersions } = useApp();

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
  const totalApplications = applications.length;

  // Pie chart data
  const pieData = [
    { name: "Saved", value: statusCounts.saved, color: "hsl(220, 15%, 50%)" },
    { name: "Applied", value: statusCounts.applied, color: "hsl(210, 90%, 55%)" },
    { name: "Interview", value: statusCounts.interview, color: "hsl(262, 83%, 58%)" },
    { name: "Offer", value: statusCounts.offer, color: "hsl(142, 70%, 45%)" },
    { name: "Rejected", value: statusCounts.rejected, color: "hsl(0, 70%, 55%)" },
  ];

  // Line chart data - Applications over time
  const lineData = [
    { month: "Sep", applications: 2 },
    { month: "Oct", applications: 5 },
    { month: "Nov", applications: 8 },
    { month: "Dec", applications: 6 },
    { month: "Jan", applications: 10 },
    { month: "Feb", applications: totalApplications },
  ];

  // Bar chart data - Categories
  const categoryGroups = applications.reduce((acc, app) => {
    acc[app.category] = (acc[app.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(categoryGroups).map(([category, count], index) => ({
    category: category.length > 12 ? category.substring(0, 12) + '...' : category,
    count,
    fill: `hsl(${262 + index * 40}, 83%, 58%)`
  }));


  // Calculate metrics
  const interviewRate = totalApplications > 0
    ? Math.round((statusCounts.interview / (statusCounts.applied + statusCounts.interview + statusCounts.offer + statusCounts.rejected)) * 100)
    : 0;
  const offerRate = statusCounts.interview > 0
    ? Math.round((statusCounts.offer / (statusCounts.interview + statusCounts.offer)) * 100)
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">
          Track your application performance and insights
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="group hover-lift">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Applied</p>
              <p className="text-2xl font-bold">{totalApplications}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="group hover-lift">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-status-interview/20 text-status-interview transition-transform duration-300 group-hover:scale-110">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Interview Rate</p>
              <p className="text-2xl font-bold">{interviewRate}%</p>
            </div>
          </CardContent>
        </Card>
        <Card className="group hover-lift">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-status-offer/20 text-status-offer transition-transform duration-300 group-hover:scale-110">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Offer Rate</p>
              <p className="text-2xl font-bold">{offerRate}%</p>
            </div>
          </CardContent>
        </Card>
        <Card className="group hover-lift">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Resume Versions</p>
              <p className="text-2xl font-bold">{resumeVersions.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Applications by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Applications by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius)'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Applications Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Applications Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius)'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="applications"
                    stroke="hsl(262, 83%, 58%)"
                    strokeWidth={3}
                    dot={{ fill: "hsl(262, 83%, 58%)", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Applications by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                  <YAxis dataKey="category" type="category" stroke="hsl(var(--muted-foreground))" width={100} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius)'
                    }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Interview Conversion Rate */}
      <Card>
        <CardHeader>
          <CardTitle>Interview Conversion Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center p-4 rounded-xl bg-status-applied/10">
              <p className="text-3xl font-bold text-status-applied">
                {statusCounts.applied + statusCounts.interview + statusCounts.offer + statusCounts.rejected}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Applied</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-status-interview/10">
              <p className="text-3xl font-bold text-status-interview">
                {statusCounts.interview + statusCounts.offer}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Got Interview</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-status-offer/10">
              <p className="text-3xl font-bold text-status-offer">
                {statusCounts.offer}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Got Offer</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-primary/10">
              <p className="text-3xl font-bold text-primary">
                {offerRate}%
              </p>
              <p className="text-sm text-muted-foreground mt-1">Success Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
