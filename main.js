/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/pubsub-js/src/pubsub.js":
/*!**********************************************!*\
  !*** ./node_modules/pubsub-js/src/pubsub.js ***!
  \**********************************************/
/***/ (function(module, exports, __webpack_require__) {

eval("/* module decorator */ module = __webpack_require__.nmd(module);\n/**\n * Copyright (c) 2010,2011,2012,2013,2014 Morgan Roderick http://roderick.dk\n * License: MIT - http://mrgnrdrck.mit-license.org\n *\n * https://github.com/mroderick/PubSubJS\n */\n\n(function (root, factory){\n    'use strict';\n\n    var PubSub = {};\n\n    if (root.PubSub) {\n        PubSub = root.PubSub;\n        console.warn(\"PubSub already loaded, using existing version\");\n    } else {\n        root.PubSub = PubSub;\n        factory(PubSub);\n    }\n    // CommonJS and Node.js module support\n    if (true){\n        if (module !== undefined && module.exports) {\n            exports = module.exports = PubSub; // Node.js specific `module.exports`\n        }\n        exports.PubSub = PubSub; // CommonJS module 1.1.1 spec\n        module.exports = exports = PubSub; // CommonJS\n    }\n    // AMD support\n    /* eslint-disable no-undef */\n    else {}\n\n}(( typeof window === 'object' && window ) || this, function (PubSub){\n    'use strict';\n\n    var messages = {},\n        lastUid = -1,\n        ALL_SUBSCRIBING_MSG = '*';\n\n    function hasKeys(obj){\n        var key;\n\n        for (key in obj){\n            if ( Object.prototype.hasOwnProperty.call(obj, key) ){\n                return true;\n            }\n        }\n        return false;\n    }\n\n    /**\n     * Returns a function that throws the passed exception, for use as argument for setTimeout\n     * @alias throwException\n     * @function\n     * @param { Object } ex An Error object\n     */\n    function throwException( ex ){\n        return function reThrowException(){\n            throw ex;\n        };\n    }\n\n    function callSubscriberWithDelayedExceptions( subscriber, message, data ){\n        try {\n            subscriber( message, data );\n        } catch( ex ){\n            setTimeout( throwException( ex ), 0);\n        }\n    }\n\n    function callSubscriberWithImmediateExceptions( subscriber, message, data ){\n        subscriber( message, data );\n    }\n\n    function deliverMessage( originalMessage, matchedMessage, data, immediateExceptions ){\n        var subscribers = messages[matchedMessage],\n            callSubscriber = immediateExceptions ? callSubscriberWithImmediateExceptions : callSubscriberWithDelayedExceptions,\n            s;\n\n        if ( !Object.prototype.hasOwnProperty.call( messages, matchedMessage ) ) {\n            return;\n        }\n\n        for (s in subscribers){\n            if ( Object.prototype.hasOwnProperty.call(subscribers, s)){\n                callSubscriber( subscribers[s], originalMessage, data );\n            }\n        }\n    }\n\n    function createDeliveryFunction( message, data, immediateExceptions ){\n        return function deliverNamespaced(){\n            var topic = String( message ),\n                position = topic.lastIndexOf( '.' );\n\n            // deliver the message as it is now\n            deliverMessage(message, message, data, immediateExceptions);\n\n            // trim the hierarchy and deliver message to each level\n            while( position !== -1 ){\n                topic = topic.substr( 0, position );\n                position = topic.lastIndexOf('.');\n                deliverMessage( message, topic, data, immediateExceptions );\n            }\n\n            deliverMessage(message, ALL_SUBSCRIBING_MSG, data, immediateExceptions);\n        };\n    }\n\n    function hasDirectSubscribersFor( message ) {\n        var topic = String( message ),\n            found = Boolean(Object.prototype.hasOwnProperty.call( messages, topic ) && hasKeys(messages[topic]));\n\n        return found;\n    }\n\n    function messageHasSubscribers( message ){\n        var topic = String( message ),\n            found = hasDirectSubscribersFor(topic) || hasDirectSubscribersFor(ALL_SUBSCRIBING_MSG),\n            position = topic.lastIndexOf( '.' );\n\n        while ( !found && position !== -1 ){\n            topic = topic.substr( 0, position );\n            position = topic.lastIndexOf( '.' );\n            found = hasDirectSubscribersFor(topic);\n        }\n\n        return found;\n    }\n\n    function publish( message, data, sync, immediateExceptions ){\n        message = (typeof message === 'symbol') ? message.toString() : message;\n\n        var deliver = createDeliveryFunction( message, data, immediateExceptions ),\n            hasSubscribers = messageHasSubscribers( message );\n\n        if ( !hasSubscribers ){\n            return false;\n        }\n\n        if ( sync === true ){\n            deliver();\n        } else {\n            setTimeout( deliver, 0 );\n        }\n        return true;\n    }\n\n    /**\n     * Publishes the message, passing the data to it's subscribers\n     * @function\n     * @alias publish\n     * @param { String } message The message to publish\n     * @param {} data The data to pass to subscribers\n     * @return { Boolean }\n     */\n    PubSub.publish = function( message, data ){\n        return publish( message, data, false, PubSub.immediateExceptions );\n    };\n\n    /**\n     * Publishes the message synchronously, passing the data to it's subscribers\n     * @function\n     * @alias publishSync\n     * @param { String } message The message to publish\n     * @param {} data The data to pass to subscribers\n     * @return { Boolean }\n     */\n    PubSub.publishSync = function( message, data ){\n        return publish( message, data, true, PubSub.immediateExceptions );\n    };\n\n    /**\n     * Subscribes the passed function to the passed message. Every returned token is unique and should be stored if you need to unsubscribe\n     * @function\n     * @alias subscribe\n     * @param { String } message The message to subscribe to\n     * @param { Function } func The function to call when a new message is published\n     * @return { String }\n     */\n    PubSub.subscribe = function( message, func ){\n        if ( typeof func !== 'function'){\n            return false;\n        }\n\n        message = (typeof message === 'symbol') ? message.toString() : message;\n\n        // message is not registered yet\n        if ( !Object.prototype.hasOwnProperty.call( messages, message ) ){\n            messages[message] = {};\n        }\n\n        // forcing token as String, to allow for future expansions without breaking usage\n        // and allow for easy use as key names for the 'messages' object\n        var token = 'uid_' + String(++lastUid);\n        messages[message][token] = func;\n\n        // return token for unsubscribing\n        return token;\n    };\n\n    PubSub.subscribeAll = function( func ){\n        return PubSub.subscribe(ALL_SUBSCRIBING_MSG, func);\n    };\n\n    /**\n     * Subscribes the passed function to the passed message once\n     * @function\n     * @alias subscribeOnce\n     * @param { String } message The message to subscribe to\n     * @param { Function } func The function to call when a new message is published\n     * @return { PubSub }\n     */\n    PubSub.subscribeOnce = function( message, func ){\n        var token = PubSub.subscribe( message, function(){\n            // before func apply, unsubscribe message\n            PubSub.unsubscribe( token );\n            func.apply( this, arguments );\n        });\n        return PubSub;\n    };\n\n    /**\n     * Clears all subscriptions\n     * @function\n     * @public\n     * @alias clearAllSubscriptions\n     */\n    PubSub.clearAllSubscriptions = function clearAllSubscriptions(){\n        messages = {};\n    };\n\n    /**\n     * Clear subscriptions by the topic\n     * @function\n     * @public\n     * @alias clearAllSubscriptions\n     * @return { int }\n     */\n    PubSub.clearSubscriptions = function clearSubscriptions(topic){\n        var m;\n        for (m in messages){\n            if (Object.prototype.hasOwnProperty.call(messages, m) && m.indexOf(topic) === 0){\n                delete messages[m];\n            }\n        }\n    };\n\n    /**\n       Count subscriptions by the topic\n     * @function\n     * @public\n     * @alias countSubscriptions\n     * @return { Array }\n    */\n    PubSub.countSubscriptions = function countSubscriptions(topic){\n        var m;\n        // eslint-disable-next-line no-unused-vars\n        var token;\n        var count = 0;\n        for (m in messages) {\n            if (Object.prototype.hasOwnProperty.call(messages, m) && m.indexOf(topic) === 0) {\n                for (token in messages[m]) {\n                    count++;\n                }\n                break;\n            }\n        }\n        return count;\n    };\n\n\n    /**\n       Gets subscriptions by the topic\n     * @function\n     * @public\n     * @alias getSubscriptions\n    */\n    PubSub.getSubscriptions = function getSubscriptions(topic){\n        var m;\n        var list = [];\n        for (m in messages){\n            if (Object.prototype.hasOwnProperty.call(messages, m) && m.indexOf(topic) === 0){\n                list.push(m);\n            }\n        }\n        return list;\n    };\n\n    /**\n     * Removes subscriptions\n     *\n     * - When passed a token, removes a specific subscription.\n     *\n\t * - When passed a function, removes all subscriptions for that function\n     *\n\t * - When passed a topic, removes all subscriptions for that topic (hierarchy)\n     * @function\n     * @public\n     * @alias subscribeOnce\n     * @param { String | Function } value A token, function or topic to unsubscribe from\n     * @example // Unsubscribing with a token\n     * var token = PubSub.subscribe('mytopic', myFunc);\n     * PubSub.unsubscribe(token);\n     * @example // Unsubscribing with a function\n     * PubSub.unsubscribe(myFunc);\n     * @example // Unsubscribing from a topic\n     * PubSub.unsubscribe('mytopic');\n     */\n    PubSub.unsubscribe = function(value){\n        var descendantTopicExists = function(topic) {\n                var m;\n                for ( m in messages ){\n                    if ( Object.prototype.hasOwnProperty.call(messages, m) && m.indexOf(topic) === 0 ){\n                        // a descendant of the topic exists:\n                        return true;\n                    }\n                }\n\n                return false;\n            },\n            isTopic    = typeof value === 'string' && ( Object.prototype.hasOwnProperty.call(messages, value) || descendantTopicExists(value) ),\n            isToken    = !isTopic && typeof value === 'string',\n            isFunction = typeof value === 'function',\n            result = false,\n            m, message, t;\n\n        if (isTopic){\n            PubSub.clearSubscriptions(value);\n            return;\n        }\n\n        for ( m in messages ){\n            if ( Object.prototype.hasOwnProperty.call( messages, m ) ){\n                message = messages[m];\n\n                if ( isToken && message[value] ){\n                    delete message[value];\n                    result = value;\n                    // tokens are unique, so we can just stop here\n                    break;\n                }\n\n                if (isFunction) {\n                    for ( t in message ){\n                        if (Object.prototype.hasOwnProperty.call(message, t) && message[t] === value){\n                            delete message[t];\n                            result = true;\n                        }\n                    }\n                }\n            }\n        }\n\n        return result;\n    };\n}));\n\n\n//# sourceURL=webpack://battleship/./node_modules/pubsub-js/src/pubsub.js?");

/***/ }),

/***/ "./src/game.js":
/*!*********************!*\
  !*** ./src/game.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var pubsub_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pubsub-js */ \"./node_modules/pubsub-js/src/pubsub.js\");\n/* harmony import */ var pubsub_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(pubsub_js__WEBPACK_IMPORTED_MODULE_0__);\nconst createGameBoard = __webpack_require__(/*! ./modules/createGameboard/createGameboard */ \"./src/modules/createGameboard/createGameboard.js\");\nconst createShip = __webpack_require__(/*! ./modules/createShip/createShip */ \"./src/modules/createShip/createShip.js\");\nconst createPlayer = __webpack_require__(/*! ./modules/createPlayer/createPlayer */ \"./src/modules/createPlayer/createPlayer.js\");\n\n\nconst game = (() => {\n  function placeShipsDefault(gameboard) {\n    gameboard.placeShipRandomly(createShip(4))\n    gameboard.placeShipRandomly(createShip(2))\n    gameboard.placeShipRandomly(createShip(3))\n    gameboard.placeShipRandomly(createShip(3))\n    gameboard.placeShipRandomly(createShip(2))\n    gameboard.placeShipRandomly(createShip(2))\n    gameboard.placeShipRandomly(createShip(1))\n    gameboard.placeShipRandomly(createShip(1))\n    gameboard.placeShipRandomly(createShip(1))\n    gameboard.placeShipRandomly(createShip(1))\n  }\n\n  const playerGameboard = createGameBoard();\n  placeShipsDefault(playerGameboard);\n\n  const enemyGameboard = createGameBoard();\n  placeShipsDefault(enemyGameboard);\n\n  const player = createPlayer('ME', enemyGameboard)\n  const enemy = createPlayer('BOT', playerGameboard)\n\n\n  function playTurn (coords) {\n    const validAttack = player.attack(coords);\n    if (!validAttack)  return\n\n    if (enemyGameboard.fleetIsSunk()) {\n      console.log(`gameover, you win`)         \n      pubsub_js__WEBPACK_IMPORTED_MODULE_0___default().publish('gameover', player.getName())\n    }\n    enemy.attack();\n    if (playerGameboard.fleetIsSunk()) {\n      console.log(`gameover, enemy win`)\n      pubsub_js__WEBPACK_IMPORTED_MODULE_0___default().publish('gameover', enemy.getName())\n    }\n\n    pubsub_js__WEBPACK_IMPORTED_MODULE_0___default().publishSync('grids updated',\n    {playerGrid: playerGameboard.getGrid(), enemyGrid: enemyGameboard.getGrid()})\n\n    pubsub_js__WEBPACK_IMPORTED_MODULE_0___default().publishSync('fleet updated', playerGameboard.getFleetCoords())\n  }\n\n  pubsub_js__WEBPACK_IMPORTED_MODULE_0___default().publishSync('grids updated',\n    {playerGrid: playerGameboard.getGrid(), enemyGrid: enemyGameboard.getGrid()})\n  pubsub_js__WEBPACK_IMPORTED_MODULE_0___default().publishSync('fleet updated', playerGameboard.getFleetCoords())\n\n  pubsub_js__WEBPACK_IMPORTED_MODULE_0___default().subscribe('enemy cell attacked', (msg, coords) => game.playTurn(coords))\n\n  return { playTurn }\n})();\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (game);\n\n//# sourceURL=webpack://battleship/./src/game.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _view__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./view */ \"./src/view.js\");\n/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./game */ \"./src/game.js\");\n\n\n\n//# sourceURL=webpack://battleship/./src/index.js?");

/***/ }),

/***/ "./src/modules/createGameboard/createGameboard.js":
/*!********************************************************!*\
  !*** ./src/modules/createGameboard/createGameboard.js ***!
  \********************************************************/
/***/ ((module) => {

eval("function createGameboard () {\n  const grid = Array.from(Array(10), () => Array(10).fill(null));\n  const fleet = [];\n\n  const getGrid = () => {\n    return Array.from(grid, (arr1D) => [...arr1D])\n  }\n\n  getFleetCoords = () => fleet.map(unit => {\n    return JSON.parse(JSON.stringify(unit.coords))})\n\n  const coordsExist = (coords) => (\n    coords.x < 10 && coords.x >= 0\n    && coords.y < 10 && coords.y >= 0\n  )\n\n  const findShipFrom = (targetCoords) => {\n    return fleet.find(unit => \n      unit.coords.some((coords) =>\n        coords.x === targetCoords.x && coords.y === targetCoords.y));\n  }\n\n  const getAdjacentCoords = (coords) => {\n    const adjacentCoords = [];\n    for (let i = -1; i <= 1; i++) {\n      for (let j = -1; j <= 1; j++) {\n        const currentCoords = {x: coords.x + i, y: coords.y + j};\n        if (coordsExist(currentCoords) && (i !==0 || j !== 0))\n            adjacentCoords.push({x: coords.x + i, y: coords.y + j});\n      }\n    }\n    return adjacentCoords;\n  }\n  \n  const cellAvailable = (coords) => {\n    if (grid[coords.x]?.[coords.y] !== null) return false\n    const adjacentCoords = getAdjacentCoords(coords);\n    for (let adjacentCoord of adjacentCoords) {\n      if(findShipFrom(adjacentCoord))\n        return false\n    }\n    return true\n  }\n\n\n  const placeShip = (ship, origin, position) => {\n    const addOffset = (() => {\n      if (position == 'horizontal') {\n        return (offset) => ({\n          x: origin.x + offset,\n          y: origin.y    \n        })\n      } else if (position == 'vertical') {\n        return (offset) => ({\n          x: origin.x,\n          y: origin.y + offset    \n        })\n      }\n    })();\n\n    const wouldbeShipCoords = [];\n    for (let offset = 0; offset < ship.length; offset++) {\n      const coords = addOffset(offset);\n      if (!cellAvailable(coords)) return false\n      wouldbeShipCoords.push(coords);\n    }\n\n    fleet.push({\n      coords: wouldbeShipCoords,\n      ship: ship\n    });\n\n    return true\n  }\n\n  const placeShipRandomly = (ship) => {   \n    const pullRandomItemFrom = (arr) =>\n       arr.splice(Math.random() * arr.length, 1)[0];\n\n    const availableCells = [];\n    for (let x = 0; x < 10; x++) {\n      for (let y = 0; y < 10; y++) {\n        const coords = {x: x, y: y};\n        if (cellAvailable(coords))\n          availableCells.push(coords)\n      }\n    }\n    \n\n    let shipIsPlaced = false;\n    do {\n      const positions = ['vertical', 'horizontal'];\n      const origin = pullRandomItemFrom(availableCells);\n      shipIsPlaced = placeShip(ship, origin, pullRandomItemFrom(positions));\n      if (!shipIsPlaced)\n        shipIsPlaced = placeShip(ship, origin, pullRandomItemFrom(positions));\n    } while (!shipIsPlaced || ((!shipIsPlaced) && availableCells.length > 0))\n\n    return shipIsPlaced\n  }\n\n  const revealAdjacentCells = (coords)  => {\n    const adjacentCoords = getAdjacentCoords(coords);\n    for (let coords of adjacentCoords) {\n      if (grid[coords.x]?.[coords.y] === null)\n        grid[coords.x][coords.y] = 'miss';\n    }\n  }\n\n  const receiveAttack = (coords) => {\n    if (grid[coords.x]?.[coords.y] === null) {\n      let mark;\n      const targetedUnit = findShipFrom(coords);\n      if (targetedUnit) {\n        targetedUnit.ship.hit(\n          (coords.y - targetedUnit.coords[0].y)\n          + (coords.x - targetedUnit.coords[0].x)\n        );\n        if (targetedUnit.ship.isSunk()) \n          targetedUnit.coords.forEach(revealAdjacentCells);\n        mark = 'hit';\n      } else {\n        mark = 'miss';\n      }\n      grid[coords.x][coords.y] = mark;\n      return mark\n    } else \n      return false\n  }\n\n  const fleetIsSunk = () => fleet.every(unit => unit.ship.isSunk())\n\n  return { getGrid, placeShip, receiveAttack, fleetIsSunk, placeShipRandomly, getFleetCoords}\n}\n\nmodule.exports = createGameboard;\n\n//# sourceURL=webpack://battleship/./src/modules/createGameboard/createGameboard.js?");

/***/ }),

/***/ "./src/modules/createPlayer/createPlayer.js":
/*!**************************************************!*\
  !*** ./src/modules/createPlayer/createPlayer.js ***!
  \**************************************************/
/***/ ((module) => {

eval("function createPlayer (name, enemyGameboard) {\n\n  const toCellsArray = () => Array.from(enemyGameboard.getGrid(),\n    (row, i) => Array.from(row,\n    (cell, j) => ({coords:{x: i, y: j}, val:cell})))\n    .flat()\n  \n  const getRandomCell = () => {\n    const availableCells = toCellsArray()\n    .filter(cell => (cell.val === null));\n    const cellIndex = Math.floor(Math.random() * availableCells.length);\n    return availableCells[cellIndex]\n  }\n  \n  const attack = (coords = getRandomCell().coords) => \n    enemyGameboard.receiveAttack(coords);\n\n\n  const getName = () => name\n  return { attack, getName }\n}\n\nmodule.exports = createPlayer\n\n//# sourceURL=webpack://battleship/./src/modules/createPlayer/createPlayer.js?");

/***/ }),

/***/ "./src/modules/createShip/createShip.js":
/*!**********************************************!*\
  !*** ./src/modules/createShip/createShip.js ***!
  \**********************************************/
/***/ ((module) => {

eval("function createShip(length) {\n  if (length < 1 || length % 1 !== 0) {\n    throw new Error('Invalid ship length')\n  }\n  const shipBlocks = Array(length).fill('ok');\n\n  const hit = (blockIndex) => {\n    if (shipBlocks[blockIndex] === 'ok')  {\n      shipBlocks[blockIndex] = 'hit';\n      return true\n    }\n    return false\n  };\n\n  const isSunk = () => shipBlocks.every(block => block == 'hit');\n\n  return { length, hit, isSunk }\n}\n\nmodule.exports = createShip\n\n//# sourceURL=webpack://battleship/./src/modules/createShip/createShip.js?");

/***/ }),

/***/ "./src/view.js":
/*!*********************!*\
  !*** ./src/view.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var pubsub_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pubsub-js */ \"./node_modules/pubsub-js/src/pubsub.js\");\n/* harmony import */ var pubsub_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(pubsub_js__WEBPACK_IMPORTED_MODULE_0__);\n\n\nconst view = (()=> {\n  const domLog = document.querySelector('.log');\n  const domPlayerGrid = document.querySelector('#player-grid');\n  const domEnemyGrid = document.querySelector('#enemy-grid');\n\n  const attackHandler = (event) => \n    pubsub_js__WEBPACK_IMPORTED_MODULE_0___default().publish('enemy cell attacked',\n      {x: +event.target.dataset.x, y: +event.target.dataset.y});\n\n  const renderGrid = (msg, {playerGrid, enemyGrid}) => {\n    const grids = new Map();\n    grids.set(playerGrid, domPlayerGrid);\n    grids.set(enemyGrid, domEnemyGrid);\n\n    for (const [arrGrid, domGrid] of grids) {\n      domGrid.innerHTML = \"\";\n      for (let i = 0; i < 10; i++) {\n        for (let j = 0; j < 10; j++) {\n          const domCell = document.createElement('div');\n          domCell.classList.add('cell');        \n          domCell.dataset.x = i;\n          domCell.dataset.y = j;\n          if (arrGrid[i][j] === null && arrGrid === enemyGrid) {\n            domCell.classList.add('cell--clickable');\n            domCell.addEventListener('click', attackHandler);\n          } else if (arrGrid[i][j] === 'miss') {\n            domCell.classList.add('cell--miss');\n          } else if (arrGrid[i][j] === 'hit') {\n            domCell.classList.add('cell--hit');\n          }\n          domGrid.append(domCell);\n        }\n      }\n    }\n  }\n\n\n  const renderFleet = (msg, fleetCoords) => {\n    fleetCoords.forEach(coords => coords\n      .forEach(({x, y}) => {\n        const domCell = domPlayerGrid.querySelector(\n          `[data-x='${x}'][data-y='${y}']`\n        );\n      domCell.classList.add('cell--ship');\n      }))\n  }\n\n  const announceWinner = (winnerName) => {\n    domLog.textContent = `${winnerName} won!`;\n  }\n  const disableEnemyGrid = () => {\n    domEnemyGrid.querySelectorAll('.cell--clickable')\n      .forEach(domCell => {\n        domCell.removeEventListener('click', attackHandler);\n        domCell.classList.remove('cell--clickable');\n      })\n  }\n  pubsub_js__WEBPACK_IMPORTED_MODULE_0___default().subscribe('gameover', (msg, winner) => {\n    announceWinner(winner);\n    disableEnemyGrid();\n  })\n  \n  return { renderGrid, renderFleet }\n})()\n\npubsub_js__WEBPACK_IMPORTED_MODULE_0___default().subscribe('grids updated', view.renderGrid)\npubsub_js__WEBPACK_IMPORTED_MODULE_0___default().subscribe('fleet updated', view.renderFleet)\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (view);\n\n//# sourceURL=webpack://battleship/./src/view.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;