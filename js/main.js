// Particle Network Animation
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let width, height;
let particles = [];

// Configuration
const particleCount = 60; // Few particles for discreet look
const connectionDistance = 150;
const moveSpeed = 0.5;

// Colors from CSS
const colors = ['#008FBB', '#EA4B71', '#475569'];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * moveSpeed;
        this.vy = (Math.random() - 0.5) * moveSpeed;
        this.size = Math.random() * 2 + 1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        p.update();
        p.draw();

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
            let p2 = particles[j];
            let dx = p.x - p2.x;
            let dy = p.y - p2.y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < connectionDistance) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(100, 116, 139, ${1 - dist / connectionDistance})`; // Muted slate color
                ctx.lineWidth = 0.5;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    resize();
    initParticles();
});

// Init
resize();
initParticles();
animate();


document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const btn = this.querySelector('.btn-submit');
    const originalText = btn.innerText;
    const successMsg = document.getElementById('successMsg');
    const errorMsg = document.getElementById('errorMsg');

    successMsg.style.display = 'none';
    errorMsg.style.display = 'none';

    btn.innerText = 'ANALYZING...';
    btn.style.opacity = '0.7';
    btn.disabled = true;

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        // Mantive a chave 'problem' conforme a alteração anterior
        problem: document.getElementById('project_details').value
    };

    const n8nWebhookUrl = 'https://n8n.matheusgodoy.pro/webhook/mg-contato';

    fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
        .then(response => {
            if (response.ok) {
                this.reset();
                successMsg.style.display = 'block';
                setTimeout(() => { successMsg.style.display = 'none'; }, 8000);
            } else {
                throw new Error('Error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            errorMsg.style.display = 'block';
            setTimeout(() => { errorMsg.style.display = 'none'; }, 5000);
        })
        .finally(() => {
            btn.innerText = originalText;
            btn.style.opacity = '1';
            btn.disabled = false;
        });
});

// Observer para animação ao rolar
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // Anima apenas uma vez
        }
    });
}, observerOptions);

// Atualizado para selecionar TODOS os elementos com a classe de animação
const animatedElements = document.querySelectorAll('.fade-in-section');
animatedElements.forEach((el) => observer.observe(el));
