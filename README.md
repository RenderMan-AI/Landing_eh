# España e Hijos · Landing interactiva 3D

Prototipo de landing page premium para explicar cómo diferentes partes del cerdo ibérico se transforman en productos comerciales para restauración, distribución y retail gourmet.

## Qué incluye

- Landing responsive en HTML, CSS y JavaScript.
- Modelo 3D procedural integrado con Three.js.
- Zonas clicables: jamón, paleta, lomo, panceta, papada, presa, secreto, pluma, costillar y solomillo.
- Hover/tap con iluminación de pieza.
- Click/tap con separación animada de la pieza seleccionada.
- Tarjeta comercial dinámica por corte.
- Filtros: curados, frescos, elaborados, restauración y retail.
- Línea visual de proceso y secciones comerciales.

## Ejecutar en local

```bash
python3 -m http.server 5173
```

Abrir:

```text
http://localhost:5173
```

También puede servirse con cualquier servidor estático. El módulo de Three.js se carga desde CDN mediante `esm.sh`.

## Sustituir el logo

El archivo actual es un marcador provisional:

```text
assets/logo-espana-e-hijos.svg
```

Debe reemplazarse por el logo oficial sin modificarlo.

## Nota legal y de contenido

Prototipo interactivo demostrativo. Los textos y datos deben adaptarse a la información oficial de España e Hijos. No se incluyen certificaciones, sellos ni denominaciones de origen no verificadas en materiales oficiales.
