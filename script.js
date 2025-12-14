// Mapping between week number and original DOCX filename in docs/
const fileMap = {
    1: "Java-week-1.docx",
    2: "Java-week-2.docx",
    3: "Java-week-3.docx",
    4: "Java-week-4.docx",
    5: "Java-week-5.docx",
    6: "java-week-6.docx",
    7: "Java-week-7.docx",
    8: "Java-week-8.docx",
    9: "Java-week-9.docx",
    10: "Java-week-10.docx",
    11: "Java-week-11.docx",
    12: "Java-week-12.docx"
};

// Create the week cards on the left panel
document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".weeks-container");
    if (!container) {
        console.error("Weeks container not found");
        return;
    }

    // Add loading animation to container
    container.classList.add('loading');
    
    // Create cards with staggered animation
    setTimeout(() => {
        for (let week = 1; week <= 12; week++) {
            const card = document.createElement("button");
            card.className = "week-card fade-in slide-in-left";
            card.type = "button";
            card.dataset.week = String(week);
            card.textContent = `Week ${week}`;
            
            // Stagger animation
            card.style.animationDelay = `${week * 0.05}s`;

            card.addEventListener("click", () => {
                setActiveCard(week);
                loadWeek(week);
            });

            container.appendChild(card);
        }
        
        // Remove loading class after cards are created
        container.classList.remove('loading');
    }, 300);

    // Auto-load Week 1 by default after a short delay
    setTimeout(() => {
        setActiveCard(1);
        loadWeek(1);
    }, 800);
});

// Highlight the selected week card with animation
function setActiveCard(activeWeek) {
    const cards = document.querySelectorAll(".week-card");
    if (cards.length === 0) {
        console.warn("No week cards found");
        return;
    }
    
    cards.forEach(card => {
        if (Number(card.dataset.week) === activeWeek) {
            if (!card.classList.contains("active")) {
                card.classList.add("active");
                // Add a subtle pulse effect
                card.style.transform = "scale(1.02)";
                setTimeout(() => {
                    card.style.transform = "";
                }, 200);
            }
        } else {
            card.classList.remove("active");
        }
    });
}

// Load the selected week's HTML into the iframe and set download link
function loadWeek(week) {
    const title = document.getElementById("week-title");
    const frame = document.getElementById("frame");
    const link = document.getElementById("downloadLink");
    const viewer = document.querySelector(".content-viewer");

    if (!title || !frame || !link || !viewer) {
        console.error("Required elements not found");
        return;
    }

    // Add loading state to viewer
    viewer.classList.add("loading");
    
    // Update title with animation
    title.textContent = `Week ${week} Content`;
    title.classList.remove("fade-in");
    void title.offsetWidth; // Trigger reflow
    title.classList.add("fade-in");

    // Show loading state in iframe
    frame.style.opacity = "0.7";
    
    // Load content with a slight delay for smoother transition
    setTimeout(() => {
        frame.src = `converted/week${week}.html`;
        
        // Handle iframe load completion
        frame.onload = () => {
            frame.style.opacity = "1";
            viewer.classList.remove("loading");
            
            // Add content loaded animation to iframe content if accessible
            try {
                if (frame.contentDocument && frame.contentDocument.body) {
                    frame.contentDocument.body.classList.add("fade-in");
                }
            } catch (e) {
                // Cross-origin restriction, ignore
            }
        };
        
        // Handle iframe load errors
        frame.onerror = () => {
            frame.style.opacity = "1";
            viewer.classList.remove("loading");
            console.error(`Failed to load week ${week} content`);
        };
    }, 300);

    // Update download link
    if (fileMap[week]) {
        link.href = `docs/${fileMap[week]}`;
        link.style.display = "flex";
        
        // Add animation to download button
        link.classList.remove("fade-in");
        void link.offsetWidth; // Trigger reflow
        link.classList.add("fade-in");
    } else {
        link.style.display = "none";
        console.warn(`No file mapping found for week ${week}`);
    }
}

// Add keyboard navigation
document.addEventListener("keydown", (e) => {
    const activeCard = document.querySelector(".week-card.active");
    if (!activeCard) return;
    
    const currentWeek = parseInt(activeCard.dataset.week);
    let newWeek = currentWeek;
    
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        newWeek = Math.max(1, currentWeek - 1);
    } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        newWeek = Math.min(12, currentWeek + 1);
    }
    
    if (newWeek !== currentWeek) {
        setActiveCard(newWeek);
        loadWeek(newWeek);
    }
});

// Add scroll animations for cards when they come into view
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = "running";
        }
    });
}, observerOptions);

// Observe week cards after they're created
setTimeout(() => {
    document.querySelectorAll(".week-card").forEach(card => {
        observer.observe(card);
    });
}, 1000);

