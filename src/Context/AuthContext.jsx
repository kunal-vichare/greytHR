import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const DEMO_COMPANIES = [
  {
    id: 'CO-101',
    name: 'TechGov Solutions',
    ownerEmail: 'admin@techgov.com',
    ownerName: 'Sarah Jenkins',
    password: 'password123',
  }
];

const DEMO_EMPLOYEES = [
  {
    id: 'EMP-202',
    name: 'Kunal Vichare',
    email: 'kunal@techgov.com',
    password: 'password123',
    companyId: 'CO-101',
    designation: 'Senior Developer',
    role: 'employee',
    joinedDate: '2025-05-10',
  },
  {
    id: 'EMP-203',
    name: 'Priya Sharma',
    email: 'priya@techgov.com',
    password: 'password123',
    companyId: 'CO-101',
    designation: 'UI/UX Designer',
    role: 'employee',
    joinedDate: '2025-08-12',
  }
];

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [companies, setCompanies] = useState(DEMO_COMPANIES);
  const [employees, setEmployees] = useState(DEMO_EMPLOYEES);

  // Auto-login Kunal by default to save time during verification, but support proper login flows
  useEffect(() => {
    // Uncomment the line below if we want to auto-login an employee immediately
    // setCurrentUser(DEMO_EMPLOYEES[0]);
  }, []);

  const login = (email, password, role) => {
    if (role === 'admin') {
      const company = companies.find(
        (c) => c.ownerEmail.toLowerCase() === email.toLowerCase() && c.password === password
      );
      if (company) {
        const adminUser = {
          id: company.id,
          name: company.ownerName,
          email: company.ownerEmail,
          companyId: company.id,
          companyName: company.name,
          role: 'admin',
          designation: 'Company Owner / Director',
        };
        setCurrentUser(adminUser);
        return { success: true, user: adminUser };
      }
    } else {
      const employee = employees.find(
        (e) => e.email.toLowerCase() === email.toLowerCase() && e.password === password
      );
      if (employee) {
        const company = companies.find((c) => c.id === employee.companyId);
        const employeeUser = {
          ...employee,
          companyName: company ? company.name : 'Unknown Company',
        };
        setCurrentUser(employeeUser);
        return { success: true, user: employeeUser };
      }
    }
    return { success: false, error: 'Invalid credentials or role mismatch.' };
  };

  const registerCompany = (companyName, ownerName, email, password) => {
    // Check if email already registered as owner
    if (companies.some((c) => c.ownerEmail.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'Email already registered.' };
    }

    const companyId = `CO-${Math.floor(Math.random() * 900) + 100}`;
    const newCompany = {
      id: companyId,
      name: companyName,
      ownerEmail: email,
      ownerName: ownerName,
      password: password,
    };

    setCompanies((prev) => [...prev, newCompany]);
    return { success: true, companyId };
  };

  const registerEmployee = (fullName, email, password, companyId, designation = 'Associate') => {
    // Validate if company exists
    const companyExists = companies.some((c) => c.id.toUpperCase() === companyId.toUpperCase());
    if (!companyExists) {
      return { success: false, error: 'Company ID not found.' };
    }

    // Check if email already registered
    if (employees.some((e) => e.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'Email already exists.' };
    }

    const empId = `EMP-${Math.floor(Math.random() * 9000) + 1000}`;
    const newEmployee = {
      id: empId,
      name: fullName,
      email: email,
      password: password,
      companyId: companyId.toUpperCase(),
      designation: designation,
      role: 'employee',
      joinedDate: new Date().toISOString().split('T')[0],
    };

    setEmployees((prev) => [...prev, newEmployee]);
    return { success: true, employee: newEmployee };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        companies,
        employees,
        login,
        registerCompany,
        registerEmployee,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
