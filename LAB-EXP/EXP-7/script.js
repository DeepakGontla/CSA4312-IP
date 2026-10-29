
"use strict";

/* =====================================================
   1. SAMPLE DATA
   ===================================================== */

const services = [
    {
        id: "haircut",
        name: "Haircut & Styling",
        description: "A personalized haircut and professional styling.",
        price: 500,
        duration: 60,
        icon: "✂️"
    },
    {
        id: "facial",
        name: "Luxury Facial",
        description: "A relaxing facial treatment for glowing skin.",
        price: 1200,
        duration: 60,
        icon: "✨"
    },
    {
        id: "makeup",
        name: "Party Makeup",
        description: "Professional makeup for your special occasion.",
        price: 1800,
        duration: 90,
        icon: "💄"
    },
    {
        id: "manicure",
        name: "Manicure",
        description: "Nail care and a polished, elegant finish.",
        price: 600,
        duration: 60,
        icon: "💅"
    },
    {
        id: "hairspa",
        name: "Hair Spa",
        description: "A nourishing treatment for your hair.",
        price: 1000,
        duration: 60,
        icon: "🧖"
    },
    {
        id: "bridal",
        name: "Bridal Makeup",
        description: "A premium makeup experience for your big day.",
        price: 5000,
        duration: 120,
        icon: "👰"
    }
];

const stylists = [
    {
        id: "s1",
        name: "Ananya",
        speciality: "Hair Styling",
        icon: "👩🏻"
    },
    {
        id: "s2",
        name: "Priya",
        speciality: "Skin & Facial Care",
        icon: "👩🏽"
    },
    {
        id: "s3",
        name: "Meera",
        speciality: "Makeup & Bridal",
        icon: "👩🏼"
    }
];

// Sample business hours: 10 AM to 6 PM.
// The final slot starts at 5 PM and finishes at 6 PM.
const timeSlots = [
    "10:00", "11:00", "12:00", "13:00",
    "14:00", "15:00", "16:00", "17:00"
];

/* =====================================================
   2. LOCAL STORAGE
   ===================================================== */

// These records are saved in this browser for the demo.
// Real multi-user applications need a backend and database.

function loadData(key) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : [];
    } catch (error) {
        console.error("Could not read saved data:", error);
        return [];
    }
}

let bookings = loadData("glowBookings");
let blockedSlots = loadData("glowBlockedSlots");
let feedbackEntries = loadData("glowFeedback");

function saveData() {
    try {
        localStorage.setItem("glowBookings", JSON.stringify(bookings));
        localStorage.setItem("glowBlockedSlots", JSON.stringify(blockedSlots));
        localStorage.setItem("glowFeedback", JSON.stringify(feedbackEntries));
        return true;
    } catch (error) {
        console.error("Could not save data:", error);
        showToast("Could not save changes. Browser storage may be full.");
        return false;
    }
}

/* =====================================================
   3. GENERAL HELPER FUNCTIONS
   ===================================================== */

// Find a service using its unique ID.
function getService(id) {
    return services.find(service => service.id === id);
}

// Find a stylist using their unique ID.
function getStylist(id) {
    return stylists.find(stylist => stylist.id === id);
}

// Format a date without UTC conversion shifting the day.
function formatDate(dateString) {
    if (!dateString) return "";

    const parts = dateString.split("-").map(Number);
    const date = new Date(parts[0], parts[1] - 1, parts[2]);

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

// Today's date in local YYYY-MM-DD format.
function todayString() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

// Determine whether an appointment is in the past.
function isPast(booking) {
    const start = new Date(`${booking.date}T${booking.time}:00`);
    return start.getTime() < Date.now();
}

// Convert 24-hour time into readable time.
function formatTime(time) {
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return date.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit"
    });
}

// Escape text before inserting user-provided values into HTML.
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

// Show a temporary notification.
let toastTimer;

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

/* =====================================================
   4. DISPLAY SERVICES AND STYLISTS
   ===================================================== */

function renderServices() {
    const serviceList = document.getElementById("service-list");
    const serviceSelect = document.getElementById("service");

    serviceList.innerHTML = services.map(service => `
        <article class="service-card">
            <div class="service-icon">${service.icon}</div>
            <h3>${escapeHTML(service.name)}</h3>
            <p>${escapeHTML(service.description)}</p>

            <div class="card-bottom">
                <span class="price">₹${service.price}</span>
                <button class="btn btn-small"
                        type="button"
                        data-service="${service.id}">
                    Book Now
                </button>
            </div>

            <p>Duration: ${service.duration} minutes</p>
        </article>
    `).join("");

    serviceSelect.innerHTML =
        '<option value="">Choose a service</option>' +
        services.map(service => `
            <option value="${service.id}">
                ${escapeHTML(service.name)} — ₹${service.price}
            </option>
        `).join("");
}

function renderStylists() {
    const stylistList = document.getElementById("stylist-list");
    const stylistSelect = document.getElementById("stylist");
    const blockStylist = document.getElementById("block-stylist");

    stylistList.innerHTML = stylists.map(stylist => `
        <article class="stylist-card">
            <div class="stylist-avatar">${stylist.icon}</div>
            <h3>${escapeHTML(stylist.name)}</h3>
            <p class="stylist-speciality">
                ${escapeHTML(stylist.speciality)}
            </p>
            <p>Available by appointment.</p>
            <button class="btn btn-small"
                    type="button"
                    data-stylist="${stylist.id}">
                Choose Stylist
            </button>
        </article>
    `).join("");

    const options = stylists.map(stylist => `
        <option value="${stylist.id}">
            ${escapeHTML(stylist.name)} — ${escapeHTML(stylist.speciality)}
        </option>
    `).join("");

    stylistSelect.innerHTML =
        '<option value="">Choose a stylist</option>' + options;

    blockStylist.innerHTML = options;
}

/* =====================================================
   5. PRICING AND PAYMENT AMOUNT
   ===================================================== */

function getPaymentAmounts(service, paymentType) {
    const total = service.price;

    // A deposit is 30% of the service price.
    const amountDue = paymentType === "deposit"
        ? Math.round(total * 0.30)
        : total;

    return {
        total,
        amountDue,
        remaining: total - amountDue
    };
}

function updatePriceSummary() {
    const service = getService(
        document.getElementById("service").value
    );

    const paymentType = document.getElementById("payment-type").value;
    const summary = document.getElementById("price-summary");

    if (!service) {
        summary.textContent = "Select a service to see the price.";
        return;
    }

    const amounts = getPaymentAmounts(service, paymentType);

    summary.innerHTML = `
        Service: ${escapeHTML(service.name)}<br>
        Total price: ₹${amounts.total}<br>
        Amount due: ₹${amounts.amountDue}<br>
        Remaining balance: ₹${amounts.remaining}
    `;
}

/* =====================================================
   6. APPOINTMENT AVAILABILITY
   ===================================================== */

// Find out if a slot is unavailable because it is booked,
// blocked, outside opening hours, or in the past.
function isSlotUnavailable(stylistId, date, time, excludeId = null) {
    const selectedDate = new Date(`${date}T00:00:00`);

    // This demo closes on Sundays.
    if (selectedDate.getDay() === 0) return true;

    const appointmentStart = new Date(`${date}T${time}:00`);

    // Do not offer times that have already passed.
    if (appointmentStart.getTime() <= Date.now()) return true;

    // Do not offer manually blocked slots.
    const isBlocked = blockedSlots.some(slot =>
        slot.stylistId === stylistId &&
        slot.date === date &&
        slot.time === time
    );

    if (isBlocked) return true;

    // A stylist cannot have two overlapping appointments.
    const service = getService(
        document.getElementById("service").value
    );

    const requestedDuration = service ? service.duration : 60;
    const requestedEnd = appointmentStart.getTime()
        + requestedDuration * 60 * 1000;

    return bookings.some(booking => {
        if (booking.id === excludeId) return false;
        if (booking.status === "cancelled") return false;
        if (booking.stylistId !== stylistId) return false;
        if (booking.date !== date) return false;

        const existingService = getService(booking.serviceId);
        const existingDuration = existingService
            ? existingService.duration
            : 60;

        const existingStart = new Date(
            `${booking.date}T${booking.time}:00`
        ).getTime();

        const existingEnd = existingStart
            + existingDuration * 60 * 1000;

        return appointmentStart.getTime() < existingEnd &&
               existingStart < requestedEnd;
    });
}

function renderTimeSlots() {
    const serviceId = document.getElementById("service").value;
    const stylistId = document.getElementById("stylist").value;
    const date = document.getElementById("booking-date").value;
    const container = document.getElementById("time-slots");
    const selectedTimeInput = document.getElementById("selected-time");

    selectedTimeInput.value = "";

    if (!serviceId || !stylistId || !date) {
        container.innerHTML =
            '<p class="muted">Select a service, stylist and date first.</p>';
        return;
    }

    const selectedDate = new Date(`${date}T00:00:00`);

    if (selectedDate.getDay() === 0) {
        container.innerHTML =
            '<p class="muted">The salon is closed on Sundays.</p>';
        return;
    }

    container.innerHTML = timeSlots.map(time => {
        const unavailable = isSlotUnavailable(stylistId, date, time);

        return `
            <button type="button"
                    class="time-slot"
                    data-time="${time}"
                    ${unavailable ? "disabled" : ""}>
                ${formatTime(time)}
                ${unavailable ? " · Unavailable" : ""}
            </button>
        `;
    }).join("");

    if (!timeSlots.some(time =>
        !isSlotUnavailable(stylistId, date, time)
    )) {
        container.innerHTML +=
            '<p class="muted">No slots are available on this date.</p>';
    }
}

/* =====================================================
   7. CREATE A NEW RESERVATION
   ===================================================== */

document.getElementById("booking-form").addEventListener("submit", event => {
    event.preventDefault();

    const name = document.getElementById("customer-name").value.trim();
    const email = document.getElementById("customer-email").value
        .trim().toLowerCase();
    const phone = document.getElementById("customer-phone").value.trim();
    const serviceId = document.getElementById("service").value;
    const stylistId = document.getElementById("stylist").value;
    const date = document.getElementById("booking-date").value;
    const time = document.getElementById("selected-time").value;
    const paymentMethod = document.getElementById("payment-method").value;
    const paymentType = document.getElementById("payment-type").value;
    const notes = document.getElementById("notes").value.trim();

    const service = getService(serviceId);

    if (!name || !email || !phone || !service || !stylistId || !date || !time) {
        showToast("Please complete every required booking field.");
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast("Please enter a valid email address.");
        return;
    }

    if (!/^[+()\d\s-]{7,20}$/.test(phone)) {
        showToast("Please enter a valid phone number.");
        return;
    }

    if (isSlotUnavailable(stylistId, date, time)) {
        showToast("That time is no longer available. Choose another slot.");
        renderTimeSlots();
        return;
    }

    const amounts = getPaymentAmounts(service, paymentType);

    const booking = {
        id: "BK" + Date.now() + Math.random().toString(36).slice(2, 6),
        name,
        email,
        phone,
        serviceId,
        stylistId,
        date,
        time,
        paymentMethod,
        paymentType,
        total: amounts.total,
        amountDue: amounts.amountDue,
        remaining: amounts.remaining,
        paymentStatus: paymentMethod === "salon"
            ? "Pay at salon"
            : "Not paid",
        notes,
        status: "confirmed",
        createdAt: new Date().toISOString()
    };

    bookings.push(booking);

    if (!saveData()) {
        bookings.pop();
        return;
    }

    event.target.reset();
    document.getElementById("booking-date").min = todayString();
    document.getElementById("block-date").min = todayString();

    document.getElementById("selected-time").value = "";
    renderTimeSlots();
    updatePriceSummary();
    renderCalendar();
    renderManager();
    showToast(`Appointment ${booking.id} created successfully.`);

    // Load the new booking in the customer's dashboard.
    document.getElementById("dashboard-email").value = email;
    renderCustomerDashboard(email);

    document.getElementById("dashboard").scrollIntoView({
        behavior: "smooth"
    });
});

/* =====================================================
   8. CUSTOMER DASHBOARD
   ===================================================== */

function createBookingCard(booking, allowActions = true) {
    const service = getService(booking.serviceId);
    const stylist = getStylist(booking.stylistId);

    const statusClass = booking.status === "cancelled"
        ? "cancelled"
        : isPast(booking)
            ? "completed"
            : "confirmed";

    const statusText = booking.status === "cancelled"
        ? "Cancelled"
        : isPast(booking)
            ? "Past appointment"
            : "Confirmed";

    return `
        <article class="booking-card">
            <p><strong>${escapeHTML(service?.name || "Service")}</strong></p>
            <p>Booking ID: ${escapeHTML(booking.id)}</p>
            <p>Date: ${formatDate(booking.date)}</p>
            <p>Time: ${formatTime(booking.time)}</p>
            <p>Stylist: ${escapeHTML(stylist?.name || "Stylist")}</p>
            <p>Total: ₹${Number(booking.total)}</p>
            <p>Payment: ${escapeHTML(booking.paymentStatus || "Not paid")}</p>
            <p>Status: <span class="status ${statusClass}">
                ${statusText}
            </span></p>

            ${booking.notes
                ? `<p>Requests: ${escapeHTML(booking.notes)}</p>`
                : ""}

            ${allowActions && booking.status !== "cancelled" && !isPast(booking)
                ? `
                    <button class="btn btn-small"
                            type="button"
                            data-cancel="${escapeHTML(booking.id)}">
                        Cancel
                    </button>
                    <button class="btn btn-small btn-secondary"
                            type="button"
                            data-edit="${escapeHTML(booking.id)}">
                        Reschedule
                    </button>
                `
                : ""}
        </article>
    `;
}

function renderCustomerDashboard(email) {
    const customerBookings = bookings.filter(
        booking => booking.email === email
    );

    const upcoming = customerBookings.filter(booking =>
        booking.status !== "cancelled" && !isPast(booking)
    );

    const history = customerBookings.filter(booking =>
        booking.status === "cancelled" || isPast(booking)
    );

    const customerDetails = document.getElementById("customer-details");

    if (customerBookings.length === 0) {
        customerDetails.innerHTML =
            '<p class="empty-message">No reservations found for this email.</p>';
    } else {
        const firstBooking = customerBookings[0];

        customerDetails.innerHTML = `
            <div class="booking-card">
                <h3>Customer Information</h3>
                <p>Name: ${escapeHTML(firstBooking.name)}</p>
                <p>Email: ${escapeHTML(firstBooking.email)}</p>
                <p>Phone: ${escapeHTML(firstBooking.phone)}</p>
                <p>Total reservations: ${customerBookings.length}</p>
            </div>
        `;
    }

    document.getElementById("upcoming-bookings").innerHTML =
        upcoming.length
            ? upcoming.map(booking => createBookingCard(booking)).join("")
            : '<p class="empty-message">No upcoming reservations.</p>';

    document.getElementById("past-bookings").innerHTML =
        history.length
            ? history.map(booking => createBookingCard(booking, false)).join("")
            : '<p class="empty-message">No reservation history yet.</p>';

    const completedBookings = customerBookings.filter(booking =>
        booking.status !== "cancelled" && isPast(booking)
    );

    document.getElementById("feedback-booking").innerHTML =
        '<option value="">Choose a completed appointment</option>' +
        completedBookings.map(booking => `
            <option value="${escapeHTML(booking.id)}">
                ${escapeHTML(booking.id)} — ${formatDate(booking.date)}
            </option>
        `).join("");

    renderFeedback(email);
}

document.getElementById("dashboard-form").addEventListener("submit", event => {
    event.preventDefault();

    const email = document.getElementById("dashboard-email").value
        .trim().toLowerCase();

    renderCustomerDashboard(email);
});

/* =====================================================
   9. CANCEL AND RESCHEDULE RESERVATIONS
   ===================================================== */

function refreshAllViews() {
    saveData();

    renderCalendar();
    renderManager();

    const email = document.getElementById("dashboard-email").value
        .trim().toLowerCase();

    if (email) renderCustomerDashboard(email);

    renderTimeSlots();
}

function cancelBooking(id) {
    const booking = bookings.find(item => item.id === id);

    if (!booking || booking.status === "cancelled") return;

    if (isPast(booking)) {
        showToast("Past appointments cannot be cancelled in this demo.");
        return;
    }

    if (!confirm(`Cancel reservation ${id}?`)) return;

    booking.status = "cancelled";
    refreshAllViews();
    showToast("Reservation cancelled.");
}

function rescheduleBooking(id) {
    const booking = bookings.find(item => item.id === id);

    if (!booking || booking.status === "cancelled" || isPast(booking)) {
        showToast("This reservation cannot be rescheduled.");
        return;
    }

    const newDate = prompt(
        "Enter the new date (YYYY-MM-DD):",
        booking.date
    );

    if (newDate === null) return;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
        showToast("Use the date format YYYY-MM-DD.");
        return;
    }

    const parsedDate = new Date(`${newDate}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime()) ||
        parsedDate.toISOString().slice(0, 10) !== newDate ||
        newDate < todayString()) {
        showToast("Choose a valid current or future date.");
        return;
    }

    const newTime = prompt(
        "Enter the new time (HH:MM), for example 14:00:",
        booking.time
    );

    if (newTime === null) return;

    if (!timeSlots.includes(newTime)) {
        showToast("Choose an available business-hours time slot.");
        return;
    }

    // Temporarily exclude this booking when checking its new slot.
    const oldDate = booking.date;
    const oldTime = booking.time;

    booking.date = newDate;
    booking.time = newTime;

    if (isSlotUnavailable(
        booking.stylistId,
        newDate,
        newTime,
        booking.id
    )) {
        booking.date = oldDate;
        booking.time = oldTime;
        showToast("That slot is unavailable. Try another date or time.");
        return;
    }

    if (!saveData()) {
        booking.date = oldDate;
        booking.time = oldTime;
        return;
    }

    refreshAllViews();
    showToast("Reservation rescheduled.");
}

/* =====================================================
   10. RESERVATIONS CALENDAR
   ===================================================== */

let calendarDate = new Date();
let selectedCalendarDate = todayString();

function renderCalendar() {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    document.getElementById("calendar-month").textContent =
        calendarDate.toLocaleDateString("en-IN", {
            month: "long",
            year: "numeric"
        });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const container = document.getElementById("calendar-days");

    let html = "";

    for (let i = 0; i < firstDay; i++) {
        html += '<div class="calendar-day empty"></div>';
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const date =
            `${year}-${String(month + 1).padStart(2, "0")}-` +
            String(day).padStart(2, "0");

        const hasBookings = bookings.some(booking =>
            booking.date === date && booking.status !== "cancelled"
        );

        const classes = [
            "calendar-day",
            date === todayString() ? "today" : "",
            date === selectedCalendarDate ? "selected" : "",
            hasBookings ? "has-bookings" : ""
        ].filter(Boolean).join(" ");

        html += `
            <button type="button"
                    class="${classes}"
                    data-calendar-date="${date}"
                    aria-label="${date}${hasBookings ? ", has reservations" : ""}">
                ${day}
            </button>
        `;
    }

    container.innerHTML = html;
    renderCalendarAppointments(selectedCalendarDate);
}

function renderCalendarAppointments(date) {
    document.getElementById("calendar-selected-date").textContent =
        formatDate(date);

    const dailyBookings = bookings.filter(booking =>
        booking.date === date && booking.status !== "cancelled"
    ).sort((a, b) => a.time.localeCompare(b.time));

    const container = document.getElementById("calendar-appointments");

    container.innerHTML = dailyBookings.length
        ? dailyBookings.map(booking => {
            const service = getService(booking.serviceId);
            const stylist = getStylist(booking.stylistId);

            return `
                <div class="appointment-item">
                    <p><strong>${formatTime(booking.time)} —
                        ${escapeHTML(booking.name)}</strong></p>
                    <p>${escapeHTML(service?.name || "Service")}</p>
                    <p>Stylist: ${escapeHTML(stylist?.name || "Stylist")}</p>
                    <p>Booking: ${escapeHTML(booking.id)}</p>
                </div>
            `;
        }).join("")
        : '<p class="empty-message">No reservations for this date.</p>';
}

document.getElementById("prev-month").addEventListener("click", () => {
    calendarDate.setMonth(calendarDate.getMonth() - 1);
    renderCalendar();
});

document.getElementById("next-month").addEventListener("click", () => {
    calendarDate.setMonth(calendarDate.getMonth() + 1);
    renderCalendar();
});

/* =====================================================
   11. MANAGER: BLOCK UNAVAILABLE HOURS
   ===================================================== */

document.getElementById("block-form").addEventListener("submit", event => {
    event.preventDefault();

    const stylistId = document.getElementById("block-stylist").value;
    const date = document.getElementById("block-date").value;
    const time = document.getElementById("block-time").value;
    const reason = document.getElementById("block-reason").value.trim();

    if (!date || date < todayString()) {
        showToast("Choose a current or future date.");
        return;
    }

    if (isSlotUnavailable(stylistId, date, time)) {
        showToast("This slot is already booked, blocked or unavailable.");
        return;
    }

    blockedSlots.push({
        id: "BL" + Date.now(),
        stylistId,
        date,
        time,
        reason
    });

    if (!saveData()) {
        blockedSlots.pop();
        return;
    }

    event.target.reset();
    document.getElementById("block-date").min = todayString();

    renderBlockedSlots();
    renderTimeSlots();
    renderCalendar();
    renderManager();

    showToast("Unavailable time slot blocked.");
});

function renderBlockedSlots() {
    const container = document.getElementById("blocked-list");

    if (!blockedSlots.length) {
        container.innerHTML =
            '<p class="empty-message">No blocked slots.</p>';
        return;
    }

    container.innerHTML = blockedSlots.map(slot => `
        <div class="blocked-item">
            <p>
                <strong>${escapeHTML(getStylist(slot.stylistId)?.name || "Stylist")}</strong>
                — ${formatDate(slot.date)} at ${formatTime(slot.time)}
            </p>
            <p>${escapeHTML(slot.reason || "Unavailable")}</p>
            <button class="btn btn-small btn-secondary"
                    type="button"
                    data-unblock="${escapeHTML(slot.id)}">
                Unblock
            </button>
        </div>
    `).join("");
}

/* =====================================================
   12. MANAGER: RESERVATION MANAGEMENT
   ===================================================== */

function getBookingCategory(booking) {
    if (booking.status === "cancelled") return "cancelled";
    return isPast(booking) ? "completed" : "upcoming";
}

function renderManager() {
    const active = bookings.filter(b => b.status !== "cancelled");

    document.getElementById("total-count").textContent = bookings.length;
    document.getElementById("upcoming-count").textContent =
        active.filter(b => !isPast(b)).length;
    document.getElementById("cancelled-count").textContent =
        bookings.filter(b => b.status === "cancelled").length;

    const search = document.getElementById("manager-search").value
        .trim().toLowerCase();

    const filter = document.getElementById("manager-filter").value;

    const filtered = bookings.filter(booking => {
        const matchesSearch = [
            booking.name,
            booking.email,
            booking.phone,
            booking.id
        ].some(value => String(value).toLowerCase().includes(search));

        return matchesSearch &&
            (filter === "all" || getBookingCategory(booking) === filter);
    }).sort((a, b) =>
        `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)
    );

    const container = document.getElementById("manager-bookings");

    if (!filtered.length) {
        container.innerHTML =
            '<p class="empty-message">No matching reservations.</p>';
        return;
    }

    container.innerHTML = `
        <div class="table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>Customer</th>
                        <th>Service / Stylist</th>
                        <th>Date / Time</th>
                        <th>Status</th>
                        <th>Contact</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${filtered.map(booking => {
                        const service = getService(booking.serviceId);
                        const stylist = getStylist(booking.stylistId);

                        return `
                            <tr>
                                <td>
                                    ${escapeHTML(booking.name)}<br>
                                    ${escapeHTML(booking.email)}<br>
                                    ${escapeHTML(booking.phone)}
                                </td>
                                <td>
                                    ${escapeHTML(service?.name || "Service")}<br>
                                    ${escapeHTML(stylist?.name || "Stylist")}
                                </td>
                                <td>
                                    ${formatDate(booking.date)}<br>
                                    ${formatTime(booking.time)}
                                </td>
                                <td>${escapeHTML(booking.status)}</td>
                                <td>
                                    <a href="tel:${encodeURIComponent(booking.phone)}">
                                        Call
                                    </a>
                                    <br>
                                    <a href="sms:${encodeURIComponent(booking.phone)}">
                                        SMS
                                    </a>
                                </td>
                                <td>
                                    <button class="btn btn-small btn-secondary"
                                            type="button"
                                            data-edit="${escapeHTML(booking.id)}"
                                            ${booking.status === "cancelled" || isPast(booking)
                                                ? "disabled" : ""}>
                                        Edit
                                    </button>
                                    <button class="btn btn-small btn-danger"
                                            type="button"
                                            data-cancel="${escapeHTML(booking.id)}"
                                            ${booking.status === "cancelled" || isPast(booking)
                                                ? "disabled" : ""}>
                                        Cancel
                                    </button>
                                </td>
                            </tr>
                        `;
                    }).join("")}
                </tbody>
            </table>
        </div>
    `;
}

/* =====================================================
   13. CUSTOMER FEEDBACK
   ===================================================== */

document.getElementById("feedback-form").addEventListener("submit", event => {
    event.preventDefault();

    const email = document.getElementById("dashboard-email").value
        .trim().toLowerCase();

    const bookingId = document.getElementById("feedback-booking").value;
    const rating = Number(document.getElementById("feedback-rating").value);
    const message = document.getElementById("feedback-message").value.trim();

    const booking = bookings.find(item =>
        item.id === bookingId &&
        item.email === email &&
        item.status !== "cancelled" &&
        isPast(item)
    );

    if (!booking || !message || rating < 1 || rating > 5) {
        showToast("Select one of your completed appointments.");
        return;
    }

    if (feedbackEntries.some(item => item.bookingId === bookingId)) {
        showToast("Feedback has already been submitted for this appointment.");
        return;
    }

    feedbackEntries.push({
        id: "FB" + Date.now(),
        bookingId,
        email,
        rating,
        message,
        createdAt: new Date().toISOString()
    });

    if (!saveData()) {
        feedbackEntries.pop();
        return;
    }

    event.target.reset();
    renderFeedback(email);
    showToast("Thank you for sharing your feedback!");
});

function renderFeedback(email) {
    const container = document.getElementById("feedback-list");

    const entries = feedbackEntries.filter(item => item.email === email);

    container.innerHTML = entries.length
        ? entries.map(item => `
            <div class="feedback-entry">
                <p><strong>${item.rating}/5 stars</strong></p>
                <p>${escapeHTML(item.message)}</p>
                <p class="muted">Booking: ${escapeHTML(item.bookingId)}</p>
            </div>
        `).join("")
        : '<p class="empty-message">No feedback submitted yet.</p>';
}

/* =====================================================
   14. EVENT DELEGATION
   ===================================================== */

// Handle buttons inside dynamically created cards and tables.
document.addEventListener("click", event => {
    const serviceButton = event.target.closest("[data-service]");
    const stylistButton = event.target.closest("[data-stylist]");
    const timeButton = event.target.closest("[data-time]");
    const cancelButton = event.target.closest("[data-cancel]");
    const editButton = event.target.closest("[data-edit]");
    const unblockButton = event.target.closest("[data-unblock]");
    const calendarButton = event.target.closest("[data-calendar-date]");

    if (serviceButton) {
        document.getElementById("service").value =
            serviceButton.dataset.service;

        updatePriceSummary();
        renderTimeSlots();

        document.getElementById("booking").scrollIntoView({
            behavior: "smooth"
        });
    }

    if (stylistButton) {
        document.getElementById("stylist").value =
            stylistButton.dataset.stylist;

        renderTimeSlots();

        document.getElementById("booking").scrollIntoView({
            behavior: "smooth"
        });
    }

    if (timeButton && !timeButton.disabled) {
        document.querySelectorAll(".time-slot").forEach(button =>
            button.classList.remove("selected")
        );

        timeButton.classList.add("selected");
        document.getElementById("selected-time").value =
            timeButton.dataset.time;
    }

    if (cancelButton) {
        cancelBooking(cancelButton.dataset.cancel);
    }

    if (editButton) {
        rescheduleBooking(editButton.dataset.edit);
    }

    if (unblockButton) {
        const id = unblockButton.dataset.unblock;

        if (confirm("Remove this blocked time slot?")) {
            blockedSlots = blockedSlots.filter(slot => slot.id !== id);

            if (saveData()) {
                renderBlockedSlots();
                renderTimeSlots();
                renderCalendar();
                renderManager();
                showToast("Time slot is available for booking again.");
            }
        }
    }

    if (calendarButton) {
        selectedCalendarDate = calendarButton.dataset.calendarDate;
        renderCalendar();
    }
});

/* =====================================================
   15. LISTEN FOR FORM CHANGES
   ===================================================== */

["service", "stylist", "booking-date"].forEach(id => {
    document.getElementById(id).addEventListener("change", renderTimeSlots);
});

["service", "payment-type"].forEach(id => {
    document.getElementById(id).addEventListener("change", updatePriceSummary);
});

document.getElementById("manager-search").addEventListener("input", renderManager);
document.getElementById("manager-filter").addEventListener("change", renderManager);

/* =====================================================
   16. INITIALIZE THE WEBSITE
   ===================================================== */

document.getElementById("booking-date").min = todayString();
document.getElementById("block-date").min = todayString();

document.getElementById("block-time").innerHTML = timeSlots.map(time => `
    <option value="${time}">${formatTime(time)}</option>
`).join("");

renderServices();
renderStylists();
updatePriceSummary();
renderTimeSlots();
renderCalendar();
renderBlockedSlots();
renderManager();
