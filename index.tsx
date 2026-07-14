import React, { useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { motion, AnimatePresence } from "framer-motion";

// --- Tipos y Datos de Enlaces Médicos ---
type CategoryType = 'Asistenciales' | 'Operativos' | 'Capacitación' | 'Soporte';

interface MedicalLink {
  id: string;
  name: string;
  url: string;
  category: CategoryType;
  description: string;
  keywords: string[];
}

const MEDICAL_LINKS: MedicalLink[] = [
  { id: 'everest_3', name: 'EVEREST 3.0', url: 'https://cloud.tg6.everestintelligent.com.co/viva/EverHealth/auth/login', category: 'Asistenciales', description: 'Nueva versión 3.0 del portal de gestión de salud EverHealth.', keywords: ['historia clinica', 'pacientes', 'portal', 'everest 3.0'] },
  { id: 'firmar_consentimiento', name: 'FIRMAR CONSENTIMIENTO', url: 'https://cloud.tg6.everestintelligent.com.co/viva/cisign-paciente/firma', category: 'Asistenciales', description: 'Firmar consentimiento del paciente en la plataforma de firmas.', keywords: ['firma', 'consentimiento', 'paciente', 'everest'] },
  { id: 'solicitar_consentimiento', name: 'SOLICITAR CONSENTIMIENTO', url: 'https://cloud.tg6.everestintelligent.com.co/viva/cisign/', category: 'Asistenciales', description: 'Solicitud de consentimientos informados en la plataforma.', keywords: ['consentimiento', 'solicitar', 'firma', 'everest'] },
  { id: 'pana', name: 'NUEVA EPS CONTRIBUTIVO', url: 'https://neps.everestintelligent.com/viva/EverHealth/auth/login', category: 'Asistenciales', description: 'Sistema de gestión Nueva EPS.', keywords: ['nueva eps', 'afiliados'] },
  { id: 'mipres', name: 'MIPRES', url: 'https://mipres.sispro.gov.co/MIPRESNOPBS/Login.aspx?ReturnUrl=%2fMIPRESNOPBS', category: 'Asistenciales', description: 'Prescripción de servicios y tecnologías no PBS.', keywords: ['medicamentos', 'no pbs', 'formular', 'sispro'] },
  { id: 'fichas', name: 'FICHAS EPIDEMIOLÓGICAS', url: 'https://drive.google.com/drive/folders/1DHFZPwH_ZaG5NUTu0NmPYtfmV3ZZTybv?usp=share_link', category: 'Soporte', description: 'Formatos para reporte de eventos en salud pública.', keywords: ['sivigila', 'notificacion', 'epidemiologia'] },
  { id: 'lumier', name: 'LUMIER', url: 'https://lumierdigital.com:8443/login.lu', category: 'Asistenciales', description: 'Visualizador de imágenes diagnósticas y rayos X.', keywords: ['rx', 'rayos x', 'imagenes', 'radiologia'] },
  { id: 'annarlytics', name: 'ANNARLYTICS', url: 'http://datacare.viva1a.com.co/datacare/#nbb', category: 'Asistenciales', description: 'Resultados de laboratorio clínico centralizado.', keywords: ['laboratorio', 'examenes', 'sangre', 'resultados'] },
  { id: 'athenea', name: 'ATHENEA', url: 'https://medicosviva1a.atheneasoluciones.com/', category: 'Asistenciales', description: 'Sistema alterno de resultados médicos.', keywords: ['resultados', 'consulta'] },
  { id: 'agenda_lab', name: 'AGENDA LABORATORIOS', url: 'https://appcita.viva1a.com.co:8051/laboratorio/agente', category: 'Operativos', description: 'Programación de citas para toma de muestras.', keywords: ['citas', 'agenda', 'muestras'] },
  { id: 'glpi', name: 'MESA DE SERVICIO (GLPI)', url: 'http://mesadeservicios.viva1a.com.co/glpi/index.php', category: 'Soporte', description: 'Reporte de fallas técnicas y soporte IT.', keywords: ['soporte', 'tecnico', 'computador', 'daño', 'ticket'] },
  { id: 'viva_aprendiendo', name: 'VIVA APRENDIENDO', url: 'http://vivaaprendiendo.com.co/', category: 'Capacitación', description: 'Plataforma de capacitación continua.', keywords: ['cursos', 'capacitacion', 'aprender'] },
  { id: 'mi_portal', name: 'MI PORTAL GH', url: 'https://www.miportalgh.com/', category: 'Operativos', description: 'Gestión humana y desprendibles de nómina.', keywords: ['nomina', 'vacaciones', 'talento humano'] },
  { id: 'poblacion_utp', name: 'POBLACION UTP', url: 'https://drive.google.com/drive/folders/1W1cNCvtEbp3Muk5BpISm40qyxvEHox9C?usp=drive_link', category: 'Asistenciales', description: 'Base de datos población Universidad Tecnológica.', keywords: ['utp', 'estudiantes', 'docentes'] },
  { id: 'contingencia', name: 'CONTINGENCIA MANUAL', url: 'https://drive.google.com/drive/folders/1h3vXmO5xk61g8CVYDZZsry_IuIUZsNmU?usp=sharing', category: 'Soporte', description: 'Formatos para uso cuando el sistema no funciona.', keywords: ['caida sistema', 'manual', 'papel'] },
  { id: 'reporte_inseguro', name: 'ACCIONES INSEGURAS', url: '#', category: 'Soporte', description: 'Herramientas de reporte, investigación, análisis e identificación de riesgos.', keywords: ['seguridad', 'evento adverso', 'riesgo', 'reportes', 'investigacion', 'analisis'] },
  { id: 'desistimiento', name: 'DESISTIMIENTOS', url: 'https://drive.google.com/drive/folders/1x8Xrrq2o0zMqYGScjddx8W9JedmfUsRd?usp=sharing', category: 'Operativos', description: 'Formatos de desistimiento de servicios.', keywords: ['no acepta', 'firma', 'paciente'] },
  { id: 'inst_athenea', name: 'INSTRUCTIVOS ATHENEA', url: 'https://drive.google.com/file/d/1nZ6FY0A18ISUP_rnRFbxLNp2k4o0PyPz/view', category: 'Capacitación', description: 'Manuales y guías para el uso de la plataforma Athenea.', keywords: ['manual', 'guia', 'athenea', 'ayuda'] },
  { id: 'inst_generales', name: 'INSTRUCTIVOS', url: 'https://drive.google.com/drive/folders/1PHih91zht6F_ytTGhvKL0HZKka3jFYq8?usp=drive_link', category: 'Capacitación', description: 'Carpeta general con diversos instructivos de procesos IPS.', keywords: ['manuales', 'guias', 'capacitacion', 'procesos'] },
  { id: 'historias_extramural', name: 'FORMATO HISTORIAS EXTRAMURAL', url: 'https://drive.google.com/drive/folders/16MD1-slKi22meenPeQNiSlo7_2I5ZtPP?usp=sharing', category: 'Asistenciales', description: 'Carpeta con formatos para el diligenciamiento de historias clínicas extramurales.', keywords: ['historia clinica', 'extramural', 'formatos', 'plantillas', 'drive'] },
];

interface SubLink {
  name: string;
  url: string;
  description: string;
}

const REPORT_INSEGURO_SUBLINKS: SubLink[] = [
  {
    name: 'Herramienta de Reportes',
    url: 'https://forms.cloud.microsoft/r/5ctpshK0yP',
    description: 'Reporte de incidentes, eventos adversos y fallas activas.'
  },
  {
    name: 'Herramienta de Investigación',
    url: 'https://forms.cloud.microsoft/r/HB1giE70f2',
    description: 'Seguimiento, investigación y gestión de eventos reportados.'
  },
  {
    name: 'Herramienta de Análisis',
    url: 'https://forms.cloud.microsoft/r/bV7CMcJSq5',
    description: 'Análisis detallado de causas, protocolo de Londres e incidentes.'
  },
  {
    name: 'Identificación de Riesgos',
    url: 'https://forms.cloud.microsoft/r/SUzkzfTfDj',
    description: 'Identificación proactiva de riesgos asociados a la seguridad del paciente.'
  },
  {
    name: 'Registros de Casos Analizados',
    url: 'https://forms.cloud.microsoft/r/8R0q6hwyf2',
    description: 'Historial y registros de casos analizados de seguridad del paciente.'
  }
];

const CredentialItem = ({ label, value }: { label: string; value: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-100 hover:bg-sky-50 transition-all group/item relative">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-mono font-bold text-slate-900 text-sm">{value}</span>
        <button 
          onClick={handleCopy}
          className={`p-1.5 rounded-lg transition-all ${copied ? 'bg-sky-500 text-white border-transparent' : 'bg-white text-slate-400 hover:text-sky-600 shadow-sm border border-slate-100'}`}
          title="Copiar al portapapeles"
        >
          {copied ? (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          )}
        </button>
      </div>
      <AnimatePresence>
        {copied && (
          <motion.span 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute -top-6 right-0 text-[9px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100 shadow-sm"
          >
            ¡Copiado!
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};

const App = () => {
  const [filteredIds, setFilteredIds] = useState<string[]>(MEDICAL_LINKS.map(l => l.id));
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showSubLinks, setShowSubLinks] = useState(false);
  const [activeTab, setActiveTab] = useState<'links' | 'credentials' | 'support'>('links');

  const categories: CategoryType[] = ['Asistenciales', 'Operativos', 'Capacitación', 'Soporte'];

  const handleCategoryClick = (cat: string | null) => {
    if (activeCategory === cat) {
      setActiveCategory(null);
      setFilteredIds(MEDICAL_LINKS.map(l => l.id));
    } else {
      setActiveCategory(cat);
      if (cat === null) {
        setFilteredIds(MEDICAL_LINKS.map(l => l.id));
      } else {
        setFilteredIds(MEDICAL_LINKS.filter(l => l.category === cat).map(l => l.id));
      }
    }
  };

  const displayedLinks = useMemo(() => {
    const unfiltered = MEDICAL_LINKS.filter(l => filteredIds.includes(l.id));
    // If we are showing the featured card, exclude it from the grid to prevent duplication
    const showFeatured = activeCategory === null || activeCategory === 'Asistenciales';
    if (showFeatured) {
      return unfiltered.filter(l => l.id !== 'historias_extramural');
    }
    return unfiltered;
  }, [filteredIds, activeCategory]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-50 rounded-full blur-[120px] opacity-45 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] bg-sky-50 rounded-full blur-[100px] opacity-35"></div>
      </div>

      <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-4 py-2.5 shadow-sm">
        <div className="max-w-[1900px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-4 shrink-0 justify-between w-full sm:w-auto">
            <div className="flex items-center gap-2.5">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-lg flex items-center justify-center text-white"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </motion.div>
              <h1 className="text-sm font-black tracking-tight text-slate-800 uppercase heading-font">VIVA1A <span className="text-emerald-600">EXTRAMURAL</span></h1>
            </div>

            <div className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase tracking-wider rounded-full border border-emerald-100 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              MODO TABLETA
            </div>
          </div>

          {/* Categories bar - visible only when Links tab is active */}
          {activeTab === 'links' && (
            <div className="bg-slate-100 p-0.5 rounded-xl flex items-center shadow-inner overflow-x-auto no-scrollbar max-w-full">
              <button
                onClick={() => handleCategoryClick(null)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] transition-all duration-300 font-bold text-[10px] whitespace-nowrap ${
                  activeCategory === null ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:bg-white/50'
                }`}
              >
                <CategoryIcon type="Todos" active={activeCategory === null} />
                <span>Todos</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] transition-all duration-300 font-bold text-[10px] whitespace-nowrap ${
                    activeCategory === cat ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:bg-white/50'
                  }`}
                >
                  <CategoryIcon type={cat} active={activeCategory === cat} />
                  <span>{cat}</span>
                </button>
              ))}
            </div>
          )}

          <div className="hidden md:flex items-center gap-3 shrink-0">
             <div className="px-3 py-1 bg-emerald-50 rounded-full text-[9px] font-black text-emerald-600 uppercase tracking-widest border border-emerald-100 flex items-center gap-1.5">
               <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
               MEDICOS CRA80
             </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 max-w-[1700px] mx-auto w-full p-4 md:p-6 flex flex-col relative z-10">
        
        {/* Tablet Top Helper Box */}
        <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl p-4 md:p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center text-white text-lg shadow-md shrink-0">
              📱
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 heading-font uppercase">
                Panel Extramural <span className="text-emerald-600">CRA 80</span>
              </h2>
              <p className="text-xs text-slate-500 font-bold leading-relaxed">
                Diseño optimizado para tablets con botones grandes y accesos directos de alta prioridad en campo.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="px-2.5 py-0.5 bg-sky-50 text-sky-700 text-[9px] font-black rounded-full border border-sky-100">CRA 80</span>
            <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-[9px] font-black rounded-full border border-indigo-100">IPS VIVA1A</span>
          </div>
        </div>

        {/* Tab Selector for Tablet ergonomics */}
        <div className="flex bg-slate-200/60 p-1 rounded-xl border border-slate-200/80 shadow-inner w-full max-w-lg mx-auto mb-6">
          <button
            onClick={() => setActiveTab('links')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'links'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-white/50 hover:text-slate-900'
            }`}
          >
            📂 Enlaces
          </button>
          <button
            onClick={() => setActiveTab('credentials')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'credentials'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-white/50 hover:text-slate-900'
            }`}
          >
            🔑 Credenciales
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'support'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-white/50 hover:text-slate-900'
            }`}
          >
            💬 Soporte
          </button>
        </div>

        {/* Dynamic content area based on activeTab */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {activeTab === 'links' && (
              <motion.div
                key="links-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
              >
                {/* Banner Destacado para Extramural (Formato Historias Extramural) */}
                {(activeCategory === null || activeCategory === 'Asistenciales') && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-700 p-5 md:p-6 rounded-2xl shadow-md relative text-white group"
                  >
                    <div className="absolute top-0 right-0 w-60 h-60 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-xl pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-2 max-w-3xl">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10">
                          <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse shadow-sm"></span>
                          HERRAMIENTA PRINCIPAL EXTRAMURAL
                        </div>
                        <h3 className="text-xl md:text-2xl font-black heading-font tracking-tight uppercase">
                          Formato Historias Extramural
                        </h3>
                        <p className="text-white/90 text-xs md:text-sm font-semibold leading-relaxed">
                          Accede directamente a la carpeta oficial con todas las plantillas y formatos para el diligenciamiento de historias clínicas en campo. ¡Descarga las plantillas a tu tablet antes de salir para trabajar de forma óptima!
                        </p>
                      </div>

                      <motion.a
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        href="https://drive.google.com/drive/folders/16MD1-slKi22meenPeQNiSlo7_2I5ZtPP?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 bg-white hover:bg-emerald-50 text-emerald-800 font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 self-start lg:self-center"
                      >
                        <span>Abrir Formatos</span>
                        <svg className="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                      </motion.a>
                    </div>
                  </motion.div>
                )}

                {/* Subtitle for work links */}
                <div className="mb-6">
                  <h3 className="text-xl font-black text-slate-800 uppercase heading-font tracking-tight">
                    Enlaces de <span className="text-emerald-600">Trabajo</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-bold">Toca cualquier acceso para redirigirte a la plataforma correspondiente.</p>
                </div>

                <div className="pb-24">
                  <AnimatePresence mode="popLayout">
                    {displayedLinks.length > 0 ? (
                      <motion.div
                        layout
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4"
                      >
                        {displayedLinks.map((link, idx) => {
                          const isSpecial = link.id === 'reporte_inseguro';
                          return (
                            <motion.a
                              key={link.id}
                              href={link.url}
                              target={isSpecial ? undefined : "_blank"}
                              rel={isSpecial ? undefined : "noopener noreferrer"}
                              onClick={isSpecial ? (e) => { e.preventDefault(); setShowSubLinks(true); } : undefined}
                              layout
                              initial={{ opacity: 0, scale: 0.95, y: 15 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ delay: idx * 0.04, type: 'spring', damping: 22 }}
                              whileHover={{ y: -5, boxShadow: "0 15px 30px -8px rgba(16, 185, 129, 0.12)" }}
                              className="group relative overflow-hidden bg-white border border-slate-200 p-4 md:p-5 rounded-[1.25rem] shadow-sm hover:border-emerald-200 flex flex-col min-h-[170px] cursor-pointer"
                            >
                              <div className={`absolute inset-y-0 left-0 w-1.5 ${getCatBg(link.category)} opacity-10 group-hover:opacity-100 transition-all duration-500`}></div>
                              <div className="flex items-start justify-between mb-3">
                                <div className={`p-2 rounded-xl ${getCatIconBgClass(link.category)} transition-all transform group-hover:scale-110`}>
                                  <LinkIcon id={link.id} category={link.category} />
                                </div>
                                <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-emerald-500 group-hover:text-white transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1 shadow-inner">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                                </div>
                              </div>
                              <div className="space-y-1.5 flex-1">
                                <h4 className="text-xs md:text-sm font-black text-slate-800 tracking-tight group-hover:text-emerald-600 uppercase transition-colors line-clamp-2">
                                  {link.name}
                                </h4>
                                <p className="text-[10px] md:text-xs text-slate-500 leading-relaxed font-semibold line-clamp-3">{link.description}</p>
                              </div>
                              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                                <span className={`text-[7px] md:text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${getCatPillClass(link.category)} transition-all duration-300`}>
                                  {link.category}
                                </span>
                                <div className="flex gap-1">
                                  {link.keywords.slice(0, 2).map(k => (
                                    <span key={k} className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-emerald-300 transition-colors"></span>
                                  ))}
                                </div>
                              </div>
                            </motion.a>
                          );
                        })}
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-[3rem] border-4 border-dashed border-slate-200"
                      >
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 mb-1">Sin coincidencias</h3>
                        <p className="text-slate-400 font-semibold text-sm">Prueba buscando con palabras clave como "everest", "athenea" o "formato".</p>
                        <button
                          onClick={() => handleCategoryClick(null)}
                          className="mt-6 text-emerald-600 font-black text-xs uppercase tracking-widest hover:underline"
                        >
                          Ver todos los enlaces
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {activeTab === 'credentials' && (
              <motion.div
                key="credentials-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="max-w-4xl mx-auto pb-24"
              >
                <div className="mb-8">
                  <h3 className="text-xl font-black text-slate-800 uppercase heading-font tracking-tight">
                    Credenciales <span className="text-emerald-600">de Acceso</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-bold leading-relaxed">
                    Toca el botón de copiar para copiar el usuario o contraseña de forma instantánea. Evita tener que escribirlos manualmente en tu tableta táctil.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { name: 'MESA DE SERVICIO', user: 'MEDICOS.CRA80', pass: 'VIVA2023', icon: '🖥️', color: 'from-emerald-500 to-teal-700' },
                    { name: 'ATHENEA', user: 'CONSULTAMED', pass: 'Viva1a*md04', icon: '📋', color: 'from-emerald-500 to-sky-700' },
                    { name: 'ANNARLYTICS', user: 'CONSULTA', pass: '123456', icon: '🧪', color: 'from-teal-600 to-indigo-700' },
                    { name: 'LUMIER', user: 'PREMIUM', pass: '123456', icon: '🩻', color: 'from-slate-600 to-slate-800' }
                  ].map(cred => (
                    <div key={cred.name} className="relative overflow-hidden bg-white rounded-[1.5rem] p-5 md:p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                      <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${cred.color}`}></div>
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-3xl filter grayscale group-hover:grayscale-0 transition-all">{cred.icon}</span>
                        <span className="text-base font-black text-slate-800 tracking-tight uppercase">{cred.name}</span>
                      </div>
                      <div className="space-y-3">
                        <CredentialItem label="Usuario" value={cred.user} />
                        <CredentialItem label="Contraseña" value={cred.pass} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'support' && (
              <motion.div
                key="support-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="max-w-2xl mx-auto pb-24"
              >
                <div className="mb-8 text-center md:text-left">
                  <h3 className="text-xl font-black text-slate-800 uppercase heading-font tracking-tight">
                    Mesa de Ayuda <span className="text-emerald-600">& Soporte</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-bold">
                    Acceso rápido y directo a soporte técnico cuando ocurran incidentes con tus sistemas.
                  </p>
                </div>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="bg-emerald-600 rounded-[2.5rem] p-8 md:p-10 shadow-xl relative overflow-hidden flex flex-col items-center text-center text-white"
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-white/10 blur-3xl rounded-full"></div>

                  <div className="absolute top-0 right-0 p-6">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-white/50 uppercase tracking-widest font-mono">Estado</span>
                      <div className="w-3 h-3 bg-emerald-300 rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                    </div>
                  </div>

                  <div className="relative mb-8 mt-4">
                    <div className="absolute inset-0 bg-white/10 blur-2xl rounded-full scale-125"></div>
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="relative w-28 h-28 bg-white rounded-[2rem] shadow-lg flex items-center justify-center overflow-hidden border-4 border-white/20"
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent"></div>
                      <svg className="w-14 h-14 text-emerald-600 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        <path className="animate-pulse" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 7v3m0 3v.01" />
                      </svg>
                    </motion.div>
                  </div>

                  <h3 className="text-3xl font-black mb-3 tracking-tight uppercase heading-font">Mesa de Ayuda</h3>
                  <p className="text-white/80 text-sm md:text-base font-semibold leading-relaxed mb-8 px-4">
                    Comunícate de manera inmediata por WhatsApp con soporte técnico de la IPS para resolver incidentes con tus accesos, contraseñas, o fallos de conexión desde tu tablet en campo.
                  </p>

                  <motion.a
                    whileTap={{ scale: 0.95 }}
                    href="https://drive.google.com/file/d/1M9aGDBZ1tNZtLmVV-Tj1Z8KQFyelCmSL/view"
                    target="_blank"
                    className="w-full max-w-md bg-[#25D366] hover:bg-[#1ebe57] text-white py-5 px-8 rounded-3xl flex items-center justify-center gap-3 transition-all shadow-lg font-black text-lg uppercase tracking-wider group"
                  >
                    <svg className="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03a11.934 11.934 0 001.611 6.032L0 24l6.117-1.605a11.847 11.847 0 005.933 1.598h.005c6.637 0 12.032-5.395 12.035-12.03a11.878 11.878 0 00-3.48-8.504" />
                    </svg>
                    <span>Soporte WhatsApp</span>
                  </motion.a>

                  <a
                    href="http://mesadeservicios.viva1a.com.co/glpi/index.php"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 text-white/60 hover:text-white font-black text-xs uppercase tracking-[0.2em] transition-colors"
                  >
                    Abrir Ticket GLPI Directo
                  </a>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <footer className="h-16 border-t border-slate-200 bg-white flex items-center justify-between px-12 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
          <span>Sistemas Online - Viva1A IPS</span>
        </div>
        <div className="flex gap-10 items-center">
          <span className="text-sky-600">Dev. Daniel Ruano</span>
          <span className="text-slate-300">© 2024</span>
        </div>
      </footer>

      {/* Acciones Inseguras Sub-links Modal */}
      <AnimatePresence>
        {showSubLinks && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSubLinks(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] z-10"
            >
              <div className="p-8 bg-gradient-to-r from-sky-50 to-blue-50 border-b border-slate-100 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-sky-500/10 text-sky-600 flex items-center justify-center shadow-inner">
                    <LinkIcon id="reporte_inseguro" category="Soporte" large />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest bg-sky-50 px-3 py-1 rounded-full border border-sky-100">Seguridad del Paciente</span>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase mt-1">Acciones Inseguras</h3>
                  </div>
                </div>
                <button
                  onClick={() => setShowSubLinks(false)}
                  className="p-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-600 shadow-sm border border-slate-100 transition-all active:scale-95"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-8 overflow-y-auto space-y-4 max-h-[60vh] custom-scrollbar">
                <p className="text-slate-500 text-sm font-medium mb-2 px-1">
                  Seleccione la herramienta ajustada de eventos adversos que desea abrir:
                </p>
                {REPORT_INSEGURO_SUBLINKS.map((sub, i) => (
                  <motion.a
                    key={sub.name}
                    href={sub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ x: 6, scale: 1.01 }}
                    className="flex items-center justify-between p-5 bg-slate-50 hover:bg-sky-50/50 rounded-2xl border border-slate-100 hover:border-sky-100 transition-all group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center border border-slate-100 shadow-sm group-hover:border-sky-200 transition-all shrink-0">
                        <span className="font-mono text-sm font-black text-slate-400 group-hover:text-sky-500 transition-colors">
                          0{i + 1}
                        </span>
                      </div>
                      <div className="flex-1 pr-4">
                        <h4 className="text-base font-bold text-slate-800 group-hover:text-sky-600 transition-colors">
                          {sub.name}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium mt-0.5 leading-relaxed">
                          {sub.description}
                        </p>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-300 group-hover:bg-sky-500 group-hover:text-white border border-slate-100 shadow-sm transition-all transform group-hover:translate-x-0.5 shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                      </svg>
                    </div>
                  </motion.a>
                ))}
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-center text-center">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <svg className="w-4 h-4 text-emerald-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622" />
                  </svg>
                  <span>Tu reporte ayuda a salvar vidas • Viva1A IPS</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helpers
const getCatBg = (cat: CategoryType) => {
  switch (cat) {
    case 'Asistenciales': return 'bg-sky-500';
    case 'Operativos': return 'bg-blue-500';
    case 'Capacitación': return 'bg-indigo-500';
    case 'Soporte': return 'bg-cyan-500';
    default: return 'bg-slate-400';
  }
};

const getCatIconBgClass = (cat: CategoryType) => {
  switch (cat) {
    case 'Asistenciales': return 'bg-sky-500/10 group-hover:bg-sky-500/25';
    case 'Operativos': return 'bg-blue-500/10 group-hover:bg-blue-500/25';
    case 'Capacitación': return 'bg-indigo-500/10 group-hover:bg-indigo-500/25';
    case 'Soporte': return 'bg-cyan-500/10 group-hover:bg-cyan-500/25';
    default: return 'bg-slate-500/10 group-hover:bg-slate-500/25';
  }
};

const getCatPillClass = (cat: CategoryType) => {
  switch (cat) {
    case 'Asistenciales': return 'bg-sky-500/10 text-sky-600 group-hover:bg-sky-500 group-hover:text-white';
    case 'Operativos': return 'bg-blue-500/10 text-blue-600 group-hover:bg-blue-500 group-hover:text-white';
    case 'Capacitación': return 'bg-indigo-500/10 text-indigo-600 group-hover:bg-indigo-500 group-hover:text-white';
    case 'Soporte': return 'bg-cyan-500/10 text-cyan-600 group-hover:bg-cyan-500 group-hover:text-white';
    default: return 'bg-slate-500/10 text-slate-600 group-hover:bg-slate-500 group-hover:text-white';
  }
};

const CategoryIcon = ({ type, active, large }: { type: CategoryType | 'Todos', active?: boolean, large?: boolean }) => {
  const size = large ? "w-6 h-6" : "w-4 h-4";
  
  const getIconColor = () => {
    if (active) return "text-white";
    switch (type) {
      case 'Asistenciales': return "text-sky-600";
      case 'Operativos': return "text-blue-600";
      case 'Capacitación': return "text-indigo-600";
      case 'Soporte': return "text-cyan-600";
      case 'Todos': return "text-sky-600";
      default: return "text-slate-500";
    }
  };

  const color = getIconColor();
  switch (type) {
    case 'Todos': return <svg className={`${size} ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>;
    case 'Asistenciales': return <svg className={`${size} ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
    case 'Operativos': return <svg className={`${size} ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>;
    case 'Capacitación': return <svg className={`${size} ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.168.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.168.477-4.5 1.253" /></svg>;
    case 'Soporte': return <svg className={`${size} ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
    default: return null;
  }
};

const LinkIcon = ({ id, category, large }: { id: string; category: CategoryType; large?: boolean }) => {
  const size = large ? "w-8 h-8" : "w-5 h-5";
  
  const getIconColor = () => {
    switch (category) {
      case 'Asistenciales': return "text-sky-500 group-hover:text-sky-600";
      case 'Operativos': return "text-blue-500 group-hover:text-blue-600";
      case 'Capacitación': return "text-indigo-500 group-hover:text-indigo-600";
      case 'Soporte': return "text-cyan-500 group-hover:text-cyan-600";
      default: return "text-slate-500";
    }
  };

  const color = getIconColor();
  const className = `${size} ${color} transition-colors duration-300`;

  switch (id) {
    case 'ipsa':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16M9 11h6m-3-3v6" />
        </svg>
      );
    case 'agenda_web':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 12v3l2 2" />
        </svg>
      );
    case 'everest_3':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21l9-14 9 14" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 15h2l1-2 1.5 4 1-2.5h2" />
        </svg>
      );
    case 'firmar_consentimiento':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      );
    case 'solicitar_consentimiento':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      );
    case 'pana':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622" />
        </svg>
      );
    case 'digiturno':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5h14a2 2 0 012 2v3a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2zm0 10h14a2 2 0 012 2v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a2 2 0 012-2z" />
        </svg>
      );
    case 'cita_al_dia':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 13l2 2 4-4" />
        </svg>
      );
    case 'mipres':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11v4M10 13h4" />
        </svg>
      );
    case 'fichas':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0118 7.086V19a2 2 0 01-2 2z" />
        </svg>
      );
    case 'lumier':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16a4 4 0 018-8M8 8a4 4 0 018 8m-4-8v8m-4-4h8" />
        </svg>
      );
    case 'annarlytics':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 11.172V5L8 4z" />
        </svg>
      );
    case 'athenea':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998L12 14z" />
        </svg>
      );
    case 'agenda_lab':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          <circle cx="12" cy="14" r="2" strokeWidth="2" />
        </svg>
      );
    case 'glpi':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 7v3" />
        </svg>
      );
    case 'viva_aprendiendo':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.168.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3l8 4.5-8 4.5L4 7.5 12 3z" />
        </svg>
      );
    case 'mi_portal':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="16" rx="2" strokeWidth="2" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12" />
        </svg>
      );
    case 'poblacion_utp':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857" />
          <circle cx="12" cy="7" r="3" strokeWidth="2" />
        </svg>
      );
    case 'contingencia':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    case 'reporte_inseguro':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
        </svg>
      );
    case 'desistimiento':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11l4 4m0-4l-4 4" />
        </svg>
      );
    case 'inst_athenea':
    case 'inst_generales':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13" />
        </svg>
      );
    case 'historias_extramural':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <circle cx="12" cy="11" r="3" strokeWidth="2" />
        </svg>
      );
    default:
      return <CategoryIcon type={category} large={large} />;
  }
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);