class CustomCursor {
    constructor() {
        this.cursor = document.querySelector('.custom-cursor');
        this.follower = document.querySelector('.custom-cursor-follower');
        this.links = document.querySelectorAll('a, button, .project-card');
        
        this.pos = { x: 0, y: 0 };
        this.mouse = { x: 0, y: 0 };
        this.speed = 0.1;
        
        this.init();
    }

    init() {
        // Mouse move handler
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;

            // Move cursor dot instantly
            this.cursor.style.transform = `translate3d(${this.mouse.x}px, ${this.mouse.y}px, 0)`;
        });

        // Hover effects
        this.links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                this.follower.style.transform = `translate3d(${this.pos.x}px, ${this.pos.y}px, 0) scale(1.5)`;
            });
            
            link.addEventListener('mouseleave', () => {
                this.follower.style.transform = `translate3d(${this.pos.x}px, ${this.pos.y}px, 0) scale(1)`;
            });
        });

        // Animation loop for smooth follower
        const render = () => {
            this.pos.x += (this.mouse.x - this.pos.x) * this.speed;
            this.pos.y += (this.mouse.y - this.pos.y) * this.speed;

            this.follower.style.transform = `translate3d(${this.pos.x - 20}px, ${this.pos.y - 20}px, 0)`;

            requestAnimationFrame(render);
        };
        render();

        // Show/hide cursor
        document.addEventListener('mouseenter', () => {
            this.cursor.style.opacity = '1';
            this.follower.style.opacity = '1';
        });
        
        document.addEventListener('mouseleave', () => {
            this.cursor.style.opacity = '0';
            this.follower.style.opacity = '0';
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new CustomCursor();
}); 