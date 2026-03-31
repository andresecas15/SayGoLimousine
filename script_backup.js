document.addEventListener('DOMContentLoaded', () => {
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
                alert('Por favor, completa todos los datos para procesar tu reserva VIP.');
                return;
            }

            // Generación del Mensaje Pre-rellenado para WhatsApp según requerimientos
            // "Hola SayGo Limousine, deseo confirmar mi reserva. Recogida en: [Punto], Destino: [Destino], el día [Fecha] a las [Hora]."
            const message = `Hola SayGo Limousine, deseo confirmar mi reserva. Recogida en: ${pickup}, Destino: ${destination}, el día ${date} a las ${time}. Vehículo: ${vehicle}.`;
            
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
