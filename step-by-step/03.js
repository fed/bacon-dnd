const Bacon = window.Bacon;

const pointerDownStream = Bacon.fromEvent(window, 'pointerdown');
const pointerMoveStream = Bacon.fromEvent(window, 'pointermove');
const pointerUpStream = Bacon.fromEvent(window, 'pointerup');

const cardOffsetStream = pointerDownStream
  .filter(pointerDownEvent => pointerDownEvent.target.matches('.board__card'))
  .flatMap(pointerDownEvent => pointerMoveStream.takeUntil(pointerUpStream))
  .log();
