// 0. Inicialización de Autocompletado con OpenStreetMap (Nominatim API)
function setupOSMAutocomplete(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;

    // Crear contenedor del menú desplegable
    const dropdown = document.createElement('ul');
    dropdown.className = 'absolute z-50 w-full bg-[#1a1a1a] border border-white/10 rounded-xl mt-2 max-h-60 overflow-y-auto hidden shadow-2xl custom-scrollbar';
    input.parentNode.appendChild(dropdown);

    let debounceTimer;

    input.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        const query = this.value.trim();
        
        if (query.length < 3) {
            dropdown.classList.add('hidden');
            return;
        }

        // Debounce de 500ms para respetar los límites de la API pública de Nominatim
        debounceTimer = setTimeout(async () => {
            try {
                // Búsqueda en formato JSON restringida a Estados Unidos
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=us&limit=5`);
                const data = await response.json();
                
                dropdown.innerHTML = '';
                
                if (data.length > 0) {
                    data.forEach(place => {
                        const li = document.createElement('li');
                        // Extraer solo la parte relevante (nombre principal y ciudad/estado si es posible) o mostrar todo formateado
                        li.className = 'px-4 py-3 hover:bg-gold-500/20 cursor-pointer text-gray-300 hover:text-white transition-colors text-sm border-b border-white/5 last:border-0 flex items-start gap-2';
                        li.innerHTML = `
                            <svg class="w-4 h-4 text-gold-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            <span class="leading-tight">${place.display_name}</span>
                        `;
                        
                        li.addEventListener('click', () => {
                            input.value = place.display_name;
                            dropdown.classList.add('hidden');
                        });
                        dropdown.appendChild(li);
                    });
                    dropdown.classList.remove('hidden');
                } else {
                    dropdown.classList.add('hidden');
                }
            } catch (error) {
                console.error("OSM Autocomplete error:", error);
            }
        }, 500);
    });

    // Cerrar el menú si se hace clic fuera del input o del dropdown
    document.addEventListener('click', function(e) {
        if (!input.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.add('hidden');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar autocompletado en los campos
    setupOSMAutocomplete('pickup');
    setupOSMAutocomplete('destination');

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

    // 2. Lógica de Conversión: Notificación flotante animada
    const waNotification = document.getElementById('wa-notification');
    if (waNotification) {
        // Mostrar la burbuja flotante después de 3 segundos de carga
        setTimeout(() => {
            // Animación de entrada
            waNotification.classList.remove('hidden', 'opacity-0', 'translate-y-4', 'scale-95');
            waNotification.classList.add('opacity-100', 'translate-y-0', 'scale-100');
            
            // Ocultar la burbuja después de 10 segundos para no ser intrusivo
            setTimeout(() => {
                waNotification.classList.add('opacity-0', 'translate-y-4', 'scale-95');
                waNotification.classList.remove('opacity-100', 'translate-y-0', 'scale-100');
                // Remover del DOM visualmente tras la animación
                setTimeout(() => waNotification.classList.add('hidden'), 500);
            }, 10000);
        }, 3000);
    }
});
