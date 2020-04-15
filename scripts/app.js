"use strict";
// let matrixBoard;
let currentSize = 2;

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
    }
  }

  getCompNameByVertex(vertexNum) {
    const compLen = this.comp.length;
    for (let i = 0; i < compLen; i++) {
      const _num = this.comp[i].vertices.indexOf(vertexNum);
      if (_num !== -1) return this.comp[i].name;
      else if (i === compLen - 1) return -1;
    }
  }
}

window.onload = function () {
  // matrixBoard = document.getElementById("matrixBoard");
  const startInput = document.querySelectorAll("#inputMatrixField > input");
  startInput[1].onchange = autoComlitMatrix;
  startInput[2].onchange = autoComlitMatrix;
};

/// DOM manipulation
const removeOldMatrix = (slector) => {
  const $matrixInputFields = document.querySelectorAll(`${slector} > input`);
  for (let i = 0; i < $matrixInputFields.length; i++)
    $matrixInputFields[i].remove();
  const $matrixBr = document.querySelectorAll(`${slector} > br`);
  for (let i = 0; i < $matrixBr.length; i++) $matrixBr[i].remove();
};

// TODO: объеденить методы рендера матриц (Можно рассмотреть этот вопрос с точки насследования)
const renderInputMatrix = (matrixSize, workingFieldSelector) => {
  const workingField = document.querySelector(`${workingFieldSelector}`);

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
      workingField.before(newMatrixInput);
    }
    const newBr = document.createElement("br");
    sendMatrix.before(newBr);
    currentSize = matrixSize;
  }
};

const renderOutputMatrix = (workingFieldSelector, solution) => {
  const workingField = document.querySelector(`${workingFieldSelector}`);

  const h2 = document.createElement("h2");
  h2.innerText = "Остовная матрица";
  workingField.append(h2);

  for (let i = 0; i < currentSize; i++) {
    for (let j = 0; j < currentSize; j++) {
      const newMatrixInput = document.createElement("input");
      newMatrixInput.setAttribute("value", solution.coreMatrix[i][j]);
      newMatrixInput.setAttribute("size", "5");
      newMatrixInput.setAttribute("disabled", "disabled");
      workingField.append(newMatrixInput);
    }
    const newBr = document.createElement("br");
    workingField.append(newBr);
  }

  let p = document.createElement("p");
  p.innerText = `Стоимость оптимального пути: ${solution.optimalPrice}`;
  workingField.append(p);
};

const changeInputMatrix = (matrixSize) => {
  removeOldMatrix("#inputMatrixField");
  const parent = document.getElementById("outputMatrixField");
  while (parent.firstChild) {
    parent.firstChild.remove();
  }

  renderInputMatrix(matrixSize, "#sendMatrix");
};

function autoComlitMatrix() {
  const x = this.getAttribute("x");
  const y = this.getAttribute("y");
  const cellValue = this.value;
  const elem = document.querySelector(`input[x="${y}"][y="${x}"]`);
  elem.value = cellValue;
}
//

// Functions of creation and prind data
const createAdjacencyMatrix = () => {
  let newMatrix = [];
  for (let i = 0; i < currentSize; i++) {
    newMatrix[i] = [];
    for (let j = 0; j < currentSize; j++) {
      const elem = document.querySelector(`input[x="${i + 1}"][y="${j + 1}"]`);
      newMatrix[i][j] = elem.value;
    }
  }
  return newMatrix;
};

const createEdgesList = (adjMatrix) => {
  let edgesList;
  let count = 0;
  for (let i = 0; i < currentSize; i++) {
    for (let j = 0; j < currentSize; j++) {
      if (adjMatrix[i][j] != 0 && j > i) {
        let obj = {
          weight: parseInt(adjMatrix[i][j]),
          vertexA: i,
          vertexB: j,
        };

        if (count === 0) {
          count++;
          edgesList = new Edge(parseInt(adjMatrix[i][j]), i, j);
        } else edgesList.pushEdge(obj);
      }
    }
  }
  return edgesList;
};

let printSolution = (solution) => {
  const parent = document.getElementById("outputMatrixField");
  while (parent.firstChild) {
    parent.firstChild.remove();
  }

  renderOutputMatrix("#outputMatrixField", solution);
};
//

// Algorithmic Functions
const algOfKrascal = (adjComp, edgesList) => {
  const edgesLen = edgesList.edge.length;
  let optimalPrice = 0;

  // инициализация шаблона остовной матрицы
  let coreMatrix = [];
  for (let i = 0; i < currentSize; i++) {
    coreMatrix[i] = [];
    for (let j = 0; j < currentSize; j++) coreMatrix[i][j] = 0;
  }

  for (let i = 0; i < edgesLen; i++) {
    const vertexA = edgesList.edge[i].vertexA;
    const vertexB = edgesList.edge[i].vertexB;
    const nameFirstComp = adjComp.getCompNameByVertex(vertexA);
    const nameSecondComp = adjComp.getCompNameByVertex(vertexB);

    if (nameFirstComp != nameSecondComp) {
      console.log(vertexA);
      console.log(vertexB);

      adjComp.merge(nameFirstComp, nameSecondComp);
      const currentWeight = edgesList.edge[i].weight;
      optimalPrice += currentWeight;
      coreMatrix[vertexA][vertexB] = currentWeight;
      coreMatrix[vertexB][vertexA] = currentWeight;
    }
  }

  const solution = {
    optimalPrice: optimalPrice,
    coreMatrix: coreMatrix,
  };

  return solution;
};
//

// Function of start aka start point
const compliteTask = () => {
  const adjMatrix = createAdjacencyMatrix();
  // console.log(adjMatrix);
  const edgesList = createEdgesList(adjMatrix);
  // console.log(edgesList);
  edgesList.sortByWeight();
  // Инициализируем компоненты связанности
  let adjComp = new AdjComponents(currentSize);
  // console.log(adjComp);
  let solution = algOfKrascal(adjComp, edgesList);
  console.log(solution);

  printSolution(solution);

  return false;
};
