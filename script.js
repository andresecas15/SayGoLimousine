// 0. Inicialización de Autocompletado con Google Maps (Places API)
function setupGoogleAutocomplete(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;

    // Crear contenedor del menú desplegable
    const dropdown = document.createElement('ul');
    dropdown.className = 'absolute z-50 w-full bg-[#1a1a1a] border border-white/10 rounded-xl mt-2 max-h-60 overflow-y-auto hidden shadow-2xl custom-scrollbar';
    input.parentNode.appendChild(dropdown);

    let debounceTimer;
    let autocompleteService;

    input.addEventListener('input', function () {
        clearTimeout(debounceTimer);
        const query = this.value.trim();

        if (query.length < 3) {
            dropdown.classList.add('hidden');
            return;
        }

        debounceTimer = setTimeout(() => {
            if (!autocompleteService) {
                if (window.google && window.google.maps && window.google.maps.places) {
                    autocompleteService = new google.maps.places.AutocompleteService();
                } else {
                    console.error("Google Maps API no está cargada o falta places.");
                    return;
                }
            }

            autocompleteService.getPlacePredictions({
                input: query,
                componentRestrictions: { country: 'us' }
            }, (predictions, status) => {
                dropdown.innerHTML = '';

                if (status === google.maps.places.PlacesServiceStatus.OK && predictions && predictions.length > 0) {
                    predictions.forEach(prediction => {
                        const li = document.createElement('li');
                        li.className = 'px-4 py-3 hover:bg-gold-500/20 cursor-pointer text-gray-300 hover:text-white transition-colors text-sm border-b border-white/5 last:border-0 flex items-start gap-2';
                        li.innerHTML = `
                            <svg class="w-4 h-4 text-gold-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            <span class="leading-tight">${prediction.description}</span>
                        `;

                        li.addEventListener('click', () => {
                            input.value = prediction.description;
                            dropdown.classList.add('hidden');
                        });
                        dropdown.appendChild(li);
                    });
                    
                    // Añadir marca de agua de "Powered by Google" (Por términos de servicio)
                    const watermark = document.createElement('li');
                    watermark.className = 'px-4 py-2 text-right bg-[#111] rounded-b-xl border-t border-white/5';
                    watermark.innerHTML = '<img src="https://developers.google.com/maps/documentation/images/powered_by_google_on_non_white.png" alt="Powered by Google" class="h-3 inline-block opacity-70">';
                    dropdown.appendChild(watermark);

                    dropdown.classList.remove('hidden');
                } else {
                    dropdown.classList.add('hidden');
                }
            });
        }, 300);
    });

    // Cerrar el menú si se hace clic fuera del input o del dropdown
    document.addEventListener('click', function (e) {
        if (!input.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.add('hidden');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar autocompletado en los campos
    setupGoogleAutocomplete('pickup');
    setupGoogleAutocomplete('destination');

    // 1. Lógica del Sistema de Reserva y Redirección a WhatsApp
    const bookingForm = document.getElementById('reservation-form');

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Obtener valores de los campos
            const pickup = document.getElementById('pickup').value.trim();
            const destination = document.getElementById('destination').value.trim();
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const vehicle = document.getElementById('vehicle').value;

            // Validación de seguridad (por si el HTML5 validation falla)
            if (!pickup || !destination || !date || !time || !vehicle) {
                alert('Please complete all fields to process your VIP reservation.');
                return;
            }

            // Generación del Mensaje Pre-rellenado para WhatsApp según requerimientos
            const message = `Hello SayGo Limousine, I would like to confirm my reservation. Pickup: ${pickup}, Destination: ${destination}, on ${date} at ${time}. Vehicle: ${vehicle}.`;

            // Número de WhatsApp (Formato internacional sin '+' ni espacios, ej: 17861234567 para Miami)
            const whatsappNumber = '17865550000'; // Reemplazar con el número real de SayGo

            // Codificar el mensaje para la URL
            const encodedMessage = encodeURIComponent(message);

            // Generar enlace WA.me
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

            // Redirección Automática
            window.open(whatsappUrl, '_blank');
        });
    }

    // 2. Lógica de Conversión: Notificación flotante animada tipo Conserje VIP y Carrito 3D
    const waNotification = document.getElementById('wa-notification');
    const typerText = document.getElementById('typer-text');
    const waCar = document.getElementById('wa-3d-car');

    if (waNotification && typerText && waCar) {
        function runConciergeAnimation() {
            // 0. Restablecer estado: Forzamos la desaparición sin animaciones
            waCar.style.transition = "none";
            waCar.classList.remove('translate-x-0', '-translate-x-[200vw]', 'opacity-100');
            waCar.classList.add('translate-x-[150%]', 'opacity-0');
            
            waNotification.style.transition = "none";
            waNotification.classList.remove('opacity-100', 'translate-y-0', 'scale-100', '-translate-x-[200vw]');
            waNotification.classList.add('hidden', 'opacity-0', 'translate-y-4', 'scale-95');
            
            typerText.innerHTML = '<span class="animate-pulse italic">typing...</span>';

            // FORZAR Reflow para que el navegador capte estos "saltos" instantáneos
            void waCar.offsetWidth;
            void waNotification.offsetWidth;

            setTimeout(() => {
                // 1. El carrito maneja desde la derecha
                waCar.style.transition = "transform 1000ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms"; 
                waCar.classList.remove('translate-x-[150%]', 'opacity-0');
                waCar.classList.add('translate-x-0', 'opacity-100');
                
                setTimeout(() => {
                    // 2. Burbuja de chat asoma cuando el auto se detiene
                    waNotification.style.transition = "all 700ms cubic-bezier(0.16, 1, 0.3, 1)"; 
                    waNotification.classList.remove('hidden', 'opacity-0', 'translate-y-4', 'scale-95');
                    waNotification.classList.add('opacity-100', 'translate-y-0', 'scale-100');
                    
                    // 3. Simular escritura veloz y agregar "Palomitas" (Double Tick) de leído
                    setTimeout(() => {
                        typerText.innerHTML = `Your chauffeur awaits... <svg class="inline-block w-4 h-4 ml-0.5 -mt-0.5 text-[#53bdeb]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 12l5 5l10 -10"></path><path d="M2 12l5 5m5 -5l5 -5"></path></svg>`;
                    }, 1000);

                    // 4. El "Arrancón": La SUV se lleva físicamente el mensaje a la izquierda
                    setTimeout(() => {
                        // Sincronización perfecta de velocidades para que parezca que están anclados
                        waCar.style.transition = "transform 1800ms cubic-bezier(0.5, 0, 0.1, 1)";
                        waNotification.style.transition = "transform 1800ms cubic-bezier(0.5, 0, 0.1, 1), opacity 500ms";
                        
                        waCar.classList.remove('translate-x-0');
                        waCar.classList.add('-translate-x-[200vw]');
                        
                        waNotification.classList.add('-translate-x-[200vw]');
                        
                        // 5. Ocultar tras terminar de huir y preparar el bucle
                        setTimeout(() => {
                            waNotification.classList.add('hidden');
                            
                            setTimeout(runConciergeAnimation, 6000); // Aparece nuevamente tras 6 segundos
                        }, 1800);

                    }, 8000); // El mensaje se puede visualizar por 8 segundos
                }, 800);
            }, 100); 
        }

        // Ejecutar por primera vez después de 1 segundo
        setTimeout(runConciergeAnimation, 1000);
    }

    // 3. Sistema de Animación al Hacer Scroll (Intersection Observer 2026 Style)
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target); // Solo se anima una vez para mejorar rendimiento
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: "0px 0px -40px 0px"
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // 4. Iniciar Partículas de Lujo en el Hero (Polvo dorado / Bokeh)
    new LuxuryParticles('luxury-particles');
});

/**
 * Clase Javascript Vainilla para partículas premium ultra-optimizadas.
 * Genera un efecto de polvo dorado etéreo, flotando hacia arriba orgánicamente.
 */
class LuxuryParticles {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d', { alpha: true });
        this.particles = [];
        this.particleCount = window.innerWidth > 768 ? 130 : 50; // Aumentado significativamente

        // Track de Mouse para interacción
        this.mouse = { x: -1000, y: -1000 };
        document.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            // Comprobación rápida para no trackear el mouse si no estamos en el hero
            if (rect.bottom > 0) {
                this.mouse.x = e.clientX - rect.left;
                this.mouse.y = e.clientY - rect.top;
            }
        });

        this.init();
        this.animate();

        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => {
                this.resize();
                this.createParticles();
            }, 250);
        });
    }

    init() {
        this.resize();
        this.createParticles();
    }

    resize() {
        if (!this.canvas.parentElement) return;
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 3.5 + 1.2, // Más grandes (hasta casi 5px)
                vx: (Math.random() - 0.5) * 0.6, // Mayor movimiento lateral
                vy: (Math.random() - 1) * 0.8 - 0.2, // Mayor velocidad vertical
                alpha: Math.random() * 0.6 + 0.3, // Mucho más opacas base
                blinkSpeed: Math.random() * 0.02 + 0.006,
                angle: Math.random() * Math.PI * 2
            });
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let p of this.particles) {
            p.x += p.vx;
            p.y += p.vy;

            // Interaction física (Repulsión del Mouse)
            const dx = this.mouse.x - p.x;
            const dy = this.mouse.y - p.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const interactionRadius = 250;

            if (distance < interactionRadius) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                // Efecto de empuje exponencial suave
                const force = ((interactionRadius - distance) / interactionRadius) * 2.5;
                p.x -= forceDirectionX * force;
                p.y -= forceDirectionY * force;

                // Brillo extra al ser empujadas
                p.alpha = Math.min(1, p.alpha + 0.05);
            }

            p.angle += p.blinkSpeed;
            const currentAlpha = Math.max(0.1, p.alpha + Math.sin(p.angle) * 0.4);

            // Drift infinito
            if (p.y < -30) {
                p.y = this.canvas.height + 30;
                p.x = Math.random() * this.canvas.width;
            }
            if (p.x < -30) p.x = this.canvas.width + 30;
            if (p.x > this.canvas.width + 30) p.x = -30;

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

            // Mayor glow permanente
            this.ctx.shadowBlur = p.radius * 6; // Glow escalable dinámico
            this.ctx.shadowColor = `rgba(212, 175, 55, ${currentAlpha * 0.9})`;

            this.ctx.fillStyle = `rgba(212, 175, 55, ${currentAlpha})`;
            this.ctx.fill();
        }
    }

    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}
