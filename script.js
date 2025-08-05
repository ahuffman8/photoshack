document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.getElementById('gallery');
    const modal = document.getElementById('urlModal');
    const closeButton = document.querySelector('.close-button');
    const imageUrlInput = document.getElementById('imageUrl');
    const copyButton = document.getElementById('copyButton');
    const previewImage = document.getElementById('previewImage');
    
    // Get the repository name from the URL
    const repoName = window.location.pathname.split('/')[1];
    const username = window.location.hostname.split('.')[0];
    
    // Common image file extensions
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
    
    // Function to check if a filename has an image extension
    function isImageFile(filename) {
        filename = filename.toLowerCase();
        return imageExtensions.some(ext => filename.endsWith(ext));
    }
    
    // Function to load images directly from the repository root
    async function loadImages() {
        try {
            // Since GitHub Pages can't list directory contents dynamically,
            // we'll scan for any files matching image extensions
            scanRepository();
        } catch (error) {
            console.error('Error loading images:', error);
            gallery.innerHTML = '<p class="empty-message">Error loading images. Try refreshing the page.</p>';
        }
    }
    
    // Function to scan the repository for images
    function scanRepository() {
        // This is a placeholder for demonstration - in a real implementation,
        // you'd need to manually keep track of images in a JSON file or use a specific pattern
        
        // Create a placeholder message
        gallery.innerHTML = '<p class="empty-message">Scanning for images in repository...</p>';
        
        // Attempt to load some common image filename patterns
        const imagesToCheck = [];
        
        // Try to detect any images by testing a variety of common names
        // This is just a demo approach - in reality, GitHub Pages can't enumerate files
        for (let i = 1; i <= 10; i++) {
            imagesToCheck.push(`image${i}.jpg`);
            imagesToCheck.push(`photo${i}.jpg`);
            imagesToCheck.push(`img${i}.jpg`);
            imagesToCheck.push(`picture${i}.png`);
        }
        
        // Check for some common names
        imagesToCheck.push('profile.jpg', 'banner.jpg', 'logo.png', 'background.jpg');
        
        // Create a counter to keep track of loaded images
        let loadedImages = 0;
        let checkedImages = 0;
        
        // Clear gallery before checking
        gallery.innerHTML = '';
        
        // Check each potential image
        imagesToCheck.forEach(filename => {
            const img = new Image();
            img.onload = function() {
                // Image exists, add it to gallery
                createImageElement(filename, filename);
                loadedImages++;
                updateStatus(loadedImages, checkedImages, imagesToCheck.length);
            };
            img.onerror = function() {
                // Image doesn't exist or can't be loaded
                checkedImages++;
                updateStatus(loadedImages, checkedImages, imagesToCheck.length);
            };
            img.src = filename;
        });
        
        // Update status and show message if no images found
        function updateStatus(loaded, checked, total) {
            if (checked + loaded === total && loaded === 0) {
                gallery.innerHTML = '<p class="empty-message">No images found in the repository.<br>Upload some image files to your repository root to display them here.</p>';
            }
        }
        
        // Try to detect any other image files that might be in the repository
        // This is an additional step to check for images with file extensions
        fetch('.')
            .then(response => response.text())
            .then(html => {
                // This is a hack that tries to extract filenames from the HTML
                // Won't work reliably, but might catch some files in simple repositories
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const links = doc.querySelectorAll('a');
                
                links.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href && isImageFile(href)) {
                        const img = new Image();
                        img.onload = function() {
                            createImageElement(href, href);
                        };
                        img.src = href;
                    }
                });
            })
            .catch(error => console.log('Could not scan repository files'));
    }
    
    // Create an image element in the gallery
    function createImageElement(filename, path) {
        // Check if this image already exists in the gallery
        if (document.querySelector(`.gallery-item img[src="${path}"]`)) {
            return; // Skip duplicates
        }
        
        const item = document.createElement('div');
        item.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = path;
        img.alt = filename;
        
        const filenameElement = document.createElement('div');
        filenameElement.className = 'filename';
        filenameElement.textContent = filename;
        
        item.appendChild(img);
        item.appendChild(filenameElement);
        gallery.appendChild(item);
        
        // Add click event to show URL
        item.addEventListener('click', function() {
            const baseUrl = `https://${username}.github.io/${repoName}/`;
            const imageUrl = baseUrl + path;
            
            imageUrlInput.value = imageUrl;
            previewImage.src = path;
            previewImage.alt = filename;
            modal.style.display = 'block';
        });
    }
    
    // Close the modal when clicking the close button
    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside of it
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
    
    // Load images when page loads
    loadImages();
});
