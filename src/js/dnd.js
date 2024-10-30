// TODO: write code here

export const shifts = {
  shiftX: 0,
  shiftY: 0,
  set: (clientX, clientY, movingElement) => {
    shifts.shiftX = clientX - movingElement.getBoundingClientRect().left;
    shifts.shiftY = clientY - movingElement.getBoundingClientRect().top;
  },
};

export const moveAt = (element, pageX, pageY) => {
  element.style.left = pageX - shifts.shiftX + "px";
  element.style.top = pageY - shifts.shiftY + "px";
};

export const getElementCoordinates = (node, searchCoordsBy) => {
  const rect = node.getBoundingClientRect();
  return {
    top:
      searchCoordsBy == "by-center"
        ? rect.top + rect.height / 2
        : rect.top + 10,
    left: rect.left + rect.width / 2,
  };
};

export const isAbove = (nodeA, nodeB) => {
  const rectA = nodeA.getBoundingClientRect();
  const rectB = nodeB.getBoundingClientRect();
  return rectA.top + rectA.height / 2 < rectB.top + rectB.height / 2;
};

export const isRight = (nodeA, nodeB) => {
  const rectA = nodeA.getBoundingClientRect();
  const rectB = nodeB.getBoundingClientRect();
  return rectA.left + rectA.width / 2 < rectB.left + rectB.width / 2;
};

export const getElementBelow = (movingElement, searchCoordsBy) => {
  const movingElementCenter = getElementCoordinates(
    movingElement,
    searchCoordsBy,
  );
  movingElement.hidden = true;
  let elementBelow = document.elementFromPoint(
    movingElementCenter.left,
    movingElementCenter.top,
  );
  movingElement.hidden = false;
  return elementBelow;
};
