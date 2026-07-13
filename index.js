import { registerExtension } from "../../extensions.js";

// ============================================================
// ГЛОБАЛЬНОЕ СОСТОЯНИЕ (ДАННЫЕ)
// ============================================================
let state = {
    activeTab: 'calendar',
    calendar: {
        currentDate: new Date().toISOString().split('T')[0],
        viewDate: new Date().toISOString().split('T')[0],
        season: 'spring'
    },
    npcs: [
        { name: "Алекс", gender: "omega", cycle: { active: true, type: "heat", startDate: "2026-07-15" }, mark: { has: true, date: "2026-07-10" } },
        { name: "Дамиан", gender: "alpha", cycle: { active: true, type: "rut", startDate: "2026-07-20" }, mark: { has: false, date: "" } }
    ]
};

// Сохранение и загрузка в браузер
const save = () => localStorage.setItem('ov_dynamics_state', JSON.stringify(state));
const load = () => {
    const saved = localStorage.getItem('ov_dynamics_state');
    if (saved) {
        try { state = JSON.parse(saved); } catch (e) { console.error("Ошибка загрузки данных Omegaverse:", e); }
    }
};

const getMonthName = (m) => ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"][m];

// ============================================================
// ЛОГИКА КАЛЕНДАРЯ
// ============================================================
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

window.ovShowDayEvents = function(dateStr) {
    const eventsContainer = document.getElementById('ov-day-events');
    if (!eventsContainer) return;

    let html = ``;
    const dayEvents = [];

    state.npcs.forEach(npc => {
        if (npc.cycle.active && npc.cycle.startDate === dateStr) {
            dayEvents.push(`<div style="margin-bottom:4px;">🔥 <b>${npc.name}</b>: Начало периода (${npc.cycle.type === 'heat' ? 'Течка' : 'Гон'})</div>`);
        }
        if (npc.mark.has && npc.mark.date === dateStr) {
            dayEvents.push(`<div style="margin-bottom:4px;">💖 <b>${npc.name}</b>: Была поставлена метка</div>`);
        }
    });

    if (dayEvents.length === 0) {
        html = `<div class="ov-text-muted">Нет важных событий на ${dateStr}</div>`;
    } else {
        html = `<div><b>Дата: ${dateStr}</b></div><hr style="border-color:rgba(255,255,255,0.1); margin:8px 0;">` + dayEvents.join('');
    }

    eventsContainer.innerHTML = html;
};

// ============================================================
// ГЕНЕРАЦИЯ ИНТЕРФЕЙСА
// ============================================================
function renderInterface() {
    let seasonClass = `ov-season-${state.calendar.season}`;
    let decorEmoji = '🌸';
    if (state.calendar.season === 'summer') decorEmoji = '🌻';
    if (state.calendar.season === 'autumn') decorEmoji = '🍁';
    if (state.calendar.season === 'winter') decorEmoji = '❄️';

    // Вкладки
    let html = `
    <div class="ov-tabs">
        <button class="ov-tab-btn ${state.activeTab === 'calendar' ? 'active' : ''}" id="ov-tab-calendar">📅 Календарь</button>
        <button class="ov-tab-btn ${state.activeTab === 'npcs' ? 'active' : ''}" id="ov-tab-npcs">👥 Персонажи</button>
    </div>
    <div class="ov-content">
    `;

    if (state.activeTab === 'calendar') {
        html += `
        <div class="ov-row">
            <label style="font-size:12px; font-weight:bold;">Сезон интерфейса:</label>
            <select class="ov-select ov-flex" id="ov-calendar-season-select">
                <option value="spring" ${state.calendar.season === 'spring' ? 'selected' : ''}>🌸 Весна</option>
                <option value="summer" ${state.calendar.season === 'summer' ? 'selected' : ''}>🌻 Лето</option>
                <option value="autumn" ${state.calendar.season === 'autumn' ? 'selected' : ''}>🍁 Осень</option>
                <option value="winter" ${state.calendar.season === 'winter' ? 'selected' : ''}>❄️ Зима</option>
            </select>
        </div>

        <div class="ov-calendar-beautiful ${seasonClass}">
            <div class="ov-season-decor">${decorEmoji}</div>
            <div class="ov-calendar-nav" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <button class="ov-btn" id="ov-cal-prev" style="padding:4px 10px;"><i class="fa-solid fa-chevron-left"></i></button>
                <span style="font-weight:900; font-size:16px;">${getMonthName(new Date(state.calendar.viewDate).getMonth())} ${new Date(state.calendar.viewDate).getFullYear()}</span>
                <button class="ov-btn" id="ov-cal-next" style="padding:4px 10px;"><i class="fa-solid fa-chevron-right"></i></button>
            </div>
            <div class="ov-calendar-grid" style="display:grid; grid-template-columns:repeat(7,1fr); gap:6px; text-align:center; font-size:12px;">
        `;

        // Сетка дней недели
        ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].forEach(d => {
            html += `<div style="font-weight:800; opacity:0.7; padding-bottom:4px;">${d}</div>`;
        });

        // Расчет дней месяца
        const viewDate = new Date(state.calendar.viewDate);
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const todayStr = new Date().toISOString().split('T')[0];
        let startOffset = (firstDay === 0) ? 6 : firstDay - 1;

        for (let i = 0; i < startOffset; i++) {
            html += `<div></div>`;
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            let dayClass = 'ov-cal-day';
            
            if (dateStr === todayStr) dayClass += ' cal-today';

            // Ищем события персонажей для этого дня
            state.npcs.forEach(npc => {
                if (npc.cycle.active && npc.cycle.startDate === dateStr) {
                    dayClass += npc.cycle.type === 'heat' ? ' event-heat' : ' event-rut';
                } else if (npc.mark.has && npc.mark.date === dateStr) {
                    dayClass += ' event-mark';
                }
            });

            html += `<div class="${dayClass}" data-date="${dateStr}" onclick="ovShowDayEvents('${dateStr}')">${day}</div>`;
        }

        html += `
            </div>
        </div>
        <div class="ov-section-title"><i class="fa-solid fa-list"></i> События дня</div>
        <div id="ov-day-events" style="padding:12px; background:rgba(0,0,0,0.2); border-radius:12px; font-size:13px;">
            <div class="ov-text-muted">Нажмите на любой день с событием...</div>
        </div>
        `;
    } else if (state.activeTab === 'npcs') {
        html += `<div class="ov-section-title">Список персонажей</div>`;
        state.npcs.forEach(npc => {
            let badgeClass = npc.gender === 'alpha' ? 'ov-status-alpha' : npc.gender === 'omega' ? 'ov-status-omega' : 'ov-status-beta';
            html += `
            <div class="ov-card">
                <div class="ov-row">
                    <b>${npc.name}</b>
                    <span class="ov-status-badge ${badgeClass}">${npc.gender}</span>
                </div>
                <div style="font-size:12px; opacity:0.8;">
                    Цикл: ${npc.cycle.active ? `${npc.cycle.type === 'heat' ? 'Течка' : 'Гон'} (с ${npc.cycle.startDate})` : 'Нет данных'}<br>
                    Метка: ${npc.mark.has ? `Есть (от ${npc.mark.date})` : 'Отсутствует'}
                </div>
            </div>`;
        });
    }

    html += `</div>`; // Конец ov-content
    return html;
}

function updateUI() {
    const panel = document.getElementById('ov-main-panel');
    if (!panel) return;

    panel.innerHTML = `
        <div class="ov-header">
            <h3>🌙 OMEGA DYNAMICS</h3>
            <button id="ov-close" style="background:transparent; border:none; color:white; font-size:20px; cursor:pointer;">&times;</button>
        </div>
    ` + renderInterface();

    // Навешивание обработчиков кликов после вставки HTML
    document.getElementById('ov-close').onclick = () => panel.style.display = 'none';
    
    const tabCal = document.getElementById('ov-tab-calendar');
    const tabNpc = document.getElementById('ov-tab-npcs');
    const seasonSelect = document.getElementById('ov-calendar-season-select');
    const prevBtn = document.getElementById('ov-cal-prev');
    const nextBtn = document.getElementById('ov-cal-next');

    if (tabCal) tabCal.onclick = () => { state.activeTab = 'calendar'; save(); updateUI(); };
    if (tabNpc) tabNpc.onclick = () => { state.activeTab = 'npcs'; save(); updateUI(); };
    if (seasonSelect) seasonSelect.onchange = (e) => { state.calendar.season = e.target.value; save(); updateUI(); };
    if (prevBtn) prevBtn.onclick = () => changeCalendarMonth(-1);
    if (nextBtn) nextBtn.onclick = () => changeCalendarMonth(1);
}

// ============================================================
// ИНИЦИАЛИЗАЦИЯ РАСШИРЕНИЯ СИЛЛИ ТАВЕРНЫ
// ============================================================
registerExtension("Omegaverse-Dynamics", {
    onLoad: () => {
        load();

        // Создаем плавающую кнопку
        const btn = document.createElement('div');
        btn.id = 'ov-mini-btn';
        btn.innerHTML = '☯️';
        btn.title = "Открыть Omegaverse Dynamics";
        document.body.appendChild(btn);

        // Создаем скрытую панель меню
        const panel = document.createElement('div');
        panel.id = 'ov-main-panel';
        panel.style.display = 'none';
        document.body.appendChild(panel);

        // Поведение кнопки при клике
        btn.onclick = () => {
            if (panel.style.display === 'none') {
                panel.style.display = 'flex';
                updateUI();
            } else {
                panel.style.display = 'none';
            }
        };
    }
});