// Fixed Safari 100vh =======================================
!(function (n, e) {
    function setViewHeight() {
        var windowVH = e.innerHeight / 100
        n.documentElement.style.setProperty('--vh', windowVH + 'px')
    }
    var i = 'orientationchange' in window ? 'orientationchange' : 'resize'
    n.addEventListener('DOMContentLoaded', setViewHeight)
    e.addEventListener(i, setViewHeight)
})(document, window);

// Function =======================================================
function SuccessAnimation() {
    const successaniamtion = `
    <div class="success-animation">
        <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
            <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
    </div>`;
    return successaniamtion;
}
function toast(text, title = "") {
    let toastContent = '';

    toastContent =
        '<div class="toast rounded overflow-hidden">' +
        '<div class="toast-header bg-brown text-light justify-content-between align-items-center">' +
        '<p class="fs-6 fs-lg-5 fw-bold mb-0">' +
        title +
        '</p>' +
        '<button type="button" class="btn-close btn-close-white shadow-none me-1" data-bs-dismiss="toast" aria-label="Close"></button>' +
        '</div>' +
        '<div class="toast-body bg-light overflow-y-auto" style="max-height: 300px;">' +
        '<p class="fs-6 mb-0">' +
        text +
        '</p>' +
        '</div>' +
        '</div>';

    $('.toast-container').each(function () {
        $(this).html(toastContent);
    });

    var toastElList = [].slice.call(document.querySelectorAll('.toast'));
    var toastList = toastElList.map(function (toastEl) {
        return new bootstrap.Toast(toastEl);
    })
    toastList.forEach(toast => toast.show());
}
function updateHeaderHeight() {
    var headerHeight = $('header').length ? $('header').outerHeight() : 0;
    document.documentElement.style.setProperty('--bs-header-height', headerHeight + 'px');
}
function HideOffcanvas(element) {
    var offcanvas = $(element).closest('.offcanvas, .offcanvas-sm, .offcanvas-md, .offcanvas-lg, .offcanvas-xl, .offcanvas-xxl');

    if (offcanvas.length) {
        if (offcanvas.hasClass('show')) { offcanvas.removeClass('show'); }
    }
}
function RemovePlaceholder(element) {
    setTimeout(function () {
        $(element).removeClass('placeholder');

        var maxDepth = 10;
        var depth = 0;

        $(element).parents().each(function () {
            if (depth >= maxDepth) {
                return false;
            }

            if ($(this).hasClass('placeholder-glow') || $(this).hasClass('placeholder-wave')) {
                $(this).removeClass('placeholder-glow placeholder-wave');
                return false;
            }
            depth++;
        });
    }, 500);
}
function AppendSuccessAnimation(element) {
    const appendstr = `
        <div class="success-animation">
            <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
        </div>`;
    $(element).append(appendstr);
}

// Web Start =======================================================
$(function () {
    updateHeaderHeight();

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

    $(window).on('resize', function () {
        updateHeaderHeight();
    });

    $('.no-menu').on('contextmenu', function (event) {
        event.preventDefault();
    });

    $('.dropdown').each(function () {
        const menu = $(this).find('ul.dropdown-menu');
        if (menu.find('li').length === 0) {
            $(this).hide();
        }
    });

    document.addEventListener('hidden.bs.collapse', function (event) {
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';
        document.body.classList.remove('overflow-hidden');
    });
});