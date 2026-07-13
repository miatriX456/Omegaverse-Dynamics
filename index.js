// ========== РЕГИСТРАЦИЯ В SILVERN ==========
(async function () {
    // Ждём глобальный объект SillyTavern
    while (!window.SillyTavern || !window.SillyTavern.getContext) {
        await new Promise(r => setTimeout(r, 200));
    }

    const ST = window.SillyTavern;
    const OV_STATE = new OmegaverseState();
    const OV_PARSER = new OmegaverseParser(OV_STATE);

    // Регистрируем расширение в списке, если ещё нет
    if (typeof ST.extensionManager !== 'undefined') {
        ST.extensionManager.registerExtension({
            name: 'omegaverse-dynamics',
            displayName: 'Omegaverse Dynamics',
            version: '1.0.0',
            author: 'User',
            description: 'Автономный движок Омегаверса',
            onEnable: () => {
                console.log('🧬 Omegaverse Dynamics включен');
                OV_STATE.data.settings.enabled = true;
                OV_STATE.save();
            },
            onDisable: () => {
                console.log('🧬 Omegaverse Dynamics выключен');
                OV_STATE.data.settings.enabled = false;
                OV_STATE.save();
            }
        });
    }

    // Подписка на сообщения
    const context = ST.getContext();
    context.eventSource.on('MESSAGE_RECEIVED', (data) => {
        if (data && data.content && OV_STATE.data.settings.enabled) {
            OV_PARSER.parseMessage(data);
        }

        // Обновление системного промпта раз в N сообщений
        if (OV_STATE.data.settings.forceOmegaverse) {
            const count = parseInt(localStorage.getItem('ov_msg_count') || '0') + 1;
            localStorage.setItem('ov_msg_count', count);
            if (count % OV_STATE.data.settings.reminderInterval === 0) {
                const prompt = buildSystemPrompt(OV_STATE);
                context.setExtensionPrompt('omegaverse', prompt);
            }
        }
    });

    // Инициализация UI после загрузки DOM
    $(document).ready(() => {
        const OV_UI = new OmegaverseUI(OV_STATE, OV_PARSER);
        window.OV_UI = OV_UI;

        if (OV_STATE.data.settings.forceOmegaverse) {
            const prompt = buildSystemPrompt(OV_STATE);
            context.setExtensionPrompt('omegaverse', prompt);
        }

        console.log('🧬 Omegaverse Dynamics готов к работе');
    });
})();