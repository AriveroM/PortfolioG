"use strict";

let container;
let camera, scene, renderer;
let sphere, uniforms, stars;
let mouseX = 0, mouseY = 0;
let lizaargScreenIndex = 0;
let pokedexGifIndex = 0;
let warcelonaGifIndex = 0;
let pokedexInterval, warcelonaInterval;

const lizaargImages = [
    './images/3.png',
    './images/4.png',
    './images/5.png',
    './images/6.png',
    './images/7.png',
    './images/8.png',
    './images/9.png',
    './images/10.png',
    './images/11.png',
    './images/12.png',
    './images/13.png',
    './images/14.png',
    './images/15.png',
    './images/16.png',
    './images/17.png',
];

const pokedexGifs = [
    './images/PokedexGif.gif',
    './images/PokedexGif2.gif',
    './images/PokedexGif3.gif',
];

const warcelonaGifs = [
    './images/Warcelona.gif',
];

const programLogos = [
    { src: './images/js.png', alt: 'JavaScript' },
    { src: './images/java.png', alt: 'Java' },
    { src: './images/cc.png', alt: 'C#' },
    { src: './images/unity.svg', alt: 'Unity' },
    { src: './images/vue.png', alt: 'Vue' },
    { src: './images/docker.png', alt: 'Docker' },
    { src: './images/php.png', alt: 'PHP' },
    { src: './images/three.png', alt: 'Three.js' },
    { src: './images/photo.png', alt: 'Photoshop' },
    { src: './images/ae.png', alt: 'After Effects' },
    { src: './images/illustrator.svg', alt: 'Illustrator' },
    { src: './images/premiere.svg', alt: 'Premiere Pro' },
    { src: './images/indesign.svg', alt: 'InDesign' },
    { src: './images/xd.svg', alt: 'Adobe XD' },
    { src: './images/figma.svg', alt: 'Figma' }
];

init();
animate();

function init() {
    container = document.getElementById('container');

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 500;

    scene = new THREE.Scene();

    // Esfera holográfica
    const geometry = new THREE.SphereGeometry(200, 64, 64);

    uniforms = {
        time: { value: 1.0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
    };

    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader(),
        fragmentShader: fragmentShader(),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthTest: false
    });

    sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Sistema de partículas (estrellas)
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 1000;
    const starsPositions = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount; i++) {
        starsPositions[i * 3] = Math.random() * 2000 - 1000;
        starsPositions[i * 3 + 1] = Math.random() * 2000 - 1000;
        starsPositions[i * 3 + 2] = Math.random() * 2000 - 1000;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));

    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 2 });
    stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);

    // Botones
    document.getElementById('btn-info').addEventListener('click', () => zoomIntoSphere('Info'));
    document.getElementById('btn-proyectos').addEventListener('click', () => zoomIntoSphere('Projects'));
    document.getElementById('btn-programas').addEventListener('click', () => zoomIntoSphere('Programs'));
    document.getElementById('btn-home').addEventListener('click', () => {
        zoomOutSphere();
        removeCarousel();
        removeProjectTitleScreen();
        removeLizaargScreen();
        removePokedexScreen();
        removeWarcelonaScreen();
        removeFoodLinkScreen();
        removePomodoroScreen();
        removeLaiaScreen();
        removeProgramasScreen();
        removeInfoScreen();
        resetButtons();
        resetTitleContainer(); // Reset title container to its initial state
    });
    document.getElementById('btn-info-corner').addEventListener('click', () => handleCornerButtonClick('Info'));
    document.getElementById('btn-proyectos-corner').addEventListener('click', () => handleCornerButtonClick('Projects'));
    document.getElementById('btn-programas-corner').addEventListener('click', () => handleCornerButtonClick('Programs'));
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    uniforms.resolution.value.x = renderer.domElement.width;
    uniforms.resolution.value.y = renderer.domElement.height;
}

function onDocumentMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    uniforms.time.value += 0.05;
    stars.rotation.y += 0.001;

    // Ajuste de la posición de la escena basada en la posición del ratón
    scene.position.x = mouseX * 50;
    scene.position.y = mouseY * 50;

    renderer.render(scene, camera);
}

function vertexShader() {
    return `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;
}

function fragmentShader() {
    return `
        uniform float time;
        uniform vec2 resolution;
        varying vec2 vUv;

        void main(void) {
            vec2 position = -1.0 + 2.0 * vUv;
            float len = length(position);
            float glow = exp(-len * len * 4.0) * 0.5;

            float r = sin(position.x * position.y * 10.0 + time * 0.5) * 0.5 + 0.5;
            float g = sin(position.x * position.y * 10.0 + time * 0.7) * 0.5 + 0.5;
            float b = sin(position.x * position.y * 10.0 + time * 0.9) * 0.5 + 0.5;

            gl_FragColor = vec4(r, g, b, glow);
        }
    `;
}

function zoomIntoSphere(buttonName) {
    // Animar la cámara para acercarse a la esfera
    gsap.to(camera.position, {
        duration: 2,
        z: 0,
        onUpdate: function() {
            camera.lookAt(sphere.position);
        },
        onComplete: function() {
            // Ocultar textos y botones actuales
            document.querySelector('.overlay').style.display = 'none';
            document.querySelector('.buttons').style.display = 'none';
            
            // Mostrar botones en la esquina superior derecha
            document.querySelector('.corner-buttons').style.display = 'flex';

            // Mostrar el título correspondiente
            showTitle(buttonName);
        }
    });

    // Animar la opacidad de los textos y botones actuales para desvanecerlos
    gsap.to('.overlay', { duration: 1, opacity: 0 });
    gsap.to('.buttons', { duration: 1, opacity: 0 });
}

function zoomOutSphere() {
    // Animar la cámara para alejarse de la esfera
    gsap.to(camera.position, {
        duration: 2,
        z: 500,
        onUpdate: function() {
            camera.lookAt(sphere.position);
        },
        onComplete: function() {
            // Mostrar textos y botones iniciales
            document.querySelector('.overlay').style.display = 'block';
            document.querySelector('.buttons').style.display = 'flex';
            
            // Ocultar botones en la esquina superior derecha
            document.querySelector('.corner-buttons').style.display = 'none';

            // Ocultar el título y el carrusel
            document.querySelector('.title-container').style.display = 'none';

            // Restaurar la opacidad de los textos y botones iniciales
            gsap.to('.overlay', { duration: 1, opacity: 1 });
            gsap.to('.buttons', { duration: 1, opacity: 1 });
        }
    });
}

function showTitle(title) {
    const titleElement = document.getElementById('title-text');
    titleElement.textContent = title;
    document.querySelector('.title-container').style.display = 'block';
    gsap.fromTo('.title-container', { opacity: 0 }, { duration: 1, opacity: 1, onComplete: () => {
        if (title === 'Projects') {
            createCarousel();
        } else if (title === 'Programs') {
            showProgramasScreen();
        } else if (title === 'Info') {
            showInfoScreen();
        }
    }});
}

function createCarousel() {
    const carouselHTML = `
        <section class="carousel" id="projects-carousel">
            <div class="carousel__slider">
                <ul class="carousel__list">
                    <li class="carousel__item" style="background-image: url('images/WarcelonaLogo.png');" 
                        data-title="Warcelona"
                        data-subtitle="Designer | Developer"
                        data-brief="Warcelona is a roguelite game inspired by vampire survivors."
                        onclick="handleCarouselItemClick('Warcelona')">
                    </li>
                    <li class="carousel__item" style="background-image: url('images/pokeApi.png');" 
                        data-title="Pokedex"
                        data-subtitle="Developer | Designer"
                        data-brief="A website for consulting the Pokedex and creating your own Pokemon team using the API."
                        onclick="handleCarouselItemClick('Pokedex')">
                    </li>
                    <li class="carousel__item" style="background-image: url('images/FLLogo.png');" 
                        data-title="FoodLink"
                        data-subtitle="Front-end Developer | Concept artist"
                        data-brief="A food delivery application for people in need."
                        onclick="handleCarouselItemClick('FoodLink')">
                    </li>
                    <li class="carousel__item" style="background-image: url('images/LaiaLogo.png');" 
                        data-title="Ens il.lumines?"
                        data-subtitle="Front-end Developer | Designer | Concept artist"
                        data-brief="A project of a landing page containing games for children to become aware of the environment."
                        onclick="handleCarouselItemClick('Ens il.lumines?')">
                    </li>
                    <li class="carousel__item" style="background-image: url('images/Lizaarg.png');" 
                        data-title="Lizaarg"
                        data-subtitle="Developer | Designer | Concept artist"
                        data-brief="An adventure and puzzle game about a lizard becoming a pirate."
                        onclick="handleLizaargClick()">
                    </li>
                    <li class="carousel__item" style="background-image: url('images/pomodoroLogo.png');" 
                        data-title="Pomodoro"
                        data-subtitle="Developer"
                        data-brief="A timer application to handle task management."
                        onclick="handleCarouselItemClick('Pomodoro')">
                    </li>
                </ul>
            </div>
            <div class="project-brief" id="project-brief">
                <p id="brief-text"></p>
            </div>
        </section>
    `;
    document.body.insertAdjacentHTML('beforeend', carouselHTML);
    initCarousel();
    attachCarouselItemEventListeners();
}

function removeCarousel() {
    const carousel = document.getElementById('projects-carousel');
    if (carousel) {
        carousel.remove();
    }
}

function initCarousel() {
    const carouselSlider = document.querySelector(".carousel__slider");
    const list = document.querySelector(".carousel__list");
    let list2;

    const speed = 0.6;

    const width = list.offsetWidth;
    let x = 0;
    let x2 = width;

    function clone() {
        list2 = list.cloneNode(true);
        carouselSlider.appendChild(list2);
        list2.style.left = `${width}px`;
    }

    function moveFirst() {
        x -= speed;

        if (width >= Math.abs(x)) {
            list.style.left = `${x}px`;
        } else {
            x = width;
        }
    }

    function moveSecond() {
        x2 -= speed;

        if (list2.offsetWidth >= Math.abs(x2)) {
            list2.style.left = `${x2}px`;
        } else {
            x2 = width;
        }
    }

    function hover() {
        clearInterval(a);
        clearInterval(b);
    }

    function unhover() {
        a = setInterval(moveFirst, 10);
        b = setInterval(moveSecond, 10);
    }

    clone();

    let a = setInterval(moveFirst, 10);
    let b = setInterval(moveSecond, 10);

    carouselSlider.addEventListener("mouseenter", hover);
    carouselSlider.addEventListener("mouseleave", unhover);
}

function showProjectInfo(title, subtitle, brief) {
    const projectTitle = document.getElementById('project-title');
    const projectSubtitle = document.getElementById('project-subtitle');
    const projectBriefText = document.getElementById('brief-text');

    projectTitle.textContent = title;
    projectSubtitle.textContent = subtitle;
    projectBriefText.textContent = brief;

    document.querySelector('.project-info').style.display = 'block';
    document.querySelector('.project-brief').style.display = 'block';
    gsap.to('.project-info', { opacity: 1, duration: 0.5 });
    gsap.to('.project-brief', { opacity: 1, duration: 0.5 });
}

function hideProjectInfo() {
    gsap.to('.project-info', { opacity: 0, duration: 0.5 });       
    gsap.to('.project-brief', { opacity: 0, duration: 0.5 });
}

function handleCarouselItemMouseOut(event) {
    const relatedTarget = event.relatedTarget;
    const carouselItems = document.querySelectorAll('.carousel__item');
    let isHoveringOverAnotherItem = false;

    carouselItems.forEach(item => {
        if (item.contains(relatedTarget)) {
            isHoveringOverAnotherItem = true;
        }
    });

    if (!isHoveringOverAnotherItem) {
        hideProjectInfo();
    }
}

function attachCarouselItemEventListeners() {
    const carouselItems = document.querySelectorAll('.carousel__item');
    carouselItems.forEach(item => {
        item.addEventListener('mouseover', event => {
            const title = item.getAttribute('data-title');
            const subtitle = item.getAttribute('data-subtitle');
            const brief = item.getAttribute('data-brief');
            showProjectInfo(title, subtitle, brief);
        });

        item.addEventListener('mouseout', handleCarouselItemMouseOut);
    });
}

function handleCarouselItemClick(projectName) {
    if (projectName === 'Pokedex') {
        handlePokedexClick();
    } else if (projectName === 'Warcelona') {
        handleWarcelonaClick();
    } else if (projectName === 'FoodLink') {
        handleFoodLinkClick();
    } else if (projectName === 'Pomodoro') {
        handlePomodoroClick();
    } else if (projectName === 'Ens il.lumines?') {
        handleLaiaClick();
    } else {
        removeCarousel();
        hideProjectInfo();
        gsap.to('.title-container', {
            duration: 1,
            y: 100,
            opacity: 0,
            ease: "bounce.in",
            onComplete: () => {
                gsap.to('.title-container', {
                    duration: 1,
                    y: -1000, // Move out of the screen
                    opacity: 0, // Set opacity to 0
                    ease: "bounce.out",
                    onComplete: () => {
                        showProjectTitleScreen(projectName);
                    }
                });
            }
        });
    }
}

function showProjectTitleScreen(projectName) {
    const projectTitleScreenHTML = `
        <div class="project-title-screen">
            <h1>${projectName}</h1>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', projectTitleScreenHTML);
    gsap.fromTo('.project-title-screen', { opacity: 0 }, { duration: 1, opacity: 1 });
}

function removeProjectTitleScreen() {
    const projectTitleScreen = document.querySelector('.project-title-screen');
    if (projectTitleScreen) {
        projectTitleScreen.remove();
    }
}

function handleLizaargClick() {
    removeCarousel();
    hideProjectInfo();
    gsap.to('.title-container', {
        duration: 1,
        y: 100,
        opacity: 0,
        ease: "bounce.in",
        onComplete: () => {
            gsap.to('.title-container', {
                duration: 1,
                y: -1000, // Move out of the screen
                opacity: 0, // Set opacity to 0,
                ease: "bounce.out",
                onComplete: () => {
                    showLizaargScreen();
                }
            });
        }
    });
}

function showLizaargScreen() {
    const lizaargScreenHTML = `        
        <div class="lizaarg-screen" id="lizaarg-screen">
            <img src="${lizaargImages[lizaargScreenIndex]}" alt="Lizaarg Image">           
        </div>
        <div class="lizaarg-title" id="lizaarg-title">
            <img src="./images/LizaargLogo.png" alt="Lizaarg Title">
        </div>
        <div class="navigation-buttons">
            <button id="prev-button" onclick="prevLizaargImage()"></button>
            <button id="next-button" onclick="nextLizaargImage()"></button>
        </div>
        <div class="gitButton" id="gitButton">
        <a href="https://github.com/AriveroM/Lizaard" target="_blank" class="gitButton-link">
            <img src="./images/git.png" alt="GitHub" class="gitButton-img">
        </a>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', lizaargScreenHTML);

    const lizaargScreen = document.getElementById('lizaarg-screen');
    lizaargScreen.addEventListener('mousemove', handleMouseMove);
    lizaargScreen.addEventListener('mouseleave', resetTilt);
}

function handleMouseMove(event) {
    const lizaargScreen = document.getElementById('lizaarg-screen');
    const { left, top, width, height } = lizaargScreen.getBoundingClientRect();
    const x = (event.clientX - left) / width - 0.5;
    const y = (event.clientY - top) / height - 0.5;

    const rotationX = y * 15; // Adjust the rotation factor as needed
    const rotationY = x * 15; // Adjust the rotation factor as needed

    lizaargScreen.style.transform = `translate(-50%, -50%) rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
}

function resetTilt() {
    const lizaargScreen = document.getElementById('lizaarg-screen');
    lizaargScreen.style.transform = 'translate(-50%, -50%) rotateX(0) rotateY(0)';
}

function nextLizaargImage() {
    lizaargScreenIndex = (lizaargScreenIndex + 1) % lizaargImages.length;
    document.querySelector('.lizaarg-screen img').src = lizaargImages[lizaargScreenIndex];
}

function prevLizaargImage() {
    lizaargScreenIndex = (lizaargScreenIndex - 1 + lizaargImages.length) % lizaargImages.length;
    document.querySelector('.lizaarg-screen img').src = lizaargImages[lizaargScreenIndex];
}

function handleCornerButtonClick(title) {
    removeLizaargScreen(); 
    removePokedexScreen();
    removeWarcelonaScreen();
    removeFoodLinkScreen();
    removePomodoroScreen();
    removeLaiaScreen();
    removeProgramasScreen();
    removeInfoScreen();
    removeCarousel(); // Remove the carousel when any corner button is clicked
    resetTitleContainer(); // Reset the title container
    showTitle(title);   
}

function removeLizaargScreen() {
    const lizaargScreen = document.getElementById('lizaarg-screen');
    const lizaargTitle = document.getElementById('lizaarg-title');
    const gitImage = document.getElementById('gitButton');
    if (lizaargScreen) {
        lizaargScreen.remove();
        lizaargTitle.remove();
        gitImage.remove();
    }
    const navigationButtons = document.querySelector('.navigation-buttons');
    if (navigationButtons) {
        navigationButtons.remove();
    }
}

function removePokedexScreen() {
    const pokedexScreen = document.getElementById('pokedex-screen');
    const pokedexTitle = document.getElementById('pokedex-title');
    const stockImages = document.getElementById('stock-images');
    const gitImage = document.getElementById('gitButton');
    if (pokedexScreen) {
        pokedexScreen.remove();
        pokedexTitle.remove();
        stockImages.remove();
        gitImage.remove();
    }
    clearInterval(pokedexInterval); // Clear interval to avoid mixing
}

function removeWarcelonaScreen() {
    const warcelonaScreen = document.getElementById('warcelona-screen');
    const warcelonaTitle = document.getElementById('warcelona-title');
    const laiaImage = document.getElementById('laia-images');
    const gitImage = document.getElementById('gitButton');    
    if (warcelonaScreen) {
        warcelonaScreen.remove();
        warcelonaTitle.remove();
        laiaImage.remove();
        gitImage.remove();
    }
    clearInterval(warcelonaInterval); // Clear interval to avoid mixing
}

function removeFoodLinkScreen() {
    const foodLinkScreen = document.getElementById('foodlink-screen');
    const foodLinkTitle = document.getElementById('foodlink-title');
    const socialButtons = document.getElementById('socialButtons');
    if (foodLinkScreen) {
        foodLinkScreen.remove();
        foodLinkTitle.remove();
        if (socialButtons) socialButtons.remove();
    }
}

function removePomodoroScreen() {
    const pomodoroScreen = document.getElementById('pomodoro-screen');
    const pomodoroTitle = document.getElementById('pomodoro-title');
    const gitImage = document.getElementById('gitButton');    
    if (pomodoroScreen) {
        pomodoroScreen.remove();
        pomodoroTitle.remove();
        gitImage.remove();
    }
}

function removeLaiaScreen() {
    const laiaScreen = document.getElementById('laia-screen');
    const laiaTitle = document.getElementById('laia-title');
    const gitImage = document.getElementById('gitButton');
    if (laiaScreen) {
        laiaScreen.remove();
        laiaTitle.remove();
        gitImage.remove();
    }
}

function removeProgramasScreen() {
    const programasScreen = document.getElementById('programas-screen');
    const programasTitle = document.getElementById('programas-title');
    if (programasScreen) {
        programasScreen.remove();
        programasTitle.remove();
    }
}

function removeInfoScreen() {
    const infoScreen = document.getElementById('info-screen');
    const infoTitle = document.getElementById('info-title');
    if (infoScreen) {
        infoScreen.remove();
        infoTitle.remove();
    }
}

function resetTitleContainer() {
    const titleContainer = document.querySelector('.title-container');
    titleContainer.style.display = 'none';
    titleContainer.style.opacity = '0';
    titleContainer.style.transform = 'translateY(0)';
}

function resetButtons() {
    document.querySelector('.corner-buttons').style.display = 'none';
    resetTitleContainer();
}

function handlePokedexClick() {
    window.open('https://ariverom.github.io/PokedexJ/', '_blank');
}

function showPokedexScreen() {
    const pokedexScreenHTML = `
        <div class="pokedex-title" id="pokedex-title">
            <h1>Pokedex</h1>
        </div>        
        <div class="pokedex-screen" id="pokedex-screen">        
            <div class="gif-container" id="gif-container">
                <img src="${pokedexGifs[pokedexGifIndex]}" alt="Pokedex Gif">
            </div>
        </div>
        <div class="stock-images" id="stock-images">
            <img src="./images/mewtoCard.png" alt="Stock Image 1" class="stock-image">             
        </div>
        <div class="gitButton" id="gitButton">
            <a href="https://ariverom.github.io/PokedexVue/" target="_blank" class="gitButton-link">
                <img src="./images/git.png" alt="GitHub" class="gitButton-img">
            </a>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', pokedexScreenHTML);

    const pokedexScreen = document.getElementById('pokedex-screen');
    pokedexScreen.addEventListener('mousemove', handleMouseMove);
    pokedexScreen.addEventListener('mouseleave', resetTilt);
    startPokedexGifRotation();
}

function handleWarcelonaClick() {
    window.open('https://ariverom.github.io', '_blank');
}

function showWarcelonaScreen() {
    const warcelonaScreenHTML = `
        <div class="warcelona-title" id="warcelona-title">
            <h1>Warcelona</h1>
        </div>        
        <div class="warcelona-screen" id="warcelona-screen">        
            <div class="gif-container" id="warcelona-gif-container">
                <img src="${warcelonaGifs[warcelonaGifIndex]}" alt="Warcelona Gif">
            </div>
        </div>
        <div class="laia-images" id="laia-images">
        <img src="./images/Laia.png" alt="Stock Image 1" class="laia-image">             
        </div>
        <div class="gitButton" id="gitButton">
        <a href="https://ariverom.github.io" target="_blank" class="gitButton-link">
            <img src="./images/git.png" alt="GitHub" class="gitButton-img">
        </a>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', warcelonaScreenHTML);

    const warcelonaScreen = document.getElementById('warcelona-screen');
    warcelonaScreen.addEventListener('mousemove', handleMouseMove);
    warcelonaScreen.addEventListener('mouseleave', resetTilt);
    startWarcelonaGifRotation();
}

function showFoodLinkScreen() {
    const foodLinkScreenHTML = `
        <div class="foodlink-title" id="foodlink-title">
            <h1>FoodLink</h1>
        </div>
        <div class="foodlink-screen" id="foodlink-screen">
            <div class="foodlink-container" id="foodlink-container">
                <img src="./images/foodlink.gif" alt="FoodLink Gif">
            </div>
        </div>
        <div class="social-buttons" id="socialButtons">
            <div class="gitButton">
                <a href="https://ariverom.github.io" target="_blank" class="gitButton-link">
                    <img src="./images/git.png" alt="GitHub" class="gitButton-img">
                </a>
            </div>
            <div class="gitButton">
                <a href="https://www.figma.com/design/hqw4YOPnQWNbxBjMhWi1dI/app-riders-solidarios?node-id=0-1&p=f&t=RKuD5tRANth3EB5z-0" target="_blank" class="gitButton-link">
                    <img src="./images/figma.svg" alt="Figma" class="gitButton-img">
                </a>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', foodLinkScreenHTML);

    const foodlinkScreen = document.getElementById('foodlink-screen');
    foodlinkScreen.addEventListener('mousemove', handleMouseMove);
    foodlinkScreen.addEventListener('mouseleave', resetTilt);
}

function handleFoodLinkClick() {
    removeCarousel();
    hideProjectInfo();
    gsap.to('.title-container', {
        duration: 1,
        y: 100,
        opacity: 0,
        ease: "bounce.in",
        onComplete: () => {
            gsap.to('.title-container', {
                duration: 1,
                y: -1000, // Move out of the screen
                opacity: 0, // Set opacity to 0,
                ease: "bounce.out",
                onComplete: () => {
                    showFoodLinkScreen();
                }
            });
        }
    });
}

function showPomodoroScreen() {
    const pomodoroScreenHTML = `
        <div class="pomodoro-title" id="pomodoro-title">
            <h1>Pomodoro</h1>
        </div>
        <div class="pomodoro-screen" id="pomodoro-screen">
            <div class="pomodoro-container" id="pomodoro-container">
                <img src="./images/pomodoro.gif" alt="Pomodoro Gif">
            </div>
        </div>
        <div class="gitButton" id="gitButton">
        <a href="https://ariverom.github.io/Pomodoro/" target="_blank" class="gitButton-link">
            <img src="./images/git.png" alt="GitHub" class="gitButton-img">
        </a>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', pomodoroScreenHTML);

    const pomodoroScreen = document.getElementById('pomodoro-screen');
    pomodoroScreen.addEventListener('mousemove', handleMouseMove);
    pomodoroScreen.addEventListener('mouseleave', resetTilt);
}

function handlePomodoroClick() {
    window.open('https://ariverom.github.io/pomodoro2/', '_blank');
}

function showLaiaScreen() {
    const laiaScreenHTML = `
        <div class="laia-title" id="laia-title">
            <h1>Ens il.lumines?</h1>
        </div>
        <div class="laia-screen" id="laia-screen">
            <div class="laia-container" id="laia-container">
                <img src="./images/tierra.gif" alt="Laia Gif">
            </div>
        </div>
        <div class="gitButton" id="gitButton">
        <a href="https://github.com/jeansterj/laiaGame" target="_blank" class="gitButton-link">
            <img src="./images/git.png" alt="GitHub" class="gitButton-img">
        </a>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', laiaScreenHTML);

    const laiaScreen = document.getElementById('laia-screen');
    laiaScreen.addEventListener('mousemove', handleMouseMove);
    laiaScreen.addEventListener('mouseleave', resetTilt);
}

function handleLaiaClick() {
    removeCarousel();
    hideProjectInfo();
    gsap.to('.title-container', {
        duration: 1,
        y: 100,
        opacity: 0,
        ease: "bounce.in",
        onComplete: () => {
            gsap.to('.title-container', {
                duration: 1,
                y: -1000, // Move out of the screen
                opacity: 0, // Set opacity to 0,
                ease: "bounce.out",
                onComplete: () => {
                    showLaiaScreen();
                }
            });
        }
    });
}

function showProgramasScreen() {
    const programasScreenHTML = `
        <div class="programas-title" id="programas-title">
        </div>        
        <div class="programas-screen" id="programas-screen">        
            <div class="card-container" id="card-container">
                ${programLogos.map(logo => `
                    <div class="program-card">
                        <img src="${logo.src}" alt="${logo.alt}">
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', programasScreenHTML);
}

function showInfoScreen() {
    const infoScreenHTML = `
        <div class="info-title" id="info-title">
            <h1>About Me</h1>
        </div>        
        <div class="info-screen-container" id="info-screen-container">
            <div class="info-screen" id="info-screen">
                <div class="info-column">
                    <div class="info-card square">
                        <a href="mailto:sariveromarin@gmail.com?subject=Asunto%20del%20Correo&body=Este%20es%20el%20cuerpo%20del%20correo.">
                            <img src="images/Gmail.png" alt="Gmail">
                        </a>
                    </div>    
                    <div class="info-card vertical" id="aboutMe">                        
                        <h2 class="hh">Skills</h2>
                        <p class="pa">Hard-working</p>
                        <p class="pa">Disciplined</p>
                        <p class="pa">Team-worker</p>
                        <p class="pa">Problem-solver</p>
                        <p class="pa">Creative thinker</p>
                        <p class="pa">Adaptable</p>
                        <p class="pa">Strong communicator</p>
                        <p class="pa">Detail-oriented</p>
                    </div>                         
                </div>
                <div class="info-column">
                    <div class="info-card vertical" id="skills">
                        <h2 class="hh">About Me</h2>
                        <p>Hello! I'm a Web Developer and Graphic Designer passionate about front-end technologies, visual communication, and creating meaningful digital experiences. I enjoy building interfaces that are both functional and visually compelling, combining my programming skills with a strong eye for design.</p>
                    </div>               
                    <div class="info-card horizontal" id="education">
                        <h2 class="hh">Education</h2>
                        <p>I hold a degree in Web Application Development (DAW) and a degree in Video Game Design. I have also complemented my formal education with self-directed learning to stay up to date with new technologies and frameworks.</p>
                    </div>
                </div>
                <div class="info-column">             
                    <div class="info-card vertical" id="goals">
                        <h2 class="hh">Goals</h2>
                        <p>My goal is to grow as both a web developer and a graphic designer, while specialising in UX/UI design. I'm particularly drawn to crafting intuitive, user-centred experiences — but without losing sight of the technical and visual craftsmanship that make a product truly stand out.</p>
                    </div>
                    <div class="info-card square">
                        <a href="https://github.com/AriveroM" target="_blank">
                            <img src="./images/git.png" alt="GitHub">
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.getElementById('container').insertAdjacentHTML('beforeend', infoScreenHTML);
    gsap.fromTo('.info-card', { opacity: 0 }, { duration: 1, opacity: 1 });
}

function startPokedexGifRotation() {
    clearInterval(pokedexInterval); 
    pokedexInterval = setInterval(() => {
        nextPokedexGif();
    }, 9000); 
}

function startWarcelonaGifRotation() {
    clearInterval(warcelonaInterval);
    warcelonaInterval = setInterval(() => {
        nextWarcelonaGif();
    }, 9000); 
}

function nextPokedexGif() {
    pokedexGifIndex = (pokedexGifIndex + 1) % pokedexGifs.length;
    document.querySelector('.gif-container img').src = pokedexGifs[pokedexGifIndex];
}

function nextWarcelonaGif() {
    warcelonaGifIndex = (warcelonaGifIndex + 1) % warcelonaGifs.length;
    document.querySelector('.gif-container img').src = warcelonaGifs[warcelonaGifIndex];
}
