// Fade In Cards
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card, .divider, footer, header');
    let lastScrollY = window.scrollY;

    const observer = new IntersectionObserver(entries => {
        const currentScrollY = window.scrollY;
        const isScrollingDown = currentScrollY > lastScrollY;

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (isScrollingDown) {
                    entry.target.classList.add('visible-from-bottom');
                    entry.target.classList.remove('visible-from-top');
                } else {
                    entry.target.classList.add('visible-from-top');
                    entry.target.classList.remove('visible-from-bottom');
                }
            } else {
                entry.target.classList.remove('visible-from-bottom');
                entry.target.classList.remove('visible-from-top');
            }
        });
        lastScrollY = currentScrollY;
    }, { threshold: 0.1 });

    cards.forEach(card => {
        observer.observe(card);
    });
});

// Card Paragraph Typer
document.addEventListener('DOMContentLoaded', () => {
    const paragraphs = document.querySelectorAll('.card p');
    const typewriterSpeed = 5; 
    const activeTimeouts = new Map();

    function applyTyperEffect(element) {
        if (activeTimeouts.has(element)) {
            const timeouts = activeTimeouts.get(element);
            timeouts.forEach(clearTimeout);
            activeTimeouts.set(element, []);
        }

        const letters = element.querySelectorAll('.typer-letter');
        const timeoutsList = [];

        letters.forEach((letter, index) => {
            const timeoutId = setTimeout(() => {
                letter.style.visibility = 'visible';
            }, typewriterSpeed * index);
            timeoutsList.push(timeoutId);
        });

        activeTimeouts.set(element, timeoutsList);
    }

    function prepareParagraphs() {
        paragraphs.forEach(p => {
            const originalText = p.textContent.trim();
            if (originalText === '') return;

            p.textContent = '';
            p.style.whiteSpace = 'pre-wrap';

            for (const char of originalText) {
                const span = document.createElement('span');
                span.textContent = char;
                span.classList.add('typer-letter');
                p.appendChild(span);
            }
        });
    }

    function hideElement(element) {
        if (activeTimeouts.has(element)) {
            const timeouts = activeTimeouts.get(element);
            timeouts.forEach(clearTimeout);
            activeTimeouts.delete(element);
        }

        const letters = element.querySelectorAll('.typer-letter');
        letters.forEach(letter => {
            letter.style.visibility = 'hidden';
        });

        element.classList.remove('typer-finished'); 
    }

    const typerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                applyTyperEffect(entry.target);
            } else {
                hideElement(entry.target);
            }
        });
    }, {
        rootMargin: '0px',
        threshold: 0.1
    });

    prepareParagraphs();
    paragraphs.forEach(p => {
        if (p.querySelector('.typer-letter')) {
            typerObserver.observe(p);
        }
    });
});