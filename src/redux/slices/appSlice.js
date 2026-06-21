import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

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
    days: 2,
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
    days: 1,
  },
];

const MOCK_ATTENDANCE_LOGS = [
  { id: '1', userId: 'EMP-202', date: '2026-06-10', checkIn: '09:00 AM', checkOut: '06:00 PM', duration: '9.0 hrs', status: 'Present' },
  { id: '2', userId: 'EMP-202', date: '2026-06-11', checkIn: '09:15 AM', checkOut: '05:45 PM', duration: '8.5 hrs', status: 'Present' },
  { id: '3', userId: 'EMP-202', date: '2026-06-12', checkIn: '08:55 AM', checkOut: '06:10 PM', duration: '9.2 hrs', status: 'Present' },
  { id: '4', userId: 'EMP-202', date: '2026-06-15', checkIn: '09:05 AM', checkOut: '05:55 PM', duration: '8.8 hrs', status: 'Present' },
  { id: '5', userId: 'EMP-203', date: '2026-06-10', checkIn: '09:30 AM', checkOut: '06:30 PM', duration: '9.0 hrs', status: 'Present' },
  { id: '6', userId: 'EMP-203', date: '2026-06-11', checkIn: '09:10 AM', checkOut: '05:30 PM', duration: '8.3 hrs', status: 'Present' },
];

const MOCK_FIELD_FORCE_LOGS = [
  { id: '1', userId: 'EMP-202', checkpoint: 'Central HQ Office', time: '2026-06-15 10:30 AM', coords: '19.0760° N, 72.8777° E' },
  { id: '2', userId: 'EMP-202', checkpoint: 'Municipal Terminal C', time: '2026-06-15 02:45 PM', coords: '19.0820° N, 72.8812° E' },
];

const initialState = {
  announcements: MOCK_ANNOUNCEMENTS,
  leaveBalances: MOCK_LEAVE_BALANCES,
  leaveApplications: MOCK_LEAVE_APPLICATIONS,
  attendanceLogs: MOCK_ATTENDANCE_LOGS,
  fieldForceLogs: MOCK_FIELD_FORCE_LOGS,
  activeCheckIn: {}, // userId -> { checkInTime, date }
};

// Async Thunks
export const clockIn = createAsyncThunk(
  'app/clockIn',
  async (userId, { getState, rejectWithValue }) => {
    const { app } = getState();
    const today = new Date().toISOString().split('T')[0];
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Check if already checked in today
    const exists = app.attendanceLogs.some(log => log.userId === userId && log.date === today);
    if (exists || app.activeCheckIn[userId]) {
      return rejectWithValue('Already checked in for today.');
    }

    return { userId, checkInTime: time, date: today };
  }
);

export const clockOut = createAsyncThunk(
  'app/clockOut',
  async (userId, { getState, rejectWithValue }) => {
    const { app } = getState();
    const currentActive = app.activeCheckIn[userId];
    if (!currentActive) {
      return rejectWithValue('Not checked in yet today.');
    }

    const timeOut = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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

    return { userId, newLog };
  }
);

export const applyLeave = createAsyncThunk(
  'app/applyLeave',
  async ({ userId, employeeName, leaveType, startDate, endDate, reason }, { getState, rejectWithValue }) => {
    const { app } = getState();
    const userBalance = app.leaveBalances[userId] || { casual: 5, sick: 5, earned: 5 };
    const balance = userBalance[leaveType];

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    if (balance < diffDays) {
      return rejectWithValue('Insufficient leave balance. Needed: ' + diffDays + ' days, Available: ' + balance);
    }

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

    return { userId, leaveType, diffDays, newApplication };
  }
);

export const updateLeaveStatus = createAsyncThunk(
  'app/updateLeaveStatus',
  async ({ applicationId, status }, { getState }) => {
    const { app } = getState();
    const appToUpdate = app.leaveApplications.find(a => a.id === applicationId);

    let refund = null;
    if (appToUpdate && status === 'Rejected') {
      refund = {
        userId: appToUpdate.userId,
        leaveType: appToUpdate.leaveType,
        days: appToUpdate.days || 1,
      };
    }

    return { applicationId, status, refund };
  }
);

export const addAnnouncementThunk = createAsyncThunk(
  'app/addAnnouncement',
  async ({ title, content, postedBy }) => {
    return {
      id: `ANN-${Math.floor(Math.random() * 900) + 100}`,
      title,
      content,
      date: new Date().toISOString().split('T')[0],
      postedBy,
    };
  }
);

export const logFieldCheckpointThunk = createAsyncThunk(
  'app/logFieldCheckpoint',
  async ({ userId, checkpoint, coords }) => {
    const finalCoords = coords || '19.0760° N, 72.8777° E';
    return {
      id: `FF-${Math.floor(Math.random() * 900) + 100}`,
      userId,
      checkpoint,
      time: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      coords: finalCoords,
    };
  }
);

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(clockIn.fulfilled, (state, action) => {
        const { userId, checkInTime, date } = action.payload;
        state.activeCheckIn[userId] = { checkInTime, date };
      })
      .addCase(clockOut.fulfilled, (state, action) => {
        const { userId, newLog } = action.payload;
        state.attendanceLogs.unshift(newLog);
        delete state.activeCheckIn[userId];
      })
      .addCase(applyLeave.fulfilled, (state, action) => {
        const { userId, leaveType, diffDays, newApplication } = action.payload;
        if (!state.leaveBalances[userId]) {
          state.leaveBalances[userId] = { casual: 5, sick: 5, earned: 5 };
        }
        state.leaveBalances[userId][leaveType] -= diffDays;
        state.leaveApplications.unshift(newApplication);
      })
      .addCase(updateLeaveStatus.fulfilled, (state, action) => {
        const { applicationId, status, refund } = action.payload;
        const app = state.leaveApplications.find(a => a.id === applicationId);
        if (app) {
          app.status = status;
        }
        if (refund) {
          const { userId, leaveType, days } = refund;
          if (!state.leaveBalances[userId]) {
            state.leaveBalances[userId] = { casual: 5, sick: 5, earned: 5 };
          }
          state.leaveBalances[userId][leaveType] += days;
        }
      })
      .addCase(addAnnouncementThunk.fulfilled, (state, action) => {
        state.announcements.unshift(action.payload);
      })
      .addCase(logFieldCheckpointThunk.fulfilled, (state, action) => {
        state.fieldForceLogs.unshift(action.payload);
      });
  },
});

// Pure logic selector for employee performance
export const selectEmployeePerformance = (userId) => {
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

export default appSlice.reducer;
