gsap.registerPlugin(ScrollTrigger)

//Generate a long string of randomly placed stars
function generateStars(count, width, height) {
  let shadows ="";
  for (let i = 0; i< count; i++){
    const x =Math.floor(Math.random()*width);
    const y = Math.floor(Math.random()*height);
    shadows += `${x}px ${y}px #FFF${i === count - 1 ? "" : ","}`;
  }
  return shadows;
}
const pageHeight = document.documentElement.scrollHeight;
const pageWidth = window.innerWidth;

//Apply the shadows (stars) to the divs
document.getElementById('stars').style.boxShadow = generateStars(900, pageWidth, pageHeight);
document.getElementById('stars2').style.boxShadow = generateStars(400, pageWidth, pageHeight);
document.getElementById('stars3').style.boxShadow = generateStars(200, pageWidth, pageHeight);



//Planet zooming in effect.
gsap.fromTo("#planet", 
  {
    scale: 0,
    xPercent: 0, 
    yPercent: -50,
    transformOrigin: "center center"
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
      onLeave: () => { //waits a tick before UFO flies in for suspense or something.
        gsap.delayedCall(0.5, flyInUFO); 
      }
    }
  }
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
    
    // Pause before looping back to the start so it's an even transition, and not strobing
    .set({}, {}, "+=0.5"); 
}

function flyInUFO() {
  if (gsap.getProperty("#ufo", "opacity") > 0) return;

  const ufoTL = gsap.timeline();
  ufoFlames();
  // Initial setup
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
    .fromTo("#ufo", 
      { rotation: -5 }, 
      { 
        rotation: 5,
        duration: 0.3,
        repeat: 4,     
        yoyo: true, 
        ease: "sine.inOut" 
      }, 
      "<" 
    )      
    .to("#ufo", {
      rotation: 0,
      duration: 1.2,    
      ease: "power2.out" 
    }, "-=0.8") 
    //Hovers indefinitely
    .to("#ufo", {
      y: "-=30",
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    }, "-=0.5");

    ScrollTrigger.create({
    trigger: ".column",
    start: "top 30vh",
    end: "bottom bottom",
    pin: ["#ufo"],
    pinSpacing: false,
  });
};
 
//Thoughts.
//Use a for loop from text box 0 to the last one (whatever that number is)
//Call for box-1, for example to fly in on scroll. It will remain until the user scrolls again. At that point, it will fly out and the following text box will zoom in.
//Repeat until the last text box. The last text box will remain until the end of the scroll, and then fly out at the end of the scroll.
// const boxes = gsap.utils.toArray(".text-box");

// const boxTL = gsap.timeline({
//   scrollTrigger: {
//     trigger: ".column",
//     start: "top top",
//     end: "+=16000",
//     scrub: 1,
//     pin: true,
//     fastScrollEnd: true,
//     preventOverlaps: true,
//     snap: {
//       snapTo: 1 / (boxes.length-1),
//       duration:  {min: 0.5, max: 1.2},
//       delay: 0.2, 
//       ease: "power1.inOut"
//     }
//   }
// });

// boxes.forEach((box, i) => {
//   boxTL.fromTo(box, {
//     xPercent:-150
//   }, {
//     xPercent: 0, 
//     duration: 1,
//     // ease: "back.out(1.2)",
//     ease: "power2.out"
//   } )
//   .to({}, {duration: 8})
//   .to(box, {
//     xPercent: -150,
//     duration: 1,
//     ease: "power2.in",
//   })
//   .to({}, {duration:5});
// });


// const boxes = gsap.utils.toArray(".text-box");
// const steps = gsap.utils.toArray(".step");
// steps.forEach((step,i) => {
//   const box = boxes[i];

//   ScrollTrigger.create({
//     trigger: step,
//     start: "top center",
//     end: "bottom center",
//     onEnter: () => {
//       gsap.to(box, {
//         x: 0,
//         duration: 0.6,
//         ease:"power2.out",
//         overwrite: true
//       });
//     },
//     onLeave: () => {
//       gsap.to(box, { 
//         x: "-150vw",
//         duration: 0.5,
//         ease: "power2.in",
//         overwrite: true
//       });
//     },
//     onEnterBack: () => {
//       gsap.to(box, {
//         x:0, duration: 0.6,
//         ease: "power2.out",
//         overwrite: true
//       });
//     },
//     onLeaveBack: () => {
//       gsap.to(box, {
//         x: "-150vw",
//         duration: 0.5,
//         ease: "power2.in",
//         overwrite: true
//       });
//     }
//   });
// });
// gsap.set(".text-box", { xPercent: -50, yPercent: -50, x: "-150vw" });

// const boxes = gsap.utils.toArray(".text-box");
// const steps = gsap.utils.toArray(".step"); // Target the new triggers

// // steps.forEach((step, i) => {
// //   const box = boxes[i];
// //   if(!box) return; // Safety check

// //   ScrollTrigger.create({
// //     trigger: step,
// //     start: "top center",
// //     end: "bottom center",
// //     markers: true, // Add markers for debugging
// //     onEnter: () => {
// //       gsap.to(box, { x: 0, autoAlpha: 1, duration: 0.6, overwrite: true, force3d: true });
// //     },
// //     onLeave: () => {
// //       gsap.to(box, { x: "-150vw", autoAlpha: 0, duration: 0.5, overwrite: true });
// //     },
// //     onEnterBack: () => {
// //       gsap.to(box, { x: 0, autoAlpha: 1, duration: 0.6, overwrite: true });
// //     },
// //     onLeaveBack: () => {
// //       gsap.to(box, { x: "-150vw", autoAlpha: 0, duration: 0.5, overwrite: true });
// //     }
// //   });
// // });

// // 1. CLEAR THE PATH: Tell GSAP exactly where the boxes start
// // This replaces the CSS transform and ensures centering works.
// gsap.set(".text-box", { 
//   xPercent: -50, 
//   yPercent: -50, 
//   x: "-120vw", // Start off-screen
//   autoAlpha: 0  // Start invisible
// });

// steps.forEach((step, i) => {
//   const box = boxes[i];
//   if(!box) return;

//   ScrollTrigger.create({
//     trigger: step,
//     start: "top center",
//     end: "bottom center",
//     // markers: true, // Keep these on for now!
    
//     onEnter: () => {
//       console.log(`Box ${i} Entering!`);
//       gsap.to(box, { 
//         x: "0", 
//         autoAlpha: 1, 
//         duration: 0.6, 
//         overwrite: true,
//         ease: "power2.out",
//         zIndex: 100
//       });
//     },
    
//     onLeave: () => {
//       console.log(`Box ${i} Leaving!`);
//       gsap.to(box, { 
//         x: "-120vw", 
//         autoAlpha: 0, 
//         duration: 0.5, 
//         overwrite: true,
//         ease: "power2.in"
//       });
//     },

//     onEnterBack: () => {
//       console.log(`Box ${i} Re-entering!`);
//       gsap.to(box, { 
//         x: "0", 
//         autoAlpha: 1, 
//         duration: 0.6, 
//         overwrite: true 
//       });
//     },

//     onLeaveBack: () => {
//       console.log(`Box ${i} Leaving Back!`);
//       gsap.to(box, { 
//         x: "-120vw", 
//         autoAlpha: 0, 
//         duration: 0.5, 
//         overwrite: true 
//       });
//     }
//   });
// });


const boxes = gsap.utils.toArray(".text-box");
const steps = gsap.utils.toArray(".step");

// Initialize Boxes: Center them, move them off-screen left, and hide them
gsap.set(boxes, { 
  left: "50%",
  top: "50%",
  xPercent: -50, 
  yPercent: -50, 
  x: "-120vw", 
  autoAlpha: 0 
});

steps.forEach((step, i) => {
  const box = boxes[i];
  if(!box) return;

  ScrollTrigger.create({
    trigger: step,
    start: "top center",
    end: "bottom center",
    onEnter: () => {
      gsap.to(box, { 
        x: 0, // Fly to the center!
        autoAlpha: 1, 
        duration: 0.8, 
        ease: "back.out(1.7)", // Adds a little 'pop' effect
        overwrite: true 
      });
    },
    onLeave: () => {
      gsap.to(box, { 
        x: "120vw", // Fly out to the right!
        autoAlpha: 0, 
        duration: 0.6, 
        overwrite: true 
      });
    },
    onEnterBack: () => {
      gsap.to(box, { 
        x: 0, 
        autoAlpha: 1, 
        duration: 0.8, 
        ease: "back.out(1.7)",
        overwrite: true 
      });
    },
    onLeaveBack: () => {
      gsap.to(box, { 
        x: "-120vw", // Fly back out to the left!
        autoAlpha: 0, 
        duration: 0.6, 
        overwrite: true 
      });
    }
  });
});

  const starTL = gsap.timeline({
    scrollTrigger: {
      trigger: ".fg-text",
      start: "center center",
      end: "225vh",
      scrub: 0.8,
    }
  });
  starTL.to("#stars", { y: -150, ease:"none"}, 0)
      .to("#stars2", { y:-300, ease:"none"}, "<")
      .to("stars3", {y:-450, ease: "none"}, "<");

  ScrollTrigger.create({
    trigger: ".star-container",
    start: "250vh top",
    end: "bottom bottom",
    pin: ["#stars", "#stars2", "#stars3"],
    pinSpacing: false
  });
      

  //Planet spins on scroll trigger per section

  //lens drops down at end of opening section.