const DECISION_THRESHOLD = 75;

let isAnimanting = false;
let pullDeltaX = 0; // distancia que la card se está arrastrando

function startDrag(event) {
  if (isAnimanting) return;

  const actualCard = event.target.closest("article"); // recuperamos el article más cercano cuando estamos arrastrando
  if (!actualCard) return;
  //get initial position of mouse or finger
  const startX = event.pageX ?? event.touches[0].pageX;

  // listen mouse or touch movements

  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseup", onEnd);

  document.addEventListener("touchmove", onMove), { passive: true };
  document.addEventListener("touchend", onEnd), { passive: true };

  function onMove(event) {
    const currentX = event.pageX ?? event.touches[0].pageX;
    pullDeltaX = currentX - startX;
    if (pullDeltaX === 0) return;
    isAnimanting = true;
    const deg = pullDeltaX / 10;
    actualCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`;

    actualCard.style.cursor = "grabbing";
  }

  function onEnd() {
    //remove events listener
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onEnd);

    document.removeEventListener("touchmove", onMove), { passive: true };
    document.removeEventListener("touchend", onEnd), { passive: true };

    const decisionMade = Math.abs(pullDeltaX) >= DECISION_THRESHOLD;

    if (decisionMade) {
      const goRight = pullDeltaX >= 0;
      const goLeft = !goRight;

      actualCard.classList.add(goRight ? 'go-right' : 'go-left')
      actualCard.addEventListener('transitionend', ()=>{
        actualCard.remove()
        
      })
     
    } else {
      actualCard.classList.add('reset')
      actualCard.classList.remove('go-right', 'go-left')
    }

    actualCard.addEventListener('transitionend', ()=>{
      actualCard.removeAttribute('style')
      actualCard.classList.remove('reset')
      pullDeltaX = 0
      isAnimanting = false
    })

    
    
  }
}

document.addEventListener("mousedown", startDrag);
document.addEventListener("touchstart", startDrag, { passive: true }); //el pasive sirve para solo escuchar el evento pero bloquea el evento por defecto, así se reduce el costo de rendimiento en los eventos touch.
