// ------------------ Navbar Toggle ------------------
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const closeMenu = document.getElementById('closeMenu');

menuToggle.addEventListener('click', () => {
  navLinks.classList.add('active');
});

closeMenu.addEventListener('click', () => {
  navLinks.classList.remove('active');
});

// أغلق القائمة عند الضغط على أي رابط
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });
});

// ------------------ Cart Functionality ------------------
let cart = [];

function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  if(existing){
    existing.qty += 1;
  } else {
    cart.push({name, price, qty:1});
  }
  renderCart();
}

function removeFromCart(name){
  cart = cart.filter(item => item.name !== name);
  renderCart();
}

function changeQty(name, delta){
  const item = cart.find(i => i.name === name);
  if(item){
    item.qty += delta;
    if(item.qty <=0) removeFromCart(name);
  }
  renderCart();
}

// Render Cart Section
function renderCart(){
  const container = document.getElementById('cartItemsContainer');
  const summary = document.getElementById('cartSummary');
  container.innerHTML = '';
  
  if(cart.length ===0){
    container.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
    summary.style.display='none';
  } else {
    summary.style.display='block';
    let total =0;
    cart.forEach(item=>{
      total += item.price * item.qty;
      const div = document.createElement('div');
      div.className='cart-item';
      div.innerHTML=`
        <img src="https://via.placeholder.com/60" alt="${item.name}">
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <p>$${item.price.toFixed(2)}</p>
        </div>
        <div class="cart-item-qty">
          <button onclick="changeQty('${item.name}',-1)">-</button>
          <span>${item.qty}</span>
          <button onclick="changeQty('${item.name}',1)">+</button>
          <button onclick="removeFromCart('${item.name}')">✖</button>
        </div>
      `;
      container.appendChild(div);
    });
    document.getElementById('cartTotal').innerText = total.toFixed(2);
  }

  // تحديث Order Section تلقائي
  loadOrder();
}

// Checkout Button (Cart)
document.getElementById('checkoutBtn').addEventListener('click',()=>{
  if(cart.length===0){
    alert('Your cart is empty!');
    return;
  }
  alert(`Thank you for your order! Total: $${cart.reduce((acc,i)=>acc+i.price*i.qty,0).toFixed(2)}`);
  cart = [];
  renderCart();
});

// ------------------ Order Section ------------------

// Load Order Summary
function loadOrder(){
  const orderContainer = document.getElementById('orderItemsContainer');
  const orderTotal = document.getElementById('orderTotal');
  orderContainer.innerHTML = '';
  
  if(cart.length ===0){
    orderContainer.innerHTML = '<p class="empty-order">No items in your order.</p>';
    orderTotal.innerText = '0';
    return;
  }

  let total =0;
  cart.forEach(item=>{
    total += item.price * item.qty;
    const div = document.createElement('div');
    div.className='order-item';
    div.innerHTML = `<span>${item.name} x${item.qty}</span> <span>$${(item.price*item.qty).toFixed(2)}</span>`;
    orderContainer.appendChild(div);
  });
  orderTotal.innerText = total.toFixed(2);
}

// Order Form Submission (WhatsApp)
document.getElementById('orderForm').addEventListener('submit', function(e){
  e.preventDefault();
  if(cart.length===0){
    alert('Your cart is empty!');
    return;
  }

  const name = document.getElementById('orderName').value;
  const phone = document.getElementById('orderPhone').value;

  // تكوين نص الطلب
  let message = `*New Order*\nName: ${name}\nPhone: ${phone}\n\nOrder Details:\n`;
  cart.forEach(item=>{
    message += `- ${item.name} x${item.qty} = $${(item.price*item.qty).toFixed(2)}\n`;
  });
  const total = cart.reduce((acc,i)=>acc+i.price*i.qty,0).toFixed(2);
  message += `\n*Total: $${total}*`;

  // رقم مطعم WhatsApp (استبدله برقم المطعم الفعلي)
  const restaurantNumber = "201234567890"; // الصيغة الدولية بدون +
  const whatsappURL = `https://wa.me/${restaurantNumber}?text=${encodeURIComponent(message)}`;

  // فتح WhatsApp
  window.open(whatsappURL, '_blank');

  // مسح السلة والفورم بعد الإرسال
  cart = [];
  renderCart();
  loadOrder();
  document.getElementById('orderForm').reset();
});

// Load Order Section عند الدخول للقسم
window.addEventListener('scroll', function(){
  const orderSection = document.getElementById('order');
  const rect = orderSection.getBoundingClientRect();
  if(rect.top < window.innerHeight && rect.bottom >0){
    loadOrder();
  }
});
