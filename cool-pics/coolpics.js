// Viewer template function
function viewerTemplate(imagePath, altText) {
  return `
    <div class="viewer">
      <button class="close-viewer" aria-label="Close image viewer">X</button>
      <img src="${imagePath}" alt="${altText}">
    </div>
  `;
}

// View handler function
function viewHandler(event) {
  if (event.target.tagName === 'IMG') {
    const clickedImage = event.target;
    const imageParts = clickedImage.src.split('-');
    const fullImagePath = `${imageParts[0]}-full.jpeg`;
    
    document.body.insertAdjacentHTML(
      'afterbegin', 
      viewerTemplate(fullImagePath, clickedImage.alt)
    );
    
    document.querySelector('.close-viewer')
      .addEventListener('click', closeViewer);
  }
}

// Close viewer function
function closeViewer() {
  document.querySelector('.viewer').remove();
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const menuButton = document.querySelector('.menu-button');
  const nav = document.querySelector('nav');
  
  // Menu button click handler
  menuButton?.addEventListener('click', function() {
    nav.classList.toggle('hidden');
    const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', !isExpanded);
  });

  // Window resize handler
  function handleResize() {
    if (window.innerWidth >= 700) {
      nav.classList.remove('hidden');
      menuButton?.setAttribute('aria-expanded', 'true');
    } else {
      nav.classList.add('hidden');
      menuButton?.setAttribute('aria-expanded', 'false');
    }
  }

  // Add resize listener and call immediately
  window.addEventListener('resize', handleResize);
  handleResize();

  // Add gallery click listener
  document.querySelector('.gallery')
    ?.addEventListener('click', viewHandler);

  console.log("Cool Pics loaded and initialized!");
});