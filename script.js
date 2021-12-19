let playerField = [],
  computerField = []; 
let playerShips = [],
  computerShips = [];
let computerHitCoordsArray = []; 
let username = 'Игрок';
let shipTypes = [
  ['Линкор', 4, 1],
  ['Крейсер', 3, 2],
  ['Эсминец', 2, 3],
  ['Катер', 1, 4]
];

function generateRandomField(ships, userShips) {
  let ok = 0; 
  let field = getMatrix();
  let x, y;
  let direction; 
  let shipCounter = 0;

  for (let i = 0; i < 4; i++) {
    let shipLength = ships[i][1];
    let shipCount = ships[i][2];
    for (let j = 0; j < shipCount; j++) {
      ok = 0;
      shipCounter++;
      userShips[shipCounter] = []; 
      while (ok === 0) {
        direction = getRandom(1) ? 'vertical' : 'horizontal';
        x = getRandom(9);
        y = getRandom(9);
        if (direction === 'vertical') {
          if (checkShipPlace(field, x, y, direction, shipLength)) {
            for (let k = 0; k < shipLength; k++) {
              field[x + k][y] = 1;
              userShips[shipCounter].push([x + k, y, 0]); 
            }
            ok = 1;
          }
        }
        if (direction === 'horizontal') {
          if (checkShipPlace(field, x, y, direction, shipLength)) {
            for (let l = 0; l < shipLength; l++) {
              field[x][y + l] = 1;
              userShips[shipCounter].push([x, y + l, 0]); 
            }
            ok = 1;
          }
        }
      } 
    }
  } 
  return field;
}

function checkShipPlace(field, x, y, direction, length) {
  let minX, maxX, minY, maxY;
  if (direction === 'vertical') {
    if (x + length - 1 > 9) return false;
    minX = x === 0 ? 0 : x - 1; 
    maxX = x + length > 9 ? 9 : x + length;
    minY = y === 0 ? 0 : y - 1; 
    maxY = y + 1 > 9 ? 9 : y + 1; 
  }
  if (direction === 'horizontal') {
    if (y + length - 1 > 9) return false;
    minX = x === 0 ? 0 : x - 1; 
    maxX = x + 1 > 9 ? 9 : x + 1; 
    minY = y === 0 ? 0 : y - 1; 
    maxY = y + length > 9 ? 9 : y + length; 
  }
  for (let i = minX; i <= maxX; i++) {
    for (let j = minY; j <= maxY; j++) {
      if (field[i][j] === 1) return false;
    }
  }
  return true;
}

function fieldClick(elem, x, y) {
  let style;
  if (computerField[x][y] === 1) { 
    style = 'hit';
    computerField[x][y] = 3;
    let shipID = checkWhenShipHitted(computerShips, x, y);
    if (isSunk(computerShips, shipID, computerField)) {
      markSunkShip(computerShips, shipID, 'computer', computerField);
    }
    checkGameStatus();
  } else if (computerField[x][y] === 0) {
    style = 'miss';
    computerField[x][y] = 2;
    computerTurn();
    checkGameStatus();
  }
  elem.parentNode.className = style;
  elem.parentNode.removeChild(elem); 
}


function computerTurn() {
  let hit = true; 
  let style = 'cell';
  let currentTurn = document.getElementById('current-turn');
  currentTurn.innerHTML = 'Ход Противника!';
  while (hit) {
    let x,y,coords;
    coords = getComputerPossibleCoords();
    x = coords[0];
    y = coords[1];
    if (playerField[x][y] == 2 || playerField[x][y] == 3 ){ 
      computerHitCoordsArray.pop();
      continue;
    }
    computerHitCoordsArray.pop();
    let cell = document.getElementById('player-' + x + '-' + y);
    if (playerField[x][y] === 1) { 
      let shipID = checkWhenShipHitted(playerShips, x, y);
      style = 'hit';
      playerField[x][y] = 3;
      if (isSunk(playerShips, shipID, playerField)) {
        markSunkShip(playerShips, shipID, 'player', playerField);
      }
      else{
          markMissCorner(playerField, x, y);
          whenComputerHitPlayerShip(x,y);
      }
    } else if (playerField[x][y] === 0) { 
      style = 'miss';
      playerField[x][y] = 2;
      hit = false;
    }
    cell.className = style;
  }
  setTimeout(function() {
    currentTurn.innerHTML = 'Ваш ход!';
  }, 600);
}

function checkWhenShipHitted(userShips, x, y) { 
  let searchCell = JSON.stringify([x, y, 0]); 
  for (let i = 1; i < userShips.length; i++) {
    for (let j = 0; j < userShips[i].length; j++) {
      let temp = JSON.stringify(userShips[i][j]);
      if (temp == searchCell) {
        userShips[i][j][2] = 1;
        return i; 
      }
    }
  }
}

function markMissCorner(field, x, y){
  let cell;
      x = x === 0 ? 1 : x;
      x = x + 1 > 9 ? 8 : x;
      y = y === 0 ? 1 : y;
      y = y + 1 > 9 ? 8 : y;
      if (field[x-1][y-1] !== undefined && field[x-1][y-1] === 0 ) {
        field[x-1][y-1] = 2;
        cell =  document.getElementById('player-' + (x-1) + '-' + (y-1));
        cell.className = 'miss';
      }
      if (field[x-1][y+1] !== undefined && field[x-1][y+1] === 0 ) {
        field[x-1][y+1] = 2;
        cell =  document.getElementById('player-' + (x-1) + '-' + (y+1));
        cell.className = 'miss';
      }
      if (field[x+1][y-1] !== undefined && field[x+1][y-1] === 0 ) {
        field[x+1][y-1] = 2;
        cell =  document.getElementById('player-' + (x+1) + '-' + (y-1));
        cell.className = 'miss';
      }
      if (field[x+1][y+1] !== undefined && field[x+1][y+1] === 0 ) {
        field[x+1][y+1] = 2;
        cell =  document.getElementById('player-' + (x+1) + '-' + (y+1));
        cell.className = 'miss';
      }
}

function whenComputerHitPlayerShip(x, y){
   let xUp, xDown, yLeft, yRight;
      xUp = x - 1 < 0 ? 0 : x - 1;
      xDown = x + 1 > 9 ? 9 : x + 1;
      yLeft = y - 1 < 0 ? 0 : y - 1;
      yRight = y + 1 > 9 ? 9 : y + 1;

      if (playerField[xUp][y] === 0 || playerField[xUp][y] === 1 ) computerHitCoordsArray.push([xUp,y]);
      if (playerField[xDown][y] === 0 || playerField[xDown][y] === 1 ) computerHitCoordsArray.push([xDown,y]);
      if (playerField[x][yLeft] === 0 || playerField[x][yLeft] === 1 ) computerHitCoordsArray.push([x,yLeft]);
      if (playerField[x][yRight] === 0 || playerField[x][yRight] === 1 ) computerHitCoordsArray.push([x,yRight]);
   }

function getComputerPossibleCoords() {
  let x,y, ok = 0;
  if (computerHitCoordsArray.length > 0){

  }
  else {
    while ( ok === 0){
     x = getRandom(9);
     y = getRandom(9);
     if (playerField[x][y] === 0 || playerField[x][y] === 1 ){
     computerHitCoordsArray.push([x,y]);
      ok = 1;
     }
   }
  }
  return computerHitCoordsArray[computerHitCoordsArray.length - 1];
}

function isSunk(userShips, shipID, field) {
  for (let i = 0; i < userShips[shipID].length; i++) {
    if (userShips[shipID][i][2] === 0) {
      return false;
    }
  }
  return true;
}

function markSunkShip(userShips, shipID, user, field) {
  let cell;
  let minX, maxX, minY, maxY;

  for (let i = 0; i < userShips[shipID].length; i++) {
    let x = userShips[shipID][i][0],
      y = userShips[shipID][i][1];

    minX = x === 0 ? 0 : x - 1;
    maxX = x + 1 > 9 ? 9 : x + 1;
    minY = y === 0 ? 0 : y - 1;
    maxY = y + 1 > 9 ? 9 : y + 1;

    for (let k = minX; k <= maxX; k++) {
      for (let l = minY; l <= maxY; l++) {
        if (field[k][l] === 0) {
          field[k][l] = 2;
          cell = document.getElementById(user + '-' + k + '-' + l);
          cell.className = 'miss';
          if (user === 'computer') cell.removeChild(cell.firstChild);

        }
      }
    }
  }
  userShips.splice(shipID, 1);
}

function checkAliveShips(userShips) {
   if (userShips.length > 1) return true;
  return false;
}

function checkGameStatus() {
  if (!checkAliveShips(playerShips)) {
    alert('Компьютер победил!');
    gameEnd();
    return true;
  }
  if (!checkAliveShips(computerShips)) {
    alert(username + ' победил!');
    gameEnd();
    return true;
  }

}

function gameEnd() {
  return true;
}

function gameStart() {
  let usernamePlace = document.getElementById('username-place');
  usernamePlace.innerHTML = username;
  playerField = generateRandomField(shipTypes, playerShips);
  computerField = generateRandomField(shipTypes, computerShips);
  printField(playerField, 'playerField', true, 'player');
  printField(computerField, 'computerField', false, 'computer');
}

function getRusCoords(x, y) {
  let letters = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'К'];
  return [x + 1, letters[y]];
}


function printField(field, tableId, show, user) {
  let table = document.getElementById(tableId);
  for (let i = 0; i < 10; i++) {
    let row = table.insertRow(-1);
    let th = document.createElement('th');
    th.innerHTML = i + 1;
    row.appendChild(th);
    for (let j = 0; j < 10; j++) {
      let cell = row.insertCell(-1);
      cell.id = user + '-' + i + '-' + j;
      if (show === true) {
        if (field[i][j] == 1) {
          cell.className = 'ship';
        } else {
          cell.innerHTML = '<a></a>';
        }
      } else {
        cell.innerHTML =
          '<a class="cell" href="#" onclick="fieldClick(this,' + i + ',' + j + ');"> </a>';
      }
    }
  }
}

function getMatrix() {
  let x = 10,
    y = 10;
  let matrix = [];
  for (let i = 0; i < x; i++) {
    matrix[i] = [];
    for (let j = 0; j < 10; j++) {
      matrix[i][j] = 0;
    }
  }
  return matrix;
}

function getRandom(n) {
  return Math.floor(Math.random() * (n + 1));
}

