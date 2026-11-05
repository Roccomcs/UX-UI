# Decisiones de diseño de Compás

Este documento registra las decisiones que orientan la interfaz HTML, sus wireframes y los tres modos de visualización. Es la síntesis aplicada de la consigna, las clases de UX y Accesibilidad, la entrevista y los artefactos de investigación disponibles en esta carpeta. Los datos del prototipo siguen siendo ejemplos: no se presentan como una validación nueva con usuarios.

## Problema, persona y criterio

- **Persona de referencia:** Fabrizio, 23 años, con dificultades para iniciar tareas, interrupciones frecuentes y una preferencia por una presión gradual, clara y no punitiva.
- **Problema:** convertir la intención de organizarse en un primer paso posible, incluso cuando el día cambia.
- **Promesa:** una agenda que acompaña sin quitar control. La persona entiende qué sigue, qué puede cambiar y qué consecuencia tendría cada decisión.
- **Principios:** firme, cercana, clara, tolerante a imprevistos y respetuosa de la autonomía.

Estas decisiones se desprenden especialmente de `U2 - UX - Alto voltaje - Fabrizio.png`, `U2 - UX - ARQUETIPO - Fabrizio.png`, `U2 - UX - CUSTOMER JOURNEY MAP - Fabrizio.png`, `U2 - UX - MAPA DE EMPATIA - Fabrizio.png` y `Entrevista Alto Voltaje - Fabrizio.pdf`.

## Tipografía y tamaños

| Uso | Familia | Tamaño | Peso | Interlineado |
| --- | --- | ---: | ---: | ---: |
| Títulos de pantalla | Manrope | 30 px (`1.875rem`) | 750 | 1.25 |
| Título de sección | Manrope | 19 px (`1.1875rem`) | 750 | 1.25 |
| Subtítulo de tarjeta | Manrope | 17 px (`1.0625rem`) | 700 | 1.25 |
| Texto principal | Source Sans 3 | 16 px (`1rem`) | 400 | 1.5 |
| Texto auxiliar | Source Sans 3 | 14 px (`.875rem`) | 400 | 1.4 |
| Etiqueta / navegación móvil | Source Sans 3 | 11 px (`.6875rem`) | 650–800 | 1.4 |
| Hero de la galería | Manrope | fluido, 48–76 px | 750 | 1.08 |

Se eligieron Manrope para jerarquía y Source Sans 3 para lectura continua. El cuerpo mínimo normal es 16 px; las etiquetas menores siempre se acompañan de contexto y no contienen información únicamente por color. Las unidades relativas permiten ampliar texto hasta 200 % sin depender de un tamaño fijo.

## Colores con nombre

Todos los colores de interfaz tienen un nombre de uso. Los valores viven en `assets/app.css` como variables semánticas para que ningún componente dependa de un color anónimo.

### Modo claro

| Nombre | Hex | Uso |
| --- | --- | --- |
| Fondo de página | `#F7F8FA` | Fondo principal |
| Fondo de revisión | `#EDF0F4` | Exterior de las pantallas |
| Superficie | `#FFFFFF` | Cards, formularios y navegación |
| Texto tinta | `#202A43` | Texto principal |
| Texto secundario | `#596377` | Ayudas y metadatos |
| Acción primaria | `#384D78` | Enlaces, progreso y acciones |
| Lavanda de apoyo | `#EAE7F2` | Selección, agrupación y superficies suaves |
| Azul suave informativo | `#DCE5F0` | Avisos y estados informativos |
| Acento | `#C8C3D9` | Detalle decorativo |
| Línea | `#D5DBE5` | Separadores |
| Control | `#7A8496` | Bordes y controles |
| Éxito | `#285D48` | Confirmaciones |
| Fondo de éxito | `#E9F2ED` | Superficie de confirmación |
| Advertencia | `#795516` | Advertencias |
| Fondo de advertencia | `#FAF0D9` | Superficie de advertencia |
| Error | `#9E3540` | Errores y acciones destructivas |
| Fondo de error | `#F8E9EB` | Superficie de error |

### Modo oscuro

El modo oscuro no invierte colores automáticamente: usa pares nuevos para conservar jerarquía y contraste.

| Nombre | Hex | Uso |
| --- | --- | --- |
| Fondo oscuro | `#111827` | Fondo de página y teléfono |
| Superficie oscura | `#1F2937` | Cards y controles |
| Texto claro | `#F3F4F6` | Texto principal |
| Texto secundario oscuro | `#C4CAD4` | Texto auxiliar |
| Acción primaria clara | `#A9C7FF` | Enlaces y acciones |
| Lavanda oscura | `#343B52` | Selecciones |
| Azul suave oscuro | `#293C55` | Avisos |
| Línea oscura | `#4B5563` | Separadores |
| Control oscuro | `#AEB8C7` | Bordes |
| Éxito claro | `#8CDDB5` | Confirmaciones |
| Advertencia clara | `#F4C86B` | Advertencias |
| Error claro | `#FF9DA5` | Errores |

### Modo alto contraste

Está pensado para baja visión y para personas con daltonismo: usa negro, blanco, azul, amarillo, verde y rojo con diferencias de luminosidad, además de texto e iconos. No se comunica ningún estado únicamente por color.

| Nombre | Hex | Uso |
| --- | --- | --- |
| Negro de contraste | `#000000` | Texto y bordes |
| Blanco de contraste | `#FFFFFF` | Fondos |
| Azul de contraste | `#003CA6` | Acciones |
| Amarillo de contraste | `#FFCC00` | Acento |
| Verde de contraste | `#006B3C` | Éxito |
| Marrón de contraste | `#704800` | Advertencia |
| Rojo de contraste | `#A40000` | Error |
| Violeta de foco | `#7A00CC` | Foco de teclado |

## Modos de visualización

- **Claro:** modo base de la propuesta.
- **Oscuro:** se selecciona con el botón `Oscuro` y se conserva entre páginas mediante `localStorage`.
- **Alto contraste:** se selecciona con `Contraste`; refuerza bordes, foco y diferencias de luminosidad. Es una ayuda para daltonismo, no una sustitución de una evaluación clínica.
- El navegador puede sugerir oscuro mediante `prefers-color-scheme`, pero el control explícito tiene prioridad.
- Los controles tienen nombre accesible, estado `aria-pressed` y foco visible.

## Espaciado, forma y composición

- Referencia móvil: **390 × 844 px**.
- Márgenes internos de pantalla: **24 px**.
- Escala base: múltiplos de **8 px**, con ajustes de **4 px**.
- Áreas táctiles activas: mínimo **44 × 44 px**.
- Radios: 12 px para campos, 14 px para botones, 16 px para cards y 20–36 px para superficies de mayor jerarquía.
- Una acción primaria por pantalla; las acciones secundarias no compiten visualmente.
- La navegación principal contiene cinco destinos y queda al alcance del pulgar.

## Accesibilidad AA aplicada

- Idioma `es-AR`, HTML semántico, un `h1` por documento y enlace para saltar al contenido.
- Contraste objetivo WCAG 2.2 AA: mínimo **4.5:1** para texto normal, **3:1** para texto grande y **3:1** para componentes gráficos y controles.
- El foco usa un contorno de 3 px y no depende del color del texto.
- Los estados se expresan con texto, iconos y superficies; nunca solo con color.
- Los campos tienen etiquetas persistentes y descripción asociada.
- Audio y foto tienen alternativa escrita.
- El contenido soporta ampliación y reflujo en pantallas pequeñas.
- Se respeta `prefers-reduced-motion` al no depender de animaciones para comprender la interfaz.

La comprobación automática del repositorio se ejecuta con:

```powershell
python tools\check_compas.py
```

Esta herramienta valida estructura, idioma, etiquetas, enlaces y recursos. El contraste debe volver a verificarse con una herramienta AA (por ejemplo, axe, Lighthouse o Stark) sobre cada modo y con pruebas de teclado y lector de pantalla; esta documentación no afirma una certificación integral.

## Fuentes consultadas

- `CONSIGNAS.txt`: flujos, inventario, grilla, principios, heurísticas, estados y accesibilidad.
- `K3561 TFI.pdf` y `Evaluacion-de-producto-3562_1.pdf`: marco del trabajo integrador y evaluación del producto.
- `UX y Accesibilidad - Clase 2_1.pdf`.
- `UX-Accesibilidad-or-Clase-1-K3561.pdf`, `UX-Accesibilidad-or-Clase-3-K3561.pdf`, `UX-Accesibilidad-or-Clase-4-K3561.pdf`, `UX-Accesibilidad-or-Clase-5-K3561.pdf`, `UX-Accesibilidad-Clase-7-K3561.pdf`, `UX-Accesibilidad-Clase-7-Arquitectura-de-la-Informacion.pdf` y `UX-Accesibilidad-or-Clase-9-K-3561.pdf`.
- Los cuatro PNG de arquetipo, mapa de empatía, customer journey y producto Alto Voltaje.

