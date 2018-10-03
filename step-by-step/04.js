const Bacon = window.Bacon;

const pointerDownStream = Bacon.fromEvent(window, 'pointerdown');
const pointerMoveStream = Bacon.fromEvent(window, 'pointermove');
const pointerUpStream = Bacon.fromEvent(window, 'pointerup');

const cardOffsetStream = pointerDownStream
  .filter(pointerDownEvent => pointerDownEvent.target.matches('.board__card'))
  .flatMap(pointerDownEvent => {
    const cardId = event.target.dataset.id;

    return pointerMoveStream.takeUntil(pointerUpStream).map(pointerMoveEvent => ({
      cardId,
      offsetX: pointerMoveEvent.clientX - pointerDownEvent.clientX,
      offsetY: pointerMoveEvent.clientY - pointerDownEvent.clientY
    }));
  })
  .log();
