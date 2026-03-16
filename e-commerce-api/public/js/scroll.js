function initScrollBehavior() {
    let isProgrammaticScroll = false;
    let lastScrollTime = 0;
    const scrollOffset = 70; // Match your navbar height
    const scrollDuration = 300; // Reduced from 1000ms to 300ms

    // Smooth scroll for anchor links
    $('a[href^="#"]').on('click', function(event) {
        const targetId = this.getAttribute('href');
        const target = $(targetId);
        
        if (target.length) {
            event.preventDefault();
            
            // Mark that we're doing a programmatic scroll
            isProgrammaticScroll = true;
            lastScrollTime = Date.now();
            
            // Update active class immediately
            $('.nav-link.active').removeClass('active');
            $(this).addClass('active');
            
            // Perform the scroll animation (faster)
            $('html, body').stop().animate({
                scrollTop: target.offset().top - scrollOffset
            }, scrollDuration, 'swing', function() {
                // Reset the flag after animation completes
                isProgrammaticScroll = false;
            });
        }
    });

    // Rest of your scroll behavior code remains the same...
    $(window).scroll(function() {
        // Ignore scroll events that happen right after a click (300ms threshold)
        if (isProgrammaticScroll || (Date.now() - lastScrollTime < 300)) {
            return;
        }

        const scrollDistance = $(window).scrollTop() + scrollOffset;
        let currentSection = null;
        
        // Find the current visible section
        $('section').each(function() {
            const sectionTop = $(this).offset().top;
            if (scrollDistance >= sectionTop) {
                currentSection = $(this);
            }
        });
        
        if (currentSection && currentSection.length) {
            const targetLink = $(`.nav-link[href="#${currentSection.attr('id')}"]`);
            if (!targetLink.hasClass('active')) {
                $('.nav-link.active').removeClass('active');
                targetLink.addClass('active');
            }
        }
    }).scroll(); // Trigger once on load
}