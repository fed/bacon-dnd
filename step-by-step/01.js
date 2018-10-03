const Bacon = window.Bacon;

const pointerDownStream = Bacon.fromEvent(window, 'pointerdown');
const pointerMoveStream = Bacon.fromEvent(window, 'pointermove');
const pointerUpStream = Bacon.fromEvent(window, 'pointerup');

pointerDownStream.log();
