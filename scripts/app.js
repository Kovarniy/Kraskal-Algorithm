"use strict";
let currentSize = 2;
let matrixBoard;

window.onunload = function () {
  matrixBoard = document.getElementById("matrixBoard");
};

const removeOldMatrix = () => {
  const matrixInputFields = document.querySelectorAll("#matrixBoard > input");
  for (let i = 0; i < matrixInputFields.length; i++)
    matrixInputFields[i].remove();
  const matrixBr = document.querySelectorAll("#matrixBoard > br");
  for (let i = 0; i < matrixBr.length; i++) matrixBr[i].remove();
};

const renderMatrix = (marixSize) => {
  removeOldMatrix();

  for (let i = 0; i < marixSize; i++) {
    for (let j = 0; j < marixSize; j++) {
      const newMatrixInput = document.createElement("input");
      newMatrixInput.setAttribute("x", `${i + 1}`);
      newMatrixInput.setAttribute("y", `${j + 1}`);
      newMatrixInput.setAttribute("size", "5");

      if (i === j) {
        newMatrixInput.setAttribute("disabled", "disabled");
        newMatrixInput.setAttribute("value", 0);
      } else {
        newMatrixInput.setAttribute("required", "required");
      }
      sendMatrix.before(newMatrixInput);
    }
    const newBr = document.createElement("br");
    sendMatrix.before(newBr);
  }
};
