import React, { createContext, useContext, useState, ReactNode } from "react";
import { Application, Reminder, mockApplications, mockReminders, ApplicationStatus, JobCategory, InterviewType, InterviewStatus } from "@/data/mockData";

export type JobMode = "onsite" | "remote" | "hybrid";

export interface ExtendedApplication extends Application {
  jobMode?: JobMode;
  dateApplied?: Date;
}

interface AppContextType {
  applications: ExtendedApplication[];
  reminders: Reminder[];
  addApplication: (app: Omit<ExtendedApplication, "id" | "createdAt">) => void;
  updateApplication: (id: string, app: Partial<ExtendedApplication>) => void;
  deleteApplication: (id: string) => void;
  addReminder: (reminder: Omit<Reminder, "id">) => void;
  updateReminder: (id: string, reminder: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  toggleReminderComplete: (id: string) => void;
  resumeVersions: string[];
  addResumeVersion: (version: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<ExtendedApplication[]>(
    mockApplications.map(app => ({ ...app, jobMode: "onsite" as JobMode, dateApplied: app.createdAt }))
  );
  const [reminders, setReminders] = useState<Reminder[]>(mockReminders);
  const [resumeVersions, setResumeVersions] = useState<string[]>(["v1.9", "v2.0", "v2.1"]);

  const addApplication = (app: Omit<ExtendedApplication, "id" | "createdAt">) => {
    const newApp: ExtendedApplication = {
      ...app,
      id: `app-${Date.now()}`,
      createdAt: new Date(),
    };
    setApplications((prev) => [newApp, ...prev]);
  };

  const updateApplication = (id: string, updates: Partial<ExtendedApplication>) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, ...updates } : app))
    );
  };

  const deleteApplication = (id: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
  };

  const addReminder = (reminder: Omit<Reminder, "id">) => {
    const newReminder: Reminder = {
      ...reminder,
      id: `rem-${Date.now()}`,
    };
    setReminders((prev) => [newReminder, ...prev]);
  };

  const updateReminder = (id: string, updates: Partial<Reminder>) => {
    setReminders((prev) =>
      prev.map((rem) => (rem.id === id ? { ...rem, ...updates } : rem))
    );
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((rem) => rem.id !== id));
  };

  const toggleReminderComplete = (id: string) => {
    setReminders((prev) =>
      prev.map((rem) =>
        rem.id === id ? { ...rem, completed: !rem.completed } : rem
      )
    );
  };

  const addResumeVersion = (version: string) => {
    setResumeVersions((prev) => [version, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        applications,
        reminders,
        addApplication,
        updateApplication,
        deleteApplication,
        addReminder,
        updateReminder,
        deleteReminder,
        toggleReminderComplete,
        resumeVersions,
        addResumeVersion,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
