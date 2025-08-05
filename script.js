document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.getElementById('gallery');
    const modal = document.getElementById('urlModal');
    const closeButton = document.querySelector('.close-button');
    const imageUrlInput = document.getElementById('imageUrl');
    const copyButton = document.getElementById('copyButton');
    const previewImage = document.getElementById('previewImage');
    
    // Get repository info
    const username = window.location.hostname.split('.')[0];
    const pathParts = window.location.pathname.split('/').filter(p => p);
    const repoName = pathParts.length > 0 ? pathParts[0] : '';
    
    // Configuration - NAMING CONVENTION
    const IMAGE_PREFIX = 'image.'; // All images start with this prefix
    
    // Display message in gallery
    function displayMessage(message) {
        gallery.innerHTML = `<div class="empty-message">${message}</div>`;
    }
    
    // Create image element
    function createImageElement(filename) {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = filename;
        img.alt = filename.replace(IMAGE_PREFIX, '');
        
        const filenameElement = document.createElement('div');
        filenameElement.className = 'filename';
        filenameElement.textContent = filename.replace(IMAGE_PREFIX, '');
        
        item.appendChild(img);
        item.appendChild(filenameElement);
        gallery.appendChild(item);
        
        item.addEventListener('click', function() {
            const baseUrl = `https://${username}.github.io/${repoName ? repoName + '/' : ''}`;
            const imageUrl = baseUrl + filename;
            
            imageUrlInput.value = imageUrl;
            previewImage.src = filename;
            previewImage.alt = filename;
            modal.style.display = 'block';
        });
        
        return item;
    }
    
    // Initialize gallery with automatic image detection based on prefix
    function initGallery() {
        gallery.innerHTML = '';
        displayMessage('Looking for images...');
        
        // Attempt to fetch a list of all files in the repository
        fetchRepoContents()
            .then(files => {
                // Filter for image files with our prefix
                const imageFiles = files.filter(file => 
                    file.startsWith(IMAGE_PREFIX) && 
                    /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file)
                );
                
                if (imageFiles.length === 0) {
                    displayNoImagesMessage();
                    return;
                }
                
                // Clear gallery and add all found images
                gallery.innerHTML = '';
                imageFiles.forEach(filename => {
                    createImageElement(filename);
                });
            })
            .catch(error => {
                console.error('Error detecting files:', error);
                // Fall back to manual detection
                detectImagesManually();
            });
    }
    
    // Try to detect images by checking for files with our prefix
    function detectImagesManually() {
        let foundImages = 0;
        const commonSuffixes = [
            'barclays', 'mofo', 'profile', 'logo', 'banner',
            'header', 'photo', 'screenshot', 'main', 'background',
            'icon', 'avatar', 'cover', 'splash', 'thumbnail'
        ];
        
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
        
        // Clear any previous images
        gallery.innerHTML = '';
        
        // Check all combinations of our naming convention
        commonSuffixes.forEach(suffix => {
            imageExtensions.forEach(ext => {
                const filename = `${IMAGE_PREFIX}${suffix}${ext}`;
                checkImage(filename);
            });
        });
        
        // Also try numeric suffixes (image.1.jpg, image.2.jpg)
        for (let i = 1; i <= 20; i++) {
            imageExtensions.forEach(ext => {
                const filename = `${IMAGE_PREFIX}${i}${ext}`;
                checkImage(filename);
            });
        }
        
        function checkImage(filename) {
            const img = new Image();
            
            img.onload = function() {
                if (foundImages === 0) gallery.innerHTML = '';
                createImageElement(filename);
                foundImages++;
            };
            
            img.onerror = function() {
                // If we've checked all possibilities and found nothing
                if (--remainingChecks === 0 && foundImages === 0) {
                    displayNoImagesMessage();
                }
            };
            
            img.src = filename;
        }
        
        let remainingChecks = commonSuffixes.length * imageExtensions.length + 
                              20 * imageExtensions.length;
    }
    
    // Attempt to fetch repository contents (this is a best-effort approach)
    function fetchRepoContents() {
        return new Promise((resolve, reject) => {
            // This is just a placeholder - GitHub Pages doesn't allow directory listing
            // So we'll just return an empty array and let the manual detection take over
            setTimeout(() => resolve([]), 100);
        });
    }
    
    // Display a message when no images are found
    function displayNoImagesMessage() {
        displayMessage(`
            <strong>No images found in your repository.</strong><br><br>
            
            <p>For automatic detection, name your images using the pattern:</p>
            <ul>
                <li><code>${IMAGE_PREFIX}description.jpg</code></li>
                <li><code>${IMAGE_PREFIX}barclays.jpg</code></li>
                <li><code>${IMAGE_PREFIX}mofo.png</code></li>
                <li>etc.</li>
            </ul>
            
            <p>Then upload them to your repository root (not in any folder).</p>
        `);
    }
    
    // Modal functionality
    closeButton.addEventListener('click', () => modal.style.display = 'none');
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) modal.style.display = 'none';
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
    
    // Start the gallery
    initGallery();
});
