import * as THREE from
  "https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js";


/* =========================================================
   DOM
========================================================= */

const rooms =
  [...document.querySelectorAll(".room")];


const navLinks =
  [...document.querySelectorAll("[data-page]")];


const nextTriggers =
  [...document.querySelectorAll("[data-next]")];


const previousButton =
  document.getElementById(
    "previous-button"
  );


const nextButton =
  document.getElementById(
    "next-button"
  );


const pageNumber =
  document.getElementById(
    "page-number"
  );


const progressFill =
  document.getElementById(
    "progress-fill"
  );


const sectionName =
  document.getElementById(
    "section-name"
  );


const transitionLayer =
  document.getElementById(
    "transition-layer"
  );


const sectionNames = [

  "Introduction",

  "Perspective",

  "Method",

  "Fields",

  "Research",

  "Creation",

  "Connection"

];


let currentRoom =
  0;


let isTransitioning =
  false;


/* =========================================================
   UI
========================================================= */

function updateUI() {


  navLinks.forEach(
    link => {


      const page =
        Number(
          link.dataset.page
        );


      link.classList.toggle(

        "active",

        page === currentRoom

      );


    }
  );


  pageNumber.textContent =

    String(
      currentRoom + 1
    )

      .padStart(
        2,
        "0"
      );


  progressFill.style.width =

    `${
      (
        (
          currentRoom + 1
        )
        /
        rooms.length
      )
      *
      100
    }%`;


  sectionName.textContent =

    sectionNames[
      currentRoom
    ];


  history.replaceState(

    null,

    "",

    `#${
      rooms[currentRoom].id
    }`

  );

}


/* =========================================================
   PAGE FLIP
========================================================= */

function goToRoom(
  targetIndex
) {


  if (

    isTransitioning

    ||

    targetIndex ===
    currentRoom

    ||

    targetIndex < 0

    ||

    targetIndex >=
    rooms.length

  ) {

    return;

  }


  isTransitioning =
    true;


  const oldIndex =
    currentRoom;


  const oldRoom =
    rooms[
      oldIndex
    ];


  const newRoom =
    rooms[
      targetIndex
    ];


  const forward =

    targetIndex >
    oldIndex;


  rooms.forEach(
    room => {


      room.classList.remove(

        "exit-forward",

        "enter-forward",

        "exit-backward",

        "enter-backward"

      );


    }
  );


  transitionLayer
    .classList
    .remove(
      "active"
    );


  void
  transitionLayer.offsetWidth;


  transitionLayer
    .classList
    .add(
      "active"
    );


  oldRoom
    .classList
    .remove(
      "active"
    );


  oldRoom
    .classList
    .add(

      forward

        ? "exit-forward"

        : "exit-backward"

    );


  newRoom
    .classList
    .add(

      forward

        ? "enter-forward"

        : "enter-backward"

    );


  currentRoom =
    targetIndex;


  updateUI();


  updateGalaxyTarget(
    currentRoom
  );


  setTimeout(
    () => {


      oldRoom
        .classList
        .remove(

          "exit-forward",

          "exit-backward"

        );


      newRoom
        .classList
        .remove(

          "enter-forward",

          "enter-backward"

        );


      newRoom
        .classList
        .add(
          "active"
        );


      transitionLayer
        .classList
        .remove(
          "active"
        );


      isTransitioning =
        false;


    },

    1120

  );

}


/* =========================================================
   NAVIGATION
========================================================= */

navLinks.forEach(
  link => {


    link.addEventListener(

      "click",

      event => {


        event.preventDefault();


        goToRoom(

          Number(
            link.dataset.page
          )

        );


      }

    );


  }
);


nextTriggers.forEach(
  button => {


    button.addEventListener(

      "click",

      () => {


        goToRoom(

          currentRoom + 1

        );


      }

    );


  }
);


previousButton.addEventListener(

  "click",

  () => {


    goToRoom(

      currentRoom - 1

    );


  }

);


nextButton.addEventListener(

  "click",

  () => {


    goToRoom(

      currentRoom + 1

    );


  }

);


/* =========================================================
   WHEEL NAVIGATION
========================================================= */

let wheelAccumulator =
  0;


let wheelResetTimer;


/*
  This still allows internal content to scroll
  before changing sections.
*/

window.addEventListener(

  "wheel",

  event => {


    if (
      isTransitioning
    ) {

      return;

    }


    const content =

      rooms[
        currentRoom
      ]
      .querySelector(
        ".room-content"
      );


    if (content) {


      const canScroll =

        content.scrollHeight >
        content.clientHeight + 2;


      if (canScroll) {


        const atTop =

          content.scrollTop <= 1;


        const atBottom =

          content.scrollTop +
          content.clientHeight >=
          content.scrollHeight - 1;


        if (

          event.deltaY > 0

          &&

          !atBottom

        ) {

          return;

        }


        if (

          event.deltaY < 0

          &&

          !atTop

        ) {

          return;

        }

      }

    }


    wheelAccumulator +=
      event.deltaY;


    clearTimeout(
      wheelResetTimer
    );


    wheelResetTimer =

      setTimeout(
        () => {


          wheelAccumulator =
            0;


        },
        150
      );


    if (
      wheelAccumulator > 75
    ) {


      goToRoom(

        currentRoom + 1

      );


      wheelAccumulator =
        0;

    }


    else if (
      wheelAccumulator < -75
    ) {


      goToRoom(

        currentRoom - 1

      );


      wheelAccumulator =
        0;

    }


  },

  {
    passive: true
  }

);


/* =========================================================
   KEYBOARD
========================================================= */

window.addEventListener(

  "keydown",

  event => {


    if (

      event.key ===
      "ArrowDown"

      ||

      event.key ===
      "ArrowRight"

      ||

      event.key ===
      "PageDown"

    ) {


      goToRoom(

        currentRoom + 1

      );

    }


    if (

      event.key ===
      "ArrowUp"

      ||

      event.key ===
      "ArrowLeft"

      ||

      event.key ===
      "PageUp"

    ) {


      goToRoom(

        currentRoom - 1

      );

    }


  }

);


/* =========================================================
   TOUCH
========================================================= */

let touchStartY =
  0;


window.addEventListener(

  "touchstart",

  event => {


    touchStartY =

      event
        .changedTouches[0]
        .clientY;


  },

  {
    passive: true
  }

);


window.addEventListener(

  "touchend",

  event => {


    const touchEndY =

      event
        .changedTouches[0]
        .clientY;


    const difference =

      touchStartY -
      touchEndY;


    if (
      Math.abs(
        difference
      )
      <
      60
    ) {

      return;

    }


    if (
      difference > 0
    ) {


      goToRoom(

        currentRoom + 1

      );


    } else {


      goToRoom(

        currentRoom - 1

      );

    }


  },

  {
    passive: true
  }

);


/* =========================================================
   CUSTOM CURSOR
========================================================= */

const cursor =

  document.getElementById(
    "cursor"
  );


let targetCursorX =
  -100;


let targetCursorY =
  -100;


let cursorX =
  -100;


let cursorY =
  -100;


window.addEventListener(

  "pointermove",

  event => {


    targetCursorX =
      event.clientX;


    targetCursorY =
      event.clientY;


    cursor
      .classList
      .add(
        "visible"
      );


  }

);


function animateCursor() {


  cursorX +=

    (
      targetCursorX -
      cursorX
    )

    *
    .55;


  cursorY +=

    (
      targetCursorY -
      cursorY
    )

    *
    .55;


  cursor.style.left =
    `${cursorX}px`;


  cursor.style.top =
    `${cursorY}px`;


  requestAnimationFrame(
    animateCursor
  );

}


animateCursor();


document.addEventListener(

  "pointerover",

  event => {


    const interactive =

      event.target.closest(

        `
        a,
        button,
        .domain-card,
        .project-card,
        .thought,
        .research-item
        `

      );


    cursor
      .classList
      .toggle(

        "interactive",

        Boolean(
          interactive
        )

      );


  }

);


window.addEventListener(

  "pointerdown",

  () => {


    cursor
      .classList
      .add(
        "pressed"
      );


  }

);


window.addEventListener(

  "pointerup",

  () => {


    cursor
      .classList
      .remove(
        "pressed"
      );


  }

);


document.documentElement
  .addEventListener(

    "mouseleave",

    () => {


      cursor
        .classList
        .remove(
          "visible"
        );


    }

  );


/* =========================================================
   THREE.JS VARIABLES
========================================================= */

let scene;

let camera;

let renderer;

let clock;


let galaxy;

let galaxyStars;

let galaxyDust;

let galaxyCore;

let backgroundStars;

let neuralNetwork;

let brightNodes;


let galaxyStarData =
  [];


let galaxyTarget = {

  x: 2.65,

  y: 0,

  z: 0,

  scale: 1

};


/* =========================================================
   GALAXY STATES
========================================================= */

const galaxyStates = [


  {

    x: 2.65,

    y: 0,

    z: 0,

    scale: 1

  },


  {

    x: 2.55,

    y: .06,

    z: -.08,

    scale: .97

  },


  {

    x: 2.72,

    y: -.04,

    z: -.12,

    scale: 1.02

  },


  {

    x: 2.58,

    y: .07,

    z: -.08,

    scale: .98

  },


  {

    x: 2.70,

    y: 0,

    z: -.14,

    scale: 1.01

  },


  {

    x: 2.55,

    y: -.04,

    z: -.09,

    scale: .98

  },


  {

    x: 2.66,

    y: .01,

    z: -.06,

    scale: 1.02

  }


];


/* =========================================================
   INITIALISE WORLD
========================================================= */

function initWorld() {


  const container =

    document.getElementById(
      "world"
    );


  scene =
    new THREE.Scene();


  camera =

    new THREE
      .PerspectiveCamera(

        43,

        window.innerWidth
        /
        window.innerHeight,

        .1,

        100

      );


  camera.position.set(

    0,

    0,

    8

  );


  renderer =

    new THREE
      .WebGLRenderer({

        antialias:
          true,

        alpha:
          true,

        powerPreference:
          "high-performance"

      });


  renderer.setPixelRatio(

    Math.min(

      window.devicePixelRatio,

      1.7

    )

  );


  renderer.setSize(

    window.innerWidth,

    window.innerHeight

  );


  renderer.outputColorSpace =

    THREE.SRGBColorSpace;


  renderer.setClearColor(

    0x000000,

    0

  );


  container.appendChild(

    renderer.domElement

  );


  document.body
    .classList
    .add(
      "webgl-ready"
    );


  clock =
    new THREE.Clock();


  createGalaxy();

  createBackgroundStars();

  createLighting();


  window.addEventListener(

    "resize",

    resizeWorld

  );


  animateWorld();

}


/* =========================================================
   CREATE GALAXY
========================================================= */

function createGalaxy() {


  galaxy =
    new THREE.Group();


  galaxy.position.set(

    2.65,

    0,

    0

  );


  /*
    Tilted enough to reveal depth,
    but not so much that it becomes
    a flat astronomical disk.
  */

  galaxy.rotation.x =
    -.43;


  galaxy.rotation.z =
    -.18;


  scene.add(
    galaxy
  );


  createGalaxyCore();

  createGalaxyStars();

  createSpiralStreams();

  createNeuralNetwork();

  createGalaxyDust();

  createOuterNodes();

}


/* =========================================================
   GALAXY CORE
========================================================= */

function createGalaxyCore() {


  galaxyCore =
    new THREE.Group();


  galaxy.add(
    galaxyCore
  );


  /*
    Brightest point.
  */

  const core =

    new THREE.Mesh(


      new THREE
        .SphereGeometry(

          .11,

          32,

          32

        ),


      new THREE
        .MeshBasicMaterial({

          color:
            0xffedca,

          transparent:
            true,

          opacity:
            .92,

          blending:
            THREE.AdditiveBlending

        })


    );


  galaxyCore.add(
    core
  );


  /*
    Warm inner atmosphere.
  */

  const glow1 =

    new THREE.Mesh(


      new THREE
        .SphereGeometry(

          .28,

          32,

          32

        ),


      new THREE
        .MeshBasicMaterial({

          color:
            0xe1b270,

          transparent:
            true,

          opacity:
            .12,

          side:
            THREE.BackSide,

          blending:
            THREE.AdditiveBlending

        })


    );


  galaxyCore.add(
    glow1
  );


  /*
    Blue-white outer atmosphere.
  */

  const glow2 =

    new THREE.Mesh(


      new THREE
        .SphereGeometry(

          .55,

          32,

          32

        ),


      new THREE
        .MeshBasicMaterial({

          color:
            0x8096b3,

          transparent:
            true,

          opacity:
            .035,

          side:
            THREE.BackSide,

          blending:
            THREE.AdditiveBlending

        })


    );


  galaxyCore.add(
    glow2
  );

}


/* =========================================================
   MAIN GALAXY STARS
========================================================= */

function createGalaxyStars() {


  /*
    Increase this to 10000+ if your
    computer handles it comfortably.
  */

  const count =
    7600;


  const positions =

    new Float32Array(
      count * 3
    );


  const colors =

    new Float32Array(
      count * 3
    );


  const sizes =

    new Float32Array(
      count
    );


  galaxyStarData =
    [];


  const warmGold =

    new THREE.Color(
      0xe0ae6a
    );


  const ivory =

    new THREE.Color(
      0xf1e4ce
    );


  const coolBlue =

    new THREE.Color(
      0x8098b7
    );


  const paleBlue =

    new THREE.Color(
      0xb1c3d8
    );


  const armCount =
    5;


  for (

    let i = 0;

    i < count;

    i++

  ) {


    /*
      Bias stars toward centre.
    */

    const distribution =

      Math.pow(

        Math.random(),

        1.72

      );


    const radius =

      .12

      +

      distribution
      *
      3.35;


    const arm =

      i
      %
      armCount;


    const baseAngle =

      (
        arm
        /
        armCount
      )

      *

      Math.PI
      *
      2;


    const spiral =

      radius
      *
      1.58;


    /*
      Stars farther from the centre
      become less tightly constrained
      to the spiral.
    */

    const spread =

      (
        Math.random()
        -
        .5
      )

      *

      (
        .16
        +
        radius
        *
        .16
      );


    const angle =

      baseAngle

      +

      spiral

      +

      spread;


    const radialNoise =

      (
        Math.random()
        -
        .5
      )

      *

      (
        .08
        +
        radius
        *
        .045
      );


    const actualRadius =

      radius
      +
      radialNoise;


    const x =

      Math.cos(
        angle
      )

      *
      actualRadius;


    const z =

      Math.sin(
        angle
      )

      *
      actualRadius;


    /*
      Central region is thicker.

      Outer arms gradually become thin.
    */

    const thickness =

      .035

      +

      Math.max(

        0,

        1
        -
        radius
        /
        3.5

      )

      *
      .26;


    const y =

      (
        Math.random()
        -
        .5
      )

      *
      thickness;


    positions[
      i * 3
    ] = x;


    positions[
      i * 3 + 1
    ] = y;


    positions[
      i * 3 + 2
    ] = z;


    /*
      Colour distribution.
    */

    const choice =
      Math.random();


    let colour;


    if (
      choice < .09
    ) {


      colour =
        paleBlue.clone();


    }

    else if (
      choice < .23
    ) {


      colour =
        coolBlue.clone();


    }

    else if (
      choice < .49
    ) {


      colour =
        ivory.clone();


    }

    else {


      colour =
        warmGold.clone();

    }


    /*
      Core stars lean toward ivory.
    */

    if (
      radius < .75
    ) {


      colour.lerp(

        ivory,

        .45

      );

    }


    colors[
      i * 3
    ] = colour.r;


    colors[
      i * 3 + 1
    ] = colour.g;


    colors[
      i * 3 + 2
    ] = colour.b;


    /*
      Mostly tiny points.

      Only a few stars become
      visible sparkle points.
    */

    let size;


    if (
      Math.random() > .982
    ) {


      size =

        .035

        +

        Math.random()
        *
        .027;


    }

    else {


      size =

        .007

        +

        Math.random()
        *
        .015;

    }


    sizes[i] =
      size;


    galaxyStarData.push({

      baseSize:
        size,

      phase:

        Math.random()
        *
        Math.PI
        *
        2,

      speed:

        .35
        +
        Math.random()
        *
        1.25

    });


  }


  const geometry =

    new THREE
      .BufferGeometry();


  geometry.setAttribute(

    "position",

    new THREE
      .BufferAttribute(

        positions,

        3

      )

  );


  geometry.setAttribute(

    "color",

    new THREE
      .BufferAttribute(

        colors,

        3

      )

  );


  geometry.setAttribute(

    "size",

    new THREE
      .BufferAttribute(

        sizes,

        1

      )

  );


  const material =

    new THREE
      .ShaderMaterial({


        vertexColors:
          true,


        transparent:
          true,


        depthWrite:
          false,


        blending:
          THREE.AdditiveBlending,


        vertexShader: `


          attribute float size;


          varying vec3 vColor;


          void main() {


            vColor =
              color;


            vec4 mvPosition =

              modelViewMatrix

              *

              vec4(
                position,
                1.0
              );


            gl_PointSize =

              size

              *

              820.0

              /

              max(
                1.0,
                -mvPosition.z
              );


            gl_Position =

              projectionMatrix

              *

              mvPosition;


          }


        `,


        fragmentShader: `


          varying vec3 vColor;


          void main() {


            vec2 uv =

              gl_PointCoord

              -

              vec2(.5);


            float distanceFromCenter =

              length(
                uv
              );


            if (
              distanceFromCenter
              >
              .5
            ) {

              discard;

            }


            /*
              Bright centre.
            */

            float core =

              1.0

              -

              smoothstep(

                .015,

                .13,

                distanceFromCenter

              );


            /*
              Soft circular atmosphere.
            */

            float glow =

              1.0

              -

              smoothstep(

                .08,

                .5,

                distanceFromCenter

              );


            /*
              Tiny horizontal flare.
            */

            float horizontal =

              1.0

              -

              smoothstep(

                0.0,

                .035,

                abs(
                  uv.y
                )

              );


            horizontal *=

              1.0

              -

              smoothstep(

                .055,

                .47,

                abs(
                  uv.x
                )

              );


            /*
              Tiny vertical flare.
            */

            float vertical =

              1.0

              -

              smoothstep(

                0.0,

                .035,

                abs(
                  uv.x
                )

              );


            vertical *=

              1.0

              -

              smoothstep(

                .055,

                .47,

                abs(
                  uv.y
                )

              );


            float starShape =

              max(

                core,

                max(

                  horizontal,

                  vertical

                )

                *
                .52

              );


            float alpha =

              max(

                starShape,

                glow
                *
                .22

              );


            gl_FragColor =

              vec4(

                vColor,

                alpha

              );


          }


        `


      });


  galaxyStars =

    new THREE.Points(

      geometry,

      material

    );


  galaxy.add(
    galaxyStars
  );

}


/* =========================================================
   SPIRAL STELLAR STREAMS
========================================================= */

function createSpiralStreams() {


  const armCount =
    5;


  for (

    let arm = 0;

    arm < armCount;

    arm++

  ) {


    const count =
      650;


    const positions =

      new Float32Array(
        count * 3
      );


    const baseAngle =

      (
        arm
        /
        armCount
      )

      *

      Math.PI
      *
      2;


    for (

      let i = 0;

      i < count;

      i++

    ) {


      const progress =

        i
        /
        (
          count - 1
        );


      const radius =

        .25

        +

        progress
        *
        3.25;


      const angle =

        baseAngle

        +

        radius
        *
        1.58

        +

        (
          Math.random()
          -
          .5
        )

        *
        .07;


      positions[
        i * 3
      ] =

        Math.cos(
          angle
        )

        *
        radius;


      positions[
        i * 3 + 1
      ] =

        (
          Math.random()
          -
          .5
        )

        *
        .055;


      positions[
        i * 3 + 2
      ] =

        Math.sin(
          angle
        )

        *
        radius;


    }


    const geometry =

      new THREE
        .BufferGeometry();


    geometry.setAttribute(

      "position",

      new THREE
        .BufferAttribute(

          positions,

          3

        )

    );


    const material =

      new THREE
        .PointsMaterial({


          color:

            arm % 2 === 0

              ? 0xcda46d

              : 0x7289a7,


          size:
            .011,


          transparent:
            true,


          opacity:
            .23,


          depthWrite:
            false,


          blending:
            THREE.AdditiveBlending


        });


    const stream =

      new THREE.Points(

        geometry,

        material

      );


    galaxy.add(
      stream
    );


  }

}


/* =========================================================
   NEURAL / INTELLIGENCE NETWORK
========================================================= */

function createNeuralNetwork() {


  neuralNetwork =
    new THREE.Group();


  galaxy.add(
    neuralNetwork
  );


  const filamentCount =
    40;


  for (

    let i = 0;

    i < filamentCount;

    i++

  ) {


    const startRadius =

      .38

      +

      Math.random()
      *
      1.75;


    const endRadius =

      Math.min(

        3.25,

        startRadius

        +

        .45

        +

        Math.random()
        *
        1.15

      );


    const startAngle =

      Math.random()

      *

      Math.PI
      *
      2;


    const turn =

      .45

      +

      Math.random()
      *
      1.15;


    const start =

      new THREE.Vector3(


        Math.cos(
          startAngle
        )

        *
        startRadius,


        (
          Math.random()
          -
          .5
        )

        *
        .16,


        Math.sin(
          startAngle
        )

        *
        startRadius


      );


    const middleAngle =

      startAngle
      +
      turn;


    const middleRadius =

      (
        startRadius
        +
        endRadius
      )

      /
      2;


    const middle =

      new THREE.Vector3(


        Math.cos(
          middleAngle
        )

        *
        middleRadius,


        (
          Math.random()
          -
          .5
        )

        *
        .22,


        Math.sin(
          middleAngle
        )

        *
        middleRadius


      );


    const endAngle =

      startAngle

      +

      turn
      *
      1.65;


    const end =

      new THREE.Vector3(


        Math.cos(
          endAngle
        )

        *
        endRadius,


        (
          Math.random()
          -
          .5
        )

        *
        .16,


        Math.sin(
          endAngle
        )

        *
        endRadius


      );


    const curve =

      new THREE
        .CatmullRomCurve3([

          start,

          middle,

          end

        ]);


    const points =

      curve.getPoints(
        58
      );


    const geometry =

      new THREE
        .BufferGeometry()

        .setFromPoints(
          points
        );


    const material =

      new THREE
        .LineBasicMaterial({


          color:

            Math.random() > .25

              ? 0xc29a65

              : 0x6f86a4,


          transparent:
            true,


          opacity:

            .04

            +

            Math.random()
            *
            .055,


          blending:
            THREE.AdditiveBlending


        });


    const filament =

      new THREE.Line(

        geometry,

        material

      );


    neuralNetwork.add(
      filament
    );


    /*
      Put occasional nodes along
      the filament.
    */

    if (
      Math.random() > .30
    ) {


      const position =

        curve.getPoint(

          .2

          +

          Math.random()
          *
          .65

        );


      createNetworkNode(
        position
      );

    }


  }

}


/* =========================================================
   NETWORK NODE
========================================================= */

function createNetworkNode(
  position
) {


  const nodeColour =

    Math.random() > .25

      ? 0xf0c98d

      : 0xa5bdd9;


  const node =

    new THREE.Mesh(


      new THREE
        .SphereGeometry(

          .015,

          8,

          8

        ),


      new THREE
        .MeshBasicMaterial({

          color:
            nodeColour,

          transparent:
            true,

          opacity:
            .76,

          blending:
            THREE.AdditiveBlending

        })


    );


  node.position.copy(
    position
  );


  neuralNetwork.add(
    node
  );


  const halo =

    new THREE.Mesh(


      new THREE
        .SphereGeometry(

          .047,

          8,

          8

        ),


      new THREE
        .MeshBasicMaterial({

          color:
            nodeColour,

          transparent:
            true,

          opacity:
            .055,

          blending:
            THREE.AdditiveBlending

        })


    );


  halo.position.copy(
    position
  );


  neuralNetwork.add(
    halo
  );

}


/* =========================================================
   OUTER NODES
========================================================= */

function createOuterNodes() {


  brightNodes =
    new THREE.Group();


  neuralNetwork.add(
    brightNodes
  );


  for (

    let i = 0;

    i < 42;

    i++

  ) {


    const radius =

      .75

      +

      Math.random()
      *
      2.6;


    const angle =

      Math.random()

      *

      Math.PI
      *
      2;


    const position =

      new THREE.Vector3(


        Math.cos(
          angle
        )

        *
        radius,


        (
          Math.random()
          -
          .5
        )

        *
        .25,


        Math.sin(
          angle
        )

        *
        radius


      );


    createNetworkNode(
      position
    );


  }

}


/* =========================================================
   GALAXY DUST
========================================================= */

function createGalaxyDust() {


  const count =
    2100;


  const positions =

    new Float32Array(
      count * 3
    );


  for (

    let i = 0;

    i < count;

    i++

  ) {


    const radius =

      .25

      +

      Math.random()
      *
      3.7;


    const angle =

      Math.random()

      *

      Math.PI
      *
      2;


    positions[
      i * 3
    ] =

      Math.cos(
        angle
      )

      *
      radius;


    positions[
      i * 3 + 1
    ] =

      (
        Math.random()
        -
        .5
      )

      *
      .5;


    positions[
      i * 3 + 2
    ] =

      Math.sin(
        angle
      )

      *
      radius;


  }


  const geometry =

    new THREE
      .BufferGeometry();


  geometry.setAttribute(

    "position",

    new THREE
      .BufferAttribute(

        positions,

        3

      )

  );


  const material =

    new THREE
      .PointsMaterial({


        color:
          0x8d7a62,


        size:
          .007,


        transparent:
          true,


        opacity:
          .075,


        depthWrite:
          false


      });


  galaxyDust =

    new THREE.Points(

      geometry,

      material

    );


  galaxy.add(
    galaxyDust
  );

}


/* =========================================================
   BACKGROUND STAR FIELD
========================================================= */

function createBackgroundStars() {


  const count =
    900;


  const positions =

    new Float32Array(
      count * 3
    );


  for (

    let i = 0;

    i < count;

    i++

  ) {


    positions[
      i * 3
    ] =

      (
        Math.random()
        -
        .5
      )

      *
      18;


    positions[
      i * 3 + 1
    ] =

      (
        Math.random()
        -
        .5
      )

      *
      11;


    positions[
      i * 3 + 2
    ] =

      -1

      -

      Math.random()
      *
      7;


  }


  const geometry =

    new THREE
      .BufferGeometry();


  geometry.setAttribute(

    "position",

    new THREE
      .BufferAttribute(

        positions,

        3

      )

  );


  const material =

    new THREE
      .PointsMaterial({


        color:
          0xb4afa5,


        size:
          .009,


        transparent:
          true,


        opacity:
          .17,


        depthWrite:
          false


      });


  backgroundStars =

    new THREE.Points(

      geometry,

      material

    );


  scene.add(
    backgroundStars
  );

}


/* =========================================================
   LIGHTING
========================================================= */

function createLighting() {


  const ambient =

    new THREE
      .AmbientLight(

        0x8b8174,

        .15

      );


  scene.add(
    ambient
  );


  const warm =

    new THREE
      .PointLight(

        0xe6b36e,

        .42,

        9

      );


  warm.position.set(

    2.6,

    .2,

    2

  );


  scene.add(
    warm
  );


  const cool =

    new THREE
      .PointLight(

        0x6682a6,

        .18,

        10

      );


  cool.position.set(

    3,

    2,

    -2

  );


  scene.add(
    cool
  );

}


/* =========================================================
   GALAXY TARGET
========================================================= */

function updateGalaxyTarget(
  index
) {


  galaxyTarget = {

    ...galaxyStates[
      index
    ]

  };

}


/* =========================================================
   POINTER PARALLAX
========================================================= */

let pointerX =
  0;


let pointerY =
  0;


window.addEventListener(

  "pointermove",

  event => {


    pointerX =

      event.clientX

      /

      window.innerWidth

      -

      .5;


    pointerY =

      event.clientY

      /

      window.innerHeight

      -

      .5;


  }

);


/* =========================================================
   TWINKLING STARS
========================================================= */

function animateGalaxyStars(
  time
) {


  if (
    !galaxyStars
  ) {

    return;

  }


  const sizes =

    galaxyStars
      .geometry
      .getAttribute(
        "size"
      );


  for (

    let i = 0;

    i < sizes.count;

    i++

  ) {


    const data =

      galaxyStarData[i];


    /*
      Normal slow twinkle.
    */

    const wave =

      Math.sin(

        time
        *
        data.speed

        +

        data.phase

      );


    /*
      Brief sharper sparkle.
    */

    const sparkle =

      Math.pow(


        Math.max(

          0,

          Math.sin(

            time

            *

            data.speed

            *

            .43

            +

            data.phase
            *
            3.7

          )

        ),


        18


      );


    const brightness =

      THREE
        .MathUtils
        .clamp(

          .82

          +

          wave
          *
          .12

          +

          sparkle
          *
          .68,

          .63,

          1.52

        );


    sizes.array[i] =

      data.baseSize

      *

      brightness;


  }


  sizes.needsUpdate =
    true;

}


/* =========================================================
   ANIMATION
========================================================= */

function animateWorld() {


  requestAnimationFrame(
    animateWorld
  );


  if (

    !renderer

    ||

    !camera

    ||

    !galaxy

  ) {

    return;

  }


  const elapsed =

    clock.getElapsedTime();


  animateGalaxyStars(
    elapsed
  );


  /*
    The entire galaxy moves extremely
    slowly. It should feel enormous.
  */

  galaxy.rotation.y +=
    .00065;


  galaxy.rotation.z +=
    .00008;


  /*
    Different layers move independently.
    This gives the structure depth.
  */

  if (
    galaxyStars
  ) {


    galaxyStars.rotation.y +=
      .00011;

  }


  if (
    galaxyDust
  ) {


    galaxyDust.rotation.y -=
      .000045;

  }


  if (
    neuralNetwork
  ) {


    neuralNetwork.rotation.y -=
      .000032;

  }


  /*
    Very subtle core breathing.
  */

  if (
    galaxyCore
  ) {


    const coreScale =

      1

      +

      Math.sin(
        elapsed * .72
      )

      *
      .018;


    galaxyCore.scale.setScalar(
      coreScale
    );

  }


  /*
    Smoothly move galaxy between
    page states.
  */

  galaxy.position.x +=

    (
      galaxyTarget.x

      -

      galaxy.position.x
    )

    *
    .022;


  galaxy.position.y +=

    (
      galaxyTarget.y

      -

      galaxy.position.y
    )

    *
    .022;


  galaxy.position.z +=

    (
      galaxyTarget.z

      -

      galaxy.position.z
    )

    *
    .022;


  const currentScale =

    galaxy.scale.x;


  const nextScale =

    currentScale

    +

    (
      galaxyTarget.scale

      -

      currentScale
    )

    *
    .022;


  galaxy.scale.setScalar(
    nextScale
  );


  /*
    Mouse movement affects camera,
    not the galaxy aggressively.
  */

  const targetCameraX =

    pointerX
    *
    .085;


  const targetCameraY =

    pointerY
    *
    -.055;


  camera.position.x +=

    (
      targetCameraX

      -

      camera.position.x
    )

    *
    .025;


  camera.position.y +=

    (
      targetCameraY

      -

      camera.position.y
    )

    *
    .025;


  camera.lookAt(

    0,

    0,

    0

  );


  /*
    Very slow distant star movement.
  */

  if (
    backgroundStars
  ) {


    backgroundStars.rotation.y =

      elapsed
      *
      .0008;

  }


  renderer.render(

    scene,

    camera

  );

}


/* =========================================================
   RESIZE
========================================================= */

function resizeWorld() {


  camera.aspect =

    window.innerWidth

    /

    window.innerHeight;


  camera
    .updateProjectionMatrix();


  renderer.setSize(

    window.innerWidth,

    window.innerHeight

  );


  renderer.setPixelRatio(

    Math.min(

      window.devicePixelRatio,

      1.7

    )

  );

}


/* =========================================================
   INITIAL HASH
========================================================= */

function loadInitialSection() {


  const hash =

    window.location.hash
      .replace(
        "#",
        ""
      );


  if (
    !hash
  ) {

    return;

  }


  const index =

    rooms.findIndex(

      room =>

        room.id === hash

    );


  if (
    index === -1
  ) {

    return;

  }


  rooms[
    currentRoom
  ]
    .classList
    .remove(
      "active"
    );


  currentRoom =
    index;


  rooms[
    currentRoom
  ]
    .classList
    .add(
      "active"
    );

}


/* =========================================================
   START
========================================================= */

loadInitialSection();


updateUI();


initWorld();


updateGalaxyTarget(
  currentRoom
);
