import { useState } from "react";
import { Plus, Filter, Search, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KanbanBoard } from "@/components/KanbanBoard";
import { ApplicationFormDialog } from "@/components/ApplicationFormDialog";
import { useApp, ExtendedApplication } from "@/context/AppContext";
import { JobCategory, ApplicationStatus } from "@/data/mockData";

const categories: JobCategory[] = [
  "Software Developer",
  "Design",
  "Data",
  "Product",
  "Marketing",
  "Other",
];

const Jobs = () => {
  const { applications, updateApplication } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<ExtendedApplication | null>(null);

  // Get unique locations from applications
  const locations = [...new Set(applications.map((app) => app.location))];

  // Filter applications
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || app.category === categoryFilter;
    const matchesLocation =
      locationFilter === "all" || app.location === locationFilter;
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const handleApplicationMove = (
    applicationId: string,
    newStatus: ApplicationStatus
  ) => {
    updateApplication(applicationId, { status: newStatus });
  };

  const handleEditApplication = (application: ExtendedApplication) => {
    setEditingApplication(application);
    setIsDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingApplication(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Jobs</h1>
          <p className="text-muted-foreground">
            Manage your job applications with drag & drop
          </p>
        </div>
        <Button 
          className="gap-2 shadow-lg hover:shadow-purple-glow transition-shadow"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add Application
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search companies or roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locations.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Kanban Board */}
      <KanbanBoard
        applications={filteredApplications}
        onApplicationMove={handleApplicationMove}
        onEditApplication={handleEditApplication}
      />

      {/* Application Form Dialog */}
      <ApplicationFormDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        application={editingApplication}
      />
    </div>
  );
};

export default Jobs;
