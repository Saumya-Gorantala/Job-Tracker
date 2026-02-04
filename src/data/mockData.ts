export type ApplicationStatus = 'saved' | 'applied' | 'interview' | 'offer' | 'rejected';

export type JobCategory = 'Software Developer' | 'Design' | 'Data' | 'Product' | 'Marketing' | 'Other';

export type InterviewType = 'phone' | 'video' | 'onsite';

export type InterviewStatus = 'upcoming' | 'completed' | 'cancelled';

export interface Application {
  id: string;
  company: string;
  role: string;
  location: string;
  status: ApplicationStatus;
  salary: number; // per year
  category: JobCategory;
  recruiterName?: string;
  recruiterEmail?: string;
  resumeVersion: string;
  jobDescriptionLink?: string;
  notes?: string;
  createdAt: Date;
  interviewDate?: Date;
  interviewType?: InterviewType;
  interviewStatus?: InterviewStatus;
}

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  date: Date;
  category: 'follow-up' | 'deadline' | 'interview-prep';
  completed: boolean;
  applicationId?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'interview' | 'reminder' | 'deadline';
  applicationId?: string;
  reminderId?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  linkedinUrl?: string;
  avatarUrl?: string;
  resumeVersions: string[];
  notifications: {
    email: boolean;
    push: boolean;
    reminders: boolean;
  };
}

// Mock Applications
export const mockApplications: Application[] = [
  {
    id: '1',
    company: 'Google',
    role: 'Software Engineer Intern',
    location: 'Mountain View, CA',
    status: 'interview',
    salary: 120000,
    category: 'Software Developer',
    recruiterName: 'Sarah Johnson',
    recruiterEmail: 'sarah.j@google.com',
    resumeVersion: 'v2.1',
    jobDescriptionLink: 'https://careers.google.com',
    notes: 'Second round scheduled',
    createdAt: new Date('2024-01-15'),
    interviewDate: new Date('2024-02-10'),
    interviewType: 'video',
    interviewStatus: 'upcoming',
  },
  {
    id: '2',
    company: 'Meta',
    role: 'Product Design Intern',
    location: 'Menlo Park, CA',
    status: 'applied',
    salary: 110000,
    category: 'Design',
    recruiterName: 'Mike Chen',
    recruiterEmail: 'mike.c@meta.com',
    resumeVersion: 'v2.0',
    jobDescriptionLink: 'https://metacareers.com',
    createdAt: new Date('2024-01-20'),
  },
  {
    id: '3',
    company: 'Amazon',
    role: 'Data Science Intern',
    location: 'Seattle, WA',
    status: 'saved',
    salary: 115000,
    category: 'Data',
    resumeVersion: 'v2.1',
    jobDescriptionLink: 'https://amazon.jobs',
    createdAt: new Date('2024-01-22'),
  },
  {
    id: '4',
    company: 'Microsoft',
    role: 'Software Engineer Intern',
    location: 'Redmond, WA',
    status: 'offer',
    salary: 125000,
    category: 'Software Developer',
    recruiterName: 'Emily Davis',
    recruiterEmail: 'emily.d@microsoft.com',
    resumeVersion: 'v2.1',
    notes: 'Offer received! Need to respond by Feb 15',
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '5',
    company: 'Apple',
    role: 'UX Design Intern',
    location: 'Cupertino, CA',
    status: 'rejected',
    salary: 118000,
    category: 'Design',
    resumeVersion: 'v1.9',
    createdAt: new Date('2024-01-05'),
  },
  {
    id: '6',
    company: 'Netflix',
    role: 'Frontend Engineer Intern',
    location: 'Los Gatos, CA',
    status: 'interview',
    salary: 130000,
    category: 'Software Developer',
    recruiterName: 'Alex Wong',
    recruiterEmail: 'alex.w@netflix.com',
    resumeVersion: 'v2.1',
    notes: 'Technical round next week',
    createdAt: new Date('2024-01-18'),
    interviewDate: new Date('2024-02-05'),
    interviewType: 'video',
    interviewStatus: 'upcoming',
  },
  {
    id: '7',
    company: 'Spotify',
    role: 'Data Analyst Intern',
    location: 'New York, NY',
    status: 'applied',
    salary: 95000,
    category: 'Data',
    resumeVersion: 'v2.0',
    createdAt: new Date('2024-01-25'),
  },
  {
    id: '8',
    company: 'Airbnb',
    role: 'Product Manager Intern',
    location: 'San Francisco, CA',
    status: 'saved',
    salary: 105000,
    category: 'Product',
    resumeVersion: 'v2.1',
    createdAt: new Date('2024-01-28'),
  },
  {
    id: '9',
    company: 'Stripe',
    role: 'Backend Engineer Intern',
    location: 'San Francisco, CA',
    status: 'interview',
    salary: 140000,
    category: 'Software Developer',
    recruiterName: 'Lisa Park',
    recruiterEmail: 'lisa.p@stripe.com',
    resumeVersion: 'v2.1',
    createdAt: new Date('2024-01-12'),
    interviewDate: new Date('2024-02-08'),
    interviewType: 'onsite',
    interviewStatus: 'upcoming',
  },
  {
    id: '10',
    company: 'Slack',
    role: 'Marketing Intern',
    location: 'San Francisco, CA',
    status: 'applied',
    salary: 75000,
    category: 'Marketing',
    resumeVersion: 'v2.0',
    createdAt: new Date('2024-01-26'),
  },
];

// Mock Reminders
export const mockReminders: Reminder[] = [
  {
    id: 'r1',
    title: 'Follow up with Google recruiter',
    description: 'Send thank you email after interview',
    date: new Date('2024-02-11'),
    category: 'follow-up',
    completed: false,
    applicationId: '1',
  },
  {
    id: 'r2',
    title: 'Meta application deadline',
    description: 'Submit final portfolio pieces',
    date: new Date('2024-02-15'),
    category: 'deadline',
    completed: false,
    applicationId: '2',
  },
  {
    id: 'r3',
    title: 'Prepare for Netflix technical',
    description: 'Review React hooks and system design',
    date: new Date('2024-02-04'),
    category: 'interview-prep',
    completed: false,
    applicationId: '6',
  },
  {
    id: 'r4',
    title: 'Respond to Microsoft offer',
    description: 'Deadline to accept/decline offer',
    date: new Date('2024-02-15'),
    category: 'deadline',
    completed: false,
    applicationId: '4',
  },
  {
    id: 'r5',
    title: 'Call Stripe recruiter',
    description: 'Confirm interview logistics',
    date: new Date('2024-02-07'),
    category: 'follow-up',
    completed: true,
    applicationId: '9',
  },
];

// Mock User Profile
export const mockUserProfile: UserProfile = {
  name: 'Alex Thompson',
  email: 'alex.thompson@email.com',
  phone: '+1 (555) 123-4567',
  linkedinUrl: 'https://linkedin.com/in/alexthompson',
  avatarUrl: undefined,
  resumeVersions: ['v1.9', 'v2.0', 'v2.1'],
  notifications: {
    email: true,
    push: true,
    reminders: true,
  },
};

// Helper functions
export const getApplicationsByStatus = (status: ApplicationStatus): Application[] => {
  return mockApplications.filter(app => app.status === status);
};

export const getUpcomingInterviews = (limit?: number): Application[] => {
  const interviews = mockApplications
    .filter(app => app.status === 'interview' && app.interviewDate && app.interviewStatus === 'upcoming')
    .sort((a, b) => (a.interviewDate!.getTime() - b.interviewDate!.getTime()));
  return limit ? interviews.slice(0, limit) : interviews;
};

export const getPendingReminders = (): Reminder[] => {
  return mockReminders.filter(r => !r.completed).sort((a, b) => a.date.getTime() - b.date.getTime());
};

export const getStatusCounts = (): Record<ApplicationStatus, number> => {
  return {
    saved: getApplicationsByStatus('saved').length,
    applied: getApplicationsByStatus('applied').length,
    interview: getApplicationsByStatus('interview').length,
    offer: getApplicationsByStatus('offer').length,
    rejected: getApplicationsByStatus('rejected').length,
  };
};

export const formatSalary = (salary: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(salary) + '/year';
};

export const getStatusColor = (status: ApplicationStatus): string => {
  const colors: Record<ApplicationStatus, string> = {
    saved: 'status-saved',
    applied: 'status-applied',
    interview: 'status-interview',
    offer: 'status-offer',
    rejected: 'status-rejected',
  };
  return colors[status];
};
