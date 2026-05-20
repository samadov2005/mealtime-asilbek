function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const screen = document.getElementById(id);
  screen.classList.add('active');
  screen.querySelector('[tabindex], button, input, select, textarea')?.focus({ preventScroll: true });
  screen.scrollTop = 0;
}

function showOTP() {
  const num = document.getElementById('phone-num').value;
  document.getElementById('login-step1').style.display = 'none';
  document.getElementById('login-step2').style.display = 'flex';
  document.getElementById('otp-desc').textContent = '+998 ' + (num || '** *** **') + ' ga yuborildi';
  setTimeout(() => {
    document.querySelectorAll('.otp-input')[0].focus();
  }, 100);
}

function otpMove(el, idx) {
  if (el.value.length === 1) {
    const inputs = document.querySelectorAll('.otp-input');
    if (idx < 3) inputs[idx + 1].focus();
    else el.blur();
  }
}

function selectGender(g) {
  document.getElementById('btn-erkak').classList.toggle('active', g === 'erkak');
  document.getElementById('btn-ayol').classList.toggle('active', g === 'ayol');
}

function selectRadio(idx) {
  document.querySelectorAll('.radio-item').forEach((el, i) => {
    el.classList.toggle('active', i === idx);
  });
}

function toggleTag(el) {
  el.classList.toggle('active');
}

function setDay(btn, day) {
  document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelector('.day-label strong').textContent = day;
}

const mealData = {
  m1: { cal: 480, price: 32000 },
  m2: { cal: 520, price: 35000 },
  m3: { cal: 430, price: 28000 },
  m4: { cal: 390, price: 25000 },
  m5: { cal: 310, price: 22000 },
  m6: { cal: 250, price: 18000 },
  m7: { cal: 180, price: 15000 },
  m8: { cal: 350, price: 20000 },
};

const selected = {};

function toggleMeal(card, id) {
  selected[id] = !selected[id];
  card.classList.toggle('selected', selected[id]);
  const btn = document.getElementById('btn-' + id);
  btn.classList.toggle('selected-btn', selected[id]);
  btn.textContent = selected[id] ? '✓ Tanlandi' : 'Tanlash';
  updateSummary();
}

function updateSummary() {
  let count = 0, cal = 0, total = 0;
  for (const id in selected) {
    if (selected[id]) {
      count++;
      cal += mealData[id].cal;
      total += mealData[id].price;
    }
  }
  document.getElementById('sel-count').textContent = count + ' ta taom';
  document.getElementById('sel-cal').textContent = cal + ' kal';

  const formattedTotal = formatPrice(total);
  document.querySelectorAll('.total-val').forEach(el => {
    el.textContent = formattedTotal;
  });
  document.querySelectorAll('.cart-plan .total').forEach(el => {
    el.textContent = 'Jami: ' + formattedTotal;
  });
  document.querySelectorAll('.success-row:last-child span:last-child').forEach(el => {
    el.textContent = formattedTotal;
  });
  document.querySelectorAll('.confirm-btn').forEach(btn => {
    btn.disabled = count === 0;
    btn.textContent = count === 0 ? 'Avval taom tanlang' : "Savatga o'tish →";
  });
}

function formatPrice(value) {
  if (!value) return "0 so'm";
  return new Intl.NumberFormat('uz-UZ').format(value) + " so'm";
}

const modalMealData = {
  m1: { name: "Tovuq va jigarrang guruch", price: "32 000 so'm", cal: "480 kal", protein: "38g", carbs: "52g", fat: "9g", ingredients: "Grillangan tovuq ko'kragi, jigarrang guruch, salat bargi, bodring, ziravorlar, limon sharbati" },
  m2: { name: "Tovuq boldir + makkajo'xori guruch", price: "35 000 so'm", cal: "520 kal", protein: "42g", carbs: "48g", fat: "14g", ingredients: "Tovuq boldir (2 dona), makkajo'xori guruch, ziravorlar, teri ostida pishirilgan, limon" },
  m3: { name: "Tuxum va go'sht nonushtasi", price: "28 000 so'm", cal: "430 kal", protein: "32g", carbs: "28g", fat: "18g", ingredients: "Tuxum qovurma (3 ta), mol go'shti (50g), bodring, pomidor, makkajo'xori, bug'doy noni" },
  m4: { name: "Oddiy guruch, tovuq va tuxum", price: "25 000 so'm", cal: "390 kal", protein: "35g", carbs: "45g", fat: "7g", ingredients: "Oq guruch (150g), pishirilgan tovuq (120g), qattiq tuxum (1 ta), bodring dilim" },
  m5: { name: "Sabzavotli kish (kechki taom)", price: "22 000 so'm", cal: "310 kal", protein: "18g", carbs: "30g", fat: "12g", ingredients: "Jo'xori uni 150g, 3 tuxum, kefir 150ml, pishloq 70g, brokkoli 150g, pomidor cheri 6-7 dona, qovoqcha 100g" },
  m6: { name: "Qulupnay va jo'xori uni smuzisi", price: "18 000 so'm", cal: "250 kal", protein: "8g", carbs: "40g", fat: "5g", ingredients: "Qulupnay 100g, jo'xori uni (oatmeal) 30g, sut 150ml, asal 10g — to'yimli va foydali" },
  m7: { name: "Lavlagi detoks shirasi", price: "15 000 so'm", cal: "180 kal", protein: "3g", carbs: "38g", fat: "1g", ingredients: "1 lavlagi, 1 sabzi, 1 olma, 1 apelsin, 1 bo'lak zanjabil — jigarni tozalaydi va immuniteni mustahkamlaydi" },
  m8: { name: "Tvorog bilan oqsilli smuzı", price: "20 000 so'm", cal: "350 kal", protein: "22g", carbs: "35g", fat: "10g", ingredients: "Tvorog 200g, pishgan banan (1 dona), yong'oq 30g, sut 150ml (oddiy yoki o'simlik), asal 1 osh qoshiq" },
};

let currentModalId = null;

function openModal(id) {
  const data = modalMealData[id];
  const imgEl = document.querySelector('#card-' + id + ' .meal-img');
  currentModalId = id;
  document.getElementById('modal-img').src = imgEl ? imgEl.src : '';
  document.getElementById('modal-name').textContent = data.name;
  document.getElementById('modal-price').textContent = data.price;
  document.getElementById('modal-cal').textContent = data.cal;
  document.getElementById('modal-protein').textContent = data.protein;
  document.getElementById('modal-carbs').textContent = data.carbs;
  document.getElementById('modal-fat').textContent = data.fat;
  document.getElementById('modal-ingredients').textContent = data.ingredients;
  const addBtn = document.getElementById('modal-add-btn');
  addBtn.textContent = selected[id] ? '✓ Tanlangan — Olib tashlash' : "Savatga qo'shish";
  addBtn.classList.toggle('is-removing', Boolean(selected[id]));
  document.getElementById('meal-modal').classList.add('open');
}

function closeModal() {
  document.getElementById('meal-modal').classList.remove('open');
  currentModalId = null;
}

function closeModalOutside(e) {
  if (e.target === document.getElementById('meal-modal')) closeModal();
}

function addFromModal() {
  if (!currentModalId) return;
  const id = currentModalId;
  selected[id] = !selected[id];
  const card = document.getElementById('card-' + id);
  card.classList.toggle('selected', selected[id]);
  const cardBtn = document.getElementById('btn-' + id);
  cardBtn.classList.toggle('selected-btn', selected[id]);
  cardBtn.textContent = selected[id] ? '✓ Tanlandi' : 'Tanlash';
  const addBtn = document.getElementById('modal-add-btn');
  addBtn.textContent = selected[id] ? '✓ Tanlangan — Olib tashlash' : "Savatga qo'shish";
  addBtn.classList.toggle('is-removing', Boolean(selected[id]));
  updateSummary();
}

function initInteractions() {
  document.querySelectorAll('.meal-card').forEach(card => {
    const id = card.id.replace('card-', '');
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openModal(id);
      }
    });
  });

  document.querySelectorAll('.meal-select-btn').forEach(btn => {
    const id = btn.id.replace('btn-', '');
    btn.type = 'button';
    btn.addEventListener('click', event => {
      event.stopPropagation();
      const card = document.getElementById('card-' + id);
      toggleMeal(card, id);
    });
  });

  document.querySelectorAll('.tag, .gender-btn, .radio-item').forEach(el => {
    el.setAttribute('tabindex', '0');
    el.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        el.click();
      }
    });
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeModal();
  });

  updateSummary();
}

document.addEventListener('DOMContentLoaded', initInteractions);
