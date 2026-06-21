import { dataStore } from './dataStore.js';

function getState() {
  return dataStore.loadData();
}

function saveState(state) {
  dataStore.saveData(state);
}

export async function loginUser(credentials) {
  const state = getState();
  const input = credentials.username.trim().toLowerCase();
  const user = state.users.find((u) => {
    const usernameMatch = u.username?.toLowerCase() === input;
    const emailMatch = u.email?.toLowerCase() === input;
    return usernameMatch || emailMatch;
  });

  if (!user || user.password !== credentials.password) {
    throw new Error('Invalid username or password.');
  }

  return {
    status: 'success',
    user: { user_id: user.user_id, username: user.username, name: user.name, role: user.role },
  };
}

export async function registerUser(data) {
  const state = getState();
  if (state.users.some((user) => user.username === data.username)) {
    throw new Error('Username already exists.');
  }

  const user = {
    user_id: dataStore.getNextUserId(state),
    username: data.username,
    password: data.password,
    name: data.name,
    role: 'User',
  };
  state.users.push(user);
  saveState(state);

  return { status: 'success', message: 'Registration successful.', user };
}

export async function logoutUser() {
  return { status: 'success', message: 'Logged out successfully.' };
}

export async function getUsers() {
  const state = getState();
  return state.users;
}

export async function addUser(user) {
  const state = getState();
  if (state.users.some((existing) => existing.username === user.username)) {
    throw new Error('Username already exists.');
  }

  const newUser = {
    user_id: dataStore.getNextUserId(state),
    username: user.username,
    password: user.password,
    name: user.name,
    role: user.role,
  };
  state.users.push(newUser);
  saveState(state);

  return { status: 'success', message: 'User added successfully.', user: newUser };
}

export async function updateUser(user) {
  const state = getState();
  const existing = state.users.find((item) => item.user_id === Number(user.user_id));
  if (!existing) {
    throw new Error('User not found.');
  }
  existing.username = user.username;
  existing.password = user.password;
  existing.name = user.name;
  existing.role = user.role;
  saveState(state);

  return { status: 'success', message: 'User updated successfully.' };
}

export async function deleteUser(userId) {
  const state = getState();
  const index = state.users.findIndex((item) => item.user_id === Number(userId));
  if (index === -1) {
    throw new Error('User not found.');
  }
  state.users.splice(index, 1);
  saveState(state);
  return { status: 'success', message: 'User deleted successfully.' };
}

export async function getDashboardStats() {
  const state = getState();
  const totalUsers = state.users.length;
  const totalAdmins = state.users.filter((user) => user.role === 'Admin').length;
  const expiringLicenses = state.licenses.filter((license) => {
    const validityDate = new Date(license.validity);
    const now = new Date();
    const diffDays = Math.ceil((validityDate - now) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 90;
  }).length;

  return { totalUsers, totalAdmins, expiringLicenses };
}

export async function fetchLicenses(year = '') {
  const state = getState();
  if (!year) {
    return state.licenses;
  }
  return state.licenses.filter((license) => String(license.year) === String(year));
}

export async function getLicenseHistory(itemNo) {
  const state = getState();
  const license = state.licenses.find((item) => String(item.item_no) === String(itemNo));
  return license?.history || [];
}

export async function saveLicense(data) {
  const state = getState();
  if (data.item_no) {
    const existing = state.licenses.find((item) => String(item.item_no) === String(data.item_no));
    if (!existing) {
      throw new Error('License not found.');
    }

    Object.assign(existing, {
      category: data.category,
      type: data.type,
      validity: data.validity,
      renewal_type: data.renewal_type,
      product: data.product,
      description: data.description,
      supplier: data.supplier,
      sales_contact: data.sales_contact,
      email: data.email,
      price: data.price,
      year: data.year,
      remarks: data.remarks,
    });

    if (data.quotationFile instanceof File) {
      existing.quotation = data.quotationFile.name;
    }
  } else {
    const newLicense = {
      ...data,
      item_no: dataStore.getNextLicenseId(state),
      username: 'admin',
      quotation: data.quotationFile instanceof File ? data.quotationFile.name : '',
      history: [],
    };
    state.licenses.push(newLicense);
  }

  saveState(state);
  return { status: 'success', message: 'License saved successfully.' };
}

export async function deleteLicense(itemNo) {
  const state = getState();
  const index = state.licenses.findIndex((item) => String(item.item_no) === String(itemNo));
  if (index === -1) {
    throw new Error('License not found.');
  }
  state.licenses.splice(index, 1);
  saveState(state);
  return { status: 'success', message: 'License deleted successfully.' };
}
