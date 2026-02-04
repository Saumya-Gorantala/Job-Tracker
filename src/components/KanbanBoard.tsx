import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { ApplicationCard } from "@/components/ApplicationCard";
import { ExtendedApplication } from "@/context/AppContext";
import { ApplicationStatus } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface KanbanBoardProps {
  applications: ExtendedApplication[];
  onApplicationMove?: (
    applicationId: string,
    newStatus: ApplicationStatus
  ) => void;
  onEditApplication?: (application: ExtendedApplication) => void;
}

const columns: { id: ApplicationStatus; title: string }[] = [
  { id: "saved", title: "Saved" },
  { id: "applied", title: "Applied" },
  { id: "interview", title: "Interview" },
  { id: "offer", title: "Offer" },
  { id: "rejected", title: "Rejected" },
];

export function KanbanBoard({
  applications,
  onApplicationMove,
  onEditApplication,
}: KanbanBoardProps) {
  const [localApplications, setLocalApplications] =
    useState<ExtendedApplication[]>(applications);

  // Sync with prop changes
  useState(() => {
    setLocalApplications(applications);
  });

  const getApplicationsByStatus = (status: ApplicationStatus) => {
    return applications.filter((app) => app.status === status);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      // Moving to a different column
      const newStatus = destination.droppableId as ApplicationStatus;
      onApplicationMove?.(draggableId, newStatus);
    }
  };

  const getColumnColor = (status: ApplicationStatus) => {
    const colors: Record<ApplicationStatus, string> = {
      saved: "bg-status-saved/10 border-status-saved/30",
      applied: "bg-status-applied/10 border-status-applied/30",
      interview: "bg-status-interview/10 border-status-interview/30",
      offer: "bg-status-offer/10 border-status-offer/30",
      rejected: "bg-status-rejected/10 border-status-rejected/30",
    };
    return colors[status];
  };

  const getHeaderColor = (status: ApplicationStatus) => {
    const colors: Record<ApplicationStatus, string> = {
      saved: "bg-status-saved",
      applied: "bg-status-applied",
      interview: "bg-status-interview",
      offer: "bg-status-offer",
      rejected: "bg-status-rejected",
    };
    return colors[status];
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
        {columns.map((column) => {
          const columnApps = getApplicationsByStatus(column.id);
          return (
            <div
              key={column.id}
              className={cn(
                "flex w-72 shrink-0 flex-col rounded-xl border-2 transition-all duration-300",
                getColumnColor(column.id)
              )}
            >
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "h-3 w-3 rounded-full",
                      getHeaderColor(column.id)
                    )}
                  />
                  <h3 className="font-semibold text-foreground">
                    {column.title}
                  </h3>
                </div>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-background text-xs font-medium">
                  {columnApps.length}
                </span>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "flex-1 space-y-3 p-3 pt-0 transition-all duration-200",
                      snapshot.isDraggingOver && "bg-primary/5 ring-2 ring-primary/20 ring-inset rounded-b-xl"
                    )}
                    style={{ minHeight: "200px" }}
                  >
                    {columnApps.map((app, index) => (
                      <Draggable
                        key={app.id}
                        draggableId={app.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                          >
                            <ApplicationCard
                              application={app}
                              isDragging={snapshot.isDragging}
                              dragHandleProps={provided.dragHandleProps as React.HTMLAttributes<HTMLDivElement>}
                              onEdit={onEditApplication ? () => onEditApplication(app) : undefined}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
