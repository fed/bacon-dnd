const Bacon = window.Bacon;

// If you think of a drag and drop implementation, there's really
// three inputs that you care about: pointerdown, pointermove and pointerup.
// So the first thing we are gonna do is create streams representing these events.
// Bacon.fromEvent takes in an observable, in this case `window` and an event name.
// Every time the `pointerdown` event is fired on the window, that event will go into the stream.
const pointerDownStream = Bacon.fromEvent(window, 'pointerdown');
const pointerMoveStream = Bacon.fromEvent(window, 'pointermove');
const pointerUpStream = Bacon.fromEvent(window, 'pointerup');

pointerDownStream
  .filter(onlyPointerDownsOnCards)
  .flatMap(cardOffsetStream)
  .onValue(updateBoard);

// What we really want is our pointerdown events where we moused down over a card.
// We filter out those pointerdown events on anything other than a card.
function onlyPointerDownsOnCards(pointerDownEvent) {
  return pointerDownEvent.target.matches('.board__card');
}

function cardOffsetStream(pointerDownEvent) {
  // What we really wanna know is which issue is being moved. Here we get the card ID that we moused down on.
  const cardId = pointerDownEvent.target.dataset.id;

  // Once we have the pointerdown events on cards, we want to map that to a stream of pointermove events.
  // And we wanna take values from that pointermove stream until the next pointerup event.
  // What flatMap does is it takes a function whose argument is the event from the stream you are mapping from,
  // in this case it's a pointerdown event, and what it needs to return is a stream,
  // in this case we'll be returning the pointermove event.
  // But we don't want all the pointermove events, we just wanna take them until the next pointerup event.
  // We map these into a stream of objects that contain a card ID. We also need to figure out how far we've moved it.
  return pointerMoveStream
    .takeUntil(pointerUpStream)
    .merge(pointerUpStream.first())
    .map(pointerEvent => ({
      cardId,
      offsetX: pointerEvent.clientX - pointerDownEvent.clientX,
      offsetY: pointerEvent.clientY - pointerDownEvent.clientY,
      containingColumn: getContainingColumn(pointerEvent),
      isPointerUp: pointerEvent.type === 'pointerup'
    }));
}

function updateBoard(data) {
  const cards = Array.from(document.querySelectorAll('.board__card'));
  const activeCard = cards.find(cardElement => cardElement.dataset.id === data.cardId);

  if (!activeCard) {
    return;
  }

  if (data.isPointerUp) {
    releaseCard(activeCard, data.containingColumn);
    return;
  }

  moveCard(activeCard, data.containingColumn, data.offsetX, data.offsetY);
}

function moveCard(card, column, offsetX, offsetY) {
  card.classList.add('board__card--moving');
  card.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

  if (column) {
    card.classList.add('board__card--active');
  } else {
    card.classList.remove('board__card--active');
  }
}

function releaseCard(card, column) {
  card.classList.remove('board__card--moving', 'board__card--active');
  card.style.transform = 'translate(0px, 0px)';

  if (column) {
    column.querySelector('.board__inner-column').appendChild(card);
  }
}

function getContainingColumn(pointerMoveEvent) {
  const columns = Array.from(document.querySelectorAll('.board__column'));

  for (let i = 0; i < columns.length; i++) {
    const columnRect = columns[i].getBoundingClientRect();
    const isContained =
      pointerMoveEvent.clientX >= columnRect.left &&
      pointerMoveEvent.clientX <= columnRect.left + columnRect.width;

    if (isContained) {
      return columns[i];
    }
  }

  return null;
}
