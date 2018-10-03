const Bacon = window.Bacon;

const pointerDownStream = Bacon.fromEvent(window, 'pointerdown');
const pointerMoveStream = Bacon.fromEvent(window, 'pointermove');
const pointerUpStream = Bacon.fromEvent(window, 'pointerup');

const cardOffsetStream = pointerDownStream
  .filter(pointerDownEvent => pointerDownEvent.target.matches('.board__card'))
  .flatMap(pointerDownEvent => {
    const cardId = event.target.dataset.id;

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
  })
  .log();

function getContainingColumn(pointerMoveEvent) {
  const columns = Array.from(document.querySelectorAll('.board__column'));

  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    const columnRect = column.getBoundingClientRect();
    const isContained =
      pointerMoveEvent.clientX >= columnRect.left &&
      pointerMoveEvent.clientX <= columnRect.left + columnRect.width;

    if (isContained) {
      return column;
    }
  }

  return null;
}
