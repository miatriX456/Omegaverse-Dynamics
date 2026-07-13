import { registerExtension } from "../../extensions.js";

// ============================================================
// 1. БАЗА ДАННЫХ АРОМАТОВ (ДЛЯ СЕЛЕКТОРОВ)
// ============================================================
const SCENTS = [
    { id: 'wood', name: '🪵 Сандал и кедр', statuses: ['alpha'] },
    { id: 'mint', name: '🌿 Ледяная мята', statuses: ['alpha', 'beta'] },
    { id: 'citrus', name: '🍋 Горький цитрус', statuses: ['alpha'] },
    { id: 'leather', name: '💼 Дорогая кожа и табак', statuses: ['alpha'] },
    { id: 'vanilla', name: '🍦 Нежная ваниль', statuses: ['omega'] },
    { id: 'strawberry', name: '🍓 Спелая земляника', statuses: ['omega'] },
    { id: 'lavender', name: '🪻 Успокаивающая лаванда', statuses: ['omega', 'beta'] },
    { id: 'peach', name: '🍑 Сочный белый персик', statuses: ['omega'] },
    { id: 'coffee', name: '☕ Крепкий чёрный кофе', statuses: ['alpha', 'beta'] },
    { id: 'sea', name: '🌊 Морской бриз и соль', statuses: ['beta'] }
];

// ============================================================
// 2. ГЛОБАЛЬНОЕ СОСТОЯНИЕ РАСШИРЕНИЯ
// ============================================================
let state = {
    activeTab: 'player',
    enabled: true,
    autoDetect: true,
    promptInterval: 10,
    calendar: {
        currentDate: new Date().toISOString().split('T')[0],
        viewDate: new Date().toISOString().split('T')[0],
        season: 'spring',
        globalEvents: []
    },
    player: {
        status: 'omega',
        scent: { primary: 'vanilla' },
        role: 'Омега-изгой',
        cycle: { active: false, type: 'none' }
    },
    npcs: [
        { name: "Алекс", status: "omega", scent: { primary: "strawberry" }, cycle: { active: true, type: "heat", startDate: "2026-07-15" }, trauma: "none", traumaDescription: "" },
        { name: "Дамиан", status: "alpha", scent: { primary: "wood" }, cycle: { active: true, type: "rut", startDate: "2026-07-20" }, trauma: "severe", traumaDescription: "Склонен к жестокости из-за предательства стаи" }
    ],
    memoryFacts: [
        { text: "Дамиан бурно среагировал на запах ванили в коридоре.", category: "Биология", date: "2026-07-13" }
    ]
};

// ============================================================
// 3. УТИЛИТЫ СОХРАНЕНИЯ И ПОИСКА
// ============================================================
const save = () => localStorage.setItem('ov_dynamics_monolith_state', JSON.stringify(state));
const load = () => {
    const saved = localStorage.getItem('ov_dynamics_monolith_state');
    if (saved) {
        try { state = JSON.parse(saved); } catch (e) { console.error("Ошибка загрузки Omegaverse:", e); }
    }
};

const getScentsByStatus = (status) => SCENTS.filter(s => s.statuses.includes(status));
const getScentById = (id) => SCENTS.find(s => s.id === id);
const getMonthName = (m) => ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"][m];

// Изменение месяца в календаре
function changeCalendarMonth(direction) {
    const parts = state.calendar.viewDate.split('-');
    let year = parseInt(parts[0]);
    let month = parseInt(parts[1]) - 1;

    month += direction;
    if (month < 0) { month = 11; year--; }
    if (month > 11) { month = 0; year++; }

    state.calendar.viewDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    save();
    updateUI();
}

// Показ событий конкретного дня
window.ovShowDayEvents = function(dateStr) {
    const eventsContainer = document.getElementById('ov-day-events');
    if (!eventsContainer) return;

    let html = ``;
    const dayEvents = [];

    state.npcs.forEach(npc => {
        if (npc.cycle.active && npc.cycle.startDate === dateStr) {
            dayEvents.push(`<div style="margin-bottom:6px;">🔥 <b>${npc.name}</b>: Начался период <b>${npc.cycle.type === 'heat' ? 'Течки' : 'Гона'}</b></div>`);
        }
    });

    if (dayEvents.length === 0) {
        html = `<div class="ov-text-muted">Нет биологических событий на ${dateStr}</div>`;
    } else {
        html = `<div><b>Дата: ${dateStr}</b></div><hr style="border-color:rgba(255,255,255,0.1); margin:8px 0;">` + dayEvents.join('');
    }
    eventsContainer.innerHTML = html;
};

// ============================================================
// 4. ГЕНЕРАЦИЯ ШАБЛОНОВ ДЛЯ ВКЛАДОК
// ============================================================

// --- ВКЛАДКА: ИГРОК ---
function getPlayerTabHTML() {
    const p = state.player;
    let scentOptions = `<option value="">Без запаха</option>`;
    getScentsByStatus(p.status).forEach(s => {
        scentOptions += `<option value="${s.id}" ${p.scent.primary === s.id ? 'selected' : ''}>${s.name}</option>`;
    });

    return `
        <div class="ov-card">
            <div class="ov-section-title">Персональные биологические данные</div>
            <div class="ov-row">
                <label>Ваш статус:</label>
                <select id="ov-p-status" class="ov-select">
                    <option value="alpha" ${p.status === 'alpha' ? 'selected' : ''}>Альфа ⚡</option>
                    <option value="beta" ${p.status === 'beta' ? 'selected' : ''}>Бета 👥</option>
                    <option value="omega" ${p.status === 'omega' ? 'selected' : ''}>Омега 🌸</option>
                </select>
            </div>
            <div class="ov-row">
                <label>Природный аромат:</label>
                <select id="ov-p-scent" class="ov-select">${scentOptions}</select>
            </div>
            <div class="ov-row">
                <label>Социальная роль:</label>
                <input type="text" id="ov-p-role" class="ov-input ov-flex" value="${p.role || ''}" placeholder="Например: Глава клана...">
            </div>
            <div class="ov-row" style="margin-top:15px;">
                <label style="cursor:pointer;">
                    <input type="checkbox" id="ov-p-cycle" ${p.cycle.active ? 'checked' : ''}> Текущее состояние цикла (Гон / Течка)
                </label>
            </div>
        </div>
    `;
}

// --- ВКЛАДКА: NPC ---
function getNpcsTabHTML() {
    if (state.npcs.length === 0) return `<div class="ov-text-muted">Список пуст. Персонажи появятся после детекта в чате.</div>`;
    
    let html = `<div style="display:flex; flex-direction:column; gap:12px;">`;
    state.npcs.forEach((npc, index) => {
        const scentObj = getScentById(npc.scent.primary);
        let badge = npc.status === 'alpha' ? 'ov-status-alpha' : (npc.status === 'omega' ? 'ov-status-omega' : 'ov-status-beta');
        
        html += `
            <div class="ov-card">
                <div class="ov-row" style="border-bottom: 1px solid var(--ov-border); padding-bottom:8px; margin-bottom:10px;">
                    <b style="font-size:15px;">${npc.name}</b>
                    <span class="ov-status-badge ${badge}">${npc.status}</span>
                </div>
                <div style="font-size:12px; display:flex; flex-direction:column; gap:6px;">
                    <div><b>Запах:</b> ${scentObj ? scentObj.name : 'Не определён'}</div>
                    <div><b>Состояние:</b> ${npc.cycle.active ? (npc.status === 'omega' ? 'Течка 🔥' : 'Гон ⚡') : 'Стабилен'}</div>
                    <div class="ov-row" style="margin-top:5px;">
                        <label>Психо-травма:</label>
                        <select class="ov-select ov-npc-trauma" data-index="${index}">
                            <option value="none" ${npc.trauma === 'none' ? 'selected' : ''}>Нет травм</option>
                            <option value="light" ${npc.trauma === 'light' ? 'selected' : ''}>Лёгкая (Недоверие)</option>
                            <option value="severe" ${npc.trauma === 'severe' ? 'selected' : ''}>Тяжёлая (Жестокость)</option>
                        </select>
                    </div>
                    <input type="text" class="ov-input ov-npc-trauma-desc" data-index="${index}" value="${npc.traumaDescription || ''}" placeholder="Проявления травмы в поведении...">
                </div>
            </div>
        `;
    });
    html += `</div>`;
    return html;
}

// --- ВКЛАДКА: КАЛЕНДАРЬ И ЦИКЛЫ ---
function getCalendarTabHTML() {
    let decorEmoji = state.calendar.season === 'spring' ? '🌸' : state.calendar.season === 'summer' ? '🌻' : state.calendar.season === 'autumn' ? '🍁' : '❄️';
    
    let html = `
        <div class="ov-row">
            <label>Текущее время года:</label>
            <select class="ov-select ov-flex" id="ov-calendar-season-select">
                <option value="spring" ${state.calendar.season === 'spring' ? 'selected' : ''}>🌸 Весна</option>
                <option value="summer" ${state.calendar.season === 'summer' ? 'selected' : ''}>🌻 Лето</option>
                <option value="autumn" ${state.calendar.season === 'autumn' ? 'selected' : ''}>🍁 Осень</option>
                <option value="winter" ${state.calendar.season === 'winter' ? 'selected' : ''}>❄️ Зима</option>
            </select>
        </div>

        <div class="ov-calendar-beautiful ov-season-${state.calendar.season}">
            <div class="ov-season-decor">${decorEmoji}</div>
            <div class="ov-calendar-nav" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <button class="ov-btn" id="ov-cal-prev" style="padding:2px 8px;"><i class="fa-solid fa-chevron-left"></i></button>
                <span style="font-weight:900;">${getMonthName(new Date(state.calendar.viewDate).getMonth())} ${new Date(state.calendar.viewDate).getFullYear()}</span>
                <button class="ov-btn" id="ov-cal-next" style="padding:2px 8px;"><i class="fa-solid fa-chevron-right"></i></button>
            </div>
            <div class="ov-calendar-grid" style="display:grid; grid-template-columns:repeat(7,1fr); gap:5px; text-align:center; font-size:11px;">
    `;

    ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].forEach(d => {
        html += `<div style="font-weight:800; opacity:0.6;">${d}</div>`;
    });

    const viewDate = new Date(state.calendar.viewDate);
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayStr = new Date().toISOString().split('T')[0];
    let startOffset = (firstDay === 0) ? 6 : firstDay - 1;

    for (let i = 0; i < startOffset; i++) html += `<div></div>`;

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        let dayClass = 'ov-cal-day';
        if (dateStr === todayStr) dayClass += ' cal-today';

        state.npcs.forEach(npc => {
            if (npc.cycle.active && npc.cycle.startDate === dateStr) {
                dayClass += npc.cycle.type === 'heat' ? ' event-heat' : ' event-rut';
            }
        });

        html += `<div class="${dayClass}" onclick="ovShowDayEvents('${dateStr}')">${day}</div>`;
    }

    html += `
            </div>
        </div>
        <div class="ov-section-title"><i class="fa-solid fa-list"></i> Биологические события дня</div>
        <div id="ov-day-events" style="padding:10px; background:rgba(0,0,0,0.2); border-radius:12px; font-size:12px;">
            <div class="ov-text-muted">Нажмите на подсвеченный день цикла...</div>
        </div>
    `;
    return html;
}

// --- ВКЛАДКА: ПАМЯТЬ И ЛОГИ ФАКТОВ ---
function getFactsTabHTML() {
    let html = `<div class="ov-section-title">Зафиксированные биологические факты</div>`;
    if (state.memoryFacts.length === 0) return html + `<div class="ov-text-muted">База чиста. Факты генерируются автоматически во время диалогов.</div>`;
    
    state.memoryFacts.forEach(f => {
        html += `
            <div class="ov-card" style="padding:10px; font-size:12px; margin-bottom:6px;">
                <span style="color:var(--ov-omega); font-weight:bold;">[${f.category}]</span> ${f.text}
                <div style="font-size:10px; opacity:0.5; text-align:right; margin-top:4px;">${f.date}</div>
            </div>
        `;
    });
    return html;
}

// --- ВКЛАДКА: НАСТРОЙКИ ---
function getSettingsTabHTML() {
    return `
        <div class="ov-card">
            <div class="ov-row">
                <label><input type="checkbox" id="ov-opt-enabled" ${state.enabled ? 'checked' : ''}> Активно</label>
            </div>
            <div class="ov-row">
                <label><input type="checkbox" id="ov-opt-auto" ${state.autoDetect ? 'checked' : ''}> Авто-детект статусов</label>
            </div>
            <div class="ov-row" style="margin-top:10px;">
                <label>Частота напоминаний (сообщ.):</label>
                <input type="number" id="ov-opt-interval" class="ov-input" style="width:60px;" value="${state.promptInterval}" min="1">
            </div>
            <button id="ov-btn-reset" class="ov-btn" style="width:100%; margin-top:15px; background:rgba(255,71,87,0.2); color:#ff4757; border-color:rgba(255,71,87,0.3)">Полный сброс расширения</button>
        </div>
    `;
}

// ============================================================
// 5. ДИНАМИЧЕСКИЙ ОБНОВЛЯЕМЫЙ ИНТЕРФЕЙС
// ============================================================
function updateUI() {
    const panel = document.getElementById('ov-main-panel');
    if (!panel) return;

    // Подсвечиваем кнопки вкладок
    panel.querySelectorAll('.ov-tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.id === `ov-tab-${state.activeTab}`) btn.classList.add('active');
    });

    // Рендерим нужный контент
    const contentArea = panel.querySelector('.ov-content');
    if (!contentArea) return;

    switch (state.activeTab) {
        case 'player': contentArea.innerHTML = getPlayerTabHTML(); break;
        case 'npcs': contentArea.innerHTML = getNpcsTabHTML(); break;
        case 'calendar': contentArea.innerHTML = getCalendarTabHTML(); break;
        case 'facts': contentArea.innerHTML = getFactsTabHTML(); break;
        case 'settings': contentArea.innerHTML = getSettingsTabHTML(); break;
    }

    // НАВЕШИВАНИЕ ОБРАБОТЧИКОВ И СОБЫТИЙ ДЛЯ КАЖДОЙ ВКЛАДКИ НАПРЯМУЮ
    if (state.activeTab === 'player') {
        document.getElementById('ov-p-status').onchange = (e) => { state.player.status = e.target.value; save(); updateUI(); };
        document.getElementById('ov-p-scent').onchange = (e) => { state.player.scent.primary = e.target.value; save(); };
        document.getElementById('ov-p-role').oninput = (e) => { state.player.role = e.target.value; save(); };
        document.getElementById('ov-p-cycle').onchange = (e) => { state.player.cycle.active = e.target.checked; state.player.cycle.type = state.player.status === 'omega' ? 'heat' : 'rut'; save(); };
    }
    if (state.activeTab === 'npcs') {
        panel.querySelectorAll('.ov-npc-trauma').forEach(select => {
            select.onchange = (e) => { const idx = e.target.dataset.index; state.npcs[idx].trauma = e.target.value; save(); };
        });
        panel.querySelectorAll('.ov-npc-trauma-desc').forEach(input => {
            input.oninput = (e) => { const idx = e.target.dataset.index; state.npcs[idx].traumaDescription = e.target.value; save(); };
        });
    }
    if (state.activeTab === 'calendar') {
        document.getElementById('ov-calendar-season-select').onchange = (e) => { state.calendar.season = e.target.value; save(); updateUI(); };
        document.getElementById('ov-cal-prev').onclick = () => changeCalendarMonth(-1);
        document.getElementById('ov-cal-next').onclick = () => changeCalendarMonth(1);
    }
    if (state.activeTab === 'settings') {
        document.getElementById('ov-opt-enabled').onchange = (e) => { state.enabled = e.target.checked; save(); };
        document.getElementById('ov-opt-auto').onchange = (e) => { state.autoDetect = e.target.checked; save(); };
        document.getElementById('ov-opt-interval').onchange = (e) => { state.promptInterval = parseInt(e.target.value) || 10; save(); };
        document.getElementById('ov-btn-reset').onclick = () => { if(confirm("Очистить все данные расширения?")) { localStorage.removeItem('ov_dynamics_monolith_state'); location.reload(); } };
    }
}

// ============================================================
// 6. РЕГИСТРАЦИЯ РАСШИРЕНИЯ В SILLYTAVERN
// ============================================================
registerExtension("Omegaverse-Dynamics", {
    onLoad: () => {
        load();

        // 1. Создаём плавающую кнопку на чистом JS (без jQuery зависимостей)
        const btn = document.createElement('div');
        btn.id = 'ov-mini-btn';
        btn.innerHTML = '☯️';
        btn.title = "Открыть Omegaverse Dynamics";
        document.body.appendChild(btn);

        // 2. Создаём главное всплывающее окно
        const panel = document.createElement('div');
        panel.id = 'ov-main-panel';
        panel.style.display = 'none'; // По умолчанию скрыто
        panel.innerHTML = `
            <div class="ov-header">
                <h3>🌙 OMEGA DYNAMICS</h3>
                <button id="ov-close" style="background:transparent; border:none; color:white; font-size:22px; cursor:pointer; line-height:1;">&times;</button>
            </div>
            <div class="ov-tabs">
                <button class="ov-tab-btn" id="ov-tab-player">👤 Я</button>
                <button class="ov-tab-btn" id="ov-tab-npcs">👥 NPC</button>
                <button class="ov-tab-btn" id="ov-tab-calendar">📅 Циклы</button>
                <button class="ov-tab-btn" id="ov-tab-facts">🧠 Память</button>
                <button class="ov-tab-btn" id="ov-tab-settings">⚙️ Опции</button>
            </div>
            <div class="ov-content"></div>
        `;
        document.body.appendChild(panel);

        // 3. Логика переключения менюшек по клику
        btn.onclick = () => {
            if (panel.style.display === 'none') {
                panel.style.display = 'flex';
                updateUI();
            } else {
                panel.style.display = 'none';
            }
        };

        panel.querySelector('#ov-close').onclick = () => {
            panel.style.display = 'none';
        };

        // Назначаем вкладки кликабельными
        ['player', 'npcs', 'calendar', 'facts', 'settings'].forEach(tabName => {
            panel.querySelector(`#ov-tab-${tabName}`).onclick = () => {
                state.activeTab = tabName;
                save();
                updateUI();
            };
        });
    }
});