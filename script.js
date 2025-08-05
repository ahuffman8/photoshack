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
    
    // Function to load images from the /images directory
    async function loadImages() {
        try {
            // This is where you'd normally fetch a list of images
            // Since GitHub Pages doesn't support server-side directory listing,
            // we'll use a workaround by loading images from a known list or pattern
            
            // Example: if you know you're going to name images sequentially
            // or you could maintain a list of image names in a separate JSON file
            
            // For demonstration, let's assume we're checking for images in the /images directory
            const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
            
            // For demonstration, I'll check if certain files exist
            // In a real implementation, you might want to create a JSON file listing all images
            // For now, we'll just try to load from a range of potential file names
            
            checkImagesInDirectory('images');
            
        } catch (error) {
            console.error('Error loading images:', error);
            gallery.innerHTML = '<p class="error">Error loading images. Make sure you have images in the /images directory.</p>';
        }
    }
    
    // Check for images in a specific directory
    function checkImagesInDirectory(dirPath) {
        // This is a placeholder for demonstration
        // In a real implementation, you could use a JSON file that lists all images
        // or implement a naming convention
        
        // For this example, I'll create a few sample elements
        const sampleImages = [
            { name: 'sample1.jpg', path: `${dirPath}/sample1.jpg` },
            { name: 'sample2.jpg', path: `${dirPath}/sample2.jpg` },
            { name: 'example.png', path: `${dirPath}/example.png` }
        ];
        
        // Clear the gallery first
        gallery.innerHTML = '';
        
        // Create a placeholder message for empty gallery
        if (sampleImages.length === 0) {
            const placeholder = document.createElement('div');
            placeholder.className = 'placeholder';
            placeholder.innerHTML = `
                <p>No images found in the repository.</p>
                <p>Add images to the <code>/images</code> folder to see them here.</p>
            `;
            gallery.appendChild(placeholder);
            return;
        }
        
        // Add all images to the gallery
        sampleImages.forEach(img => {
            createImageElement(img.name, img.path);
        });
        
        // Add a note about these being sample images
        const note = document.createElement('div');
        note.className = 'note';
        note.style.gridColumn = '1 / -1';
        note.style.padding = '10px';
        note.style.backgroundColor = '#fffbea';
        note.style.borderRadius = '5px';
        note.style.marginTop = '20px';
        note.innerHTML = `
            <strong>Note:</strong> These are sample images. For this to work with your own images:
            <ul style="margin-left: 20px; margin-top: 5px;">
                <li>Create an <code>images</code> folder in your repository</li>
                <li>Add your images to that folder</li>
                <li>The images will appear here with their actual URLs</li>
            </ul>
        `;
        gallery.appendChild(note);
    }
    
    // Create an image element in the gallery
    function createImageElement(filename, path) {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = path;
        img.alt = filename;
        img.onerror = function() {
            // If image fails to load, display a placeholder
            img.src = 'https://via.placeholder.com/250x200?text=Image+Not+Found';
            img.alt = 'Image not found';
        };
        
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
        copyButton.style.backgroundColor = '#27ae60';
        
        setTimeout(function() {
            copyButton.textContent = originalText;
            copyButton.style.backgroundColor = '#3498db';
        }, 1500);
    });
    
    // Load images when page loads
    loadImages();
});
