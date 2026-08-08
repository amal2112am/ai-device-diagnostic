document.addEventListener("DOMContentLoaded", () => {
    runSplashScreen();
    detectBrowserTelemetry();
    initFormLogic();
    initChatbot();
});

// 1. SPLASH SCREEN (STATUS LOADING SEKUENGSIAL)
function runSplashScreen() {
    const progressBar = document.getElementById("progress-bar");
    const statusText = document.getElementById("splash-status-text");
    const splashScreen = document.getElementById("splash-screen");
    const mainContent = document.getElementById("main-content");

    const statusMessages = [
        { progress: "25%", text: "✔ Checking Browser Capabilities..." },
        { progress: "50%", text: "✔ Validating Client Telemetry..." },
        { progress: "75%", text: "✔ Loading AI Reasoning Engine..." },
        { progress: "100%", text: "✔ Interface Ready..." }
    ];

    let index = 0;
    const interval = setInterval(() => {
        if (index < statusMessages.length) {
            progressBar.style.width = statusMessages[index].progress;
            statusText.innerText = statusMessages[index].text;
            index++;
        } else {
            clearInterval(interval);
            setTimeout(() => {
                splashScreen.classList.add("fade-out");
                setTimeout(() => {
                    splashScreen.style.display = "none";
                    mainContent.classList.remove("hidden");
                }, 600);
            }, 400);
        }
    }, 450);
}

// 2. READABLE BROWSER TELEMETRY (JUJUR & FACTUAL)
function detectBrowserTelemetry() {
    const userAgent = navigator.userAgent;
    let osName = "Android OS";
    let browserName = "Google Chrome";

    if (userAgent.indexOf("Windows") !== -1) osName = "Windows PC";
    else if (userAgent.indexOf("iPhone") !== -1) osName = "iOS (iPhone)";

    if (userAgent.indexOf("Edg") !== -1) browserName = "Microsoft Edge";
    else if (userAgent.indexOf("Firefox") !== -1) browserName = "Mozilla Firefox";

    document.getElementById("info-os").innerText = osName;
    document.getElementById("info-browser").innerText = browserName;
    
    // RAM API (Sifatnya Estimasi / Upper Bound oleh Browser)
    document.getElementById("info-ram").innerText = ("deviceMemory" in navigator) 
        ? `~${navigator.deviceMemory} GB (Estimasi API)` 
        : "Privasi Terproteksi Browser";
        
    // CPU Cores (Sifatnya Logical Processors)
    document.getElementById("info-cpu").innerText = ("hardwareConcurrency" in navigator) 
        ? `${navigator.hardwareConcurrency} Logical Cores` 
        : "Tidak Diberikan Browser";
        
    document.getElementById("info-connection").innerText = navigator.onLine ? "Terhubung Online" : "Terputus (Offline)";
}

// 3. LOGIKA FORM DIAGNOSTIK & PROCESSOR LOADING
function initFormLogic() {
    const form = document.getElementById("diagnostic-form");
    const formSection = document.getElementById("form-section");
    const loadingSection = document.getElementById("ai-loading");
    const dashboardSection = document.getElementById("dashboard-result");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const selectedActivities = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
        const storage = document.querySelector('input[name="storage"]:checked')?.value || "5–10 GB";
        const heat = document.querySelector('input[name="heat"]:checked')?.value || "Normal";
        const duration = document.querySelector('input[name="duration"]:checked')?.value || "30–60 menit";

        formSection.classList.add("hidden");
        loadingSection.classList.remove("hidden");

        const steps = [
            { id: "step-1", delay: 400, progress: "20%" },
            { id: "step-2", delay: 800, progress: "40%" },
            { id: "step-3", delay: 1300, progress: "65%" },
            { id: "step-4", delay: 1800, progress: "85%" }
        ];

        const analysisBar = document.getElementById("analysis-progress");

        steps.forEach(step => {
            setTimeout(() => {
                const el = document.getElementById(step.id);
                el.classList.add("done");
                el.innerHTML = `<span class="step-icon">✔</span> ${el.innerText.replace('⏳ ', '')}`;
                analysisBar.style.width = step.progress;
            }, step.delay);
        });

        setTimeout(async () => {
            await generateProfessionalAnalysis(selectedActivities, storage, heat, duration);

            const step5 = document.getElementById("step-5");
            if (step5) {
                step5.classList.add("done");
                step5.innerHTML = `<span class="step-icon">✔</span> ${step5.innerText.replace('⏳ ', '')}`;
            }
            analysisBar.style.width = "100%";

            loadingSection.classList.add("hidden");
            dashboardSection.classList.remove("hidden");
        }, 1800);
    });
}

async function getAIInsight(promptText) {
  const res = await fetch('/api/gemini-insight', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ prompt: promptText })
  });
  const data = await res.json();
  return data.text;
}

function buildPrompt(score, storage, heat, duration, activities) {
  return `Kamu adalah asisten teknis yang menjelaskan hasil diagnosis performa HP ke siswa SMK jurusan Manajemen Perkantoran. Gunakan bahasa Indonesia formal tapi mudah dipahami.

DATA HASIL PEMERIKSAAN (jangan diubah, jangan menambah data yang tidak ada di sini):
- Skor kesehatan perangkat: ${score} %
- Sisa penyimpanan internal: ${storage}
- Kondisi suhu saat pemakaian: ${heat}
- Lama pemakaian sekali buka: ${duration}
- Aktivitas yang sering dilakukan: ${activities.join(", ") || "tidak disebutkan"}

TUGAS:
1. "summary": ringkasan kondisi perangkat, 2-3 kalimat.
2. "insight": penjelasan sebab-akibat kenapa skornya segitu, dan satu saran prioritas, 3-4 kalimat.

ATURAN:
- Jangan mengarang data yang tidak diberikan di atas.
- Jangan menyimpulkan HP rusak atau harus diganti.
- Jangan pakai kalimat pembuka seperti "Tentu, berikut adalah...".
- WAJIB balas HANYA dalam format JSON persis: {"summary": "...", "insight": "..."} tanpa teks tambahan, tanpa markdown code block.`;
}

// 4. GENERATE EXPERT DIAGNOSTIC REASONING & EDUKASI
async function generateProfessionalAnalysis(activities, storage, heat, duration) {
    let score = 90;

    // Penilaian berbasis logika teknis
    const isCriticalStorage = storage === "Kurang dari 5 GB";
    const isHighHeat = heat === "Panas" || heat === "Sangat Panas";
    const isLongDuration = duration === "Lebih dari 3 jam" || duration === "1–3 jam";
    const isVideoHeavy = activities.some(act => ["TikTok", "Instagram", "YouTube", "Editing Video"].includes(act));

    if (isCriticalStorage) score -= 30;
    else if (storage === "5–10 GB") score -= 15;

    if (isHighHeat) score -= 20;
    if (isLongDuration) score -= 10;
    if (isVideoHeavy && activities.length >= 3) score -= 10;

    score = Math.max(score, 35);

    // Animasi Hitung Score
    animateCounter("res-score", 0, score, 1000);

    // Status Pill
    const statusPill = document.getElementById("res-health-status");
    if (score < 60) {
        statusPill.className = "status-pill red"; statusPill.innerText = "🔴 Perlu Perhatian";
    } else if (score < 80) {
        statusPill.className = "status-pill yellow"; statusPill.innerText = "🟡 Cukup Stabil";
    } else {
        statusPill.className = "status-pill green"; statusPill.innerText = "🟢 Sangat Baik";
    }

    // Summary & Insight dari AI (bukan template lagi)
    const prompt = buildPrompt(score, storage, heat, duration, activities);
    try {
        const aiText = await getAIInsight(prompt);
        const cleaned = aiText.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        document.getElementById("res-summary-text").innerText = parsed.summary;
        document.getElementById("res-ai-insight").innerText = parsed.insight;
    } catch (err) {
        console.error("Gagal ambil insight AI:", err);
        document.getElementById("res-summary-text").innerText = "Ringkasan AI tidak dapat dimuat saat ini.";
        document.getElementById("res-ai-insight").innerText = "Insight AI tidak tersedia — coba lagi nanti.";
    }

    // Section 3: Mengapa AI Menyimpulkan Demikian?
    const reasoningList = document.getElementById("res-reasoning-list");
    reasoningList.innerHTML = `
        <li>Karena Anda memilih penyimpanan <strong>"${storage}"</strong>: Memori jenis NAND Flash memerlukan ruang bebas minimal 10-15% agar fungsi TRIM dan Wear Leveling OS bekerja optimal.</li>
        <li>Karena Anda memilih aktivitas <strong>"${activities.slice(0, 3).join(", ") || "Aktivitas Standar"}"</strong>: Aplikasi berbasis aliran video atau game terus-menerus melakukan proses Read/Write cache sementara ke memori internal.</li>
        <li>Karena Anda memilih sensasi suhu <strong>"${heat}"</strong> dan durasi <strong>"${duration}"</strong>: Beban pemrosesan berkelanjutan berpotensi mengaktifkan fitur keamanan *Thermal Throttling* pada chipset.</li>
    `;

    // Section 7: Jika Dibiarkan...
    const consequencesList = document.getElementById("res-consequences-list");
    consequencesList.innerHTML = `
        <li>Aplikasi berpotensi mengalami waktu *loading* (*splash time*) yang lebih lama saat dibuka pertama kali.</li>
        <li>Sistem operasi kemungkinan dapat menutup aplikasi latar belakang secara mendadak (*force close*) saat kehabisan ruang swap sementara.</li>
        ${isHighHeat ? "<li>Suhu tinggi yang berulang dapat mempercepat proses degradasi kimiawi pada baterai Lithium-Ion dalam jangka panjang.</li>" : ""}
        ${isCriticalStorage ? "<li>Gagal memperbarui aplikasi atau OS karena tidak tersedianya ruang untuk mengekstrak file pembaruan.</li>" : ""}
    `;

    // Solusi Checklist
    const solutionsGroup = document.getElementById("res-solutions");
    solutionsGroup.innerHTML = `
        <label class="check-item"><input type="checkbox"> Pindahkan file media besar (foto/video) ke cloud atau penyimpanan eksternal</label>
        <label class="check-item"><input type="checkbox"> Bersihkan file cache aplikasi video (TikTok/IG) secara berkala via Pengaturan Aplikasi</label>
        <label class="check-item"><input type="checkbox"> Lepas casing pelindung tebal saat bermain game dalam durasi lama untuk membantu pelepasan panas</label>
    `;

    // Section 5: Myth vs Fact (Dinamis sesuai kondisi)
    const mythText = document.getElementById("res-myth-text");
    const factText = document.getElementById("res-fact-text");

    if (isCriticalStorage) {
        mythText.innerText = "Makin sering 'Clear All' di Recent Apps, HP pasti bakal bebas lag dan selalu kencang.";
        factText.innerText = "Menutup aplikasi yang sering dipakai justru memaksa CPU memuat ulang data dari memori internal (cold boot) saat dibuka kembali, yang mengonsumsi lebih banyak daya dan CPU dibanding membiarkannya diam di memori cache.";
    } else {
        mythText.innerText = "Kapasitas RAM yang sangat besar menjamin HP tidak akan pernah panas atau lemot.";
        factText.innerText = "RAM hanya berfungsi menampung aplikasi yang sedang berjalan. Kecepatan HP tetap dipengaruhi oleh arsitektur Chipset (SoC), kecepatan baca/tulis memori storage, serta optimasi Sistem Operasi.";
    }

    // Section 4 & 8: Edukasi Singkat / Hari Ini Anda Belajar
    const eduTitle = document.getElementById("res-edu-title");
    const eduDesc = document.getElementById("res-edu-desc");
    const eduTakeaway = document.getElementById("res-edu-takeaway");

    if (isVideoHeavy) {
        eduTitle.innerText = "Mengapa Aplikasi Video Pendek Menghasilkan Cache Sangat Besar?";
        eduDesc.innerText = "Aplikasi seperti TikTok atau Instagram menggunakan teknik *Pre-buffering*. Sistem otomatis mengunduh beberapa video berikutnya ke dalam penyimpanan lokal agar saat Anda menggeser layar (swipe), video dapat langsung berputar tanpa jeda *buffering*. Jika tidak dibersihkan, akumulasi file sementara ini bisa menyita berpuluh-gigabyte memori.";
        eduTakeaway.innerText = "Cache adalah file cadangan cepat. Menghapus cache aman dilakukan dan tidak akan menghapus data akun atau foto pribadi Anda.";
    } else {
        eduTitle.innerText = "Perbedaan RAM (Memory) dan Storage (Penyimpanan Internal)";
        eduDesc.innerText = "RAM adalah 'meja kerja sementara' yang cepat untuk menampung aplikasi yang sedang dibuka saat ini. Sedangkan Storage adalah 'lemari arsip' tempat menyimpan foto, aplikasi, dan file OS secara permanen. Jika 'lemari arsip' terlalu penuh, sistem akan kesulitan menata file sementara yang dibutuhkan 'meja kerja'.";
        eduTakeaway.innerText = "HP butuh ruang kosong di penyimpanan internal minimal 10-15% agar sistem dapat memproses file sementara dengan lancar.";
    }
}

// Helper Animasi Counter
function animateCounter(id, start, end, duration) {
    const obj = document.getElementById(id);
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
}

// CHATBOT CONSULTANT
function initChatbot() {
    const chatToggleBtn = document.getElementById("chat-toggle-btn");
    const chatPanel = document.getElementById("chatbot-panel");
    if (chatToggleBtn && chatPanel) {
        chatToggleBtn.addEventListener("click", () => {
            chatPanel.classList.toggle("chatbot-panel-collapsed");
        });
    }
    const chatForm = document.getElementById("chat-form");
    const chatInput = document.getElementById("chat-input");

    chatForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const userMsg = chatInput.value.trim();
        if (!userMsg) return;

        appendMessage(userMsg, "user");
        chatInput.value = "";
        processBotResponse(userMsg);
    });
}

function sendQuickQuestion(questionText) {
    appendMessage(questionText, "user");
    processBotResponse(questionText);
}

async function processBotResponse(userMsg) {
    const chatBox = document.getElementById("chat-box");

    const typingDiv = document.createElement("div");
    typingDiv.className = "chat-msg bot typing-msg";
    typingDiv.innerHTML = `<div class="typing-dots"><span></span><span></span><span></span></div> Sedang mengetik...`;
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    const chatPrompt = `Kamu adalah asisten teknis yang menjawab pertanyaan seputar performa HP untuk siswa SMK. Jawab HANYA seputar topik performa perangkat, baterai, penyimpanan, RAM, panas, dan lag. Kalau pertanyaan di luar topik itu, arahkan sopan kembali ke topik performa HP. Jawab dalam 2-4 kalimat, bahasa Indonesia formal tapi mudah dipahami, tanpa kalimat pembuka seperti "Tentu,...". Jangan pakai format JSON, balas teks biasa saja.

Pertanyaan pengguna: "${userMsg}"`;

    try {
        const reply = await getAIInsight(chatPrompt);
        chatBox.removeChild(typingDiv);
        appendMessage(reply, "bot");
    } catch (err) {
        console.error("Gagal ambil balasan chatbot:", err);
        chatBox.removeChild(typingDiv);
        appendMessage("Maaf, jawaban AI tidak dapat dimuat saat ini. Coba lagi sebentar lagi.", "bot");
    }
}

function appendMessage(msg, sender) {
    const chatBox = document.getElementById("chat-box");
    const div = document.createElement("div");
    div.className = `chat-msg ${sender}`;
    div.innerText = msg;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}