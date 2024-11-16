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

let cubeMesh = new THREE.Mesh();
let stars, starGeo;
let particleTexture;

lighting();
cube();
particles();
setInterval(changeParticlesColor, 3000); // 3000ms = 3 seconds

function changeParticlesColor() {
  // Generate a random color
  const randomColor = Math.random() * 0xffffff; // Random color

  // Apply the new color to the particle material
  stars.material.color.setHex(randomColor);
}

function particles() {
  const points = [];

  // Create 6000 particles in random positions
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
    color: 0xffb6c1, // light pink
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
    positions[i * 3 + 1] -= 0.9; // Move particles down

    // Reset particles once they reach the bottom
    if (positions[i * 3 + 1] < -200) {
      positions[i * 3 + 1] = Math.random() * 300 + 100;
      positions[i * 3] = Math.random() * 600 - 300;
      positions[i * 3 + 2] = Math.random() * 600 - 300;
    }
  }

  starGeo.attributes.position.needsUpdate = true; 
}

function cube() {
  const texture = new THREE.TextureLoader().load("assets/wooden.jpg");
  const cubeMaterial = new THREE.MeshBasicMaterial({ map: texture });
  const cubeGeometry = new THREE.BoxGeometry(10, 5, 5, 5);
  cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);

  cubeMesh.position.z = -5;
  camera.position.z = 15;

  scene.add(cubeMesh);
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

  cubeMesh.rotation.x += 0.008;
  cubeMesh.rotation.y += 0.008;
  renderer.render(scene, camera);
}

animate();
