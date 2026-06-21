import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  deleteLicense as deleteLicenseApi,
  fetchLicenses,
  getLicenseHistory,
  logoutUser,
  saveLicense,
} from '../services/api';

const defaultLicense = {
  category: '',
  type: '',
  validity: '',
  renewal_type: '',
  product: '',
  description: '',
  supplier: '',
  sales_contact: '',
  email: '',
  price: '',
  year: '',
  remarks: '',
  quotationFile: null,
};

export default function LicenseRenewalPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [licenses, setLicenses] = useState([]);
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [error, setError] = useState('');
  const [viewLicense, setViewLicense] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLicense, setEditingLicense] = useState(null);
  const [licenseForm, setLicenseForm] = useState(defaultLicense);
  const [expiringOpen, setExpiringOpen] = useState(false);

  useEffect(() => {
    refreshLicenses();
  }, [yearFilter]);

  async function refreshLicenses() {
    setError('');
    try {
      const data = await fetchLicenses(yearFilter);
      setLicenses(data);
    } catch (err) {
      setError(err.message || 'Failed to load licenses.');
    }
  }

  const filteredLicenses = useMemo(() => {
    const term = search.toLowerCase();
    return licenses.filter((item) => {
      return (
        item.item_no.toString().includes(term) ||
        item.username.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term) ||
        item.type.toLowerCase().includes(term) ||
        item.renewal_type.toLowerCase().includes(term)
      );
    });
  }, [licenses, search]);

  async function handleLogout() {
    await logoutUser();
    logout();
    navigate('/login');
  }

  function openNewLicense() {
    setEditingLicense(null);
    setLicenseForm(defaultLicense);
    setIsFormOpen(true);
  }

  async function openEditLicense(itemNo) {
    const license = licenses.find((row) => row.item_no === itemNo);
    if (!license) return;
    setEditingLicense(license);
    setLicenseForm({ ...license, quotationFile: null });
    setIsFormOpen(true);
  }

  async function openViewLicense(itemNo) {
    const license = licenses.find((row) => row.item_no === itemNo);
    if (!license) return;
    try {
      const history = await getLicenseHistory(itemNo);
      setViewLicense({ ...license, history });
    } catch (err) {
      setError(err.message || 'Unable to load license history.');
    }
  }

  async function handleDeleteLicense(itemNo) {
    if (!window.confirm('Delete this license?')) return;
    try {
      await deleteLicenseApi(itemNo);
      refreshLicenses();
    } catch (err) {
      setError(err.message || 'Unable to delete license.');
    }
  }

  async function handleSaveLicense(event) {
    event.preventDefault();
    setError('');

    try {
      const payload = { ...licenseForm };
      if (payload.quotationFile instanceof File) {
        payload.quotationFile = payload.quotationFile;
      } else {
        delete payload.quotationFile;
      }
      if (editingLicense) {
        payload.item_no = editingLicense.item_no;
      }
      await saveLicense(payload);
      setIsFormOpen(false);
      refreshLicenses();
    } catch (err) {
      setError(err.message || 'Failed to save license.');
    }
  }

  const expiringLicenses = useMemo(() => {
    const now = new Date();
    return licenses.filter((license) => {
      const validityDate = new Date(license.validity);
      const diff = (validityDate - now) / (1000 * 60 * 60 * 24);
      return diff > 0 && diff <= 90;
    });
  }, [licenses]);

  return (
    <div className="page grid-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h2>License Monitoring</h2>
        </div>
        <nav className="sidebar-nav">
          <button className="link-button" onClick={() => navigate('/dashboard')}>
            Dashboard
          </button>
          <button className="link-button active" onClick={() => navigate('/licenses')}>
            License Renewal
          </button>
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-profile">
            <div className="profile-avatar">{user?.name?.charAt(0) || user?.username?.charAt(0)}</div>
            <div className="profile-meta">
              <strong>{user?.name || user?.username}</strong>
              <small>{user?.role || 'User'}</small>
            </div>
          </div>
          <button onClick={handleLogout} className="secondary-button signout-button">
            Sign Out
          </button>
        </div>
      </aside>

      <main className="content">
        <header className="page-header">
          <div>
            <h1>License Renewal Management</h1>
            <p>Manage software renewals, expiration dates, and licensing history.</p>
          </div>
        </header>

        <section className="stats-grid">
          <article className="stat-card">
            <strong>{licenses.length}</strong>
            <span>Total Licenses</span>
          </article>
          <article className="stat-card">
            <strong>{expiringLicenses.length}</strong>
            <span>Expiring in 90 days</span>
          </article>
          <article className="stat-card">
            <strong>{user?.role || 'N/A'}</strong>
            <span>Current Role</span>
          </article>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <button className="primary-button" onClick={openNewLicense}>
                + Add License
              </button>
            </div>
            <div className="toolbar-row">
              <input
                type="search"
                placeholder="Search licenses..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <select value={yearFilter} onChange={(event) => setYearFilter(event.target.value)}>
                <option value="">All Years</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </div>
          </div>

          {error && <div className="form-error">{error}</div>}

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Item No.</th>
                  <th>Username</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Validity</th>
                  <th>Renewal Type</th>
                  <th>Year</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLicenses.length === 0 ? (
                  <tr>
                    <td colSpan="9">No licenses found.</td>
                  </tr>
                ) : (
                  filteredLicenses.map((license) => (
                    <tr key={license.item_no}>
                      <td>{license.item_no}</td>
                      <td>{license.username}</td>
                      <td>{license.category}</td>
                      <td>{license.type}</td>
                      <td>{license.validity}</td>
                      <td>{license.renewal_type}</td>
                      <td>{license.year}</td>
                      <td>{license.price ? `₱${parseFloat(license.price).toFixed(2)}` : 'N/A'}</td>
                      <td className="actions-cell">
                        <button className="small-button" onClick={() => openViewLicense(license.item_no)}>
                          View
                        </button>
                        <button className="small-button" onClick={() => openEditLicense(license.item_no)}>
                          Edit
                        </button>
                        <button className="small-button danger" onClick={() => handleDeleteLicense(license.item_no)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {viewLicense && (
        <div className="modal-backdrop" onClick={() => setViewLicense(null)}>
          <section className="modal-card wide" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h3>License Details</h3>
              <button className="close-button" onClick={() => setViewLicense(null)}>
                ×
              </button>
            </div>
            <div className="details-grid">
              {Object.entries(viewLicense)
                .filter(([key]) => key !== 'history' && key !== 'quotationFile')
                .map(([key, value]) => (
                  <div key={key} className="detail-row">
                    <strong>{key.replace(/_/g, ' ')}:</strong>
                    <span>{value || '—'}</span>
                  </div>
                ))}
            </div>
            <section className="history-section">
              <h4>License History</h4>
              {viewLicense.history && viewLicense.history.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Year</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewLicense.history.map((item) => (
                      <tr key={`${item.year}-${item.price}`}>
                        <td>{item.year}</td>
                        <td>{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div>No history available.</div>
              )}
            </section>
          </section>
        </div>
      )}

      {isFormOpen && (
        <div className="modal-backdrop" onClick={() => setIsFormOpen(false)}>
          <section className="modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingLicense ? 'Edit License' : 'Add License'}</h3>
              <button className="close-button" onClick={() => setIsFormOpen(false)}>
                ×
              </button>
            </div>
            <form className="license-form" onSubmit={handleSaveLicense}>
              <label>
                Category
                <input
                  type="text"
                  value={licenseForm.category}
                  onChange={(event) => setLicenseForm({ ...licenseForm, category: event.target.value })}
                  required
                />
              </label>
              <label>
                Type
                <input
                  type="text"
                  value={licenseForm.type}
                  onChange={(event) => setLicenseForm({ ...licenseForm, type: event.target.value })}
                  required
                />
              </label>
              <label>
                Validity
                <input
                  type="date"
                  value={licenseForm.validity}
                  onChange={(event) => setLicenseForm({ ...licenseForm, validity: event.target.value })}
                  required
                />
              </label>
              <label>
                Renewal Type
                <input
                  type="text"
                  value={licenseForm.renewal_type}
                  onChange={(event) => setLicenseForm({ ...licenseForm, renewal_type: event.target.value })}
                  required
                />
              </label>
              <label>
                Product
                <input
                  type="text"
                  value={licenseForm.product}
                  onChange={(event) => setLicenseForm({ ...licenseForm, product: event.target.value })}
                />
              </label>
              <label>
                Description
                <input
                  type="text"
                  value={licenseForm.description}
                  onChange={(event) => setLicenseForm({ ...licenseForm, description: event.target.value })}
                />
              </label>
              <label>
                Supplier
                <input
                  type="text"
                  value={licenseForm.supplier}
                  onChange={(event) => setLicenseForm({ ...licenseForm, supplier: event.target.value })}
                />
              </label>
              <label>
                Sales Contact
                <input
                  type="text"
                  value={licenseForm.sales_contact}
                  onChange={(event) => setLicenseForm({ ...licenseForm, sales_contact: event.target.value })}
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={licenseForm.email}
                  onChange={(event) => setLicenseForm({ ...licenseForm, email: event.target.value })}
                />
              </label>
              <label>
                Price
                <input
                  type="number"
                  step="0.01"
                  value={licenseForm.price}
                  onChange={(event) => setLicenseForm({ ...licenseForm, price: event.target.value })}
                />
              </label>
              <label>
                Year
                <input
                  type="number"
                  value={licenseForm.year}
                  onChange={(event) => setLicenseForm({ ...licenseForm, year: event.target.value })}
                  required
                />
              </label>
              <label>
                Remarks
                <input
                  type="text"
                  value={licenseForm.remarks}
                  onChange={(event) => setLicenseForm({ ...licenseForm, remarks: event.target.value })}
                />
              </label>
              <label>
                Quotation File
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  onChange={(event) => setLicenseForm({ ...licenseForm, quotationFile: event.target.files[0] })}
                />
              </label>
              <div className="modal-actions">
                <button type="submit" className="primary-button">Save</button>
                <button type="button" className="secondary-button" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
