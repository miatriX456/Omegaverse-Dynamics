// Omegaverse Dynamics — Автономный движок Омегаверса для SillyTavern
// Концепция: @user, реализация: assistant

// ========== ХРАНИЛИЩЕ ЗАПАХОВ ==========
const SCENTS = {
    soft: ['лаванда', 'ромашка', 'ваниль', 'хлопок', 'молоко', 'миндаль', 'персик'],
    sweet: ['карамель', 'шоколад', 'мёд', 'клубника', 'вишня', 'арбуз'],
    musky: ['мускус', 'амбра', 'сандал', 'пачули', 'уд'],
    woody: ['кедр', 'сосна', 'дуб', 'можжевельник', 'кипарис'],
    leather: ['кожа', 'табак', 'дым', 'спирт', 'порох'],
    fresh: ['мята', 'эвкалипт', 'цитрус', 'морской бриз', 'озон', 'дождь'],
    spicy: ['корица', 'гвоздика', 'имбирь', 'кардамон', 'перец'],
    dark: ['сера', 'пепел', 'металл', 'озон перед грозой', 'сырая земля']
};

// ========== СОСТОЯНИЕ ==========
class OmegaverseState {
    constructor() {
        this.data = {
            player: {
                name: 'Я',
                status: 'Beta',       // Alpha, Beta, Omega
                fakeStatus: null,
                role: '',
                scent: '',
                secondaryScent: '',
                nuance: '',
                territoryScent: '',
                cycle: { type: null, start: null, duration: 5, interval: 28, active: false },
                mark: { has: false, by: null, on: null },
                bond: { has: false, partner: null },
                interests: { romantic: [], sexual: [] },
                trauma: { level: 'none', description: '' }
            },
            npcs: {},
            calendar: { currentDate: new Date().toISOString().slice(0,10) },
            memory: [],
            settings: {
                enabled: true,
                forceOmegaverse: true,
                reminderInterval: 3,   // каждые N сообщений
                showFloatingBtn: true,
                autoDetect: { status: true, cycle: true, scent: true, mark: true, bond: true, trauma: true, npc: true }
            }
        };
        this.load();
    }

    load() {
        const saved = localStorage.getItem('ov_state');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                this.data = deepMerge(this.data, parsed);
            } catch(e) { console.warn('OV state corrupted, resetting'); }
        }
    }

    save() {
        localStorage.setItem('ov_state', JSON.stringify(this.data));
    }

    getPlayer() { return this.data.player; }
    getNPCs() { return this.data.npcs; }
    getNPC(name) { return this.data.npcs[name]; }
    addNPC(name) {
        if (this.data.npcs[name]) return this.data.npcs[name];
        const npc = {
            name,
            status: 'Beta',
            fakeStatus: null,
            role: '',
            scent: '',
            secondaryScent: '',
            nuance: '',
            territoryScent: '',
            cycle: { type: null, start: null, duration: 5, interval: 28, active: false },
            mark: { has: false, by: null, on: null },
            bond: { has: false, partner: null },
            interests: { romantic: [], sexual: [] },
            trauma: { level: 'none', description: '' },
            history: []
        };
        this.data.npcs[name] = npc;
        this.save();
        return npc;
    }
    updateNPC(name, changes) {
        if (!this.data.npcs[name]) return;
        Object.assign(this.data.npcs[name], changes);
        this.save();
    }
    updatePlayer(changes) {
        Object.assign(this.data.player, changes);
        this.save();
    }
    addMemory(fact) {
        this.data.memory.push({ timestamp: new Date().toISOString(), text: fact });
        if (this.data.memory.length > 200) this.data.memory.shift();
        this.save();
    }
    getMemories(limit = 10) {
        return this.data.memory.slice(-limit).map(m => m.text);
    }
    setSetting(key, value) {
        this.data.settings[key] = value;
        this.save();
    }
}

function deepMerge(target, source) {
    for (let key in source) {
        if (source[key] instanceof Object && key in target) {
            deepMerge(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
    return target;
}

// ========== ПАРСЕР СООБЩЕНИЙ ==========
class OmegaverseParser {
    constructor(state) {
        this.state = state;
        // запрещённые слова (игнорируются как имена)
        this.forbiddenNames = new Set([
            'it','he','she','they','i','you','we','me','him','her','us','them',
            'я','ты','он','она','оно','мы','вы','они','мне','тебе','ему','ей','нам','вам','им',
            'of','to','in','for','on','with','at','by','from','up','about',
            'и','в','на','с','по','к','у','о','от','до','без','для','из',
            'note','remette','ooc','system','author','operational','status','role',
            'man','woman','boy','girl','doctor','генерал','капитан','лорд','леди',
            'day','night','morning','evening','год','месяц','неделя','сегодня','вчера','завтра'
        ]);
        // регекс для имён с заглавной буквы (латиница + кириллица)
        this.nameRegex = /\b([A-ZА-Я][a-zа-яё]+)\b/g;
        // ключевые слова
        this.statusWords = {
            alpha: /\b(альфа|alpha|доминант|лидер)\b/gi,
            omega: /\b(омега|omega|подчинённый|сабмиссив)\b/gi,
            beta: /\b(бета|beta|нейтральный)\b/gi
        };
        this.cycleWords = {
            heat: /\b(течка|heat|период)\b/gi,
            rut: /\b(гон|rut|агрессия)\b/gi
        };
        this.scentWords = new RegExp(Object.values(SCENTS).flat().join('|'), 'gi');
        this.markWords = /\b(поставил\s*метку|пометил|укусил\s*за\s*шею|mark|marked)\b/gi;
        this.bondWords = /\b(связан\w*|bond|связь)\b/gi;
        this.traumaWords = {
            severe: /(изнасилова\w*|насилова\w*|травм\w*|ужас|кошмар|кровь|рана|шрам|боль|страх|агрессия|кричать|плакать|убийство|смерть)/gi,
            mild: /(неприятность|конфликт|обида|разочарование|потеря|горе|слёзы|тревога)/gi
        };
    }

    parseMessage(message) {
        if (!this.state.data.settings.enabled) return;
        const text = message.content || message;
        // 1. Обнаружение статусов
        this.detectStatus(text);
        // 2. Обнаружение циклов
        this.detectCycles(text);
        // 3. Обнаружение запахов
        this.detectScents(text);
        // 4. Обнаружение меток
        this.detectMarks(text);
        // 5. Обнаружение связей
        this.detectBonds(text);
        // 6. Обнаружение травм
        this.detectTraumas(text);
        // 7. Обнаружение новых NPC (имена)
        this.detectNewNPCs(text);
    }

    detectStatus(text) {
        const player = this.state.getPlayer();
        const npcs = this.state.getNPCs();
        const characters = [player, ...Object.values(npcs)];
        // Простейший подход: если нашли слово статуса и рядом имя, обновить.
        // Но без привязки к конкретному персонажу — обновляем того, кто упоминается рядом.
        const matches = this.extractStatusMentions(text);
        for (let match of matches) {
            const { name, status } = match;
            if (name === player.name) {
                if (player.status !== status) {
                    player.status = status;
                    this.state.addMemory(`${player.name} теперь ${status}`);
                    toastr.info(`${player.name} теперь ${status}`);
                }
            } else if (npcs[name]) {
                if (npcs[name].status !== status) {
                    npcs[name].status = status;
                    this.state.addMemory(`${name} теперь ${status}`);
                    toastr.info(`${name} теперь ${status}`);
                }
            }
        }
    }

    extractStatusMentions(text) {
        // Ищем упоминания статусов и ближайшее имя (до или после)
        const names = [...text.matchAll(this.nameRegex)].map(m => m[1]).filter(n => !this.forbiddenNames.has(n.toLowerCase()));
        const statuses = [];
        for (let [type, regex] of Object.entries(this.statusWords)) {
            let statusMatch;
            while ((statusMatch = regex.exec(text)) !== null) {
                const pos = statusMatch.index;
                // ищем ближайшее имя слева или справа
                let closestName = null;
                let minDist = Infinity;
                for (let name of names) {
                    const idx = text.indexOf(name);
                    if (idx === -1) continue;
                    const dist = Math.abs(idx - pos);
                    if (dist < minDist) {
                        minDist = dist;
                        closestName = name;
                    }
                }
                if (closestName) {
                    statuses.push({ name: closestName, status: type.charAt(0).toUpperCase() + type.slice(1) }); // Alpha, Omega, Beta
                }
            }
        }
        return statuses;
    }

    detectCycles(text) {
        const player = this.state.getPlayer();
        const npcs = this.state.getNPCs();
        const characters = [player, ...Object.values(npcs)];
        const now = this.state.data.calendar.currentDate;
        for (let [type, regex] of Object.entries(this.cycleWords)) {
            if (regex.test(text)) {
                const cycleType = type === 'heat' ? 'heat' : 'rut';
                // находим ближайшее имя
                const names = [...text.matchAll(this.nameRegex)].map(m => m[1]).filter(n => !this.forbiddenNames.has(n.toLowerCase()));
                let targetName = null;
                // ищем имя в том же предложении
                const sentences = text.split(/[.!?]+/);
                for (let s of sentences) {
                    if (regex.test(s)) {
                        const nameMatch = s.match(this.nameRegex);
                        if (nameMatch) {
                            const n = nameMatch[1];
                            if (!this.forbiddenNames.has(n.toLowerCase())) {
                                targetName = n;
                                break;
                            }
                        }
                    }
                }
                if (!targetName && names.length > 0) targetName = names[0]; // fallback
                if (targetName) {
                    const char = targetName === player.name ? player : npcs[targetName];
                    if (char && !char.cycle.active) {
                        char.cycle.type = cycleType;
                        char.cycle.start = now;
                        char.cycle.active = true;
                        this.state.addMemory(`У ${targetName} начался ${cycleType === 'heat' ? 'течка' : 'гон'} (${now})`);
                        toastr.info(`🔥 У ${targetName} начался ${cycleType === 'heat' ? 'течка' : 'гон'}`);
                        this.state.save();
                    }
                }
            }
        }
    }

    detectScents(text) {
        const allScents = Object.values(SCENTS).flat();
        for (let scent of allScents) {
            const regex = new RegExp(scent, 'i');
            if (regex.test(text)) {
                const player = this.state.getPlayer();
                const npcs = this.state.getNPCs();
                // ищем ближайшего персонажа
                let targetName = this.findClosestCharacter(text, scent);
                if (targetName) {
                    const char = targetName === player.name ? player : npcs[targetName];
                    if (char && !char.scent) {
                        char.scent = scent;
                        this.state.addMemory(`Запах ${targetName}: ${scent}`);
                        toastr.info(`🌸 Запах ${targetName}: ${scent}`);
                        this.state.save();
                    }
                }
            }
        }
    }

    detectMarks(text) {
        if (!this.markWords.test(text)) return;
        const player = this.state.getPlayer();
        const npcs = this.state.getNPCs();
        // попытаемся найти кто кого пометил: "X поставил метку Y"
        const markPattern = /(\w+)\s+(поставил\w*\s*метку|пометил|mark(?:ed)?)\s+(\w+)/i;
        const match = text.match(markPattern);
        if (match) {
            const marker = match[1];
            const target = match[3];
            const targetChar = target === player.name ? player : npcs[target];
            if (targetChar) {
                targetChar.mark.has = true;
                targetChar.mark.by = marker;
                this.state.addMemory(`${marker} пометил(а) ${target}`);
                toastr.info(`🦷 ${marker} пометил(а) ${target}`);
                this.state.save();
            }
        }
    }

    detectBonds(text) {
        if (!this.bondWords.test(text)) return;
        const player = this.state.getPlayer();
        const npcs = this.state.getNPCs();
        const bondPattern = /(\w+)\s+(?:и|and|с)\s+(\w+)\s+(?:связан\w*|bond|связь)/i;
        const match = text.match(bondPattern);
        if (match) {
            const a = match[1], b = match[2];
            const charA = a === player.name ? player : npcs[a];
            const charB = b === player.name ? player : npcs[b];
            if (charA) { charA.bond.has = true; charA.bond.partner = b; }
            if (charB) { charB.bond.has = true; charB.bond.partner = a; }
            this.state.addMemory(`Связь между ${a} и ${b}`);
            toastr.info(`💞 Связь между ${a} и ${b}`);
            this.state.save();
        }
    }

    detectTraumas(text) {
        const player = this.state.getPlayer();
        const npcs = this.state.getNPCs();
        const characters = [player, ...Object.values(npcs)];
        for (let [level, regex] of Object.entries(this.traumaWords)) {
            if (regex.test(text)) {
                const sentences = text.split(/[.!?]+/);
                for (let s of sentences) {
                    if (regex.test(s)) {
                        const nameMatch = s.match(this.nameRegex);
                        if (nameMatch) {
                            const name = nameMatch[1];
                            const char = name === player.name ? player : npcs[name];
                            if (char && char.trauma.level === 'none') {
                                char.trauma.level = level;
                                char.trauma.description = s.trim().slice(0, 200);
                                this.state.addMemory(`Травма ${name} (${level}): ${s.trim().slice(0, 100)}`);
                                toastr.info(`⚠️ У ${name} обнаружена травма (${level})`);
                                this.state.save();
                            }
                        }
                    }
                }
            }
        }
    }

    detectNewNPCs(text) {
        const names = text.match(this.nameRegex);
        if (!names) return;
        const player = this.state.getPlayer();
        for (let name of names) {
            const n = name;
            if (this.forbiddenNames.has(n.toLowerCase())) continue;
            if (n === player.name) continue;
            if (this.state.getNPCs()[n]) continue;
            // добавляем нового NPC со статусом Beta
            this.state.addNPC(n);
            this.state.addMemory(`Обнаружен новый персонаж: ${n} (Beta)`);
            toastr.info(`👤 Новый NPC: ${n}`);
        }
    }

    findClosestCharacter(text, keyword) {
        const player = this.state.getPlayer();
        const npcs = this.state.getNPCs();
        const allNames = [player.name, ...Object.keys(npcs)];
        let minDist = Infinity;
        let closest = null;
        const pos = text.indexOf(keyword);
        for (let name of allNames) {
            const idx = text.indexOf(name);
            if (idx !== -1 && Math.abs(idx - pos) < minDist) {
                minDist = Math.abs(idx - pos);
                closest = name;
            }
        }
        return closest;
    }
}

// ========== ГЕНЕРАТОР ПРОМПТА ==========
function buildSystemPrompt(state) {
    if (!state.data.settings.forceOmegaverse) return '';
    const player = state.getPlayer();
    const npcs = Object.values(state.getNPCs());
    let prompt = `[Omegaverse Context]\n`;
    prompt += `Ты — ${player.status}. Твой запах: ${player.scent || 'неизвестен'}.\n`;
    if (player.cycle.active) prompt += `У тебя сейчас ${player.cycle.type === 'heat' ? 'течка' : 'гон'} (с ${player.cycle.start}).\n`;
    if (player.mark.has) prompt += `Ты помечен(а) ${player.mark.by}.\n`;
    if (player.bond.has) prompt += `Ты связан(а) с ${player.bond.partner}.\n`;
    if (player.trauma.level !== 'none') prompt += `Травма (${player.trauma.level}): ${player.trauma.description}\n`;

    for (let npc of npcs) {
        prompt += `\nПерсонаж ${npc.name}: статус ${npc.status}, запах ${npc.scent || '?'}`;
        if (npc.cycle.active) prompt += `, ${npc.cycle.type === 'heat' ? 'течка' : 'гон'} (с ${npc.cycle.start})`;
        if (npc.mark.has) prompt += `, помечен(а) ${npc.mark.by}`;
        if (npc.bond.has) prompt += `, связь с ${npc.bond.partner}`;
        if (npc.trauma.level !== 'none') prompt += `, травма (${npc.trauma.level})`;
        prompt += '.';
    }
    return prompt;
}

// ========== UI ==========
class OmegaverseUI {
    constructor(state, parser) {
        this.state = state;
        this.parser = parser;
        this.window = null;
        this.init();
    }

    init() {
        // Плавающая кнопка
        const btn = document.createElement('div');
        btn.id = 'ov-floating-btn';
        btn.innerHTML = '🧬';
        btn.title = 'Omegaverse Dynamics';
        btn.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999;width:50px;height:50px;background:var(--SmartThemeBodyColor);border:2px solid var(--SmartThemeBorderColor);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.3);';
        btn.addEventListener('click', () => this.toggleWindow());
        document.body.appendChild(btn);

        // Окно
        this.buildWindow();
        this.window.style.display = 'none';
        document.body.appendChild(this.window);
    }

    buildWindow() {
        const win = document.createElement('div');
        win.id = 'ov-window';
        win.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:90vw;max-width:800px;height:80vh;background:var(--SmartThemeBlurTintColor);backdrop-filter:blur(10px);border:1px solid var(--SmartThemeBorderColor);border-radius:12px;z-index:10000;display:flex;flex-direction:column;overflow:hidden;color:var(--SmartThemeBodyColor);';
        win.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:10px;background:var(--SmartThemeHeaderBg);border-bottom:1px solid var(--SmartThemeBorderColor);">
                <span style="font-weight:bold;">🧬 Omegaverse Dynamics</span>
                <button id="ov-close" style="background:none;border:none;color:var(--SmartThemeBodyColor);font-size:20px;cursor:pointer;">✕</button>
            </div>
            <div style="display:flex;border-bottom:1px solid var(--SmartThemeBorderColor);">
                <button class="ov-tab active" data-tab="me">Я</button>
                <button class="ov-tab" data-tab="npcs">NPC</button>
                <button class="ov-tab" data-tab="calendar">Календарь</button>
                <button class="ov-tab" data-tab="world">Мир</button>
                <button class="ov-tab" data-tab="settings">Настройки</button>
            </div>
            <div id="ov-tab-content" style="flex:1;overflow-y:auto;padding:15px;"></div>
        `;
        this.window = win;

        // Обработчики вкладок
        win.querySelectorAll('.ov-tab').forEach(btn => {
            btn.addEventListener('click', (e) => {
                win.querySelectorAll('.ov-tab').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.renderTab(e.target.dataset.tab);
            });
        });
        win.querySelector('#ov-close').addEventListener('click', () => this.toggleWindow(false));
    }

    toggleWindow(force) {
        if (this.window.style.display === 'none' || force === true) {
            this.window.style.display = 'flex';
            this.renderTab('me');
        } else {
            this.window.style.display = 'none';
        }
    }

    renderTab(tab) {
        const container = document.getElementById('ov-tab-content');
        if (!container) return;
        container.innerHTML = '';
        switch(tab) {
            case 'me': this.renderPlayerTab(container); break;
            case 'npcs': this.renderNPCsTab(container); break;
            case 'calendar': this.renderCalendar(container); break;
            case 'world': this.renderWorldTab(container); break;
            case 'settings': this.renderSettingsTab(container); break;
        }
    }

    renderPlayerTab(container) {
        const p = this.state.getPlayer();
        container.innerHTML = `
            <h3>Мой профиль</h3>
            <div><b>Статус:</b> ${p.status} ${p.fakeStatus ? `(притворяется: ${p.fakeStatus})` : ''}</div>
            <div><b>Запах:</b> ${p.scent || '—'}</div>
            <div><b>Цикл:</b> ${p.cycle.active ? `${p.cycle.type} (с ${p.cycle.start})` : '—'}</div>
            <div><b>Метка:</b> ${p.mark.has ? `помечен(а) ${p.mark.by}` : '—'}</div>
            <div><b>Связь:</b> ${p.bond.has ? `связан(а) с ${p.bond.partner}` : '—'}</div>
            <div><b>Травма:</b> ${p.trauma.level} — ${p.trauma.description || '—'}</div>
            <hr/>
            <h4>Редактировать</h4>
            <button onclick="window.OV_UI.editPlayer()">Изменить</button>
            <button onclick="window.OV_UI.addMemoryPrompt()">Добавить факт</button>
        `;
    }

    renderNPCsTab(container) {
        const npcs = Object.values(this.state.getNPCs());
        if (npcs.length === 0) {
            container.innerHTML = '<p>Пока нет NPC.</p>';
            return;
        }
        let html = '<h3>Персонажи</h3>';
        npcs.forEach(npc => {
            html += `
                <div class="ov-npc-card" style="border:1px solid var(--SmartThemeBorderColor);padding:10px;margin-bottom:10px;border-radius:8px;">
                    <b>${npc.name}</b> <span style="background:var(--SmartThemeQuoteBg);padding:2px 8px;border-radius:4px;">${npc.status}</span>
                    <div style="margin-top:5px;">Запах: ${npc.scent || '?'}</div>
                    <div>Цикл: ${npc.cycle.active ? `${npc.cycle.type} (с ${npc.cycle.start})` : '—'}</div>
                    <button onclick="window.OV_UI.editNPC('${npc.name}')">✏️</button>
                    <button onclick="window.OV_UI.deleteNPC('${npc.name}')">🗑️</button>
                </div>
            `;
        });
        container.innerHTML = html;
    }

    renderCalendar(container) {
        const date = new Date(this.state.data.calendar.currentDate + 'T00:00:00');
        const year = date.getFullYear();
        const month = date.getMonth();
        const today = new Date().toISOString().slice(0,10);

        const firstDay = new Date(year, month, 1).getDay() || 7; // понедельник=1
        const daysInMonth = new Date(year, month+1, 0).getDate();
        let html = `<h3>${date.toLocaleString('ru', {month:'long', year:'numeric'})}</h3>`;
        html += '<div style="display:flex;gap:5px;margin-bottom:10px;"><button onclick="window.OV_UI.changeMonth(-1)">← Пред.</button><button onclick="window.OV_UI.changeMonth(1)">След. →</button></div>';
        html += '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;">';
        const daysOfWeek = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
        daysOfWeek.forEach(d => html += `<div style="text-align:center;font-weight:bold;">${d}</div>`);
        for (let i = 1; i < firstDay; i++) html += '<div></div>';
        for (let d = 1; d <= daysInMonth; d++) {
            const iso = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
            let bg = '';
            if (iso === today) bg = 'background:#4caf50;border-radius:50%;';
            const events = this.getDayEvents(iso);
            if (events.includes('heat/rut')) bg = 'background:#f44336;border-radius:50%;';
            else if (events.includes('mark')) bg = 'background:#ffeb3b;border-radius:50%;';
            html += `<div style="text-align:center;padding:5px;${bg}" title="${events.join(', ')}">${d}</div>`;
        }
        html += '</div>';
        container.innerHTML = html;
    }

    getDayEvents(dateStr) {
        const events = [];
        const p = this.state.getPlayer();
        if (p.cycle.active && p.cycle.start === dateStr) events.push('heat/rut');
        if (p.mark.has && p.mark.by && false) events.push('mark'); // упрощённо
        for (let npc of Object.values(this.state.getNPCs())) {
            if (npc.cycle.active && npc.cycle.start === dateStr) events.push('heat/rut');
        }
        return events;
    }

    changeMonth(delta) {
        const d = new Date(this.state.data.calendar.currentDate + 'T00:00:00');
        d.setMonth(d.getMonth() + delta);
        this.state.data.calendar.currentDate = d.toISOString().slice(0,10);
        this.state.save();
        this.renderTab('calendar');
    }

    renderWorldTab(container) {
        container.innerHTML = '<h3>Глобальные события</h3><p>Пока пусто.</p>';
    }

    renderSettingsTab(container) {
        const s = this.state.data.settings;
        container.innerHTML = `
            <h3>Настройки</h3>
            <label><input type="checkbox" ${s.enabled ? 'checked' : ''} onchange="window.OV_UI.toggleSetting('enabled')"> Включено</label><br>
            <label><input type="checkbox" ${s.forceOmegaverse ? 'checked' : ''} onchange="window.OV_UI.toggleSetting('forceOmegaverse')"> Принудительный Омегаверс</label><br>
            <button onclick="window.OV_UI.exportData()">Экспорт JSON</button>
            <button onclick="window.OV_UI.importData()">Импорт JSON</button>
        `;
    }

    toggleSetting(key) {
        const current = this.state.data.settings[key];
        this.state.setSetting(key, !current);
        this.renderTab('settings');
    }

    editPlayer() {
        const newStatus = prompt('Введите статус (Alpha/Beta/Omega):', this.state.getPlayer().status);
        if (newStatus) this.state.updatePlayer({ status: newStatus });
        this.renderTab('me');
    }

    editNPC(name) {
        const npc = this.state.getNPC(name);
        if (!npc) return;
        const newStatus = prompt(`Статус ${name}:`, npc.status);
        if (newStatus) this.state.updateNPC(name, { status: newStatus });
        this.renderTab('npcs');
    }

    deleteNPC(name) {
        if (confirm(`Удалить ${name}?`)) {
            delete this.state.data.npcs[name];
            this.state.save();
            this.renderTab('npcs');
        }
    }

    addMemoryPrompt() {
        const fact = prompt('Введите факт:');
        if (fact) {
            this.state.addMemory(fact);
            alert('Факт добавлен!');
        }
    }

    exportData() {
        const blob = new Blob([JSON.stringify(this.state.data, null, 2)], {type:'application/json'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'omegaverse_state.json';
        a.click();
    }

    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const data = JSON.parse(ev.target.result);
                    this.state.data = deepMerge(this.state.data, data);
                    this.state.save();
                    alert('Импортировано!');
                    this.renderTab('settings');
                } catch (err) { alert('Ошибка чтения файла.'); }
            };
            reader.readAsText(file);
        };
        input.click();
    }
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
const OV_STATE = new OmegaverseState();
const OV_PARSER = new OmegaverseParser(OV_STATE);
let OV_UI;

// Подписка на события SillyTavern
if (typeof window.SillyTavern !== 'undefined') {
    window.SillyTavern.getContext().eventSource.on('MESSAGE_RECEIVED', (data) => {
        OV_PARSER.parseMessage(data);
        // Обновление системного промпта раз в N сообщений
        if (OV_STATE.data.settings.forceOmegaverse) {
            const count = parseInt(localStorage.getItem('ov_msg_count') || '0') + 1;
            localStorage.setItem('ov_msg_count', count);
            if (count % OV_STATE.data.settings.reminderInterval === 0) {
                const prompt = buildSystemPrompt(OV_STATE);
                window.SillyTavern.getContext().setExtensionPrompt('omegaverse', prompt);
            }
        }
    });

    // Инициализация UI после загрузки DOM
    document.addEventListener('DOMContentLoaded', () => {
        OV_UI = new OmegaverseUI(OV_STATE, OV_PARSER);
        window.OV_UI = OV_UI; // глобальный доступ для onclick в HTML
        if (OV_STATE.data.settings.forceOmegaverse) {
            const prompt = buildSystemPrompt(OV_STATE);
            window.SillyTavern.getContext().setExtensionPrompt('omegaverse', prompt);
        }
    });
} else {
    console.error('Omegaverse Dynamics: SillyTavern context not found.');
}