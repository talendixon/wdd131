function isCardNumberValid(number) {
    // normally we would contact a credit card service...but we don't know how to do that yet. 
    // So to keep things simple we will only accept one number
    return number === '1234123412341234';
}

function displayError(msg) {
    // display error message
    document.querySelector('.errorMsg').innerHTML = msg;
}

function isDateValid(month, year) {
    // Get current date
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100; // Get last two digits of year
    const currentMonth = currentDate.getMonth() + 1; // getMonth() is zero-indexed
    
    // Convert inputs to numbers
    const inputMonth = parseInt(month, 10);
    const inputYear = parseInt(year, 10);
    
    // Check if month is valid (1-12)
    if (inputMonth < 1 || inputMonth > 12) {
        return false;
    }
    
    // Check if year is in the future, or if it's the current year, the month should be >= current month
    if (inputYear > currentYear || (inputYear === currentYear && inputMonth >= currentMonth)) {
        return true;
    }
    
    return false;
}

function submitHandler(event) {
    event.preventDefault();
    let errorMsg = '';
    
    // clear any previous errors
    displayError('');
    
    // check credit card number
    if (isNaN(this.cardNumber.value.replace(/\s/g, ''))) {
        // it is not a valid number
        errorMsg += 'Card number is not a valid number\n';
    } else if (!isCardNumberValid(this.cardNumber.value.replace(/\s/g, ''))) {
        // it is a number, but is it valid?
        errorMsg += 'Card number is not a valid card number\n';
    }
    
    // check expiration date
    if (!isDateValid(this.expirationMonth.value, this.expirationYear.value)) {
        errorMsg += 'Expiration date must be in the future\n';
    }
    
    // check CVV
    if (isNaN(this.cvv.value) || this.cvv.value.length !== 3) {
        errorMsg += 'CVV must be a 3-digit number\n';
    }
    
    if (errorMsg !== '') {
        // there was an error. stop the form and display the errors.
        displayError(errorMsg);
        return false;
    }
    
    // If we get here, the form is valid
    alert('Form submitted successfully! (This would normally send data to a server)');
    return true;
}

// Format card number with spaces as user types
document.getElementById('cardNumber').addEventListener('input', function(e) {
    // Get the input value and remove all non-digit characters
    let value = e.target.value.replace(/\D/g, '');
    
    // Add a space after every 4 digits
    let formattedValue = '';
    for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) {
            formattedValue += ' ';
        }
        formattedValue += value[i];
    }
    
    // Set the formatted value back to the input
    e.target.value = formattedValue;
});

// Ensure month input is valid
document.getElementById('expirationMonth').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length === 1) {
        if (parseInt(value) > 1) {
            e.target.value = '0' + value;
        } else {
            e.target.value = value;
        }
    } else if (value.length >= 2) {
        if (parseInt(value) > 12) {
            e.target.value = '12';
        } else if (parseInt(value) === 0) {
            e.target.value = '01';
        } else {
            e.target.value = value.substring(0, 2);
        }
    }
});

// Auto-focus next field when month is entered
document.getElementById('expirationMonth').addEventListener('keyup', function(e) {
    if (this.value.length === 2) {
        document.getElementById('expirationYear').focus();
    }
});

// Add the event listener to the form
document.querySelector('#credit-card').addEventListener('submit', submitHandler);