(function () {
  // ---------------------------------
  // Internal State
  // ---------------------------------
  let map;
  let heatLayer;

  // ---------------------------------
  // Initialization
  // ---------------------------------
  function initMap() {
    if (map) return;

    map = L.map('map').setView([20, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
  }

  // ---------------------------------
  // Input Helper
  // ---------------------------------
  function getPlantInput() {
    const input = document.getElementById("plantInput");
    if (!input) return null;

    const value = input.value.trim();
    return value.length ? value : null;
  }

  // ---------------------------------
  // URL Builder
  // ---------------------------------
  function buildINatUrl(plantName) {
    return (
      `https://api.inaturalist.org/v1/observations` +
      `?taxon_name=${encodeURIComponent(plantName)}` +
      `&has[]=geo` +
      `&quality_grade=research` +
      `&per_page=200`
    );
  }

  // ---------------------------------
  // Workflow Entry
  // ---------------------------------
  async function handleSearch() {

    const plant = getPlantInput();
    if (!plant) return;

    const raw = await fetchPlant(plant);
    const cleaned = cleanData(raw);
    renderMap(cleaned);
  }

  // ---------------------------------
  // Fetch Data
  // ---------------------------------
  async function fetchPlant(plantName) {
    const url = buildINatUrl(plantName);

    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.results || [];
    } catch (err) {
      console.error("Fetch error:", err);
      return [];
    }
  }

  // ---------------------------------
  // Data Cleaning
  // ---------------------------------
  function cleanData(rawResults) {
    return rawResults
      .filter(obs => obs.geojson && obs.geojson.coordinates)
      .map(obs => {
        const [lng, lat] = obs.geojson.coordinates;
        return [lat, lng, 1];
      });
  }

  // ---------------------------------
  // Heat Layer Replacement
  // ---------------------------------
  function replaceHeatLayer(data) {
    if (heatLayer) {
      map.removeLayer(heatLayer);
    }

    heatLayer = L.heatLayer(data, {
      radius: 25,
      blur: 20,
      maxZoom: 6
    }).addTo(map);
  }

  // ---------------------------------
  // Render Map
  // ---------------------------------
  function renderMap(processedData) {
    if (!map) initMap();
    replaceHeatLayer(processedData);
  }

  // ---------------------------------
  // Boot
  // ---------------------------------
  document.addEventListener("DOMContentLoaded", function () {

    initMap();

    const btn = document.getElementById("plantSearchBtn");
    if (btn) {
      btn.addEventListener("click", handleSearch);
    }
    const input = document.getElementById("plantInput");

    // for the clickability of search btn
    function updateButtonState() {
        btn.disabled = !input.value.trim();
    }

    // Initialize state on load
    updateButtonState();

    // Update whenever user types
    input.addEventListener("input", updateButtonState);

  });

})();