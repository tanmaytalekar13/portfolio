class ThreeBackground {
    constructor() {
        this.scenes = {};
        this.clock = new THREE.Clock();
        this.mouse = new THREE.Vector2();
        this.target = new THREE.Vector2();
        this.currentSection = 'home';
        this.init();
        
        // Event Listeners
        window.addEventListener('mousemove', this.handleMouseMove.bind(this));
        window.addEventListener('resize', this.handleResize.bind(this));
        window.addEventListener('scroll', this.handleScroll.bind(this));
    }

    handleMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    handleScroll() {
        // Update animations based on scroll position
        Object.values(this.scenes).forEach(({ objects }) => {
            if (objects && objects.mainGroup) {
                objects.mainGroup.rotation.x = window.scrollY * 0.001;
                objects.mainGroup.rotation.y = window.scrollY * 0.001;
            }
        });
    }

    handleResize() {
        Object.values(this.scenes).forEach(({ camera, renderer, container }) => {
            if (camera && renderer && container) {
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            }
        });
    }

    init() {
        const sections = [
            { 
                id: 'home', 
                elementId: 'three-container',
                colors: [0x4f46e5, 0x06b6d4, 0x3b82f6, 0x6366f1],
                intensity: 1
            },
            { 
                id: 'about', 
                elementId: 'about-three',
                colors: [0x06b6d4, 0x3b82f6, 0x6366f1, 0x4f46e5],
                intensity: 1.5
            },
            { 
                id: 'projects', 
                elementId: 'projects-three',
                colors: [0x3b82f6, 0x6366f1, 0x4f46e5, 0x06b6d4],
                intensity: 1.5
            },
            { 
                id: 'contact', 
                elementId: 'contact-three',
                colors: [0x6366f1, 0x4f46e5, 0x06b6d4, 0x3b82f6],
                intensity: 1.5
            }
        ];

        sections.forEach(section => {
            const element = document.getElementById(section.elementId);
            if (element) {
                this.setupScene(section.id, element, {
                    boxCount: 30,
                    colors: section.colors,
                    intensity: section.intensity
                });
            }
        });

        this.animate();
    }

    setupScene(name, container, options) {
        if (!container) return;

        const scene = new THREE.Scene();
        
        const camera = new THREE.PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            0.1,
            2000
        );
        camera.position.z = 800;

        const renderer = new THREE.WebGLRenderer({ 
            alpha: true,
            antialias: true,
            powerPreference: "high-performance"
        });

        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        
        // Clear any existing canvas
        container.innerHTML = '';
        container.appendChild(renderer.domElement);

        const objects = this.createBoxes(scene, options);

        this.scenes[name] = {
            scene,
            camera,
            renderer,
            objects,
            container,
            options
        };
    }

    createBoxes(scene, options) {
        const boxes = [];
        const mainGroup = new THREE.Group();
        scene.add(mainGroup);

        // Add lights first
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5 * options.intensity);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8 * options.intensity);
        directionalLight.position.set(1, 1, 1);
        
        scene.add(ambientLight);
        scene.add(directionalLight);

        // Add point lights
        const pointLight1 = new THREE.PointLight(0x4f46e5, 1 * options.intensity, 1000);
        const pointLight2 = new THREE.PointLight(0x06b6d4, 1 * options.intensity, 1000);
        pointLight1.position.set(300, 300, 300);
        pointLight2.position.set(-300, -300, -300);
        scene.add(pointLight1);
        scene.add(pointLight2);

        for (let i = 0; i < options.boxCount; i++) {
            const size = Math.random() * 30 + 30;
            const geometry = new THREE.BoxGeometry(size, size, size);
            const color = options.colors[Math.floor(Math.random() * options.colors.length)];
            
            const wireframeMaterial = new THREE.LineBasicMaterial({ 
                color: color,
                transparent: true,
                opacity: 0.8 * options.intensity,
                linewidth: 2
            });
            
            const solidMaterial = new THREE.MeshPhongMaterial({
                color: color,
                transparent: true,
                opacity: 0.4 * options.intensity,
                wireframe: false,
                emissive: color,
                emissiveIntensity: 0.3 * options.intensity
            });

            const edges = new THREE.EdgesGeometry(geometry);
            const wireframe = new THREE.LineSegments(edges, wireframeMaterial);
            const solid = new THREE.Mesh(geometry, solidMaterial);

            const boxGroup = new THREE.Group();
            boxGroup.add(wireframe);
            boxGroup.add(solid);

            // Spherical distribution
            const radius = 400;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;

            boxGroup.position.set(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(phi)
            );

            boxGroup.userData = {
                originalPosition: boxGroup.position.clone(),
                randomFactor: Math.random() * Math.PI * 2,
                rotationSpeed: Math.random() * 0.02,
                floatSpeed: Math.random() * 0.01,
                floatRange: Math.random() * 30 + 20
            };

            boxes.push(boxGroup);
            mainGroup.add(boxGroup);
        }

        return { boxes, mainGroup };
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        const time = this.clock.getElapsedTime();
        this.target.lerp(this.mouse, 0.1);

        Object.values(this.scenes).forEach(({ scene, camera, renderer, objects }) => {
            if (scene && camera && renderer && objects) {
                objects.boxes.forEach(box => {
                    const { randomFactor, rotationSpeed, floatSpeed, floatRange, originalPosition } = box.userData;
                    
                    // Rotation animation
                    box.rotation.x += rotationSpeed;
                    box.rotation.y += rotationSpeed * 0.5;
                    
                    // Floating animation
                    box.position.y = originalPosition.y + Math.sin(time * floatSpeed + randomFactor) * floatRange;
                    
                    // Mouse movement effect
                    box.rotation.x += this.target.y * 0.01;
                    box.rotation.y += this.target.x * 0.01;
                });

                objects.mainGroup.rotation.x += this.target.y * 0.001;
                objects.mainGroup.rotation.y += this.target.x * 0.001;

                renderer.render(scene, camera);
            }
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new ThreeBackground();
});