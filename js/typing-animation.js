class TypingAnimation {
    constructor(element, words, options = {}) {
        this.element = element;
        this.words = words;
        this.wait = options.wait || 3000;
        this.typeSpeed = options.typeSpeed || 100;
        this.deleteSpeed = options.deleteSpeed || 50;
        this.currentWord = 0;
        this.isDeleting = false;
        this.text = '';
        
        this.type();
    }

    type() {
        const currentWord = this.words[this.currentWord];
        
        if (this.isDeleting) {
            // Remove character
            this.text = currentWord.substring(0, this.text.length - 1);
        } else {
            // Add character
            this.text = currentWord.substring(0, this.text.length + 1);
        }

        this.element.innerHTML = this.text;

        // Typing Speed
        let typeSpeed = this.typeSpeed;

        if (this.isDeleting) {
            typeSpeed = this.deleteSpeed;
        }

        // If word is complete
        if (!this.isDeleting && this.text === currentWord) {
            // Pause at end
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.text === '') {
            this.isDeleting = false;
            // Move to next word
            this.currentWord = (this.currentWord + 1) % this.words.length;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Initialize typing animation
document.addEventListener('DOMContentLoaded', () => {
    const typedElement = document.getElementById('typed-name');
    const words = [
        'Your Name',
        'A Developer',
        'A Designer',
        'A Creator'
    ];
    
    new TypingAnimation(typedElement, words, {
        wait: 3000,
        typeSpeed: 100,
        deleteSpeed: 50
    });
}); 