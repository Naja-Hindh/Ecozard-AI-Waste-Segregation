// Navigation Toggle for Mobile
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');

    // Animate hamburger menu
    const spans = navToggle.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu when clicking a link
const navLinks = document.querySelectorAll('.nav-link, .nav-cta');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.padding = '0.5rem 0';
        navbar.style.boxShadow = '0 2px 25px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.padding = '1rem 0';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }

    lastScroll = currentScroll;
});

// Hero Button Navigation
const leftPanel = document.querySelector('.left-panel');

// "Start Sorting" button - scroll to Analyze section
document.querySelectorAll('.btn-primary').forEach(btn => {
    if (btn.textContent.includes('Start Sorting')) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const analyzeSection = document.getElementById('analyze');
            if (analyzeSection && leftPanel) {
                const sectionTop = analyzeSection.offsetTop;
                leftPanel.scrollTo({
                    top: sectionTop - 100, // Offset for navbar
                    behavior: 'smooth'
                });
            }
        });
    }
});

// "Learn How" button - scroll to How It Works section
document.querySelectorAll('.btn-secondary').forEach(btn => {
    if (btn.textContent.includes('Learn How')) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const howItWorksSection = document.getElementById('how-it-works');
            if (howItWorksSection && leftPanel) {
                const sectionTop = howItWorksSection.offsetTop;
                leftPanel.scrollTo({
                    top: sectionTop - 100, // Offset for navbar
                    behavior: 'smooth'
                });
            }
        });
    }
});

// =================
// ANALYZE WASTE SECTION
// =================

const captureBtn = document.getElementById('captureBtn');
const uploadBtn = document.getElementById('uploadBtn');
const fileInput = document.getElementById('fileInput');
const imagePreview = document.getElementById('imagePreview');
const previewImage = document.getElementById('previewImage');
const analyzeBtn = document.getElementById('analyzeBtn');
const resultCard = document.getElementById('resultCard');
const uncertaintyCard = document.getElementById('uncertaintyCard');
const loadingSpinner = document.getElementById('loadingSpinner');

let selectedImage = null;

// Capture Photo (Camera)
captureBtn.addEventListener('click', async () => {
    try {
        // Request camera access
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' } // Use back camera on mobile
        });

        // Create video element to show camera feed
        const video = document.createElement('video');
        video.srcObject = stream;
        video.autoplay = true;
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'contain';

        // Create capture button overlay
        const captureOverlay = document.createElement('div');
        captureOverlay.style.position = 'absolute';
        captureOverlay.style.bottom = '20px';
        captureOverlay.style.left = '50%';
        captureOverlay.style.transform = 'translateX(-50%)';
        captureOverlay.style.zIndex = '10';

        const capturePhotoBtn = document.createElement('button');
        capturePhotoBtn.textContent = '📸 Capture';
        capturePhotoBtn.className = 'btn btn-primary';
        capturePhotoBtn.style.margin = '0 0.5rem';

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '✖ Cancel';
        cancelBtn.className = 'btn btn-secondary';
        cancelBtn.style.margin = '0 0.5rem';

        captureOverlay.appendChild(capturePhotoBtn);
        captureOverlay.appendChild(cancelBtn);

        // Replace preview with video
        imagePreview.innerHTML = '';
        imagePreview.appendChild(video);
        imagePreview.appendChild(captureOverlay);

        // Capture photo
        capturePhotoBtn.addEventListener('click', () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0);

            // Stop camera
            stream.getTracks().forEach(track => track.stop());

            // Set captured image
            canvas.toBlob(blob => {
                selectedImage = blob;
                const url = URL.createObjectURL(blob);
                displayImage(url);
                analyzeBtn.disabled = false;
            });
        });

        // Cancel camera
        cancelBtn.addEventListener('click', () => {
            stream.getTracks().forEach(track => track.stop());
            resetPreview();
        });

    } catch (error) {
        console.error('Camera access error:', error);
        alert('Unable to access camera. Please grant permission or use the upload option.');
    }
});

// Upload Image
uploadBtn.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        selectedImage = file;
        const url = URL.createObjectURL(file);
        displayImage(url);
        analyzeBtn.disabled = false;
    }
});

// Sample Waste Buttons
const sampleSamples = {
    banana: {
        category: 'Organic',
        item: 'Banana Peel',
        tip: 'Composting banana peels creates nutrient-rich soil for plants and reduces landfill methane emissions!',
        emoji: '🍌'
    },
    bottle: {
        category: 'Recyclable',
        item: 'Plastic Bottle',
        tip: 'Rinse the bottle before recycling to prevent contamination and ensure it can be properly processed!',
        emoji: '🧴'
    },
    battery: {
        category: 'Hazardous',
        item: 'Battery',
        tip: 'Never throw batteries in regular trash. Take them to a designated e-waste collection point to prevent soil contamination!',
        emoji: '🔋'
    }
};

document.querySelectorAll('.sample-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const sampleType = this.dataset.sample;
        const sample = sampleSamples[sampleType];

        // Create a placeholder "image" for the sample
        selectedImage = new Blob(['sample'], { type: 'image/png' });

        // Show sample emoji as preview
        imagePreview.innerHTML = `
            <div style="font-size: 8rem; display: flex; align-items: center; justify-content: center; height: 100%;">
                ${sample.emoji}
            </div>
        `;
        imagePreview.classList.add('has-image');

        // Enable analyze button
        analyzeBtn.disabled = false;

        // Hide previous results
        hideResults();

        // Store sample data for analysis
        btn.sampleData = sample;
    });
});

// Display image in preview
function displayImage(url) {
    previewImage.src = url;
    imagePreview.classList.add('has-image');
    hideResults();
}

// Reset preview
function resetPreview() {
    imagePreview.innerHTML = `
        <img id="previewImage" alt="Preview">
        <div class="preview-placeholder">
            <span class="placeholder-icon">🖼️</span>
            <p>No image selected</p>
        </div>
    `;
    imagePreview.classList.remove('has-image');
    selectedImage = null;
    analyzeBtn.disabled = true;
}

// Hide results
function hideResults() {
    resultCard.classList.remove('show');
    uncertaintyCard.classList.remove('show');
}

// Analyze Waste Button
analyzeBtn.addEventListener('click', async () => {
    if (!selectedImage) return;

    // Show loading
    loadingSpinner.classList.add('show');
    hideResults();
    analyzeBtn.disabled = true;

    // Check if this is a sample
    const sampleBtn = document.querySelector('.sample-btn:focus, .sample-btn:active');
    const hasSampleData = sampleBtn && sampleBtn.sampleData;

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Hide loading
    loadingSpinner.classList.remove('show');
    analyzeBtn.disabled = false;

    if (hasSampleData) {
        // Show sample result
        displayResults(sampleBtn.sampleData);
    } else {
        // Try API or show demo result
        try {
            const formData = new FormData();
            formData.append('image', selectedImage);

            const response = await fetch('/analyze', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            displayResults(data);

        } catch (error) {
            console.error('Analysis error:', error);
            displayDemoResult();
        }
    }

    // Scroll to Ecozard's Wisdom Space to show results
    setTimeout(() => {
        const wisdomSpace = document.getElementById('ecozard-wisdom');
        if (wisdomSpace && leftPanel) {
            const wisdomTop = wisdomSpace.offsetTop;
            leftPanel.scrollTo({
                top: wisdomTop - 120, // Offset for navbar and spacing
                behavior: 'smooth'
            });
        }
    }, 300); // Small delay to let results render first
});

// Display analysis results
function displayResults(data) {
    const { category, item, tip, confidence } = data;

    if (confidence && confidence < 0.6) {
        // Show uncertainty card
        showUncertaintyCard();
    } else {
        // Set wizard spell message
        const spellMessages = {
            'Recyclable': '♻️ Recyclio Sortum! This item can begin a second life. Clean it and recycle.',
            'Organic': '🌱 Naturalis Returno! This waste returns to the earth through composting.',
            'Hazardous': '🔮 Cautio Maxima! This item needs special care. Dispose safely.'
        };
        document.getElementById('spellMessage').textContent = spellMessages[category] || 'The sorting spell reveals...';

        // Set detected item
        document.getElementById('detectedItem').textContent = item || 'Unknown item';

        // Set category badge
        const categoryBadge = document.getElementById('categoryBadge');
        categoryBadge.textContent = category || 'Recyclable';
        categoryBadge.className = 'category-badge';

        if (category === 'Organic') {
            categoryBadge.classList.add('organic');
        } else if (category === 'Hazardous') {
            categoryBadge.classList.add('hazardous');
        }

        // Set eco tip
        document.getElementById('ecoTip').textContent = tip || 'Remember to keep items clean for proper recycling!';

        resultCard.classList.add('show');
    }
}

// Demo result display (for testing without backend)
function displayDemoResult() {
    const demoResults = [
        {
            category: 'Recyclable',
            item: 'Plastic Bottle',
            tip: 'Rinse the bottle before recycling to prevent contamination and ensure it can be properly processed!'
        },
        {
            category: 'Organic',
            item: 'Food Waste',
            tip: 'Composting food waste creates nutrient-rich soil for plants and reduces landfill methane emissions!'
        },
        {
            category: 'Hazardous',
            item: 'Battery',
            tip: 'Never throw batteries in regular trash. Take them to a designated e-waste collection point to prevent soil contamination!'
        }
    ];

    const randomResult = demoResults[Math.floor(Math.random() * demoResults.length)];
    const shouldShowUncertainty = Math.random() > 0.7; // 30% chance

    if (shouldShowUncertainty) {
        showUncertaintyCard();
    } else {
        displayResults(randomResult);
    }
}

// Show uncertainty card
function showUncertaintyCard() {
    uncertaintyCard.classList.add('show');

    // Handle category selection
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const category = this.dataset.category;

            // Hide uncertainty, show result with selected category
            uncertaintyCard.classList.remove('show');
            displayResults({
                category: category.charAt(0).toUpperCase() + category.slice(1),
                item: 'User-identified waste',
                tip: 'Thank you for helping Ecozard learn! Your input improves our magic ✨'
            });
        }, { once: true });
    });
}

// Button ripple effect
const buttons = document.querySelectorAll('.btn, .nav-cta');
buttons.forEach(button => {
    button.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple effect CSS dynamically
const style = document.createElement('style');
style.textContent = `
    .btn, .nav-cta {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Console welcome message
console.log('%c🧙‍♂️ Welcome to Ecozard!', 'font-size: 20px; color: #5fb563; font-weight: bold;');
console.log('%cSorting waste, made magical ✨', 'font-size: 14px; color: #636e72;');
