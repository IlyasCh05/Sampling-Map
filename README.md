# Sampling Map Local

Aplicación web local para registrar muestreos con mapa, coordenadas, profundidad, temperatura del agua y tipo de sustrato.

## Cómo abrirla

1. Sirve la carpeta con un servidor local.
2. Abre `index.html` en el navegador.

Opciones rápidas:

- `python -m http.server 8000`
- Live Server en VS Code

## Funciones

- Mapa interactivo con Leaflet.
- Geolocalización del dispositivo.
- Selección manual tocando el mapa o arrastrando el marcador.
- Radio de muestreo ajustable.
- Separación automática por fecha.
- Guardado local en `localStorage`.
- Exportación a JSON.

## Nota

El mapa usa teselas de OpenStreetMap, así que necesita conexión a internet para cargar el fondo cartográfico.
