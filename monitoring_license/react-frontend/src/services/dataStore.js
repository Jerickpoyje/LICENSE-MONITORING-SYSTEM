const STORAGE_KEY = 'monitoring-license-data';

const defaultData = {
  users: [
    { user_id: 1, username: 'admin', email: 'admin@amadeocoffee.ph', password: 'admin123', name: 'Admin User', role: 'Admin' },
    { user_id: 2, username: 'ituser', email: 'ituser@amadeocoffee.ph', password: 'it123456', name: 'IT User', role: 'IT' },
    { user_id: 3, username: 'user', email: 'user@amadeocoffee.ph', password: 'user1234', name: 'Standard User', role: 'User' },
  ],
  licenses: [
    {
      item_no: 101,
      username: 'admin',
      category: 'Software',
      type: 'Enterprise',
      validity: '2026-12-31',
      renewal_type: 'Annual',
      product: 'Antivirus Pro',
      description: 'Company-wide security license',
      supplier: 'SecureSoft',
      sales_contact: 'Maria Lopez',
      email: 'sales@securesoft.example',
      price: '42000',
      year: '2026',
      remarks: 'Renew before December',
      quotation: '',
      history: [
        { year: '2024', price: '40000' },
        { year: '2025', price: '41000' },
        { year: '2026', price: '42000' },
      ],
    },
    {
      item_no: 102,
      username: 'ituser',
      category: 'Cloud',
      type: 'Subscription',
      validity: '2026-08-15',
      renewal_type: 'Annual',
      product: 'Storage Cloud',
      description: 'Backup storage subscription',
      supplier: 'CloudForge',
      sales_contact: 'Alvin Santos',
      email: 'alvin@cloudforge.example',
      price: '38000',
      year: '2026',
      remarks: 'Auto-renew enabled',
      quotation: '',
      history: [
        { year: '2024', price: '36000' },
        { year: '2025', price: '37000' },
        { year: '2026', price: '38000' },
      ],
    },
  ],
};

function normalizeData(parsed) {
  const data = {
    users: Array.isArray(parsed.users) ? parsed.users : [],
    licenses: Array.isArray(parsed.licenses) ? parsed.licenses : [],
  };

  const normalizedUsers = data.users.map((user) => ({
    ...user,
    username: user.username?.trim() || '',
    email: user.email?.trim() || '',
    password: user.password || '',
    name: user.name || '',
    role: user.role || 'User',
  }));

  const hasEmail = normalizedUsers.some((user) => user.email);
  if (!hasEmail) {
    return defaultData;
  }

  const hasAdmin = normalizedUsers.some(
    (user) => user.username.toLowerCase() === 'admin' || user.email.toLowerCase() === 'admin@amadeocoffee.ph'
  );
  if (!hasAdmin) {
    return defaultData;
  }

  return {
    users: normalizedUsers,
    licenses: data.licenses,
  };
}

function loadData() {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.users) || !Array.isArray(parsed.licenses)) {
        throw new Error('Outdated or malformed local storage data');
      }
      const normalized = normalizeData(parsed);
      saveData(normalized);
      return normalized;
    } catch (error) {
      console.error('Invalid local storage data, resetting.', error);
    }
  }
  saveData(defaultData);
  return { ...defaultData };
}

function saveData(data) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getNextUserId(data) {
  return data.users.reduce((max, user) => Math.max(max, user.user_id), 0) + 1;
}

function getNextLicenseId(data) {
  return data.licenses.reduce((max, license) => Math.max(max, license.item_no), 100) + 1;
}

export const dataStore = {
  loadData,
  saveData,
  getNextUserId,
  getNextLicenseId,
};
