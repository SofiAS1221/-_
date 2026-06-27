// oxlint-disable no-unused-vars
import { useState } from 'react';
import './App.css';

// Привязка скринов 1-5, загруженных пользователем
const CAROUSEL_IMAGES = [
  { id: 1, title: 'Дашборд Арендodателя: Интерактивный календарь бронирований и оперативная сводка доходов портфеля', url: '2026-06-27_00-23-43.png' },
  { id: 2, title: 'Управление фондом объектов: Добавление коммерческих площадей, офисов и контроль их статусов', url: '2026-06-27_00-24-44.png' },
  { id: 3, title: 'Реестр контрагентов: Список активных арендatorов, привязка к помещениям и контактные данные', url: '2026-06-27_00-25-14.png' },
  { id: 4, title: 'Информационная лента: Публикация важных объявлений, новостей и уведомлений для жильцов БЦ', url: '2026-06-27_00-25-50.png' },
  { id: 5, title: 'Личный кабинет Арендatorа: Контроль расчетных периодов, выставленных счетов и оплата коммунальных услуг', url: '2026-06-27_00-26-22.png' }
];

const PROBLEMS = [
  { id: 1, title: 'Хаос в документах', text: 'Договоры, счета и акты разбросаны по разным папкам, Excel-файлам и перепискам в мессенджерах.' },
  { id: 2, title: 'Потеря платежей', text: 'Отсутствие четкого контроля дебиторской задолженности ведет к кассовым разрывам и убыткам.' },
  { id: 3, title: 'Ручной сбор показаний', text: 'Арендаторы забывают присылать показания счетчиков, приходится тратить часы на обзвон и сверку.' },
  { id: 4, title: 'Заявки теряются', text: 'Просьбы о ремонте поступают в WhatsApp или по телефону, забываются и портят отношения с клиентами.' },
  { id: 5, title: 'Нет аналитики', text: 'Вы не видите реальную рентабельность каждого объекта и принимаете решения вслепую.' },
  { id: 6, title: 'Сложно масштабировать', text: 'Каждый новый объект требует найма дополнительного персонала, съедая всю прибыль.' }
];

const TASKS = [
  { id: 1, title: 'Наводит порядок', text: 'Единый источник правды для всех ваших объектов. Реестры, договоры, история взаимодействий — всё структурировано и доступно в один клик.', icon: '📁', bgImage: '2026-06-27_00-23-43.jpg' },
  { id: 2, title: 'Ускоряет работу', text: 'Автоматизация рутины на 20-40%. Система сама напомнит об оплате, сформирует счёт на основе показаний и уведомит о новой заявке.', icon: '🚀', bgImage: '2026-06-27_00-24-44.jpg' },
  { id: 3, title: 'Повышает рентабельность', text: 'Управляйте портфелем до 50 объектов тем же составом команды. Масштабируйте бизнес, не раздувая штат сотрудников.', icon: '📈', bgImage: '2026-06-27_00-25-14.jpg' }
];

const START_STEPS = [
  { id: 1, stepNum: 'Шаг 1', title: 'Регистрация аккаунта', text: 'Создайте личный аккаунт за 2 минуты, указав ФИО и выбрав вашу фактическую роль в экосистеме (Арендодатель, Арендатор, Управляющий или Агент).' },
  { id: 2, stepNum: 'Шаг 2', title: 'Настройка фонда объектов', text: 'Внесите коммерческие площади, офисы или склады в реестр. Агенты и арендодатели могут мгновенно синхронизировать базу помещений.' },
  { id: 3, stepNum: 'Шаг 3', title: 'Приглашение пользователей', text: 'Привязывайте арендаторов к объектам, распределяйте заявки между управляющими компаниями и отслеживайте сделки в реальном времени.' },
  { id: 4, stepNum: 'Шаг 4', title: 'Контроль и автоматизация', text: 'Выставляйте счета, принимайте онлайн-платежи, собирайте показания приборов учета и просматривайте детальную финансовую аналитику.' }
];

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [activeTab, setActiveTab] = useState('overview');
  const [isDarkMode, setIsDarkMode] = useState(true); 
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showCookie, setShowCookie] = useState(true);

  // Стейты регистрации
  const [regFio, setRegFio] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState('Арендодатель');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regAgree, setRegAgree] = useState(false);

  // Стейты демо-формы
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');

  // Модалка оплаты коммуналки для арендатора
  const [showUtilityModal, setShowUtilityModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [utilityAccount, setUtilityAccount] = useState('');
  const [utilityFio, setUtilityFio] = useState('');
  const [utilityMonth, setUtilityMonth] = useState('');

  // --- ДАННЫЕ И СИНХРОНИЗАЦИЯ СОСТОЯНИЯ ---
  const [bookings, setBookings] = useState([
    { id: 'b1', title: 'Офис 302 — ООО Вектор', day: 'Пн', time: '10:00 - 14:00', cost: 4500 },
    { id: 'b2', title: 'Конференц-зал — Собеседования', day: 'Ср', time: '11:00 - 17:00', cost: 12000 },
    { id: 'b3', title: 'Шоурум 1 этаж — Показ объекта', day: 'Чт', time: '15:30 - 16:30', cost: 2500 },
    { id: 'b4', title: 'Коворкинг Место А — ИП Иванов', day: 'Пт', time: '09:00 - 19:00', cost: 8000 }
  ]);

  const [newBookingTitle, setNewBookingTitle] = useState('');
  const [newBookingDay, setNewBookingDay] = useState('Пн');
  const [newBookingTime, setNewBookingTime] = useState('12:00 - 13:00');
  const [newBookingCost, setNewBookingCost] = useState('5000');

  const [notes, setNotes] = useState([
    { id: 1, text: 'Проверить показания счётчиков in Офисе 302' },
    { id: 2, text: 'Подписать доп. соглашение с ИП Иванов в пятницу' }
  ]);
  const [newNoteText, setNewNoteText] = useState('');

  const [objectsList, setObjectsList] = useState([
    { id: 1, name: 'Бизнес-Центр "Авангард"', address: 'ул. Ленина, д. 24', type: 'Офисы' },
    { id: 2, name: 'Торговый Комплекс "Орбита"', address: 'пр. Мира, д. 105', type: 'Торговая площадь' }
  ]);
  const [objName, setObjName] = useState('');
  const [objAddress, setObjAddress] = useState('');
  const [objType, setObjType] = useState('Офисы');

  const [tenants, setTenants] = useState([
    { id: 1, name: 'Алексей Петров (ООО Вектор)', phone: '+7 (911) 234-56-78', room: 'Офис 302', agentId: 'a1' },
    { id: 2, name: 'Мария Сидорова (ИП Иванов)', phone: '+7 (921) 987-65-43', room: 'Коворкинг Место А', agentId: null }
  ]);
  const [tenantName, setTenantName] = useState('');
  const [tenantPhone, setTenantPhone] = useState('');
  const [tenantRoom, setTenantRoom] = useState('');

  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'Плановое отключение горячей воды', body: 'В связи с техническими работами 28 июня с 10:00 до 16:00 будет отключена горячая вода.', date: 'Сегодня' },
    { id: 2, title: 'Обновление правил парковки', body: 'С 1 июля въезд на внутреннюю парковку БЦ осуществляется только по новым электронным пропускам.', date: 'Вчера' }
  ]);
  const [annTitle, setAnnTitle] = useState('');
  const [annBody, setAnnBody] = useState('');

  const [tenantBills, setTenantBills] = useState([
    { id: 1, period: 'Июнь 2026', rent: 45000, utilities: 4300, status: 'Не оплачен' },
    { id: 2, period: 'Май 2026', rent: 45000, utilities: 3800, status: 'Оплачен' }
  ]);
  const [tenantMetersWater, setTenantMetersWater] = useState('142');
  const [tenantMetersElectro, setTenantMetersElectro] = useState('2854');
  const [tenantTickets, setTenantTickets] = useState([
    { id: 1, subject: 'Не работает кондиционер', category: 'Техслужба', status: 'В работе' },
    { id: 2, subject: 'Заявка на пропуск курьера', category: 'Безопасность', status: 'Выполнено' }
  ]);
  const [newTicketText, setNewTicketText] = useState('');
  const [newTicketCat, setNewTicketCat] = useState('Техслужба');

  const [managerTasks, setManagerTasks] = useState([
    { id: 1, sender: 'Офис 302', desc: 'Не работает кондиционер', priority: 'Высокий', status: 'В работе' },
    { id: 2, sender: 'Место А', desc: 'Заменить лампу над столом', priority: 'Низкий', status: 'Новая' }
  ]);
  const [incomingMeters, setIncomingMeters] = useState([
    { id: 1, room: 'Офис 302', water: '142 м³', electro: '2854 кВт', status: 'На проверке' },
    { id: 2, room: 'Коворкинг А', water: '48 м³', electro: '1105 кВт', status: 'Принято' }
  ]);

  const [agentLeads, setAgentLeads] = useState([
    { id: 'a1', client: 'Алексей Петров (ООО Вектор)', phone: '+7 (911) 234-56-78', status: 'Договор подписан', object: 'Офис 302', commission: 15000 },
    { id: 'a2', client: 'Константин В. (ООО Прогресс)', phone: '+7 (900) 111-22-33', status: 'Показ объекта', object: 'БЦ Авангард', commission: 0 }
  ]);
  const [newLeadClient, setNewLeadClient] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadObject, setNewLeadObject] = useState('Офис 302');
  const [newLeadCommission, setNewLeadCommission] = useState('15000');

  const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  const activeBookingsCount = bookings.length;
  const baseIncome = 450000;
  const variableIncome = bookings.reduce((sum, b) => sum + Number(b.cost || 0), 0);
  const agentCommissionsTotal = agentLeads.reduce((sum, l) => sum + Number(l.commission || 0), 0);
  const totalIncome = baseIncome + variableIncome;
  const expectedIncome = Math.round(totalIncome * 0.25);
  const occupancyRate = Math.min(85 + (activeBookingsCount * 1.5), 100).toFixed(1);

  const handleDragStart = (e, bookingId) => { e.dataTransfer.setData('text/plain', bookingId); };
  const handleDragOver = (e) => { e.preventDefault(); };
  const handleDrop = (e, targetDay) => {
    e.preventDefault();
    const bookingId = e.dataTransfer.getData('text/plain');
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, day: targetDay } : b));
  };

  const handleAddBooking = (e) => {
    e.preventDefault();
    if (!newBookingTitle.trim()) return;
    setBookings(prev => [...prev, {
      id: 'b_' + Date.now(),
      title: newBookingTitle,
      day: newBookingDay,
      time: newBookingTime,
      cost: Number(newBookingCost) || 3000
    }]);
    setNewBookingTitle('');
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    setNotes(prev => [...prev, { id: Date.now(), text: newNoteText }]);
    setNewNoteText('');
  };

  const handleRemoveNote = (noteId) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
  };

  const handleAddObject = (e) => {
    e.preventDefault();
    if (!objName.trim() || !objAddress.trim()) return;
    setObjectsList(prev => [...prev, { id: Date.now(), name: objName, address: objAddress, type: objType }]);
    setObjName('');
    setObjAddress('');
  };

  const handleAddTenant = (e) => {
    e.preventDefault();
    if (!tenantName.trim() || !tenantPhone.trim()) return;
    setTenants(prev => [...prev, { id: Date.now(), name: tenantName, phone: tenantPhone, room: tenantRoom || 'Не назначено', agentId: null }]);
    setTenantName('');
    setTenantPhone('');
    setTenantRoom('');
  };

  const handleAddAnnouncement = (e) => {
    e.preventDefault();
    if (!annTitle.trim() || !annBody.trim()) return;
    setAnnouncements(prev => [{ id: Date.now(), title: annTitle, body: annBody, date: 'Только что' }, ...prev]);
    setAnnTitle('');
    setAnnBody('');
  };

  const handleAddTicket = (e) => {
    e.preventDefault();
    if (!newTicketText.trim()) return;
    const newId = Date.now();
    setTenantTickets(prev => [{ id: newId, subject: newTicketText, category: newTicketCat, status: 'Новая' }, ...prev]);
    setManagerTasks(prev => [{ id: newId, sender: regFio || 'Ваше Помещение', desc: newTicketText, priority: 'Обычный', status: 'Новая' }, ...prev]);
    setNewTicketText('');
  };

  const handleAddAgentLead = (e) => {
    e.preventDefault();
    if (!newLeadClient.trim()) return;
    const leadId = 'a_' + Date.now();
    
    setAgentLeads(prev => [...prev, { 
      id: leadId, 
      client: newLeadClient, 
      phone: newLeadPhone, 
      status: 'Новый лид', 
      object: newLeadObject, 
      commission: Number(newLeadCommission) || 0 
    }]);

    setTenants(prev => [...prev, {
      id: Date.now(),
      name: newLeadClient,
      phone: newLeadPhone,
      room: newLeadObject,
      agentId: leadId
    }]);

    setNewLeadClient('');
    setNewLeadPhone('');
  };

  const handleOpenPaymentModal = (bill) => {
    setSelectedBill(bill);
    setUtilityMonth(bill.period);
    setUtilityFio(regFio || 'София Беленко');
    setShowUtilityModal(true);
  };

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    if (!utilityAccount.trim() || !utilityFio.trim() || !utilityMonth.trim()) return;
    setTenantBills(prev => prev.map(b => b.id === selectedBill.id ? { ...b, status: 'Оплачен' } : b));
    setShowUtilityModal(false);
    setUtilityAccount('');
    alert(`Счет за ${utilityMonth} успешно оплачен вместе с коммунальными услугами!`);
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const handleNavigateToRegister = () => { setCurrentPage('register'); window.scrollTo(0, 0); };
  const handleNavigateToLanding = () => { setCurrentPage('landing'); window.scrollTo(0, 0); };
  
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setCurrentPage('dashboard');
    if (regRole === 'Арендатор') setActiveTab('tenant-overview');
    else if (regRole === 'Управляющий') setActiveTab('manager-overview');
    else if (regRole === 'Агент') setActiveTab('agent-overview');
    else setActiveTab('overview');
    window.scrollTo(0, 0);
  };

  const nextSlide = () => { setCurrentSlide((prev) => (prev === CAROUSEL_IMAGES.length - 1 ? 0 : prev + 1)); };
  const prevSlide = () => { setCurrentSlide((prev) => (prev === 0 ? CAROUSEL_IMAGES.length - 1 : prev - 1)); };

  return (
    <div className={`app-wrapper ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      
      {showCookie && (
        <div className="cookie-notification-popup">
          <div className="cookie-content">
            <span className="cookie-cookie-icon">🍪</span>
            <div className="cookie-text-data">
              Для улучшения работы сайта мы используем файлы cookie. Продолжая использовать сайт, вы соглашаетесь с Политикой конфиденциальности.
            </div>
            <div className="cookie-buttons">
              <button type="button" className="cookie-btn approve" onClick={() => setShowCookie(false)}>Принять</button>
              <button type="button" className="cookie-btn decline" onClick={() => setShowCookie(false)}>Отклонить</button>
            </div>
          </div>
        </div>
      )}

      {currentPage !== 'dashboard' && (
        <header className="saas-header">
          <div className="header-inner">
            <div className="saas-logo-box" onClick={handleNavigateToLanding}>
              <div className="saas-logo">Realty24</div>
            </div>
            <nav className="saas-nav">
              {currentPage === 'landing' && (
                <>
                  <a href="#problems">Проблемы</a>
                  <a href="#features">Решения</a>
                  <a href="#pricing">Тарифы</a>
                  <a href="#demo">Демо-доступ</a>
                </>
              )}
              {currentPage === 'register' && (
                <button 
                  type="button" 
                  className="btn-saas-demo-blue" 
                  style={{ padding: '8px 20px', fontSize: '13px', borderRadius: '12px' }} 
                  onClick={handleNavigateToLanding}
                >
                  ← На главную
                </button>
              )}
              <button type="button" className="theme-toggle-btn-bubble" onClick={toggleTheme}>
                {isDarkMode ? '🌙' : '☀️'}
              </button>
              <button type="button" className="header-login-link-modern" onClick={handleNavigateToRegister}>Войти</button>
            </nav>
          </div>
        </header>
      )}

      {currentPage === 'landing' && (
        <>
          <section className="saas-hero">
            <div className="hero-glow-box">
              <h1 className="hero-bubble-headline">
                Управление коммерческой недвижимостью без Excel и забытых платежей
              </h1>
              <p className="hero-sub-description">
                Учёт договоров, счетов, показаний счётчиков и заявок на ремонт — в одном кабинете.
              </p>
              <div className="hero-action-buttons">
                <button type="button" className="btn-saas-primary-glow" onClick={handleNavigateToRegister}>
                  Попробовать бесплатно 14 дней
                </button>
                <button type="button" className="btn-saas-demo-blue" onClick={() => document.getElementById('demo').scrollIntoView({ behavior: 'smooth' })}>
                  Получить демо
                </button>
              </div>
            </div>
          </section>

          <section className="saas-carousel-section">
            <div className="carousel-wrapper">
              <div className="carousel-viewport">
                <button type="button" className="carousel-nav-btn prev" onClick={prevSlide}>&lsaquo;</button>
                <div className="slide-box">
                  <img src={CAROUSEL_IMAGES[currentSlide].url} alt="Интерфейс Системы" style={{ borderRadius: '16px', objectFit: 'cover', width: '100%', height: '100%' }} />
                </div>
                <button type="button" className="carousel-nav-btn next" onClick={nextSlide}>&rsaquo;</button>
              </div>
              <h3 className="carousel-slide-title">{CAROUSEL_IMAGES[currentSlide].title}</h3>
              <div className="carousel-dots">
                {CAROUSEL_IMAGES.map((_, idx) => (
                  <span key={idx} className={`dot ${idx === currentSlide ? 'active' : ''}`} onClick={() => setCurrentSlide(idx)} />
                ))}
              </div>
            </div>
          </section>

          <section id="problems" className="saas-problems-section">
            <h2 className="section-bubble-title-dark">Знакомые проблемы?</h2>
            <div className="problems-grid">
              {PROBLEMS.map((prob) => (
                <div key={prob.id} className="problem-card">
                  <div className="problem-num">0{prob.id}</div>
                  <h4 className="problem-title">{prob.title}</h4>
                  <p className="problem-text">{prob.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="features" className="saas-tasks-section">
            <h2 className="tasks-section-title">Realty24 решает три ключевые задачи</h2>
            <div className="tasks-grid-horizontal">
              {TASKS.map((task) => (
                <div 
                  key={task.id} 
                  className="task-panel-card-horizontal interactive-task-card"
                  style={{ '--task-bg-img': `url(${task.bgImage})` }}
                >
                  <div className="task-card-overlay-content">
                    <div className="task-header-row">
                      <h3 className="task-title-text">{task.title}</h3>
                      <span className="floating-bubble-icon">{task.icon}</span>
                    </div>
                    <p className="task-body-text">{task.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section style={{ padding: '80px 20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2 className="tasks-section-title" style={{ marginBottom: '50px', textAlign: 'center', fontSize: '28px', fontWeight: 'bold' }}>Как начать работу</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '31px', top: '20px', bottom: '20px', width: '2px', borderLeft: '2px dashed #0055ff' }}></div>

              {START_STEPS.map((step) => (
                <div key={step.id} style={{ display: 'flex', gap: '30px', marginBottom: '40px', position: 'relative', alignItems: 'flex-start' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#0055ff', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '16px', zIndex: '2', flexShrink: 0, boxShadow: '0 4px 12px rgba(0, 85, 255, 0.3)' }}>
                    {step.id}
                  </div>
                  
                  <div style={{ background: 'var(--bg-cards)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px 30px', flex: 1 }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#0055ff', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '6px' }}>
                      {step.stepNum}
                    </span>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: 'bold', color: 'var(--text-main)' }}>
                      {step.title}
                    </h4>
                    <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                      {step.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ======================= ОБНОВЛЕННЫЙ БЛОК: ТАРИФЫ (СКРИНШОТЫ 1 И 2) ======================= */}
          <section id="pricing" style={{ padding: '80px 20px', maxWidth: '1050px', margin: '0 auto' }}>
            <h2 className="tasks-section-title" style={{ marginBottom: '15px', textAlign: 'center', fontSize: '28px', fontWeight: 'bold' }}>Тарифы</h2>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '15px', marginBottom: '50px' }}>Выберите тарифный план, который идеально подходит для масштабов вашего бизнеса</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '35px', alignItems: 'stretch' }}>
              
              {/* ТАРИФ 1: СТАРТ (На основе Скриншота 1) */}
              <div style={{ background: 'var(--bg-cards)', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '40px', display: 'flex', flexDirection: 'column', gap: '25px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 'bold' }}>Старт</h3>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px' }}>Оптимально для частных собственников</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '36px', fontWeight: '800', color: '#0055ff', lineHeight: '1' }}>300 ₽</div>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>в месяц / фиксированно</span>
                  </div>
                </div>

                <div style={{ width: '100%', height: '1px', background: 'var(--border-color)' }}></div>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px' }}>
                  <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> До 5 объектов недвижимости в реестре</li>
                  <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> Базовый учет договоров аренды и контрагентов</li>
                  <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> Ручной ввод показаний счетчиков и ресурсов</li>
                  <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> Модуль интерактивного календаря и заметок</li>
                  <li style={{ display: 'flex', gap: '10px', alignItems: 'center', opacity: 0.4 }}><span style={{ color: 'var(--text-muted)' }}>✕</span> Сквозная синхронизация агентов и распределение лидов</li>
                </ul>

                <button 
                  type="button" 
                  style={{ width: '100%', padding: '16px', border: '1px solid #0055ff', borderRadius: '14px', background: 'transparent', color: '#0055ff', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', marginTop: 'auto', transition: 'all 0.2s' }} 
                  onClick={handleNavigateToRegister}
                >
                  Выбрать Старт
                </button>
              </div>

              {/* ТАРИФ 2: ПРОФЕССИОНАЛ (На основе Скриншота 2) */}
              <div style={{ background: '#090d16', border: '2px solid #0055ff', borderRadius: '24px', padding: '40px', display: 'flex', flexDirection: 'column', gap: '25px', position: 'relative', boxShadow: '0 12px 40px rgba(0, 85, 255, 0.2)' }}>
                <div style={{ position: 'absolute', top: '-14px', right: '30px', background: '#0055ff', color: '#ffffff', fontSize: '11px', fontWeight: '800', padding: '6px 16px', borderRadius: '20px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  ХИТ ПРОДАЖ — ЭКОНОМИЯ 25%
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 'bold', color: '#ffffff' }}>Профессионал</h3>
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>Для управляющих компаний и топ-агентов</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '36px', fontWeight: '800', color: '#ffffff', lineHeight: '1' }}>200 ₽</div>
                    <span style={{ fontSize: '13px', color: '#94a3b8' }}>в месяц / за один объект</span>
                  </div>
                </div>

                <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px', color: '#e2e8f0' }}>
                  <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> Неограниченное число объектов недвижимости в фонде</li>
                  <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> Автоматическая генерация и регулярная отправка счетов</li>
                  <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> <strong>Интерактивная связь: Арендатор + Агент + Владелец</strong></li>
                  <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> Динамическая финансовая аналитика и CSS-диаграммы</li>
                  <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> Персональный менеджер, поддержка 24/7 и Telegram-бот</li>
                </ul>

                <button 
                  type="button" 
                  style={{ width: '100%', padding: '16px', borderRadius: '14px', background: '#0055ff', color: '#ffffff', border: 'none', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', marginTop: 'auto', boxShadow: '0 4px 18px rgba(0, 85, 255, 0.4)' }} 
                  onClick={handleNavigateToRegister}
                >
                  Активировать Профессионал
                </button>
              </div>

            </div>
          </section>

          <section id="demo" className="saas-registration-section" style={{ paddingBottom: '40px' }}>
            <div className="registration-card-box">
              <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 20px 0', textAlign: 'center' }}>Войти в систему</p>
              <form onSubmit={(e) => { e.preventDefault(); setCurrentPage('dashboard'); }} className="saas-modern-form">
                <div className="saas-input-group">
                  <label>Имя</label>
                  <input type="text" placeholder="Иван" value={leadName} onChange={(e) => setLeadName(e.target.value)} required />
                </div>
                <div className="saas-input-group">
                  <label>Телефон</label>
                  <input type="tel" placeholder="+7 (999) 999-99-99" value={leadPhone} onChange={(e) => setLeadPhone(e.target.value)} required />
                </div>
                <button type="submit" className="btn-submit-demo-giant">Получить demo за 2 минуты</button>
              </form>
            </div>
          </section>

          <footer className="realty-integrated-footer" style={{ background: 'var(--bg-cards)', borderTop: '1px solid var(--border-color)', padding: '60px 40px 30px 40px', color: 'var(--text-main)', marginTop: '40px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px', marginBottom: '40px' }}>
              <div>
                <h4 style={{ color: '#0055ff', fontSize: '18px', margin: '0 0 20px 0', fontWeight: 'bold' }}>Справка</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                  <li><a href="#features" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Все инструкции</a></li>
                  <li><a href="#features" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Общий флоу работы</a></li>
                  <li><a href="#register" onClick={handleNavigateToRegister} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Начало для арендодателя</a></li>
                  <li><a href="#register" onClick={handleNavigateToRegister} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Начало для арендатора</a></li>
                  <li><a href="#pricing" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Счета и платежи</a></li>
                </ul>
              </div>
              <div>
                <h4 style={{ color: '#0055ff', fontSize: '18px', margin: '0 0 20px 0', fontWeight: 'bold' }}>Блог</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                  <li><a href="#features" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Все статьи</a></li>
                  <li><a href="#features" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Управление объектами</a></li>
                  <li><a href="#features" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Арендаторы и договоры</a></li>
                  <li><a href="#features" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Финансы и контроль</a></li>
                  <li><a href="#features" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Системы и автоматизация</a></li>
                </ul>
              </div>
              <div>
                <h4 style={{ color: '#0055ff', fontSize: '18px', margin: '0 0 20px 0', fontWeight: 'bold' }}>Документы</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                  <li><a href="#features" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Пользовательское соглашение</a></li>
                  <li><a href="#features" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Политика конфиденциальности</a></li>
                  <li><a href="#features" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Договор оферты</a></li>
                </ul>
              </div>
              <div>
                <h4 style={{ color: '#0055ff', fontSize: '18px', margin: '0 0 20px 0', fontWeight: 'bold' }}>Контакты</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                  <li><a href="https://t.me/Realty24_bot" target="_blank" rel="noreferrer" style={{ color: '#0055ff', textDecoration: 'none', fontWeight: 'bold' }}>🤖 @Realty24_bot</a></li>
                  <li><a href="mailto:zoteevAS15@yandex.ru" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>✉️ zoteevAS15@yandex.ru</a></li>
                </ul>
              </div>
            </div>
            <div style={{ maxWidth: '1200px', margin: '0 auto', borderTop: '1px solid var(--border-color)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)', flexWrap: 'wrap', gap: '15px' }}>
              <div>
                <strong>© 2026 ИП Беленко Софья Андреевна</strong> | ИНН 230110849313 | ОГРНИП 320237500065050
              </div>
              <div>Realty24 Pro — Интеллектуальный учёт недвижимости</div>
            </div>
          </footer>
        </>
      )}

      {currentPage === 'register' && (
        <section className="auth-fullscreen-container">
          <div className="auth-glass-card-box">
            <h1 className="auth-main-headline">Регистрация</h1>
            <form onSubmit={handleRegisterSubmit} className="saas-modern-form">
              <div className="saas-input-group">
                <label>ФИО *</label>
                <input type="text" value={regFio} onChange={(e) => setRegFio(e.target.value)} required placeholder="София Беленко" />
              </div>
              <div className="saas-input-group">
                <label>Email *</label>
                <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required placeholder="sofia@example.com" />
              </div>
              <div className="saas-input-group">
                <label>Телефон *</label>
                <input type="tel" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} required placeholder="+7 (999) 123-45-67" />
              </div>
              <div className="saas-input-group">
                <label>Роль в системе *</label>
                <select value={regRole} onChange={(e) => setRegRole(e.target.value)} className="saas-modern-select">
                  <option value="Арендодатель">Арендодатель (Собственник)</option>
                  <option value="Арендатор">Арендатор (Жилец / Компания)</option>
                  <option value="Управляющий">Управляющий (Техслужба / ЖЭК)</option>
                  <option value="Агент">Агент (Риелтор / Брокер)</option>
                </select>
              </div>
              <div className="saas-input-group">
                <label>Пароль *</label>
                <input type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required />
              </div>
              <div className="saas-input-group">
                <label>Подтвердите пароль *</label>
                <input type="password" value={regConfirmPassword} onChange={(e) => setRegConfirmPassword(e.target.value)} required />
              </div>
              <div className="saas-checkbox-group" style={{ marginBottom: '25px' }}>
                <label className="checkbox-container" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={regAgree} onChange={(e) => setRegAgree(e.target.checked)} required />
                  <span className="checkbox-label-text" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Я принимаю условия Пользовательского соглашения</span>
                </label>
              </div>
              <button type="submit" className="btn-submit-demo-giant-primary">Создать личный кабинет</button>
            </form>
          </div>
        </section>
      )}

      {currentPage === 'dashboard' && (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-cards)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#0055ff' }}>Realty24</span>
              <div style={{ width: '1px', height: '20px', background: 'var(--border-color)' }}></div>
              <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 'normal' }}>Панель управления</h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <button type="button" className="theme-toggle-btn-bubble" onClick={toggleTheme} style={{ margin: 0 }}>
                {isDarkMode ? '🌙' : '☀️'}
              </button>
              <div style={{ background: 'rgba(0,85,255,0.1)', border: '1px solid rgba(0,85,255,0.3)', color: '#0055ff', padding: '8px 18px', borderRadius: '20px', fontWeight: 'bold', fontSize: '13px' }}>
                👤 {regFio || 'София Беленко'} ({regRole})
              </div>
              <button type="button" onClick={handleNavigateToLanding} style={{ background: 'none', border: '1px solid rgba(255,68,68,0.4)', color: '#ff4444', padding: '8px 16px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>Выйти</button>
            </div>
          </div>

          <div style={{ display: 'flex', flex: 1 }}>
            <div style={{ width: '260px', background: 'var(--bg-cards)', borderRight: '1px solid var(--border-color)', padding: '30px 15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {regRole === 'Арендодатель' && (
                <>
                  {[
                    { id: 'overview', label: '📊 Обзор и Сводка' },
                    { id: 'objects', label: '🏢 Мои Объекты' },
                    { id: 'landlords', label: '👥 Арендаторы' },
                    { id: 'finances', label: '💰 Финансы портфеля' },
                    { id: 'boards', label: '📢 Доска объявлений' }
                  ].map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} style={{ width: '100%', textAlign: 'left', padding: '14px 20px', borderRadius: '12px', border: 'none', background: activeTab === tab.id ? '#0055ff' : 'transparent', color: activeTab === tab.id ? '#fff' : 'var(--text-main)', fontSize: '14px', fontWeight: activeTab === tab.id ? 'bold' : 'normal', cursor: 'pointer' }}>{tab.label}</button>
                  ))}
                </>
              )}
              {regRole === 'Арендатор' && (
                <>
                  {[
                    { id: 'tenant-overview', label: '🏠 Моя Аренда' },
                    { id: 'tenant-meters', label: '🚰 Ввод счетчиков' },
                    { id: 'tenant-tickets', label: '🛠️ Заявки в сервис' },
                    { id: 'boards', label: '📢 Объявления БЦ' }
                  ].map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} style={{ width: '100%', textAlign: 'left', padding: '14px 20px', borderRadius: '12px', border: 'none', background: activeTab === tab.id ? '#0055ff' : 'transparent', color: activeTab === tab.id ? '#fff' : 'var(--text-main)', fontSize: '14px', fontWeight: activeTab === tab.id ? 'bold' : 'normal', cursor: 'pointer' }}>{tab.label}</button>
                  ))}
                </>
              )}
              {regRole === 'Управляющий' && (
                <>
                  {[
                    { id: 'manager-overview', label: '🛠️ Диспетчер заявок' },
                    { id: 'manager-meters', label: '🔌 Контроль ресурсов' },
                    { id: 'boards', label: '📢 Доска объявлений' }
                  ].map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} style={{ width: '100%', textAlign: 'left', padding: '14px 20px', borderRadius: '12px', border: 'none', background: activeTab === tab.id ? '#0055ff' : 'transparent', color: activeTab === tab.id ? '#fff' : 'var(--text-main)', fontSize: '14px', fontWeight: activeTab === tab.id ? 'bold' : 'normal', cursor: 'pointer' }}>{tab.label}</button>
                  ))}
                </>
              )}
              {regRole === 'Агент' && (
                <>
                  {[
                    { id: 'agent-overview', label: '🤝 Сделки и Лиды' },
                    { id: 'finances', label: '💰 Комиссионные' }
                  ].map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} style={{ width: '100%', textAlign: 'left', padding: '14px 20px', borderRadius: '12px', border: 'none', background: activeTab === tab.id ? '#0055ff' : 'transparent', color: activeTab === tab.id ? '#fff' : 'var(--text-main)', fontSize: '14px', fontWeight: activeTab === tab.id ? 'bold' : 'normal', cursor: 'pointer' }}>{tab.label}</button>
                  ))}
                </>
              )}
            </div>

            <div style={{ flex: 1, padding: '40px', overflowY: 'auto', maxHeight: 'calc(100vh - 85px)' }}>
              
              {activeTab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '35px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                    <div style={{ background: 'var(--bg-cards)', border: '1px solid var(--border-color)', padding: '25px', borderRadius: '16px' }}>
                      <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '10px' }}>Общий доход портфеля</div>
                      <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#0055ff' }}>{totalIncome.toLocaleString()} ₽</div>
                    </div>
                    <div style={{ background: 'var(--bg-cards)', border: '1px solid var(--border-color)', padding: '25px', borderRadius: '16px' }}>
                      <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '10px' }}>Заполняемость</div>
                      <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#10b981' }}>{occupancyRate}%</div>
                    </div>
                    <div style={{ background: 'var(--bg-cards)', border: '1px solid var(--border-color)', padding: '25px', borderRadius: '16px' }}>
                      <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '10px' }}>Активные бронирования</div>
                      <div style={{ fontSize: '26px', fontWeight: 'bold' }}>{activeBookingsCount} сессий</div>
                    </div>
                    <div style={{ background: 'var(--bg-cards)', border: '1px solid var(--border-color)', padding: '25px', borderRadius: '16px' }}>
                      <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '10px' }}>Ожидаемая коммуналка</div>
                      <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#f59e0b' }}>{expectedIncome.toLocaleString()} ₽</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>Интерактивный календарь показов / броней</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', background: 'var(--bg-cards)', border: '1px solid var(--border-color)', padding: '15px', borderRadius: '20px' }}>
                        {daysOfWeek.map(day => (
                          <div key={day} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, day)} style={{ background: 'var(--bg-main)', minHeight: '180px', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '13px', borderBottom: '1px solid var(--border-color)', paddingBottom: '5px', color: '#0055ff' }}>{day}</div>
                            {bookings.filter(b => b.day === day).map(b => (
                              <div key={b.id} draggable onDragStart={(e) => handleDragStart(e, b.id)} style={{ background: 'rgba(0, 85, 255, 0.1)', border: '1px solid #0055ff', padding: '8px', borderRadius: '8px', fontSize: '11px', cursor: 'grab', position: 'relative' }}>
                                <div style={{ fontWeight: 'bold', marginBottom: '3px' }}>{b.title}</div>
                                <div style={{ color: 'var(--text-muted)' }}>{b.time}</div>
                                <div style={{ color: '#0055ff', marginTop: '3px', fontWeight: 'bold' }}>{b.cost} ₽</div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>

                      <form onSubmit={handleAddBooking} style={{ marginTop: '20px', background: 'var(--bg-cards)', border: '1px solid var(--border-color)', padding: '20px', borderRadius: '16px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '15px', alignItems: 'end' }}>
                        <div className="saas-input-group" style={{ marginBottom: 0 }}>
                          <label>Событие</label>
                          <input type="text" placeholder="Офис 101 — Показ" value={newBookingTitle} onChange={(e) => setNewBookingTitle(e.target.value)} required />
                        </div>
                        <div className="saas-input-group" style={{ marginBottom: 0 }}>
                          <label>День</label>
                          <select value={newBookingDay} onChange={(e) => setNewBookingDay(e.target.value)} className="saas-modern-select" style={{ padding: '12px' }}>
                            {daysOfWeek.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </div>
                        <div className="saas-input-group" style={{ marginBottom: 0 }}>
                          <label>Время</label>
                          <input type="text" placeholder="14:00 - 15:00" value={newBookingTime} onChange={(e) => setNewBookingTime(e.target.value)} required />
                        </div>
                        <div className="saas-input-group" style={{ marginBottom: 0 }}>
                          <label>Стоимость</label>
                          <input type="number" placeholder="4000" value={newBookingCost} onChange={(e) => setNewBookingCost(e.target.value)} />
                        </div>
                        <button type="submit" style={{ padding: '13px 20px', background: '#0055ff', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>+</button>
                      </form>
                    </div>

                    <div style={{ background: 'var(--bg-cards)', border: '1px solid var(--border-color)', padding: '25px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <h3 style={{ margin: 0, fontSize: '18px' }}>Заметки</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, overflowY: 'auto' }}>
                        {notes.map(note => (
                          <div key={note.id} style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', padding: '12px 35px 12px 12px', borderRadius: '12px', fontSize: '13px', lineHeight: '1.5', position: 'relative' }}>
                            {note.text}
                            <button 
                              type="button" 
                              onClick={() => handleRemoveNote(note.id)} 
                              style={{ position: 'absolute', top: '8px', right: '10px', background: 'none', border: 'none', color: '#ff4444', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold', padding: 0, lineHeight: 1 }}
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                      <form onSubmit={handleAddNote} style={{ display: 'flex', gap: '10px' }}>
                        <input type="text" placeholder="Новая заметка..." value={newNoteText} onChange={(e) => setNewNoteText(e.target.value)} required style={{ flex: 1, padding: '12px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-main)', borderRadius: '10px' }} />
                        <button type="submit" style={{ padding: '12px 20px', background: '#0055ff', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>+</button>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'objects' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                  <h3 style={{ margin: 0, fontSize: '20px' }}>Управляемые объекты фонда</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '25px' }}>
                    {objectsList.map(obj => (
                      <div key={obj.id} style={{ background: 'var(--bg-cards)', border: '1px solid var(--border-color)', padding: '25px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h4 style={{ margin: 0, fontSize: '18px', color: '#0055ff' }}>{obj.name}</h4>
                          <span style={{ fontSize: '11px', background: 'rgba(0,85,255,0.1)', color: '#0055ff', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold' }}>{obj.type}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>📍 {obj.address}</p>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAddObject} style={{ background: 'var(--bg-cards)', border: '1px solid var(--border-color)', padding: '25px', borderRadius: '16px', display: 'grid', gridTemplateColumns: '2fr 2fr 1fr auto', gap: '15px', alignItems: 'end' }}>
                    <div className="saas-input-group" style={{ marginBottom: 0 }}>
                      <label>Название объекта</label>
                      <input type="text" placeholder="ТЦ Западный, Корпус Б" value={objName} onChange={(e) => setObjName(e.target.value)} required />
                    </div>
                    <div className="saas-input-group" style={{ marginBottom: 0 }}>
                      <label>Адрес</label>
                      <input type="text" placeholder="ул. Строителей, д. 4" value={objAddress} onChange={(e) => setObjAddress(e.target.value)} required />
                    </div>
                    <div className="saas-input-group" style={{ marginBottom: 0 }}>
                      <label>Тип</label>
                      <select value={objType} onChange={(e) => setObjType(e.target.value)} className="saas-modern-select">
                        <option value="Офисы">Офисы</option>
                        <option value="Торговая площадь">Торговая площадь</option>
                        <option value="Склад">Склад</option>
                      </select>
                    </div>
                    <button type="submit" style={{ padding: '14px 25px', background: '#0055ff', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Добавить</button>
                  </form>
                </div>
              )}

              {activeTab === 'landlords' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                  <h3 style={{ margin: 0, fontSize: '20px' }}>Реестр контрагентов и жильцов</h3>
                  <div style={{ background: 'var(--bg-cards)', border: '1px solid var(--border-color)', borderRadius: '16px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.1)' }}>
                          <th style={{ padding: '15px' }}>ФИО / Компания</th>
                          <th style={{ padding: '15px' }}>Телефон</th>
                          <th style={{ padding: '15px' }}>Закрепленное помещение</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tenants.map(t => (
                          <tr key={t.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '15px', fontWeight: 'bold' }}>{t.name}</td>
                            <td style={{ padding: '15px', color: 'var(--text-muted)' }}>{t.phone}</td>
                            <td style={{ padding: '15px' }}><span style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>{t.room}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <form onSubmit={handleAddTenant} style={{ background: 'var(--bg-cards)', border: '1px solid var(--border-color)', padding: '25px', borderRadius: '16px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '15px', alignItems: 'end' }}>
                    <div className="saas-input-group" style={{ marginBottom: 0 }}>
                      <label>ФИО или Название организации</label>
                      <input type="text" placeholder="ООО Новые Технологии" value={tenantName} onChange={(e) => setTenantName(e.target.value)} required />
                    </div>
                    <div className="saas-input-group" style={{ marginBottom: 0 }}>
                      <label>Контакты</label>
                      <input type="tel" placeholder="+7 (999) 000-00-00" value={tenantPhone} onChange={(e) => setTenantPhone(e.target.value)} required />
                    </div>
                    <div className="saas-input-group" style={{ marginBottom: 0 }}>
                      <label>Помещение</label>
                      <input type="text" placeholder="Офис 501" value={tenantRoom} onChange={(e) => setTenantRoom(e.target.value)} />
                    </div>
                    <button type="submit" style={{ padding: '14px 25px', background: '#0055ff', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Добавить</button>
                  </form>
                </div>
              )}

              {activeTab === 'finances' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  <h3 style={{ margin: 0, fontSize: '20px' }}>Финансовая аналитика и транзакции</h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                    <div style={{ background: 'var(--bg-cards)', border: '1px solid var(--border-color)', padding: '30px', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                      <h4 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#0055ff' }}>Структура доходов портфеля</h4>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Фиксированная арендная ставка:</span>
                        <strong style={{ fontSize: '16px' }}>{baseIncome.toLocaleString()} ₽</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Поступления с бронирований:</span>
                        <strong style={{ fontSize: '16px', color: '#0055ff' }}>+{variableIncome.toLocaleString()} ₽</strong>
                      </div>
                      {regRole === 'Агент' && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Сумма закрытых комиссий:</span>
                          <strong style={{ fontSize: '16px', color: '#10b981' }}>{agentCommissionsTotal.toLocaleString()} ₽</strong>
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Ожидаемые сборы ЖКУ:</span>
                        <strong style={{ fontSize: '16px', color: '#f59e0b' }}>{expectedIncome.toLocaleString()} ₽</strong>
                      </div>
                      <div style={{ width: '100%', height: '1px', background: 'var(--border-color)', margin: '10px 0' }}></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '20px', fontWeight: 'bold' }}>
                        <span>Итого выручка:</span>
                        <span style={{ color: '#10b981' }}>{(totalIncome + expectedIncome + (regRole === 'Агент' ? agentCommissionsTotal : 0)).toLocaleString()} ₽</span>
                      </div>
                    </div>

                    <div style={{ background: 'var(--bg-cards)', border: '1px solid var(--border-color)', padding: '30px', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', justifyContent: 'center' }}>
                      <h4 style={{ margin: 0, fontSize: '16px', alignSelf: 'flex-start' }}>Распределение финансовых потоков</h4>
                      <div style={{ display: 'flex', gap: '25px', alignItems: 'flex-end', height: '160px', width: '100%', maxWidth: '300px', paddingBottom: '10px', borderBottom: '2px solid var(--border-color)' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '100%', background: '#0055ff', height: '120px', borderRadius: '6px 6px 0 0', position: 'relative' }}>
                            <span style={{ position: 'absolute', top: '-22px', left: '50%', transform: 'translateX(-50%)', fontSize: '11px', fontWeight: 'bold' }}>70%</span>
                          </div>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Аренда</span>
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '100%', background: '#10b981', height: `${Math.min(20 + (variableIncome / 1000), 100)}px`, borderRadius: '6px 6px 0 0', position: 'relative' }}>
                            <span style={{ position: 'absolute', top: '-22px', left: '50%', transform: 'translateX(-50%)', fontSize: '11px', fontWeight: 'bold' }}>Новые</span>
                          </div>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Брони</span>
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '100%', background: '#f59e0b', height: '45px', borderRadius: '6px 6px 0 0', position: 'relative' }}>
                            <span style={{ position: 'absolute', top: '-22px', left: '50%', transform: 'translateX(-50%)', fontSize: '11px', fontWeight: 'bold' }}>20%</span>
                          </div>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ЖКУ</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'tenant-overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '20px' }}>Кабинет Арендатора: Контроль счетов</h3>
                    <span style={{ fontSize: '13px', background: 'rgba(0,85,255,0.1)', color: '#0055ff', padding: '6px 14px', borderRadius: '12px' }}>
                      Объектов в базе: <strong>{objectsList.length}</strong>
                    </span>
                  </div>

                  <div style={{ background: 'var(--bg-cards)', border: '1px solid var(--border-color)', padding: '20px', borderRadius: '16px' }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#0055ff', fontWeight: 'bold' }}>💼 Сертифицированный Агент Вашей сделки:</h4>
                    <div style={{ background: 'var(--bg-main)', padding: '15px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>X24 Pro Premium Broker Service</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Статус ведения: <span style={{ color: '#10b981', fontWeight: 'bold' }}>Сопровождение и аудит договоров активно</span></div>
                      </div>
                      <span style={{ fontSize: '11px', background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '5px 12px', borderRadius: '10px', fontWeight: 'bold' }}>Синхронизировано</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {tenantBills.map(bill => (
                      <div key={bill.id} style={{ background: 'var(--bg-cards)', border: '1px solid var(--border-color)', padding: '25px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>Расчетный период: {bill.period}</h4>
                          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>Аренда: {bill.rent.toLocaleString()} ₽ | Коммунальные услуги: {bill.utilities.toLocaleString()} ₽</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 'bold', color: bill.status === 'Оплачен' ? '#10b981' : '#ff4444', background: bill.status === 'Оплачен' ? 'rgba(16,185,129,0.1)' : 'rgba(255,68,68,0.1)', padding: '5px 12px', borderRadius: '12px' }}>{bill.status}</span>
                          {bill.status === 'Не оплачен' && (
                            <button 
                              type="button" 
                              onClick={() => handleOpenPaymentModal(bill)} 
                              style={{ padding: '10px 20px', background: '#0055ff', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                              Оплатить
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {showUtilityModal && selectedBill && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 99999 }}>
                  <div style={{ background: 'var(--bg-cards)', border: '2px solid var(--border-color)', padding: '35px', borderRadius: '24px', width: '100%', maxWidth: '450px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ margin: 0, fontSize: '20px', textAlign: 'center' }}>Ввод данных по коммуналке</h3>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center' }}>Оплата за период: <strong>{selectedBill.period}</strong></p>
                    
                    <form onSubmit={handleSubmitPayment} className="saas-modern-form" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      <div className="saas-input-group" style={{ marginBottom: 0 }}>
                        <label>Номер счета ЖКУ / коммуналки *</label>
                        <input type="text" placeholder="ЛС-984351-24" value={utilityAccount} onChange={(e) => setUtilityAccount(e.target.value)} required />
                      </div>
                      <div className="saas-input-group" style={{ marginBottom: 0 }}>
                        <label>ФИО плательщика *</label>
                        <input type="text" placeholder="София Беленко" value={utilityFio} onChange={(e) => setUtilityFio(e.target.value)} required />
                      </div>
                      <div className="saas-input-group" style={{ marginBottom: 0 }}>
                        <label>За какой месяц *</label>
                        <input type="text" placeholder="Июнь 2026" value={utilityMonth} onChange={(e) => setUtilityMonth(e.target.value)} required />
                      </div>
                      
                      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button type="submit" style={{ flex: 1, padding: '14px', background: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Подтвердить платеж</button>
                        <button type="button" onClick={() => setShowUtilityModal(false)} style={{ padding: '14px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '12px', cursor: 'pointer' }}>Отмена</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {activeTab === 'tenant-meters' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                  <h3 style={{ margin: 0, fontSize: '20px' }}>Подать текущие показания ресурсов</h3>
                  <div style={{ background: 'var(--bg-cards)', border: '1px solid var(--border-color)', padding: '25px', borderRadius: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '20px', alignItems: 'end' }}>
                    <div className="saas-input-group" style={{ marginBottom: 0 }}>
                      <label>Горячая/Холодная вода (м³)</label>
                      <input type="number" value={tenantMetersWater} onChange={(e) => setTenantMetersWater(e.target.value)} />
                    </div>
                    <div className="saas-input-group" style={{ marginBottom: 0 }}>
                      <label>Электроэнергия (кВт/ч)</label>
                      <input type="number" value={tenantMetersElectro} onChange={(e) => setTenantMetersElectro(e.target.value)} />
                    </div>
                    <button type="button" onClick={() => alert('Показания отправлены управляющей компании на сверку')} style={{ padding: '14px 25px', background: '#0055ff', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Отправить</button>
                  </div>
                </div>
              )}

              {activeTab === 'tenant-tickets' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                  <h3 style={{ margin: 0, fontSize: '20px' }}>Заявки на обслуживание и ремонт</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {tenantTickets.map(t => (
                      <div key={t.id} style={{ background: 'var(--bg-cards)', border: '1px solid var(--border-color)', padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{t.subject}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Служба: {t.category}</div>
                        </div>
                        <span style={{ fontSize: '11px', background: 'rgba(0,85,255,0.1)', color: '#0055ff', padding: '5px 12px', borderRadius: '10px', fontWeight: 'bold' }}>{t.status}</span>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAddTicket} style={{ background: 'var(--bg-cards)', border: '1px solid var(--border-color)', padding: '25px', borderRadius: '16px', display: 'grid', gridTemplateColumns: '3fr 1fr auto', gap: '15px', alignItems: 'end' }}>
                    <div className="saas-input-group" style={{ marginBottom: 0 }}>
                      <label>Что случилось?</label>
                      <input type="text" placeholder="Перегорела лампа, протечка крана..." value={newTicketText} onChange={(e) => setNewTicketText(e.target.value)} required />
                    </div>
                    <div className="saas-input-group" style={{ marginBottom: 0 }}>
                      <label>Категория</label>
                      <select value={newTicketCat} onChange={(e) => setNewTicketCat(e.target.value)} className="saas-modern-select">
                        <option value="Техслужба">Техслужба</option>
                        <option value="Безопасность">Безопасность</option>
                        <option value="Клининг">Клининг</option>
                      </select>
                    </div>
                    <button type="submit" style={{ padding: '14px 25px', background: '#0055ff', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Подать тикет</button>
                  </form>
                </div>
              )}

              {activeTab === 'manager-overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                  <h3 style={{ margin: 0, fontSize: '20px' }}>Поступившие сервисные заявки от жильцов</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {managerTasks.map(task => (
                      <div key={task.id} style={{ background: 'var(--bg-cards)', border: '1px solid var(--border-color)', padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontSize: '11px', background: 'red', color: 'white', padding: '2px 6px', borderRadius: '4px', marginRight: '10px', fontWeight: 'bold' }}>{task.priority}</span>
                          <strong style={{ color: '#0055ff' }}>{task.sender}:</strong>
                          <span style={{ marginLeft: '10px' }}>{task.desc}</span>
                        </div>
                        <button type="button" onClick={() => alert('Статус заявки изменен на: Выполнено')} style={{ background: 'none', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>Закрыть заявку</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'manager-meters' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                  <h3 style={{ margin: 0, fontSize: '20px' }}>Входящие показания приборов учета</h3>
                  <div style={{ background: 'var(--bg-cards)', border: '1px solid var(--border-color)', borderRadius: '16px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.1)' }}>
                          <th style={{ padding: '15px' }}>Помещение</th>
                          <th style={{ padding: '15px' }}>Водоснабжение</th>
                          <th style={{ padding: '15px' }}>Электроэнергия</th>
                          <th style={{ padding: '15px' }}>Статус</th>
                        </tr>
                      </thead>
                      <tbody>
                        {incomingMeters.map(m => (
                          <tr key={m.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '15px', fontWeight: 'bold' }}>{m.room}</td>
                            <td style={{ padding: '15px' }}>{m.water}</td>
                            <td style={{ padding: '15px' }}>{m.electro}</td>
                            <td style={{ padding: '15px' }}><span style={{ fontSize: '12px', color: m.status === 'Принято' ? '#10b981' : '#f59e0b' }}>● {m.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'agent-overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                  <h3 style={{ margin: 0, fontSize: '20px' }}>Воронка обработки потенциальных клиентов (Агенты)</h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                    {agentLeads.map(lead => (
                      <div key={lead.id} style={{ background: 'var(--bg-cards)', border: '1px solid var(--border-color)', padding: '20px', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{lead.client}</h4>
                          <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 'bold' }}>+{lead.commission.toLocaleString()} ₽</span>
                        </div>
                        <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--text-muted)' }}>📞 {lead.phone} | Помещение: <strong>{lead.object}</strong></p>
                        <div style={{ fontSize: '11px', background: '#0055ff', color: 'white', display: 'inline-block', padding: '4px 10px', borderRadius: '8px', fontWeight: 'bold' }}>{lead.status}</div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAddAgentLead} style={{ background: 'var(--bg-cards)', border: '1px solid var(--border-color)', padding: '25px', borderRadius: '16px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '15px', alignItems: 'end' }}>
                    <div className="saas-input-group" style={{ marginBottom: 0 }}>
                      <label>ФИО Клиента (Арендатора) *</label>
                      <input type="text" placeholder="Константин В." value={newLeadClient} onChange={(e) => setNewLeadClient(e.target.value)} required />
                    </div>
                    <div className="saas-input-group" style={{ marginBottom: 0 }}>
                      <label>Телефон *</label>
                      <input type="tel" placeholder="+7 (999) 555-55-55" value={newLeadPhone} onChange={(e) => setNewLeadPhone(e.target.value)} required />
                    </div>
                    <div className="saas-input-group" style={{ marginBottom: 0 }}>
                      <label>Объект фонда</label>
                      <input type="text" placeholder="Офис 302" value={newLeadObject} onChange={(e) => setNewLeadObject(e.target.value)} />
                    </div>
                    <div className="saas-input-group" style={{ marginBottom: 0 }}>
                      <label>Комиссия (₽)</label>
                      <input type="number" placeholder="15000" value={newLeadCommission} onChange={(e) => setNewLeadCommission(e.target.value)} />
                    </div>
                    <button type="submit" style={{ padding: '14px 25px', background: '#0055ff', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Добавить</button>
                  </form>
                </div>
              )}

              {activeTab === 'boards' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                  <h3 style={{ margin: 0, fontSize: '20px' }}>Информационная лента БЦ и комплекса</h3>
                  
                  {regRole === 'Арендодатель' && (
                    <div style={{ background: 'var(--bg-cards)', border: '1px solid var(--border-color)', padding: '25px', borderRadius: '16px' }}>
                      <h4 style={{ margin: '0 0 15px 0' }}>Создать новое публичное объявление</h4>
                      <form onSubmit={handleAddAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div className="saas-input-group" style={{ marginBottom: 0 }}>
                          <label>Заголовок новости</label>
                          <input type="text" placeholder="Технические работы на сервере" value={annTitle} onChange={(e) => setAnnTitle(e.target.value)} required />
                        </div>
                        <div className="saas-input-group" style={{ marginBottom: 0 }}>
                          <label>Содержимое / Описание сообщения</label>
                          <textarea rows="3" placeholder="Уважаемые арендаторы, уведомляем вас о том, что..." value={annBody} onChange={(e) => setAnnBody(e.target.value)} required style={{ width: '100%', padding: '12px', boxSizing: 'border-box', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-main)', borderRadius: '12px', fontFamily: 'inherit' }}></textarea>
                        </div>
                        <button type="submit" style={{ alignSelf: 'flex-start', padding: '12px 25px', background: '#0055ff', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Опубликовать на стену</button>
                      </form>
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {announcements.map(ann => (
                      <div key={ann.id} style={{ padding: '20px', background: 'var(--bg-cards)', border: '1px solid var(--border-color)', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h4 style={{ margin: 0, fontSize: '18px', color: '#0055ff' }}>{ann.title}</h4>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{ann.date}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: 'var(--text-main)' }}>{ann.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

          <footer className="saas-footer" style={{ background: 'var(--bg-cards)', marginTop: 0, borderTop: '1px solid var(--border-color)' }}>
            <p>&copy; 2026 Realty24. Все права защищены.</p>
          </footer>
        </div>
      )}
    </div>
  );
}

export default App;