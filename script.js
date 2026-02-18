// Friendship Book Album - JavaScript - 3D Flip Book with Flip Functionality

// Global variables
let currentPage = 0;
let isBookOpen = false;
let isFlipping = false;
const totalPages = 6;

// DOM Elements
const book = document.getElementById('book');
const cover = document.getElementById('cover');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const currentPageSpan = document.getElementById('currentPage');
const totalPagesSpan = document.getElementById('totalPages');
const heartsContainer = document.getElementById('heartsContainer');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    totalPagesSpan.textContent = totalPages;
    updateNavigation();
    
    // Hide all pages initially except cover
    for (let i = 1; i <= totalPages; i++) {
        const page = document.getElementById('page' + i);
        if (page) {
            page.classList.remove('active');
            page.classList.remove('flipped');
            page.classList.remove('flipping');
        }
    }
    
    // Add click event to book for opening/closing
    book.addEventListener('click', function(e) {
        // Don't toggle if clicking navigation buttons or flip zones
        if (!e.target.classList.contains('nav-button') && 
            !e.target.classList.contains('page-flip-zone') &&
            !e.target.closest('.page-flip-zone')) {
            if (!isBookOpen) {
                openBook();
            }
        }
    });
    
    // Add flip zone click handlers to each page
    for (let i = 1; i <= totalPages; i++) {
        const page = document.getElementById('page' + i);
        if (page) {
            // Create flip zone element
            const flipZone = document.createElement('div');
            flipZone.className = 'page-flip-zone';
            flipZone.title = 'Click to flip';
            page.appendChild(flipZone);
            
            // Add click event to flip zone
            flipZone.addEventListener('click', function(e) {
                e.stopPropagation();
                if (!isFlipping) {
                    flipPageForward(i);
                }
            });
        }
    }
    
    // Add floating hearts background
    createBackgroundHearts();
    
    // Add click to heart animation on message boxes
    const messageBoxes = document.querySelectorAll('.message-box');
    messageBoxes.forEach(box => {
        box.addEventListener('click', createHeartBurst);
    });
    
    console.log('Friendship Book initialized!');
    console.log('Click the book to open, or use Next button');
    console.log('Click on right side of page to flip forward!');
});

// Open the book
function openBook() {
    isBookOpen = true;
    book.classList.add('opened');
    console.log('Book opened!');
    
    // Show first page when opened
    setTimeout(() => {
        currentPage = 1;
        showPage(1);
        updateNavigation();
    }, 300);
}

// Close the book - go back to cover
function closeBook() {
    isBookOpen = false;
    book.classList.remove('opened');
    
    // Reset all pages
    for (let i = 1; i <= totalPages; i++) {
        const page = document.getElementById('page' + i);
        if (page) {
            page.classList.remove('flipped');
            page.classList.remove('flipping');
            page.classList.remove('active');
        }
    }
    
    // Show cover
    cover.classList.add('active');
    
    currentPage = 0;
    updateNavigation();
    console.log('Book closed!');
}

// Flip page forward (with animation)
function flipPageForward(pageNum) {
    if (isFlipping || pageNum >= totalPages) return;
    
    isFlipping = true;
    const currentPageEl = document.getElementById('page' + pageNum);
    const nextPageEl = document.getElementById('page' + (pageNum + 1));
    
    if (currentPageEl && nextPageEl) {
        // Add flipping class for animation
        currentPageEl.classList.add('flipping');
        
        // After flip animation, show next page
        setTimeout(() => {
            currentPageEl.classList.remove('flipping');
            currentPageEl.classList.remove('active');
            currentPageEl.classList.add('flipped');
            
            nextPageEl.classList.add('active');
            
            currentPage = pageNum + 1;
            updateNavigation();
            isFlipping = false;
            
            // Create heart celebration on certain pages
            if (currentPage === 3 || currentPage === 6) {
                setTimeout(createHeartBurst, 300);
            }
            
            console.log('Flipped to page:', currentPage);
        }, 600);
    }
}

// Flip page backward (with animation)
function flipPageBackward(pageNum) {
    if (isFlipping || pageNum <= 1) return;
    
    isFlipping = true;
    const currentPageEl = document.getElementById('page' + pageNum);
    const prevPageEl = document.getElementById('page' + (pageNum - 1));
    
    if (currentPageEl && prevPageEl) {
        // Show previous page without flip animation (going back)
        currentPageEl.classList.remove('active');
        currentPageEl.classList.remove('flipped');
        
        prevPageEl.classList.remove('flipped');
        prevPageEl.classList.add('active');
        
        currentPage = pageNum - 1;
        updateNavigation();
        isFlipping = false;
        
        console.log('Went back to page:', currentPage);
    }
}

// Show a specific page (used for initial load)
function showPage(pageNum) {
    // Hide cover
    cover.classList.remove('active');
    
    // Show the requested page
    for (let i = 1; i <= totalPages; i++) {
        const page = document.getElementById('page' + i);
        if (page) {
            if (i === pageNum) {
                page.classList.add('active');
                page.classList.remove('flipped');
            } else if (i < pageNum) {
                page.classList.add('active');
                page.classList.add('flipped');
            } else {
                page.classList.remove('active');
                page.classList.remove('flipped');
            }
        }
    }
}

// Turn page with button - WITH FLIP ANIMATION
function turnPage(direction) {
    console.log('turnPage called with direction:', direction, 'currentPage:', currentPage);
    
    if (isFlipping) return;
    
    if (!isBookOpen && direction > 0) {
        openBook();
        return;
    }
    
    const newPage = currentPage + direction;
    
    if (newPage >= 1 && newPage <= totalPages) {
        // Use flip animation for forward, quick return for backward
        if (direction > 0) {
            flipPageForward(currentPage);
        } else {
            flipPageBackward(currentPage);
        }
        
        // Create heart celebration on certain pages
        if (newPage === 3 || newPage === 6) {
            setTimeout(createHeartBurst, 500);
        }
        
        console.log('Now on page:', newPage);
    } else if (newPage === 0) {
        // Go back to cover
        closeBook();
    }
}

// Update navigation buttons
function updateNavigation() {
    currentPageSpan.textContent = currentPage;
    
    // Enable/disable buttons based on current page
    if (currentPage === 0) {
        prevBtn.disabled = true;
        prevBtn.style.opacity = '0.5';
        nextBtn.disabled = false;
        nextBtn.style.opacity = '1';
    } else if (currentPage === totalPages) {
        prevBtn.disabled = false;
        prevBtn.style.opacity = '1';
        nextBtn.disabled = true;
        nextBtn.style.opacity = '0.5';
    } else {
        prevBtn.disabled = false;
        prevBtn.style.opacity = '1';
        nextBtn.disabled = false;
        nextBtn.style.opacity = '1';
    }
    
    console.log('Navigation updated - currentPage:', currentPage);
}

// Create background floating hearts
function createBackgroundHearts() {
    const floatingElements = document.querySelector('.floating-elements');
    if (!floatingElements) return;
    
    const hearts = ['💖', '💕', '💗', '💝', '💘', '💟'];
    
    // Add more floating hearts
    for (let i = 0; i < 15; i++) {
        const span = document.createElement('span');
        span.classList.add('floating');
        span.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        span.style.left = Math.random() * 100 + '%';
        span.style.top = Math.random() * 100 + '%';
        span.style.animationDelay = Math.random() * 8 + 's';
        span.style.animationDuration = (6 + Math.random() * 4) + 's';
        floatingElements.appendChild(span);
    }
}

// Create heart burst animation
function createHeartBurst(event) {
    const hearts = ['💖', '💕', '💗', '💝', '✨', '🌟'];
    const container = document.getElementById('heartsContainer');
    
    // Create multiple hearts
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.classList.add('heart-float');
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.left = (Math.random() * 80 + 10) + '%';
            heart.style.animationDuration = (3 + Math.random() * 2) + 's';
            container.appendChild(heart);
            
            // Remove heart after animation
            setTimeout(() => {
                heart.remove();
            }, 4000);
        }, i * 100);
    }
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight' || e.key === ' ') {
        turnPage(1);
    } else if (e.key === 'ArrowLeft') {
        turnPage(-1);
    }
});

// Touch swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next page
            turnPage(1);
        } else {
            // Swipe right - previous page
            turnPage(-1);
        }
    }
}

// Auto-play background music (with user interaction)
document.body.addEventListener('click', function() {
    const audio = document.getElementById('background-music');
    if (audio) {
        audio.volume = 0.3;
    }
}, { once: true });
