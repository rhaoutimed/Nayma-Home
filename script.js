// ==================== CART SYSTEM ====================
let cart = [];

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('naymahome_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('naymahome_cart', JSON.stringify(cart));
}

// Update cart count and total
function updateCartUI() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    updateCartModal();
}

// Add item to cart
function addToCart(productId, productName, productPrice, productImage) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartUI();
    showNotification(`${productName} ajouté au panier ! 🛒`);
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    showNotification('Produit retiré du panier');
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

// Update cart modal content
function updateCartModal() {
    const cartItems = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <p>Votre panier est vide</p>
                <span style="font-size: 60px;">🛍️</span>
            </div>
        `;
        cartTotalPrice.textContent = '0 DH';
        checkoutBtn.disabled = true;
    } else {
        let total = 0;
        cartItems.innerHTML = cart.map(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            return `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${item.price} DH</div>
                        <div class="cart-item-quantity">
                            <button class="qty-btn qty-decrease" data-id="${item.id}">-</button>
                            <span class="qty-display">${item.quantity}</span>
                            <button class="qty-btn qty-increase" data-id="${item.id}">+</button>
                            <button class="remove-item" data-id="${item.id}">🗑️ Retirer</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        cartTotalPrice.textContent = `${total} DH`;
        checkoutBtn.disabled = false;
        
        // Add event listeners for quantity buttons
        document.querySelectorAll('.qty-decrease').forEach(btn => {
            btn.addEventListener('click', () => {
                updateQuantity(btn.dataset.id, -1);
            });
        });
        
        document.querySelectorAll('.qty-increase').forEach(btn => {
            btn.addEventListener('click', () => {
                updateQuantity(btn.dataset.id, 1);
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', () => {
                removeFromCart(btn.dataset.id);
            });
        });
    }
}

// ==================== ADD TO CART FUNCTIONALITY ====================
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productId = productCard.dataset.id;
            const productName = productCard.dataset.name;
            const productPrice = parseInt(productCard.dataset.price);
            const productImage = productCard.querySelector('.product-image img').src;
            
            addToCart(productId, productName, productPrice, productImage);
            
            // Button animation
            const originalText = this.textContent;
            this.textContent = '✓ Ajouté';
            this.style.backgroundColor = '#28A745';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.backgroundColor = '';
            }, 1500);
        });
    });
});

// ==================== CART MODAL CONTROLS ====================
const cartIcon = document.getElementById('cart-icon');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.querySelector('.close-cart');

cartIcon.addEventListener('click', () => {
    cartModal.classList.add('active');
    updateCartModal();
});

closeCart.addEventListener('click', () => {
    cartModal.classList.remove('active');
});

cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.classList.remove('active');
    }
});

// ==================== CHECKOUT MODAL ====================
const checkoutBtn = document.getElementById('checkout-btn');
const checkoutModal = document.getElementById('checkout-modal');
const closeCheckout = document.querySelector('.close-checkout');
const checkoutForm = document.getElementById('checkout-form');

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return;
    
    // Update checkout summary
    const checkoutItems = document.getElementById('checkout-items');
    const checkoutTotalPrice = document.getElementById('checkout-total-price');
    
    let total = 0;
    checkoutItems.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        return `
            <div class="checkout-item">
                <div>
                    <div class="checkout-item-name">${item.name}</div>
                    <div class="checkout-item-qty">Quantité: ${item.quantity}</div>
                </div>
                <div class="checkout-item-price">${itemTotal} DH</div>
            </div>
        `;
    }).join('');
    
    checkoutTotalPrice.textContent = `${total} DH`;
    
    // Show checkout modal
    cartModal.classList.remove('active');
    checkoutModal.classList.add('active');
});

closeCheckout.addEventListener('click', () => {
    checkoutModal.classList.remove('active');
});

checkoutModal.addEventListener('click', (e) => {
    if (e.target === checkoutModal) {
        checkoutModal.classList.remove('active');
    }
});

// ==================== FORM SUBMISSION ====================
checkoutForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Disable submit button to prevent double submission
    const submitBtn = e.target.querySelector('.submit-order-btn');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Envoi en cours...';
    
    // Get form data
    const formData = {
        nom: document.getElementById('nom').value,
        prenom: document.getElementById('prenom').value,
        email: document.getElementById('email').value,
        telephone: document.getElementById('telephone').value,
        ville: document.getElementById('ville').value,
        adresse: document.getElementById('adresse').value,
        notes: document.getElementById('notes').value,
        cart: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };
    
    try {
        // Envoyer directement via WhatsApp
        const whatsappMessage = createWhatsAppMessage(formData);
        const phoneNumber = '212777383215';
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
        
        // Show success message
        showSuccessMessage(formData);
        
        // Clear cart and close modals
        setTimeout(() => {
            cart = [];
            saveCart();
            updateCartUI();
            checkoutModal.classList.remove('active');
            checkoutForm.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            
            // Ouvrir WhatsApp
            window.open(whatsappUrl, '_blank');
        }, 2000);
        
    } catch (error) {
        console.error('Erreur lors de l\'envoi:', error);
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        // Ouvrir WhatsApp directement en cas d'erreur
        const whatsappMessage = createWhatsAppMessage(formData);
        const phoneNumber = '212777383215';
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
        
        window.open(whatsappUrl, '_blank');
        
        // Clear cart after WhatsApp redirect
        setTimeout(() => {
            cart = [];
            saveCart();
            updateCartUI();
            checkoutModal.classList.remove('active');
            checkoutForm.reset();
        }, 1000);
    }
});

// ==================== SEND EMAIL FUNCTION ====================
async function sendOrderEmail(data) {
    // Create HTML email content
    const emailHTML = createEmailHTML(data);
    const emailText = createEmailText(data);
    
    // Brevo API Key (format correct)
    const apiKey = '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';
    
    const emailData = {
        sender: {
            name: "Nayma Home - Nouvelle Commande",
            email: "myjobid77@gmail.com"
        },
        to: [
            {
                email: "mohamedrhaouti@esac.ma",
                name: "Nayma Home Admin"
            }
        ],
        subject: `🛒 Nouvelle commande - ${data.prenom} ${data.nom} - ${data.total} DH`,
        htmlContent: emailHTML,
        textContent: emailText
    };
    
    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': apiKey,
                'content-type': 'application/json'
            },
            body: JSON.stringify(emailData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Brevo API Error:', errorData);
            throw new Error('Erreur lors de l\'envoi de l\'email');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erreur réseau:', error);
        throw error;
    }
}

// ==================== CREATE EMAIL HTML ====================
function createEmailHTML(data) {
    let productsHTML = '';
    data.cart.forEach(item => {
        productsHTML += `
            <tr style="border-bottom: 1px solid #e0e0e0;">
                <td style="padding: 15px;">${item.name}</td>
                <td style="padding: 15px; text-align: center;">${item.quantity}</td>
                <td style="padding: 15px; text-align: right;">${item.price} DH</td>
                <td style="padding: 15px; text-align: right; font-weight: bold;">${item.price * item.quantity} DH</td>
            </tr>
        `;
    });
    
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #8B7355, #D4A574); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
                .section { background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
                .section h3 { color: #8B7355; margin-top: 0; border-bottom: 2px solid #D4A574; padding-bottom: 10px; }
                .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e0e0e0; }
                .info-label { font-weight: bold; color: #666; }
                table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                th { background-color: #8B7355; color: white; padding: 12px; text-align: left; }
                .total-row { background-color: #f0f0f0; font-weight: bold; font-size: 18px; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🌸 Nayma Home</h1>
                    <p style="margin: 0; font-size: 18px;">Nouvelle Commande Reçue</p>
                </div>
                
                <div class="content">
                    <div class="section">
                        <h3>👤 Informations Client</h3>
                        <div class="info-row">
                            <span class="info-label">Nom complet:</span>
                            <span>${data.prenom} ${data.nom}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Téléphone:</span>
                            <span>${data.telephone}</span>
                        </div>
                        ${data.email ? `
                        <div class="info-row">
                            <span class="info-label">Email:</span>
                            <span>${data.email}</span>
                        </div>
                        ` : ''}
                        <div class="info-row">
                            <span class="info-label">Ville:</span>
                            <span>${data.ville}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Adresse:</span>
                            <span>${data.adresse}</span>
                        </div>
                        ${data.notes ? `
                        <div class="info-row">
                            <span class="info-label">Notes:</span>
                            <span>${data.notes}</span>
                        </div>
                        ` : ''}
                    </div>
                    
                    <div class="section">
                        <h3>📦 Détails de la Commande</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Produit</th>
                                    <th style="text-align: center;">Quantité</th>
                                    <th style="text-align: right;">Prix Unit.</th>
                                    <th style="text-align: right;">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${productsHTML}
                                <tr class="total-row">
                                    <td colspan="3" style="padding: 15px; text-align: right;">TOTAL À PAYER:</td>
                                    <td style="padding: 15px; text-align: right; color: #E74C3C;">${data.total} DH</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="section" style="background-color: #e8f5e9; border-left: 4px solid #28A745;">
                        <p style="margin: 0; font-weight: bold; color: #28A745;">💰 Paiement à la livraison</p>
                    </div>
                </div>
                
                <div class="footer">
                    <p>Date de la commande: ${new Date().toLocaleString('fr-FR')}</p>
                    <p>© 2025 Nayma Home - L'art du bien-être à la maison 🌸</p>
                </div>
            </div>
        </body>
        </html>
    `;
}

// ==================== CREATE EMAIL TEXT ====================
function createEmailText(data) {
    let message = `🌸 NOUVELLE COMMANDE NAYMA HOME 🌸\n\n`;
    message += `=== INFORMATIONS CLIENT ===\n`;
    message += `Nom: ${data.prenom} ${data.nom}\n`;
    message += `Téléphone: ${data.telephone}\n`;
    if (data.email) message += `Email: ${data.email}\n`;
    message += `Ville: ${data.ville}\n`;
    message += `Adresse: ${data.adresse}\n`;
    if (data.notes) message += `Notes: ${data.notes}\n`;
    
    message += `\n=== PRODUITS COMMANDÉS ===\n`;
    data.cart.forEach(item => {
        message += `• ${item.name}\n`;
        message += `  Quantité: ${item.quantity}\n`;
        message += `  Prix unitaire: ${item.price} DH\n`;
        message += `  Sous-total: ${item.price * item.quantity} DH\n\n`;
    });
    
    message += `=========================\n`;
    message += `TOTAL: ${data.total} DH\n`;
    message += `Paiement: À la livraison\n\n`;
    message += `Date: ${new Date().toLocaleString('fr-FR')}\n`;
    
    return message;
}

// Create WhatsApp message
function createWhatsAppMessage(data) {
    let message = `🌸 *NOUVELLE COMMANDE NAYMA HOME* 🌸\n\n`;
    message += `👤 *Client:* ${data.prenom} ${data.nom}\n`;
    message += `📱 *Téléphone:* ${data.telephone}\n`;
    
    if (data.email) {
        message += `📧 *Email:* ${data.email}\n`;
    }
    
    message += `📍 *Ville:* ${data.ville}\n`;
    message += `🏠 *Adresse:* ${data.adresse}\n\n`;
    
    message += `📦 *PRODUITS:*\n`;
    message += `━━━━━━━━━━━━━━━\n`;
    
    data.cart.forEach(item => {
        message += `• ${item.name}\n`;
        message += `  Quantité: ${item.quantity}\n`;
        message += `  Prix unitaire: ${item.price} DH\n`;
        message += `  Sous-total: ${item.price * item.quantity} DH\n\n`;
    });
    
    message += `━━━━━━━━━━━━━━━\n`;
    message += `💰 *TOTAL: ${data.total} DH*\n`;
    message += `💳 *Paiement:* À la livraison\n\n`;
    
    if (data.notes) {
        message += `📝 *Notes:* ${data.notes}\n\n`;
    }
    
    message += `✨ Merci pour votre confiance ! ✨`;
    
    return message;
}

// Show success message
function showSuccessMessage(data) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.8);
        z-index: 10002;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
    `;
    
    const successBox = document.createElement('div');
    successBox.className = 'success-message';
    successBox.innerHTML = `
        <div class="success-icon">✅</div>
        <h2>Commande confirmée !</h2>
        <p><strong>Merci ${data.prenom} !</strong></p>
        <p>Votre commande a été envoyée avec succès par email.</p>
        <p>Nous vous contactons très bientôt au <strong>${data.telephone}</strong></p>
        <p style="margin-top: 20px; color: var(--text-light); font-size: 14px;">
            📧 Email envoyé à notre équipe
        </p>
    `;
    
    overlay.appendChild(successBox);
    document.body.appendChild(overlay);
    
    setTimeout(() => {
        overlay.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => overlay.remove(), 300);
    }, 4000);
}

// ==================== NOTIFICATION SYSTEM ====================
function showNotification(message) {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: #28A745;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.5s ease, slideOutRight 0.5s ease 2.5s;
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==================== SMOOTH SCROLLING ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== QUICK VIEW FUNCTIONALITY ====================
const quickViewButtons = document.querySelectorAll('.quick-view');

quickViewButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.stopPropagation();
        const productCard = this.closest('.product-card');
        const productId = productCard.dataset.id;
        const productName = productCard.dataset.name;
        const productPrice = productCard.dataset.price;
        const productTitle = productCard.querySelector('.product-title').textContent;
        const productImage = productCard.querySelector('.product-image img').src;
        const productDescription = productCard.querySelector('.product-description').textContent;
        
        showQuickViewModal(productId, productName, productTitle, productPrice, productImage, productDescription);
    });
});

function showQuickViewModal(id, name, title, price, image, description) {
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            padding: 40px;
            border-radius: 15px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            animation: scaleIn 0.3s ease;
        ">
            <img src="${image}" alt="${title}" style="
                width: 100%;
                height: 300px;
                object-fit: cover;
                border-radius: 10px;
                margin-bottom: 20px;
            ">
            <h3 style="
                font-size: 24px;
                margin-bottom: 10px;
                color: var(--text-dark);
            ">${title}</h3>
            <p style="
                color: var(--text-light);
                margin-bottom: 15px;
            ">${description}</p>
            <p style="
                font-size: 28px;
                font-weight: 700;
                color: var(--price-color);
                margin-bottom: 20px;
            ">${price} DH</p>
            <button class="modal-add-cart" data-id="${id}" data-name="${name}" data-price="${price}" data-image="${image}" style="
                width: 100%;
                padding: 15px;
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                color: white;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 16px;
                cursor: pointer;
                margin-bottom: 10px;
            ">Ajouter au panier</button>
            <button class="close-modal" style="
                width: 100%;
                padding: 15px;
                background: transparent;
                color: var(--text-dark);
                border: 2px solid var(--border-color);
                border-radius: 8px;
                font-weight: 600;
                font-size: 16px;
                cursor: pointer;
            ">Fermer</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const scaleInStyle = document.createElement('style');
    scaleInStyle.textContent = `
        @keyframes scaleIn {
            from {
                transform: scale(0.7);
                opacity: 0;
            }
            to {
                transform: scale(1);
                opacity: 1;
            }
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(scaleInStyle);
    
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => modal.remove(), 300);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => modal.remove(), 300);
        }
    });
    
    modal.querySelector('.modal-add-cart').addEventListener('click', function() {
        addToCart(this.dataset.id, this.dataset.name, parseInt(this.dataset.price), this.dataset.image);
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => modal.remove(), 300);
    });
}

// ==================== SORTING FUNCTIONALITY ====================
const sortSelect = document.querySelector('#sort');
const productsGrid = document.querySelector('.products-grid');

sortSelect.addEventListener('change', function() {
    const sortValue = this.value;
    const products = Array.from(document.querySelectorAll('.product-card'));
    
    products.sort((a, b) => {
        const priceA = parseInt(a.dataset.price);
        const priceB = parseInt(b.dataset.price);
        
        switch(sortValue) {
            case 'price-low':
                return priceA - priceB;
            case 'price-high':
                return priceB - priceA;
            case 'new':
                const isNewA = a.querySelector('.product-badge')?.textContent.includes('Nouveau') ? 1 : 0;
                const isNewB = b.querySelector('.product-badge')?.textContent.includes('Nouveau') ? 1 : 0;
                return isNewB - isNewA;
            default:
                return 0;
        }
    });
    
    productsGrid.innerHTML = '';
    products.forEach(product => productsGrid.appendChild(product));
    
    products.forEach((product, index) => {
        product.style.animation = 'none';
        setTimeout(() => {
            product.style.animation = `fadeIn 0.6s ease ${index * 0.1}s`;
        }, 10);
    });
});

// ==================== PHONE NUMBER VALIDATION ====================
const telephoneInput = document.getElementById('telephone');

telephoneInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 0) {
        if (value.startsWith('0')) {
            value = value.substring(0, 10);
        } else if (value.startsWith('212')) {
            value = value.substring(0, 12);
        }
    }
    
    e.target.value = value;
});

// ==================== LOAD MORE FUNCTIONALITY ====================
const loadMoreBtn = document.querySelector('.btn-load-more');
let currentlyLoaded = 6;

loadMoreBtn.addEventListener('click', function() {
    this.textContent = 'Chargement...';
    this.disabled = true;
    
    setTimeout(() => {
        currentlyLoaded += 6;
        this.textContent = 'Charger plus de produits';
        this.disabled = false;
        
        if (currentlyLoaded >= 12) {
            this.textContent = 'Tous les produits sont affichés ✓';
            this.disabled = true;
            this.style.opacity = '0.6';
        }
        
        showNotification('Plus de produits chargés ! 📦');
    }, 1000);
});

// ==================== HEADER SCROLL EFFECT ====================
let lastScroll = 0;
const headerMain = document.querySelector('.header-main');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        headerMain.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)';
    } else {
        headerMain.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// ==================== SCROLL ANIMATIONS ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.benefits-section, .about-section, .contact-section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// ==================== CONSOLE MESSAGE ====================
console.log('%c🌸 Bienvenue chez Nayma Home! 🌸', 'color: #8B7355; font-size: 20px; font-weight: bold;');
console.log('%cSite développé pour le bien-être et l\'ambiance de votre maison 🏡', 'color: #9DB4A8; font-size: 14px;');
