let pendingUserData = {};
let currentEditUserId = null;

// Filter user table rows by search input
function updateTable() {
    const search = document.getElementById('searchBox').value.toLowerCase();
    const rows = document.querySelectorAll('#userTable tbody tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(search) ? '' : 'none';
    });
}

// Show and hide Add User popup
function showAddUserForm() {
    document.getElementById('addUserPopup').style.display = 'flex';
}

function hideAddUserForm() {
    document.getElementById('addUserPopup').style.display = 'none';
}

// When submit New User form, validate input and show confirmation popup
function submitNewUser() {
    const username = document.getElementById('newUsername').value.trim();
    const password = document.getElementById('newPassword').value.trim();
    const name = document.getElementById('newName').value.trim();
    const role = document.getElementById('newRole').value;
    const agreed = document.getElementById('agreeTerms').checked;

    if (!username || !password || !name || !agreed) {
        alert("Please fill out all fields and agree to the terms.");
        return;
    }

    pendingUserData = { username, password, name, role };

    document.getElementById('previewUsername').textContent = username;
    document.getElementById('previewPassword').textContent = password;
    document.getElementById('previewName').textContent = name;
    document.getElementById('previewRole').textContent = role;

    hideAddUserForm();
    document.getElementById('confirmUserPopup').style.display = 'flex';
}

// Hide Confirm User popup and show Add User form again
function hideConfirmUserForm() {
    document.getElementById('confirmUserPopup').style.display = 'none';
    showAddUserForm();
}

// Send request to add_user.php to create new user, then reload on success
function confirmUserCreation() {
    const formData = new FormData();
    formData.append('username', pendingUserData.username);
    formData.append('password', pendingUserData.password);
    formData.append('name', pendingUserData.name);
    formData.append('role', pendingUserData.role);

    fetch('add_user.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        if (data.status === 'success') {
            location.reload();
        }
    })
    .catch(error => {
        alert("An error occurred while adding the user.");
        console.error("Fetch error:", error);
    });
}

// Open Update User popup and fill form with current user data
function openUpdateUserForm(id, username, password, name, role) {
    document.getElementById('updateUserId').value = id;
    document.getElementById('updateUsername').value = username;
    document.getElementById('updatePassword').value = password;
    document.getElementById('updateName').value = name;
    document.getElementById('updateRole').value = role;

    document.getElementById('updateUserPopup').style.display = 'flex';
}

// Hide Update User popup
function hideUpdateUserForm() {
    document.getElementById('updateUserPopup').style.display = 'none';
}

// Send request to update_user.php with edited user data, then reload on success
function submitUserUpdate() {
    const userId = document.getElementById('updateUserId').value;
    const username = document.getElementById('updateUsername').value.trim();
    const password = document.getElementById('updatePassword').value.trim();
    const name = document.getElementById('updateName').value.trim();
    const role = document.getElementById('updateRole').value;

    if (!username || !password || !name) {
        alert("Please fill out all fields.");
        return;
    }

    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('username', username);
    formData.append('password', password);
    formData.append('name', name);
    formData.append('role', role);

    fetch('update_user.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        if (data.status === 'success') {
            location.reload();
        }
    })
    .catch(error => {
        alert("An error occurred while updating the user.");
        console.error("Update error:", error);
    });
}

// Send request to delete_user.php for deleting user by ID, reload on success
function deleteUser(userId) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    fetch('delete_user.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `user_id=${encodeURIComponent(userId)}`
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        if (data.status === 'success') {
            location.reload();
        }
    })
    .catch(error => {
        alert("An error occurred while deleting the user.");
        console.error("Delete error:", error);
    });
}

function showEditUserForm(userId) {
  fetch('edit_user.php?user_id=' + userId)
    .then(response => response.json())
    .then(data => {
      document.getElementById('editUsername').value = data.username;
      document.getElementById('editPassword').value = data.password;
      document.getElementById('editName').value = data.name;
      document.getElementById('editRole').value = data.role;
      document.getElementById('editUserPopup').style.display = 'block';
      window.currentEditUserId = userId;
    });
}

function closeEditUserForm() {
  document.getElementById('editUserPopup').style.display = 'none';
}

function updateUser() {
  const formData = new FormData();
  formData.append('user_id', window.currentEditUserId);
  formData.append('username', document.getElementById('editUsername').value);
  formData.append('password', document.getElementById('editPassword').value);
  formData.append('name', document.getElementById('editName').value);
  formData.append('role', document.getElementById('editRole').value);

  fetch('update_user.php', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(result => {
    if (result.status === 'success') {
      alert('User updated!');
      closeEditUserForm();
      location.reload();
    } else {
      alert('Update failed: ' + result.message);
    }
  });
}
