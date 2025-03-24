// Select the theme selector dropdown
const themeSelector = document.querySelector('#theme-selector');

// Function to change the theme
function changeTheme() {
    // Check the current value of the theme selector
    if (themeSelector.value === 'dark') {
        // Add dark class to body
        document.body.classList.add('dark');
        
        // Change logo to white version
        const logo = document.querySelector('footer img');
        logo.src = 'logo-white.webp';
        logo.alt = 'BYUI logo, white';
    } else {
        // Remove dark class from body
        document.body.classList.remove('dark');
        
        // Change logo back to blue version
        const logo = document.querySelector('footer img');
        logo.src = 'logo.webp';
        logo.alt = 'BYUI logo, blue';
    }
}

// Add event listener to theme selector
themeSelector.addEventListener('change', changeTheme);