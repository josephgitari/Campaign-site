//Menu,open/close
    function toggleMenu() {
      const menu = document.getElementById('mobileMenu');
      menu.classList.toggle('open');
    }

    function closeMenu() {
      document.getElementById('mobileMenu').classList.remove('open');
    }

    function toggleMenu() {
      document.getElementById("mobileMenu").classList.toggle("open");
    }


//Volunteer Count
    document.addEventListener("DOMContentLoaded", function () {
      const counters = document.querySelectorAll('.number');
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        let count = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
          count += increment;
          if (count >= target) {
            counter.textContent = target;
            clearInterval(timer);
          } else {
            counter.textContent = Math.ceil(count);
          }
        }, 40);
      });

      // Form submit (same as your React alert)
      document.getElementById('volunteerForm').addEventListener('submit', function (e) {
        e.preventDefault();
        alert('Thank you for volunteering! We’ll contact you soon.');
        this.reset();
      });
    });

//Media Upload - WITH SUPER SMALL IMAGE COMPRESSION
const mediaItems = [
  { id: 1, type: 'image', url: 'https://picsum.photos/400/300?random=1', title: 'Campaign Rally' },
  { id: 2, type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4', title: 'Kisumu Town Hall' },
  { id: 3, type: 'image', url: 'https://picsum.photos/400/300?random=2', title: 'Team Meeting' },
  { id: 4, type: 'audio', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', title: 'Victory Speech' },
  { id: 5, type: 'image', url: 'https://picsum.photos/400/300?random=3', title: 'Volunteer Drive' },
  { id: 6, type: 'video', url: 'https://www.w3schools.com/html/movie.mp4', title: 'Policy Launch' },
];

let selectedFile = null;
let preview = null;
let compressedBlob = null;   // ← This holds the tiny compressed image

const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');
const previewContainer = document.getElementById('previewContainer');
const defaultUpload = document.getElementById('defaultUpload');
const uploadBtn = document.getElementById('uploadBtn');
const gallery = document.getElementById('gallery');

// Render initial media (unchanged)
function renderGallery() {
  gallery.innerHTML = '';
  mediaItems.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'media-item';
    div.style.animationDelay = `${idx * 0.1}s`;

    if (item.type === 'image') {
      div.innerHTML = `<img src="${item.url}" alt="${item.title}" />`;
    } else if (item.type === 'video') {
      div.innerHTML = `<video controls preload="metadata"><source src="${item.url}" type="video/mp4"></video>`;
    } else if (item.type === 'audio') {
      div.innerHTML = `
        <div class="audio-item">
          <div class="audio-icon">Audio</div>
          <audio controls><source src="${item.url}" /></audio>
          <p>${item.title}</p>
        </div>`;
    }

    div.innerHTML += `
      <div class="media-overlay">
        <h4>${item.title}</h4>
        <div class="overlay-actions">
          <button class="view-btn">View</button>
          <button class="delete-btn" data-id="${item.id}">Delete</button>
        </div>
      </div>`;
    gallery.appendChild(div);
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Delete this media?')) {
        const id = parseInt(btn.dataset.id);
        const index = mediaItems.findIndex(i => i.id === id);
        if (index > -1) mediaItems.splice(index, 1);
        renderGallery();
        alert('Deleted!');
      }
    });
  });
}

// ——— COMPRESSION FUNCTION (makes images tiny) ———
function compressImage(file, callback) {
  const img = new Image();
  const reader = new FileReader();

  reader.onload = e => img.src = e.target.result;
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const MAX_SIZE = 800;
    let width = img.width;
    let height = img.height;

    if (width > height) {
      if (width > MAX_SIZE) { height = (height * MAX_SIZE) / width; width = MAX_SIZE; }
    } else {
      if (height > MAX_SIZE) { width = (width * MAX_SIZE) / height; height = MAX_SIZE; }
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);

    canvas.toBlob(blob => callback(blob), 'image/jpeg', 0.6); // 60% quality = tiny + good looking
  };
  reader.readAsDataURL(file);
}

// File handling (now with compression)
fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));
uploadZone.addEventListener('dragover', (e) => { e.preventDefault(); uploadZone.classList.add('dragging'); });
uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragging'));
uploadZone.addEventListener('drop', (e) => {
  e.preventDefault(); uploadZone.classList.remove('dragging');
  const file = e.dataTransfer.files[0];
  if (file && (file.type.startsWith('image/') || file.type.startsWith('video/') || file.type.startsWith('audio/'))) {
    handleFile(file);
  }
});

function handleFile(file) {
  if (!file) return;

  // ——— STRICT SIZE & TYPE LIMITS ———
  const MAX_IMAGE_SIZE = 10 * 1024 * 1024;    // 10 MB max original image
  const MAX_VIDEO_SIZE = 50 * 1024 * 1024;    // 50 MB max video
  const MAX_AUDIO_SIZE = 20 * 1024 * 1024;    // 20 MB max audio
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'audio/mp3', 'audio/mpeg', 'audio/wav'];

  if (!ALLOWED_TYPES.includes(file.type)) {
    alert('Error: Only JPG, PNG, WebP, MP4, WebM, MP3, WAV files are allowed.');
    return;
  }

  if (file.type.startsWith('image/') && file.size > MAX_IMAGE_SIZE) {
    alert(`Image too large! Max 10 MB allowed. This file is ${(file.size/1024/1024).toFixed(1)} MB`);
    return;
  }
  if (file.type.startsWith('video/') && file.size > MAX_VIDEO_SIZE) {
    alert(`Video too large! Max 50 MB allowed. This file is ${(file.size/1024/1024).toFixed(1)} MB`);
    return;
  }
  if (file.type.startsWith('audio/') && file.size > MAX_AUDIO_SIZE) {
    alert(`Audio too large! Max 20 MB allowed. This file is ${(file.size/1024/1024).toFixed(1)} MB`);
    return;
  }

  selectedFile = file;

  if (file.type.startsWith('image/')) {
    // Compress heavily as before
    compressImage(file, (blob) => {
      compressedBlob = blob;
      const reader = new FileReader();
      reader.onloadend = () => {
        preview = {
          url: reader.result,
          type: 'image',
          name: file.name.replace(/\.[^/.]+$/, '') + '.jpg'
        };
        showPreview();
      };
      reader.readAsDataURL(blob);
    });
  } else {
    compressedBlob = file;
    const reader = new FileReader();
    reader.onloadend = () => {
      preview = {
        url: reader.result,
        type: file.type.startsWith('video/') ? 'video' : 'audio',
        name: file.name
      };
      showPreview();
    };
    reader.readAsDataURL(file);
  }
}

function showPreview() {
  defaultUpload.style.display = 'none';
  previewContainer.style.display = 'block';
  uploadBtn.style.display = 'block';

  let html = '';
  if (preview.type === 'image') {
    const sizeKB = compressedBlob ? (compressedBlob.size / 1024).toFixed(0) : '?';
    html = `<img src="${preview.url}" alt="Preview" style="max-width:100%;height:auto;border-radius:12px;" />
            <p style="text-align:center;font-size:0.8rem;color:#64748b;margin:8px 0 0;">
              Compressed: ${sizeKB} KB
            </p>`;
  } else if (preview.type === 'video') {
    html = `<video controls preload="metadata" style="width:100%;max-width:400px;border-radius:12px;">
              <source src="${preview.url}" type="${selectedFile.type}">
            </video>`;
  } else if (preview.type === 'audio') {
    html = `<div class="audio-preview">
              <audio controls><source src="${preview.url}" type="${selectedFile.type}"></audio>
              <p>${preview.name}</p>
            </div>`;
  }
  html += `<button class="remove-preview" onclick="clearPreview()">Remove</button>`;
  previewContainer.innerHTML = html;
}

window.clearPreview = () => {
  selectedFile = preview = compressedBlob = null;
  previewContainer.style.display = 'none';
  defaultUpload.style.display = 'block';
  uploadBtn.style.display = 'none';
  previewContainer.innerHTML = '';
  fileInput.value = '';
};

uploadBtn.addEventListener('click', () => {
  if (!selectedFile || !preview) return;

  const finalBlob = compressedBlob || selectedFile;
  const dataUrl = preview.url;

  const newItem = {
    id: Date.now(),
    type: preview.type,
    url: dataUrl,
    title: preview.name.split('.').slice(0, -1).join('.') || `Media ${mediaItems.length + 1}`
  };
  mediaItems.unshift(newItem);
  renderGallery();
  clearPreview();
  alert('Media uploaded successfully!');
});

// Initialize
renderGallery();


    //Login Section
// === FIXED & BULLETPROOF LOGIN / SIGNUP TOGGLE ===
const isLogin = { value: true };

const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const headerTitle = document.getElementById('headerTitle');
const headerSubtitle = document.getElementById('headerSubtitle');
const signupFields = document.getElementById('signupFields');
const loginOptions = document.getElementById('loginOptions');
const submitBtn = document.getElementById('submitBtn');
const switchLink = document.getElementById('switchLink'); // This button stays in DOM
const messageBox = document.getElementById('messageBox');
const togglePass = document.getElementById('togglePass');
const passwordInput = document.querySelector('input[name="password"]');

function setMode(login) {
  isLogin.value = login;

  // Tabs
  loginTab.classList.toggle('active', login);
  signupTab.classList.toggle('active', !login);

  // Header text
  headerTitle.textContent = login ? 'Welcome Back' : 'Join Team K’abisai';
  headerSubtitle.textContent = login 
    ? 'Log in to access your dashboard' 
    : 'Create an account to get started';

  // Show/hide fields
  signupFields.style.display = login ? 'none' : 'block';
  loginOptions.style.display = login ? 'flex' : 'none';

  // Button text
  submitBtn.textContent = login ? 'Login to Dashboard' : 'Create Account';

  // Footer link text (only change text, NOT the whole HTML!)
  switchLink.textContent = login ? 'Sign up' : 'Log in';
  switchLink.previousSibling.textContent = login 
    ? "Don't have an account? " 
    : 'Already have an account? ';

  messageBox.style.display = 'none';
}

// === EVENT LISTENERS (ALL WORKING NOW) ===
loginTab.onclick = () => setMode(true);
signupTab.onclick = () => setMode(false);

// This button NEVER gets replaced → event stays alive
switchLink.onclick = () => setMode(!isLogin.value);

// Show/Hide Password
togglePass.onclick = () => {
  const isPassword = passwordInput.type === 'password';
  passwordInput.type = isPassword ? 'text' : 'password';
  togglePass.textContent = isPassword ? 'Hide' : 'Show';
};

// Form Submit
document.getElementById('authForm').onsubmit = async (e) => {
  e.preventDefault();

  submitBtn.classList.add('loading');
  submitBtn.innerHTML = `<span class="spinner"></span> ${isLogin.value ? 'Logging in...' : 'Creating account...'}`;
  submitBtn.disabled = true;

  await new Promise(r => setTimeout(r, 1500));

  submitBtn.classList.remove('loading');
  submitBtn.disabled = false;
  submitBtn.innerHTML = isLogin.value ? 'Login to Dashboard' : 'Create Account';

  messageBox.className = 'message success';
  messageBox.textContent = isLogin.value
    ? 'Login successful! Redirecting...'
    : 'Account created! Please log in.';
  messageBox.style.display = 'block';

  if (!isLogin.value) {
    setMode(true);
    e.target.reset();
  }

  setTimeout(() => messageBox.style.display = 'none', 3000);
};





    //Admin Dashboard
    // === EXACT SAME LOGIC AS YOUR REACT DASHBOARD ===
    let stats = {
      volunteers: 8421,
      issues: 342
    };

    const volunteersEl = document.getElementById('volunteersCount');
    const issuesEl = document.getElementById('issuesCount');

    // Live updates every 10 seconds
    setInterval(() => {
      stats.volunteers += Math.floor(Math.random() * 5);
      stats.issues = Math.max(0, stats.issues + (Math.random() > 0.5 ? -1 : 1));

      volunteersEl.textContent = stats.volunteers.toLocaleString();
      issuesEl.textContent = stats.issues;
    }, 10000);

    // Export CSV
    document.getElementById('exportBtn').addEventListener('click', () => {
      const date = new Date().toISOString().split('T')[0];
      const csv = `Metric,Value,Change\nVolunteers,${stats.volunteers},+12.3%\nDonations,Ksh 12,400,000,+8.7%\nIssues,${stats.issues},-5.1%`;
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Kabisa2027_Dashboard_${date}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    });


    //Footer Update Year
    // Auto update year
    document.getElementById('year').textContent = new Date().getFullYear();