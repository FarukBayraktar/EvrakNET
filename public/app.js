const apiBase = '/api'

const loginSection = document.getElementById('login-section')
const dashboardSection = document.getElementById('dashboard-section')
const detailModal = document.getElementById('detail-modal')
const statusModal = document.getElementById('status-modal')
const addModal = document.getElementById('add-modal')
const registerSection = document.getElementById('register-section')
const loginForm = document.getElementById('login-form')
const loginError = document.getElementById('login-error')
const registerForm = document.getElementById('register-form')
const registerError = document.getElementById('register-error')

let docs = [] // evrak listesi global

function showSection(section) {
  loginSection.style.display = 'none'
  dashboardSection.style.display = 'none'
  registerSection.style.display = 'none'
  if (section === 'login') loginSection.style.display = ''
  if (section === 'dashboard') dashboardSection.style.display = ''
  if (section === 'register') registerSection.style.display = ''
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

document.getElementById('open-register').onclick = e => {
  e.preventDefault()
  showSection('register')
}

document.getElementById('back-to-login').onclick = e => {
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

async function fetchDocuments() {
  const res = await fetch(apiBase + '/documents')
  return res.json()
}

function renderDashboard() {
  dashboardSection.innerHTML = ''
  const topBar = document.createElement('div')
  topBar.className = 'dashboard-top'
  const filters = document.createElement('div')
  filters.className = 'dashboard-filters'
  const searchInput = document.createElement('input')
  searchInput.type = 'text'
  searchInput.placeholder = 'Evrak No ile ara'
  const dateFrom = document.createElement('input')
  dateFrom.type = 'date'
  const dateTo = document.createElement('input')
  dateTo.type = 'date'
  const statusSelect = document.createElement('select')
  ;['','Beklemede','İşlemde','Tamamlandı','İptal'].forEach(s => {
    const o = document.createElement('option')
    o.value = s
    o.textContent = s ? s : 'Tüm Durumlar'
    statusSelect.appendChild(o)
  })
  filters.append(searchInput, dateFrom, dateTo, statusSelect)
  const addBtn = document.createElement('button')
  addBtn.textContent = 'Evrak Ekle'
  addBtn.className = 'btn btn-add'
  addBtn.onclick = openAddModal
  const logoutBtn = document.createElement('button')
  logoutBtn.textContent = 'Çıkış Yap'
  logoutBtn.className = 'btn'
  logoutBtn.onclick = logout
  topBar.append(filters, addBtn, logoutBtn)
  dashboardSection.appendChild(topBar)
  const table = document.createElement('table')
  table.className = 'dashboard-table'
  table.innerHTML = `<thead><tr><th>Evrak No</th><th>Başlık</th><th>Birim</th><th>Durum</th><th>Tarih</th><th></th><th></th></tr></thead><tbody></tbody>`
  dashboardSection.appendChild(table)
  let docs = []
  fetchDocuments().then(data => {
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
      tr.innerHTML = `<td>${doc.evrakNo}</td><td>${doc.baslik}</td><td>${doc.birim}</td><td>${doc.durum}</td><td>${doc.olusturulmaTarihi}</td><td><button class='btn' data-evrak="${doc.evrakNo}">Detay</button></td><td><button class='btn-delete' data-delete="${doc.evrakNo}">Sil</button></td>`
      tbody.appendChild(tr)
    })
  }
  searchInput.oninput = renderRows
  dateFrom.onchange = renderRows
  dateTo.onchange = renderRows
  statusSelect.onchange = renderRows
  table.onclick = e => {
    if (e.target.classList.contains('btn') && e.target.dataset.evrak) {
      openDetailModal(e.target.dataset.evrak)
    }
    if (e.target.classList.contains('btn-delete') && e.target.dataset.delete) {
      deleteDocument(e.target.dataset.delete)
    }
  }
}

async function deleteDocument(evrakNo) {
  await fetch(apiBase + '/documents', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ evrakNo })
  })
  renderDashboard()
}

function openAddModal() {
  addModal.innerHTML = ''
  const modalBox = document.createElement('div')
  modalBox.className = 'modal-content'
  modalBox.innerHTML = `
    <h3>Yeni Evrak Ekle</h3>
    <input id="add-evrakNo" placeholder="Evrak No">
    <input id="add-baslik" placeholder="Başlık">
    <input id="add-aciklama" placeholder="Açıklama">
    <input id="add-tarih" type="date" placeholder="Oluşturulma Tarihi">
    <input id="add-birim" placeholder="Birim">
    <input id="add-personel" placeholder="İşleyen Personel">
    <select id="add-durum">
      <option value="Beklemede">Beklemede</option>
      <option value="İşlemde">İşlemde</option>
      <option value="Tamamlandı">Tamamlandı</option>
      <option value="İptal">İptal</option>
    </select>
    <button id="add-save" class="btn">Kaydet</button>
    <button id="add-cancel" class="btn">Vazgeç</button>
    <div id="add-error" style="color:#d32f2f;margin-top:1em;"></div>
  `
  addModal.appendChild(modalBox)
  addModal.classList.add('active')
  document.getElementById('add-cancel').onclick = () => {
    addModal.classList.remove('active')
  }
  document.getElementById('add-save').onclick = async () => {
    const evrakNo = document.getElementById('add-evrakNo').value.trim()
    const baslik = document.getElementById('add-baslik').value.trim()
    const aciklama = document.getElementById('add-aciklama').value.trim()
    const olusturulmaTarihi = document.getElementById('add-tarih').value
    const birim = document.getElementById('add-birim').value.trim()
    const personel = document.getElementById('add-personel').value.trim()
    const durum = document.getElementById('add-durum').value
    if (!evrakNo || !baslik || !olusturulmaTarihi || !birim || !personel) {
      document.getElementById('add-error').textContent = 'Tüm alanlar zorunlu'
      return
    }
    const yeniDoc = {
      evrakNo, baslik, aciklama, olusturulmaTarihi, durum, birim, personel,
      gecmis: [
        { tarih: olusturulmaTarihi, personel, aciklama: 'Evrak oluşturuldu.' }
      ]
    }
    await fetch(apiBase + '/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(yeniDoc)
    })
    addModal.classList.remove('active')
    renderDashboard()
  }
}

async function openDetailModal(evrakNo) {
  const res = await fetch(apiBase + '/document?evrakNo=' + encodeURIComponent(evrakNo))
  if (!res.ok) return
  const doc = await res.json()
  detailModal.innerHTML = ''
  const modalBox = document.createElement('div')
  modalBox.className = 'modal-content'
  modalBox.innerHTML = `
    <h2>${doc.baslik}</h2>
    <div><b>Evrak No:</b> ${doc.evrakNo}</div>
    <div><b>Birim:</b> ${doc.birim}</div>
    <div><b>İşleyen Personel:</b> ${doc.personel}</div>
    <div><b>Durum:</b> ${doc.durum}</div>
    <div><b>Oluşturulma Tarihi:</b> ${doc.olusturulmaTarihi}</div>
    <h3>İşlem Geçmişi</h3>
    <ul style="padding-left:1.2em;">
      ${doc.gecmis.map(g => `<li>${g.tarih} – ${g.personel} – ${g.aciklama}</li>`).join('')}
    </ul>
    <button id="status-update-btn" class="btn">Statü Güncelle</button>
    <button id="close-detail" class="btn">Kapat</button>
  `
  detailModal.appendChild(modalBox)
  detailModal.classList.add('active')
  document.getElementById('close-detail').onclick = () => {
    detailModal.classList.remove('active')
  }
  document.getElementById('status-update-btn').onclick = () => {
    openStatusModal(doc)
  }
}

function openStatusModal(doc) {
  statusModal.innerHTML = ''
  const modalBox = document.createElement('div')
  modalBox.className = 'modal-content'
  modalBox.innerHTML = `
    <h3>Statü Güncelle</h3>
    <select id="new-status">
      <option value="Beklemede">Beklemede</option>
      <option value="İşlemde">İşlemde</option>
      <option value="Tamamlandı">Tamamlandı</option>
      <option value="İptal">İptal</option>
    </select>
    <textarea id="status-desc" placeholder="Açıklama" style="width:100%;margin:1em 0;"></textarea>
    <button id="save-status" class="btn">Kaydet</button>
    <button id="close-status" class="btn">Vazgeç</button>
  `
  statusModal.appendChild(modalBox)
  statusModal.classList.add('active')
  document.getElementById('close-status').onclick = () => {
    statusModal.classList.remove('active')
  }
  document.getElementById('save-status').onclick = async () => {
    const newStatus = document.getElementById('new-status').value
    const desc = document.getElementById('status-desc').value.trim()
    const now = new Date().toISOString().slice(0,10)
    const personel = isAdmin() ? 'Admin' : 'Kullanıcı'
    const updatedDoc = {
      ...doc,
      durum: newStatus,
      gecmis: [...doc.gecmis, { tarih: now, personel, aciklama: `Durum '${newStatus}' olarak güncellendi. ${desc}` }]
    }
    await fetch(apiBase + '/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedDoc)
    })
    statusModal.classList.remove('active')
    detailModal.classList.remove('active')
    renderDashboard()
  }
}

window.onclick = e => {
  if (e.target === detailModal) detailModal.classList.remove('active')
  if (e.target === statusModal) statusModal.classList.remove('active')
  if (e.target === addModal) addModal.classList.remove('active')
}

window.onload = () => {
  if (getToken()) {
    renderDashboard()
    showSection('dashboard')
  } else {
    showSection('login')
  }
}
