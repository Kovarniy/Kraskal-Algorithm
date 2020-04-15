"use strict";
let matrixBoard;
let currentSize = 2;
let adjMatrix = [];

class Edge {
  constructor(weight, vertexA, vertexB) {
    this.edge = [
      {
        weight: weight,
        vertexA: vertexA,
        vertexB: vertexB,
      },
    ];
  }

  pushEdge(Object) {
    this.edge.push({
      weight: Object.weight,
      vertexA: Object.vertexA,
      vertexB: Object.vertexB,
    });
  }

  sortByWeight() {
    this.edge.sort(function (a, b) {
      return a.weight - b.weight;
    });
  }
}

class AdjComponents {
  constructor(count) {
    this.comp = [];
    // TODO: добавить проверку на то, что count является числом
    for (let i = 0; i < count; i++) {
      this.comp.push({
        name: i,
        vertices: [i],
      });
    }
  }

  // не увурен в необходимости этой функции
  pushComponents(Object) {
    this.comp.push({
      name: Object.name,
      vertices: Object.vertices,
    });
  }

  merge(comp1, comp2) {
    let ind1 = this.comp.findIndex((compounent) => compounent.name === comp1);
    let ind2 = this.comp.findIndex((compounent) => compounent.name === comp2);
    // TODO: проверка на существование компонент
    if (ind1 != -1 && ind2 != -1) {
      // Копируем вершины из одной компоненты в другую "объеденяем компоненты"
      this.comp[ind2].vertices.forEach((vertices) =>
        this.comp[ind1].vertices.push(vertices)
      );
      // удалем доабавлемую компоненту
      this.comp.splice(ind2, 1);
      console.log(adjComp);
    }
  }
}

let edges, adjComp;

window.onload = function () {
  matrixBoard = document.getElementById("matrixBoard");
  const startInput = document.querySelectorAll("#matrixBoard > input");
  startInput[1].onchange = autoComlitMatrix;
  startInput[2].onchange = autoComlitMatrix;
};

const removeOldMatrix = () => {
  const $matrixInputFields = document.querySelectorAll("#matrixBoard > input");
  for (let i = 0; i < $matrixInputFields.length; i++)
    $matrixInputFields[i].remove();
  const $matrixBr = document.querySelectorAll("#matrixBoard > br");
  for (let i = 0; i < $matrixBr.length; i++) $matrixBr[i].remove();
};

const renderMatrix = (matrixSize) => {
  removeOldMatrix();

  for (let i = 0; i < matrixSize; i++) {
    for (let j = 0; j < matrixSize; j++) {
      const newMatrixInput = document.createElement("input");
      newMatrixInput.setAttribute("x", `${i + 1}`);
      newMatrixInput.setAttribute("y", `${j + 1}`);
      newMatrixInput.setAttribute("size", "5");

      if (i === j) {
        newMatrixInput.setAttribute("disabled", "disabled");
        newMatrixInput.setAttribute("value", 0);
      } else {
        newMatrixInput.setAttribute("required", "required");
        newMatrixInput.onchange = autoComlitMatrix;
        newMatrixInput.setAttribute("pattern", "[0-9]{1,3}");
      }
      sendMatrix.before(newMatrixInput);
    }
    const newBr = document.createElement("br");
    sendMatrix.before(newBr);
    currentSize = matrixSize;
  }
};

function autoComlitMatrix() {
  const x = this.getAttribute("x");
  const y = this.getAttribute("y");
  const cellValue = this.value;
  const elem = document.querySelector(`input[x="${y}"][y="${x}"]`);
  elem.value = cellValue;
}

const parsingMatrix = () => {
  let count = 0;
  for (let i = 0; i < currentSize; i++) {
    adjMatrix[i] = [];
    for (let j = 0; j < currentSize; j++) {
      const elem = document.querySelector(`input[x="${i + 1}"][y="${j + 1}"]`);
      adjMatrix[i][j] = elem.value;
      if (adjMatrix[i][j] != 0 && j > i) {
        let obj = {
          weight: adjMatrix[i][j],
          vertexA: i,
          vertexB: j,
        };

        if (count === 0) {
          count++;
          edges = new Edge(adjMatrix[i][j], i, j);
        } else edges.pushEdge(obj);
      }
    }
  }

  return false;
};

const compliteTask = () => {
  parsingMatrix();
  edges.sortByWeight();
  console.log(edges);
  adjComp = new AdjComponents(currentSize);
  console.log(adjComp);
  adjComp.merge(0, 1);

  return false;
};
