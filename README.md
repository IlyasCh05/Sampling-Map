# Sampling Map Local

Aplicación web local para registrar animales/insectos encontrados durante una jornada de sampling.

## Funciones

- Mapa responsive usable desde móvil o tablet.
- Geolocalización con GPS del navegador.
- Selección manual de punto tocando el mapa.
- Radio ajustable en metros, representado como círculo real sobre el mapa.
- Registros separados por día.
- Cada unidad guarda:
  - animal/insecto,
  - coordenadas,
  - profundidad,
  - temperatura del agua,
  - zona,
  - radio usado,
  - hora,
  - notas.
- Marcadores clicables con toda la información del registro.
- Exportación a JSON y CSV.
- Importación de JSON exportado desde la propia app.
- Datos guardados localmente en el navegador mediante localStorage.

## Cómo ejecutarlo en PC con VS Code

1. Instala Visual Studio Code.
2. Abre la carpeta `sampling-map-local` en VS Code.
3. Instala la extensión **Live Server**.
4. Haz clic derecho sobre `index.html`.
5. Pulsa **Open with Live Server**.
6. Se abrirá una URL similar a `http://127.0.0.1:5500/index.html`.

## Cómo ejecutarlo con Python

Desde la carpeta del proyecto:

```bash
python -m http.server 8000
```

Luego abre en el navegador:

```text
http://localhost:8000
```

## Uso básico

1. Pulsa **Ubicarme** y acepta el permiso de ubicación.
2. Selecciona el día de sampling.
3. Ajusta el radio visible.
4. Rellena los datos de la unidad encontrada.
5. Pulsa **Usar mi ubicación** o toca el mapa para fijar el punto exacto.
6. Pulsa **Guardar unidad**.
7. Clica cualquier marcador o registro de la lista para ver los detalles.
8. Exporta JSON o CSV al terminar el día.

## Notas importantes

- El mapa usa teselas de OpenStreetMap mediante Leaflet, así que necesita internet para cargar el mapa.
- Los datos se guardan en el navegador/dispositivo. Si borras datos del navegador, puedes perder los registros.
- Exporta el JSON/CSV al terminar cada jornada para tener una copia segura.
- La geolocalización funciona mejor en `localhost` o HTTPS. Si abres el archivo directamente como `file://`, algunos navegadores pueden bloquear el GPS.
- Si usas un móvil conectado al servidor de tu PC por IP local, algunos navegadores pueden bloquear GPS por no ser HTTPS. En ese caso, toca el mapa manualmente o publica la app en un entorno HTTPS como GitHub Pages.

## Archivos

- `index.html`: estructura de la app.
- `styles.css`: diseño responsive.
- `app.js`: lógica de mapa, registros, exportación e importación.
