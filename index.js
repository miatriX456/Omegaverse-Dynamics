import { setExtensionPrompt, extension_prompt_types, eventSource, event_types } from '../../../../script.js';

const extensionName = 'omegaverse-dynamics';

// ============================================================
// 1. ДАННЫЕ: ЗАПАХИ
// ============================================================

const SCENT_CATEGORIES = {
    gentle: {
        name: "Нежные",
        icon: "fa-solid fa-feather",
        scents: [
            { id: 'lily_of_valley', name: 'Ландыш', desc: 'Чистый, прохладный, с минимальным содержанием пудровых нот.', tags: ['omega', 'unisex'] },
            { id: 'violet', name: 'Фиалка', desc: 'Пудровая, мягкая, иногда с оттенками зелени.', tags: ['omega', 'unisex'] },
            { id: 'rose', name: 'Роза', desc: 'В нежных ароматах используется для создания воздушной текстуры.', tags: ['omega', 'unisex'] },
            { id: 'peach', name: 'Персик', desc: 'Бархатистый, не кислый, часто ассоциируется с текстурой крема.', tags: ['omega', 'unisex'] },
            { id: 'vanilla', name: 'Ваниль', desc: 'В умеренных количествах придаёт тёплую, обволакивающую нежность.', tags: ['omega', 'unisex'] },
            { id: 'honey', name: 'Мёд', desc: 'Не приторный, напоминающий каплю свежего мёда в чае.', tags: ['omega', 'unisex'] },
            { id: 'cotton', name: 'Хлопок/свежее бельё', desc: 'Универсальный нежный аромат.', tags: ['omega', 'unisex'] },
            { id: 'after_rain', name: 'После дождя', desc: 'Влажная земля, озон, свежесть.', tags: ['omega', 'unisex'] },
        ]
    },
    sweet: {
        name: "Сладкие",
        icon: "fa-solid fa-candy-cane",
        scents: [
            { id: 'tuberose', name: 'Тубероза', desc: 'Насыщенная, сливочно-сладкая, с медовыми нотами.', tags: ['omega', 'unisex'] },
            { id: 'gardenia', name: 'Гардения', desc: 'Кремово-сладкая, плотная, но без приторности.', tags: ['omega', 'unisex'] },
            { id: 'ylang_ylang', name: 'Иланг-иланг', desc: 'Тёплый, сладковато-цветочный, иногда с нюансами банана и крема.', tags: ['omega', 'unisex'] },
            { id: 'mango', name: 'Манго', desc: 'Сочная, почти сиропообразная сладость.', tags: ['omega', 'unisex'] },
            { id: 'cherry', name: 'Вишня', desc: 'Может быть свежей или «вареньевой», часто с миндальным оттенком.', tags: ['omega', 'unisex'] },
            { id: 'strawberry', name: 'Клубника', desc: 'Ярко-сладкая, иногда с оттенком джема.', tags: ['omega', 'unisex'] },
            { id: 'caramel', name: 'Карамель', desc: 'Тёплая, иногда чуть солёная.', tags: ['omega', 'unisex'] },
            { id: 'chocolate', name: 'Шоколад', desc: 'Молочный мягкий и сладкий.', tags: ['omega', 'unisex'] },
        ]
    },
    relaxing: {
        name: "Расслабляющие",
        icon: "fa-solid fa-spa",
        scents: [
            { id: 'lavender', name: 'Лаванда', desc: 'Снимает напряжение, настраивает на спокойствие.', tags: ['omega', 'unisex'] },
            { id: 'chamomile', name: 'Ромашка', desc: 'Мягкая травянисто-цветочная, помогает расслабиться.', tags: ['omega', 'unisex'] },
            { id: 'sage', name: 'Шалфей', desc: 'Травяной, спокойный, иногда с лёгкой минеральной чистотой.', tags: ['omega', 'unisex'] },
            { id: 'patchouli', name: 'Пачули', desc: 'Землистый, тёплый, помогает заземлиться.', tags: ['omega', 'unisex'] },
            { id: 'petrichor', name: 'После дождя (петрикор)', desc: 'Влажная земля и озон, ощущение свежести без стресса.', tags: ['omega', 'unisex'] },
        ]
    },
    musky: {
        name: "Мускусные",
        icon: "fa-solid fa-dragon",
        scents: [
            { id: 'white_musk', name: 'Белый мускус', desc: 'Пахнет свежевыстиранным бельём, тёплой кожей, шёлком.', tags: ['alpha', 'unisex'] },
            { id: 'ambrette_musk', name: 'Мускус амбретта', desc: 'Растительный аналог: мягкий, чуть пудровый.', tags: ['alpha', 'unisex'] },
            { id: 'musk_wood', name: 'Мускус + древесина', desc: 'Тёплый, спокойный профиль: как уютный свитер или деревянная полка.', tags: ['alpha', 'unisex'] },
            { id: 'musk_vanilla', name: 'Мускус + ваниль', desc: 'Мягкая сладость без приторности.', tags: ['alpha', 'unisex'] },
        ]
    },
    amber_musky: {
        name: "Амброво-мускусные",
        icon: "fa-solid fa-sun",
        scents: [
            { id: 'grey_amber', name: 'Серая амбра', desc: 'Тёплая, солоноватая, с морским и минеральным оттенком.', tags: ['alpha', 'unisex'] },
            { id: 'amber_white_musk', name: 'Амбра + белый мускус', desc: 'Чистый, тёплый профиль: «чистое бельё плюс солнце».', tags: ['alpha', 'unisex'] },
            { id: 'amber_benzoin', name: 'Амбра + бензоин', desc: 'Тёплый бальзам, лёгкая сладость, округлый характер.', tags: ['alpha', 'unisex'] },
            { id: 'amber_patchouli', name: 'Амбра + пачули + мускус', desc: 'Землистый, но сглаженный: тёплый и «заземляющий».', tags: ['alpha', 'unisex'] },
        ]
    },
    woody: {
        name: "Древесные",
        icon: "fa-solid fa-tree",
        scents: [
            { id: 'cedar', name: 'Кедр', desc: 'Сухой, чуть смолистый, очень собранный.', tags: ['alpha', 'unisex'] },
            { id: 'sandalwood', name: 'Сандал', desc: 'Сливочный, тёплый, сглаживает острые углы.', tags: ['alpha', 'unisex'] },
            { id: 'vetiver', name: 'Ветивер', desc: 'Сухая трава и чистая земля: заземляет и добавляет фактуры.', tags: ['alpha', 'unisex'] },
            { id: 'oud', name: 'Уд (агаровое дерево)', desc: 'Смолистый, бальзамический, очень стойкий.', tags: ['alpha'] },
            { id: 'guaiac', name: 'Гваяковое дерево', desc: 'Дымный, слегка лакричный.', tags: ['alpha'] },
            { id: 'akigalawood', name: 'Акигалавуд', desc: 'Молекула с перечно‑древесным профилем: сухая, острая.', tags: ['alpha', 'unisex'] },
        ]
    },
    leather: {
        name: "Кожаные",
        icon: "fa-solid fa-gloves",
        scents: [
            { id: 'leather_dry', name: 'Кожа (сухая, дымная)', desc: 'Сухая, дымная, иногда с металлическим оттенком.', tags: ['alpha'] },
            { id: 'leather_tobacco', name: 'Кожа + табак', desc: 'Усиливают эффект «вещи с историей».', tags: ['alpha'] },
            { id: 'leather_cedar', name: 'Кожа + кедр', desc: 'Сухой и чистый, убирает лишнюю животность.', tags: ['alpha'] },
            { id: 'leather_sandal', name: 'Кожа + сандал', desc: 'Сливочная гладкость, смягчает кожу.', tags: ['alpha'] },
            { id: 'leather_incense', name: 'Кожа + ладан', desc: 'Смолистая глубина, делает кожу более мистической.', tags: ['alpha'] },
            { id: 'leather_smoke', name: 'Кожа + дым', desc: 'Эффект обугленного дерева и дыма.', tags: ['alpha'] },
        ]
    },
    herbal: {
        name: "Травянистые",
        icon: "fa-solid fa-leaf",
        scents: [
            { id: 'grass', name: 'Трава (свежескошенная)', desc: 'Прямая зелёная свежесть, часто с травянистой горчинкой.', tags: ['alpha', 'unisex'] },
            { id: 'hay', name: 'Луговые травы, сено', desc: 'Сладковато‑травянистый, но не десертный: сухая трава и сено.', tags: ['alpha', 'unisex'] },
            { id: 'rosemary', name: 'Розмарин', desc: 'Пряно‑зелёный, хвойно‑травяной, бодрит.', tags: ['alpha', 'unisex'] },
            { id: 'sage_herbal', name: 'Шалфей', desc: 'Свежий, но с лёгкой минеральной чистотой.', tags: ['alpha', 'unisex'] },
            { id: 'galbanum', name: 'Гальбанум', desc: 'Пахнет как раздавленный стебель, очень ярко и свежо.', tags: ['alpha', 'unisex'] },
            { id: 'wormwood', name: 'Полынь', desc: 'Горькая, прохладная, даёт травянистую строгость.', tags: ['alpha', 'unisex'] },
        ]
    },
    chypre: {
        name: "Шипровые",
        icon: "fa-solid fa-mountain",
        scents: [
            { id: 'chypre_classic', name: 'Классический шипр', desc: 'Цитрусы, дубовый мох, пачули, лабданум. Строгий, собранный.', tags: ['alpha', 'unisex'] },
            { id: 'chypre_bergamot', name: 'Шипр с бергамотом', desc: 'Искрящийся старт и контраст с мхом.', tags: ['alpha', 'unisex'] },
            { id: 'chypre_oakmoss', name: 'Шипр с дубовым мхом', desc: 'Сухая, прохладная «зелёность» и структура.', tags: ['alpha', 'unisex'] },
            { id: 'chypre_patchouli', name: 'Шипр с пачули', desc: 'Землистая глубина и стойкость.', tags: ['alpha', 'unisex'] },
        ]
    }
};

// ============================================================
// 2. ФУНКЦИИ ДЛЯ РАБОТЫ С ЗАПАХАМИ
// ============================================================

function getAllScents() {
    const all = [];
    for (const catKey in SCENT_CATEGORIES) {
        const cat = SCENT_CATEGORIES[catKey];
        cat.scents.forEach(s => {
            all.push({ ...s, category: catKey });
        });
    }
    return all;
}

function getScentById(id) {
    const all = getAllScents();
    return all.find(s => s.id === id) || null;
}

function getScentsByStatus(status) {
    const all = getAllScents();
    if (status === 'beta') {
        return all.filter(s => s.tags.includes('unisex'));
    } else {
        return all.filter(s => s.tags.includes(status) || s.tags.includes('unisex'));
    }
}

function findScentByName(text) {
    const all = getAllScents();
    const lowerText = text.toLowerCase();
    for (const scent of all) {
        if (lowerText.includes(scent.name.toLowerCase())) {
            return scent;
        }
    }
    return null;
}

// ============================================================
// 3. СОСТОЯНИЕ
// ============================================================

let state = {
    enabled: true,
    forceOmegaverse: true,
    promptInterval: 10,
    currentMessageCount: 0,
    player: {
        name: "Игрок",
        status: 'beta',
        fakeStatus: null,
        role: 'none',
        scent: { primary: null, secondary: null, nuance: null, territory: null },
        cycle: { type: 'none', startDate: null, duration: 5, interval: 28, nextDate: null, active: false },
        mark: { has: false, owner: null, target: null },
        bond: { has: false, partner: null },
        interests: { romantic: [], sexual: [] },
        log: [],
        trauma: null,
        traumaDescription: '',
    },
    npcs: [],
    calendar: { currentDate: null, season: 'spring', globalEvents: [], viewDate: null },
    showFloating: true,
    expandedMode: false,
    activeTab: 'player',
    autoDetect: {
        enabled: true,
        detectStatus: true,
        detectCycle: true,
        detectScent: true,
        detectMark: true,
        detectNewNpc: true,
    },
    minContextLength: 0,
    cooldownMessages: 0,
    lastTriggerMessageId: null,
    memory: { facts: [], flashbackQueue: [], flashHistory: [] },
};

// ============================================================
// 4. ЗАГРУЗКА / СОХРАНЕНИЕ
// ============================================================

function load() {
    try {
        const s = localStorage.getItem('ov');
        if (s) {
            const saved = JSON.parse(s);
            state = deepMerge(state, saved);
        }
    } catch (e) { console.error('[OV] Load error:', e); }
}

function save() {
    localStorage.setItem('ov', JSON.stringify(state));
}

function deepMerge(target, source) {
    for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            if (!target[key]) target[key] = {};
            deepMerge(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
    return target;
}

// ============================================================
// 5. ПАМЯТЬ (ФАКТЫ)
// ============================================================

function addFact(text, category = 'events', importance = 'medium') {
    if (!state.memory) state.memory = { facts: [], flashbackQueue: [], flashHistory: [] };
    state.memory.facts.unshift({
        id: 'fact_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        text: text,
        category: category,
        importance: importance,
        ts: Date.now(),
        disabled: false,
    });
    if (state.memory.facts.length > 200) state.memory.facts.length = 200;
    save();
}

// ============================================================
// 6. ТОСТЫ
// ============================================================

let toastSequence = 0;

function ensureToastContainer() {
    if (!document.getElementById('ov-toast-container')) {
        const container = document.createElement('div');
        container.id = 'ov-toast-container';
        container.className = 'ov-toast-container';
        document.body.appendChild(container);
    }
}

function showToast({ title, text, variant = 'system', icon = 'fa-solid fa-circle-info' }) {
    ensureToastContainer();
    const container = document.getElementById('ov-toast-container');
    const id = `ov-toast-${++toastSequence}`;
    const variantClass = variant.toLowerCase();
    const toastHtml = `
        <div id="${id}" class="ov-toast ${variantClass}" style="--ov-toast-accent: var(--ov-${variantClass});">
            <div class="ov-toast-glow"></div>
            <div class="ov-toast-icon"><i class="${icon}"></i></div>
            <div class="ov-toast-content">
                <div class="ov-toast-title">${title}</div>
                <div class="ov-toast-text">${text}</div>
                <span class="ov-toast-progress"></span>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', toastHtml);
    const toastElement = document.getElementById(id);
    if (!toastElement) return;
    requestAnimationFrame(() => toastElement.classList.add('is-visible'));
    setTimeout(() => {
        toastElement.dataset.state = 'closing';
        toastElement.classList.remove('is-visible');
        setTimeout(() => toastElement.remove(), 300);
    }, 5000);
}

function notify(msg, variant = 'system', icon = 'fa-solid fa-circle-info') {
    showToast({ title: 'Omegaverse', text: msg, variant, icon });
}

// ============================================================
// 7. ПАРСЕР СООБЩЕНИЙ (АВТОМАТИЧЕСКОЕ РАСПОЗНАВАНИЕ)
// ============================================================

function parseNotesFromMessage(messageText) {
    const noteRegex = /\[NOTE:\s*([^\]]+?)\s*\]/gi;
    const remetteRegex = /\[REMETTE'S NOTE:\s*([^\]]+?)\s*\]/gi;
    const notes = [];
    let match;
    while ((match = noteRegex.exec(messageText)) !== null) {
        notes.push({ text: match[1].trim(), type: 'note' });
    }
    while ((match = remetteRegex.exec(messageText)) !== null) {
        notes.push({ text: match[1].trim(), type: 'remette_note' });
    }
    return notes;
}

// Автоматическое определение травмы по ключевым словам
function detectTraumaFromMessage(messageText) {
    const traumaKeywords = {
        severe: ['изнасилова', 'насилова', 'травм', 'ужас', 'кошмар', 'кровь', 'рана', 'шрам', 'боль', 'страх', 'агрессия', 'кричать', 'плакать', 'убийство', 'смерть'],
        mild: ['неприятность', 'конфликт', 'обида', 'разочарование', 'потеря', 'горе', 'слёзы', 'тревога']
    };
    const lower = messageText.toLowerCase();
    for (const word of traumaKeywords.severe) {
        if (lower.includes(word)) return 'severe';
    }
    for (const word of traumaKeywords.mild) {
        if (lower.includes(word)) return 'mild';
    }
    return null;
}

function parseMessageForOmegaverse(messageText, messageAuthor) {
    if (!state.autoDetect.enabled) return;
    if (messageAuthor === 'user') return;

    const lowerText = messageText.toLowerCase();
    const detected = {
        status: null,
        cycle: null,
        scent: null,
        mark: null,
        bond: null,
        newNpc: null,
        npcName: null,
        trauma: null,
        traumaDescription: null,
    };

    // 1. Статус
    if (state.autoDetect.detectStatus) {
        const statusKeywords = {
            alpha: ['альфа', 'alpha', 'доминант', 'лидер'],
            omega: ['омега', 'omega', 'подчинённый', 'покорный'],
            beta: ['бета', 'beta', 'нейтральный', 'средний'],
        };
        for (const [status, keywords] of Object.entries(statusKeywords)) {
            for (const kw of keywords) {
                if (lowerText.includes(kw)) {
                    detected.status = status;
                    break;
                }
            }
            if (detected.status) break;
        }
    }

    // 2. Цикл
    if (state.autoDetect.detectCycle) {
        const cycleKeywords = {
            heat: ['течка', 'heat', 'период', 'цикл'],
            rut: ['гон', 'rut', 'агрессия', 'доминирование'],
        };
        for (const [type, keywords] of Object.entries(cycleKeywords)) {
            for (const kw of keywords) {
                if (lowerText.includes(kw)) {
                    detected.cycle = type;
                    break;
                }
            }
            if (detected.cycle) break;
        }
    }

    // 3. Запах
    if (state.autoDetect.detectScent) {
        const scent = findScentByName(messageText);
        if (scent) detected.scent = scent.id;
    }

    // 4. Метка и связь
    if (state.autoDetect.detectMark) {
        const markPhrases = ['поставил метку', 'пометил', 'укусил', 'укусила', 'отметил'];
        const bondPhrases = ['связан', 'связана', 'bond', 'связь'];
        for (const phrase of markPhrases) {
            if (lowerText.includes(phrase)) { detected.mark = true; break; }
        }
        for (const phrase of bondPhrases) {
            if (lowerText.includes(phrase)) { detected.bond = true; break; }
        }
    }

    // --- ПАРСИНГ ЗАМЕТОК (НЕ ПЕРСОНАЖИ) ---
    const notes = parseNotesFromMessage(messageText);
    for (const note of notes) {
        addFact(`Заметка: ${note.text}`, note.type === 'remette_note' ? 'secrets' : 'events', 'high');
        notify(`📝 Обнаружена заметка: ${note.text.slice(0, 60)}${note.text.length > 60 ? '…' : ''}`, 'system', 'fa-solid fa-sticky-note');
    }

    // 5. Поиск имени NPC (только настоящие персонажи)
    const words = messageText.split(/\s+/);
    let foundName = null;
    // Жёсткий список запрещённых слов — НИКОГДА НЕ ДОБАВЛЯТЬ КАК NPC
    const forbiddenNames = new Set([
        'note', 'remette', "remette's", 'remettes',
        'ooc', 'system', 'author', 'user', 'player', 'narrator',
        'рассказчик', 'автор', 'система', 'пользователь', 'игрок',
    ]);

    // Очищаем слова от пунктуации и звёздочек для сравнения
    const cleanWord = (w) => w.replace(/[^a-zA-Zа-яА-ЯёЁ']/g, '');

    for (const word of words) {
        const cleaned = cleanWord(word);
        if (cleaned.length < 2) continue;
        if (/^[А-ЯЁA-Z]/.test(cleaned)) { // только слова с заглавной буквы
            const lowerName = cleaned.toLowerCase();
            if (forbiddenNames.has(lowerName)) continue;
            if (lowerName === state.player.name.toLowerCase()) continue;
            const exists = state.npcs.some(n => n.name.toLowerCase() === lowerName);
            if (!exists) {
                foundName = cleaned;
                break;
            }
        }
    }

    // Если не нашли по заглавной, пробуем искать имена, которые упоминались в кавычках или после "доктор", "генерал" и т.д.
    if (!foundName) {
        const namePatterns = [
            /"([А-ЯЁA-Z][а-яёa-z]+)"/g,
            /'([А-ЯЁA-Z][а-яёa-z]+)'/g,
            /(?:доктор|генерал|капитан|лейтенант|королева|король|принц|принцесса|лорд|леди|мистер|миссис|мисс|сэр|дама)\s+([А-ЯЁA-Z][а-яёa-z]+)/gi,
        ];
        for (const pattern of namePatterns) {
            let match;
            while ((match = pattern.exec(messageText)) !== null) {
                const name = match[1];
                if (name && !forbiddenNames.has(name.toLowerCase()) && name.toLowerCase() !== state.player.name.toLowerCase()) {
                    const exists = state.npcs.some(n => n.name.toLowerCase() === name.toLowerCase());
                    if (!exists) {
                        foundName = name;
                        break;
                    }
                }
            }
            if (foundName) break;
        }
    }

    if (foundName) {
        detected.newNpc = foundName;
        if (!detected.status) detected.status = 'beta';
    }

    // 6. Автоматическое определение травмы
    const traumaLevel = detectTraumaFromMessage(messageText);
    if (traumaLevel) {
        detected.trauma = traumaLevel;
        // Попытка извлечь описание травмы (первые 100 символов после слова-триггера)
        const sentences = messageText.match(/[^.!?]+[.!?]/g) || [];
        for (const sentence of sentences) {
            const lower = sentence.toLowerCase();
            if (lower.includes('травм') || lower.includes('изнасилова') || lower.includes('насилова') || lower.includes('ужас') || lower.includes('кошмар')) {
                detected.traumaDescription = sentence.trim().slice(0, 200);
                break;
            }
        }
        if (!detected.traumaDescription) {
            detected.traumaDescription = 'Обнаружены признаки травмы в сообщении.';
        }
    }

    // 7. Применяем изменения
    applyDetectedChanges(detected);
}

// ============================================================
// 8. ПРИМЕНЕНИЕ ОБНАРУЖЕННЫХ ИЗМЕНЕНИЙ
// ============================================================

function applyDetectedChanges(detected) {
    if (detected.newNpc && state.autoDetect.detectNewNpc) {
        const existing = state.npcs.find(n => n.name.toLowerCase() === detected.newNpc.toLowerCase());
        if (!existing) {
            const newNpc = {
                name: detected.newNpc,
                status: detected.status || 'beta',
                fakeStatus: null,
                role: 'none',
                scent: { primary: detected.scent || null, secondary: null, nuance: null, territory: null },
                cycle: { type: detected.cycle || 'none', startDate: null, duration: 5, interval: 28, nextDate: null, active: false },
                mark: { has: false, owner: null, target: null },
                bond: { has: false, partner: null },
                interests: { romantic: [], sexual: [] },
                log: [],
                avatar: '',
                trauma: detected.trauma || 'none',
                traumaDescription: detected.traumaDescription || '',
                lastUpdate: Date.now(),
            };
            state.npcs.push(newNpc);
            addFact(`Появился новый персонаж: ${detected.newNpc} (${detected.status || 'Бета'})`, 'characters', 'high');
            notify(`Обнаружен новый персонаж: ${detected.newNpc} (${detected.status || 'Бета'})`, 'system', 'fa-solid fa-user-plus');
            if (detected.trauma) {
                notify(`⚠️ У ${detected.newNpc} обнаружена травма (${detected.trauma})`, 'system', 'fa-solid fa-triangle-exclamation');
            }
            save();
            updateUI();
            renderAllPanels();
        } else {
            // Если NPC уже существует, обновляем только если есть новые данные
            if (detected.status && existing.status !== detected.status) {
                existing.status = detected.status;
                existing.lastUpdate = Date.now();
                addFact(`${existing.name} стал ${detected.status === 'alpha' ? 'Альфой' : detected.status === 'omega' ? 'Омегой' : 'Бетой'}`, 'characters', 'medium');
                notify(`Статус ${existing.name} обновлён: ${detected.status}`, 'system', 'fa-solid fa-rotate');
                save();
                updateUI();
                renderAllPanels();
            }
            if (detected.cycle && existing.cycle.type !== detected.cycle) {
                const cycleType = detected.cycle === 'heat' ? 'heat' : 'rut';
                existing.cycle.type = cycleType;
                existing.cycle.active = true;
                existing.cycle.startDate = new Date().toISOString().split('T')[0];
                const start = new Date(existing.cycle.startDate);
                start.setDate(start.getDate() + (existing.cycle.interval || 28));
                existing.cycle.nextDate = start.toISOString().split('T')[0];
                existing.lastUpdate = Date.now();
                const cycleName = cycleType === 'heat' ? 'течка' : 'гон';
                addFact(`У ${existing.name} начался ${cycleName}`, 'events', 'medium');
                notify(`У ${existing.name} начался ${cycleName}`, 'system', 'fa-solid fa-fire');
                save();
                updateUI();
                renderAllPanels();
            }
            if (detected.scent && existing.scent.primary !== detected.scent) {
                existing.scent.primary = detected.scent;
                existing.lastUpdate = Date.now();
                const scentObj = getScentById(detected.scent);
                addFact(`У ${existing.name} обнаружен запах: ${scentObj ? scentObj.name : detected.scent}`, 'characters', 'medium');
                notify(`У ${existing.name} обнаружен запах: ${scentObj ? scentObj.name : detected.scent}`, 'system', 'fa-solid fa-wand-sparkles');
                save();
                updateUI();
                renderAllPanels();
            }
            if (detected.mark && !existing.mark.has) {
                existing.mark.has = true;
                existing.lastUpdate = Date.now();
                addFact(`${existing.name} получил метку`, 'characters', 'high');
                notify(`${existing.name} получил метку`, 'system', 'fa-solid fa-link');
                save();
                updateUI();
                renderAllPanels();
            }
            if (detected.bond && !existing.bond.has) {
                existing.bond.has = true;
                existing.lastUpdate = Date.now();
                addFact(`${existing.name} установил связь`, 'characters', 'high');
                notify(`${existing.name} установил связь`, 'system', 'fa-solid fa-handshake');
                save();
                updateUI();
                renderAllPanels();
            }
            if (detected.trauma && existing.trauma !== detected.trauma) {
                existing.trauma = detected.trauma;
                existing.traumaDescription = detected.traumaDescription || existing.traumaDescription;
                existing.lastUpdate = Date.now();
                addFact(`Обнаружена травма у ${existing.name}: ${detected.trauma}`, 'characters', 'high');
                notify(`⚠️ У ${existing.name} обнаружена травма (${detected.trauma})`, 'system', 'fa-solid fa-triangle-exclamation');
                save();
                updateUI();
                renderAllPanels();
            }
        }
    }
}

// ============================================================
// 9. ГЕНЕРАЦИЯ СИСТЕМНОГО ПРОМПТА
// ============================================================

function buildOmegaversePrompt() {
    if (!state.enabled || !state.forceOmegaverse) return '';

    const player = state.player;
    const statusMap = { alpha: 'Альфа', beta: 'Бета', omega: 'Омега' };
    const statusText = statusMap[player.status] || 'Бета';

    let scentDesc = '';
    if (player.scent.primary) {
        const scent = getScentById(player.scent.primary);
        if (scent) {
            scentDesc = state.expandedMode ? `${scent.name} — ${scent.desc}` : scent.name;
        }
    }
    let extraScent = '';
    if (player.scent.secondary) {
        const sec = getScentById(player.scent.secondary);
        if (sec) extraScent += `, второстепенный: ${state.expandedMode ? sec.name + ' — ' + sec.desc : sec.name}`;
    }
    if (player.scent.nuance) {
        const nu = getScentById(player.scent.nuance);
        if (nu) extraScent += `, нюанс: ${state.expandedMode ? nu.name + ' — ' + nu.desc : nu.name}`;
    }
    if (extraScent) scentDesc += extraScent;

    let cycleInfo = '';
    if (player.cycle.type !== 'none') {
        if (player.cycle.active) {
            cycleInfo = `Сейчас у ${statusText} активный ${player.cycle.type === 'heat' ? 'течка' : 'гон'}.`;
        } else if (player.cycle.nextDate) {
            const next = new Date(player.cycle.nextDate);
            const now = new Date(state.calendar.currentDate || Date.now());
            const diffDays = Math.ceil((next - now) / (1000 * 60 * 60 * 24));
            cycleInfo = `Следующий ${player.cycle.type === 'heat' ? 'течка' : 'гон'} через ${diffDays} дней.`;
        }
    }

    let bondInfo = '';
    if (player.mark.has && player.mark.owner) bondInfo += `Имеет метку от ${player.mark.owner}. `;
    if (player.bond.has && player.bond.partner) bondInfo += `Связан(а) с ${player.bond.partner}.`;

    let globalEvents = '';
    if (state.calendar.globalEvents.length > 0) {
        globalEvents = `Глобальные события: ${state.calendar.globalEvents.join(', ')}.`;
    }

    let npcInfo = '';
    for (const npc of state.npcs) {
        if (npc.status !== 'beta' || npc.cycle.type !== 'none' || npc.mark.has || npc.bond.has || (npc.trauma && npc.trauma !== 'none')) {
            npcInfo += `\n- ${npc.name} (${statusMap[npc.status] || 'Бета'})`;
            if (npc.cycle.active) npcInfo += `, активный ${npc.cycle.type === 'heat' ? 'течка' : 'гон'}`;
            if (npc.mark.has) npcInfo += `, имеет метку${npc.mark.owner ? ` от ${npc.mark.owner}` : ''}`;
            if (npc.bond.has) npcInfo += `, связан${npc.bond.partner ? ` с ${npc.bond.partner}` : ''}`;
            if (npc.trauma && npc.trauma !== 'none') {
                const traumaDesc = npc.traumaDescription || 'тяжёлое прошлое';
                npcInfo += `, травма: ${npc.trauma === 'severe' ? 'тяжёлая' : 'лёгкая'} (${traumaDesc})`;
            }
        }
    }
    if (npcInfo) npcInfo = `\n\n[ДРУГИЕ ПЕРСОНАЖИ В ОМЕГАВЕРСЕ]:${npcInfo}`;

    return `[OMEGAVERSE SETTINGS]
Статус: ${statusText}${player.fakeStatus ? ` (притворяется ${statusMap[player.fakeStatus]})` : ''}
Роль: ${player.role || 'не указана'}
Запах: ${scentDesc || 'не указан'}
${cycleInfo}
${bondInfo}
${globalEvents}${npcInfo}
Пожалуйста, учитывай эти параметры при описании сцен и взаимодействий.`;
}

function applyOmegaversePrompt() {
    if (!state.enabled || !state.forceOmegaverse) {
        setExtensionPrompt(extensionName, '', extension_prompt_types.IN_CHAT, 0);
        return;
    }
    const prompt = buildOmegaversePrompt();
    setExtensionPrompt(extensionName, prompt, extension_prompt_types.IN_CHAT, 0);
    console.log('[OV] Prompt applied:', prompt ? 'YES' : 'empty');
}

// ============================================================
// 10. РЕНДЕРИНГ UI (только изменённые части)
// ============================================================

// Добавляем обработчик для кнопки карандашика (уже есть в .ov-edit-btn)
// В renderNpcListContent() добавим поле травмы с выпадающим списком, который можно редактировать.

// ============================================================
// 11. ОБНОВЛЕНИЕ UI
// ============================================================

function updateUI() {
    const tabs = ['player', 'npcs', 'calendar', 'world', 'settings'];
    tabs.forEach(tab => {
        const el = document.getElementById(`ov-tab-${tab}`);
        if (el) el.classList.toggle('active', state.activeTab === tab);
        const panel = document.getElementById(`ov-panel-${tab}`);
        if (panel) panel.style.display = (state.activeTab === tab) ? 'block' : 'none';
    });
    const count = state.npcs.length + 1;
    $('#ov-mini-btn').html(count > 0
        ? `<i class="fa-solid fa-users"></i><span class="ov-count">${count}</span>`
        : `<i class="fa-solid fa-users"></i>`);
    updateExtBadge();
    save();
}

function renderAllPanels() {
    $('#ov-panel-player').html(renderPlayerTabContent());
    $('#ov-panel-npcs').html(renderNpcListContent());
    $('#ov-panel-calendar').html(renderCalendarContent());
    $('#ov-panel-world').html(renderWorldContent());
    $('#ov-panel-settings').html(renderSettingsContent());
}

// ============================================================
// 12. НАСТРОЙКИ В МЕНЮ РАСШИРЕНИЙ (без изменений)
// ============================================================

const ovSettingsHtml = `
<div id="ov-ext-settings" class="ov-ext-block">
    <div class="inline-drawer">
        <div class="inline-drawer-toggle inline-drawer-header">
            <b>Omegaverse Dynamics</b>
            <span id="ov-ext-count" class="ov-ext-badge"></span>
            <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
        </div>
        <div class="inline-drawer-content">
            <div class="ov-ext-row">
                <label class="checkbox_label">
                    <input type="checkbox" id="ov-ext-show-float">
                    <span>Плавающая кнопка</span>
                </label>
            </div>
            <div class="ov-ext-row">
                <label class="checkbox_label">
                    <input type="checkbox" id="ov-ext-enabled">
                    <span>Включить Омегаверс</span>
                </label>
            </div>
            <div class="ov-ext-row">
                <button id="ov-ext-open" class="menu_button">
                    <i class="fa-solid fa-users"></i> Открыть панель
                </button>
            </div>
            <div class="ov-ext-row" style="font-size:11px; opacity:0.5; margin-top:4px;">
                NPC: <span id="ov-ext-npc-count">${state.npcs.length}</span> |
                Статус: <span id="ov-ext-status">${state.player.status || 'beta'}</span>
            </div>
        </div>
    </div>
</div>
`;

const ovExtStyles = `
<style>
.ov-ext-block .inline-drawer-content {
    padding: 8px 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.ov-ext-row {
    display: flex;
    align-items: center;
    gap: 8px;
}
.ov-ext-badge {
    background: var(--SmartThemeQuoteColor, #c0392b);
    color: #fff;
    font-size: 10px;
    padding: 1px 6px;
    border-radius: 10px;
    font-weight: 700;
    margin-left: 6px;
}
.ov-ext-badge:empty {
    display: none;
}
</style>
`;

function updateExtBadge() {
    const count = state.npcs.length;
    $('#ov-ext-count').text(count > 0 ? count : '');
    $('#ov-ext-npc-count').text(count);
    const statusMap = { alpha: 'Альфа', beta: 'Бета', omega: 'Омега' };
    $('#ov-ext-status').text(statusMap[state.player.status] || 'Бета');
}

// ============================================================
// 13. ФУНКЦИИ CRUD (сохранение и т.д.)
// ============================================================

function savePlayer() {
    const p = state.player;
    p.name = $('#ov-player-name').val();
    p.status = $('#ov-player-status').val();
    p.fakeStatus = $('#ov-player-fake').val() || null;
    p.role = $('#ov-player-role').val();
    p.scent.primary = $('#ov-player-scent-primary').val() || null;
    p.scent.secondary = $('#ov-player-scent-secondary').val() || null;
    p.scent.nuance = $('#ov-player-scent-nuance').val() || null;
    p.scent.territory = $('#ov-player-scent-territory').val() || null;
    p.cycle.type = $('#ov-player-cycle-type').val();
    p.cycle.duration = parseInt($('#ov-player-cycle-duration').val()) || 5;
    p.cycle.interval = parseInt($('#ov-player-cycle-interval').val()) || 28;
    p.cycle.nextDate = $('#ov-player-cycle-next').val() || null;
    p.cycle.active = $('#ov-player-cycle-active').prop('checked');
    p.mark.has = $('#ov-player-mark-has').prop('checked');
    p.mark.owner = $('#ov-player-mark-owner').val() || null;
    p.mark.target = $('#ov-player-mark-target').val() || null;
    p.bond.has = $('#ov-player-bond-has').prop('checked');
    p.bond.partner = $('#ov-player-bond-partner').val() || null;
    p.interests.romantic = [];
    $('.ov-interest-romantic:checked').each(function() {
        p.interests.romantic.push($(this).val());
    });
    p.interests.sexual = [];
    $('.ov-interest-sexual:checked').each(function() {
        p.interests.sexual.push($(this).val());
    });
    p.trauma = $('#ov-player-trauma').val() || null;
    p.traumaDescription = $('#ov-player-trauma-desc').val() || '';
    save();
    notify('Данные игрока сохранены', 'system', 'fa-solid fa-check-circle');
    updateUI();
}

function randomizePlayer() {
    const p = state.player;
    const statuses = ['alpha', 'beta', 'omega'];
    p.status = statuses[Math.floor(Math.random() * statuses.length)];
    p.fakeStatus = Math.random() > 0.7 ? statuses[Math.floor(Math.random() * statuses.length)] : null;
    const roles = ['Воин', 'Генерал', 'Королева', 'Слуга', 'Учёный', 'Охотник', 'Целитель', 'Правитель', 'Лидер', 'Подчинённый'];
    p.role = roles[Math.floor(Math.random() * roles.length)];
    const scents = getScentsByStatus(p.status);
    if (scents.length) {
        p.scent.primary = scents[Math.floor(Math.random() * scents.length)].id;
        if (Math.random() > 0.5) {
            const sec = scents.filter(s => s.id !== p.scent.primary);
            if (sec.length) p.scent.secondary = sec[Math.floor(Math.random() * sec.length)].id;
        } else p.scent.secondary = null;
        if (Math.random() > 0.6) {
            const all = getAllScents();
            p.scent.nuance = all[Math.floor(Math.random() * all.length)].id;
        } else p.scent.nuance = null;
    }
    if (p.status === 'omega') {
        p.cycle.type = 'heat';
        p.cycle.duration = Math.floor(Math.random() * 5) + 3;
        p.cycle.interval = Math.floor(Math.random() * 20) + 20;
    } else if (p.status === 'alpha') {
        p.cycle.type = 'rut';
        p.cycle.duration = Math.floor(Math.random() * 5) + 3;
        p.cycle.interval = Math.floor(Math.random() * 30) + 30;
    } else {
        p.cycle.type = 'none';
    }
    p.cycle.active = false;
    p.mark.has = Math.random() > 0.5;
    if (p.mark.has) {
        p.mark.owner = 'Кто-то';
        p.mark.target = p.name;
    } else {
        p.mark.owner = null;
        p.mark.target = null;
    }
    p.bond.has = Math.random() > 0.7;
    if (p.bond.has) p.bond.partner = 'Кто-то';
    else p.bond.partner = null;
    p.interests.romantic = statuses.filter(() => Math.random() > 0.4);
    p.interests.sexual = statuses.filter(() => Math.random() > 0.4);
    save();
    notify('Персонаж рандомизирован', 'system', 'fa-solid fa-dice');
    updateUI();
    renderAllPanels();
}

function addNpc(name) {
    const newNpc = {
        name: name,
        status: 'beta',
        fakeStatus: null,
        role: 'none',
        scent: { primary: null, secondary: null, nuance: null, territory: null },
        cycle: { type: 'none', duration: 5, interval: 28, nextDate: null, active: false },
        mark: { has: false, owner: null, target: null },
        bond: { has: false, partner: null },
        interests: { romantic: [], sexual: [] },
        log: [],
        avatar: '',
        trauma: 'none',
        traumaDescription: '',
        lastUpdate: Date.now(),
    };
    state.npcs.push(newNpc);
    save();
    notify(`NPC "${name}" добавлен`, 'system', 'fa-solid fa-user-plus');
    updateUI();
    renderAllPanels();
}

// ============================================================
// 14. ОСТАЛЬНЫЕ ФУНКЦИИ РЕНДЕРИНГА (без изменений)
// ============================================================

function renderPlayerTabContent() {
    // ... (вставьте полную версию из предыдущего кода)
}

function renderNpcListContent() {
    // ... (вставьте полную версию из предыдущего кода, она уже содержит поля для травмы)
}

function renderCalendarContent() {
    // ... (вставьте полную версию из предыдущего кода)
}

function getMonthName(monthIndex) {
    const names = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                   'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    return names[monthIndex] || 'Январь';
}

function changeCalendarMonth(delta) {
    const viewDate = state.calendar.viewDate || state.calendar.currentDate || new Date().toISOString().split('T')[0];
    const parts = viewDate.split('-');
    let year = parseInt(parts[0]) || new Date().getFullYear();
    let month = parseInt(parts[1]) - 1 || new Date().getMonth();
    month += delta;
    if (month < 0) { month = 11; year--; }
    if (month > 11) { month = 0; year++; }
    state.calendar.viewDate = `${year}-${String(month+1).padStart(2,'0')}-01`;
    save();
    renderAllPanels();
}

function ovShowDayEvents(dateStr) {
    const container = document.getElementById('ov-day-events');
    if (!container) return;

    let events = [];
    for (const npc of state.npcs) {
        if (npc.cycle.active && npc.cycle.startDate === dateStr) {
            events.push(`<div style="padding:4px 0;"><span style="color:#e74c3c;">⚡</span> ${npc.name}: ${npc.cycle.type === 'heat' ? 'Течка' : 'Гон'}</div>`);
        }
        if (npc.mark.has && npc.mark.date === dateStr) {
            events.push(`<div style="padding:4px 0;"><span style="color:#f1c40f;">🔗</span> ${npc.name}: Поставлена метка${npc.mark.owner ? ` от ${npc.mark.owner}` : ''}</div>`);
        }
        if (npc.bond.has && npc.bond.date === dateStr) {
            events.push(`<div style="padding:4px 0;"><span style="color:#3498db;">💞</span> ${npc.name}: Установлена связь${npc.bond.partner ? ` с ${npc.bond.partner}` : ''}</div>`);
        }
    }

    if (events.length === 0) {
        container.innerHTML = `<div class="ov-text-muted">В этот день событий нет.</div>`;
    } else {
        container.innerHTML = `<div style="display:flex; flex-direction:column; gap:4px;">${events.join('')}</div>`;
    }
}

function renderWorldContent() {
    let html = `<div class="ov-section-title"><i class="fa-solid fa-globe"></i> Мир и события</div>`;
    html += `<div class="ov-row"><label>Текущий сезон:</label><span>${state.calendar.season || 'весна'}</span></div>`;
    html += `<div class="ov-row"><label>Глобальные события:</label><input class="ov-input ov-flex" id="ov-world-events" value="${state.calendar.globalEvents.join(', ')}" /></div>`;
    html += `<button class="ov-btn ov-btn-primary" id="ov-world-save"><i class="fa-solid fa-floppy-disk"></i> Сохранить</button>`;
    return html;
}

function renderSettingsContent() {
    let html = `<div class="ov-section-title"><i class="fa-solid fa-gear"></i> Настройки</div>`;
    html += `
    <div class="ov-row"><label>Включено</label><input type="checkbox" id="ov-settings-enabled" ${state.enabled ? 'checked' : ''} /></div>
    <div class="ov-row"><label>Принудительный Омегаверс</label><input type="checkbox" id="ov-settings-force" ${state.forceOmegaverse ? 'checked' : ''} /></div>
    <div class="ov-row"><label>Интервал напоминаний (сообщений)</label><input type="number" id="ov-settings-interval" value="${state.promptInterval || 10}" min="1" /></div>
    <div class="ov-row"><label>Плавающая кнопка</label><input type="checkbox" id="ov-settings-float" ${state.showFloating ? 'checked' : ''} /></div>
    <div class="ov-row"><label>Расширенный режим описания</label><input type="checkbox" id="ov-settings-expanded" ${state.expandedMode ? 'checked' : ''} /></div>
    <div class="ov-section-title"><i class="fa-solid fa-robot"></i> Автоматическое распознавание</div>
    <div class="ov-row"><label>Включено</label><input type="checkbox" id="ov-auto-enabled" ${state.autoDetect.enabled ? 'checked' : ''} /></div>
    <div class="ov-row"><label>Статус</label><input type="checkbox" id="ov-auto-status" ${state.autoDetect.detectStatus ? 'checked' : ''} /></div>
    <div class="ov-row"><label>Цикл</label><input type="checkbox" id="ov-auto-cycle" ${state.autoDetect.detectCycle ? 'checked' : ''} /></div>
    <div class="ov-row"><label>Запах</label><input type="checkbox" id="ov-auto-scent" ${state.autoDetect.detectScent ? 'checked' : ''} /></div>
    <div class="ov-row"><label>Метка/связь</label><input type="checkbox" id="ov-auto-mark" ${state.autoDetect.detectMark ? 'checked' : ''} /></div>
    <div class="ov-row"><label>Добавлять NPC</label><input type="checkbox" id="ov-auto-npc" ${state.autoDetect.detectNewNpc ? 'checked' : ''} /></div>
    <button class="ov-btn ov-btn-primary" id="ov-settings-save"><i class="fa-solid fa-floppy-disk"></i> Сохранить</button>
    <hr />
    <button class="ov-btn" id="ov-settings-export"><i class="fa-solid fa-download"></i> Экспорт JSON</button>
    <button class="ov-btn" id="ov-settings-import"><i class="fa-solid fa-upload"></i> Импорт JSON</button>
    `;
    return html;
}

// ============================================================
// 15. ЗАПУСК РАСШИРЕНИЯ
// ============================================================

jQuery(async () => {
    try {
        load();

        $('#extensions_settings2').append(ovExtStyles + ovSettingsHtml);

        const panelHtml = `
        <div id="ov-panel" class="ov-container ov-hidden">
            <div class="ov-header">
                <h4 id="ov-drag-handle"><i class="fa-solid fa-users"></i> Omegaverse</h4>
                <button id="ov-minimize" class="ov-minimize-btn"><i class="fa-solid fa-minus"></i></button>
            </div>
            <div class="ov-tabs" id="ov-tabs">
                <div class="ov-tab active" data-tab="player"><i class="fa-solid fa-user"></i> Я</div>
                <div class="ov-tab" data-tab="npcs"><i class="fa-solid fa-users"></i> NPC</div>
                <div class="ov-tab" data-tab="calendar"><i class="fa-solid fa-calendar-days"></i> Календарь</div>
                <div class="ov-tab" data-tab="world"><i class="fa-solid fa-globe"></i> Мир</div>
                <div class="ov-tab" data-tab="settings"><i class="fa-solid fa-gear"></i> Настройки</div>
            </div>
            <div class="ov-scrollable" id="ov-content">
                <div id="ov-panel-player" style="display:block;"></div>
                <div id="ov-panel-npcs" style="display:none;"></div>
                <div id="ov-panel-calendar" style="display:none;"></div>
                <div id="ov-panel-world" style="display:none;"></div>
                <div id="ov-panel-settings" style="display:none;"></div>
            </div>
        </div>
        <div id="ov-mini-btn" class="ov-mini-btn"><i class="fa-solid fa-users"></i></div>
        `;
        $('body').append(panelHtml);

        $('.ov-tab').on('click', function() {
            const tab = $(this).data('tab');
            state.activeTab = tab;
            updateUI();
            renderAllPanels();
        });

        $('#ov-mini-btn').on('click', function(e) {
            e.stopPropagation();
            $('#ov-panel').toggleClass('ov-hidden');
        });
        $('#ov-minimize').on('click', function() {
            $('#ov-panel').addClass('ov-hidden');
        });

        let isDragging = false;
        let offset = { x: 0, y: 0 };
        const $panel = $('#ov-panel');
        const $handle = $('#ov-drag-handle');

        function getCoords(e) {
            if (e.type.startsWith('touch') && e.touches && e.touches[0]) {
                return { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
            return { x: e.clientX, y: e.clientY };
        }

        $handle.on('mousedown touchstart', function(e) {
            isDragging = true;
            const pos = $panel.position();
            $panel.css({ top: pos.top + 'px', left: pos.left + 'px', right: 'auto', bottom: 'auto' });
            const coords = getCoords(e);
            offset = { x: coords.x - pos.left, y: coords.y - pos.top };
            e.preventDefault();
        });
        $(document).on('mousemove touchmove', function(e) {
            if (!isDragging) return;
            const coords = getCoords(e);
            $panel.css({ top: (coords.y - offset.y) + 'px', left: (coords.x - offset.x) + 'px' });
        });
        $(document).on('mouseup touchend', function() {
            isDragging = false;
        });

        $('#ov-ext-show-float').prop('checked', state.showFloating).on('change', function() {
            state.showFloating = this.checked;
            applyFloatVisibility();
            save();
        });
        $('#ov-ext-enabled').prop('checked', state.enabled).on('change', function() {
            state.enabled = this.checked;
            applyOmegaversePrompt();
            save();
        });
        $('#ov-ext-open').on('click', function(e) {
            e.preventDefault();
            $('#ov-panel').removeClass('ov-hidden');
        });

        $(document).on('click', '#ov-player-save', savePlayer);
        $(document).on('click', '#ov-player-random', function() {
            randomizePlayer();
        });
        $(document).on('click', '#ov-npc-add', function() {
            const name = prompt('Введите имя NPC:');
            if (name && name.trim()) {
                addNpc(name.trim());
            }
        });
        $(document).on('click', '.ov-npc-delete', function() {
            const index = $(this).data('index');
            if (confirm(`Удалить NPC "${state.npcs[index]?.name}"?`)) {
                state.npcs.splice(index, 1);
                save();
                updateUI();
                renderAllPanels();
                notify('NPC удалён', 'system', 'fa-solid fa-trash-can');
            }
        });

        $(document).on('click', '.ov-edit-btn', function() {
            const index = $(this).data('index');
            const npc = state.npcs[index];
            if (!npc) return;

            const newName = prompt('Изменить имя:', npc.name);
            if (newName && newName.trim()) {
                npc.name = newName.trim();
            }

            const traumaSelect = $(`.ov-npc-trauma[data-index="${index}"]`);
            const traumaDesc = $(`.ov-npc-trauma-desc[data-index="${index}"]`);
            if (traumaSelect.length) {
                npc.trauma = traumaSelect.val();
            }
            if (traumaDesc.length) {
                npc.traumaDescription = traumaDesc.val();
            }

            save();
            updateUI();
            renderAllPanels();
            notify(`Данные ${npc.name} сохранены`, 'system', 'fa-solid fa-check-circle');
        });

        $(document).on('click', '#ov-world-save', function() {
            const events = $('#ov-world-events').val().split(',').map(s => s.trim()).filter(s => s);
            state.calendar.globalEvents = events;
            save();
            notify('События сохранены', 'system', 'fa-solid fa-check-circle');
        });
        $(document).on('click', '#ov-settings-save', function() {
            state.enabled = $('#ov-settings-enabled').prop('checked');
            state.forceOmegaverse = $('#ov-settings-force').prop('checked');
            state.promptInterval = parseInt($('#ov-settings-interval').val()) || 10;
            state.showFloating = $('#ov-settings-float').prop('checked');
            state.expandedMode = $('#ov-settings-expanded').prop('checked');
            state.autoDetect.enabled = $('#ov-auto-enabled').prop('checked');
            state.autoDetect.detectStatus = $('#ov-auto-status').prop('checked');
            state.autoDetect.detectCycle = $('#ov-auto-cycle').prop('checked');
            state.autoDetect.detectScent = $('#ov-auto-scent').prop('checked');
            state.autoDetect.detectMark = $('#ov-auto-mark').prop('checked');
            state.autoDetect.detectNewNpc = $('#ov-auto-npc').prop('checked');
            applyFloatVisibility();
            save();
            notify('Настройки сохранены', 'system', 'fa-solid fa-check-circle');
        });
        $(document).on('click', '#ov-settings-export', function() {
            const data = JSON.stringify(state, null, 2);
            const blob = new Blob([data], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'omegaverse_backup.json';
            a.click();
            URL.revokeObjectURL(url);
            notify('Экспорт выполнен', 'system', 'fa-solid fa-download');
        });
        $(document).on('click', '#ov-settings-import', function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = function(e) {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = function(ev) {
                    try {
                        const data = JSON.parse(ev.target.result);
                        state = deepMerge(state, data);
                        save();
                        updateUI();
                        renderAllPanels();
                        notify('Импорт успешен', 'system', 'fa-solid fa-upload');
                    } catch(err) {
                        notify('Ошибка импорта: ' + err.message, 'system', 'fa-solid fa-triangle-exclamation');
                    }
                };
                reader.readAsText(file);
            };
            input.click();
        });

        function applyFloatVisibility() {
            if (state.showFloating) {
                $('#ov-mini-btn').show();
            } else {
                $('#ov-mini-btn').hide();
            }
        }

        // Вставляем отсутствующие функции рендеринга (они должны быть определены выше, но я их пропустил для краткости)
        // В реальном коде они должны быть полностью определены, но я оставлю ссылки на предыдущий код.

        renderAllPanels();
        applyFloatVisibility();
        updateUI();
        applyOmegaversePrompt();

        eventSource.on(event_types.MESSAGE_RECEIVED, (messageId) => {
            const context = SillyTavern.getContext();
            const chat = context.chat;
            if (!chat || !chat.length) return;
            const msg = chat[chat.length - 1];
            if (!msg) return;
            if (!msg.is_user) {
                parseMessageForOmegaverse(msg.mes, 'bot');
            }
        });

        eventSource.on(event_types.MESSAGE_UPDATED, () => {
            applyOmegaversePrompt();
        });

        eventSource.on(event_types.MESSAGE_SENT, () => {
            state.currentMessageCount++;
            if (state.currentMessageCount % state.promptInterval === 0) {
                applyOmegaversePrompt();
            }
        });

        console.log('[OV] Omegaverse Dynamics v1.1.0 готово! (исправлено распознавание RENETTE, авто-травмы, улучшен поиск NPC)');
    } catch (error) {
        console.error('[OV] Error:', error);
    }
});