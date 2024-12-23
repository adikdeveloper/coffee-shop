// Slider funksiyasi
function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const interval = 3000; // 3 soniya
    let currentSlide = 0;

    function nextSlide() {
        // Joriy slaydni yashirish
        slides[currentSlide].classList.remove('showing');

        // Keyingi slaydga o'tish
        currentSlide = (currentSlide + 1) % slides.length;

        // Yangi slaydi ko'rsatish
        slides[currentSlide].classList.add('showing');
    }

    // Avtomatik almashinishni boshlash
    setInterval(nextSlide, interval);
}

// Sahifa yuklanganda sliderni ishga tushirish
document.addEventListener('DOMContentLoaded', initSlider);

class ShoppingCart {
    constructor() {
        this.items = [];
        this.initializeCart();
        this.bindEvents();
    }

    initializeCart() {
        // Local storage'dan savatchani yuklash
        const savedCart = localStorage.getItem('uzcoffee_cart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
            this.updateCartCount();
        }
    }

    bindEvents() {
        // Savatcha ikonkasini ochish
        $('.cart-icon').on('click', () => {
            this.updateCartModal();
            $('.cart-modal').fadeIn();
        });

        // Savatchani yopish
        $('.cart-close').on('click', () => {
            $('.cart-modal').fadeOut();
        });

        // Modal tashqarisiga bosganda yopish
        $(window).on('click', (e) => {
            if ($(e.target).hasClass('cart-modal')) {
                $('.cart-modal').fadeOut();
            }
        });

        // Savatchani tozalash
        $('.clear-cart').on('click', () => {
            this.clearCart();
        });

        // Buyurtma berish
        $('.checkout').on('click', () => {
            this.checkout();
        });

        // Mahsulotni savatchaga qo'shish
        $('.buy-button').on('click', (e) => {
            const button = $(e.target);
            const name = button.data('name');
            const price = button.data('price');
            this.addToCart(name, price);
        });
    }

    addToCart(name, price) {
        const existingItem = this.items.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                name: name,
                price: price,
                quantity: 1
            });
        }

        this.updateCartCount();
        this.saveCart();
        this.showNotification(`${name} savatchaga qo'shildi!`);
    }

    updateQuantity(name, change) {
        const item = this.items.find(item => item.name === name);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.items = this.items.filter(i => i.name !== name);
            }
            this.updateCartModal();
            this.updateCartCount();
            this.saveCart();
        }
    }

    updateCartCount() {
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        $('.cart-count').text(totalItems);
    }

    updateCartModal() {
        const cartItems = $('.cart-items');
        cartItems.empty();

        let total = 0;

        if (this.items.length === 0) {
            cartItems.append('<p class="empty-cart-message">Savatcha bo\'sh</p>');
        } else {
            this.items.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;

                cartItems.append(`
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <div class="cart-item-title">${item.name}</div>
                            <div class="cart-item-price">${item.price.toLocaleString()} so'm</div>
                        </div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn minus" data-name="${item.name}">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn plus" data-name="${item.name}">+</button>
                        </div>
                        <div class="cart-item-total">
                            ${itemTotal.toLocaleString()} so'm
                        </div>
                    </div>
                `);
            });
        }

        $('.total-amount').text(total.toLocaleString());

        // Miqdorni o'zgartirish tugmalariga event listener'lar qo'shish
        $('.quantity-btn.minus').on('click', (e) => {
            const name = $(e.target).data('name');
            this.updateQuantity(name, -1);
        });

        $('.quantity-btn.plus').on('click', (e) => {
            const name = $(e.target).data('name');
            this.updateQuantity(name, 1);
        });
    }

    saveCart() {
        localStorage.setItem('uzcoffee_cart', JSON.stringify(this.items));
    }

    clearCart() {
        if (this.items.length === 0) {
            this.showNotification('Savatcha allaqachon bo\'sh!');
            return;
        }

        this.items = [];
        this.updateCartModal();
        this.updateCartCount();
        this.saveCart();
        this.showNotification('Savatcha tozalandi');
    }

    checkout() {
        if (this.items.length === 0) {
            this.showNotification('Savatcha bo\'sh!', 'error');
            return;
        }

        const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Buyurtma ma'lumotlarini tayyorlash
        let orderDetails = 'Sizning buyurtmangiz:\n\n';
        this.items.forEach(item => {
            orderDetails += `${item.name} x ${item.quantity} = ${(item.price * item.quantity).toLocaleString()} so'm\n`;
        });
        orderDetails += `\nUmumiy summa: ${total.toLocaleString()} so'm`;

        // Buyurtmani tasdiqlash
        if (confirm(orderDetails + '\n\nBuyurtmani tasdiqlaysizmi?')) {
            this.showNotification('Buyurtmangiz qabul qilindi!', 'success');
            this.clearCart();
            $('.cart-modal').fadeOut();
        }
    }

    showNotification(message, type = 'info') {
        // Xabarnoma elementini yaratish
        const notification = $('<div>')
            .addClass('notification')
            .addClass(`notification-${type}`)
            .text(message);

        // Xabarnomani sahifaga qo'shish
        $('#notification-container').append(notification);

        // Xabarnomani animatsiya bilan ko'rsatish
        notification.animate({ opacity: 1, right: '20px' }, 300);

        // 3 sekunddan keyin xabarnomani o'chirish
        setTimeout(() => {
            notification.animate({ opacity: 0, right: '-100%' }, 300, () => {
                notification.remove();
            });
        }, 3000);
    }
}

// Event Listeners for document ready
$(document).ready(() => {
    // AOS animatsiyalarini ishga tushirish
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Scroll paytida headerni shaffof qilish
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.header').css('background', 'rgba(111, 78, 55, 0.95)');
        } else {
            $('.header').css('background', 'var(--primary)');
        }
    });

    // Smooth scroll
    $('a[href*="#"]').on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top - 70
        }, 500);
    });
});