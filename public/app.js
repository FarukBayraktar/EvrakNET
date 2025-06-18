const apiBase = '/api'

const loginSection = document.getElementById('login-section')
const dashboardSection = document.getElementById('dashboard-section')
const detailModal = document.getElementById('detail-modal')
const statusModal = document.getElementById('status-modal')
const registerSection = document.getElementById('register-section')

let docs = [] // evrak listesi global

function showSection(section) {
  loginSection.style.display = 'none'
  registerSection.style.display = 'none'
  dashboardSection.style.display = 'none'
  if (section === 'login') loginSection.style.display = 'block'
  if (section === 'register') registerSection.style.display = 'block'
  if (section === 'dashboard') dashboardSection.style.display = 'block'
}

function setToken(token, isAdmin) {
  localStorage.setItem('evraknet_token', token)
  localStorage.setItem('evraknet_admin', isAdmin ? '1' : '0')
}
function getToken() {
  return localStorage.getItem('evraknet_token')
}
function isAdmin() {
  return localStorage.getItem('evraknet_admin') === '1'
}
function logout() {
  localStorage.removeItem('evraknet_token')
  localStorage.removeItem('evraknet_admin')
  showSection('login')
}

window.onload = () => {
  const loginForm = document.getElementById('login-form')
  const loginError = document.getElementById('login-error')
  const registerForm = document.getElementById('register-form')
  const registerError = document.getElementById('register-error')
  const openRegisterBtn = document.getElementById('open-register')
  const backToLoginBtn = document.getElementById('back-to-login')

  openRegisterBtn.onclick = e => {
    e.preventDefault()
    showSection('register')
  }

  backToLoginBtn.onclick = e => {
    e.preventDefault()
    showSection('login')
  }

  registerForm.onsubmit = async e => {
    e.preventDefault()
    registerError.textContent = ''
    const email = document.getElementById('reg-email').value.trim()
    const password = document.getElementById('reg-password').value
    const passwordRepeat = document.getElementById('reg-password-repeat').value

    if (!email || !password || !passwordRepeat) {
      registerError.textContent = 'Tüm alanlar zorunlu'
      return
    }
    if (password !== passwordRepeat) {
      registerError.textContent = 'Şifreler eşleşmiyor'
      return
    }

    const res = await fetch(apiBase + '/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()

    if (!res.ok) {
      registerError.textContent = data.message || 'Kayıt başarısız'
      return
    }

    alert("Kayıt başarılı! Giriş yapabilirsiniz.")
    showSection('login')
  }

  loginForm.onsubmit = async e => {
    e.preventDefault()
    loginError.textContent = ''
    const email = document.getElementById('email').value.trim()
    const password = document.getElementById('password').value

    const res = await fetch(apiBase + '/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()

    if (!res.ok) {
      loginError.textContent = data.message || 'Giriş başarısız'
      return
    }

    setToken(data.token, data.isAdmin)
    renderDashboard()
    showSection('dashboard')
  }

  if (getToken()) {
    renderDashboard()
    showSection('dashboard')
  } else {
    showSection('login')
  }
}

function renderDashboard() {
  dashboardSection.innerHTML = ''
  const topBar = document.createElement('div')
  topBar.style.display = 'flex'
  topBar.style.justifyContent = 'space-between'
  topBar.style.alignItems = 'center'
  topBar.style.marginBottom = '1.5rem'

  const searchInput = document.createElement('input')
  searchInput.type = 'text'
  searchInput.placeholder = 'Evrak No ile ara'
  searchInput.style.marginRight = '1rem'

  const dateFrom = document.createElement('input')
  dateFrom.type = 'date'
  dateFrom.style.marginRight = '0.5rem'

  const dateTo = document.createElement('input')
  dateTo.type = 'date'
  dateTo.style.marginRight = '1rem'

  const statusSelect = document.createElement('select')
  ;['', 'Beklemede', 'İşlemde', 'Tamamlandı', 'İptal'].forEach(s => {
    const o = document.createElement('option')
    o.value = s
    o.textContent = s ? s : 'Tüm Durumlar'
    statusSelect.appendChild(o)
  })

  const newDocBtn = document.createElement('button')
  newDocBtn.textContent = '+ Yeni Evrak'
  newDocBtn.onclick = openNewDocModal

  const logoutBtn = document.createElement('button')
  logoutBtn.textContent = 'Çıkış Yap'
  logoutBtn.onclick = logout

  topBar.append(searchInput, dateFrom, dateTo, statusSelect, newDocBtn, logoutBtn)
  dashboardSection.appendChild(topBar)

  const table = document.createElement('table')
  table.style.width = '100%'
  table.style.borderCollapse = 'collapse'
  table.innerHTML = `<thead><tr><th>Evrak No</th><th>Başlık</th><th>Birim</th><th>Durum</th><th>Tarih</th><th>Drive</th><th></th></tr></thead><tbody></tbody>`
  dashboardSection.appendChild(table)

  fetch(apiBase + '/documents')
    .then(res => res.json())
    .then(data => {
      docs = data
      renderRows()
    })

  function renderRows() {
    const tbody = table.querySelector('tbody')
    tbody.innerHTML = ''
    let filtered = docs

    const q = searchInput.value.trim()
    if (q) filtered = filtered.filter(d => d.evrakNo.includes(q))
    if (dateFrom.value) filtered = filtered.filter(d => d.olusturulmaTarihi >= dateFrom.value)
    if (dateTo.value) filtered = filtered.filter(d => d.olusturulmaTarihi <= dateTo.value)
    if (statusSelect.value) filtered = filtered.filter(d => d.durum === statusSelect.value)

    filtered.forEach(doc => {
      const tr = document.createElement('tr')
      const driveBtn = doc.drive ? `<a href="${doc.drive}" target="_blank">🔗</a>` : '-'
      tr.innerHTML = `<td>${doc.evrakNo}</td><td>${doc.baslik}</td><td>${doc.birim}</td><td>${doc.durum}</td><td>${doc.olusturulmaTarihi}</td><td>${driveBtn}</td><td><button data-evrak="${doc.evrakNo}">Detay</button></td>`
      tbody.appendChild(tr)
    })
  }

  searchInput.oninput = renderRows
  dateFrom.onchange = renderRows
  dateTo.onchange = renderRows
  statusSelect.onchange = renderRows

  table.onclick = e => {
    if (e.target.tagName === 'BUTTON' && e.target.dataset.evrak) {
      openDetailModal(e.target.dataset.evrak)
    }
  }
}

function openNewDocModal() {
  statusModal.innerHTML = ''
  const modalBox = document.createElement('div')
  modalBox.innerHTML = `
    <h3>Yeni Evrak Ekle</h3>
    <input id="new-evrakNo" placeholder="Evrak No" />
    <input id="new-baslik" placeholder="Başlık" />
    <select id="new-birim">
      <option>Muhasebe</option>
      <option>İnsan Kaynakları</option>
      <option>Teknik</option>
      <option>İdari</option>
    </select>
    <input id="new-personel" placeholder="Personel" />
    <input id="new-drive" placeholder="Google Drive Linki (isteğe bağlı)" />
    <button id="save-new-doc">Kaydet</button>
    <button id="cancel-new-doc">İptal</button>
  `
  statusModal.appendChild(modalBox)
  statusModal.style.display = 'flex'

  document.getElementById('cancel-new-doc').onclick = () => {
    statusModal.style.display = 'none'
  }

  document.getElementById('save-new-doc').onclick = async () => {
    const evrakNo = document.getElementById('new-evrakNo').value.trim()
    const baslik = document.getElementById('new-baslik').value.trim()
    const birim = document.getElementById('new-birim').value
    const personel = document.getElementById('new-personel').value.trim()
    const drive = document.getElementById('new-drive').value.trim()

    if (!evrakNo || !baslik || !birim || !personel) return alert("Tüm alanlar zorunlu!")

    const yeniDoc = {
      evrakNo,
      baslik,
      birim,
      durum: 'Beklemede',
      personel,
      drive: drive || null,
      olusturulmaTarihi: new Date().toISOString().slice(0, 10),
      gecmis: [
        {
          tarih: new Date().toISOString().slice(0, 10),
          personel,
          aciklama: 'Evrak oluşturuldu'
        }
      ]
    }

    const res = await fetch(apiBase + '/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(yeniDoc)
    })

    if (res.ok) {
      statusModal.style.display = 'none'
      renderDashboard()
    } else {
      alert("Evrak eklenemedi!")
    }
  }
}

function openDetailModal(evrakNo) {
  fetch(`${apiBase}/document?evrakNo=${encodeURIComponent(evrakNo)}`)
    .then(res => res.json())
    .then(doc => {
      detailModal.innerHTML = ''
      const modalBox = document.createElement('div')
      modalBox.innerHTML = `
        <h2>${doc.baslik}</h2>
        <div><b>Evrak No:</b> ${doc.evrakNo}</div>
        <div><b>Birim:</b> ${doc.birim}</div>
        <div><b>İşleyen Personel:</b> ${doc.personel}</div>
        <div><b>Durum:</b> ${doc.durum}</div>
        <div><b>Oluşturulma Tarihi:</b> ${doc.olusturulmaTarihi}</div>
        ${doc.drive ? `<div><b>Drive:</b> <a href="${doc.drive}" target="_blank">Dosyayı Aç</a></div>` : ''}
        <h3>İşlem Geçmişi</h3>
        <ul style="padding-left:1.2em;">
          ${doc.gecmis.map(g => `<li>${g.tarih} – ${g.personel} – ${g.aciklama}</li>`).join('')}
        </ul>
        <button id="status-update-btn">Statü Güncelle</button>
        <button id="close-detail">Kapat</button>
      `
      detailModal.appendChild(modalBox)
      detailModal.style.display = 'flex'

      document.getElementById('close-detail').onclick = () => {
        detailModal.style.display = 'none'
      }

      document.getElementById('status-update-btn').onclick = () => {
        openStatusModal(doc)
      }
    })
}
