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
  { id: 'soma', name: 'SOMA', url: 'https://centralaplicaciones.sos.com.co/ValidadorWeb2/Logueo/login.jsf', category: 'Asistenciales', description: 'Validador web de aplicaciones SOS y consulta de datos.', keywords: ['soma', 'sos', 'validador', 'central aplicaciones'] },
  { id: 'firmar_consentimiento', name: 'FIRMAR CONSENTIMIENTO', url: 'https://cloud.tg6.everestintelligent.com.co/viva/cisign-paciente/', category: 'Asistenciales', description: 'Firmar consentimiento del paciente en la plataforma de firmas.', keywords: ['firma', 'consentimiento', 'paciente', 'everest'] },
  { id: 'solicitar_consentimiento', name: 'SOLICITAR CONSENTIMIENTO', url: 'https://cloud.tg6.everestintelligent.com.co/viva/cisign/', category: 'Asistenciales', description: 'Solicitud de consentimientos informados en la plataforma.', keywords: ['consentimiento', 'solicitar', 'firma', 'everest'] },
  { id: 'pana', name: 'NUEVA EPS CONTRIBUTIVO', url: 'https://neps.everestintelligent.com/viva/EverHealth/auth/login', category: 'Asistenciales', description: 'Sistema de gestión Nueva EPS.', keywords: ['nueva eps', 'afiliados'] },
  { id: 'mipres', name: 'MIPRES', url: 'https://mipres.sispro.gov.co/MIPRESNOPBS/Login.aspx?ReturnUrl=%2fMIPRESNOPBS', category: 'Asistenciales', description: 'Prescripción de servicios y tecnologías no PBS.', keywords: ['medicamentos', 'no pbs', 'formular', 'sispro'] },
  { id: 'fichas', name: 'FICHAS EPIDEMIOLÓGICAS', url: 'https://drive.google.com/drive/folders/1DHFZPwH_ZaG5NUTu0NmPYtfmV3ZZTybv?usp=share_link', category: 'Soporte', description: 'Formatos para reporte de eventos en salud pública.', keywords: ['sivigila', 'notificacion', 'epidemiologia'] },
  { id: 'lumier', name: 'LUMIER', url: 'https://lumierdigital.com:8443/login.lu', category: 'Asistenciales', description: 'Visualizador de imágenes diagnósticas y rayos X.', keywords: ['rx', 'rayos x', 'imagenes', 'radiologia'] },
  { id: 'annarlytics', name: 'ANNARLYTICS', url: 'http://datacare.viva1a.com.co/datacare/#nbb', category: 'Asistenciales', description: 'Resultados de laboratorio clínico centralizado.', keywords: ['laboratorio', 'examenes', 'sangre', 'resultados'] },
  { id: 'athenea', name: 'ATHENEA', url: 'https://medicosviva1a.atheneasoluciones.com/', category: 'Asistenciales', description: 'Sistema alterno de resultados médicos.', keywords: ['resultados', 'consulta'] },
  { id: 'agenda_lab', name: 'AGENDA LABORATORIOS', url: 'https://appcita.viva1a.com.co:8051/laboratorio/agente', category: 'Operativos', description: 'Programación de citas para toma de muestras.', keywords: ['citas', 'agenda', 'muestras'] },
  { id: 'glpi', name: 'MESA DE SERVICIO (GLPI)', url: 'https://orbit.csc1a.com/glpi/index.php?noAUTO=1', category: 'Soporte', description: 'Nueva plataforma CSC. Reporte de fallas técnicas y soporte IT.', keywords: ['soporte', 'glpi', 'csc', 'mesa de servicio', 'ticket', 'cra80'] },
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

const GlpiInstructivoModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [copiedUser, setCopiedUser] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  const copyText = (text: string, isUser: boolean) => {
    navigator.clipboard.writeText(text);
    if (isUser) {
      setCopiedUser(true);
      setTimeout(() => setCopiedUser(false), 2000);
    } else {
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-md"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] z-10"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white border-b border-indigo-900/50 flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 text-sky-400 flex items-center justify-center text-2xl shadow-inner border border-white/10 shrink-0">
              🖥️
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black text-sky-300 uppercase tracking-widest bg-sky-500/20 px-2.5 py-0.5 rounded-full border border-sky-400/30">
                  Nueva Plataforma CSC
                </span>
                <span className="text-[10px] font-mono text-slate-300">GLPI</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase mt-1 heading-font">
                Instructivo Mesa de Servicio
              </h3>
              <p className="text-xs text-slate-300 font-semibold">
                Guía paso a paso para radicar tickets y novedades técnicas en Carrera 80
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white shadow-sm border border-white/10 transition-all active:scale-95 shrink-0"
            title="Cerrar instructivo"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 custom-scrollbar text-slate-800">
          
          {/* Quick Access Credentials Banner */}
          <div className="bg-gradient-to-br from-indigo-50 to-sky-50 rounded-2xl p-4 border border-indigo-100/80 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700">Acceso Directo</span>
                <h4 className="text-sm font-black text-slate-800 uppercase">Credenciales Institucionales</h4>
              </div>
              <a
                href="https://orbit.csc1a.com/glpi/index.php?noAUTO=1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-all active:scale-95"
              >
                <span>Abrir Plataforma GLPI</span>
                <svg className="w-3.5 h-3.5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Usuario */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Usuario</span>
                  <span className="font-mono font-bold text-slate-800 text-sm">medicos.cra80</span>
                </div>
                <button
                  onClick={() => copyText('medicos.cra80', true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    copiedUser ? 'bg-emerald-500 text-white' : 'bg-slate-100 hover:bg-indigo-100 text-indigo-700'
                  }`}
                >
                  {copiedUser ? '¡Copiado!' : 'Copiar'}
                </button>
              </div>

              {/* Contraseña */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Contraseña</span>
                  <span className="font-mono font-bold text-slate-800 text-sm">VIVA2026</span>
                </div>
                <button
                  onClick={() => copyText('VIVA2026', false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    copiedPass ? 'bg-emerald-500 text-white' : 'bg-slate-100 hover:bg-indigo-100 text-indigo-700'
                  }`}
                >
                  {copiedPass ? '¡Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>
          </div>

          {/* Pasos de radicación */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Pasos para Radicar un Caso
            </h4>

            {/* Paso 1 */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                1
              </div>
              <div className="space-y-1 flex-1">
                <h5 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                  Ingreso a la mesa de servicio
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Accede al enlace institucional (<span className="text-indigo-600 font-mono font-bold">https://orbit.csc1a.com/glpi/index.php?noAUTO=1</span>) y escribe tu usuario <strong className="font-mono text-slate-800">medicos.cra80</strong> y contraseña <strong className="font-mono text-slate-800">VIVA2026</strong>.
                </p>
              </div>
            </div>

            {/* Paso 2 */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                2
              </div>
              <div className="space-y-1 flex-1">
                <h5 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                  Crear el caso
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  En el menú superior de la plataforma GLPI, haz clic en el botón <strong className="text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded font-bold">+ Agregar</strong> para abrir el formulario de radicación de caso nuevo.
                </p>
              </div>
            </div>

            {/* Paso 3 */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                3
              </div>
              <div className="space-y-2.5 flex-1">
                <h5 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                  Diligenciar el formulario del caso
                </h5>
                <p className="text-xs text-slate-600 font-medium">
                  Completa cada uno de los campos siguiendo estos lineamientos:
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="font-bold text-indigo-700 block mb-0.5">a) Título:</span>
                    <span className="text-slate-600">Nombre corto que resuma la novedad o fallo presentado.</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="font-bold text-indigo-700 block mb-0.5">b) Descripción:</span>
                    <span className="text-slate-600">Explica detalladamente qué sucedió y en qué área o servicio se presenta.</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="font-bold text-indigo-700 block mb-0.5">c) Entidad:</span>
                    <span className="text-slate-600">Ya viene seleccionada como <strong className="font-semibold text-slate-800">"TECNOLOGIA"</strong> por defecto (no es necesario cambiarla).</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="font-bold text-indigo-700 block mb-0.5">e) Localización:</span>
                    <span className="text-slate-600">Escribe <strong className="bg-amber-100 text-amber-900 px-1 rounded font-bold">"80"</strong> en el buscador y selecciona estrictamente <strong className="text-emerald-700 font-bold">CARRERA 80</strong>.</span>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="font-bold text-indigo-700 text-xs block mb-1">d) Categoría:</span>
                  <p className="text-xs text-slate-600 mb-2">
                    Escribe <strong className="bg-indigo-100 text-indigo-900 px-1 rounded font-bold">"soporte"</strong>. El sistema desplegará 5 opciones bajo <em>Soporte Técnico</em>. Selecciona la correspondiente:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] font-medium text-slate-700">
                    <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                      ⚙️ Configuración De Equipo
                    </span>
                    <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                      💻 Instalación De Software
                    </span>
                    <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                      🔧 Mantenimiento Correctivo
                    </span>
                    <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                      🛡️ Mantenimiento Preventivo
                    </span>
                    <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-100 sm:col-span-2">
                      🔑 Problema De Acceso
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Paso 4 */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                4
              </div>
              <div className="space-y-1 flex-1">
                <h5 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                  Finalizar y radicar
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Verifica que Entidad, Categoría y Localización estén debidamente diligenciados y haz clic en el botón amarillo <strong className="bg-amber-400 text-slate-900 px-2 py-0.5 rounded font-bold">+ Agregar</strong> para radicar el caso.
                </p>
                <div className="mt-2 p-2 bg-emerald-50 text-emerald-800 text-xs rounded-lg border border-emerald-200 font-medium flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Si el proceso fue exitoso, el caso quedará visible en la sección <strong>"Tickets"</strong> del menú superior.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Soporte Oficial Viva1A IPS • CRA 80
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-colors"
            >
              Cerrar
            </button>
            <a
              href="https://orbit.csc1a.com/glpi/index.php?noAUTO=1"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider shadow-md transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Ir a Mesa de Servicio</span>
              <svg className="w-3.5 h-3.5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const App = () => {
  const [showSubLinks, setShowSubLinks] = useState(false);
  const [showGlpiGuide, setShowGlpiGuide] = useState(false);
  const [activeTab, setActiveTab] = useState<'links' | 'credentials' | 'support'>('links');

  const displayedLinks = useMemo(() => {
    // Exclude historias_extramural from the grid because it has a dedicated top hero card
    return MEDICAL_LINKS.filter(l => l.id !== 'historias_extramural');
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-50 rounded-full blur-[120px] opacity-45 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] bg-sky-50 rounded-full blur-[100px] opacity-35"></div>
      </div>

      <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-4 py-2.5 shadow-sm">
        <div className="max-w-[1900px] mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-lg flex items-center justify-center text-white shadow-sm"
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

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowGlpiGuide(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-wider rounded-xl border border-indigo-200 shadow-sm transition-all active:scale-95"
            >
              <span>📋 Instructivo GLPI</span>
            </button>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full text-[9px] font-black text-emerald-600 uppercase tracking-widest border border-emerald-100">
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
                {/* Banners Destacados para Extramural */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                  {/* Banner 1: Formato Historias Extramural */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-700 p-5 md:p-6 rounded-2xl shadow-md relative text-white group flex flex-col justify-between"
                  >
                    <div className="absolute top-0 right-0 w-60 h-60 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-xl pointer-events-none"></div>

                    <div className="relative z-10 space-y-2 mb-4">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10">
                        <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse shadow-sm"></span>
                        FORMATOS EN CAMPO
                      </div>
                      <h3 className="text-lg md:text-xl font-black heading-font tracking-tight uppercase">
                        Formato Historias Extramural
                      </h3>
                      <p className="text-white/90 text-xs font-semibold leading-relaxed">
                        Carpeta oficial con plantillas y formatos para diligenciamiento de historias clínicas en campo desde tu tablet.
                      </p>
                    </div>

                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      href="https://drive.google.com/drive/folders/16MD1-slKi22meenPeQNiSlo7_2I5ZtPP?usp=sharing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative z-10 bg-white hover:bg-emerald-50 text-emerald-800 font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow-md flex items-center justify-center gap-2 self-start transition-all"
                    >
                      <span>Abrir Formatos Drive</span>
                      <svg className="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </motion.a>
                  </motion.div>

                  {/* Banner 2: Mesa de Servicio CSC (GLPI) con Instructivo */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-5 md:p-6 rounded-2xl shadow-md relative text-white group flex flex-col justify-between border border-indigo-800/40"
                  >
                    <div className="absolute top-0 right-0 w-60 h-60 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-sky-500/10 rounded-full blur-xl pointer-events-none"></div>

                    <div className="relative z-10 space-y-2 mb-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/30 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest text-sky-300 border border-indigo-400/30">
                          <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse shadow-sm"></span>
                          PLATAFORMA CSC
                        </span>
                        <span className="text-[10px] font-mono text-slate-300">medicos.cra80 / VIVA2026</span>
                      </div>
                      <h3 className="text-lg md:text-xl font-black heading-font tracking-tight uppercase text-white">
                        Mesa de Servicio (GLPI)
                      </h3>
                      <p className="text-slate-300 text-xs font-semibold leading-relaxed">
                        Radica tickets técnicos, reportes de sistema, o solicitudes de soporte con asignación automática a <strong className="text-sky-300">CARRERA 80</strong>.
                      </p>
                    </div>

                    <div className="relative z-10 flex flex-wrap gap-2 pt-1">
                      <motion.a
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        href="https://orbit.csc1a.com/glpi/index.php?noAUTO=1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider px-4 py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
                      >
                        <span>Abrir Mesa GLPI</span>
                        <svg className="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                      </motion.a>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => setShowGlpiGuide(true)}
                        className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider px-4 py-3 rounded-xl border border-white/20 flex items-center justify-center gap-1.5 transition-all shadow-sm"
                      >
                        <span>📖 Ver Instructivo</span>
                      </motion.button>
                    </div>
                  </motion.div>
                </div>

                {/* Subtitle for work links */}
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black text-slate-800 uppercase heading-font tracking-tight">
                      Enlaces de <span className="text-emerald-600">Trabajo</span>
                    </h3>
                    <p className="text-xs text-slate-500 font-bold">Toca cualquier acceso para redirigirte a la plataforma correspondiente.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowGlpiGuide(true)}
                    className="text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-200 transition-colors hidden sm:flex items-center gap-1.5"
                  >
                    <span>📖 Guía Mesa de Servicio</span>
                  </button>
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
                          const isGlpi = link.id === 'glpi';
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
                              className={`group relative overflow-hidden bg-white border p-4 md:p-5 rounded-[1.25rem] shadow-sm flex flex-col min-h-[170px] cursor-pointer transition-all ${
                                isGlpi ? 'border-indigo-300 ring-1 ring-indigo-200 hover:border-indigo-400' : 'border-slate-200 hover:border-emerald-200'
                              }`}
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
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <h4 className={`text-xs md:text-sm font-black tracking-tight uppercase transition-colors line-clamp-2 ${
                                    isGlpi ? 'text-indigo-900 group-hover:text-indigo-600' : 'text-slate-800 group-hover:text-emerald-600'
                                  }`}>
                                    {link.name}
                                  </h4>
                                  {isGlpi && (
                                    <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 text-[8px] font-black uppercase rounded border border-indigo-200">
                                      CSC
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] md:text-xs text-slate-500 leading-relaxed font-semibold line-clamp-3">{link.description}</p>
                              </div>

                              {isGlpi && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setShowGlpiGuide(true);
                                  }}
                                  className="mt-2.5 mb-1 text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 hover:bg-indigo-100 py-1.5 px-2 rounded-lg border border-indigo-200 flex items-center justify-center gap-1 w-full transition-colors"
                                >
                                  <span>📖 Instructivo</span>
                                </button>
                              )}

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
                      <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 font-semibold text-sm">No hay enlaces disponibles en este momento.</p>
                      </div>
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
                    { 
                      name: 'MESA DE SERVICIO (CSC - GLPI)', 
                      user: 'medicos.cra80', 
                      pass: 'VIVA2026', 
                      icon: '🖥️', 
                      color: 'from-indigo-600 to-blue-800',
                      url: 'https://orbit.csc1a.com/glpi/index.php?noAUTO=1',
                      isGlpi: true 
                    },
                    { name: 'ATHENEA', user: 'CONSULTAMED', pass: 'Viva1a*md04', icon: '📋', color: 'from-emerald-500 to-sky-700' },
                    { name: 'ANNARLYTICS', user: 'CONSULTA', pass: '123456', icon: '🧪', color: 'from-teal-600 to-indigo-700' },
                    { name: 'LUMIER', user: 'PREMIUM', pass: '123456', icon: '🩻', color: 'from-slate-600 to-slate-800' }
                  ].map(cred => (
                    <div key={cred.name} className="relative overflow-hidden bg-white rounded-[1.5rem] p-5 md:p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                      <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${cred.color}`}></div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl filter grayscale group-hover:grayscale-0 transition-all">{cred.icon}</span>
                          <span className="text-base font-black text-slate-800 tracking-tight uppercase">{cred.name}</span>
                        </div>
                        {cred.isGlpi && (
                          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[9px] font-black uppercase rounded-md border border-indigo-100">
                            NUEVA CLAVE
                          </span>
                        )}
                      </div>
                      <div className="space-y-3">
                        <CredentialItem label="Usuario" value={cred.user} />
                        <CredentialItem label="Contraseña" value={cred.pass} />
                      </div>
                      {cred.isGlpi && (
                        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                          <a
                            href={cred.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 min-w-[120px] bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-3 rounded-xl text-center shadow-sm transition-colors flex items-center justify-center gap-1.5"
                          >
                            <span>Abrir Plataforma</span>
                            <svg className="w-3 h-3 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                          </a>
                          <button
                            type="button"
                            onClick={() => setShowGlpiGuide(true)}
                            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                          >
                            📖 Instructivo
                          </button>
                        </div>
                      )}
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

                  <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
                    <a
                      href="https://orbit.csc1a.com/glpi/index.php?noAUTO=1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/80 hover:text-white font-black text-xs uppercase tracking-[0.15em] transition-colors underline"
                    >
                      Abrir Plataforma GLPI CSC
                    </a>
                    <span className="text-white/40 hidden sm:inline">•</span>
                    <button
                      type="button"
                      onClick={() => setShowGlpiGuide(true)}
                      className="text-white/80 hover:text-white font-black text-xs uppercase tracking-[0.15em] transition-colors underline"
                    >
                      Ver Instructivo Radicación
                    </button>
                  </div>
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

      {/* Mesa de Servicio (GLPI CSC) Instructivo Modal */}
      <AnimatePresence>
        {showGlpiGuide && (
          <GlpiInstructivoModal
            isOpen={showGlpiGuide}
            onClose={() => setShowGlpiGuide(false)}
          />
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
    case 'soma':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
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