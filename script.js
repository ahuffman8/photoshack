document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.getElementById('gallery');
    const modal = document.getElementById('urlModal');
    const closeButton = document.querySelector('.close-button');
    const imageUrlInput = document.getElementById('imageUrl');
    const copyButton = document.getElementById('copyButton');
    const previewImage = document.getElementById('previewImage');
    
    // Get repository info - handle both GitHub Pages and local development
    let username = 'username';
    let repoName = 'repository';
    
    try {
        // Extract from URL for GitHub Pages
        if (window.location.hostname.endsWith('github.io')) {
            username = window.location.hostname.split('.')[0];
            repoName = window.location.pathname.split('/')[1] || '';
        }
    } catch (e) {
        console.log('Could not determine repository info from URL');
    }

    // Simplified display message
    function displayMessage(message) {
        gallery.innerHTML = `<div class="empty-message">${message}</div>`;
    }
    
    // Create an image element in the gallery
    function createImageElement(filename, path) {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = path;
        img.alt = filename;
        img.onerror = function() {
            this.style.display = 'none'; // Hide broken images
        };
        
        const filenameElement = document.createElement('div');
        filenameElement.className = 'filename';
        filenameElement.textContent = filename;
        
        item.appendChild(img);
        item.appendChild(filenameElement);
        gallery.appendChild(item);
        
        // Add click event to show URL
        item.addEventListener('click', function() {
            if (img.style.display === 'none') return; // Don't show modal for broken images
            
            let imageUrl;
            if (path.startsWith('http')) {
                imageUrl = path;
            } else {
                const baseUrl = `https://${username}.github.io/${repoName}/`.replace('///', '/');
                imageUrl = baseUrl + path;
            }
            
            imageUrlInput.value = imageUrl;
            previewImage.src = path;
            previewImage.alt = filename;
            modal.style.display = 'block';
        });
    }
    
    // Close modal functionality
    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Copy URL to clipboard
    copyButton.addEventListener('click', function() {
        imageUrlInput.select();
        document.execCommand('copy');
        
        const originalText = copyButton.textContent;
        copyButton.textContent = 'Copied!';
        copyButton.style.backgroundColor = '#6a0dad';
        
        setTimeout(function() {
            copyButton.textContent = originalText;
            copyButton.style.backgroundColor = '#8a2be2';
        }, 1500);
    });

    // Display initial message
    displayMessage('Upload images to your repository to display them here. <br><br>Make sure they have image file extensions (.jpg, .png, etc.)');
    
    // Manually add image test for demonstration
    // Update these with your actual image names
    const testImages = [
        'image1.jpg',
        'photo.png',
        'screenshot.jpg'
    ];
    
    // Try to load any existing images
    testImages.forEach(img => {
        createImageElement(img, img);
    });
});
