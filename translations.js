const TRANSLATIONS = {
  es: {
    // Header
    tagline: "From Fieldwork to Project",
    title: "Sampling Map",
    subtitle: "Registra estrellas de mar y otras unidades con ubicación, profundidad, temperatura del agua y tipo de sustrato.",
    exportJSON: "Exportar JSON",
    exportCSV: "Exportar CSV",
    
    // Sampling day section
    samplingDay: "Día de muestreo",
    units: "unidades",
    unit: "unidad",
    date: "Fecha",
    today: "Hoy",
    helpText1: "Cada día se guarda y se muestra por separado para evitar confundir muestras de sesiones distintas.",
    
    // Location section
    location: "Ubicación",
    notSet: "Sin fijar",
    useMyLocation: "Usar mi ubicación",
    useMapCenter: "Usar centro del mapa",
    samplingRadius: "Radio de muestreo",
    clickMapOrGPS: "Toca el mapa o usa GPS para fijar una ubicación.",
    
    // Register unit section
    registerUnit: "Registrar unidad",
    newEntry: "Nueva entrada",
    animal: "Animal / especie",
    animalPlaceholder: "Ej. Asterias rubens",
    depth: "Profundidad (m)",
    depthPlaceholder: "Ej. 2.4",
    temperature: "Temperatura agua (°C)",
    temperaturePlaceholder: "Ej. 18.5",
    zone: "Zona",
    selectZone: "Selecciona una zona",
    zoneStones: "Piedras",
    zoneSand: "Arena",
    zoneMixed: "Mixto",
    zoneSeaweed: "Algas",
    zonePosidon: "Posidonia",
    notes: "Notas",
    notesPlaceholder: "Observaciones del hallazgo",
    noPointSelected: "Sin punto seleccionado.",
    saveUnit: "Guardar unidad",
    
    // Units list section
    unitsOfDay: "Unidades del día",
    clickForDetails: "Clic para ver detalles",
    noUnitsYet: "Aún no hay unidades registradas para {date}. Usa el mapa para marcar el primer hallazgo.",
    noAdditionalNotes: "Sin notas adicionales.",
    
    // Record details
    recordZone: "Zona:",
    recordDepth: "Profundidad:",
    recordTemp: "Temperatura:",
    recordNotes: "Notas:",
    focusMap: "Centrar en mapa",
    delete: "Eliminar",
    
    // Map overlay
    quickTip: "Consejo rápido",
    mapTipText: "Pulsa en el mapa para fijar una posición, luego guarda la unidad.",
    
    // Status messages
    pointSelected: "Punto seleccionado: {coords}.",
    activeCoordsRadius: "Coordenadas activas: {coords}. Radio: {radius} m.",
    ready: "Lista",
    savedAt: "Guardado en {coords}.",
    
    // Alerts and confirmations
    noGeolocation: "Tu navegador no soporta geolocalización.",
    locationError: "No se pudo obtener la ubicación. Toca el mapa para fijar un punto manualmente.",
    selectLocationFirst: "Primero selecciona un punto en el mapa o usa tu ubicación.",
    completeFields: "Completa especie, profundidad, temperatura y zona.",
    leafletError: "Leaflet no se ha cargado. Revisa la conexión a internet y recarga la página.",
    confirmDelete: 'Eliminar la unidad "{species}" del día {date}?',
  },
  en: {
    // Header
    tagline: "From Fieldwork to Project",
    title: "Sampling Map",
    subtitle: "Record starfish and other units with location, depth, water temperature and substrate type.",
    exportJSON: "Export JSON",
    exportCSV: "Export CSV",
    
    // Sampling day section
    samplingDay: "Sampling Day",
    units: "units",
    unit: "unit",
    date: "Date",
    today: "Today",
    helpText1: "Each day is saved and displayed separately to avoid confusing samples from different sessions.",
    
    // Location section
    location: "Location",
    notSet: "Not set",
    useMyLocation: "Use my location",
    useMapCenter: "Use map center",
    samplingRadius: "Sampling Radius",
    clickMapOrGPS: "Click on the map or use GPS to set a location.",
    
    // Register unit section
    registerUnit: "Register Unit",
    newEntry: "New entry",
    animal: "Animal / species",
    animalPlaceholder: "E.g. Asterias rubens",
    depth: "Depth (m)",
    depthPlaceholder: "E.g. 2.4",
    temperature: "Water Temperature (°C)",
    temperaturePlaceholder: "E.g. 18.5",
    zone: "Zone",
    selectZone: "Select a zone",
    zoneStones: "Stones",
    zoneSand: "Sand",
    zoneMixed: "Mixed",
    zoneSeaweed: "Seaweed",
    zonePosidon: "Posidonia",
    notes: "Notes",
    notesPlaceholder: "Observations of the find",
    noPointSelected: "No point selected.",
    saveUnit: "Save Unit",
    
    // Units list section
    unitsOfDay: "Units of Day",
    clickForDetails: "Click for details",
    noUnitsYet: "No units recorded yet for {date}. Use the map to mark the first find.",
    noAdditionalNotes: "No additional notes.",
    
    // Record details
    recordZone: "Zone:",
    recordDepth: "Depth:",
    recordTemp: "Temperature:",
    recordNotes: "Notes:",
    focusMap: "Center on map",
    delete: "Delete",
    
    // Map overlay
    quickTip: "Quick Tip",
    mapTipText: "Click on the map to set a position, then save the unit.",
    
    // Status messages
    pointSelected: "Point selected: {coords}.",
    activeCoordsRadius: "Active coordinates: {coords}. Radius: {radius} m.",
    ready: "Ready",
    savedAt: "Saved at {coords}.",
    
    // Alerts and confirmations
    noGeolocation: "Your browser does not support geolocation.",
    locationError: "Could not get location. Click on the map to set a point manually.",
    selectLocationFirst: "First select a point on the map or use your location.",
    completeFields: "Complete species, depth, temperature and zone.",
    leafletError: "Leaflet has not loaded. Check your internet connection and reload the page.",
    confirmDelete: 'Delete the unit "{species}" from {date}?',
  },
  ca: {
    // Header
    tagline: "From Fieldwork to Project",
    title: "Sampling Map",
    subtitle: "Registra estrella de mar i altres unitats amb ubicació, profunditat, temperatura de l'aigua i tipus de substrat.",
    exportJSON: "Exportar JSON",
    exportCSV: "Exportar CSV",
    
    // Sampling day section
    samplingDay: "Dia de mostratge",
    units: "unitats",
    unit: "unitat",
    date: "Data",
    today: "Avui",
    helpText1: "Cada dia es guarda i es mostra per separat per evitar confondre mostres de sessions diferents.",
    
    // Location section
    location: "Ubicació",
    notSet: "Sense fixar",
    useMyLocation: "Utilitzar la meva ubicació",
    useMapCenter: "Utilitzar centre del mapa",
    samplingRadius: "Radi de mostratge",
    clickMapOrGPS: "Toca el mapa o utilitza GPS per fixar una ubicació.",
    
    // Register unit section
    registerUnit: "Registrar unitat",
    newEntry: "Entrada nova",
    animal: "Animal / espècie",
    animalPlaceholder: "Ex. Asterias rubens",
    depth: "Profunditat (m)",
    depthPlaceholder: "Ex. 2,4",
    temperature: "Temperatura de l'aigua (°C)",
    temperaturePlaceholder: "Ex. 18,5",
    zone: "Zona",
    selectZone: "Selecciona una zona",
    zoneStones: "Pedres",
    zoneSand: "Sorra",
    zoneMixed: "Mixt",
    zoneSeaweed: "Algues",
    zonePosidon: "Posidònia",
    notes: "Anotacions",
    notesPlaceholder: "Observacions del descobriment",
    noPointSelected: "Sense punt seleccionat.",
    saveUnit: "Guardar unitat",
    
    // Units list section
    unitsOfDay: "Unitats del dia",
    clickForDetails: "Clic per a veure detalls",
    noUnitsYet: "Encara no hi ha unitats registrades per a {date}. Utilitza el mapa per marcar el primer descobriment.",
    noAdditionalNotes: "Sense anotacions addicionals.",
    
    // Record details
    recordZone: "Zona:",
    recordDepth: "Profunditat:",
    recordTemp: "Temperatura:",
    recordNotes: "Anotacions:",
    focusMap: "Centrar en mapa",
    delete: "Eliminar",
    
    // Map overlay
    quickTip: "Consell ràpid",
    mapTipText: "Toca el mapa per fixar una posició, després guarda la unitat.",
    
    // Status messages
    pointSelected: "Punt seleccionat: {coords}.",
    activeCoordsRadius: "Coordenades actives: {coords}. Radi: {radius} m.",
    ready: "Llista",
    savedAt: "Guardat a {coords}.",
    
    // Alerts and confirmations
    noGeolocation: "El teu navegador no admet geolocalització.",
    locationError: "No s'ha pogut obtenir la ubicació. Toca el mapa per fixar un punt manualment.",
    selectLocationFirst: "Primer selecciona un punt en el mapa o utilitza la teva ubicació.",
    completeFields: "Completa l'espècie, profunditat, temperatura i zona.",
    leafletError: "Leaflet no s'ha carregat. Comprova la connexió a Internet i recarrega la pàgina.",
    confirmDelete: 'Eliminar la unitat "{species}" del dia {date}?',
  }
};

let currentLanguage = localStorage.getItem('sampling-map-language') || 'es';

function t(key, replacements = {}) {
  const translation = TRANSLATIONS[currentLanguage]?.[key] || TRANSLATIONS['es']?.[key] || key;
  let result = translation;
  
  for (const [placeholder, value] of Object.entries(replacements)) {
    result = result.replace(`{${placeholder}}`, value);
  }
  
  return result;
}

function setLanguage(lang) {
  if (lang in TRANSLATIONS) {
    currentLanguage = lang;
    localStorage.setItem('sampling-map-language', lang);
    return true;
  }
  return false;
}

function getLanguage() {
  return currentLanguage;
}
