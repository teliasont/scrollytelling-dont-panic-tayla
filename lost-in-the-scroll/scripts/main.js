gsap.registerPlugin(ScrollTrigger);

//Generate a long string of randomly placed stars
function generateStars(count, width, height) {
  let shadows = "";
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    shadows += `${x}px ${y}px #FFF${i === count - 1 ? "" : ","}`;
  }
  return shadows;
}
const pageHeight = document.documentElement.scrollHeight;
const pageWidth = window.innerWidth;

//Apply the shadows (stars) to the divs
document.getElementById("stars").style.boxShadow = generateStars(
  900,
  pageWidth,
  pageHeight,
);
document.getElementById("stars2").style.boxShadow = generateStars(
  400,
  pageWidth,
  pageHeight,
);
document.getElementById("stars3").style.boxShadow = generateStars(
  200,
  pageWidth,
  pageHeight,
);

// Planet zooming in effect.
const planetTween = gsap.fromTo(
  "#planet",
  {
    scale: 0,
    xPercent: 0,
    yPercent: -50,
    transformOrigin: "center center",
  },
  {
    scale: 1,
    xPercent: 70,
    yPercent: -50,
    ease: "none",
    scrollTrigger: {
      trigger: ".fg-text",
      start: "center center",
      end: "250vh",
      scrub: 0.8,
      // Trigger the delay once the planet is fully in frame
      onEnter: () => {
        // Resets UFO if user scrolls back up and down
        gsap.set("#ufo", { opacity: 0, x: -1200 });
      },
      onLeave: () => {
        //waits a tick before UFO flies in for suspense or something.
        gsap.delayedCall(0.5, flyInUFO);
      },
    },
  },
);

function ufoFlames() {
  const fireTL = gsap.timeline({ repeat: -1 });

  fireTL
    // Show fire 1, Hide fire 2
    .set(".fire-1", { opacity: 1 })
    .set(".fire2", { opacity: 0 })

    // Swap fires
    .set(".fire-1", { opacity: 0 }, "+=0.5")
    .set(".fire2", { opacity: 1 }, "<")

    .set({}, {}, "+=0.5");
}

function flyInUFO() {
  if (gsap.getProperty("#ufo", "opacity") > 0) return;

  const ufoTL = gsap.timeline();
  ufoFlames();
  gsap.set("#ufo", { opacity: 1, x: -1200, y: 100, rotation: -5 });

  ufoTL
    //UFO zooms in from the side
    .to("#ufo", {
      duration: 2.5,
      x: 0,
      y: 0,
      ease: "elastic.out(1, 0.5)",
    })
    //UFO wobbles a bit
    .fromTo(
      "#ufo",
      { rotation: -5 },
      {
        rotation: 5,
        duration: 0.3,
        repeat: 4,
        yoyo: true,
        ease: "sine.inOut",
      },
      "<",
    )
    .to(
      "#ufo",
      {
        rotation: 0,
        duration: 1.2,
        ease: "power2.out",
      },
      "-=0.8",
    )
    //Hovers indefinitely
    .to(
      "#ufo",
      {
        y: "+=30",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      },
      "-=0.5",
    );

  ScrollTrigger.create({
    trigger: ".column",
    start: "top top",
    end: "bottom bottom",
    pin: "#ufo",
    pinSpacing: false,
  });
}

//Thoughts.
//Use a for loop from text box 0 to the last one (whatever that number is)
//Call for box-1, for example to fly in on scroll. It will remain until the user scrolls again. At that point, it will fly out and the following text box will zoom in.
//Repeat until the last text box. The last text box will remain until the end of the scroll, and then fly out at the end of the scroll.

const boxes = gsap.utils.toArray(".text-box");

const boxTL = gsap.timeline({
  scrollTrigger: {
    trigger: ".column",
    start: "top top",
    end: () => `+=${boxes.length * 1500}`, // Adjust this based on the total scroll length for the page/boxes
    pin: true,
    scrub: 1,
    pinSpacing: true,
    aniticipatePin: 1,
    snap: { //Gemini helped with the snapping to prevent the last box from being so sticky.
      snapTo: (value, self) => {
    const labels = self.getLabels();
    const labelValues = Object.values(labels);
    
    // Remove the last 2 labels (the 'in' and 'hold' for the final box)
    // from the snapping logic so the footer can flow freely.
    const filteredLabels = labelValues.slice(0, -2); 
    
    return gsap.utils.snap(filteredLabels, value);
  },
      duration: 0.5, 
      delay: 0.1, 
      ease: "power1.inOut"
    },
  },
});

boxes.forEach((box, i) => {
  const isFirst = i === 0; 
  const isLast = i === boxes.length - 1; 
  boxTL.addLabel(`box_${i}_in`); // Add a label for snapping

  if (i === 4) { //moves lens on screen
    boxTL.to("#lens", {
      top: "0%", 
      duration: 1.25,
      ease: "power2.out"
    }, `box_${i}_in`); 
  }
  if(i===25){ //moves lens off screen
    boxTL.to("#lens", {
      top: "-100%", 
      duration: 1.25,
      ease: "power2.in" // Smoothly exit
    }, `box_${i}_in`); 
  }

  boxTL.fromTo(
    box,
    {
      x: "-150vw",
      autoAlpha: 0, //start off screen to the left and invisible
    },
    {
      x: 0,
      xPercent: -50,
      autoAlpha: 1,
      duration: 0.5,
      ease: "power2.out", //move onto screen and become visible
    },
    isFirst ? "+=0" : "+=0.5",
  );
  boxTL
    .addLabel(`box_${i}_hold`)
    .to({}, { duration: 1 }) // Add a label for snapping after a delay
    .to(
      box,
      {
        x: "-150vw",
        autoAlpha: 0,
        duration: 0.5,
        ease: "power2.in", //exit to the left again
      },
      "+=0.5",
    );
    if (isLast) {
    boxTL.to({}, { duration: 4 }); 
  }
});

const starTL = gsap.timeline({
  scrollTrigger: {
    trigger: ".fg-text",
    start: "center center",
    end: "225vh",
    scrub: 0.8,
  },
});
starTL
  .to("#stars", { y: -150, ease: "none" }, 0)
  .to("#stars2", { y: -300, ease: "none" }, "<")
  .to("#stars3", { y: -450, ease: "none" }, "<");

ScrollTrigger.create({
  trigger: ".star-container",
  start: "250vh top",
  end: "bottom bottom",
 
});



//Planet spins on scroll trigger per section

//lens drops down at end of opening section.

const planetExitTL = gsap.timeline({
  scrollTrigger: {
    trigger: ".spacer",
    start: "top bottom",
    end: "top 50%", 
    scrub: 0.8,
    
  }
});

planetExitTL.fromTo(
  "#planet",
  {
    scale: 1,
    xPercent: 70,
    yPercent: -50,
    ease: "none",
  },
  {
    scale: 0,
    xPercent: 0,
    yPercent: -50,
    transformOrigin: "center center",
  },
  0,
)
//UFO leaves at the same time as the planet.
.to(
  "#ufo",
  {
    x: -1200, 
    y: 100,
    rotation: -15,
    duration: 0.5,
    ease: "power2.in",
  },
  "-=1"
);

const starExitTL = gsap.timeline({
  scrollTrigger: {
    trigger: ".spacer",
    start: "top bottom", 
    end: "bottom bottom", 
    scrub: 0.8,
  }
});
starExitTL
  .to("#stars",  { y: -200, ease: "none" }, 0)  
  .to("#stars2", { y: -450, ease: "none" }, 0)  
  .to("#stars3", { y: -600, ease: "none" }, 0); 

  const returnButton = document.querySelector(".return-to-top");
  returnButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth' 
  });
});

  gsap.to(returnButton, {autoAlpha: 1, x: 0,
    scrollTrigger: {
      trigger: ".spacer",
      start: "top 50%",
      end: "bottom bottom",
      toggleActions: "play reverse play reverse"
    }
});