import React, { createContext, useState } from 'react';

export const AppContext = createContext();

const MOCK_ANNOUNCEMENTS = [
  {
    id: '1',
    title: 'New Policy Update',
    content: 'All remote workers are requested to file their weekly attendance logs by Friday 5:00 PM standard local time.',
    date: '2026-06-15',
    postedBy: 'Sarah Jenkins (Admin)',
  },
  {
    id: '2',
    title: 'Upcoming Public Holiday',
    content: 'The workspace will remain closed on June 23rd in observance of the Summer Solstice Holiday.',
    date: '2026-06-12',
    postedBy: 'HR Department',
  },
];

const MOCK_LEAVE_BALANCES = {
  'EMP-202': { casual: 7, sick: 4, earned: 12 },
  'EMP-203': { casual: 6, sick: 5, earned: 10 },
};

const MOCK_LEAVE_APPLICATIONS = [
  {
    id: 'LA-501',
    userId: 'EMP-202',
    employeeName: 'Kunal Vichare',
    leaveType: 'casual',
    startDate: '2026-07-02',
    endDate: '2026-07-03',
    reason: 'Family gathering at hometown.',
    status: 'Pending',
  },
  {
    id: 'LA-502',
    userId: 'EMP-203',
    employeeName: 'Priya Sharma',
    leaveType: 'sick',
    startDate: '2026-06-10',
    endDate: '2026-06-10',
    reason: 'Dental appointment.',
    status: 'Approved',
  },
];

const MOCK_ATTENDANCE_LOGS = [
  // Attendance records for Kunal
  { id: '1', userId: 'EMP-202', date: '2026-06-10', checkIn: '09:00 AM', checkOut: '06:00 PM', duration: '9.0 hrs', status: 'Present' },
  { id: '2', userId: 'EMP-202', date: '2026-06-11', checkIn: '09:15 AM', checkOut: '05:45 PM', duration: '8.5 hrs', status: 'Present' },
  { id: '3', userId: 'EMP-202', date: '2026-06-12', checkIn: '08:55 AM', checkOut: '06:10 PM', duration: '9.2 hrs', status: 'Present' },
  { id: '4', userId: 'EMP-202', date: '2026-06-15', checkIn: '09:05 AM', checkOut: '05:55 PM', duration: '8.8 hrs', status: 'Present' },
  // Attendance records for Priya
  { id: '5', userId: 'EMP-203', date: '2026-06-10', checkIn: '09:30 AM', checkOut: '06:30 PM', duration: '9.0 hrs', status: 'Present' },
  { id: '6', userId: 'EMP-203', date: '2026-06-11', checkIn: '09:10 AM', checkOut: '05:30 PM', duration: '8.3 hrs', status: 'Present' },
];

const MOCK_FIELD_FORCE_LOGS = [
  { id: '1', userId: 'EMP-202', checkpoint: 'Central HQ Office', time: '2026-06-15 10:30 AM', coords: '19.0760° N, 72.8777° E' },
  { id: '2', userId: 'EMP-202', checkpoint: 'Municipal Terminal C', time: '2026-06-15 02:45 PM', coords: '19.0820° N, 72.8812° E' },
];

export const AppProvider = ({ children }) => {
  const [announcements, setAnnouncements] = useState(MOCK_ANNOUNCEMENTS);
  const [leaveBalances, setLeaveBalances] = useState(MOCK_LEAVE_BALANCES);
  const [leaveApplications, setLeaveApplications] = useState(MOCK_LEAVE_APPLICATIONS);
  const [attendanceLogs, setAttendanceLogs] = useState(MOCK_ATTENDANCE_LOGS);
  const [fieldForceLogs, setFieldForceLogs] = useState(MOCK_FIELD_FORCE_LOGS);
  const [activeCheckIn, setActiveCheckIn] = useState({}); // userId -> { checkInTime, date }

  // Check In
  const clockIn = (userId) => {
    const today = new Date().toISOString().split('T')[0];
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Check if already checked in today
    const exists = attendanceLogs.some(log => log.userId === userId && log.date === today);
    if (exists || activeCheckIn[userId]) {
      return { success: false, error: 'Already checked in for today.' };
    }

    setActiveCheckIn(prev => ({
      ...prev,
      [userId]: { checkInTime: time, date: today }
    }));

    return { success: true, checkInTime: time };
  };

  // Check Out
  const clockOut = (userId) => {
    const currentActive = activeCheckIn[userId];
    if (!currentActive) {
      return { success: false, error: 'Not checked in yet today.' };
    }

    const timeOut = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Calculate simple mock duration (e.g. 8.5 hrs)
    const hours = 8 + Math.floor(Math.random() * 2);
    const mins = Math.floor(Math.random() * 60);
    const durationStr = `${hours}.${Math.floor(mins / 6)} hrs`;

    const newLog = {
      id: `ATT-${Math.floor(Math.random() * 90000) + 10000}`,
      userId,
      date: currentActive.date,
      checkIn: currentActive.checkInTime,
      checkOut: timeOut,
      duration: durationStr,
      status: 'Present',
    };

    setAttendanceLogs(prev => [newLog, ...prev]);
    setActiveCheckIn(prev => {
      const copy = { ...prev };
      delete copy[userId];
      return copy;
    });

    return { success: true, log: newLog };
  };

  // Apply Leave
  const applyLeave = (userId, employeeName, leaveType, startDate, endDate, reason) => {
    // Check balances
    const userBalance = leaveBalances[userId] || { casual: 5, sick: 5, earned: 5 };
    const balance = userBalance[leaveType];

    // Calculate duration in days (simplified to 1 day if dates parse issues)
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    if (balance < diffDays) {
      return { success: false, error: 'Insufficient leave balance. Needed: ' + diffDays + ' days, Available: ' + balance };
    }

    // Deduct leave balance
    setLeaveBalances(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [leaveType]: balance - diffDays
      }
    }));

    const newApplication = {
      id: `LA-${Math.floor(Math.random() * 900) + 500}`,
      userId,
      employeeName,
      leaveType,
      startDate,
      endDate,
      reason,
      status: 'Pending',
      days: diffDays,
    };

    setLeaveApplications(prev => [newApplication, ...prev]);
    return { success: true, application: newApplication };
  };

  // Update Leave Status (Admin approves / rejects)
  const updateLeaveStatus = (applicationId, status) => {
    setLeaveApplications(prev => prev.map(app => {
      if (app.id === applicationId) {
        if (status === 'Rejected') {
          // Refund leaves
          const userId = app.userId;
          const leaveType = app.leaveType;
          const days = app.days || 1;
          setLeaveBalances(curr => ({
            ...curr,
            [userId]: {
              ...curr[userId],
              [leaveType]: (curr[userId] ? curr[userId][leaveType] : 5) + days
            }
          }));
        }
        return { ...app, status };
      }
      return app;
    }));
  };

  // Add Announcement
  const addAnnouncement = (title, content, postedBy) => {
    const newAnnouncement = {
      id: `ANN-${Math.floor(Math.random() * 900) + 100}`,
      title,
      content,
      date: new Date().toISOString().split('T')[0],
      postedBy,
    };
    setAnnouncements(prev => [newAnnouncement, ...prev]);
    return newAnnouncement;
  };

  // Log Field Force Checkpoint
  const logFieldCheckpoint = (userId, checkpoint, coords = '19.0760° N, 72.8777° E') => {
    const newLog = {
      id: `FF-${Math.floor(Math.random() * 900) + 100}`,
      userId,
      checkpoint,
      time: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      coords,
    };
    setFieldForceLogs(prev => [newLog, ...prev]);
    return { success: true, log: newLog };
  };

  // Custom Performance details
  const getEmployeePerformance = (userId) => {
    // Generate mock analytics based on userid
    const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const productivityScore = 75 + (hash % 20); // 75% to 95%
    const completionRate = 80 + (hash % 18);    // 80% to 98%
    const avgHours = (8.2 + (hash % 15) / 10).toFixed(1); // 8.2 to 9.7 hrs
    
    return {
      productivityScore,
      completionRate,
      avgHours,
      feedback: hash % 2 === 0 
        ? "Excellent focus and consistency. Delivered core milestones ahead of deadline."
        : "Steady work rate. Shows proactive collaboration on group targets. Keep it up!",
      weeklyTrend: [
        { day: 'Mon', hours: 8.5 },
        { day: 'Tue', hours: 9.0 },
        { day: 'Wed', hours: 8.8 },
        { day: 'Thu', hours: 9.5 },
        { day: 'Fri', hours: 8.0 }
      ]
    };
  };

  return (
    <AppContext.Provider
      value={{
        announcements,
        leaveBalances,
        leaveApplications,
        attendanceLogs,
        fieldForceLogs,
        activeCheckIn,
        clockIn,
        clockOut,
        applyLeave,
        updateLeaveStatus,
        addAnnouncement,
        logFieldCheckpoint,
        getEmployeePerformance,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
