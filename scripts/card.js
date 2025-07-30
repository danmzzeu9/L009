// Feedback Stars
document.addEventListener('DOMContentLoaded', function() {
    const starContainers = document.querySelectorAll('.card-feedback-stars');

    starContainers.forEach(container => {
        const stars = container.querySelectorAll('i');
        const animationStyle = stars[0].style.animation;

        function disableAnimation() {
            stars.forEach(star => {
                star.style.animation = 'none';
            });
        }

        function enableAnimation() {
            stars.forEach((star, index) => {
                star.style.animation = animationStyle;
            });
        }

        function triggerAnimationCycle() {
            enableAnimation();
            setTimeout(() => {
                disableAnimation();
                setTimeout(triggerAnimationCycle, 2000);
            }, (0.1 * stars.length * 1000) + 600);
        }

        triggerAnimationCycle();
    });
});