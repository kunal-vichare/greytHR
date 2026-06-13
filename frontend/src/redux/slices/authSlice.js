import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const DEMO_COMPANIES = [
  {
    id: 'CO-101',
    name: 'TechGov Solutions',
    ownerEmail: 'kunal@gmail.com',
    ownerName: 'Sarah Jenkins',
    password: 'kunal9',
  }
];

const DEMO_EMPLOYEES = [
  {
    id: 'EMP-202',
    name: 'Kunal Vichare',
    email: 'kunal@gmail.com',
    password: 'kunal9',
    companyId: 'CO-101',
    designation: 'Senior Developer',
    role: 'employee',
    joinedDate: '2025-05-10',
  },
  {
    id: 'EMP-203',
    name: 'Priya Sharma',
    email: 'priya@techgov.com',
    password: 'kunal',
    companyId: 'CO-101',
    designation: 'UI/UX Designer',
    role: 'employee',
    joinedDate: '2025-08-12',
  }
];

const initialState = {
  currentUser: null,
  companies: DEMO_COMPANIES,
  employees: DEMO_EMPLOYEES,
};

// Async Thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password, role }, { getState, rejectWithValue }) => {
    const { auth } = getState();
    if (role === 'admin') {
      const company = auth.companies.find(
        (c) => c.ownerEmail.toLowerCase() === email.toLowerCase() && c.password === password
      );
      if (company) {
        return {
          id: company.id,
          name: company.ownerName,
          email: company.ownerEmail,
          companyId: company.id,
          companyName: company.name,
          role: 'admin',
          designation: 'Company Owner / Director',
        };
      }
    } else {
      const employee = auth.employees.find(
        (e) => e.email.toLowerCase() === email.toLowerCase() && e.password === password
      );
      if (employee) {
        const company = auth.companies.find((c) => c.id === employee.companyId);
        return {
          ...employee,
          companyName: company ? company.name : 'Unknown Company',
        };
      }
    }
    return rejectWithValue('Invalid credentials or role mismatch.');
  }
);

export const registerCompany = createAsyncThunk(
  'auth/registerCompany',
  async ({ companyName, ownerName, email, password }, { getState, rejectWithValue }) => {
    const { auth } = getState();
    if (auth.companies.some((c) => c.ownerEmail.toLowerCase() === email.toLowerCase())) {
      return rejectWithValue('Email already registered.');
    }

    const companyId = `CO-${Math.floor(Math.random() * 900) + 100}`;
    return {
      id: companyId,
      name: companyName,
      ownerEmail: email,
      ownerName: ownerName,
      password: password,
    };
  }
);

export const registerEmployee = createAsyncThunk(
  'auth/registerEmployee',
  async ({ fullName, email, password, companyId, designation = 'Associate' }, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const companyExists = auth.companies.some((c) => c.id.toUpperCase() === companyId.toUpperCase());
    if (!companyExists) {
      return rejectWithValue('Company ID not found.');
    }

    if (auth.employees.some((e) => e.email.toLowerCase() === email.toLowerCase())) {
      return rejectWithValue('Email already exists.');
    }

    const empId = `EMP-${Math.floor(Math.random() * 9000) + 1000}`;
    return {
      id: empId,
      name: fullName,
      email: email,
      password: password,
      companyId: companyId.toUpperCase(),
      designation: designation,
      role: 'employee',
      joinedDate: new Date().toISOString().split('T')[0],
    };
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    return null;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.currentUser = action.payload;
      })
      .addCase(registerCompany.fulfilled, (state, action) => {
        state.companies.push(action.payload);
      })
      .addCase(registerEmployee.fulfilled, (state, action) => {
        state.employees.push(action.payload);
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.currentUser = null;
      });
  },
});

export default authSlice.reducer;