// Check if firebase is initialized
if (!firebase.apps.length) {
    console.error("Firebase not initialized! Check index.html configuration.");
}
const db = firebase.firestore();
console.log("Firebase initialized successfully in script.js");

const BASE_URL = "";

async function fetchProfileDtls() {
    try {
        const response = await fetch(`${BASE_URL}/profile`);
        const data = await response.json();

        console.log("Profile Data:", data);
        
        if (data && data.length > 0) {
            const p = data[0];
            document.getElementById("profile-name").innerText = p.name || p.Name || "Aditya";
            document.getElementById("web-me").innerText = p.description || p.Description || "";
            
            // Fix: Bind missing fields
            if (document.getElementById("profile-about")) {
                document.getElementById("profile-about").innerText = p.about || p.About || "";
            }
            if (document.getElementById("email-me")) {
                document.getElementById("email-me").innerText = p.email || p.Email || "";
                document.getElementById("email-me").href = "mailto:" + (p.email || p.Email || "");
            }
            if (document.getElementById("contact-me")) {
                document.getElementById("contact-me").innerText = p.contact || p.Contact || p.phone || "";
            }
        }
    } catch (error) {
        console.error("Error fetching profile:", error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    fetchProfileDtls();
});

// ---------------------- Education Section ----------------------
async function fetchEducation() {
    const container = document.getElementById("education");
    if (!container) return;

    try {
        const res = await fetch(`${BASE_URL}/education`);
        const data = await res.json();

        let html = "<ul>";
        data.forEach(ed => {
            const year = ed.year || ed.Year || "";
            const degree = ed.degree || ed.Degree || "";
            const inst = ed.institution || ed.Institution || "";
            html += `
                <li>
                    <span>${year}</span><br>
                    <strong>${degree}</strong> - ${inst}
                </li>
            `;
        });
        html += "</ul>";
        container.innerHTML = html;

        console.log("Education loaded:", data);
    } catch (err) {
        console.error("Error fetching education:", err);
        container.innerHTML = "<p>Error loading education.</p>";
    }
}

document.addEventListener("DOMContentLoaded", fetchEducation);

async function fetchSkills() {
    const container = document.getElementById("skills");
    if (!container) return;

    try {
        const res = await fetch(`${BASE_URL}/skills`);
        const data = await res.json();

        let html = "<ul>";
        data.forEach(s => {
            const name = s.skill_name || s.Skill_Name || s.name || "";
            const level = s.level || s.Level || "";
            html += `<li><span>${level}</span><br>${name}</li>`;
        });
        html += "</ul>";
        container.innerHTML = html;

        console.log("Skills loaded:", data);
    } catch (err) {
        console.error("Error fetching skills:", err);
    }
}

document.addEventListener("DOMContentLoaded", fetchSkills);

// ---------------------- Experience Section ----------------------
async function fetchExperience() {
    const container = document.getElementById("experience");
    if (!container) return;

    try {
        const res = await fetch(`${BASE_URL}/experience`);
        const data = await res.json();

        let html = "<ul>";
        data.forEach(exp => {
            const duration = exp.duration || exp.Duration || "";
            const title = exp.title || exp.Title || "";
            const company = exp.company || exp.Company || "";
            html += `
                <li>
                    <span>${duration}</span><br>
                    <strong>${title}</strong> at ${company}
                </li>
            `;
        });
        html += "</ul>";
        container.innerHTML = html;

        console.log("Experience loaded:", data);
    } catch (err) {
        console.error("Error fetching experience:", err);
    }
}

document.addEventListener("DOMContentLoaded", fetchExperience);

async function fetchCourseDtls() {
    const container = document.getElementById("course");
    if (!container) return;

    try {
        const res = await fetch(`${BASE_URL}/courses`);
        const data = await res.json();

        let html = "<ul>";
        data.forEach(c => {
            const year = c.year || c.Year || "";
            const course = c.course || c.Course || "";
            html += `<li><span>${year}</span> - ${course}</li>`;
        });
        html += "</ul>";
        container.innerHTML = html;

        console.log("Courses loaded:", data);
    } catch (err) {
        console.error("Error fetching courses:", err);
    }
}

document.addEventListener("DOMContentLoaded", fetchCourseDtls);

async function fetchInterestDtls() {
    const container = document.getElementById("services-container");
    if (!container) return;
    container.innerHTML = "";
    try {
        const res = await fetch(`${BASE_URL}/interest`);
        const interestData = await res.json();
        interestData.forEach(item => {
            const card = document.createElement("div");
            card.className = "service";
            card.innerHTML = `
                <i class="${item.icon}"></i>
                <h2>${item.interest}</h2>
                <p>${item.interest_desc}</p>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        console.error("Error fetching interests:", err);
    }
}

async function fetchWorkDtls() {
    const container = document.getElementById("work-container");
    if (!container) return;

    try {
        const res = await fetch(`${BASE_URL}/work`);
        const data = await res.json();
        
        container.innerHTML = ""; // Clear existing hardcoded cards
        
        data.forEach(item => {
            const workCard = document.createElement("div");
            workCard.className = "work";
            
            // Use database image if available, else fallback to placeholder
            const imgSrc = item.image_url || item.Image_URL || "images/work-1.png";
            const title = item.work || item.Work || item.title || "";
            const desc = item.work_desc || item.Work_Desc || item.description || "";
            const link = item.link || item.Link || "#";

            workCard.innerHTML = `
                <img src="${imgSrc}" alt="${title}">
                <div class="layer">
                    <h3>${title}</h3>
                    <p>${desc}</p>
                    <a href="${link}" target="_blank"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>
                </div>
            `;
            container.appendChild(workCard);
        });
        
        console.log("Work loaded:", data);
    } catch(error){
        console.error("Work error:", error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    fetchInterestDtls();
    fetchWorkDtls();
});

// Handle contact form submission
function setupFormListener() {
    const form = document.forms['submit-to-google-sheet'];
    const msg = document.getElementById("msg");

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const data = {
                Name: form.Name.value,
                email: form.email.value,
                message: form.message.value
            };

            try {
                const response = await fetch(`${BASE_URL}/contact`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.text();
                msg.innerHTML = result;
                if (result.includes("successfully")) {
                    form.reset();
                }
            } catch (error) {
                console.error(error);
                msg.innerHTML = "Error sending message.";
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', setupFormListener);
