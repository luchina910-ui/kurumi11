/**
 * ГИС ООО «УК «ВСЕ СВОИ» | v0.2 Final
 */
ymaps.ready(initIndustrialGis);

async function initIndustrialGis() {

    const map = new ymaps.Map('map', { center: [64.562, 39.82], zoom: 14, controls: ['zoomControl'] });

    const response = await fetch('/api/objects');
    const root = await response.json();
    const db = root.data;
    const layers = { hM: [], hP: [], tB: [], tBZ: [], pl: [], pk: [] };

    window.openCamera = () => {
        window.openModal('🎥 Камера наблюдения', `
            <div style="text-align:center;">
                <div style="width:100px; height:100px; border:10px solid #f3f3f3; border-top:10px solid #3498db; border-radius:50%; animation:spin 1s linear infinite; margin:auto;"></div>
                <h2 style="font-size:35px; color:#3498db; margin-top:30px;">Идёт подключение...</h2>
                <p>Node_402 Offline.</p>
            </div>`);
    };

    window.openComplaintAction = (addr) => {
        const content = document.getElementById('m-content');
        content.innerHTML = `
            <h1 style="color:#d9534f; font-weight:900; font-size:55px; margin-bottom:10px;">🚨 ОФОРМЛЕНИЕ ЖАЛОБЫ</h1>
            <p style="font-size:24px; margin-bottom:35px;">Объект: <b style="color:#008000;">${addr}</b></p>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-bottom:20px;">
                <input type="text" id="f-fio" placeholder="Ваше полное ФИО" class="premium-card" style="width:100%; padding:25px; border:2px solid #eee; font-size:18px; box-sizing:border-box; outline:none;">
                <input type="tel" id="f-tel" placeholder="Номер телефона для связи" class="premium-card" style="width:100%; padding:25px; border:2px solid #eee; font-size:18px; box-sizing:border-box; outline:none;">
            </div>
            <div style="margin-bottom:20px;">
                <label style="display:block; font-size:16px; font-weight:800; margin-bottom:10px; color:#888; text-transform:uppercase;">Возможная причина:</label>
                <select id="f-reason" class="premium-card" style="width:100%; padding:25px; border:2px solid #eee; font-size:18px; cursor:pointer; appearance: auto; outline:none;">
                    <option value="" disabled selected>-- Выберите категорию (если подходит) --</option>
                    <option value="Мусор">📦 Не вывезен мусор / Переполнение</option>
                    <option value="Поломка">🛠 Сломан бак или ограждение площадки</option>
                    <option value="Парковка">🚗 Проезд заблокирован автомобилем</option>
                    <option value="Освещение">💡 Не работает уличное освещение</option>
                    <option value="Грязь">🧹 Грязь или лед на территории</option>
                    <option value="Другое">🔍 Другое (опишите ниже)</option>
                </select>
            </div>
            <div style="margin-top:10px;">
                <label style="display:block; font-size:16px; font-weight:800; margin-bottom:10px; color:#888; text-transform:uppercase;">Что именно произошло?</label>
                <textarea id="f-desc" class="premium-card" style="width:100%; height:200px; padding:25px; border:2px solid #eee; font-size:18px; resize:none; box-sizing:border-box; outline:none;" placeholder="Напишите здесь детали происшествия..."></textarea>
            </div>
            <button class="ui-btn" style="background:#008000; color:#fff; height:90px; font-size:24px; margin-top:30px; border:none;" onclick="window.sendComplaintConfirm()">
                ОТПРАВИТЬ ДИСПЕТЧЕРУ
            </button>
        `;
        modal.style.display = "flex";
    };

    window.sendComplaintConfirm = () => {
        const sub = document.getElementById('sub-modal-body');
        if (!sub) return;
        const ticketNum = "Ж-" + (Math.floor(Math.random() * 9000) + 1000);
        const fio = document.getElementById('f-fio')?.value || 'Аноним';
        const tel = document.getElementById('f-tel')?.value || 'Не указан';
        const reason = document.getElementById('f-reason')?.value || 'Не указано';
        const desc = document.getElementById('f-desc')?.value || 'Нет описания';
        
        sub.innerHTML = `
            <div class="success-popup" style="padding: 50px; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
                <span class="success-icon">✅</span>
                <h1 style="color:#008000; font-size: 38px; margin-bottom: 15px; font-weight:900;">ОТПРАВЛЕНО!</h1>
                <p style="font-size: 18px; color: #333; margin-bottom: 25px;">Ваша жалоба принята диспетчером</p>
                
                <div style="background: #fff; padding: 30px; border-radius: 25px; border: 3px solid #008000; width: 100%; max-width: 500px; box-shadow: 0 10px 40px rgba(0,128,0,0.15);">
                    <div style="text-align:center; margin-bottom:20px;">
                        <span style="font-size:14px; color:#888;">Номер заявки</span>
                        <div style="background: linear-gradient(135deg, #008000 0%, #00aa44 100%); color: #fff; padding: 12px 30px; border-radius: 15px; font-weight: 900; font-size: 28px; display: inline-block; margin-top:8px;">
                            ${ticketNum}
                        </div>
                    </div>
                    
                    <div style="text-align:left; font-size:15px; line-height:1.8;">
                        <div style="display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid #e8efe8;">
                            <span style="color:#666;">Заявитель:</span>
                            <b style="color:#008000;">${fio}</b>
                        </div>
                        <div style="display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid #e8efe8;">
                            <span style="color:#666;">Телефон:</span>
                            <b style="color:#008000;">${tel}</b>
                        </div>
                        <div style="display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid #e8efe8;">
                            <span style="color:#666;">Причина:</span>
                            <b style="color:#008000;">${reason}</b>
                        </div>
                        <div style="padding:10px 0;">
                            <span style="color:#666; display:block; margin-bottom:5px;">Описание:</span>
                            <p style="margin:0; color:#333; background:#f9fbf9; padding:12px; border-radius:12px;">${desc}</p>
                        </div>
                    </div>
                </div>
                
                <p style="font-size: 15px; color: #888; margin-top: 25px; text-align:center;">⏱️ Ожидайте звонка в течение <b style="color:#008000;">30 минут</b></p>
                <button class="ui-btn" style="margin-top: 25px; background: linear-gradient(135deg, #008000 0%, #00aa44 100%); color: #fff; width: 280px; height: 60px; font-size: 16px;" onclick="window.closeEverything()">ПОНЯТНО</button>
            </div>
        `;
        sub.style.display = "block";
        setTimeout(() => {
            if(sub.style.display === "block") window.closeEverything();
        }, 8000);
    };

    db.forEach(obj => {
        if (obj.id?.startsWith('h')) {
            const hHtml = `
                <div class="house-card-pro">
                    <div class="house-main-content">
                        <div class="house-image-section">
                            <img src="${obj.photo || ''}" class="house-img-pro" onerror="this.src='/dom56.jpg'">
                            <div class="house-title">🏠 ${obj.address}</div>
                        </div>
                        <div class="house-info-section">
                            <div class="house-info-grid">
                                <div class="info-row-compact"><span>🏗️ Год</span><span>${obj.year}</span></div>
                                <div class="info-row-compact"><span>🏢 Этажей</span><span>${obj.floors} эт.</span></div>
                                <div class="info-row-compact"><span>🧱 Материал</span><span>${obj.material || 'Монолит'}</span></div>
                                <div class="info-row-compact"><span>📡 Лифты</span><span>${obj.elevator || 'Falcon'}</span></div>
                                <div class="info-row-compact"><span>🏗️ Застройщик</span><span>${obj.developer || 'Застройщик'}</span></div>
                                <div class="info-row-compact"><span>📐 Площадь</span><span>${obj.area || 'N/A'}</span></div>
                                <div class="info-row-compact"><span>🏘️ Серия</span><span>${obj.series || 'Типовая'}</span></div>
                                <div class="info-row-compact"><span>🔑 Кв.</span><span>${obj.apartments || 'N/A'}</span></div>
                            </div>
                        </div>
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; padding: 20px 30px 30px 30px;">
                        <button class="ui-btn" style="background: linear-gradient(135deg, #3498db 0%, #2980b9 100%); color:#fff;" onclick="window.openCamera()">🎥 КАМЕРА</button>
                        <button class="ui-btn" style="background: linear-gradient(135deg, #d9534f 0%, #c9302c 100%); color:#fff;" onclick="window.openComplaintAction('${obj.address}')">🚨 ЖАЛОБА</button>
                    </div>
                </div>`;

            const m = new ymaps.Placemark(obj.coords, {
                balloonContent: hHtml
            }, {
                preset: 'islands#greenHomeCircleIcon',
                iconScale: 1.8,
                balloonMinWidth: 750,
                balloonMaxWidth: 950,
                balloonMinHeight: 400,
                balloonMaxHeight: 600,
                balloonPanelMaxMapArea: 0
            });
            layers.hM.push(m);
            map.geoObjects.add(m);

            if (obj.boundary) {
                const poly = new ymaps.Polygon([obj.boundary], {}, {
                    fillColor: '#00800015',
                    strokeColor: '#008000',
                    strokeWidth: 5
                });
                layers.hP.push(poly);
            }

            if (obj.infra) {
                obj.infra.forEach(item => {
const color = item.load < 33 ? '#00cc00' : (item.load < 66 ? '#ffa600' : '#ff3300');

                    if (item.type.includes('bin')) {
                        const longTitle = item.type === 'tko_bin'
                            ? "Бак для крупногабаритного мусора"
                            : `Бак для общих отходов ${item.title.includes('2') ? '№2' : '№1'}`;
                        
                        const binTypeKey = item.type === 'tko_bin' ? 'tko' : 'common';
                        
                        const photoHtml = item.photo
                            ? `<img src="${item.photo}" style="width:100%; height:200px; object-fit:cover; border-radius:15px; margin-bottom:15px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">`
                            : '';

                        const bHtml = `
                            <div class="bin-card-modern" style="width:380px; padding:25px; text-align:center;">
                                ${photoHtml}
                                <b style="font-size:26px; color:${color}; display:block; line-height:1.2; margin-bottom:15px; font-weight:900;">
                                    🗑️ ${longTitle}
                                </b>
                                <div class="bin-fill-indicator" style="background: linear-gradient(135deg, #f8faf8 0%, #e8f0e8 100%); border-radius:20px; padding:15px; margin-bottom:15px; border:2px solid ${color}; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
                                    <div style="font-size:14px; color:#666; margin-bottom:8px; font-weight:600; text-transform:uppercase;">Заполненность</div>
                                    <div style="font-size:32px; color:${color}; font-weight:900;">${item.load}%</div>
                                    <div style="width:100%; height:8px; background:#e0e0e0; border-radius:4px; margin-top:10px; overflow:hidden;">
                                        <div style="width:${item.load}%; height:100%; background: linear-gradient(90deg, ${color}, ${color}dd); border-radius:4px; transition: width 0.5s;"></div>
                                    </div>
                                </div>
                                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:15px;">
                                    <div class="info-row" style="font-size:13px; padding:10px; border-left-width:5px; border-left-color:${color};">📦 ${item.volume || '1.1 м³'}</div>
                                    <div class="info-row" style="font-size:13px; padding:10px; border-left-width:5px; border-left-color:${color};">🛠️ ${item.material || 'Сталь'}</div>
                                </div>
                                <div class="info-row" style="border-left:none; border-top:2px solid #3498db; background:#f0f7ff; margin-bottom:20px; font-size:14px; border-radius:12px;">
                                    🕒 Вывоз: ${item.lastEmpty || '08:00'}
                                </div>
                                <button class="ui-btn bin-info-btn" onclick="window.openBinSystemInfo('${binTypeKey}')" style="background: linear-gradient(135deg, #008000 0%, #00aa44 100%); color:#fff; font-size:14px; padding:16px;">
                                    ℹ️ Как работает система отслеживания?
                                </button>
                            </div>`;
                            
                        layers.tB.push(new ymaps.Placemark(item.coords, {
                            balloonContent: bHtml
                        }, {
                            preset: 'islands#trashIcon',
                            iconColor: color,
                            iconScale: 1.5,
                            balloonMinWidth: 420,
                            balloonMaxWidth: 450,
                            balloonMinHeight: 550,
                            balloonMaxHeight: 850,
                            balloonPanelMaxMapArea: 0
                        }));
                    } 
                    else if (item.type === 'parking') {
                        const freeSpots = (item.totalSpots || 0) - (item.busySpots || 0);
                        const pHtml = `
                            <div class="custom-balloon" style="width: 540px; margin: 15px auto;">
                                <b style="color:#00AAFF; font-size:32px; display:block; text-align:center; margin-bottom:10px;">🅿️ ${item.title}</b>
                                <p style="font-size:16px; color:#666; text-align:center; margin-bottom:20px;">ИИ-мониторинг ООО УК «ВСЕ СВОИ»</p>
                                <div class="info-row" style="border-left-color:#00AAFF; font-size:22px; white-space: nowrap; display: flex; justify-content: space-between; align-items: center;">
                                    <span>🚗 Свободно:</span>
                                    <b style="color:#008000;">${freeSpots} <span style="color:#222; font-size:16px; font-weight:400;">из ${item.totalSpots || 0}</span></b>
                                </div>
                                <div class="info-row" style="background:#f4f7f4; border-left:none; text-align:center; margin-top:10px;">
                                    Занятость: <b>${Math.round((item.busySpots / item.totalSpots) * 100) || 0}%</b>
                                </div>
                                <button class="ui-btn" style="background:#3498db; color:#fff; margin-top:15px; width:100%; border-bottom-color:#2980b9;" onclick="window.openCamera()">
                                    СМОТРЕТЬ КАМЕРУ
                                </button>
                            </div>`;

                        layers.pk.push(new ymaps.Placemark(item.coords, { 
                            balloonContent: pHtml 
                        }, { 
                            preset: 'islands#parkingIcon', 
                            iconColor: '#00AAFF', 
                            iconScale: 1.8,
                            balloonMinWidth: 580, 
                            balloonMaxWidth: 480,
                            balloonMinHeight: 250,
                            balloonPanelMaxMapArea: 0,
                            balloonShadow: false,
                            balloonAutoPan: true
                        }));

                        if (item.boundary) {
                            layers.pk.push(new ymaps.Polygon([item.boundary], {}, {
                                fillColor: '#00AAFF20',
                                strokeColor: '#00AAFF',
                                strokeWidth: 2
                            }));
                        }
                    } 
                    else if (item.type === 'playground') {
                        const lHtml = `
                            <div class="custom-balloon" style="width: 440px; margin: 15px auto;">
                                <b style="color:#008000; font-size:30px; display:block; text-align:center; margin-bottom:15px;">🎡 ${item.title}</b>
                                <div class="info-row" style="border-left-color:#008000;">
                                    🧸 Покрытие: <b>${item.surface || 'Резиновая крошка'}</b>
                                </div>
                                <div class="info-row" style="border-left-color:#2ecc71;">
                                    🏃 Спорт: <b>${item.sportEq || 'Турники, брусья'}</b>
                                </div>
                                <div class="info-row" style="border-left-color:#3498db;">
                                    🧩 Инвентарь: <b>${item.kidsEq || 'Горки, качели'}</b>
                                </div>
                                <div class="info-row" style="background:#fff7e6; border-left-color:#ffa500; text-align:center; border-left-width: 0; border-bottom: 4px solid #ffa500;">
                                    👶 Возраст: <b>${item.ageRange || '3-12 лет'}</b>
                                </div>
                                <p style="font-size:13px; color:#888; text-align:center; margin-top:15px;">Сертификат безопасности ГОСТ 52169-2012</p>
                            </div>`;

                        layers.pl.push(new ymaps.Placemark(item.coords, { 
                            balloonContent: lHtml 
                        }, { 
                            preset: 'islands#greenFamilyIcon', 
                            iconScale: 1.8,
                            balloonMinWidth: 480, 
                            balloonMaxWidth: 480,
                            balloonMinHeight: 250,
                            balloonPanelMaxMapArea: 0,
                            balloonShadow: false,
                            balloonAutoPan: true
                        }));

                        if (item.boundary) {
                            layers.pl.push(new ymaps.Polygon([item.boundary], {}, {
                                fillColor: '#00800020',
                                strokeColor: '#008000',
                                strokeWidth: 2
                            }));
                        }
                    }
                });
            }
        }
    });

    const trData = db.find(o => o.type === 'truck_route');
    const truckMarker = new ymaps.Placemark(trData.path[0], {}, { preset: 'islands#oliveDeliveryIcon', iconScale: 2.2 });
    const routeLine = new ymaps.Polyline(trData.path, {}, { strokeColor: '#00FF88', strokeWidth: 10, opacity: 0.4 });
    
    let seg = 0, prog = 0;
    setInterval(() => {
        prog += 0.035; 
        if (prog >= 1) { prog = 0; seg = (seg + 1) % (trData.path.length - 1); }
        const [lat1, lon1] = trData.path[seg];
        const [lat2, lon2] = trData.path[seg+1];
        truckMarker.geometry.setCoordinates([lat1 + (lat2-lat1)*prog, lon1 + (lon2-lon1)*prog]);
    }, 50);

    const modal = document.createElement('div'); 
    modal.className = "modal-overlay"; 
    modal.innerHTML = `
        <div class="modal-win premium-card" id="m-win-body">
            <button class="close-icon" onclick="window.closeEverything()">&times;</button>
            <div id="m-content"></div>
            <div class="sub-modal" id="sub-modal-body"></div>
        </div>`;
    document.body.appendChild(modal);

    window.closeEverything = () => { 
        document.getElementById('sub-modal-body').style.display = "none"; 
        modal.style.display = "none"; 
    };
    
    window.openModal = (t, h) => { 
        document.getElementById('m-content').innerHTML = `<h1 style="color:#008000; font-weight:900; font-size:60px; margin-bottom:45px;">${t}</h1>${h}`; 
        modal.style.display = "flex"; 
    };
    
    window.openSub = (title, text) => {
        const sub = document.getElementById('sub-modal-body');
        sub.innerHTML = `
            <button class="close-icon" onclick="this.parentElement.style.display='none'">&times;</button>
            <h1 style="color:#008000; font-weight:900; font-size:50px; margin-bottom:30px;">${title}</h1>
            <div style="font-size:26px; line-height:1.8; text-align:justify;">${text}</div>
            <button class="ui-btn" style="background:#008000; color:#fff; width:350px; height:100px; margin-top:50px;" onclick="this.parentElement.style.display='none'">ВЕРНУТЬСЯ</button>
        `;
        sub.style.display = "block";
    };

// ✅ ФУНКЦИЯ ОТКРЫТИЯ ИНФОРМАЦИИ О СИСТЕМЕ ОТСЛЕЖИВАНИЯ МУСОРА
window.openBinSystemInfo = (binType) => {
    const tkoInfo = `
        <div class="bin-system-guide" style="font-family: 'Montserrat', sans-serif;">
            <div style="text-align:center; margin-bottom:40px;">
                <h2 style="color: #d9534f; font-size: 42px; margin: 0 0 15px 0; font-weight: 900;">🔴 КГМ - Крупногабаритный мусор</h2>
                <p style="color: #666; font-size: 18px;">Для диванов, шкафов, техники и других крупных предметов</p>
                <div style="width: 120px; height: 5px; background: linear-gradient(90deg, #d9534f, #c9302c); margin: 25px auto 0; border-radius: 3px;"></div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr; gap: 25px; margin-bottom: 35px;">
                <div style="background: linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%); border-radius: 25px; padding: 25px; border-left: 6px solid #d9534f; box-shadow: 0 5px 20px rgba(217,83,79,0.1);">
                    <h3 style="color: #d9534f; font-size: 22px; margin: 0 0 12px 0; font-weight: 800;">📐 Что можно выбрасывать?</h3>
                    <ul style="margin: 0; padding-left: 25px; font-size: 16px; line-height: 1.8; color: #333;">
                        <li>Старая мебель (диваны, кресла, шкафы)</li>
                        <li>Бытовая техника (холодильники, стиральные машины)</li>
                        <li>Двери, окна, сантехника</li>
                        <li>Строительные отходы (до 50 кг)</li>
                    </ul>
                </div>
                
                <div style="background: linear-gradient(135deg, #fff8e6 0%, #fff0cc 100%); border-radius: 25px; padding: 25px; border-left: 6px solid #f39c12; box-shadow: 0 5px 20px rgba(243,156,18,0.1);">
                    <h3 style="color: #f39c12; font-size: 22px; margin: 0 0 12px 0; font-weight: 800;">⚠️ Важные правила</h3>
                    <ul style="margin: 0; padding-left: 25px; font-size: 16px; line-height: 1.8; color: #333;">
                        <li>Не заталкивайте КГМ в обычные баки!</li>
                        <li>Разбирайте крупную мебель при возможности</li>
                        <li>Стекло упаковывайте в плотную тару</li>
                        <li>Опасные отходы (лампы, батареи) — в спецбоксы</li>
                    </ul>
                </div>
            </div>
            
            <div style="background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); border-radius: 25px; padding: 25px; text-align: center; border: 3px dashed #008000;">
                <h3 style="color: #008000; font-size: 24px; margin: 0 0 15px 0; font-weight: 900;">📊 Как работает мониторинг?</h3>
                <p style="font-size: 16px; color: #333; line-height: 1.7; margin: 0;">
                    Датчик объёма измеряет заполненность контейнера каждые 15 минут. 
                    При достижении 80% система автоматически создаёт заявку на вывоз. 
                    Мусоровоз прибывает в течение 2-4 часов.
                </p>
            </div>
            
            <div style="margin-top: 25px; background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); border-radius: 25px; padding: 25px; border-left: 6px solid #ff9800;">
                <h4 style="color: #f57c00; font-size: 18px; margin: 0 0 15px 0; font-weight: 800;">👷 Кто устанавливает?</h4>
                <p style="font-size: 15px; color: #555; line-height: 1.7; margin: 0;">
                    Установку датчиков выполняет сертифицированная компания-партнёр ООО «УК ВСЕ СВОИ». 
                    Монтаж проводится квалифицированными специалистами с допуском к работе с электрооборудованием. 
                    Все работы занимают 15-20 минут на один бак и не требуют остановки эксплуатации.
                </p>
            </div>
            
            <div style="margin-top: 20px; background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 25px; padding: 25px; border-left: 6px solid #2196f3;">
                <h4 style="color: #1976d2; font-size: 18px; margin: 0 0 15px 0; font-weight: 800;">🛡️ Гарантия и обслуживание</h4>
                <p style="font-size: 15px; color: #555; line-height: 1.7; margin: 0;">
                    На все датчики предоставляется гарантия 3 года. В гарантийный период входит бесплатная замена 
                    оборудования при выходе из строя. Послегарантийное обслуживание осуществляется по договору. 
                    Техническая поддержка работает 24/7. Плановая поверка датчиков — раз в 12 месяцев.
                </p>
            </div>
        </div>
    `;
    
    const commonInfo = `
        <div class="bin-system-guide" style="font-family: 'Montserrat', sans-serif;">
            <div style="text-align:center; margin-bottom:40px;">
                <h2 style="color: #008000; font-size: 42px; margin: 0 0 15px 0; font-weight: 900;">🟢 Общие отходы</h2>
                <p style="color: #666; font-size: 18px;">Для обычного бытового мусора и упаковки</p>
                <div style="width: 120px; height: 5px; background: linear-gradient(90deg, #008000, #00aa44); margin: 25px auto 0; border-radius: 3px;"></div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr; gap: 25px; margin-bottom: 35px;">
                <div style="background: linear-gradient(135deg, #f0fdf0 0%, #e0f7e0 100%); border-radius: 25px; padding: 25px; border-left: 6px solid #008000; box-shadow: 0 5px 20px rgba(0,128,0,0.1);">
                    <h3 style="color: #008000; font-size: 22px; margin: 0 0 12px 0; font-weight: 800;">📦 Что можно выбрасывать?</h3>
                    <ul style="margin: 0; padding-left: 25px; font-size: 16px; line-height: 1.8; color: #333;">
                        <li>Пищевые отходы (в пакетах)</li>
                        <li>Бумага, картон, газеты</li>
                        <li>Пластиковая упаковка, бутылки</li>
                        <li>Текстиль, обувь</li>
                    </ul>
                </div>
                
                <div style="background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%); border-radius: 25px; padding: 25px; border-left: 6px solid #d9534f; box-shadow: 0 5px 20px rgba(217,83,79,0.1);">
                    <h3 style="color: #d9534f; font-size: 22px; margin: 0 0 12px 0; font-weight: 800;">🚫 Категорически нельзя!</h3>
                    <ul style="margin: 0; padding-left: 25px; font-size: 16px; line-height: 1.8; color: #333;">
                        <li>Ртутные лампы и термометры</li>
                        <li>Автомобильные шины</li>
                        <li>Строительный мусор (более 50 кг)</li>
                        <li>Жидкие отходы и химикаты</li>
                    </ul>
                </div>
            </div>
            
            <div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 25px; padding: 25px; text-align: center; border: 3px dashed #2196f3;">
                <h3 style="color: #1976d2; font-size: 24px; margin: 0 0 15px 0; font-weight: 900;">🎯 Система Falcon Smart</h3>
                <p style="font-size: 16px; color: #333; line-height: 1.7; margin: 0;">
                    Лазерный датчик под крышкой бака измеряет уровень мусора каждые 15 минут. 
                    Данные передаются в диспетчерскую. При заполнении >80% система сама 
                    добавляет точку в маршрут ближайшего мусоровоза. Точность измерения — 98%.
                </p>
            </div>
            
            <div style="margin-top: 25px; background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); border-radius: 25px; padding: 25px; border-left: 6px solid #ff9800;">
                <h4 style="color: #f57c00; font-size: 18px; margin: 0 0 15px 0; font-weight: 800;">👷 Кто устанавливает?</h4>
                <p style="font-size: 15px; color: #555; line-height: 1.7; margin: 0;">
                    Установку лазерных датчиков Falcon Smart выполняют сертифицированные инженеры компании-производителя. 
                    Специалисты проходят специальное обучение и имеют все необходимые допуски. 
                    Монтаж занимает 20-30 минут, оборудование сразу проходит калибровку и тестирование.
                </p>
            </div>
            
            <div style="margin-top: 20px; background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); border-radius: 25px; padding: 25px; border-left: 6px solid #008000;">
                <h4 style="color: #008000; font-size: 18px; margin: 0 0 15px 0; font-weight: 800;">🛡️ Гарантия и сервис</h4>
                <p style="font-size: 15px; color: #555; line-height: 1.7; margin: 0;">
                    Гарантия на датчики Falcon Smart составляет 5 лет. В этот период включены: бесплатная замена 
                    при неисправности, регулярная диагностика (раз в квартал), обновление ПО. 
                    Круглосуточная техподдержка реагирует на сбои в течение 1 часа. 
                    Срок службы оборудования — до 10 лет при правильной эксплуатации.
                </p>
            </div>
            
            <div style="margin-top: 20px; background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%); border-radius: 25px; padding: 25px; border-left: 6px solid #9c27b0;">
                <h4 style="color: #7b1fa2; font-size: 18px; margin: 0 0 15px 0; font-weight: 800;">💡 Совет по эксплуатации</h4>
                <p style="font-size: 15px; color: #555; line-height: 1.7; margin: 0;">
                    Сминайте пластиковые бутылки и картон перед выбросом! В бак 1.1 м³ 
                    помещается 40 кг целых или 200 кг смятых отходов. Это экономит место 
                    и снижает частоту вывоза мусора, что выгодно всем жильцам.
                </p>
            </div>
        </div>
    `;
    
    const content = binType === 'tko' ? tkoInfo : commonInfo;
    
    window.openSub(
        binType === 'tko' ? '🔴 Система отслеживания КГМ' : '🟢 Система отслеживания отходов',
        content
    );
};

window.openEcoGuide = () => {
    const cards = [
        { icon: "💳", title: "Экономия на ЖКУ", color: "#008000", desc: "Сминайте ПЭТ-бутылки и картон перед выбросом! В контейнер 1.1 м³ помещается 40 кг целых или 200 кг смятых отходов. Меньше воздуха = реже выезд техники = стабильный тариф." },
        { icon: "🚫", title: "Категорический стоп-лист", color: "#d9534f", desc: "Не бросайте в баки: шины, бетон, стёкла, ртутные лампы. Они ломают пресс мусоровоза (ремонт от 200 тыс. ₽) и блокируют сортировку на заводе." },
        { icon: "📡", title: "Falcon Smart", color: "#3498db", desc: "Под крышкой каждого бака стоит лазерный датчик. Он измеряет уровень мусора каждые 15 мин. При заполнении >80% система сама добавляет точку в маршрут ближайшего мусоровоза." },
        { icon: "🔋", title: "Опасные батарейки", color: "#f39c12", desc: "Одна пальчиковая батарейка загрязняет 20 м² почвы тяжёлыми металлами. Используйте жёлтые спец-боксы во дворах. При обнаружении в общем баке мы проводим замену грунта." },
        { icon: "♻️", title: "Вторая жизнь пластика", color: "#2ecc71", desc: "Пластик из синих сеток отправляется на переработку. Из него делают полимерпесчаную смесь для новых антивандальных лавочек и урн в ваших дворах." },
        { icon: "🚛", title: "Парковка у площадок", color: "#1abc9c", desc: "Мусоровозу нужно минимум 3 метра свободного пространства. ИИ-камеры фиксируют нарушителей. Заблокированный проезд = перенос вывоза на следующие сутки." },
        { icon: "🏗️", title: "Крупногабаритный мусор", color: "#9b59b6", desc: "Диваны, шкафы и техника — это КГМ. Не заталкивайте их в баки! Оставляйте в отсеках «Лодка» (8 м³). Если переполнено — нажмите «Жалоба», и мы пришлём ломовоз." },
        { icon: "🌡️", title: "Санитарная обработка", color: "#e74c3c", desc: "Дважды в год каждый бак проходит мойку под давлением раствором «Хлорамин-Б». Это уничтожает 99% бактерий и полностью устраняет запахи гниения." },
        { icon: "💻", title: "Электронный лом", color: "#34495e", desc: "Телевизоры и мониторы содержат свинец. Выбрасывать их в контейнер — экологическое преступление. Раз в квартал проходит акция «Эко-Сбор» — следите за анонсами в ГИС!" },
        { icon: "🐱", title: "Защита животных", color: "#e67e22", desc: "Пожалуйста, плотно закрывайте крышки! Бездомные кошки и птицы забираются внутрь за едой и часто гибнут под прессом. Закрытая крышка = спасённая жизнь." },
        { icon: "📞", title: "Прямая связь с УК", color: "#008000", desc: "ГИС — это мост между вами и инженерами. Заметили проблему? Один клик на кнопку «Жалоба» экономит неделю бюрократической переписки и телефонных звонков." },
        { icon: "🌟", title: "Будущее ГИС 2026", color: "#1abc9c", desc: "В этом году мы внедряем датчики анализа воздуха и нейросеть, которая будет предсказывать поломки детского оборудования по вибрации до того, как они произойдут." }
    ];

    const html = `
        <div class="eco-guide-container" style="font-family: 'Montserrat', sans-serif; padding: 20px;">
            <div class="eco-guide-header" style="text-align: center; margin-bottom: 40px; position: relative;">
                <h2 style="color: var(--primary); font-size: 42px; margin: 0 0 10px 0; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; background: linear-gradient(135deg, #008000 0%, #00ff88 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                    🌿 ЭКО-ГИД ЖИЛЬЦА
                </h2>
                <p style="color: #666; font-size: 16px; margin: 0; font-weight: 600;">Ваш персональный помощник по экологии двора</p>
                <div style="width: 100px; height: 4px; background: linear-gradient(90deg, #008000, #00ff88); margin: 20px auto 0; border-radius: 2px;"></div>
            </div>
            
            <div class="eco-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 25px; max-width: 1400px; margin: 0 auto;">
                ${cards.map((c, index) => `
                    <div class="eco-card-item" style="
                        background: linear-gradient(135deg, #ffffff 0%, #f8faf8 100%);
                        border-radius: 28px;
                        padding: 28px;
                        border-left: 6px solid ${c.color};
                        box-shadow: 0 8px 25px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8);
                        display: flex;
                        flex-direction: column;
                        gap: 15px;
                        transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                        position: relative;
                        overflow: hidden;
                        animation: ecoCardFadeIn 0.5s ease-out ${index * 0.05}s both;
                    "
                    onmouseover="this.style.transform='translateY(-8px) scale(1.02)'; this.style.boxShadow='0 15px 40px rgba(0,128,0,0.15), inset 0 1px 0 rgba(255,255,255,0.8)'"
                    onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)'">
                        <div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: radial-gradient(circle, ${c.color}22 0%, transparent 70%); border-radius: 50%;"></div>
                        <h3 style="margin: 0; font-size: 22px; color: #111; font-weight: 800; display: flex; align-items: center; gap: 10px; position: relative; z-index: 1;">
                            <span style="font-size: 32px; filter: drop-shadow(0 3px 8px ${c.color}44);">${c.icon}</span>
                            ${c.title}
                        </h3>
                        <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #444; position: relative; z-index: 1;">${c.desc}</p>
                    </div>
                `).join('')}
            </div>
            
            <div class="eco-footer" style="text-align: center; margin-top: 50px; padding: 35px; background: linear-gradient(135deg, #f0fdf0 0%, #e0f7e0 50%, #f0fdf0 100%); border-radius: 30px; border: 3px dashed var(--primary); position: relative; overflow: hidden;">
                <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(0,128,0,0.05) 0%, transparent 70%); animation: ecoGlow 4s ease-in-out infinite;"></div>
                <p style="margin: 0; font-size: 20px; color: var(--primary); font-weight: 800; position: relative; z-index: 1; letter-spacing: 1px;">
                    💚 Спасибо, что делаете наш двор чище вместе с УК «ВСЕ СВОИ»!
                </p>
                <p style="margin: 10px 0 0 0; font-size: 14px; color: #888; position: relative; z-index: 1;">
                    Вместе мы создаём экологичное будущее
                </p>
            </div>
        </div>
        
        <style>
            @keyframes ecoCardFadeIn {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes ecoGlow {
                0%, 100% { transform: translate(0, 0) scale(1); }
                50% { transform: translate(-10px, -10px) scale(1.05); }
            }
            .eco-guide-container::-webkit-scrollbar { width: 8px; }
            .eco-guide-container::-webkit-scrollbar-track { background: #f0f0f0; border-radius: 4px; }
            .eco-guide-container::-webkit-scrollbar-thumb { background: linear-gradient(135deg, #008000, #00aa44); border-radius: 4px; }
        </style>
    `;

    window.openModal('', html);
};

    window.runAction = (act) => {
        if(act === 'sat') map.setType('yandex#hybrid');
        else if(act === 'map') map.setType('yandex#map');
        else if(act === 'reboot') location.reload();
        else if(act === 'theme') document.body.classList.toggle('interface-dark');
        else if(act === 'dev') {
            window.openSub('🔄 ОБНОВЛЕНИЕ', '<div style="text-align:center;"><div class="loader-spin" style="width:100px; height:100px; border:10px solid #f3f3f3; border-top:10px solid #008000; border-radius:50%; animation:spin 1s linear infinite; margin:auto;"></div><p>Загрузка v17.5...</p></div>');
            setTimeout(() => window.openSub('✅ ГОТОВО', 'Система актуальна.'), 2000);
        }
    };

    window.refreshL = () => {
        const id = (i) => document.getElementById(i);
        const c = { 
            h: id('l-h').checked, 
            p: id('l-p').checked, 
            t: id('l-t').checked, 
            pl: id('l-pl').checked, 
            pk: id('l-pk').checked, 
            tr: id('l-tr').checked 
        };
        layers.hM.forEach(m => c.h ? map.geoObjects.add(m) : map.geoObjects.remove(m));
        layers.hP.forEach(p => c.p ? map.geoObjects.add(p) : map.geoObjects.remove(p));
        layers.tB.forEach(b => c.t ? map.geoObjects.add(b) : map.geoObjects.remove(b));
        layers.pl.forEach(l => c.pl ? map.geoObjects.add(l) : map.geoObjects.remove(l));
        layers.pk.forEach(k => c.pk ? map.geoObjects.add(k) : map.geoObjects.remove(k));
        
        if(truckMarker && routeLine) {
            c.tr ? (map.geoObjects.add(truckMarker), map.geoObjects.add(routeLine)) : 
                   (map.geoObjects.remove(truckMarker), map.geoObjects.remove(routeLine));
        }
    };

    function id(i) { return document.getElementById(i); }
    
const gui = document.createElement('div');
gui.id = "eco-panel-top-root";
gui.className = "premium-card";
gui.innerHTML = `
    <div class="eco-header">🌿 ЭКОСИСТЕМА ДВОРА</div>
    <div class="eco-content">
        <label>Дома 🏠 <span class="switch"><input type="checkbox" id="l-h" checked onchange="refreshL()"><span class="slider"></span></span></label>
        <label>Границы 📐 <span class="switch"><input type="checkbox" id="l-p" onchange="refreshL()"><span class="slider"></span></span></label>
        <label>Мусорные баки 🗑️ <span class="switch"><input type="checkbox" id="l-t" onchange="refreshL()"><span class="slider"></span></span></label>
        <label>Дет. площадки 🎡 <span class="switch"><input type="checkbox" id="l-pl" onchange="refreshL()"><span class="slider"></span></span></label>
        <label>Стоянки 🅿️ <span class="switch"><input type="checkbox" id="l-pk" onchange="refreshL()"><span class="slider"></span></span></label>
        <label>Орг. техника 🚛 <span class="switch"><input type="checkbox" id="l-tr" onchange="refreshL()"><span class="slider"></span></span></label>
    </div>`;
document.body.appendChild(gui);

// ✅ ЛОГИКА КЛИКА (МОБИЛКА + УДОБСТВО ПК)
const ecoHeader = gui.querySelector('.eco-header');
ecoHeader.addEventListener('click', (e) => {
    e.stopPropagation();
    gui.classList.toggle('open');
});
// Авто-закрытие при клике в любое другое место (актуально для телефона)
document.addEventListener('click', (e) => {
    if (!gui.contains(e.target) && !e.target.closest('.settings-trigger') && !e.target.closest('.secret-trigger')) {
        gui.classList.remove('open');
    }
});

    const sBtn = document.createElement('button'); 
    sBtn.className = "settings-trigger"; 
    sBtn.innerHTML = `⚙️`; 
    document.body.appendChild(sBtn);
    
    const secBtn = document.createElement('button'); 
    secBtn.innerText = "ДОП"; 
    secBtn.className = "secret-trigger"; 
    document.body.appendChild(secBtn);

    const tBox = document.createElement('div'); 
    tBox.id = "settings-panel-root"; 
    tBox.className = "premium-card";
    Object.assign(tBox.style, { 
        position: "absolute", 
        bottom: "160px", 
        left: "40px", 
        width: "450px", 
        padding: "40px", 
        display: "none", 
        zIndex: "1000", 
        borderTop: "20px solid #008000", 
        background: "rgba(255,255,255,0.98)" 
    });
    tBox.innerHTML = `
        <button class="ui-btn" onclick="openEcoGuide()">📖 ЭКО-ГИД</button> 
        <button class="ui-btn" onclick="runAction('map')">🗺️ КАРТА</button> 
        <button class="ui-btn" onclick="runAction('sat')">🛰️ СПУТНИК</button> 
        <button class="ui-btn" onclick="runAction('theme')">🌙 ТЕМА</button> 
        <label style="display:flex;justify-content:space-between;align-items:center;font-size:16px;margin-top:25px;color:#666">Доп. настройки <span class="switch"><input type="checkbox" onchange="document.querySelector('.secret-trigger').style.display = this.checked ? 'flex' : 'none'"><span class="slider"></span></span></label>`;
    document.body.appendChild(tBox); 

    sBtn.onclick = () => { 
        const open = tBox.style.display === "block"; 
        tBox.style.display = open ? "none" : "block"; 
        sBtn.classList.toggle('active', !open); 
    };
    
    secBtn.onclick = () => {
        secBtn.classList.toggle('active-mode');
        document.getElementById('m-content').innerHTML = `
        <h1 style="color:#00ff88; text-align:center; font-size:65px;">ДОПОЛНИТЕЛЬНЫЕ НАСТРОЙКИ</h1>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:25px; margin-top:50px;">
                <button class="ui-btn" onclick="window.openSub('📞 УК ВСЕ СВОИ', 'Диспетчерская (24/7): <br><b>+7 (921) 482-85-50</b>')">📞 НОМЕР УК</button>
                <button class="ui-btn" onclick="window.open('https://vk.com/greyv1ld')">👨‍💻 РАЗРАБОТЧИК</button>
                <button class="ui-btn" onclick="runAction('dev')">🔄 ОБНОВЛЕНИЯ</button>
                <button class="ui-btn" onclick="window.showQR()">📱 QR КОД</button>
                <button class="ui-btn" onclick="window.openSub('🧹 ОЧИСТКА КЭША', 'Системный кеш очищен, Спасибо что пользуетесь сайтом.')">🧹 CLEAN КЭШ</button>
                <button class="ui-btn" onclick="window.openSub('🔐 Проверка безопасности', 'Всё в подрядке, система под надёжным контролем.')">🔐 SECURITY</button>
                <button class="ui-btn" onclick="window.openSub('📊 АНАЛИТИКА', '11 домов передают данные.')">📊 СТАТУС</button>
                <button class="ui-btn" onclick="window.openSub('🔥 ТЕПЛО', 'Карта наложена.')">🔥 HEATMAP</button>
                <button class="ui-btn" onclick="window.openSub('⚡ FORCE SCAN', 'Все датчики: 100% OK.')">⚡ FORCE SCAN</button>
                <button class="ui-btn" onclick="runAction('reboot')">♻️ REBOOT SITE</button>
                <button class="ui-btn" style="background:#d9534f; color:#fff; grid-column: span 2;" onclick="window.closeEverything()">❌ ВЫХОД</button>
            </div>`;
        modal.style.display = "flex";
    };
    
    refreshL();

// ✅ ФОТО ВМЕСТО QR
window.showQR = () => {
    window.openModal('📸 QR КОД (ФОТО)', `
        <div style="text-align:center; padding: 20px;">
            <p style="font-size:18px; color:#555; margin-bottom:25px;">Фото объекта</p>
            <img src="/qrcod_e68S.jpg" alt="Фото" 
                 style="width:100%; max-width:350px; height:auto; border-radius:24px; box-shadow:0 12px 35px rgba(0,0,0,0.15); border:5px solid #fff; cursor:zoom-in; transition: transform 0.3s;" 
                 onclick="this.style.transform = this.style.transform === 'scale(1.6)' ? 'scale(1)' : 'scale(1.6)';">
            <p style="font-size:13px; color:#888; margin-top:15px;">Нажми на фото, чтобы увеличить</p>
        </div>`);
};

refreshL();
}
// ✅ ЛОГОТИП КЛИКАБЕЛЬНЫЙ - ИНФОРМАЦИЯ ОБ УК
const logoTrigger = document.getElementById('logo-trigger');
if (logoTrigger) {
    logoTrigger.addEventListener('click', () => {
        window.openModal('ℹ️ ООО «УК ВСЕ СВОИ»', `
            <div class="uk-info-container">
                <div class="uk-info-header">
                    <h2>🏢 ООО «УК ВСЕ СВОИ»</h2>
                    <p class="subtitle">Ваш надёжный партнёр в управлении недвижимостью</p>
                </div>
                
                <div class="uk-info-grid">
                    <div class="uk-info-card">
                        <h3>📅 Год основания</h3>
                        <p><b>2015 год</b> — более 9 лет успешной работы на рынке управления недвижимостью</p>
                    </div>
                    <div class="uk-info-card">
                        <h3>🏘️ Управляем</h3>
                        <p><b>11 домов</b> общей площадью более 45 000 м², обслуживаем свыше 800 квартир</p>
                    </div>
                    <div class="uk-info-card">
                        <h3>👥 Команда</h3>
                        <p><b>25 специалистов</b> — инженеры, сантехники, электрики, дворники, диспетчеры</p>
                    </div>
                    <div class="uk-info-card">
                        <h3>📞 Диспетчерская</h3>
                        <p><b>+7 (921) 482-85-50</b> — работаем круглосуточно, без выходных и праздников</p>
                    </div>
                </div>
                
                <div class="uk-values-section">
                    <h3>💚 НАШИ ЦЕННОСТИ</h3>
                    <div class="uk-values-list">
                        <div class="uk-value-item">
                            <span class="icon">🤝</span>
                            <span class="text">Доверие жильцов — наш главный актив</span>
                        </div>
                        <div class="uk-value-item">
                            <span class="icon">⚡</span>
                            <span class="text">Оперативное решение любых вопросов</span>
                        </div>
                        <div class="uk-value-item">
                            <span class="icon">🌿</span>
                            <span class="text">Экологичность и чистота дворов</span>
                        </div>
                        <div class="uk-value-item">
                            <span class="icon">💎</span>
                            <span class="text">Прозрачность всех начислений</span>
                        </div>
                        <div class="uk-value-item">
                            <span class="icon">🔧</span>
                            <span class="text">Современные технологии обслуживания</span>
                        </div>
                        <div class="uk-value-item">
                            <span class="icon">❤️</span>
                            <span class="text">Забота о каждом жителе дома</span>
                        </div>
                    </div>
                </div>
                
                <div style="text-align:center; margin-top:35px; padding:25px; background:linear-gradient(135deg, #f0fdf0 0%, #e0f7e0 100%); border-radius:25px; border:2px dashed #008000;">
                    <p style="font-size:18px; color:#008000; font-weight:800; margin:0;">
                        🙏 СПАСИБО, ЧТО ВЫБИРАЕТЕ НАС!<br>
                        <span style="font-size:14px; color:#666; font-weight:600;">Мы ценим ваше доверие и работаем для вашего комфорта каждый день</span>
                    </p>
                </div>
            </div>
        `);
    });
}
