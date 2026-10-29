const KEY = "librahub_data_v1";

const seed = {
    users: [
        {
            id: "u1",
            name: "Demo Student",
            email: "student@college.edu",
            password: "student123",
            role: "student"
        },
        {
            id: "a1",
            name: "Library Admin",
            email: "admin@college.edu",
            password: "admin123",
            role: "admin"
        }
    ],

    books: [
        {
            id: "b1",
            title: "Data Structures & Algorithms",
            author: "Narasimha Karumanchi",
            category: "Computer Science",
            isbn: "9788193245279",
            year: 2024,
            copies: 5,
            available: 4,
            description: "A practical guide to data structures and algorithms."
        },
        {
            id: "b2",
            title: "Clean Code",
            author: "Robert C. Martin",
            category: "Computer Science",
            isbn: "9780132350884",
            year: 2022,
            copies: 3,
            available: 2,
            description: "Principles and practices for writing maintainable software."
        },
        {
            id: "b3",
            title: "Engineering Mathematics",
            author: "B.S. Grewal",
            category: "Mathematics",
            isbn: "9788174091957",
            year: 2023,
            copies: 8,
            available: 8,
            description: "Engineering mathematics reference and problem solving."
        },
        {
            id: "b4",
            title: "Operating System Concepts",
            author: "Silberschatz",
            category: "Computer Science",
            isbn: "9781119456339",
            year: 2021,
            copies: 4,
            available: 4,
            description: "Core concepts of modern operating systems."
        },
        {
            id: "b5",
            title: "The Psychology of Money",
            author: "Morgan Housel",
            category: "Business",
            isbn: "9789390166268",
            year: 2020,
            copies: 2,
            available: 2,
            description: "Timeless lessons on wealth, greed and happiness."
        },
        {
            id: "b6",
            title: "Introduction to Physics",
            author: "David Halliday",
            category: "Physics",
            isbn: "9781118230712",
            year: 2022,
            copies: 6,
            available: 6,
            description: "Fundamental concepts and applications of physics."
        }
    ],

    issues: [
        {
            id: "i1",
            bookId: "b1",
            userId: "u1",
            issueDate: "2026-10-10",
            dueDate: "2026-10-24",
            returnDate: null,
            status: "issued",
            fine: 0
        }
    ],

    materials: [
        {
            id: "m1",
            title: "Data Structures Unit 1 Notes",
            type: "Notes",
            dept: "CSE",
            year: "2",
            sem: "3",
            file: "dsa-unit-1.pdf"
        },
        {
            id: "m2",
            title: "DBMS Previous Year Questions",
            type: "Question Paper",
            dept: "CSE",
            year: "2",
            sem: "4",
            file: "dbms-question-paper.pdf"
        },
        {
            id: "m3",
            title: "Engineering Physics Lab Manual",
            type: "Lab Manual",
            dept: "ECE",
            year: "1",
            sem: "2",
            file: "physics-lab.pdf"
        },
        {
            id: "m4",
            title: "Java Programming Reference",
            type: "Reference",
            dept: "CSE",
            year: "2",
            sem: "3",
            file: "java-reference.pdf"
        }
    ],

    contacts: []
};


let data = loadData();
let currentUser = null;
let currentView = "dashboardView";


/* =========================================================
   BASIC FUNCTIONS
========================================================= */

function loadData() {

    try {

        const saved = localStorage.getItem(KEY);

        return saved
            ? JSON.parse(saved)
            : structuredClone(seed);

    } catch (error) {

        return structuredClone(seed);
    }
}


function save() {

    localStorage.setItem(
        KEY,
        JSON.stringify(data)
    );
}


function $(id) {

    return document.getElementById(id);
}


function esc(value) {

    return String(value ?? "").replace(
        /[&<>"']/g,
        function (char) {

            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            }[char];

        }
    );
}


function toast(message, type = "success") {

    const el = document.createElement("div");

    el.className = `toast ${type}`;

    el.textContent = message;

    $("toast").appendChild(el);

    setTimeout(() => {

        el.remove();

    }, 2600);
}


function initials(name) {

    return (name || "U")
        .split(" ")
        .map(x => x[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}


function today() {

    return new Date()
        .toISOString()
        .slice(0, 10);
}


function fmtDate(value) {

    if (!value) {
        return "—";
    }

    return new Date(value + "T00:00:00")
        .toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
}


function fineFor(issue) {

    if (issue.status === "returned") {

        return Number(issue.fine || 0);
    }

    const daysLate = Math.max(
        0,
        Math.floor(
            (
                new Date() -
                new Date(issue.dueDate + "T00:00:00")
            ) / 86400000
        )
    );

    return daysLate * 5;
}


function book(id) {

    return data.books.find(
        x => x.id === id
    );
}


function user(id) {

    return data.users.find(
        x => x.id === id
    );
}


/* =========================================================
   MODALS
========================================================= */

function openModal(id) {

    $(id).classList.remove("hidden");
}


function closeModal(id) {

    $(id).classList.add("hidden");
}


document.addEventListener(
    "click",
    function (event) {

        const close =
            event.target.closest("[data-close]");

        if (close) {

            closeModal(close.dataset.close);
        }

        const nav =
            event.target.closest("[data-view]");

        if (
            nav &&
            currentUser
        ) {

            showView(nav.dataset.view);
        }
    }
);


/* =========================================================
   LANDING PAGE BUTTONS
========================================================= */

$("openLoginBtn").onclick = function () {

    openModal("loginModal");
};


$("heroLoginBtn").onclick = function () {

    openModal("loginModal");
};


$("openRegisterBtn").onclick = function () {

    closeModal("loginModal");

    openModal("registerModal");
};


$("backToLoginBtn").onclick = function () {

    closeModal("registerModal");

    openModal("loginModal");
};


$("heroBrowseBtn").onclick = function () {

    openModal("loginModal");
};


/* =========================================================
   DEMO LOGIN
========================================================= */

$("fillStudent").onclick = function () {

    $("loginEmail").value =
        "student@college.edu";

    $("loginPassword").value =
        "student123";
};


$("fillAdmin").onclick = function () {

    $("loginEmail").value =
        "admin@college.edu";

    $("loginPassword").value =
        "admin123";
};


/* =========================================================
   LOGIN
========================================================= */

$("loginForm").onsubmit = function (event) {

    event.preventDefault();

    const email =
        $("loginEmail").value
            .trim()
            .toLowerCase();

    const password =
        $("loginPassword").value;

    const foundUser =
        data.users.find(
            x =>
                x.email.toLowerCase() === email &&
                x.password === password
        );


    if (!foundUser) {

        toast(
            "Invalid email or password",
            "error"
        );

        return;
    }


    currentUser = foundUser;

    closeModal("loginModal");

    $("landingPage")
        .classList.add("hidden");

    $("app")
        .classList.remove("hidden");


    buildNav();

    refreshUserUI();

    showView("dashboardView");


    toast(
        `Welcome, ${currentUser.name.split(" ")[0]}!`
    );
};


/* =========================================================
   REGISTER
========================================================= */

$("registerForm").onsubmit = function (event) {

    event.preventDefault();

    const name =
        $("regName").value.trim();

    const email =
        $("regEmail").value
            .trim()
            .toLowerCase();

    const password =
        $("regPassword").value;


    if (
        !name ||
        !email ||
        !password
    ) {

        toast(
            "Please fill all fields",
            "error"
        );

        return;
    }


    if (
        data.users.some(
            u =>
                u.email.toLowerCase() === email
        )
    ) {

        toast(
            "Email already registered",
            "error"
        );

        return;
    }


    const newUser = {

        id: "u" + Date.now(),

        name,

        email,

        password,

        role: "student"
    };


    data.users.push(newUser);

    save();


    closeModal("registerModal");

    openModal("loginModal");

    $("loginEmail").value = email;

    toast(
        "Account created. Please sign in."
    );
};


/* =========================================================
   LOGOUT
========================================================= */

$("logoutBtn").onclick = function () {

    currentUser = null;

    $("app")
        .classList.add("hidden");

    $("landingPage")
        .classList.remove("hidden");
};


/* =========================================================
   MOBILE MENU
========================================================= */

$("mobileMenuBtn").onclick = function () {

    document
        .querySelector(".sidebar")
        .classList.toggle("open");
};


/* =========================================================
   NAVIGATION
========================================================= */

function buildNav() {

    const nav = $("sideNav");


    const student = [

        ["nav-section", "MAIN"],

        ["dashboardView", "▦  Dashboard"],

        ["catalogView", "📚  Search Books"],

        ["borrowView", "↔  My Borrow History"],

        ["materialsView", "📄  Study Materials"],

        ["profileView", "◉  My Profile"],

        ["contactView", "✉  Contact"]

    ];


    const admin = [

        ["nav-section", "OVERVIEW"],

        ["dashboardView", "▦  Dashboard"],

        ["adminBooksView", "📚  Manage Books"],

        ["adminIssuesView", "↔  Issue / Return"],

        ["adminMaterialsView", "📄  Materials"],

        ["adminUsersView", "👥  Users"],

        ["catalogView", "🔎  Search Catalog"],

        ["contactView", "✉  Contact"]

    ];


    const list =
        currentUser.role === "admin"
            ? admin
            : student;


    nav.innerHTML =
        list
            .map(
                ([id, label]) => {

                    if (id === "nav-section") {

                        return `
                            <div class="nav-section">
                                ${label}
                            </div>
                        `;
                    }


                    return `
                        <button
                            data-view="${id}"
                            id="nav_${id}"
                        >
                            ${label}
                        </button>
                    `;
                }
            )
            .join("");
}


/* =========================================================
   USER UI
========================================================= */

function refreshUserUI() {

    $("sideName").textContent =
        currentUser.name;

    $("sideRole").textContent =
        currentUser.role === "admin"
            ? "Librarian Admin"
            : "Student";


    $("sideAvatar").textContent =
        initials(currentUser.name);

    $("headerAvatar").textContent =
        initials(currentUser.name);


    $("todayDate").textContent =
        new Date().toLocaleDateString(
            "en-IN",
            {
                weekday: "short",
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );


    updateLandingStats();
}


/* =========================================================
   LANDING STATISTICS
========================================================= */

function updateLandingStats() {

    $("heroBookCount").textContent =
        data.books.reduce(
            (total, book) =>
                total + book.copies,
            0
        );


    $("heroMaterialCount").textContent =
        data.materials.length;


    $("heroUserCount").textContent =
        data.users.filter(
            u => u.role === "student"
        ).length;
}


/* =========================================================
   SHOW VIEW
========================================================= */

function showView(id) {

    document
        .querySelectorAll(".page-view")
        .forEach(
            element =>
                element.classList.add("hidden")
        );


    const target = $(id);

    if (!target) {
        return;
    }


    target.classList.remove("hidden");

    currentView = id;


    document
        .querySelectorAll(".side-nav button")
        .forEach(
            element =>
                element.classList.remove("active")
        );


    const navButton =
        $("nav_" + id);

    if (navButton) {

        navButton.classList.add("active");
    }


    const titles = {

        dashboardView: "Dashboard",

        catalogView: "Book Catalog",

        borrowView: "My Borrow History",

        materialsView: "Study Materials",

        profileView: "My Profile",

        contactView: "Contact Library",

        adminBooksView: "Manage Books",

        adminIssuesView: "Issue & Return",

        adminMaterialsView: "Materials",

        adminUsersView: "Manage Users"
    };


    $("pageTitle").textContent =
        titles[id] || "Library";


    renderView(id);


    document
        .querySelector(".sidebar")
        .classList.remove("open");
}


/* =========================================================
   RENDER VIEW
========================================================= */

function renderView(id) {

    if (id === "dashboardView") {
        renderDashboard();
    }

    if (id === "catalogView") {
        renderCatalog();
    }

    if (id === "borrowView") {
        renderBorrow();
    }

    if (id === "materialsView") {
        renderMaterials(false);
    }

    if (id === "profileView") {
        renderProfile();
    }

    if (id === "contactView") {
        renderContact();
    }

    if (id === "adminBooksView") {
        renderAdminBooks();
    }

    if (id === "adminIssuesView") {
        renderAdminIssues();
    }

    if (id === "adminMaterialsView") {
        renderMaterials(true);
    }

    if (id === "adminUsersView") {
        renderAdminUsers();
    }
}


/* =========================================================
   DASHBOARD
========================================================= */

function renderDashboard() {

    const studentIssues =
        data.issues.filter(
            issue =>
                issue.userId === currentUser.id
        );


    const active =
        studentIssues.filter(
            issue =>
                issue.status === "issued"
        );


    const overdue =
        active.filter(
            issue =>
                fineFor(issue) > 0
        );


    const admin =
        currentUser.role === "admin";


    const stats =
        admin
            ? [

                [
                    "📚",
                    "Total Books",
                    data.books.reduce(
                        (a, b) =>
                            a + b.copies,
                        0
                    )
                ],

                [
                    "✓",
                    "Available",
                    data.books.reduce(
                        (a, b) =>
                            a + b.available,
                        0
                    )
                ],

                [
                    "↗",
                    "Issued",
                    data.issues.filter(
                        i =>
                            i.status === "issued"
                    ).length
                ],

                [
                    "👥",
                    "Members",
                    data.users.filter(
                        u =>
                            u.role === "student"
                    ).length
                ]

            ]
            : [

                [
                    "📚",
                    "Books Available",
                    data.books.reduce(
                        (a, b) =>
                            a + b.available,
                        0
                    )
                ],

                [
                    "↗",
                    "Active Borrows",
                    active.length
                ],

                [
                    "⚠",
                    "Overdue",
                    overdue.length
                ],

                [
                    "₹",
                    "My Fine",
                    "₹" +
                        studentIssues.reduce(
                            (a, i) =>
                                a + fineFor(i),
                            0
                        )
                ]

            ];


    $("dashboardView").innerHTML = `

        <div class="welcome">

            <div>

                <h2>
                    ${
                        admin
                            ? "Good day, Librarian!"
                            : "Welcome back, " +
                              esc(
                                  currentUser.name
                                      .split(" ")[0]
                              ) +
                              "!"
                    }
                </h2>

                <p>
                    ${
                        admin
                            ? "Manage your library inventory, members and lending activity from here."
                            : "Find your next book, track your loans and access academic resources."
                    }
                </p>

            </div>

            <div class="welcome-emoji">
                📚
            </div>

        </div>


        <div class="stat-grid">

            ${stats
                .map(
                    stat => `

                    <div class="stat-card">

                        <div class="stat-icon">
                            ${stat[0]}
                        </div>

                        <div>

                            <strong>
                                ${stat[2]}
                            </strong>

                            <span>
                                ${stat[1]}
                            </span>

                        </div>

                    </div>

                `
                )
                .join("")}

        </div>


        <div class="two-col">


            <div class="panel">

                <div class="section-head">

                    <h3>
                        ${
                            admin
                                ? "Recent Lending Activity"
                                : "Currently Borrowed"
                        }
                    </h3>

                    <button
                        class="small-btn primary"
                        data-view="${
                            admin
                                ? "adminIssuesView"
                                : "borrowView"
                        }"
                    >
                        View all
                    </button>

                </div>


                ${
                    admin
                        ? issueRows(
                              data.issues
                                  .slice(-5)
                                  .reverse()
                          )
                        : borrowRows(active)
                }

            </div>


            <div class="panel">

                <h3>
                    Quick Actions
                </h3>


                <div
                    style="
                        display:grid;
                        gap:9px
                    "
                >

                    ${
                        admin

                            ? `

                                <button
                                    class="btn btn-outline"
                                    onclick="openBookModal()"
                                >
                                    ＋ Add New Book
                                </button>


                                <button
                                    class="btn btn-outline"
                                    data-view="adminIssuesView"
                                >
                                    ↗ Issue a Book
                                </button>


                                <button
                                    class="btn btn-outline"
                                    data-view="adminMaterialsView"
                                >
                                    ＋ Add Material
                                </button>

                            `

                            : `

                                <button
                                    class="btn btn-outline"
                                    data-view="catalogView"
                                >
                                    🔎 Search for a Book
                                </button>


                                <button
                                    class="btn btn-outline"
                                    data-view="materialsView"
                                >
                                    📄 Browse Materials
                                </button>


                                <button
                                    class="btn btn-outline"
                                    data-view="profileView"
                                >
                                    ◉ Update Profile
                                </button>

                            `
                    }

                </div>

            </div>

        </div>

    `;
}


/* =========================================================
   ISSUE TABLE
========================================================= */

function issueRows(arr) {

    if (!arr.length) {

        return `
            <div class="empty">

                <div>📭</div>

                No lending records yet.

            </div>
        `;
    }


    return `

        <div class="table-wrap">

            <table class="table">

                <thead>

                    <tr>

                        <th>Book</th>

                        <th>Student</th>

                        <th>Due</th>

                        <th>Status</th>

                    </tr>

                </thead>


                <tbody>

                    ${arr
                        .map(
                            issue => `

                            <tr>

                                <td>
                                    <b>
                                        ${esc(
                                            book(
                                                issue.bookId
                                            )?.title ||
                                            "Deleted book"
                                        )}
                                    </b>
                                </td>


                                <td>
                                    ${esc(
                                        user(
                                            issue.userId
                                        )?.name ||
                                        "Unknown"
                                    )}
                                </td>


                                <td>
                                    ${fmtDate(
                                        issue.dueDate
                                    )}
                                </td>


                                <td>

                                    <span
                                        class="badge ${
                                            issue.status ===
                                            "returned"

                                                ? "badge-success"

                                                : fineFor(
                                                      issue
                                                  ) > 0

                                                ? "badge-danger"

                                                : "badge-warning"
                                        }"
                                    >

                                        ${
                                            issue.status ===
                                            "returned"

                                                ? "Returned"

                                                : fineFor(
                                                      issue
                                                  ) > 0

                                                ? "Overdue"

                                                : "Issued"
                                        }

                                    </span>

                                </td>

                            </tr>

                        `
                        )
                        .join("")}

                </tbody>

            </table>

        </div>

    `;
}


/* =========================================================
   BORROW ROWS
========================================================= */

function borrowRows(arr) {

    if (!arr.length) {

        return `
            <div class="empty">

                <div>📚</div>

                No active books.

            </div>
        `;
    }


    return issueRows(arr);
}


/* =========================================================
   BOOK CATALOG
========================================================= */

function renderCatalog() {

    const categories = [
        ...new Set(
            data.books.map(
                book =>
                    book.category
            )
        )
    ];


    $("catalogView").innerHTML = `

        <div class="section-head">

            <div>

                <h3>
                    Book Catalog
                </h3>

                <p
                    style="
                        margin:5px 0;
                        color:#8a91a0;
                        font-size:12px
                    "
                >
                    Search by title, author, ISBN or category.
                </p>

            </div>


            <div class="search-row">

                <input
                    class="search"
                    id="bookSearch"
                    placeholder="🔎 Search books..."
                >


                <select
                    id="catFilter"
                    style="width:170px"
                >

                    <option value="">
                        All categories
                    </option>

                    ${categories
                        .map(
                            category => `
                                <option>
                                    ${esc(category)}
                                </option>
                            `
                        )
                        .join("")}

                </select>

            </div>

        </div>


        <div
            id="catalogGrid"
            class="book-grid"
        ></div>

    `;


    const render = () => {

        const query =
            $("bookSearch")
                .value
                .toLowerCase();


        const category =
            $("catFilter").value;


        const books =
            data.books.filter(
                book =>

                    (
                        !query ||
                        `
                            ${book.title}
                            ${book.author}
                            ${book.isbn}
                            ${book.category}
                        `
                            .toLowerCase()
                            .includes(query)
                    )

                    &&

                    (
                        !category ||
                        book.category === category
                    )
            );


        $("catalogGrid").innerHTML =
            books.length

                ? books
                      .map(
                          book =>
                              bookCard(book)
                      )
                      .join("")

                : `

                    <div
                        class="empty"
                        style="
                            grid-column:1/-1
                        "
                    >

                        <div>🔎</div>

                        No books found.

                    </div>

                `;
    };


    $("bookSearch").oninput = render;

    $("catFilter").onchange = render;

    render();
}


/* =========================================================
   BOOK CARD
========================================================= */

function bookCard(bookData) {

    return `

        <div class="book-card">


            <div class="book-cover">
                📖
            </div>


            <span class="badge badge-info">
                ${esc(bookData.category)}
            </span>


            <h4>
                ${esc(bookData.title)}
            </h4>


            <p>
                by ${esc(bookData.author)}
            </p>


            <div class="book-meta">

                <span>
                    ISBN ${esc(bookData.isbn)}
                </span>

                <span>
                    ${bookData.available}/${bookData.copies}
                    available
                </span>

            </div>


            <p
                style="
                    margin-bottom:12px;
                    line-height:1.5
                "
            >
                ${esc(bookData.description)}
            </p>


            ${
                currentUser.role === "admin"

                    ? `

                        <div class="book-actions">

                            <button
                                class="small-btn primary"
                                onclick="openBookModal('${bookData.id}')"
                            >
                                Edit
                            </button>


                            <button
                                class="small-btn"
                                onclick="openIssueModal('${bookData.id}')"
                            >
                                Issue
                            </button>

                        </div>

                    `

                    : `

                        <div class="book-actions">

                            <button
                                class="small-btn primary"
                                onclick="requestBorrow('${bookData.id}')"
                                ${
                                    bookData.available < 1
                                        ? "disabled"
                                        : ""
                                }
                            >
                                ${
                                    bookData.available < 1
                                        ? "Unavailable"
                                        : "Request to Borrow"
                                }
                            </button>

                        </div>

                    `
            }

        </div>

    `;
}


/* =========================================================
   STUDENT BORROW REQUEST
========================================================= */

function requestBorrow(id) {

    const selectedBook = book(id);


    if (
        !selectedBook ||
        selectedBook.available < 1
    ) {

        toast(
            "This book is currently unavailable",
            "error"
        );

        return;
    }


    toast(
        "Borrow request noted. Please contact the librarian to complete issue."
    );
}


/* =========================================================
   BORROW HISTORY
========================================================= */

function renderBorrow() {

    const issues =
        data.issues.filter(
            issue =>
                issue.userId === currentUser.id
        );


    $("borrowView").innerHTML = `

        <div class="section-head">

            <div>

                <h3>
                    My Borrow History
                </h3>

                <p
                    style="
                        margin:5px 0;
                        color:#8a91a0;
                        font-size:12px
                    "
                >
                    Track issue date, expected return and fines.
                </p>

            </div>

        </div>


        ${
            issues.length

                ? `

                    <div class="table-wrap">

                        <table class="table">

                            <thead>

                                <tr>

                                    <th>Book</th>

                                    <th>Issue Date</th>

                                    <th>Expected Return</th>

                                    <th>Return</th>

                                    <th>Fine</th>

                                    <th>Status</th>

                                </tr>

                            </thead>


                            <tbody>

                                ${issues
                                    .slice()
                                    .reverse()
                                    .map(
                                        issue => `

                                        <tr>

                                            <td>
                                                <b>
                                                    ${esc(
                                                        book(
                                                            issue.bookId
                                                        )?.title ||
                                                        "Unknown"
                                                    )}
                                                </b>
                                            </td>


                                            <td>
                                                ${fmtDate(
                                                    issue.issueDate
                                                )}
                                            </td>


                                            <td>
                                                ${fmtDate(
                                                    issue.dueDate
                                                )}
                                            </td>


                                            <td>
                                                ${fmtDate(
                                                    issue.returnDate
                                                )}
                                            </td>


                                            <td>
                                                <b>
                                                    ₹${fineFor(
                                                        issue
                                                    )}
                                                </b>
                                            </td>


                                            <td>

                                                <span
                                                    class="badge ${
                                                        issue.status ===
                                                        "returned"

                                                            ? "badge-success"

                                                            : fineFor(
                                                                  issue
                                                              ) > 0

                                                            ? "badge-danger"

                                                            : "badge-warning"
                                                    }"
                                                >

                                                    ${
                                                        issue.status ===
                                                        "returned"

                                                            ? "Returned"

                                                            : fineFor(
                                                                  issue
                                                              ) > 0

                                                            ? "Overdue"

                                                            : "Issued"
                                                    }

                                                </span>

                                            </td>

                                        </tr>

                                    `
                                    )
                                    .join("")}

                            </tbody>

                        </table>

                    </div>

                `

                : `

                    <div class="panel empty">

                        <div>📚</div>

                        You have no borrowing history yet.

                    </div>

                `
        }

    `;
}


/* =========================================================
   MATERIALS
========================================================= */

function renderMaterials(admin = false) {

    if (!admin) {

        $("materialsView").innerHTML =
            materialMarkup(false);

    } else {

        $("adminMaterialsView").innerHTML =
            materialMarkup(true);
    }
}


function materialMarkup(admin) {

    const target =
        admin
            ? "adminMaterialsView"
            : "materialsView";


    const years = [
        ...new Set(
            data.materials.map(
                material =>
                    material.year
            )
        )
    ];


    const semesters = [
        ...new Set(
            data.materials.map(
                material =>
                    material.sem
            )
        )
    ];


    setTimeout(
        function () {

            const search =
                $(target + "Search");

            const year =
                $(target + "Year");

            const semester =
                $(target + "Sem");


            function filter() {

                const query =
                    (
                        search?.value ||
                        ""
                    ).toLowerCase();


                const selectedYear =
                    year?.value || "";


                const selectedSem =
                    semester?.value || "";


                const materials =
                    data.materials.filter(
                        material =>

                            (
                                !query ||

                                `
                                    ${material.title}
                                    ${material.type}
                                    ${material.dept}
                                `
                                    .toLowerCase()
                                    .includes(query)
                            )

                            &&

                            (
                                !selectedYear ||
                                material.year ===
                                    selectedYear
                            )

                            &&

                            (
                                !selectedSem ||
                                material.sem ===
                                    selectedSem
                            )
                    );


                const grid =
                    $(target + "Grid");


                grid.innerHTML =
                    materials.length

                        ? materials
                              .map(
                                  material =>
                                      materialCard(
                                          material
                                      )
                              )
                              .join("")

                        : `

                            <div
                                class="empty"
                                style="
                                    grid-column:1/-1
                                "
                            >

                                <div>📄</div>

                                No materials found.

                            </div>

                        `;
            }


            if (search) {
                search.oninput = filter;
            }


            if (year) {
                year.onchange = filter;
            }


            if (semester) {
                semester.onchange = filter;
            }


            filter();

        },
        0
    );


    return `

        <div class="section-head">

            <div>

                <h3>
                    ${
                        admin
                            ? "Manage Study Materials"
                            : "Study Materials"
                    }
                </h3>

                <p
                    style="
                        margin:5px 0;
                        color:#8a91a0;
                        font-size:12px
                    "
                >
                    Find notes, question papers and academic resources by year and semester.
                </p>

            </div>


            ${
                admin

                    ? `

                        <button
                            class="btn btn-primary"
                            onclick="openMaterialModal()"
                        >
                            ＋ Add Material
                        </button>

                    `

                    : ""
            }

        </div>


        <div
            class="search-row"
            style="margin-bottom:18px"
        >

            <input
                class="search"
                id="${target}Search"
                placeholder="🔎 Search material..."
            >


            <select
                id="${target}Year"
                style="width:130px"
            >

                <option value="">
                    All years
                </option>

                ${years
                    .map(
                        year =>
                            `<option>${year}</option>`
                    )
                    .join("")}

            </select>


            <select
                id="${target}Sem"
                style="width:150px"
            >

                <option value="">
                    All semesters
                </option>

                ${semesters
                    .map(
                        semester =>
                            `<option>${semester}</option>`
                    )
                    .join("")}

            </select>

        </div>


        <div
            id="${target}Grid"
            class="material-grid"
        ></div>

    `;
}


/* =========================================================
   MATERIAL CARD
========================================================= */

function materialCard(material) {

    let icon = "📄";


    if (
        material.type ===
        "Question Paper"
    ) {

        icon = "📝";

    } else if (
        material.type ===
        "Lab Manual"
    ) {

        icon = "🧪";

    } else if (
        material.type ===
        "Reference"
    ) {

        icon = "📘";
    }


    return `

        <div class="material-card">

            <div class="material-icon">
                ${icon}
            </div>


            <h4>
                ${esc(material.title)}
            </h4>


            <p>
                ${esc(material.type)}
                ·
                ${esc(material.dept)}
                ·
                Year ${material.year}
                ·
                Sem ${material.sem}
            </p>


            <div class="material-tags">

                <span class="badge badge-info">
                    ${esc(material.dept)}
                </span>

                <span class="badge badge-success">
                    Y${material.year}
                    S${material.sem}
                </span>

            </div>


            ${
                currentUser.role === "admin"

                    ? `

                        <button
                            class="small-btn danger"
                            onclick="deleteMaterial('${material.id}')"
                        >
                            Delete
                        </button>

                    `

                    : `

                        <button
                            class="download-btn"
                            onclick="downloadMaterial('${esc(material.file)}')"
                        >
                            ↓ Download ${esc(material.file)}
                        </button>

                    `
            }

        </div>

    `;
}


/* =========================================================
   MATERIAL DOWNLOAD
========================================================= */

function downloadMaterial(fileName) {

    const content =
        `
        College Library Management System

        Material File:
        ${fileName}

        This is a demo material download.
        `;


    const blob =
        new Blob(
            [content],
            {
                type: "text/plain"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download =
        fileName.replace(
            /\.[^.]+$/,
            ""
        ) + ".txt";


    link.click();


    URL.revokeObjectURL(url);
}


/* =========================================================
   PROFILE
========================================================= */

function renderProfile() {

    $("profileView").innerHTML = `

        <div class="section-head">

            <h3>
                My Profile
            </h3>

        </div>


        <div class="panel profile-card">


            <div class="profile-big">

                <div>

                    <div class="avatar">
                        ${initials(
                            currentUser.name
                        )}
                    </div>


                    <h3
                        style="
                            text-align:center;
                            margin:12px 0 0
                        "
                    >
                        ${esc(
                            currentUser.name
                        )}
                    </h3>


                    <p
                        style="
                            text-align:center;
                            color:#8a91a0;
                            font-size:11px
                        "
                    >
                        ${
                            currentUser.role ===
                            "admin"
                                ? "Librarian"
                                : "Student Member"
                        }
                    </p>

                </div>

            </div>


            <div>

                <h3>
                    Account Information
                </h3>


                <div class="info-list">


                    <div class="info-box">

                        <small>
                            Full name
                        </small>

                        <strong>
                            ${esc(
                                currentUser.name
                            )}
                        </strong>

                    </div>


                    <div class="info-box">

                        <small>
                            Email
                        </small>

                        <strong>
                            ${esc(
                                currentUser.email
                            )}
                        </strong>

                    </div>


                    <div class="info-box">

                        <small>
                            Role
                        </small>

                        <strong>
                            ${currentUser.role}
                        </strong>

                    </div>


                    <div class="info-box">

                        <small>
                            Member since
                        </small>

                        <strong>
                            October 2026
                        </strong>

                    </div>


                </div>

            </div>

        </div>

    `;
}


/* =========================================================
   CONTACT
========================================================= */

function renderContact() {

    $("contactView").innerHTML = `

        <div class="contact-grid">


            <div class="contact-info">

                <span
                    class="eyebrow"
                    style="color:#a8a9ff"
                >
                    GET IN TOUCH
                </span>


                <h2>
                    Need help with the library?
                </h2>


                <p
                    style="
                        color:#c5c9dc;
                        font-size:13px;
                        line-height:1.7
                    "
                >
                    Send us a message about books,
                    accounts, fines or study materials.
                </p>


                <div class="contact-item">

                    <span>📍</span>

                    <div>

                        <b>
                            Library Office
                        </b>

                        <span>
                            College Main Block
                        </span>

                    </div>

                </div>


                <div class="contact-item">

                    <span>✉</span>

                    <div>

                        <b>
                            Email
                        </b>

                        <span>
                            library@college.edu
                        </span>

                    </div>

                </div>


                <div class="contact-item">

                    <span>☎</span>

                    <div>

                        <b>
                            Phone
                        </b>

                        <span>
                            +91 00000 00000
                        </span>

                    </div>

                </div>

            </div>


            <div class="panel">

                <h3>
                    Contact Form
                </h3>


                <form id="contactForm">


                    <label>

                        Name

                        <input
                            id="contactName"
                            value="${esc(
                                currentUser.name
                            )}"
                            required
                        >

                    </label>


                    <label
                        style="margin-top:14px"
                    >

                        Email

                        <input
                            id="contactEmail"
                            value="${esc(
                                currentUser.email
                            )}"
                            type="email"
                            required
                        >

                    </label>


                    <label
                        style="margin-top:14px"
                    >

                        Subject

                        <input
                            id="contactSubject"
                            required
                        >

                    </label>


                    <label
                        style="margin-top:14px"
                    >

                        Message

                        <textarea
                            id="contactMessage"
                            rows="6"
                            required
                        ></textarea>

                    </label>


                    <button
                        class="btn btn-primary"
                        style="margin-top:14px"
                    >
                        Send Message
                    </button>


                </form>

            </div>

        </div>

    `;


    $("contactForm").onsubmit =
        function (event) {

            event.preventDefault();


            data.contacts.push({

                id: "c" + Date.now(),

                name:
                    $("contactName").value,

                email:
                    $("contactEmail").value,

                subject:
                    $("contactSubject").value,

                message:
                    $("contactMessage").value,

                date: today()

            });


            save();


            event.target.reset();


            toast(
                "Message sent to the library."
            );
        };
}


/* =========================================================
   ADMIN - BOOK MANAGEMENT
========================================================= */

function renderAdminBooks() {

    $("adminBooksView").innerHTML = `

        <div class="section-head">


            <div>

                <h3>
                    Manage Books
                </h3>

                <p
                    style="
                        margin:5px 0;
                        color:#8a91a0;
                        font-size:12px
                    "
                >
                    Add, update and delete library inventory.
                </p>

            </div>


            <button
                class="btn btn-primary"
                onclick="openBookModal()"
            >
                ＋ Add Book
            </button>


        </div>


        <div class="table-wrap">

            <table class="table">

                <thead>

                    <tr>

                        <th>Book</th>

                        <th>Author</th>

                        <th>Category</th>

                        <th>Copies</th>

                        <th>Available</th>

                        <th>Actions</th>

                    </tr>

                </thead>


                <tbody>

                    ${data.books
                        .map(
                            bookData => `

                            <tr>

                                <td>

                                    <b>
                                        ${esc(
                                            bookData.title
                                        )}
                                    </b>

                                    <br>

                                    <small
                                        style="
                                            color:#999
                                        "
                                    >
                                        ${esc(
                                            bookData.isbn
                                        )}
                                    </small>

                                </td>


                                <td>
                                    ${esc(
                                        bookData.author
                                    )}
                                </td>


                                <td>

                                    <span
                                        class="badge badge-info"
                                    >
                                        ${esc(
                                            bookData.category
                                        )}
                                    </span>

                                </td>


                                <td>
                                    ${bookData.copies}
                                </td>


                                <td>
                                    ${bookData.available}
                                </td>


                                <td>

                                    <button
                                        class="small-btn primary"
                                        onclick="openBookModal('${bookData.id}')"
                                    >
                                        Edit
                                    </button>


                                    <button
                                        class="small-btn danger"
                                        onclick="deleteBook('${bookData.id}')"
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>

                        `
                        )
                        .join("")}

                </tbody>

            </table>

        </div>

    `;
}


/* =========================================================
   OPEN BOOK MODAL
========================================================= */

function openBookModal(id = "") {

    const selectedBook =
        id
            ? book(id)
            : null;


    $("bookModalTitle").textContent =
        selectedBook
            ? "Update Book"
            : "Add Book";


    $("bookId").value =
        id;


    $("bookTitle").value =
        selectedBook?.title || "";


    $("bookAuthor").value =
        selectedBook?.author || "";


    $("bookCategory").value =
        selectedBook?.category ||
        "Computer Science";


    $("bookIsbn").value =
        selectedBook?.isbn || "";


    $("bookYear").value =
        selectedBook?.year || 2026;


    $("bookCopies").value =
        selectedBook?.copies || 1;


    $("bookDescription").value =
        selectedBook?.description || "";


    openModal("bookModal");
}


/* =========================================================
   SAVE BOOK
========================================================= */

$("bookForm").onsubmit =
    function (event) {

        event.preventDefault();


        const id =
            $("bookId").value;


        const copies =
            Number(
                $("bookCopies").value
            );


        if (copies < 1) {

            toast(
                "Copies must be at least 1",
                "error"
            );

            return;
        }


        if (id) {

            const selectedBook =
                book(id);


            const issuedCopies =
                selectedBook.copies -
                selectedBook.available;


            if (
                copies <
                issuedCopies
            ) {

                toast(
                    `Cannot set copies below ${issuedCopies}. Some copies are currently issued.`,
                    "error"
                );

                return;
            }


            selectedBook.title =
                $("bookTitle").value;

            selectedBook.author =
                $("bookAuthor").value;

            selectedBook.category =
                $("bookCategory").value;

            selectedBook.isbn =
                $("bookIsbn").value;

            selectedBook.year =
                Number(
                    $("bookYear").value
                );

            selectedBook.copies =
                copies;

            selectedBook.available =
                copies -
                issuedCopies;

            selectedBook.description =
                $("bookDescription").value;


            toast(
                "Book updated successfully."
            );

        } else {

            data.books.push({

                id:
                    "b" + Date.now(),

                title:
                    $("bookTitle").value,

                author:
                    $("bookAuthor").value,

                category:
                    $("bookCategory").value,

                isbn:
                    $("bookIsbn").value,

                year:
                    Number(
                        $("bookYear").value
                    ),

                copies,

                available:
                    copies,

                description:
                    $("bookDescription").value

            });


            toast(
                "Book added successfully."
            );
        }


        save();

        closeModal("bookModal");

        renderAdminBooks();

        updateLandingStats();
    };


/* =========================================================
   DELETE BOOK
========================================================= */

function deleteBook(id) {

    if (
        data.issues.some(
            issue =>
                issue.bookId === id &&
                issue.status === "issued"
        )
    ) {

        toast(
            "Cannot delete a currently issued book",
            "error"
        );

        return;
    }


    if (
        !confirm(
            "Delete this book?"
        )
    ) {

        return;
    }


    data.books =
        data.books.filter(
            bookData =>
                bookData.id !== id
        );


    save();

    renderAdminBooks();

    updateLandingStats();

    toast(
        "Book deleted."
    );
}


/* =========================================================
   ADMIN ISSUE / RETURN
========================================================= */

function renderAdminIssues() {

    const availableBooks =
        data.books.filter(
            bookData =>
                bookData.available > 0
        );


    const students =
        data.users.filter(
            userData =>
                userData.role === "student"
        );


    $("adminIssuesView").innerHTML = `

        <div class="section-head">

            <div>

                <h3>
                    Issue & Return Books
                </h3>

                <p
                    style="
                        margin:5px 0;
                        color:#8a91a0;
                        font-size:12px
                    "
                >
                    Librarian controls for lending and returns.
                    Fine is ₹5 per overdue day.
                </p>

            </div>

        </div>


        <div
            class="panel"
            style="margin-bottom:18px"
        >

            <h3>
                Issue a Book
            </h3>


            <div class="form-grid">


                <label>

                    Select book

                    <select id="quickIssueBook">

                        ${
                            availableBooks.length

                                ? availableBooks
                                      .map(
                                          bookData => `

                                            <option
                                                value="${bookData.id}"
                                            >
                                                ${esc(
                                                    bookData.title
                                                )}
                                                (
                                                ${bookData.available}
                                                available)
                                            </option>

                                        `
                                      )
                                      .join("")

                                : `
                                    <option value="">
                                        No books available
                                    </option>
                                `
                        }

                    </select>

                </label>


                <label>

                    Student

                    <select id="quickIssueUser">

                        ${
                            students.length

                                ? students
                                      .map(
                                          student => `

                                            <option
                                                value="${student.id}"
                                            >
                                                ${esc(
                                                    student.name
                                                )}
                                                —
                                                ${esc(
                                                    student.email
                                                )}
                                            </option>

                                        `
                                      )
                                      .join("")

                                : `
                                    <option value="">
                                        No students registered
                                    </option>
                                `
                        }

                    </select>

                </label>


                <label>

                    Issue date

                    <input
                        id="quickIssueDate"
                        type="date"
                        value="${today()}"
                    >

                </label>


                <label>

                    Due date

                    <input
                        id="quickDueDate"
                        type="date"
                        value="${new Date(
                            Date.now() +
                            14 *
                                86400000
                        )
                            .toISOString()
                            .slice(
                                0,
                                10
                            )}"
                    >

                </label>


                <div
                    class="form-actions full-span"
                >

                    <button
                        class="btn btn-primary"
                        onclick="quickIssue()"
                        ${
                            !availableBooks.length ||
                            !students.length
                                ? "disabled"
                                : ""
                        }
                    >
                        Issue Book
                    </button>

                </div>


            </div>

        </div>


        <div class="table-wrap">

            <table class="table">

                <thead>

                    <tr>

                        <th>Book</th>

                        <th>Student</th>

                        <th>Issue Date</th>

                        <th>Due Date</th>

                        <th>Fine</th>

                        <th>Status / Action</th>

                    </tr>

                </thead>


                <tbody>

                    ${
                        data.issues.length

                            ? data.issues
                                  .slice()
                                  .reverse()
                                  .map(
                                      issue => `

                                        <tr>

                                            <td>
                                                <b>
                                                    ${esc(
                                                        book(
                                                            issue.bookId
                                                        )?.title ||
                                                        "Unknown"
                                                    )}
                                                </b>
                                            </td>


                                            <td>
                                                ${esc(
                                                    user(
                                                        issue.userId
                                                    )?.name ||
                                                    "Unknown"
                                                )}
                                            </td>


                                            <td>
                                                ${fmtDate(
                                                    issue.issueDate
                                                )}
                                            </td>


                                            <td>
                                                ${fmtDate(
                                                    issue.dueDate
                                                )}
                                            </td>


                                            <td>
                                                ₹${fineFor(
                                                    issue
                                                )}
                                            </td>


                                            <td>

                                                ${
                                                    issue.status ===
                                                    "returned"

                                                        ? `

                                                            <span
                                                                class="badge badge-success"
                                                            >
                                                                Returned
                                                                ${fmtDate(
                                                                    issue.returnDate
                                                                )}
                                                            </span>

                                                        `

                                                        : `

                                                            <button
                                                                class="small-btn primary"
                                                                onclick="returnBook('${issue.id}')"
                                                            >
                                                                Mark Returned
                                                            </button>

                                                        `
                                                }

                                            </td>

                                        </tr>

                                    `
                                  )
                                  .join("")

                            : `

                                <tr>

                                    <td
                                        colspan="6"
                                        style="
                                            text-align:center;
                                            padding:40px
                                        "
                                    >
                                        No lending records found.
                                    </td>

                                </tr>

                            `
                    }

                </tbody>

            </table>

        </div>

    `;
}


/* =========================================================
   QUICK ISSUE
========================================================= */

function quickIssue() {

    const bookId =
        $("quickIssueBook")?.value;


    const userId =
        $("quickIssueUser")?.value;


    if (
        !bookId ||
        !userId
    ) {

        toast(
            "No available book or student found",
            "error"
        );

        return;
    }


    const issueDate =
        $("quickIssueDate").value;


    const dueDate =
        $("quickDueDate").value;


    if (
        !issueDate ||
        !dueDate
    ) {

        toast(
            "Please select issue and due dates",
            "error"
        );

        return;
    }


    if (
        new Date(dueDate) <
        new Date(issueDate)
    ) {

        toast(
            "Due date cannot be before issue date",
            "error"
        );

        return;
    }


    data.issues.push({

        id:
            "i" + Date.now(),

        bookId,

        userId,

        issueDate,

        dueDate,

        returnDate: null,

        status: "issued",

        fine: 0

    });


    book(bookId).available--;


    save();

    renderAdminIssues();

    toast(
        "Book issued successfully."
    );
}


/* =========================================================
   ISSUE MODAL
========================================================= */

function openIssueModal(id) {

    const selectedBook =
        book(id);


    if (
        !selectedBook ||
        selectedBook.available < 1
    ) {

        toast(
            "This book is unavailable",
            "error"
        );

        return;
    }


    $("issueBookId").value =
        id;


    $("issueUserEmail").innerHTML =
        data.users
            .filter(
                userData =>
                    userData.role === "student"
            )
            .map(
                student => `

                    <option
                        value="${student.id}"
                    >
                        ${esc(
                            student.name
                        )}
                        —
                        ${esc(
                            student.email
                        )}
                    </option>

                `
            )
            .join("");


    $("issueDate").value =
        today();


    $("issueDueDate").value =
        new Date(
            Date.now() +
            14 * 86400000
        )
            .toISOString()
            .slice(
                0,
                10
            );


    openModal("issueModal");
}


/* =========================================================
   ISSUE FORM
========================================================= */

$("issueForm").onsubmit =
    function (event) {

        event.preventDefault();


        const bookId =
            $("issueBookId").value;


        const userId =
            $("issueUserEmail").value;


        const issueDate =
            $("issueDate").value;


        const dueDate =
            $("issueDueDate").value;


        const selectedBook =
            book(bookId);


        if (!selectedBook) {

            toast(
                "Book not found",
                "error"
            );

            return;
        }


        if (
            selectedBook.available < 1
        ) {

            toast(
                "This book is unavailable",
                "error"
            );

            return;
        }


        if (
            new Date(dueDate) <
            new Date(issueDate)
        ) {

            toast(
                "Due date cannot be before issue date",
                "error"
            );

            return;
        }


        data.issues.push({

            id:
                "i" + Date.now(),

            bookId,

            userId,

            issueDate,

            dueDate,

            returnDate: null,

            status: "issued",

            fine: 0

        });


        selectedBook.available--;


        save();

        closeModal("issueModal");


        toast(
            "Book issued successfully."
        );


        if (
            currentView ===
            "adminIssuesView"
        ) {

            renderAdminIssues();
        }
    };


/* =========================================================
   RETURN BOOK
========================================================= */

function returnBook(id) {

    const issue =
        data.issues.find(
            item =>
                item.id === id
        );


    if (
        !issue ||
        issue.status === "returned"
    ) {

        return;
    }


    /*
        IMPORTANT:
        Calculate the fine BEFORE changing
        the status to returned.
    */

    const calculatedFine =
        fineFor(issue);


    issue.status =
        "returned";


    issue.returnDate =
        today();


    issue.fine =
        calculatedFine;


    const selectedBook =
        book(issue.bookId);


    if (selectedBook) {

        selectedBook.available =
            Math.min(
                selectedBook.copies,
                selectedBook.available + 1
            );
    }


    save();

    renderAdminIssues();


    toast(
        `Book returned. Fine: ₹${issue.fine}`
    );
}


/* =========================================================
   ADMIN USERS
========================================================= */

function renderAdminUsers() {

    const students =
        data.users.filter(
            userData =>
                userData.role === "student"
        );


    $("adminUsersView").innerHTML = `

        <div class="section-head">

            <div>

                <h3>
                    Library Members
                </h3>

                <p
                    style="
                        margin:5px 0;
                        color:#8a91a0;
                        font-size:12px
                    "
                >
                    View registered student accounts and their lending activity.
                </p>

            </div>

        </div>


        <div class="table-wrap">

            <table class="table">

                <thead>

                    <tr>

                        <th>Member</th>

                        <th>Email</th>

                        <th>Active Loans</th>

                        <th>Total Loans</th>

                        <th>Total Fine</th>

                    </tr>

                </thead>


                <tbody>

                    ${
                        students.length

                            ? students
                                  .map(
                                      student => {

                                          const issues =
                                              data.issues.filter(
                                                  issue =>
                                                      issue.userId ===
                                                      student.id
                                              );


                                          return `

                                            <tr>

                                                <td>
                                                    <b>
                                                        ${esc(
                                                            student.name
                                                        )}
                                                    </b>
                                                </td>


                                                <td>
                                                    ${esc(
                                                        student.email
                                                    )}
                                                </td>


                                                <td>
                                                    ${
                                                        issues.filter(
                                                            issue =>
                                                                issue.status ===
                                                                "issued"
                                                        ).length
                                                    }
                                                </td>


                                                <td>
                                                    ${issues.length}
                                                </td>


                                                <td>
                                                    ₹${issues.reduce(
                                                        (total, issue) =>
                                                            total +
                                                            fineFor(
                                                                issue
                                                            ),
                                                        0
                                                    )}
                                                </td>

                                            </tr>

                                          `;
                                      }
                                  )
                                  .join("")

                            : `

                                <tr>

                                    <td
                                        colspan="5"
                                        style="
                                            text-align:center;
                                            padding:40px
                                        "
                                    >
                                        No student members registered.
                                    </td>

                                </tr>

                            `
                    }

                </tbody>

            </table>

        </div>

    `;
}


/* =========================================================
   MATERIAL ADMIN MODAL
========================================================= */

function openMaterialModal(id = "") {

    const material =
        id
            ? data.materials.find(
                  item =>
                      item.id === id
              )
            : null;


    $("materialModalTitle").textContent =
        material
            ? "Update Material"
            : "Add Material";


    $("materialId").value =
        id;


    $("materialTitle").value =
        material?.title || "";


    $("materialType").value =
        material?.type || "Notes";


    $("materialDept").value =
        material?.dept || "CSE";


    $("materialYear").value =
        material?.year || "2";


    $("materialSem").value =
        material?.sem || "3";


    $("materialFile").value =
        material?.file || "";


    openModal("materialModal");
}


/* =========================================================
   SAVE MATERIAL
========================================================= */

$("materialForm").onsubmit =
    function (event) {

        event.preventDefault();


        const id =
            $("materialId").value;


        const materialData = {

            title:
                $("materialTitle").value,

            type:
                $("materialType").value,

            dept:
                $("materialDept").value,

            year:
                $("materialYear").value,

            sem:
                $("materialSem").value,

            file:
                $("materialFile").value

        };


        if (id) {

            const existing =
                data.materials.find(
                    material =>
                        material.id === id
                );


            if (existing) {

                Object.assign(
                    existing,
                    materialData
                );
            }


            toast(
                "Material updated successfully."
            );

        } else {

            data.materials.push({

                id:
                    "m" + Date.now(),

                ...materialData

            });


            toast(
                "Material added successfully."
            );
        }


        save();

        closeModal("materialModal");

        renderMaterials(true);

        updateLandingStats();
    };


/* =========================================================
   DELETE MATERIAL
========================================================= */

function deleteMaterial(id) {

    if (
        !confirm(
            "Delete this material?"
        )
    ) {

        return;
    }


    data.materials =
        data.materials.filter(
            material =>
                material.id !== id
        );


    save();

    renderMaterials(true);

    updateLandingStats();

    toast(
        "Material deleted."
    );
}


/* =========================================================
   INITIALIZE
========================================================= */

updateLandingStats();