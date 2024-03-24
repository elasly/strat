document.addEventListener('DOMContentLoaded', function() {
    const updateProfileForm = document.getElementById('updateProfileForm');
    const subscriptionTierSelect = document.querySelector('select[name="newTier"]');

    updateProfileForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(updateProfileForm);
        const object = {};
        formData.forEach((value, key) => object[key] = value);
        object['newTier'] = subscriptionTierSelect ? subscriptionTierSelect.value : '';
        const json = JSON.stringify(object);

        fetch('/updateProfile', {
            method: 'POST',
            body: json,
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                document.getElementById('email').value = data.userData.email;
                document.getElementById('phone').value = data.userData.phone || '';
                document.getElementById('mailingAddress').value = data.userData.mailingAddress || '';
                alert('Profile updated successfully!');
            } else {
                throw new Error(data.message || 'An error occurred while updating the profile.');
            }
        })
        .catch(error => {
            console.error('Error updating profile:', error.message, error.stack);
            alert(`Error updating profile. Please try again. Error: ${error.message}`);
        });
    });
});