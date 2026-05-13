import * as THREE from 'https://esm.sh/three@0.164.1';

const parts = {
  jamon: {
    name: 'Jamón',
    description: 'Pieza noble de alto reconocimiento comercial, asociada a formatos curados y a una presentación premium para venta especializada.',
    process: 'Selección de pieza, perfilado, salado, curación y maduración controlada según especificación comercial.',
    product: 'Jamón ibérico curado, centro deshuesado o formatos loncheados.',
    use: 'Retail gourmet, hostelería premium, distribución especializada y cestas corporativas.',
    tags: ['curados', 'retail', 'restauracion'],
    color: 0x9a3f2f
  },
  paleta: {
    name: 'Paleta',
    description: 'Corte delantero con gran identidad ibérica, versátil para curación y para formatos profesionales de alto valor percibido.',
    process: 'Perfilado, salado, asentamiento y curación con control de evolución de la pieza.',
    product: 'Paleta curada, deshuesada o loncheada para servicio profesional.',
    use: 'Restauración, distribución y puntos de venta especializados.',
    tags: ['curados', 'retail', 'restauracion'],
    color: 0xaa4b36
  },
  lomo: {
    name: 'Lomo',
    description: 'Pieza magra y reconocible, muy adecuada para propuestas curadas, frescas o elaboradas con presentación gourmet.',
    process: 'Limpieza, adobado o preparación según formato, embuchado o envasado y control de maduración cuando aplica.',
    product: 'Lomo ibérico curado, caña de lomo, fileteado o formatos frescos.',
    use: 'Retail gourmet, charcutería selecta, restauración y distribución.',
    tags: ['curados', 'frescos', 'elaborados', 'retail'],
    color: 0xbd6742
  },
  panceta: {
    name: 'Panceta',
    description: 'Pieza con equilibrio entre grasa y magro, apreciada por su rendimiento culinario y su intensidad gastronómica.',
    process: 'Despiece, limpieza, corte por formato y elaboración fresca, curada o adobada según aplicación.',
    product: 'Panceta fresca, curada, adobada o porcionada para cocina.',
    use: 'Restauración, elaboradores y distribución profesional.',
    tags: ['frescos', 'elaborados', 'restauracion'],
    color: 0xc4784e
  },
  papada: {
    name: 'Papada',
    description: 'Corte graso de alta personalidad, especialmente interesante para cocina creativa, elaboraciones y formatos de restauración.',
    process: 'Separación, limpieza y preparación en pieza, tacos, láminas o formatos específicos para cocina.',
    product: 'Papada fresca, curada, confitada o preparada para elaboración.',
    use: 'Restauración gastronómica, obradores y distribución especializada.',
    tags: ['frescos', 'elaborados', 'restauracion'],
    color: 0x8b3026
  },
  presa: {
    name: 'Presa',
    description: 'Corte premium muy valorado en cocina por infiltración, textura y rendimiento en parrilla, plancha o elaboraciones cuidadas.',
    process: 'Selección, limpieza fina, porcionado y envasado según necesidades del canal profesional.',
    product: 'Presa ibérica fresca, porcionada o preparada para restauración.',
    use: 'Restauración, parrillas, distribución premium y retail gourmet.',
    tags: ['frescos', 'restauracion', 'retail'],
    color: 0xd08a56
  },
  secreto: {
    name: 'Secreto',
    description: 'Corte de gran aceptación comercial, reconocible por su jugosidad y versatilidad en cocina profesional.',
    process: 'Extracción cuidadosa, limpieza, clasificación y preparación en formatos frescos o porcionados.',
    product: 'Secreto ibérico fresco, envasado o preparado para servicio.',
    use: 'Restauración, distribución y retail especializado.',
    tags: ['frescos', 'restauracion', 'retail'],
    color: 0xbe5d3e
  },
  pluma: {
    name: 'Pluma',
    description: 'Pieza fina y elegante, apreciada por su ternura y por su lectura premium en carta o mostrador gourmet.',
    process: 'Despiece preciso, limpieza manual y preparación por peso, unidad o formato de servicio.',
    product: 'Pluma ibérica fresca, porcionada o envasada.',
    use: 'Restauración premium, retail gourmet y distribución selectiva.',
    tags: ['frescos', 'restauracion', 'retail'],
    color: 0xd49a63
  },
  costillar: {
    name: 'Costillar',
    description: 'Pieza con gran presencia visual y buen rendimiento para propuestas de horno, brasa, adobos o elaboraciones listas para cocinar.',
    process: 'Corte, limpieza, porcionado y preparación fresca o elaborada según canal.',
    product: 'Costillar fresco, adobado, porcionado o preparado para cocina.',
    use: 'Restauración, retail y distribución alimentaria.',
    tags: ['frescos', 'elaborados', 'restauracion'],
    color: 0xb84c35
  },
  solomillo: {
    name: 'Solomillo',
    description: 'Corte magro, tierno y de lectura premium, adecuado para servicio individual, cocina profesional y venta especializada.',
    process: 'Extracción limpia, pulido, calibrado y envasado por unidad o por formato profesional.',
    product: 'Solomillo ibérico fresco, entero o medallones.',
    use: 'Restauración, catering premium y retail gourmet.',
    tags: ['frescos', 'restauracion', 'retail'],
    color: 0xc68152
  }
};

const title = document.querySelector('#part-title');
const description = document.querySelector('#part-description');
const process = document.querySelector('#part-process');
const product = document.querySelector('#part-product');
const use = document.querySelector('#part-use');
const statusLabel = document.querySelector('#model-status');
const selector = document.querySelector('.mobile-part-selector');
const container = document.querySelector('#pig-3d');

let selectedPart = 'jamon';
let hoveredPart = null;
let filter = 'all';
let camera, scene, renderer, raycaster, pointer, root, labelGroup;
const meshes = new Map();
const basePositions = new Map();
const explodeVectors = new Map();
const labels = new Map();
const originalScales = new Map();

function updateCard(key) {
  const part = parts[key];
  if (!part) return;
  selectedPart = key;
  title.textContent = part.name;
  description.textContent = part.description;
  process.textContent = part.process;
  product.textContent = part.product;
  use.textContent = part.use;
  statusLabel.textContent = `${part.name} seleccionado`;
  document.querySelectorAll('.part-chip').forEach((button) => button.classList.toggle('active', button.dataset.part === key));
}

function buildMobileSelector() {
  Object.entries(parts).forEach(([key, part]) => {
    const button = document.createElement('button');
    button.className = 'part-chip';
    button.type = 'button';
    button.dataset.part = key;
    button.textContent = part.name;
    button.addEventListener('click', () => selectPart(key));
    selector.appendChild(button);
  });
}

function createMaterial(partKey) {
  const color = parts[partKey]?.color || 0x8c3a2d;
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.58,
    metalness: 0.04,
    emissive: 0x000000,
    transparent: true,
    opacity: 1
  });
}

function makeEllipsoid(partKey, scale, position, rotation = [0, 0, 0]) {
  const geometry = new THREE.SphereGeometry(1, 48, 24);
  const mesh = new THREE.Mesh(geometry, createMaterial(partKey));
  mesh.name = partKey;
  mesh.scale.set(scale[0], scale[1], scale[2]);
  mesh.position.set(position[0], position[1], position[2]);
  mesh.rotation.set(rotation[0], rotation[1], rotation[2]);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  meshes.set(partKey, mesh);
  basePositions.set(partKey, mesh.position.clone());
  originalScales.set(partKey, mesh.scale.clone());
  return mesh;
}

function addLabel(partKey, position) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 96;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgba(255, 247, 235, 0.94)';
  roundRect(ctx, 18, 18, 220, 54, 18);
  ctx.fill();
  ctx.font = '700 28px Inter, Arial';
  ctx.fillStyle = '#411811';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(parts[partKey].name, 128, 45);
  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.92 });
  const sprite = new THREE.Sprite(material);
  sprite.position.set(position[0], position[1], position[2]);
  sprite.scale.set(1.45, 0.54, 1);
  sprite.visible = false;
  labels.set(partKey, sprite);
  labelGroup.add(sprite);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function init3D() {
  if (!container) return;

  scene = new THREE.Scene();
  scene.background = null;
  camera = new THREE.PerspectiveCamera(38, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(0, 2.25, 8.25);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  raycaster = new THREE.Raycaster();
  pointer = new THREE.Vector2();
  root = new THREE.Group();
  root.rotation.set(-0.05, -0.25, 0);
  scene.add(root);
  labelGroup = new THREE.Group();
  scene.add(labelGroup);

  const ambient = new THREE.HemisphereLight(0xfff2df, 0x30110d, 2.2);
  scene.add(ambient);
  const key = new THREE.DirectionalLight(0xffead2, 3.2);
  key.position.set(4, 6, 5);
  key.castShadow = true;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffbb77, 1.35);
  rim.position.set(-4, 2.4, -2);
  scene.add(rim);

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(4.7, 80),
    new THREE.MeshBasicMaterial({ color: 0x3b160f, transparent: true, opacity: 0.18 })
  );
  floor.position.y = -1.72;
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  const pieces = [
    ['jamon', [1.25, 1.06, 0.88], [-2.25, -0.28, -0.03], [0.04, 0.08, -0.16], [-0.55, 0.18, 0.12]],
    ['paleta', [0.92, 0.96, 0.78], [2.03, -0.18, 0.02], [-0.05, -0.08, 0.2], [0.52, 0.2, 0.08]],
    ['lomo', [1.72, 0.48, 0.62], [-0.2, 0.68, 0.04], [0.02, -0.05, 0.03], [0, 0.48, 0.12]],
    ['panceta', [1.58, 0.56, 0.58], [-0.22, -0.66, 0.08], [-0.03, 0.04, 0.02], [0, -0.48, 0.12]],
    ['papada', [0.58, 0.52, 0.58], [2.72, -0.32, 0.08], [0.08, 0.02, -0.04], [0.5, -0.18, 0.16]],
    ['presa', [0.74, 0.5, 0.58], [1.12, 0.1, 0.14], [0.08, -0.18, 0.07], [0.34, 0.22, 0.18]],
    ['secreto', [0.78, 0.38, 0.46], [0.22, -0.08, 0.24], [-0.08, 0.15, 0.08], [0.16, 0.1, 0.34]],
    ['pluma', [0.66, 0.34, 0.42], [-1.18, 0.16, 0.22], [0.08, 0.17, -0.08], [-0.2, 0.2, 0.28]],
    ['costillar', [0.86, 0.56, 0.52], [-0.78, -0.22, 0.28], [-0.1, 0.1, 0.08], [-0.18, -0.08, 0.38]],
    ['solomillo', [0.9, 0.25, 0.34], [0.75, 0.72, 0.28], [0.03, -0.12, 0.06], [0.18, 0.42, 0.32]]
  ];

  pieces.forEach(([keyName, scale, pos, rotation, explode]) => {
    const mesh = makeEllipsoid(keyName, scale, pos, rotation);
    root.add(mesh);
    explodeVectors.set(keyName, new THREE.Vector3(explode[0], explode[1], explode[2]));
    addLabel(keyName, [pos[0], pos[1] + scale[1] + 0.32, pos[2] + 0.3]);
  });

  addPigDetails();
  bind3DEvents();
  updateCard(selectedPart);
  animate();
}

function addPigDetails() {
  const noseMat = new THREE.MeshStandardMaterial({ color: 0x5f2119, roughness: 0.68 });
  const earMat = new THREE.MeshStandardMaterial({ color: 0x6b251d, roughness: 0.72 });
  const legMat = new THREE.MeshStandardMaterial({ color: 0x5a2018, roughness: 0.7 });

  const head = new THREE.Mesh(new THREE.SphereGeometry(1, 38, 18), noseMat);
  head.scale.set(0.72, 0.66, 0.64);
  head.position.set(3.02, 0.18, -0.02);
  head.castShadow = true;
  root.add(head);

  const snout = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), noseMat);
  snout.scale.set(0.36, 0.26, 0.28);
  snout.position.set(3.58, 0.12, 0.03);
  root.add(snout);

  const earLeft = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.6, 4), earMat);
  earLeft.position.set(2.76, 0.9, -0.18);
  earLeft.rotation.set(0.7, 0.15, 0.62);
  root.add(earLeft);

  const earRight = earLeft.clone();
  earRight.position.z = 0.28;
  earRight.rotation.z = 0.42;
  root.add(earRight);

  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 8), new THREE.MeshBasicMaterial({ color: 0x180806 }));
  eye.position.set(3.42, 0.36, 0.43);
  root.add(eye);

  [[-1.92, -1.24], [1.36, -1.2], [-0.62, -1.26], [2.05, -1.18]].forEach(([x, y]) => {
    const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.72, 8, 16), legMat);
    leg.position.set(x, y, -0.08);
    leg.rotation.z = x < 0 ? -0.08 : 0.08;
    leg.castShadow = true;
    root.add(leg);
  });

  const tailCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-3.14, 0.22, 0),
    new THREE.Vector3(-3.62, 0.34, 0.18),
    new THREE.Vector3(-3.42, 0.58, 0.12),
    new THREE.Vector3(-3.18, 0.48, 0)
  ]);
  const tail = new THREE.Mesh(new THREE.TubeGeometry(tailCurve, 30, 0.035, 8, false), earMat);
  root.add(tail);
}

function bind3DEvents() {
  renderer.domElement.addEventListener('pointermove', onPointerMove);
  renderer.domElement.addEventListener('pointerleave', () => {
    hoveredPart = null;
    renderer.domElement.style.cursor = 'default';
  });
  renderer.domElement.addEventListener('click', () => {
    if (hoveredPart) selectPart(hoveredPart);
  });

  let dragging = false;
  let lastX = 0;
  renderer.domElement.addEventListener('pointerdown', (event) => {
    dragging = true;
    lastX = event.clientX;
  });
  window.addEventListener('pointerup', () => { dragging = false; });
  window.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    const dx = event.clientX - lastX;
    root.rotation.y += dx * 0.006;
    lastX = event.clientX;
  });

  window.addEventListener('resize', onResize);
  document.querySelector('#reset-view')?.addEventListener('click', () => {
    root.rotation.set(-0.05, -0.25, 0);
    selectPart('jamon');
  });
}

function onPointerMove(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects([...meshes.values()], false);
  hoveredPart = hits.length ? hits[0].object.name : null;
  renderer.domElement.style.cursor = hoveredPart ? 'pointer' : 'grab';
  if (hoveredPart) statusLabel.textContent = `${parts[hoveredPart].name}: click para seleccionar`;
}

function selectPart(key) {
  if (!parts[key]) return;
  updateCard(key);
}

function onResize() {
  if (!container || !renderer || !camera) return;
  const width = container.clientWidth;
  const height = container.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

function animate() {
  requestAnimationFrame(animate);
  const time = performance.now() * 0.001;
  root.rotation.x = -0.05 + Math.sin(time * 0.7) * 0.015;

  meshes.forEach((mesh, key) => {
    const base = basePositions.get(key);
    const vector = explodeVectors.get(key);
    const originalScale = originalScales.get(key);
    const isSelected = key === selectedPart;
    const isHovered = key === hoveredPart;
    const matchesFilter = filter === 'all' || parts[key].tags.includes(filter);
    const target = base.clone();
    if (isSelected) target.add(vector);
    mesh.position.lerp(target, 0.12);
    mesh.material.emissive.setHex(isHovered || isSelected ? 0x3a140c : 0x000000);
    mesh.material.opacity = selectedPart && !isSelected ? 0.48 : 1;
    if (filter !== 'all' && !matchesFilter) mesh.material.opacity = 0.18;
    const scaleFactor = isHovered ? 1.025 : isSelected ? 1.015 : 1;
    mesh.scale.lerp(originalScale.clone().multiplyScalar(scaleFactor), 0.12);

    const label = labels.get(key);
    if (label) {
      label.visible = isHovered || isSelected;
      label.material.opacity += ((isHovered || isSelected ? 0.95 : 0) - label.material.opacity) * 0.12;
    }
  });

  renderer.render(scene, camera);
}

function applyFilter(nextFilter) {
  filter = nextFilter;
  document.querySelectorAll('.filter').forEach((button) => button.classList.toggle('active', button.dataset.filter === nextFilter));
  const firstMatch = Object.keys(parts).find((key) => nextFilter === 'all' || parts[key].tags.includes(nextFilter));
  if (firstMatch) selectPart(firstMatch);
}

document.querySelectorAll('.filter').forEach((button) => {
  button.addEventListener('click', () => applyFilter(button.dataset.filter));
});

const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.main-nav');
navToggle?.addEventListener('click', () => {
  const open = nav?.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(Boolean(open)));
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => nav?.classList.remove('open'));
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.16 });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

buildMobileSelector();
init3D();
