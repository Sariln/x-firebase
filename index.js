if (!('IntersectionObserver' in window)) {
    console.log('Intersection Observer API is not supported in this browser');
    // Provide a fallback or polyfill if needed
} else {
    console.log('Intersection Observer API is fully supported in this browser');
}

function isValidUrl(url) {
    const pattern = new RegExp(
        '^(https?:\\/\\/)' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name and extension
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?' + // port
            '(\\/[-a-z\\d%_.~+]*)*' + // path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$',
        'i'
    ); // fragment locator
    return !!pattern.test(url);
}
let isScroll = false;
let observer;
function init(targetScroll, groupId) {
    // observer?.disconnect?.();
    isScroll = true;
    const $scrollContainer = $(targetScroll);
    const $vals = $scrollContainer.find('.database-leaf-value');
    const $img = $('<img>').css({
        width: '100px',
        height: '100px',
        overflow: 'hidden',
        objectFit: 'cover',
        borderRadius: '16px',
        cursor: 'pointer',
        border: '3px solid #1c72e8',
        background: '#1c72e840',
    });

    observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const $target = $(entry.target);
                    try {
                        const text = $target.text();
                        const texts = JSON.parse(text);
                        if (isValidUrl(texts)) {
                            const $newImg = $img.clone(true);
                            $newImg.attr('title', texts);
                            $newImg.attr('src', texts);
                            $target.empty().append($newImg);
                            $target.parent().attr('data-fancybox', groupId);
                            $target.parent().attr('data-src', texts);
                            $target.parent().attr('title', texts);
                            Fancybox.bind('[data-fancybox]');
                        }
                    } catch (e) {
                        // console.log('error', e);
                        // Handle error if needed
                    }
                }
            });
        },
        {
            root: $scrollContainer[0], // Set the root to the scroll container
            rootMargin: '0px 0px 0px 0px', // Adjust this value to control when the elements are considered in view
        }
    );

    $vals.each((index, val) => {
        observer.observe(val);
    });
}

document.addEventListener(
    'scroll',
    function (event) {
        if (
            event?.target?.classList?.contains('scroll-container') &&
            !event?.target?.hasAttribute('custom-js-register')
        ) {
            // console.log('scroll register : ', event.target);
            $(event.target).attr('custom-js-register', true);
            init(event.target, Date.now());
        }
    },
    true
);
