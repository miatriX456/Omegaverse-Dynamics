import { setExtensionPrompt, extension_prompt_types, eventSource, event_types } from '../../../../script.js';

const extensionName = 'omegaverse-dynamics';

// ============================================================
// 1. ДАННЫЕ: ЗАПАХИ (только для Омегаверса)
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
            { id: 'honey', name: 'Мёд', desc: 'Сладкий, тягучий, но в нежной категории — разреженный, как липовый.', tags: ['omega', 'unisex'] }
        ]
    },
    sweet: {
        name: "Сладкие / Гурманские",
        icon: "fa-solid fa-cake-candles",
        scents: [
            { id: 'caramel', name: 'Карамель', desc: 'Интенсивный, сливочно-сладкий, кондитерский.', tags: ['omega'] },
            { id: 'chocolate', name: 'Шоколад', desc: 'Плотный, тёплый, от горького до молочного какао.', tags: ['omega', 'beta'] },
            { id: 'cinnamon', name: 'Корица', desc: 'Пряная, сухая сладость, согревающая.', tags: ['omega', 'alpha'] },
            { id: 'coconut', name: 'Кокос', desc: 'Экзотический, кремовый, выраженно сладкий.', tags: ['omega'] },
            { id: 'strawberry', name: 'Клубника', desc: 'Яркий, сочный, карамельно-ягодный.', tags: ['omega'] }
        ]
    },
    fresh: {
        name: "Свежие / Озоновые",
        icon: "fa-solid fa-wind",
        scents: [
            { id: 'mint', name: 'Мята', desc: 'Прохладный, ментоловый, резко освежающий.', tags: ['alpha', 'unisex'] },
            { id: 'sea_salt', name: 'Морская соль', desc: 'Минеральный, холодный, акватический.', tags: ['alpha', 'unisex'] },
            { id: 'rain', name: 'Озон / Дождь', desc: 'Запах грозы, влажного асфальта, разреженного воздуха.', tags: ['alpha', 'unisex'] },
            { id: 'eucalyptus', name: 'Эвкалипт', desc: 'Камфорный, лекарственно-свежий, пронзительный.', tags: ['alpha'] },
            { id: 'citrus_mix', name: 'Цитрусовый микс', desc: 'Лайм, лимон, грейпфрут. Кислый, бодрящий.', tags: ['alpha', 'unisex'] }
        ]
    },
    woody: {
        name: "Древесные / Смолистые",
        icon: "fa-solid fa-tree",
        scents: [
            { id: 'sandalwood', name: 'Сандал', desc: 'Сливочно-древесный, тёплый, медитативный.', tags: ['alpha', 'beta', 'unisex'] },
            { id: 'cedar', name: 'Кедр', desc: 'Сухой, хвойный, благородный карандашный оттенок.', tags: ['alpha'] },
            { id: 'pine', name: 'Сосна / Смола', desc: 'Резкий хвойный, янтарный, лесной.', tags: ['alpha'] },
            { id: 'vetiver', name: 'Ветивер', desc: 'Дымный, земляной, горько-древесный.', tags: ['alpha'] },
            { id: 'oud', name: 'Уд', desc: 'Глубокий, анималистичный, дорогой, древесно-кожаный.', tags: ['alpha'] }
        ]
    },
    tart: {
        name: "Терпкие / Пряные",
        icon: "fa-solid fa-pepper-hot",
        scents: [
            { id: 'leather', name: 'Кожа', desc: 'Дорогой салон, куртка, дегтярный оттенок. Грубый.', tags: ['alpha'] },
            { id: 'tobacco', name: 'Табак', desc: 'Сухой табачный лист, дорогой сигарный дым.', tags: ['alpha', 'unisex'] },
            { id: 'black_pepper', name: 'Чёрный перец', desc: 'Острый, щекочущий нос, горячий.', tags: ['alpha'] },
            { id: 'coffee', name: 'Горький кофе', desc: 'Обжаренные зёрна, эспрессо, без сладости.', tags: ['alpha', 'beta'] },
            { id: 'whiskey', name: 'Алкоголь / Виски', desc: 'Торфяной, дубовая бочка, согревающий.', tags: ['alpha'] }
        ]
    },
    chypre: {
        name: "Шипровые",
        icon: "fa-solid fa-mountain",
        scents: [
            { id: 'chypre_classic', name: 'Классический шипр', desc: 'Цитрусы, дубовый мох, пачули, лабданум. Строгий, собранный.', tags: ['alpha', 'unisex'] },
            { id: 'chypre_bergamot', name: 'Шипр с бергамотом', desc: 'Искрящийся старт и контраст с мхом.', tags: ['alpha', 'unisex'] },
            { id: 'chypre_oakmoss', name: 'Шипр с дубовым мхом', desc: 'Сухая, прохладная «зелёность» и структура.', tags: ['alpha', 'unisex'] },
            { id: 'chypre_patchouli', name: 'Шипр с пачули', desc: 'Землистая глубина и стойкость.', tags: ['alpha', 'unisex'] }
        ]
    }
}; // <-- ИСПРАВЛЕНО: Закрывает chypre и весь объект SCENT_CATEGORIES

// ============================================================
// 2. СОСТОЯНИЕ (добавлены настройки автообнаружения)
// ============================================================
let state = {
    npcs: [],
    promptInterval: 5,
    currentMessageCount: 0,
    showFloating: true,
    promptWeight: '0.5',
    autoDetect: {
        detectNewNpc: true,
        detectStatus: true,
        detectCycle: true,
        detectScent: true,
        detectMark: true,
        detectBond: true
    }
};

// ============================================================
// 3. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================
function getScentById(scentId) {
    for (const cat in SCENT_CATEGORIES) {
        const found = SCENT_CATEGORIES[cat].scents.find(s => s.id === scentId);
        if (found) return found;
    }
    return null;
}

function save() {
    localStorage.setItem(extensionName + '-state', JSON.stringify(state));
}

function load() {
    const saved = localStorage.getItem(extensionName + '-state');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            state = Object.assign({}, state, parsed);
            if (!state.autoDetect) {
                state.autoDetect = {
                    detectNewNpc: true,
                    detectStatus: true,
                    detectCycle: true,
                    detectScent: true,
                    detectMark: true,
                    detectBond: true
                };
            }
        } catch (e) {
            console.error('[' + extensionName + '] Ошибка загрузки:', e);
        }
    }
}

function notify(text, type = 'system', icon = 'fa-solid fa-info-circle') {
    toastr.info(`<i class="${icon}"></i> ${text}`, 'Omegaverse');
}

// ============================================================
// 4. ЛОГИКА ОМЕГАВЕРСА И ПОРЯДОК СОРТИРОВКИ ФАКТОВ
// ============================================================
function getStatusLabel(status) {
    const map = { 'alpha': 'Альфа', 'beta': 'Бета', 'omega': 'Омега', 'enigma': 'Энигма' };
    return map[status] || 'Неизвестно';
}

function getCycleLabel(type) {
    const map = { 'none': 'Нет', 'heat': 'Течка', 'rut': 'Гон' };
    return map[type] || 'Нет';
}

function addFact(npc, key, text) {
    if (!npc.log) npc.log = [];
    npc.log = npc.log.filter(f => f.key !== key);
    npc.log.push({
        id: Date.now() + Math.random().toString(36).substr(2, 5),
        key: key,
        text: text,
        timestamp: new Date().toLocaleString()
    });
}

function generateSystemPrompt() {
    if (!state.npcs || state.npcs.length === 0) return '';
    let prompt = `\n[WORLD INFO: OMEGAVERSE SYSTEM ACTIVE]\n`;
    state.npcs.forEach(npc => {
        let statusText = getStatusLabel(npc.status);
        if (npc.fakeStatus) {
            statusText += ` (скрывается под видом: ${getStatusLabel(npc.fakeStatus)})`;
        }
        let npcPrompt = `- ${npc.name}: Вторичный пол = ${statusText}.`;
        if (npc.role && npc.role !== 'none') {
            npcPrompt += ` Роль в иерархии: ${npc.role}.`;
        }
        let scents = [];
        if (npc.scent.primary) {
            const s = getScentById(npc.scent.primary);
            scents.push(`основной: ${s ? s.name : npc.scent.primary}`);
        }
        if (npc.scent.secondary) scents.push(`второстепенный: ${npc.scent.secondary}`);
        if (npc.scent.nuance) scents.push(`нюанс: ${npc.scent.nuance}`);
        if (npc.scent.territory) scents.push(`территориальный: ${npc.scent.territory}`);
        if (scents.length > 0) {
            npcPrompt += ` Запах (${scents.join(', ')}).`;
        }
        if (npc.cycle && npc.cycle.type !== 'none' && npc.cycle.active) {
            npcPrompt += ` Текущее состояние цикла: ${getCycleLabel(npc.cycle.type)}!`;
        }
        if (npc.mark && npc.mark.has) {
            npcPrompt += ` Имеет метку (Владелец: ${npc.mark.owner || 'неизвестен'}, Цель: ${npc.mark.target || 'неизвестна'}).`;
        }
        if (npc.bond && npc.bond.has) {
            npcPrompt += ` Связан истинной связью (Партнёр: ${npc.bond.partner || 'неизвестен'}).`;
        }
        if (npc.trauma && npc.trauma !== 'none') {
            npcPrompt += ` Психологическая травма: ${npc.trauma === 'broken_bond' ? 'Разрыв связи' : 'Выгорание запаха'}. Описание: ${npc.traumaDescription || 'Нет подробностей'}.`;
        }
        if (npc.log && npc.log.length > 0) {
            npcPrompt += ` Зафиксированные факты изменений:`;
            npc.log.forEach(f => {
                npcPrompt += ` [${f.timestamp}] ${f.text};`;
            });
        }
        prompt += npcPrompt + `\n`;
    });
    return prompt;
}

function applyOmegaversePrompt() {
    const promptContent = generateSystemPrompt();
    if (!promptContent.trim()) {
        setExtensionPrompt(extensionName, '', extension_prompt_types.IN_CHAT, state.promptWeight);
        return;
    }
    setExtensionPrompt(extensionName, promptContent, extension_prompt_types.IN_CHAT, state.promptWeight);
}

// ============================================================
// 5. УПРАВЛЕНИЕ ПЕРСОНАЖАМИ И ИХ СОЗДАНИЕ
// ============================================================
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
        trauma: 'none', // ИСПРАВЛЕНО: дублирование lastUpdate убрано
        traumaDescription: '',
        lastUpdate: Date.now()
    };
    state.npcs.push(newNpc);
    save();
    notify(`NPC "${name}" добавлен`, 'system', 'fa-solid fa-user-plus');
    updateUI();
    renderAllPanels();
}

function removeNpc(index) {
    if (index >= 0 && index < state.npcs.length) {
        const name = state.npcs[index].name;
        state.npcs.splice(index, 1);
        save();
        notify(`NPC "${name}" удалён`, 'system', 'fa-solid fa-user-minus');
        updateUI();
        renderAllPanels();
    }
}

// ============================================================
// 6. АВТОМАТИЧЕСКИЙ ПАРСИНГ И АНАЛИЗ ТЕКСТА (LLM-Детекция)
// ============================================================
function parseMessageForOmegaverse(text, sender) {
    console.log('[OV Debug] Начинаем парсинг текста от:', sender);
    const rules = [];
    if (state.autoDetect.detectNewNpc) {
        rules.push("Если в тексте появляется или активно упоминается новый персонаж, которого нет в списке, укажи его имя в 'newNpc'. Также попробуй сразу определить его пол ('alpha', 'beta', 'omega', 'enigma'). Если персонаж уже есть в списке — поле 'newNpc' должно быть строго null.");
    }
    if (state.autoDetect.detectStatus) {
        rules.push("Определи вторичный пол персонажа (из контекста или если он изменился/раскрылся): 'alpha', 'beta', 'omega', 'enigma'. Запиши в 'status'. Если нет явных указаний, оставь null.");
    }
    if (state.autoDetect.detectCycle) {
        rules.push("Определи, начался ли у персонажа гон или течка. Возможные значения для 'cycle': 'heat' (течка), 'rut' (гон), 'none' (завершился или отсутствует). Если упоминания нет, верни null.");
    }
    if (state.autoDetect.detectScent) {
        rules.push("Определи базовый запах персонажа. Выбери наиболее подходящий строгий ID запаха из доступного списка: " +
            Object.keys(SCENT_CATEGORIES).map(c => SCENT_CATEGORIES[c].scents.map(s => s.id).join(', ')).join(', ') +
            ". Если запах уникальный и его нет в списке, запиши его строкой (например, 'лаванда'). Если упоминания запаха нет, верни null.");
    }
    if (state.autoDetect.detectMark) {
        rules.push("Определи, была ли поставлена метка (укус в шею) в этом сообщении. Если да, установи 'mark' в true, иначе null.");
    }
    if (state.autoDetect.detectBond) {
        rules.push("Определи, сформировалась ли истинная связь между персонажами в этом сообщении. Если да, установи 'bond' в true, иначе null.");
    }

    if (rules.length === 0) return;

    const systemInstruction = `Ты — вспомогательный модуль анализа скрытой динамики мира (Омегаверс). Твоя задача — проанализировать последнее сообщение и вернуть СТРОГИЙ JSON объект с изменениями.
Правила анализа:
${rules.map((r, i) => `${i + 1}. ${r}`).join('\n')}

ВАЖНО: Поле 'newNpc' должно содержать имя персонажа ТОЛЬКО если это абсолютно новый персонаж, которого нужно добавить в систему. Если речь идет о персонаже, который уже существует, или о действиях главного героя/собеседника, имя которого уже известно системе, поле 'newNpc' должно быть null, а все остальные изменения (status, cycle, scent) должны относиться к этому существующему персонажу (в этом случае логика скрипта автоматически свяжет изменения по контексту, но ты должен вернуть 'newNpc': null, а имя существующего персонажа, если необходимо для привязки изменений, можешь не указывать, скрипт привяжет к текущему говорящему боту). Стоп, давай сделаем проще: если персонаж уже существует, укажи его имя в 'newNpc', чтобы скрипт знал, КОМУ обновлять параметры, но скрипт проверит, если он есть — он просто обновит параметры, а не создаст дубликат! Да, точно: 'newNpc' должен ВСЕГДА содержать имя персонажа, у которого зафиксированы изменения.

Возвращай ТОЛЬКО чистый JSON объект следующего вида (без markdown, без \`\`\`json):
{
  "newNpc": "Имя Персонажа или null",
  "status": "alpha/beta/omega/enigma или null",
  "cycle": "heat/rut/none или null",
  "scent": "ID запаха или строка или null",
  "mark": true/null,
  "bond": true/null
}`;

    const context = SillyTavern.getContext();
    const chat = context.chat;
    const lastMessages = chat.slice(-3).map(m => `${m.name}: ${m.mes}`).join('\n\n');

    console.log('[OV Debug] Отправляем запрос в LLM для детекции изменений...');
    SillyTavern.requestGenericCompletion(systemInstruction, lastMessages)
        .then(response => {
            console.log('[OV Debug] Получен ответ от LLM:', response);
            try {
                const cleaned = response.replace(/```json/g, '').replace(/```/g, '').trim();
                const detected = JSON.parse(cleaned);
                if (detected && detected.newNpc) {
                    applyDetectedChanges(detected);
                }
            } catch (err) {
                console.error('[OV Детектор] Не удалось распарсить JSON ответ:', err, response);
            }
        })
        .catch(err => {
            console.error('[OV Детектор] Ошибка генерации запроса:', err);
        });
}

function applyDetectedChanges(detected) {
    let hasChanged = false;
    let npc = null;

    // 1. Поиск или создание NPC
    if (detected.newNpc) {
        npc = state.npcs.find(n => n.name.toLowerCase() === detected.newNpc.toLowerCase());
        
        if (!npc && state.autoDetect.detectNewNpc) {
            npc = {
                name: detected.newNpc,
                status: detected.status || 'beta',
                fakeStatus: null,
                role: 'none',
                scent: { primary: detected.scent || null, secondary: null, nuance: null, territory: null },
                cycle: { type: detected.cycle || 'none', duration: 5, interval: 28, nextDate: null, active: false },
                mark: { has: false, owner: null, target: null },
                bond: { has: false, partner: null },
                interests: { romantic: [], sexual: [] },
                log: [],
                avatar: '',
                trauma: 'none',
                traumaDescription: '',
                lastUpdate: Date.now()
            };
            state.npcs.push(npc);
            notify(`Обнаружен новый персонаж: ${detected.newNpc} (${getStatusLabel(npc.status)})`, 'system', 'fa-solid fa-user-plus');
            
            // Запись факта создания вынесена из цикла
            addFact(npc, 'creation', `Персонаж автоматически добавлен в систему со статусом "${getStatusLabel(npc.status)}"`);
            hasChanged = true;
        }
    }

    if (!npc) return; // Если персонажа нет и создать не удалось, выходим

    // 2. Изменение статуса (у существующего персонажа)
    if (detected.status && state.autoDetect.detectStatus && npc.status !== detected.status) {
        npc.status = detected.status;
        npc.lastUpdate = Date.now();
        notify(`Статус ${npc.name} обновлён: ${getStatusLabel(detected.status)}`, 'system', 'fa-solid fa-rotate');
        addFact(npc, 'status_change', `Динамически изменён вторичный пол на "${getStatusLabel(detected.status)}"`);
        hasChanged = true;
    }

    // 3. Изменение цикла (течка / гон)
    if (detected.cycle && state.autoDetect.detectCycle && npc.cycle.type !== detected.cycle) {
        const cycleType = detected.cycle;
        npc.cycle.type = cycleType;
        
        if (cycleType !== 'none') {
            npc.cycle.active = true;
            npc.cycle.startDate = new Date().toISOString().split('T')[0];
            const start = new Date(npc.cycle.startDate);
            start.setDate(start.getDate() + (npc.cycle.interval || 28));
            npc.cycle.nextDate = start.toISOString().split('T')[0];
            notify(`У ${npc.name} начался ${cycleType === 'heat' ? 'течка' : 'гон'}`, 'system', 'fa-solid fa-fire');
            addFact(npc, 'cycle_start', `Зафиксировано начало биологического цикла: ${getCycleLabel(cycleType)}`);
        } else {
            npc.cycle.active = false;
            npc.cycle.nextDate = null;
            notify(`У ${npc.name} завершился активный цикл`, 'system', 'fa-solid fa-ice-cream');
            addFact(npc, 'cycle_end', `Биологический цикл (течка/гон) успешно завершён`);
        }
        npc.lastUpdate = Date.now();
        hasChanged = true;
    }

    // 4. Изменение запаха
    if (detected.scent && state.autoDetect.detectScent && npc.scent.primary !== detected.scent) {
        npc.scent.primary = detected.scent;
        npc.lastUpdate = Date.now();
        const scentObj = getScentById(detected.scent);
        const scentName = scentObj ? scentObj.name : detected.scent;
        notify(`У ${npc.name} обнаружен запах: ${scentName}`, 'system', 'fa-solid fa-wand-sparkles');
        addFact(npc, 'scent_detect', `Впервые зафиксирован или изменён аромат: ${scentName}`);
        hasChanged = true;
    }

    // 5. Появление метки
    if (detected.mark && state.autoDetect.detectMark && !npc.mark.has) {
        npc.mark.has = true;
        npc.lastUpdate = Date.now();
        notify(`${npc.name} получил метку!`, 'system', 'fa-solid fa-link');
        addFact(npc, 'mark_gained', `На персонажа была поставлена постоянная метка укуса`);
        hasChanged = true;
    }

    // 6. Установление связи (Бонд)
    if (detected.bond && state.autoDetect.detectBond && !npc.bond.has) {
        npc.bond.has = true;
        npc.lastUpdate = Date.now();
        notify(`${npc.name} установил истинную связь!`, 'system', 'fa-solid fa-heart-pulse');
        addFact(npc, 'bond_formed', `Сформирована неразрывная истинная связь между партнёрами`);
        hasChanged = true;
    }

    // ИСПРАВЛЕНО: Дублирующиеся блоки addFact() удалены. Все сохранения и обновления UI происходят один раз в конце функции.
    if (hasChanged) {
        save();
        updateUI();
        renderAllPanels();
        applyOmegaversePrompt();
    }
}

// ============================================================
// 7. ИНТЕРФЕЙС УПРАВЛЕНИЯ И НАСТРОЕК (UI)
// ============================================================
function updateUI() {
    applyOmegaversePrompt();
}

function renderAllPanels() {
    renderNpcListContent();
    renderConfigPanelContent();
}

function renderNpcListContent() {
    const container = $('#ov-npc-items');
    if (!container.length) return;
    container.empty();

    if (state.npcs.length === 0) {
        container.append('<div class="ov-empty-notice">Список пуст. Добавьте персонажа выше или включите автодетекцию в настройках.</div>');
        return;
    }

    state.npcs.forEach((npc, index) => {
        let scents = [];
        if (npc.scent.primary) {
            const s = getScentById(npc.scent.primary);
            scents.push(s ? s.name : npc.scent.primary);
        }
        if (npc.scent.secondary) scents.push(npc.scent.secondary);
        const scentText = scents.length > 0 ? scents.join(' + ') : 'Не определен';

        let cycleStatus = getCycleLabel(npc.cycle.type);
        if (npc.cycle.active && npc.cycle.type !== 'none') {
            cycleStatus += ' (Активен)';
        }

        const html = `
            <div class="ov-npc-card" data-index="${index}">
                <div class="ov-card-header">
                    <span class="ov-card-title">${npc.name}</span>
                    <button class="ov-delete-btn" data-index="${index}" title="Удалить"><i class="fa-solid fa-trash-can"></i></button>
                </div>
                <div class="ov-card-grid">
                    <div><strong>Пол:</strong> <span class="ov-badge ${npc.status}">${getStatusLabel(npc.status)}</span></div>
                    <div><strong>Цикл:</strong> <span class="ov-badge-cycle ${npc.cycle.active ? 'active' : ''}">${cycleStatus}</span></div>
                    <div class="ov-fullwidth"><strong>Запах:</strong> <span>${scentText}</span></div>
                    <div><strong>Метка:</strong> <span>${npc.mark.has ? 'Есть' : 'Нет'}</span></div>
                    <div><strong>Связь:</strong> <span>${npc.bond.has ? 'Есть' : 'Нет'}</span></div>
                </div>
                
                <div class="ov-trauma-section">
                    <label>Травма:</label>
                    <select class="ov-trauma-select" data-index="${index}">
                        <option value="none" ${npc.trauma === 'none' ? 'selected' : ''}>Нет</option>
                        <option value="broken_bond" ${npc.trauma === 'broken_bond' ? 'selected' : ''}>Разрыв связи</option>
                        <option value="scent_burnout" ${npc.trauma === 'scent_burnout' ? 'selected' : ''}>Выгорание запаха</option>
                    </select>
                    <input type="text" class="ov-trauma-desc" data-index="${index}" placeholder="Описание травмы..." value="${npc.traumaDescription || ''}">
                </div>

                <div class="ov-card-actions">
                    <button class="ov-edit-btn" data-index="${index}"><i class="fa-solid fa-user-gear"></i> Изменить</button>
                </div>
            </div>
        `;
        container.append(html);
    });
}

function openEditModal(index) {
    const npc = state.npcs[index];
    if (!npc) return;

    let scentOptions = '<option value="">-- Выберите запах --</option>';
    for (const cat in SCENT_CATEGORIES) {
        scentOptions += `<optgroup label="${SCENT_CATEGORIES[cat].name}">`;
        SCENT_CATEGORIES[cat].scents.forEach(s => {
            scentOptions += `<option value="${s.id}" ${npc.scent.primary === s.id ? 'selected' : ''}>${s.name}</option>`;
        });
        scentOptions += `</optgroup>`;
    }

    const modalHtml = `
        <div id="ov-modal-overlay" class="ov-modal-overlay">
            <div class="ov-modal-content">
                <h3>Редактирование: ${npc.name}</h3>
                
                <div class="ov-field-group">
                    <label>Вторичный пол:</label>
                    <select id="modal-status">
                        <option value="alpha" ${npc.status === 'alpha' ? 'selected' : ''}>Альфа</option>
                        <option value="beta" ${npc.status === 'beta' ? 'selected' : ''}>Бета</option>
                        <option value="omega" ${npc.status === 'omega' ? 'selected' : ''}>Омега</option>
                        <option value="enigma" ${npc.status === 'enigma' ? 'selected' : ''}>Энигма</option>
                    </select>
                </div>

                <div class="ov-field-group">
                    <label>Основной запах:</label>
                    <select id="modal-scent-primary">${scentOptions}</select>
                </div>

                <div class="ov-field-group">
                    <label>Состояние цикла:</label>
                    <select id="modal-cycle-type">
                        <option value="none" ${npc.cycle.type === 'none' ? 'selected' : ''}>Нет</option>
                        <option value="heat" ${npc.cycle.type === 'heat' ? 'selected' : ''}>Течка</option>
                        <option value="rut" ${npc.cycle.type === 'rut' ? 'selected' : ''}>Гон</option>
                    </select>
                </div>

                <div class="ov-checkbox-group">
                    <label><input type="checkbox" id="modal-mark" ${npc.mark.has ? 'checked' : ''}> Наличие метки</label>
                    <label><input type="checkbox" id="modal-bond" ${npc.bond.has ? 'checked' : ''}> Наличие связи</label>
                </div>

                <div class="ov-modal-buttons">
                    <button id="ov-modal-save" class="menu_button save_btn">Сохранить</button>
                    <button id="ov-modal-close" class="menu_button">Закрыть</button>
                </div>
            </div>
        </div>
    `;

    $('body').append(modalHtml);

    $('#ov-modal-close, #ov-modal-overlay').on('click', function(e) {
        if (e.target === this) $('#ov-modal-overlay').remove();
    });

    $('#ov-modal-save').on('click', function() {
        npc.status = $('#modal-status').val();
        npc.scent.primary = $('#modal-scent-primary').val();
        npc.cycle.type = $('#modal-cycle-type').val();
        npc.cycle.active = npc.cycle.type !== 'none';
        npc.mark.has = $('#modal-mark').is(':checked');
        npc.bond.has = $('#modal-bond').is(':checked');
        npc.lastUpdate = Date.now();

        save();
        $('#ov-modal-overlay').remove();
        notify(`Параметры ${npc.name} успешно изменены`, 'system', 'fa-solid fa-user-check');
        renderAllPanels();
        updateUI();
    });
}

function renderConfigPanelContent() {
    const configContainer = $('#ov-config-options');
    if (!configContainer.length) return;
    configContainer.empty();

    const html = `
        <div class="ov-settings-block">
            <h4>Глобальные настройки</h4>
            <div class="ov-field-group">
                <label>Интервал подмешивания системного промпта (в сообщениях):</label>
                <input type="number" id="ov-cfg-interval" value="${state.promptInterval}" min="1" max="50">
            </div>
            <div class="ov-field-group">
                <label>Сила (вес) влияния промпта:</label>
                <select id="ov-cfg-weight">
                    <option value="0.1" ${state.promptWeight === '0.1' ? 'selected' : ''}>0.1 (Минимальный)</option>
                    <option value="0.3" ${state.promptWeight === '0.3' ? 'selected' : ''}>0.3 (Слабый)</option>
                    <option value="0.5" ${state.promptWeight === '0.5' ? 'selected' : ''}>0.5 (Средний)</option>
                    <option value="0.8" ${state.promptWeight === '0.8' ? 'selected' : ''}>0.8 (Сильный)</option>
                    <option value="1.0" ${state.promptWeight === '1.0' ? 'selected' : ''}>1.0 (Абсолютный)</option>
                </select>
            </div>
            <div class="ov-checkbox-group">
                <label><input type="checkbox" id="ov-cfg-floating" ${state.showFloating ? 'checked' : ''}> Показывать плавающую кнопку быстрого доступа</label>
            </div>
        </div>

        <div class="ov-settings-block" style="margin-top: 15px;">
            <h4>Автоматическая LLM детекция (Нейро-сканирование)</h4>
            <div class="ov-checkbox-grid">
                <label><input type="checkbox" id="ov-det-npc" ${state.autoDetect.detectNewNpc ? 'checked' : ''}> Нахождение новых персонажей</label>
                <label><input type="checkbox" id="ov-det-status" ${state.autoDetect.detectStatus ? 'checked' : ''}> Распознавание вторичного пола</label>
                <label><input type="checkbox" id="ov-det-cycle" ${state.autoDetect.detectCycle ? 'checked' : ''}> Изменения циклов (течка/гон)</label>
                <label><input type="checkbox" id="ov-det-scent" ${state.autoDetect.detectScent ? 'checked' : ''}> Определение новых запахов</label>
                <label><input type="checkbox" id="ov-det-mark" ${state.autoDetect.detectMark ? 'checked' : ''}> Детекция узлов и укусов меток</label>
                <label><input type="checkbox" id="ov-det-bond" ${state.autoDetect.detectBond ? 'checked' : ''}> Определение истинных связей</label>
            </div>
        </div>
    `;
    configContainer.append(html);
}

// ============================================================
// 8. ИНИЦИАЛИЗАЦИЯ И ИНТЕГРАЦИЯ В SILLYTAVERN
// ============================================================
jQuery(() => {
    load();

    const panelHtml = `
        <div id="omegaverse-dynamics-panel" class="ov-main-panel shadow-v2">
            <div class="ov-panel-header">
                <h3><i class="fa-solid fa-dna"></i> Модуль Динамики Омегаверса</h3>
                <span id="ov-close-btn" class="ov-close-btn">&times;</span>
            </div>
            <div class="ov-tabs">
                <button class="ov-tab-btn active" data-tab="npcs"><i class="fa-solid fa-users"></i> Персонажи</button>
                <button class="ov-tab-btn" data-tab="config"><i class="fa-solid fa-sliders"></i> Настройки</button>
            </div>
            
            <div class="ov-tab-content active" id="ov-tab-npcs">
                <div class="ov-add-npc-bar">
                    <input type="text" id="ov-new-npc-name" placeholder="Имя нового персонажа...">
                    <button id="ov-add-npc-btn" class="menu_button"><i class="fa-solid fa-plus"></i></button>
                </div>
                <div id="ov-npc-items" class="ov-scroll-container"></div>
            </div>

            <div class="ov-tab-content" id="ov-tab-config">
                <div id="ov-config-options" class="ov-scroll-container"></div>
                <div class="ov-panel-footer-actions">
                    <button id="ov-import-btn" class="menu_button"><i class="fa-solid fa-file-import"></i> Импорт</button>
                    <button id="ov-export-btn" class="menu_button"><i class="fa-solid fa-file-export"></i> Экспорт</button>
                </div>
            </div>
        </div>
        <div id="ov-mini-btn" class="ov-floating-icon shadow-v2" title="Открыть Омегаверс модуль" style="display:none;">
            <i class="fa-solid fa-dna"></i>
        </div>
    `;

    $('body').append(panelHtml);

    // Добавление стилей модуля
    const styles = `
        .ov-main-panel { position: fixed; top: 80px; right: 20px; width: 380px; max-height: 80vh; background: var(--nav-bar-bg, #222); border: 1px solid var(--borderColor, #444); border-radius: 8px; z-index: 9999; display: none; flex-direction: column; color: var(--text-color, #fff); font-family: sans-serif; }
        .ov-panel-header { display: flex; justify-content: space-between; align-items: center; padding: 10px 15px; background: rgba(0,0,0,0.2); border-bottom: 1px solid var(--borderColor, #444); }
        .ov-panel-header h3 { margin: 0; font-size: 15px; color: #ff5e97; display: flex; align-items: center; gap: 8px; }
        .ov-close-btn { cursor: pointer; font-size: 20px; line-height: 20px; }
        .ov-tabs { display: flex; border-bottom: 1px solid var(--borderColor, #444); background: rgba(0,0,0,0.1); }
        .ov-tab-btn { flex: 1; padding: 8px; background: none; border: none; color: var(--text-color, #ccc); cursor: pointer; text-align: center; font-size: 13px; }
        .ov-tab-btn.active { background: rgba(255, 94, 151, 0.15); color: #ff5e97; font-weight: bold; border-bottom: 2px solid #ff5e97; }
        .ov-tab-content { display: none; padding: 15px; flex-direction: column; overflow: hidden; }
        .ov-tab-content.active { display: flex; }
        .ov-scroll-container { max-height: 50vh; overflow-y: auto; padding-right: 5px; margin-top: 10px; }
        .ov-add-npc-bar { display: flex; gap: 8px; }
        .ov-add-npc-bar input { flex: 1; padding: 6px; background: var(--input-bg, #111); border: 1px solid var(--borderColor, #444); border-radius: 4px; color: #fff; }
        .ov-npc-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 12px; margin-bottom: 10px; position: relative; }
        .ov-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; border-bottom: 1px dashed rgba(255,255,255,0.1); padding-bottom: 4px; }
        .ov-card-title { font-weight: bold; font-size: 14px; color: #ffbc42; }
        .ov-delete-btn { background: none; border: none; color: #ff4a4a; cursor: pointer; font-size: 13px; }
        .ov-card-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 12px; }
        .ov-fullwidth { grid-column: span 2; }
        .ov-badge { padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 10px; text-transform: uppercase; }
        .ov-badge.alpha { background: #ff4136; color: #fff; }
        .ov-badge.omega { background: #0074d9; color: #fff; }
        .ov-badge.beta { background: #aaaaaa; color: #000; }
        .ov-badge.enigma { background: #b10dc9; color: #fff; }
        .ov-badge-cycle { padding: 2px 6px; border-radius: 4px; font-size: 11px; background: rgba(255,255,255,0.1); }
        .ov-badge-cycle.active { background: #ff851b; color: #000; font-weight: bold; animation: pulse 2s infinite; }
        .ov-card-actions { margin-top: 10px; display: flex; justify-content: flex-end; }
        .ov-edit-btn { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 11px; }
        .ov-edit-btn:hover { background: rgba(255,255,255,0.2); }
        .ov-floating-icon { position: fixed; bottom: 80px; right: 20px; width: 45px; height: 45px; background: #ff5e97; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; z-index: 9998; color: #fff; font-size: 20px; }
        .ov-settings-block h4 { margin: 0 0 8px 0; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 3px; color: #4ecdc4; }
        .ov-field-group { margin-bottom: 10px; display: flex; flex-direction: column; gap: 4px; font-size: 12px; }
        .ov-field-group input, .ov-field-group select { padding: 5px; background: var(--input-bg, #111); border: 1px solid var(--borderColor, #444); border-radius: 4px; color: #fff; }
        .ov-checkbox-group, .ov-checkbox-grid { font-size: 12px; display: flex; flex-direction: column; gap: 5px; }
        .ov-checkbox-grid { display: grid; grid-template-columns: 1fr; gap: 6px; }
        .ov-empty-notice { text-align: center; font-size: 12px; color: #888; padding: 20px 10px; }
        .ov-modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.6); z-index: 10000; display: flex; justify-content: center; align-items: center; }
        .ov-modal-content { background: var(--nav-bar-bg, #222); border: 1px solid var(--borderColor, #444); border-radius: 8px; padding: 20px; width: 320px; display: flex; flex-direction: column; gap: 12px; color: #fff; }
        .ov-modal-buttons { display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px; }
        .ov-panel-footer-actions { margin-top: 15px; display: flex; gap: 10px; }
        .ov-panel-footer-actions button { flex: 1; font-size: 12px; padding: 6px; }
        .ov-trauma-section { margin-top: 8px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 8px; display: flex; flex-direction: column; gap: 4px; font-size: 11px; }
        .ov-trauma-select { padding: 3px; background: #111; border: 1px solid #444; border-radius: 4px; color: #fff; }
        .ov-trauma-desc { padding: 4px; background: #111; border: 1px solid #444; border-radius: 4px; color: #fff; }
        @keyframes pulse { 0% { opacity: 0.7; } 50% { opacity: 1; } 100% { opacity: 0.7; } }
    `;
    $('head').append(`<style>${styles}</style>`);

    // Кнопка в верхней панели СиллиТаверн (ST Third-party extension icon entry)
    const topBarButton = $(`<div class="ov-topbar-icon extensionsMenuExtensionButton" title="Динамика Омегаверса"><i class="fa-solid fa-dna"></i></div>`);
    $('#extensionsMenu').append(topBarButton);

    const togglePanel = () => {
        const p = $('#omegaverse-dynamics-panel');
        if (p.is(':visible')) {
            p.fadeOut(150);
        } else {
            renderAllPanels();
            p.fadeIn(150);
        }
    };

    topBarButton.on('click', togglePanel);
    $('#ov-mini-btn').on('click', togglePanel);
    $('#ov-close-btn').on('click', () => $('#omegaverse-dynamics-panel').fadeOut(150));

    // Переключение вкладок
    $('.ov-tab-btn').on('click', function() {
        $('.ov-tab-btn').removeClass('active');
        $(this).addClass('active');
        const tab = $(this).data('tab');
        $('.ov-tab-content').removeClass('active');
        $(`#ov-tab-${tab}`).addClass('active');
    });

    // Обработчики добавления и удаления
    $('#ov-add-npc-btn').on('click', () => {
        const nameInput = $('#ov-new-npc-name');
        const name = nameInput.val().trim();
        if (name) {
            addNpc(name);
            nameInput.val('');
        }
    });

    $(document).on('click', '.ov-delete-btn', function(e) {
        e.stopPropagation();
        const idx = $(this).data('index');
        removeNpc(idx);
    });

    $(document).on('click', '.ov-edit-btn', function() {
        const idx = $(this).data('index');
        openEditModal(idx);
    });

    // ИСПРАВЛЕНО (Пункт 4 из вашего списка): Добавление сохранения полей травмы через .ov-edit-btn
    $(document).on('change', '.ov-trauma-select', function() {
        const idx = $(this).data('index');
        if (state.npcs[idx]) {
            state.npcs[idx].trauma = $(this).val();
            state.npcs[idx].lastUpdate = Date.now();
            save();
            applyOmegaversePrompt();
        }
    });

    $(document).on('input', '.ov-trauma-desc', function() {
        const idx = $(this).data('index');
        if (state.npcs[idx]) {
            state.npcs[idx].traumaDescription = $(this).val();
            state.npcs[idx].lastUpdate = Date.now();
            save();
            applyOmegaversePrompt();
        }
    });

    // Обработчики изменений глобальных настроек
    $(document).on('change', '#ov-cfg-interval', function() {
        state.promptInterval = parseInt($(this).val()) || 5;
        save();
    });

    $(document).on('change', '#ov-cfg-weight', function() {
        state.promptWeight = $(this).val();
        save();
        updateUI();
    });

    $(document).on('change', '#ov-cfg-floating', function() {
        state.showFloating = $(this).is(':checked');
        save();
        applyFloatVisibility();
    });

    // Обработчики настроек детекции
    $(document).on('change', '#ov-det-npc', function() { state.autoDetect.detectNewNpc = $(this).is(':checked'); save(); });
    $(document).on('change', '#ov-det-status', function() { state.autoDetect.detectStatus = $(this).is(':checked'); save(); });
    $(document).on('change', '#ov-det-cycle', function() { state.autoDetect.detectCycle = $(this).is(':checked'); save(); });
    $(document).on('change', '#ov-det-scent', function() { state.autoDetect.detectScent = $(this).is(':checked'); save(); });
    $(document).on('change', '#ov-det-mark', function() { state.autoDetect.detectMark = $(this).is(':checked'); save(); });
    $(document).on('change', '#ov-det-bond', function() { state.autoDetect.detectBond = $(this).is(':checked'); save(); });

    // Экспорт / Импорт настроек
    $(document).on('click', '#ov-export-btn', () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "omegaverse_dynamics_state.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    });

    $(document).on('click', '#ov-import-btn', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = e => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = readerEvent => {
                try {
                    const content = JSON.parse(readerEvent.target.result);
                    if (content.npcs) {
                        state = Object.assign({}, state, content);
                        save();
                        renderAllPanels();
                        updateUI();
                        notify('Данные успешно импортированы', 'system', 'fa-solid fa-file-circle-check');
                    }
                } catch (err) {
                    notify('Ошибка импорта файлов конфигурации', 'error', 'fa-solid fa-triangle-exclamation');
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

    renderAllPanels();
    applyFloatVisibility();
    updateUI();
    applyOmegaversePrompt();

    // ---- ПАРСИНГ СООБЩЕНИЙ С СЕРВЕРА ----
    eventSource.on(event_types.MESSAGE_RECEIVED, (messageId) => {
        const context = SillyTavern.getContext();
        const chat = context.chat;
        if (!chat || !chat.length) return;
        const msg = chat[chat.length - 1];
        if (!msg) return;
        // Автоматически сканируем только сообщения персонажей (ботов)
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

    console.log('[OV Dynamics] Плагин динамики вторичных полов успешно запущен!');
});