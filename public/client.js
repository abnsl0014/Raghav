// public/client.js

const socket = io();

document.getElementById('bookBtn').addEventListener('click', () => {
    const userId = document.getElementById('userId').value;
    const pickup = parseInt(document.getElementById('pickup').value);
    const dropoff = parseInt(document.getElementById('dropoff').value);
    const vehicleType = document.getElementById('vehicleType').value;

    if (userId && !isNaN(pickup) && !isNaN(dropoff)) {
        fetch('/api/book', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, pickup, dropoff, vehicleType })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                document.getElementById('bookingStatus').innerText = `Booking ID: ${data.booking.id} | Status: ${data.booking.status} | Estimated Cost: $${data.booking.estimatedCost}`;
            }
        });
    } else {
        alert('Please fill all fields correctly.');
    }
});

// Register user with Socket.IO
const userIdInput = document.getElementById('userId');
userIdInput.addEventListener('blur', () => {
    const userId = userIdInput.value;
    if (userId) {
        socket.emit('registerUser', userId);
    }
});

// Listen for booking acceptance
socket.on('bookingAccepted', (booking) => {
    document.getElementById('bookingStatus').innerText = `Booking ID: ${booking.id} | Status: ${booking.status} | Driver Assigned: ${booking.driverId}`;
});

// Listen for status updates
socket.on('statusUpdate', (data) => {
    document.getElementById('driverLocation').innerText = `Booking ID: ${data.bookingId} | Status: ${data.status} | Driver Location: ${data.location}`;
});
