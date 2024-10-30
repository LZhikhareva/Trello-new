import {
  shifts,
  moveAt,
  getElementBelow,
  getElementCoordinates,
  isAbove,
  isRight,
} from "./dnd.js";

let currentDroppable = null;
let placeholder;
let isDraggingStarted = false;
let movingElement;

const processEmptySections = () => {
  document
    .querySelectorAll(".board-column-content-wrapper")
    .forEach((section) => {
      if (
        !section.querySelector(".board-item:not(.emptySectionHiddenLesson)")
      ) {
        const emptySectionHiddenLesson = document.createElement("div");
        emptySectionHiddenLesson.classList.add(
          "board-item",
          "emptySectionHiddenLesson",
        );
        section.append(emptySectionHiddenLesson);
      } else {
        const emptySectionHiddenLesson = section.querySelector(
          ".emptySectionHiddenLesson",
        );
        emptySectionHiddenLesson &&
          section.removeChild(emptySectionHiddenLesson);
      }
    });
};

const setMovingElement = (event) => {
  movingElement = event.target;
};

const onMouseUp = () => {
  if (!isDraggingStarted) {
    document.removeEventListener("mousemove", onMouseMove);
    movingElement.onmouseup = null;
    return;
  }

  placeholder.parentNode.insertBefore(movingElement, placeholder);
  movingElement.style.position = "static";
  movingElement.style.zIndex = "auto";
  document.removeEventListener("mousemove", onMouseMove);
  isDraggingStarted = false;
  placeholder && placeholder.parentNode.removeChild(placeholder);
  movingElement.onmouseup = null;
  movingElement = null;

  processEmptySections();
};

const createPlaceholder = () => {
  placeholder = document.createElement("div");
  placeholder.classList.add("placeholder");
  movingElement.parentNode.insertBefore(placeholder, movingElement);
};

const onMouseMove = (event) => {
  if (!isDraggingStarted) {
    isDraggingStarted = true;
    if (movingElement.classList.contains("board-item")) {
      createPlaceholder();
    }
    movingElement.style.position = "absolute";
    movingElement.style.zIndex = 1000;
  }
  moveAt(movingElement, event.pageX, event.pageY);

  let elementBelow = getElementBelow(movingElement, "by-center");
  if (!elementBelow) return;
  let droppableBelow = elementBelow.closest(".board-item");
  if (currentDroppable != droppableBelow) {
    currentDroppable = droppableBelow;
    if (currentDroppable) {
      if (
        !isAbove(movingElement, currentDroppable) ||
        currentDroppable.classList.contains("emptySectionHiddenLesson")
      ) {
        currentDroppable.parentNode.insertBefore(placeholder, currentDroppable);
      } else {
        currentDroppable.parentNode.insertBefore(
          placeholder,
          currentDroppable.nextElementSibling,
        );
      }
    }
  }
};

const onMouseDown = (event) => {
  setMovingElement(event);
  shifts.set(event.clientX, event.clientY, movingElement);
  document.addEventListener("mousemove", onMouseMove);
  movingElement.onmouseup = onMouseUp;
};

window.addEventListener("load", () => {
  for (const draggableElement of document.querySelectorAll(".board-item")) {
    draggableElement.onmousedown = onMouseDown;
    draggableElement.ondragstart = () => {
      return false;
    };
  }
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          if (node.classList.contains("board-item")) {
            node.onmousedown = onMouseDown;
          }
        });
      }
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
});

export const deleteItem = () => {
  for (let del of document.querySelectorAll(".delete")) {
    del.addEventListener("click", () => {
      del.parentElement.remove();
    });
  }
};

export const AddNewItem = () => {
  for (let add of document.querySelectorAll(".add")) {
    add.addEventListener("click", () => {
      const newItem = document.createElement("div");
      const newItemInput = document.createElement("input");
      newItemInput.classList.add("new-item-input");
      newItem.appendChild(newItemInput);

      const ok = document.createElement("button");
      ok.textContent = "OK";
      ok.classList.add("ok-button");
      newItem.appendChild(ok);
      add.previousElementSibling.appendChild(newItem);

      ok.addEventListener("click", () => {
        const item = document.createElement("div");
        item.draggable = false;
        item.classList.add("board-item");

        const itemContent = document.createElement("div");
        itemContent.classList.add("board-item-content");
        itemContent.textContent = newItemInput.value;
        item.appendChild(itemContent);

        ok.parentElement.parentElement.appendChild(item);
        item.onmousedown = onMouseDown;

        newItem.remove();
        console.log(document.querySelectorAll(".board-item"));
      });
    });
  }
};

AddNewItem();
deleteItem();
