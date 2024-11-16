const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  10,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let stars, starGeo;
let particleTexture;

lighting();
createText();  
particles();
setInterval(changeParticlesColor, 3000); 


function createText() {
  
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  canvas.width = 256;
  canvas.height = 128;

  context.font = '48px Arial'; // Font size and type
  context.fillStyle = 'white'; // Text color
  context.fillText('Rico', 1, 35); // Draw the text at the specified position

  const textTexture = new THREE.CanvasTexture(canvas);

  const textMaterial = new THREE.MeshBasicMaterial({ map: textTexture, transparent: true });
  const textGeometry = new THREE.PlaneGeometry(10, 5);
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);

  textMesh.position.set(2.5, 0, -20); // Adjust the position as needed
  scene.add(textMesh);
}

function changeParticlesColor() {
  const randomColor = Math.random() * 0xffffff;
  stars.material.color.setHex(randomColor);
}

function particles() {
  const points = [];

  for (let i = 0; i < 6000; i++) {
    let star = new THREE.Vector3(
      Math.random() * 600 - 300,
      Math.random() * 600 - 300,
      Math.random() * 600 - 300
    );
    points.push(star);
  }

  starGeo = new THREE.BufferGeometry().setFromPoints(points);

  particleTexture = new THREE.TextureLoader().load("assets/star.png");

  let starMaterial = new THREE.PointsMaterial({
    color: 0xffb6c1, // Light pink
    size: 1.2,
    map: particleTexture,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  stars = new THREE.Points(starGeo, starMaterial);
  scene.add(stars);
}

function animateParticles() {
  const positions = starGeo.attributes.position.array;
  const particleCount = positions.length / 3;

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3 + 1] -= 0.9;  // Move particles down

    if (positions[i * 3 + 1] < -200) {
      positions[i * 3 + 1] = Math.random() * 300 + 100;
      positions[i * 3] = Math.random() * 600 - 300;
      positions[i * 3 + 2] = Math.random() * 600 - 300;
    }
  }

  starGeo.attributes.position.needsUpdate = true;
}

function lighting() {
  const light = new THREE.HemisphereLight(0x780a44, 0x1c3020, 1);
  scene.add(light);

  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(0, 0, 15);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.camera.near = 500;
  spotLight.shadow.camera.far = 4000;
  spotLight.shadow.camera.fov = 30;
  scene.add(spotLight);
}

function animate() {
  requestAnimationFrame(animate);

  animateParticles();

  renderer.render(scene, camera);
}

animate();
