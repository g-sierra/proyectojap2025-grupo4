// js/my-profile.js
(function(){
  const KEY = 'myProfile_v1';
  const fileInput = document.getElementById('file-input');
  const avatar = document.getElementById('avatar');
  const firstName = document.getElementById('firstName');
  const lastName = document.getElementById('lastName');
  const email = document.getElementById('email');
  const phone = document.getElementById('phone');
  const saveBtn = document.getElementById('saveBtn');
  const status = document.getElementById('status');

  // Cargar desde localStorage si existe
  function loadFromLocal(){
    const raw = localStorage.getItem(KEY);
    if(!raw) return false;
    try{
      const data = JSON.parse(raw);
      firstName.value = data.firstName || '';
      lastName.value = data.lastName || '';
      email.value = data.email || '';
      phone.value = data.phone || '';

      // Cargar imagen si existe
      if(data.avatar) {
        avatar.innerHTML = '';
        const img = document.createElement('img');
        img.src = data.avatar;
        img.style.width = '120px';
        img.style.height = '120px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '50%';
        avatar.appendChild(img);
      }

      return true;
    }catch(e){
      console.error('Error parsing local profile', e);
      return false;
    }
  }

  // Pre-cargar email desde query string si no hay datos guardados (primera vez)
  function preloadEmailFromQuery(){
    const params = new URLSearchParams(location.search);
    const qEmail = params.get('email');
    if(qEmail && !email.value){
      email.value = qEmail;
    }
  }

  // Preview de la imagen y guardar en variable
   let currentAvatar = null;
  fileInput.addEventListener('change', function(ev){
    const file = ev.target.files && ev.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(e){
      currentAvatar = e.target.result; // Guardar base64
      avatar.innerHTML = '';
      const img = document.createElement('img');
      img.src = currentAvatar;
      img.style.width = '120px';
      img.style.height = '120px';
      img.style.objectFit = 'cover';
      img.style.borderRadius = '50%';
      avatar.appendChild(img);
    };
    reader.readAsDataURL(file);
  });

  // Guardar en localStorage
  saveBtn.addEventListener('click', function(){
    const payload = {
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      email: email.value.trim(),
      phone: phone.value.trim(),
      avatar: currentAvatar, // GUARDAR IMAGEN
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(KEY, JSON.stringify(payload));
    status.textContent = 'Datos guardados localmente ✓';
    setTimeout(()=> status.textContent = '', 2500);
  });

  // Inicialización
  if(!loadFromLocal()){
    preloadEmailFromQuery();
  } else {
    // Si hay datos guardados, cargar la imagen también
    const savedData = JSON.parse(localStorage.getItem(KEY));
    if(savedData && savedData.avatar) {
      currentAvatar = savedData.avatar;
    }
  }
})();
