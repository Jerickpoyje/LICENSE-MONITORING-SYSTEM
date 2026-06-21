// VIEW LICENSE DETAILS
function viewDetails(itemNo) {
  const formData = new FormData();
  formData.append('action', 'view');
  formData.append('item_no', itemNo);

  fetch('license_controller.php', {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      const modal = document.getElementById('modal-' + itemNo);
      const ul = modal.querySelector('ul');
      ul.innerHTML = `
        <li><strong>Category:</strong> ${data.category}</li>
        <li><strong>Type:</strong> ${data.type}</li>
        <li><strong>Validity:</strong> ${data.validity}</li>
        <li><strong>Renewal Type:</strong> ${data.renewal_type}</li>
        <li><strong>Product:</strong> ${data.product}</li>
        <li><strong>Description:</strong> ${data.description}</li>
        <li><strong>Supplier:</strong> ${data.Supplier}</li>
        <li><strong>Sales Contact:</strong> ${data.sales_contact}</li>
        <li><strong>Email:</strong> ${data.email}</li>
        <li><strong>Price:</strong> ${data.price}</li>
        <li><strong>Remarks:</strong> ${data.remarks}</li>
        <li><strong>Quotation:</strong> ${data.quotation}</li>
      `;
      document.getElementById('overlay').style.display = 'block';
      modal.style.display = 'block';
    })
    .catch(err => {
      console.error('Fetch error:', err);
      alert('Failed to retrieve license details.');
    });
}

// CLOSE MODAL
function closeModal() {
  document.getElementById('overlay').style.display = 'none';
  document.querySelectorAll('.modal').forEach(modal => {
    modal.style.display = 'none';
  });
}

// DELETE LICENSE
function deleteLicense(itemNo) {
  if (!confirm("Are you sure you want to delete this license?")) return;

  const formData = new FormData();
  formData.append('action', 'delete');
  formData.append('item_no', itemNo);

  fetch('license_controller.php', {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      if (data.status === 'success') {
        location.reload();
      }
    })
    .catch(err => {
      console.error('Delete error:', err);
      alert('Unable to delete license record.');
    });
}

// SHOW ADD LICENSE FORM
function showAddLicenseForm() {
  document.getElementById('addLicensePopup').style.display = 'flex';
}

// HIDE ADD LICENSE FORM
function hideAddLicenseForm() {
  document.getElementById('addLicensePopup').style.display = 'none';
}

// SUBMIT NEW LICENSE
function submitNewLicense() {
  const formData = new FormData();
  formData.append('action', 'add');
  formData.append('item_no', document.getElementById('newItemNo').value);
  formData.append('category', document.getElementById('newCategory').value);
  formData.append('type', document.getElementById('newType').value);
  formData.append('validity', document.getElementById('newValidity').value);
  formData.append('renewal_type', document.getElementById('newRenewalType').value);
  formData.append('product', document.getElementById('newProduct').value);
  formData.append('description', document.getElementById('newDescription').value);
  formData.append('Supplier', document.getElementById('newSupplier').value);
  formData.append('sales_contact', document.getElementById('newSalesContact').value);
  formData.append('email', document.getElementById('newEmail').value);
  formData.append('price', document.getElementById('newPrice').value);
  formData.append('remarks', document.getElementById('newRemarks').value);
  formData.append('quotation', document.getElementById('newQuotation').value);

  fetch('license_controller.php', {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      if (data.status === 'success') {
        location.reload();
      }
    })
    .catch(err => {
      console.error('Add license error:', err);
      alert('Failed to add license.');
    });
}
