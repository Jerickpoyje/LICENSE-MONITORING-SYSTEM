let licenseData = [];
let editingLicenseItemNo = null;

function filterByYear() {
    const selectedYear = document.getElementById('yearFilter').value;
    fetchLicenses(selectedYear);
}

function fetchLicenses(year = '') {
    let url = 'get_licenses.php';
    if (year) url += '?year=' + year;
    fetch(url)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            if (data.status === 'error') {
                console.error("Error fetching licenses:", data.message);
                alert("Error fetching licenses: " + data.message);
                return;
            }
            licenseData = data;
            updateTable();
            updateTotalLicenses(year);
        })
        .catch(err => {
            console.error('Fetch licenses error:', err);
           // alert('An error occurred while fetching licenses.');
        });
}

function updateTable() {
    const search = document.getElementById('searchBox').value.toLowerCase();
    const tbody = document.querySelector('#licenseTable tbody');
    tbody.innerHTML = '';

    licenseData.forEach(license => {
        const combinedText = `${license.item_no} ${license.username} ${license.category} ${license.type} ${license.validity} ${license.renewal_type}`.toLowerCase();
        if (combinedText.includes(search)) {
            const tr = document.createElement('tr');
            let actionIcons = `<span class="action-icons" title="View" onclick="viewLicense('${license.item_no}')">👁️</span>`;
            if (
                license.username === loggedInUsername ||
                loggedInRole === 'Admin' ||
                loggedInRole === 'IT'
            ) {
                actionIcons += `
                    <span class="action-icons" title="Edit" onclick="editLicense('${license.item_no}')">✏️</span>
                    <span class="action-icons" title="Delete" onclick="deleteLicense('${license.item_no}')">🗑️</span>
                `;
            }

            tr.innerHTML = `
                <td>${license.item_no}</td>
                <td>${license.username || ''}</td>
                <td>${license.category}</td>
                <td>${license.type}</td>
                <td>${license.validity}</td>
                <td>${license.renewal_type}</td>
                <td>${license.year}</td>
                <td>₱${license.price ? parseFloat(license.price).toLocaleString(undefined, {minimumFractionDigits:2}) : 'N/A'}</td>
                <td>${actionIcons}</td>
            `;
            tbody.appendChild(tr);
        }
    });
}

function viewLicense(itemNo) {
    const license = licenseData.find(l => l.item_no == itemNo);
    if (!license) return;

    document.getElementById('viewItemNo').textContent = license.item_no;
    document.getElementById('viewCategory').textContent = license.category;
    document.getElementById('viewType').textContent = license.type;
    document.getElementById('viewValidity').textContent = license.validity;
    document.getElementById('viewRenewalType').textContent = license.renewal_type;
    document.getElementById('viewProduct').textContent = license.product;
    document.getElementById('viewDescription').textContent = license.description;
    document.getElementById('viewSupplier').textContent = license.supplier; 
    document.getElementById('viewSalesContact').textContent = license.sales_contact;
    document.getElementById('viewEmail').textContent = license.email;
    document.getElementById('viewYear').textContent = license.year; // <-- Show year
    document.getElementById('viewPrice').textContent = license.price ? parseFloat(license.price).toLocaleString(undefined, {minimumFractionDigits:2}) : 'N/A';
    document.getElementById('viewRemarks').textContent = license.remarks;

    const viewQuotationElement = document.getElementById('viewQuotation');
    if (license.quotation) {
        const filePath = 'uploads/' + license.quotation;
        viewQuotationElement.innerHTML = `<a href="${filePath}" target="_blank" rel="noopener noreferrer">View Quotation File</a>`;
    } else {
        viewQuotationElement.textContent = 'No file attached';
    }

    // Fetch and show license history
    fetch('get_license_history.php?item_no=' + itemNo)
        .then(res => res.json())
        .then(history => {
            let historyTable = '<table border="1" style="width:100%;margin-top:10px;"><tr style="background:#d80000;color:#fff;"><th>Year</th><th>Price</th></tr>';
            if (history.length === 0) {
                historyTable += '<tr><td colspan="2">No history available.</td></tr>';
            } else {
                // Remove duplicates by year
                const seenYears = new Set();
                history.forEach(row => {
                    if (!seenYears.has(row.year)) {
                        seenYears.add(row.year);
                        let price = parseFloat(row.price);
                        let priceDisplay = isNaN(price) ? 'N/A' : `₱${price.toLocaleString(undefined, {minimumFractionDigits:2})}`;
                        historyTable += `<tr><td>${row.year}</td><td>${priceDisplay}</td></tr>`;
                    }
                });
            }
            historyTable += '</table>';
            document.getElementById('licenseHistory').innerHTML = historyTable;
        });
    document.getElementById('viewLicensePopup').style.display = 'flex';
}

function hideViewLicenseForm() {
    document.getElementById('viewLicensePopup').style.display = 'none';
}

function showAddLicenseForm() {
    document.getElementById('editLicenseTitle').textContent = 'Add License';
    document.getElementById('category').value = '';
    document.getElementById('type').value = '';
    document.getElementById('validity').value = '';
    document.getElementById('renewalType').value = '';
    document.getElementById('product').value = '';
    document.getElementById('description').value = '';
    document.getElementById('supplier').value = '';
    document.getElementById('salesContact').value = '';
    document.getElementById('email').value = '';
    document.getElementById('price').value = '';
    document.getElementById('remarks').value = '';
    document.getElementById('quotationFile').value = '';
    document.getElementById('editLicensePopup').style.display = 'block';
}

function editLicense(itemNo) {
    editingLicenseItemNo = itemNo;
    document.getElementById('editLicenseTitle').textContent = "Edit License";

    const license = licenseData.find(l => l.item_no == itemNo);
    if (!license) {
        console.error("License not found for editing Item No.:", itemNo);
        return;
    }

    document.getElementById('category').value = license.category;
    document.getElementById('type').value = license.type;
    document.getElementById('validity').value = license.validity;
    document.getElementById('renewalType').value = license.renewal_type;
    document.getElementById('product').value = license.product;
    document.getElementById('description').value = license.description;
    document.getElementById('supplier').value = license.supplier;
    document.getElementById('salesContact').value = license.sales_contact;
    document.getElementById('email').value = license.email;
    document.getElementById('price').value = license.price;
    document.getElementById('year').value = license.year; // <-- Set year field
    document.getElementById('remarks').value = license.remarks;

    const currentQuotationFileElement = document.getElementById('currentQuotationFile');
    if (license.quotation) {
        currentQuotationFileElement.textContent = `Current file: ${license.quotation}`;
    } else {
        currentQuotationFileElement.textContent = 'No file currently attached.';
    }
    document.getElementById('quotationFile').value = '';

    document.getElementById('editLicensePopup').style.display = 'flex';
}

function hideEditLicenseForm() {
    document.getElementById('editLicensePopup').style.display = 'none';
    editingLicenseItemNo = null;
}

function clearLicenseForm() {
    document.getElementById('category').value = '';
    document.getElementById('type').value = '';
    document.getElementById('validity').value = '';
    document.getElementById('renewalType').value = 'Annual';
    document.getElementById('product').value = '';
    document.getElementById('description').value = '';
    document.getElementById('salesContact').value = '';
    document.getElementById('email').value = '';
    document.getElementById('price').value = '';
    document.getElementById('remarks').value = '';
    document.getElementById('quotationFile').value = '';
    document.getElementById('currentQuotationFile').textContent = '';
}

function submitLicenseForm() {
    const formData = new FormData();
    formData.append('category', document.getElementById('category').value);
    formData.append('type', document.getElementById('type').value);
    formData.append('validity', document.getElementById('validity').value);
    formData.append('renewal_type', document.getElementById('renewalType').value);
    formData.append('product', document.getElementById('product').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('supplier', document.getElementById('supplier').value);
    formData.append('sales_contact', document.getElementById('salesContact').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('price', document.getElementById('price').value);
    formData.append('year', document.getElementById('year').value); // <-- ADD THIS LINE
    formData.append('remarks', document.getElementById('remarks').value);
    if (document.getElementById('quotationFile').files[0]) {
        formData.append('quotationFile', document.getElementById('quotationFile').files[0]);
    }

    let url = 'add_license.php';
    let successMsg = 'License added successfully!';
    if (editingLicenseItemNo) {
        formData.append('item_no', editingLicenseItemNo);
        url = 'update_license.php';
        successMsg = 'License updated successfully!';
    }

    fetch(url, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert(successMsg);
            hideEditLicenseForm();
            fetchLicenses();
            editingLicenseItemNo = null;
            window.location.reload();
        } else {
            alert(data.message || 'Failed to save license.');
        }
    })
    .catch(error => {
        alert('Error: ' + error);
    });
}

function deleteLicense(itemNo) {
    if (!confirm('Are you sure you want to delete this license?')) return;

    fetch('delete_license.php', {
        method: 'POST',
        body: new URLSearchParams({ item_no: itemNo })
    })
    .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
    })
    .then(data => {
        alert(data.message);
        if (data.status === 'success') {
            fetchLicenses(); // Refresh the table after deletion
        }
    })
    .catch(err => {
        console.error('Delete license error:', err);
        alert('An error occurred while deleting the license.');
    });
}

function showExpiringLicenses() {
    const tbody = document.getElementById('expiringLicensesBody');
    tbody.innerHTML = '';

    let triggered = "no";
    const now = new Date();
    licenseData.forEach(license => {
        const validityDate = new Date(license.validity);
        const diffTime = validityDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        let remaining = '';
        let highlightClass = '';

        if (diffDays > 90) {
            remaining = Math.floor(diffDays / 30) + ' month(s)';
        } else if (diffDays > 0 && diffDays <= 90) {
            // Within 3 months before expiry
            remaining = Math.ceil(diffDays / 30) + ' month(s)';
            highlightClass = 'expiring-soon'; // Red for expiring soon

            // Notify only once per popup open
            if (triggered === "no") {
                triggered = 'yes';
                fetch('./send_license_expiry.php')
                    .then(response => response.text())
                    .then(data => {
                        console.log(data);
                    });
            }
        } else {
            // Already expired
            remaining = 'Expired';
            highlightClass = 'already-expired'; // Maroon for already expired
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${license.item_no}</td>
            <td>${license.username}</td>
            <td>${license.category}</td>
            <td>${license.type}</td>
            <td>${license.validity}</td>
            <td>${remaining}</td>
        `;
        // Add the class to the last cell if needed
        if (highlightClass) {
            tr.querySelector('td:last-child').classList.add(highlightClass);
        }
        tbody.appendChild(tr);
    });

    document.getElementById('expiringLicensesPopup').style.display = 'flex';
}

function hideExpiringLicenses() {
  document.getElementById('expiringLicensesPopup').style.display = 'none';
}

function exportTableByYear() {
    const selectedYear = document.getElementById('yearFilter').value;
    let filtered = licenseData;
    if (selectedYear) {
        filtered = licenseData.filter(l => String(l.year) === selectedYear);
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`Licenses for Year: ${selectedYear || 'All'}`, 10, 15);

    // Table headers
    const headers = [
        ["Item No.", "Username", "Category", "Type", "Validity", "Renewal Type", "Year", "Price"]
    ];

    // Table rows
    const rows = filtered.map(l => [
        l.item_no,
        l.username,
        l.category,
        l.type,
        l.validity,
        l.renewal_type,
        l.year,
        "PHP " + (l.price ? parseFloat(l.price).toLocaleString(undefined, {minimumFractionDigits:2}) : 'N/A')
    ]);

    doc.autoTable({
        head: headers,
        body: rows,
        startY: 25,
        styles: { fontSize: 10 }
    });

    doc.save(`licenses_${selectedYear || 'all'}.pdf`);
}

function exportLicenseDetails() {
    const itemNo = document.getElementById('viewItemNo').textContent;
    const license = licenseData.find(l => String(l.item_no) === String(itemNo));
    if (!license) return;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`License Details (Item No.: ${license.item_no})`, 10, 15);

    // Table rows: [Field, Value]
    const rows = [
        ["Item No.", license.item_no],
        ["Username", license.username],
        ["Category", license.category],
        ["Type", license.type],
        ["Validity", license.validity],
        ["Renewal Type", license.renewal_type],
        ["Product", license.product],
        ["Description", license.description],
        ["Supplier", license.supplier],
        ["Sales Contact", license.sales_contact],
        ["Email", license.email],
        ["Year", license.year],
        ["Price", "PHP " + (license.price ? parseFloat(license.price).toLocaleString(undefined, {minimumFractionDigits:2}) : 'N/A')],
        ["Remarks", license.remarks],
        ["Quotation", license.quotation ? license.quotation : "No file attached"]
    ];

    doc.autoTable({
        head: [["Field", "Value"]],
        body: rows,
        startY: 25,
        styles: { fontSize: 10 }
    });

    doc.save(`license_${license.item_no}.pdf`);
}

function updateTotalLicenses(selectedYear) {
    let total = 0;
    if (selectedYear) {
        total = licenseData.filter(l => String(l.year) === String(selectedYear)).length;
    } else {
        total = licenseData.length;
    }
    document.getElementById('totalLicenses').textContent = total;
}

document.addEventListener('DOMContentLoaded', fetchLicenses);

