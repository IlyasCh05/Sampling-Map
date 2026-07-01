const STORAGE_KEY = "sampling-map-local-data-v1";
const DEFAULT_DATE = new Date().toISOString().slice(0, 10);
const DEFAULT_CENTER = [37.3891, -5.9845];

const state = {
  records: loadRecords(),
  selectedDate: DEFAULT_DATE,
  radiusMeters: 50,
  draftLatLng: null,
  map: null,
  draftMarker: null,
  selectedRecordMarker: null,
  recordLayer: null,
  radiusCircle: null,
  markersById: new Map(),
};

let dom = {};

function initDOM() {
  dom = {
    // Headers and labels
    tagline: document.getElementById("tagline"),
    title: document.getElementById("title"),
    subtitle: document.getElementById("subtitle"),
    
    // Buttons
    exportJsonBtn: document.getElementById("exportJsonBtn"),
    exportCsvBtn: document.getElementById("exportCsvBtn"),
    todayBtn: document.getElementById("todayBtn"),
    locateBtn: document.getElementById("locateBtn"),
    useCenterBtn: document.getElementById("useCenterBtn"),
    
    // Map and sliders
    map: document.getElementById("map"),
    datePicker: document.getElementById("datePicker"),
    radiusSlider: document.getElementById("radiusSlider"),
    radiusValue: document.getElementById("radiusValue"),
    
    // Display text
    recordsCountBadge: document.getElementById("recordsCountBadge"),
    coordsPreview: document.getElementById("coordsPreview"),
    draftState: document.getElementById("draftState"),
    locationStatus: document.getElementById("locationStatus"),
    recordsList: document.getElementById("recordsList"),
    
    // Form inputs
    samplingForm: document.getElementById("samplingForm"),
    speciesInput: document.getElementById("speciesInput"),
    depthInput: document.getElementById("depthInput"),
    tempInput: document.getElementById("tempInput"),
    zoneInput: document.getElementById("zoneInput"),
    notesInput: document.getElementById("notesInput"),
  };
}

function loadRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveRecords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.records));
}

function todayLabel(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  const locale = getLanguage() === 'es' ? 'es-ES' : getLanguage() === 'ca' ? 'ca-ES' : 'en-US';
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatCoords(lat, lng) {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

function getSelectedRecords() {
  return state.records
    .filter((record) => record.date === state.selectedDate)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function initMap() {
  state.map = L.map("map", { zoomControl: true }).setView(DEFAULT_CENTER, 10);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 20,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(state.map);

  state.recordLayer = L.layerGroup().addTo(state.map);
  state.radiusCircle = L.circle(DEFAULT_CENTER, {
    radius: state.radiusMeters,
    color: "#5eead4",
    fillColor: "#5eead4",
    fillOpacity: 0.12,
    weight: 2,
  }).addTo(state.map);

  state.map.on("click", (event) => {
    setDraftLocation(event.latlng.lat, event.latlng.lng, true);
  });
}

function setDraftLocation(lat, lng, moveMap = false) {
  state.draftLatLng = { lat, lng };

  if (!state.draftMarker) {
    state.draftMarker = L.marker([lat, lng], {
      draggable: true,
      title: "Punto de muestreo activo",
      icon: L.divIcon({
        className: "draft-marker",
        html: '<div style="width:18px;height:18px;border-radius:999px;background:#5eead4;border:3px solid #072129;box-shadow:0 0 0 6px rgba(94,234,212,.18);"></div>',
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      }),
    }).addTo(state.map);

    state.draftMarker.on("dragend", (event) => {
      const position = event.target.getLatLng();
      setDraftLocation(position.lat, position.lng, false);
    });
  } else {
    state.draftMarker.setLatLng([lat, lng]);
  }

  state.radiusCircle.setLatLng([lat, lng]);
  state.radiusCircle.setRadius(state.radiusMeters);

  if (moveMap) {
    state.map.setView([lat, lng], Math.max(state.map.getZoom(), 16), { animate: true });
  }

  updateDraftUI();
}

function updateDraftUI() {
  if (!state.draftLatLng) {
    dom.draftState.textContent = t('noPointSelected');
    dom.coordsPreview.textContent = t('clickMapOrGPS');
    dom.locationStatus.textContent = t('notSet');
    dom.locationStatus.className = "pill neutral";
    return;
  }

  const { lat, lng } = state.draftLatLng;
  dom.draftState.textContent = t('pointSelected', { coords: formatCoords(lat, lng) });
  dom.coordsPreview.textContent = t('activeCoordsRadius', { coords: formatCoords(lat, lng), radius: state.radiusMeters });
  dom.locationStatus.textContent = t('ready');
  dom.locationStatus.className = "pill accent";
}

function renderRadius() {
  dom.radiusValue.textContent = `${state.radiusMeters} m`;
  if (state.radiusCircle && state.draftLatLng) {
    state.radiusCircle.setRadius(state.radiusMeters);
  }
}

function clearMarkerLayer() {
  state.recordLayer.clearLayers();
  state.markersById.clear();
}

function renderRecords() {
  const records = getSelectedRecords();
  const unitCount = records.length;
  const unitLabel = unitCount === 1 ? t('unit') : t('units');
  dom.recordsCountBadge.textContent = `${unitCount} ${unitLabel}`;

  clearMarkerLayer();

  if (!records.length) {
    dom.recordsList.innerHTML = `
      <div class="empty-state">
        ${t('noUnitsYet', { date: todayLabel(state.selectedDate) })}
      </div>
    `;
    return;
  }

  dom.recordsList.innerHTML = records
    .map((record) => {
      const notes = record.notes?.trim() ? record.notes : t('noAdditionalNotes');
      return `
        <details class="record" data-record-id="${record.id}">
          <summary>
            <div class="record-title">
              <strong>${escapeHtml(record.species)}</strong>
              <span class="tag ${record.zone === "Arena" ? "warm" : ""}">${escapeHtml(record.zone)}</span>
            </div>
            <div class="record-meta">${formatCoords(record.lat, record.lng)} · ${record.depth} m · ${record.waterTemp} °C</div>
          </summary>
          <div class="record-details">
            <div>${t('date')}: ${record.date}</div>
            <div>${t('recordZone')} ${escapeHtml(record.zone)}</div>
            <div>${t('recordDepth')} ${record.depth} m</div>
            <div>${t('recordTemp')} ${record.waterTemp} °C</div>
            <div>${t('location')}: ${formatCoords(record.lat, record.lng)}</div>
            <div>${t('recordNotes')} ${escapeHtml(notes)}</div>
            <div class="record-actions">
              <button type="button" class="secondary-button" data-action="focus-record" data-record-id="${record.id}">${t('focusMap')}</button>
              <button type="button" class="ghost-button" data-action="delete-record" data-record-id="${record.id}">${t('delete')}</button>
            </div>
          </div>
        </details>
      `;
    })
    .join("");

  records.forEach((record) => {
    const marker = L.marker([record.lat, record.lng], {
      title: record.species,
    }).addTo(state.recordLayer);

    marker.bindPopup(buildPopupHtml(record), {
      maxWidth: 280,
      closeButton: true,
    });

    marker.on("click", () => {
      state.selectedRecordMarker = marker;
    });

    state.markersById.set(record.id, marker);
  });
}

function buildPopupHtml(record) {
  return `
    <div class="popup-card">
      <h3>${escapeHtml(record.species)}</h3>
      <p><strong>${t('recordZone')}</strong> ${escapeHtml(record.zone)}</p>
      <p><strong>${t('recordDepth')}</strong> ${record.depth} m</p>
      <p><strong>${t('recordTemp')}</strong> ${record.waterTemp} °C</p>
      <p class="popup-coords">${formatCoords(record.lat, record.lng)}</p>
      ${record.notes ? `<p><strong>${t('recordNotes')}</strong> ${escapeHtml(record.notes)}</p>` : ""}
    </div>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function focusRecord(recordId) {
  const record = state.records.find((item) => item.id === recordId);
  if (!record) {
    return;
  }

  if (record.date !== state.selectedDate) {
    state.selectedDate = record.date;
    dom.datePicker.value = state.selectedDate;
  }

  renderRecords();

  const marker = state.markersById.get(record.id);
  if (marker) {
    state.map.setView([record.lat, record.lng], Math.max(state.map.getZoom(), 17), { animate: true });
    marker.openPopup();
  }
}

function deleteRecord(recordId) {
  const record = state.records.find((item) => item.id === recordId);
  if (!record) {
    return;
  }

  const confirmed = window.confirm(t('confirmDelete', { species: record.species, date: record.date }));
  if (!confirmed) {
    return;
  }

  state.records = state.records.filter((item) => item.id !== recordId);
  saveRecords();
  renderRecords();
}

function exportJson() {
  const payload = JSON.stringify(state.records, null, 2);
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `sampling-map-${state.selectedDate}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function escapeCsv(value) {
  const text = String(value ?? "");
  if (/[",\n\r;]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }

  return text;
}

function exportCsv() {
  const records = getSelectedRecords();
  const header = [
    "date",
    "species",
    "lat",
    "lng",
    "depth_m",
    "water_temp_c",
    "zone",
    "notes",
    "createdAt",
  ];

  const rows = records.map((record) => [
    record.date,
    record.species,
    record.lat,
    record.lng,
    record.depth,
    record.waterTemp,
    record.zone,
    record.notes || "",
    record.createdAt,
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map(escapeCsv).join(";"))
    .join("\n");

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `sampling-map-${state.selectedDate}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function setSelectedDate(dateString) {
  state.selectedDate = dateString;
  dom.datePicker.value = dateString;
  renderRecords();
}

function locateUser() {
  if (!navigator.geolocation) {
    window.alert(t('noGeolocation'));
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      setDraftLocation(latitude, longitude, true);
    },
    () => {
      window.alert(t('locationError'));
    },
    { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
  );
}

function useMapCenter() {
  const center = state.map.getCenter();
  setDraftLocation(center.lat, center.lng, false);
}

function handleFormSubmit(event) {
  event.preventDefault();

  if (!state.draftLatLng) {
    window.alert(t('selectLocationFirst'));
    return;
  }

  const species = dom.speciesInput.value.trim();
  const depth = Number(dom.depthInput.value);
  const waterTemp = Number(dom.tempInput.value);
  const zone = dom.zoneInput.value;
  const notes = dom.notesInput.value.trim();

  if (!species || !Number.isFinite(depth) || !Number.isFinite(waterTemp) || !zone) {
    window.alert(t('completeFields'));
    return;
  }

  const record = {
    id: crypto.randomUUID(),
    date: state.selectedDate,
    species,
    depth: Number(depth.toFixed(1)),
    waterTemp: Number(waterTemp.toFixed(1)),
    zone,
    notes,
    lat: Number(state.draftLatLng.lat.toFixed(6)),
    lng: Number(state.draftLatLng.lng.toFixed(6)),
    createdAt: new Date().toISOString(),
  };

  state.records.unshift(record);
  saveRecords();
  renderRecords();
  dom.samplingForm.reset();
  dom.speciesInput.value = t('animal');
  dom.zoneInput.value = "";
  dom.draftState.textContent = t('savedAt', { coords: formatCoords(record.lat, record.lng) });
}

function bindEvents() {
  dom.datePicker.value = state.selectedDate;
  dom.datePicker.addEventListener("change", (event) => setSelectedDate(event.target.value));
  dom.todayBtn.addEventListener("click", () => setSelectedDate(DEFAULT_DATE));
  dom.locateBtn.addEventListener("click", locateUser);
  dom.useCenterBtn.addEventListener("click", useMapCenter);
  dom.radiusSlider.addEventListener("input", (event) => {
    state.radiusMeters = Number(event.target.value);
    renderRadius();
    updateDraftUI();
  });
  dom.samplingForm.addEventListener("submit", handleFormSubmit);
  dom.exportJsonBtn.addEventListener("click", exportJson);
  dom.exportCsvBtn.addEventListener("click", exportCsv);

  dom.recordsList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) {
      return;
    }

    const recordId = button.dataset.recordId;
    const action = button.dataset.action;

    if (action === "focus-record") {
      focusRecord(recordId);
    }

    if (action === "delete-record") {
      deleteRecord(recordId);
    }
  });

  // Language selector
  const langSelector = document.getElementById("languageSelector");
  if (langSelector) {
    langSelector.addEventListener("click", (event) => {
      const btn = event.target.closest(".lang-btn");
      if (btn) {
        const lang = btn.dataset.lang;
        setLanguage(lang);
        updateUIText();
        updateLanguageButtonState();
      }
    });
  }
  
  updateLanguageButtonState();
}

function updateLanguageButtonState() {
  const langBtns = document.querySelectorAll(".lang-btn");
  const currentLang = getLanguage();
  langBtns.forEach((btn) => {
    if (btn.dataset.lang === currentLang) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

function updateUIText() {
  // Headers
  if (dom.tagline) dom.tagline.textContent = t('tagline');
  if (dom.title) dom.title.textContent = t('title');
  if (dom.subtitle) dom.subtitle.textContent = t('subtitle');
  
  // Button labels
  if (dom.exportJsonBtn) dom.exportJsonBtn.textContent = t('exportJSON');
  if (dom.exportCsvBtn) dom.exportCsvBtn.textContent = t('exportCSV');
  if (dom.todayBtn) dom.todayBtn.textContent = t('today');
  if (dom.locateBtn) dom.locateBtn.textContent = t('useMyLocation');
  if (dom.useCenterBtn) dom.useCenterBtn.textContent = t('useMapCenter');
  
  // Form labels
  const lbl_samplingDay = document.getElementById("lbl-samplingDay");
  if (lbl_samplingDay) lbl_samplingDay.textContent = t('samplingDay');
  
  const lbl_date = document.getElementById("lbl-date");
  if (lbl_date) lbl_date.textContent = t('date');
  
  const lbl_helpText1 = document.getElementById("lbl-helpText1");
  if (lbl_helpText1) lbl_helpText1.textContent = t('helpText1');
  
  const lbl_location = document.getElementById("lbl-location");
  if (lbl_location) lbl_location.textContent = t('location');
  
  const lbl_samplingRadius = document.getElementById("lbl-samplingRadius");
  if (lbl_samplingRadius) lbl_samplingRadius.textContent = t('samplingRadius');
  
  const lbl_registerUnit = document.getElementById("lbl-registerUnit");
  if (lbl_registerUnit) lbl_registerUnit.textContent = t('registerUnit');
  
  const lbl_newEntry = document.getElementById("lbl-newEntry");
  if (lbl_newEntry) lbl_newEntry.textContent = t('newEntry');
  
  const lbl_animal = document.getElementById("lbl-animal");
  if (lbl_animal) lbl_animal.textContent = t('animal');
  
  const lbl_depth = document.getElementById("lbl-depth");
  if (lbl_depth) lbl_depth.textContent = t('depth');
  
  const lbl_temperature = document.getElementById("lbl-temperature");
  if (lbl_temperature) lbl_temperature.textContent = t('temperature');
  
  const lbl_zone = document.getElementById("lbl-zone");
  if (lbl_zone) lbl_zone.textContent = t('zone');
  
  const lbl_notes = document.getElementById("lbl-notes");
  if (lbl_notes) lbl_notes.textContent = t('notes');
  
  const lbl_saveUnit = document.getElementById("lbl-saveUnit");
  if (lbl_saveUnit) lbl_saveUnit.textContent = t('saveUnit');
  
  const lbl_unitsOfDay = document.getElementById("lbl-unitsOfDay");
  if (lbl_unitsOfDay) lbl_unitsOfDay.textContent = t('unitsOfDay');
  
  const lbl_clickForDetails = document.getElementById("lbl-clickForDetails");
  if (lbl_clickForDetails) lbl_clickForDetails.textContent = t('clickForDetails');
  
  const lbl_quickTip = document.getElementById("lbl-quickTip");
  if (lbl_quickTip) lbl_quickTip.textContent = t('quickTip');
  
  const lbl_mapTipText = document.getElementById("lbl-mapTipText");
  if (lbl_mapTipText) lbl_mapTipText.textContent = t('mapTipText');
  
  // Update form placeholders
  if (dom.speciesInput) dom.speciesInput.placeholder = t('animalPlaceholder');
  if (dom.depthInput) dom.depthInput.placeholder = t('depthPlaceholder');
  if (dom.tempInput) dom.tempInput.placeholder = t('temperaturePlaceholder');
  if (dom.notesInput) dom.notesInput.placeholder = t('notesPlaceholder');
  
  // Update zone select options
  const selectOptions = [
    { value: "", label: t('selectZone') },
    { value: "Piedras", label: t('zoneStones') },
    { value: "Arena", label: t('zoneSand') },
    { value: "Mixto", label: t('zoneMixed') },
    { value: "Algas", label: t('zoneSeaweed') },
    { value: "Posidonia", label: t('zonePosidon') },
  ];
  
  if (dom.zoneInput) {
    const currentValue = dom.zoneInput.value;
    dom.zoneInput.innerHTML = selectOptions
      .map(opt => `<option value="${opt.value}">${opt.label}</option>`)
      .join("");
    dom.zoneInput.value = currentValue;
  }
  
  // Re-render records to update labels
  renderRecords();
  updateDraftUI();
}

function initialize() {
  if (typeof L === "undefined") {
    window.alert(t('leafletError'));
    return;
  }

  initDOM();
  initMap();
  updateUIText();
  bindEvents();
  renderRadius();
  setSelectedDate(state.selectedDate);
  updateDraftUI();
  renderRecords();

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        state.map.setView([latitude, longitude], 16, { animate: true });
        setDraftLocation(latitude, longitude, false);
      },
      () => {
        state.map.setView(DEFAULT_CENTER, 11, { animate: true });
      },
      { timeout: 9000, maximumAge: 30000 }
    );
  }
}

window.addEventListener("DOMContentLoaded", initialize);
