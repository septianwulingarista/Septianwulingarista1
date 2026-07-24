/* ============================================
   SCRIPT.JS — Septian Wuling Arista
   Dealer Resmi Wuling Tangerang Cimone
   ============================================ */

// ====== DATA PRODUK ======
const products = [
  {name:'New Cloud EV',badge:'Electric Vehicle',cls:'ev',spec:'Range 460 KM | Baterai 50.6 kWh',price:415000000,img:'https://wuling.id/storage/app/uploads/public/668/3ea/47c/6683ea47ccde4059714316.png'},
  {name:'New BinguoEV',badge:'Electric Vehicle',cls:'ev',spec:'Fast Charging CCS2 | Retro Stylish',price:318000000,img:'https://wuling.id/storage/app/uploads/public/668/3eb/1ae/6683eb1ae191e483038676.png'},
  {name:'New Air ev',badge:'Electric Vehicle',cls:'ev',spec:'Compact EV 200/300 KM | Home Charging',price:214000000,img:'https://wuling.id/storage/app/uploads/public/668/3ea/034/6683ea034c4cc733306233.png'},
  {name:'New Almaz RS',badge:'SUV / Hybrid',cls:'suv',spec:'ADAS | Voice Command WIND | Sunroof',price:398000000,img:'https://wuling.id/storage/app/uploads/public/668/3ee/287/6683ee287b926071060938.png'},
  {name:'New Alvez',badge:'Compact SUV',cls:'suv',spec:'Style & Innovation | Ground Clearance Tinggi',price:215000000,img:'https://wuling.id/storage/app/uploads/public/668/3e5/9bc/6683e59bcc6d3283281577.png'},
  {name:'Formo Max Pick-Up',badge:'Komersial',cls:'kom',spec:'Bak 3 Sisi | EPS | Rem ABS',price:168000000,img:'https://wuling.id/storage/app/uploads/public/668/3f1/4aa/6683f14aacda6145347209.png'},
];

function formatRupiah(n){return 'Rp '+Number(n).toLocaleString('id-ID')}

function renderProducts(containerId,list){
  const grid=document.getElementById(containerId);
  if(!grid)return;
  grid.innerHTML=list.map(p=>{
    const badgeCls=p.cls==='ev'?'card-badge-ev':p.cls==='suv'?'card-badge-suv':'card-badge-kom';
    return `
      <div class="product-card">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <div class="card-body">
          <span class="card-badge ${badgeCls}">${p.badge}</span>
          <h3>${p.name}</h3>
          <p class="card-spec">${p.spec}</p>
          <p class="card-price">${formatRupiah(p.price)}</p>
          <a href="#booking" class="btn btn-primary btn-sm" onclick="showPage('booking')">Booking Test Drive</a>
        </div>
      </div>`;
  }).join('');
}

// ====== PAGE NAVIGATION ======
function showPage(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  const target=document.getElementById('page-'+id);
  if(target)target.classList.add('active');

  document.querySelectorAll('.nav-link').forEach(a=>{
    const page=a.dataset.page;
    a.classList.toggle('active',page===id);
  });

  window.scrollTo(0,0);
  closeMenu();

  // init kredit
  if(id==='kredit')hitungKredit();
  // set tanggal booking
  if(id==='booking'){
    const el=document.getElementById('bTanggal');
    if(el&&!el.value){
      const d=new Date();d.setDate(d.getDate()+1);
      el.value=d.toISOString().split('T')[0];
    }
  }
}

// Hamburger
document.getElementById('hamburger')?.addEventListener('click',()=>{
  document.getElementById('navMenu').classList.toggle('open');
});
function closeMenu(){
  document.getElementById('navMenu')?.classList.remove('open');
}

// ====== PRODUK FILTER ======
let currentFilter='all';

function filterProduk(filter){
  currentFilter=filter;
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.toggle('active',b.dataset.filter===filter));
  const filtered=filter==='all'?products:products.filter(p=>p.cls===filter);
  renderProducts('allProducts',filtered);
}

// Init filter buttons
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.filter-btn').forEach(btn=>{
    btn.addEventListener('click',()=>filterProduk(btn.dataset.filter));
  });
});

// ====== KREDIT CALC ======
function hitungKredit(){
  const harga=parseInt(document.getElementById('kModel').value);
  const dpPersen=parseInt(document.getElementById('kDp').value);
  const tenor=parseInt(document.getElementById('kTenor').value);
  const bungaTahunan=parseFloat(document.getElementById('kBunga').value)||0;

  document.getElementById('kDpLabel').textContent=dpPersen+'%';
  document.getElementById('kHarga').textContent=formatRupiah(harga);

  const dpRp=Math.round(harga*dpPersen/100);
  const pokok=harga-dpRp;
  const bungaBulanan=bungaTahunan/100/12;
  const n=tenor;

  let angsuran;
  if(bungaTahunan===0){
    angsuran=pokok/n;
  }else{
    angsuran=pokok*(bungaBulanan*Math.pow(1+bungaBulanan,n))/(Math.pow(1+bungaBulanan,n)-1);
  }

  document.getElementById('kHargaMobil').textContent=formatRupiah(harga);
  document.getElementById('kDpRp').textContent=formatRupiah(dpRp);
  document.getElementById('kPokok').textContent=formatRupiah(pokok);
  document.getElementById('kTenorText').textContent=tenor+' bulan';
  document.getElementById('kAngsuran').textContent=formatRupiah(Math.round(angsuran));
}

// ====== BOOKING WA ======
function kirimBooking(e){
  e.preventDefault();
  const nama=document.getElementById('bNama').value.trim();
  const wa=document.getElementById('bWa').value.trim();
  const email=document.getElementById('bEmail').value.trim();
  const model=document.getElementById('bModel').value;
  const tanggal=document.getElementById('bTanggal').value;
  const jam=document.getElementById('bJam').value;
  const pesan=document.getElementById('bPesan').value.trim();

  if(!nama||!wa||!model||!tanggal){
    alert('Harap isi Nama, No. WhatsApp, Model Mobil, dan Tanggal Test Drive.');
    return false;
  }

  const text=encodeURIComponent(
    `Halo, saya ingin booking Test Drive Wuling!\n\n`+
    `Nama: ${nama}\nNo. WA: ${wa}\n`+
    (email?`Email: ${email}\n`:'')+
    `Mobil: ${model}\nTanggal: ${tanggal}\n`+
    (jam?`Jam: ${jam}\n`:'')+
    (pesan?`Pesan: ${pesan}`:'')
  );
  window.open(`https://wa.me/6285692040095?text=${text}`,'_blank');
  return false;
}

// ====== KONTAK WA ======
function kirimPesan(e){
  e.preventDefault();
  const nama=document.getElementById('kNama').value.trim();
  const pesan=document.getElementById('kPesan').value.trim();
  if(!nama||!pesan){
    alert('Harap isi Nama dan Pesan.');
    return false;
  }
  const text=encodeURIComponent(`Halo, saya ${nama}.\n\n${pesan}`);
  window.open(`https://wa.me/6285692040095?text=${text}`,'_blank');
  return false;
}

// ====== INIT ======
document.addEventListener('DOMContentLoaded',()=>{
  // Render home products (3 pertama)
  renderProducts('homeProducts',products.slice(0,3));
  // Render all products
  renderProducts('allProducts',products);
  // Set default filter active
  filterProduk('all');
  // Load page from hash
  const hash=location.hash.replace('#','');
  if(hash&&document.getElementById('page-'+hash)){
    showPage(hash);
  }
  // Close menu on nav click
  document.querySelectorAll('.nav-link').forEach(a=>a.addEventListener('click',closeMenu));
});

// ====== HASH CHANGE ======
window.addEventListener('hashchange',()=>{
  const hash=location.hash.replace('#','');
  if(hash&&document.getElementById('page-'+hash)){
    showPage(hash);
  }
});
