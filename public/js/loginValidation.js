document.addEventListener('DOMContentLoaded', function() {
    const passwordFields = document.querySelectorAll('.passwordField');
    passwordFields.forEach(passwordInput => {
        const validationMessage = document.createElement('div');
        validationMessage.style.color = 'red';
        passwordInput.parentNode.insertBefore(validationMessage, passwordInput.nextSibling);

        function validatePassword() {
            const password = passwordInput.value;
            let message = '';
            if (password.length < 8) {
                message += 'Password must be at least 8 characters long. ';
            }
            if (!/[A-Z]/.test(password)) {
                message += 'Password must contain at least one uppercase letter. ';
            }
            if (!/[a-z]/.test(password)) {
                message += 'Password must contain at least one lowercase letter. ';
            }
            if (!/[0-9]/.test(password)) {
                message += 'Password must contain at least one digit. ';
            }
            if (!/[^a-zA-Z0-9]/.test(password)) {
                message += 'Password must contain at least one special character. ';
            }

            validationMessage.textContent = message;
        }

        passwordInput.addEventListener('input', validatePassword);
    });
});