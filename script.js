// ─── BOOT SEQUENCE ───────────────────────────────
(function () {
  const overlay = document.getElementById('bootOverlay');
  const bar = document.getElementById('bootBar');
  const lines = ['b0', 'b1', 'b2', 'b3'];
  if (!overlay) return;

  function hideOverlay() {
    overlay.style.opacity = '0';
    setTimeout(() => { overlay.style.display = 'none'; }, 700);
  }

  let i = 0;
  function showNext() {
    if (i < lines.length) {
      const el = document.getElementById(lines[i]);
      if (el) el.classList.add('visible');
      if (bar) bar.style.width = ((i + 1) / lines.length * 100) + '%';
      i++;
      setTimeout(showNext, 400);
    } else {
      setTimeout(hideOverlay, 400);
    }
  }

  setTimeout(showNext, 300);
  // Fallback absolu — disparaît après 5s quoi qu'il arrive
  setTimeout(hideOverlay, 5000);
})();

// ─── CUSTOM CURSOR ───────────────────────────────
const cursor = document.getElementById('cursor');
if (cursor) {
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
}

// ─── SCROLL PROGRESS ─────────────────────────────
const progressBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  if (!progressBar) return;
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  progressBar.style.width = pct + '%';
});

// ─── ACTIVE NAV ──────────────────────────────────
const navItems = document.querySelectorAll('#navLinks li');
const sectionIds = ['about', 'skills', 'experience', 'projects', 'architecture', 'certifications', 'education', 'cv', 'contact'];
window.addEventListener('scroll', () => {
  let current = '';
  sectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 200) current = id;
  });
  navItems.forEach((li, idx) => {
    li.classList.toggle('active', sectionIds[idx] === current);
  });
});

// ─── PARTICLES ───────────────────────────────────
const canvas = document.getElementById('particles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W, H;
  const particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * 9999, y: Math.random() * 9999,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5
    });
  }

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x % W, p.y % H, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,212,255,0.4)';
      ctx.fill();
    });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = (particles[i].x % W) - (particles[j].x % W);
        const dy = (particles[i].y % H) - (particles[j].y % H);
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x % W, particles[i].y % H);
          ctx.lineTo(particles[j].x % W, particles[j].y % H);
          ctx.strokeStyle = `rgba(0,212,255,${(1 - dist / 120) * 0.15})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(drawParticles);
  }
  drawParticles();
}

// ─── TYPEWRITER ──────────────────────────────────
const tw = document.getElementById('typewriterText');
if (tw) {
  const phrases = [
    'SysAdmin · Network · Security',
    'Proxmox · AWS · Docker · Ansible',
    'Hardening ANSSI/CIS · PKI · VPN',
    'Disponible en alternance Sep. 2026'
  ];
  let pi = 0, ci = 0, deleting = false;

  function typewrite() {
    const phrase = phrases[pi];
    if (!deleting) {
      tw.textContent = phrase.slice(0, ci + 1);
      ci++;
      if (ci === phrase.length) { deleting = true; setTimeout(typewrite, 1800); return; }
    } else {
      tw.textContent = phrase.slice(0, ci - 1);
      ci--;
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(typewrite, deleting ? 40 : 80);
  }
  setTimeout(typewrite, 1800);
}

// ─── REVEAL ON SCROLL ────────────────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(el => {
    if (el.isIntersecting) {
      el.target.style.opacity = '1';
      el.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  revealObserver.observe(el);
});

// ─── SKILL BARS ON SCROLL ────────────────────────
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-bar-fill').forEach((bar, i) => {
        const w = bar.dataset.width;
        setTimeout(() => {
          bar.classList.add('animated');
          bar.style.transform = `scaleX(${w / 100})`;
        }, i * 120);
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-bar-container').forEach(el => barObserver.observe(el));

// ─── TERMINAL ANIMATION ──────────────────────────
const termCmd = document.getElementById('termCmd');
const termOutput = document.getElementById('termOutput');

if (termCmd && termOutput) {
  const commands = [
    { cmd: 'proxmox-ve --cluster-status', out: '✓ Cluster HA actif — 3 nœuds opérationnels' },
    { cmd: 'ansible-playbook hardening.yml', out: '✓ 47 tâches exécutées — ANSSI/CIS compliant' },
    { cmd: 'aws ec2 describe-vpcs --region eu-west-1', out: '✓ VPC configuré — Tunnel VPN site-à-site actif' },
    { cmd: 'openssl req -newkey rsa:4096 -x509', out: '✓ Certificat PKI généré — CN=njoya.network' },
  ];
  let tIdx = 0, tChar = 0, tPhase = 'typing';

  function runTerminal() {
    const current = commands[tIdx];
    if (tPhase === 'typing') {
      termCmd.textContent = current.cmd.slice(0, tChar + 1);
      tChar++;
      if (tChar >= current.cmd.length) { tPhase = 'output'; setTimeout(runTerminal, 500); return; }
    } else if (tPhase === 'output') {
      termOutput.style.display = 'block';
      termOutput.textContent = current.out;
      tPhase = 'pause';
      setTimeout(runTerminal, 2000);
      return;
    } else {
      termOutput.style.display = 'none';
      termCmd.textContent = '';
      tChar = 0;
      tIdx = (tIdx + 1) % commands.length;
      tPhase = 'typing';
    }
    setTimeout(runTerminal, 55);
  }

  const termObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { runTerminal(); termObserver.disconnect(); }
  }, { threshold: 0.5 });

  const terminal = document.querySelector('.terminal');
  if (terminal) termObserver.observe(terminal);
}

// ─── ARCHITECTURE TABS ───────────────────────────
document.querySelectorAll('.arch-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.arch-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.arch-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const target = document.getElementById(tab.dataset.panel);
    if (target) target.classList.add('active');
  });
});

// ─── CONTACT FORM ────────────────────────────────
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const status = document.getElementById('formStatus');
    const btn = form.querySelector('.form-submit');
    const name    = form.querySelector('[name="name"]').value.trim();
    const email   = form.querySelector('[name="email"]').value.trim();
    const subject = form.querySelector('[name="subject"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();

    if (!name || !email || !message) {
      status.textContent = '⚠ Veuillez remplir tous les champs obligatoires.';
      status.className = 'form-status error';
      return;
    }
    // Fallback mailto
    const body = encodeURIComponent(`Nom: ${name}\n\nMessage:\n${message}`);
    const mailto = `mailto:ahmednjoya98@gmail.com?subject=${encodeURIComponent(subject || 'Contact depuis portfolio')}&body=${body}`;
    btn.textContent = 'Envoi...';
    setTimeout(() => {
      window.location.href = mailto;
      btn.textContent = 'Envoyer →';
      status.textContent = '✓ Votre client mail s\'est ouvert. Message prêt à envoyer !';
      status.className = 'form-status success';
      form.reset();
    }, 600);
  });
}
