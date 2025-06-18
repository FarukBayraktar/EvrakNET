const apiBase = '/api'
const loginSection = document.getElementById('login-section')
const dashboardSection = document.getElementById('dashboard-section')
const detailModal = document.getElementById('detail-modal')
const statusModal = document.getElementById('status-modal')
const loginForm = document.getElementById('login-form')
const loginError = document.getElementById('login-error')
const registerSection = document.getElementById('register-section')
const registerForm = document.getElementById('register-form')
const registerError = document.getElementById('register-error')

function showSection(section) {
  loginSection.style.display = section === 'login' ? '' : 'none'
  dashboardSection.style.display = section === 'dashboard' ? '' : 'none'
  registerSection.style.display = section === 'register' ? '' : 'none'
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

function getUsers() {
  return JSON.parse(localStorage.getItem('evraknet_users') || '[]')
}

function saveUser(user) {
  const users = getUsers()
  users.push(user)
  localStorage.setItem('evraknet_users', JSON.stringify(users))
}

function findUser(email) {
  return getUsers().find(u => u.email === email)
}

document.getElementById('open-register').onclick = e => {
  e.preventDefault()
  showSection('register')
}

document.getElementById('back-to-login').onclick = e => {
  e.preventDefault()
  showSection('login')
}

registerForm.onsubmit = e => {
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
  if (findUser(email)) {
    registerError.textContent = 'Bu email ile kayıtlı kullanıcı var'
    return
  }
  saveUser({ email, password })
  showSection('login')
}

loginForm.onsubmit = async e => {
  e.preventDefault()
  loginError.textContent = ''
  const email = document.getElementById('email').value.trim()
  const password = document.getElementById('password').value
  const localUser = findUser(email)
  if (localUser && localUser.password === password) {
    setToken('mock-token-' + Math.random().toString(36).substr(2), false)
    renderDashboard()
    showSection('dashboard')
    return
  }
  const res = await fetch(apiBase + '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  if (!res.ok) {
    loginError.textContent = 'Giriş başarısız'
    return
  }
  const data = await res.json()
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
  ;['','Beklemede','İşlemde','Tamamlandı','İptal'].forEach(s => {
    const o = document.createElement('option')
    o.value = s
    o.textContent = s ? s : 'Tüm Durumlar'
    statusSelect.appendChild(o)
  })
  const logoutBtn = document.createElement('button')
  logoutBtn.textContent = 'Çıkış Yap'
  logoutBtn.onclick = logout
  topBar.append(searchInput, dateFrom, dateTo, statusSelect, logoutBtn)
  dashboardSection.appendChild(topBar)
  const table = document.createElement('table')
  table.style.width = '100%'
  table.style.borderCollapse = 'collapse'
  table.innerHTML = `<thead><tr><th>Evrak No</th><th>Başlık</th><th>Birim</th><th>Durum</th><th>Tarih</th><th></th></tr></thead><tbody></tbody>`
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
      tr.innerHTML = `<td>${doc.evrakNo}</td><td>${doc.baslik}</td><td>${doc.birim}</td><td>${doc.durum}</td><td>${doc.olusturulmaTarihi}</td><td><button data-evrak="${doc.evrakNo}">Detay</button></td>`
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

async function openDetailModal(evrakNo) {
  const res = await fetch(apiBase + '/document?evrakNo=' + encodeURIComponent(evrakNo))
  if (!res.ok) return
  const doc = await res.json()
  detailModal.innerHTML = ''
  const modalBox = document.createElement('div')
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
}

function openStatusModal(doc) {
  statusModal.innerHTML = ''
  const modalBox = document.createElement('div')
  modalBox.innerHTML = `
    <h3>Statü Güncelle</h3>
    <select id="new-status">
      <option value="Beklemede">Beklemede</option>
      <option value="İşlemde">İşlemde</option>
      <option value="Tamamlandı">Tamamlandı</option>
      <option value="İptal">İptal</option>
    </select>
    <textarea id="status-desc" placeholder="Açıklama" style="width:100%;margin:1em 0;"></textarea>
    <button id="save-status">Kaydet</button>
    <button id="close-status">Vazgeç</button>
  `
  statusModal.appendChild(modalBox)
  statusModal.style.display = 'flex'
  document.getElementById('close-status').onclick = () => {
    statusModal.style.display = 'none'
  }
  document.getElementById('save-status').onclick = async () => {
    const newStatus = document.getElementById('new-status').value
    const desc = document.getElementById('status-desc').value.trim()
    const now = new Date().toISOString().slice(0,10)
    const personel = isAdmin() ? 'Admin' : 'Kullanıcı'
    const newLog = `${now} – ${personel} – Durum '${newStatus}' olarak güncellendi. ${desc ? 'Açıklama: ' + desc : ''}`
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
    statusModal.style.display = 'none'
    detailModal.style.display = 'none'
    renderDashboard()
  }
}

window.onload = () => {
  if (getToken()) {
    renderDashboard()
    showSection('dashboard')
  } else {
    showSection('login')
  }
} 