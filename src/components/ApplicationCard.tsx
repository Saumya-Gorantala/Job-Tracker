import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  DollarSign,
  User,
  Mail,
  FileText,
  ExternalLink,
  GripVertical,
  Pencil,
  Building2
} from "lucide-react";
import { ExtendedApplication } from "@/context/AppContext";
import { formatSalary, getStatusColor } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface ApplicationCardProps {
  application: ExtendedApplication;
  isDragging?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  onEdit?: () => void;
}

export function ApplicationCard({
  application,
  isDragging,
  dragHandleProps,
  onEdit
}: ApplicationCardProps) {
  const statusColor = getStatusColor(application.status);

  const getJobModeLabel = (mode?: string) => {
    switch (mode) {
      case "remote": return "Remote";
      case "hybrid": return "Hybrid";
      case "onsite": return "On-site";
      default: return null;
    }
  };

  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Card
          className={cn(
            "group cursor-pointer border-l-4 transition-all duration-300 hover-lift",
            `border-l-${statusColor}`,
            isDragging && "rotate-2 scale-105 shadow-xl ring-2 ring-primary/50",
            application.status === 'saved' && "border-l-status-saved",
            application.status === 'applied' && "border-l-status-applied",
            application.status === 'interview' && "border-l-status-interview",
            application.status === 'offer' && "border-l-status-offer",
            application.status === 'rejected' && "border-l-status-rejected",
          )}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              {dragHandleProps && (
                <div
                  {...dragHandleProps}
                  className="mt-1 cursor-grab opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground truncate">
                      {application.company}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {application.role}
                    </p>
                    <Badge
                      variant="secondary"
                      className="mt-2 text-[10px] h-4.5 px-1.5 font-medium capitalize"
                    >
                      {application.category}
                    </Badge>
                  </div>
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit();
                      }}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {application.location}
                  </span>
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    <DollarSign className="h-3 w-3" />
                    {formatSalary(application.salary)}
                  </span>
                  {application.jobMode && (
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {getJobModeLabel(application.jobMode)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </HoverCardTrigger>

      <HoverCardContent
        side="right"
        align="start"
        className="w-80 animate-scale-in"
      >
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-foreground">{application.company}</h4>
            <p className="text-sm text-muted-foreground">{application.role}</p>
          </div>

          {application.recruiterName && (
            <div className="space-y-2">
              <h5 className="text-xs font-medium uppercase text-muted-foreground">
                Recruiter
              </h5>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <span className="text-sm">{application.recruiterName}</span>
              </div>
              {application.recruiterEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-sm">{application.recruiterEmail}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <span className="text-sm">Resume: {application.resumeVersion}</span>
          </div>

          {application.notes && (
            <div className="rounded-lg bg-muted p-3">
              <p className="text-sm text-muted-foreground">{application.notes}</p>
            </div>
          )}

          <div className="flex gap-2">
            {application.jobDescriptionLink && (
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <a
                  href={application.jobDescriptionLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-3 w-3" />
                  Job Description
                </a>
              </Button>
            )}
            {onEdit && (
              <Button variant="default" size="sm" className="flex-1" onClick={onEdit}>
                <Pencil className="mr-2 h-3 w-3" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
