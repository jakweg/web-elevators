/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/elevator-system.ts":
/*!********************************!*\
  !*** ./src/elevator-system.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
exports.__esModule = true;
exports.Elevator = void 0;
var event_producer_1 = __webpack_require__(/*! ./event-producer */ "./src/event-producer.ts");
var util_1 = __webpack_require__(/*! ./util */ "./src/util.ts");
var Elevator = /** @class */ (function () {
    function Elevator(id) {
        this.id = id;
        this.currentFloor = 0;
        this.destinationFloor = 0;
        this.passengers = [];
    }
    return Elevator;
}());
exports.Elevator = Elevator;
var ElevatorSystem = /** @class */ (function (_super) {
    __extends(ElevatorSystem, _super);
    function ElevatorSystem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // id to Elevator
        _this.elevators = new Map();
        _this.waitingPassengers = [];
        return _this;
    }
    ElevatorSystem.prototype.addNewElevator = function () {
        var id = util_1.generateUniqueId();
        var obj = new Elevator(id);
        this.elevators.set(id, obj);
        this.emit('elevator-added', obj);
    };
    ElevatorSystem.prototype.addNewPassenger = function (_a) {
        var name = _a.name, initialFloor = _a.initialFloor, destinationFloor = _a.destinationFloor;
        if (isNaN(initialFloor) || isNaN(destinationFloor))
            throw new Error('Invalid passengers parameters');
        var passenger = {
            id: util_1.generateUniqueId(),
            name: name, initialFloor: initialFloor, destinationFloor: destinationFloor
        };
        this.waitingPassengers.push(passenger);
        this.emit('waiting-passenger-added', passenger);
    };
    ElevatorSystem.prototype.commitNextStep = function () {
        var e_1, _a;
        var _b;
        try {
            // moving elevators
            for (var _c = __values(this.elevators.values()), _d = _c.next(); !_d.done; _d = _c.next()) {
                var elevator = _d.value;
                var wasChanged = false;
                if (elevator.destinationFloor > elevator.currentFloor) {
                    // this elevator is going up
                    elevator.currentFloor++;
                    wasChanged = true;
                }
                else if (elevator.destinationFloor < elevator.currentFloor) {
                    // this elevator is going down
                    elevator.currentFloor--;
                    wasChanged = true;
                }
                // drop passengers that wants to be on this floor
                for (var i = elevator.passengers.length - 1; i >= 0; i--) {
                    var passenger = elevator.passengers[i];
                    if (passenger.destinationFloor === elevator.currentFloor) {
                        elevator.passengers.splice(i, 1);
                        this.emit('passenger-dropped', { passenger: passenger, elevator: elevator });
                    }
                }
                // take passengers that want to go up and are on this floor
                // drop passengers that wants to be on this floor
                for (var i = this.waitingPassengers.length - 1; i >= 0; i--) {
                    var passenger = this.waitingPassengers[i];
                    if (passenger.initialFloor === elevator.currentFloor) {
                        elevator.passengers.push(passenger);
                        this.waitingPassengers.splice(i, 1);
                        this.emit('passenger-taken', { passenger: passenger, elevator: elevator });
                    }
                }
                if (elevator.destinationFloor === elevator.currentFloor) {
                    // elevator is on the destination floor
                    // check if it has passengers
                    if (elevator.passengers.length !== 0) {
                        // looks like it need to continue going the same direction
                        elevator.destinationFloor = elevator.passengers[0].destinationFloor;
                        wasChanged = true;
                    }
                    else {
                        // looks like the elevator is empty, find any waiting passenger to go for //  meaby optimize it?
                        var floor = (_b = this.waitingPassengers[0]) === null || _b === void 0 ? void 0 : _b.initialFloor;
                        if (floor !== undefined) {
                            // there is at least one waiting passenger, go for it
                            elevator.destinationFloor = floor;
                            wasChanged = true;
                        }
                    }
                }
                if (wasChanged) {
                    this.emit('elevator-updated', elevator);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c["return"])) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    return ElevatorSystem;
}(event_producer_1["default"]));
exports.default = ElevatorSystem;


/***/ }),

/***/ "./src/event-producer.ts":
/*!*******************************!*\
  !*** ./src/event-producer.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports) {


var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
exports.__esModule = true;
var EventProducer = /** @class */ (function () {
    function EventProducer() {
        this.listeners = new Map();
    }
    EventProducer.prototype.addEventListener = function (type, listener) {
        var _a;
        var list = (_a = this.listeners.get(type)) !== null && _a !== void 0 ? _a : [];
        list.push(listener);
        this.listeners.set(type, list);
    };
    EventProducer.prototype.emit = function (type, event) {
        var e_1, _a;
        var _b;
        try {
            for (var _c = __values(((_b = this.listeners.get(type)) !== null && _b !== void 0 ? _b : [])), _d = _c.next(); !_d.done; _d = _c.next()) {
                var l = _d.value;
                l(event);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c["return"])) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    return EventProducer;
}());
exports.default = EventProducer;


/***/ }),

/***/ "./src/util.ts":
/*!*********************!*\
  !*** ./src/util.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports) => {


exports.__esModule = true;
exports.generateUniqueId = void 0;
var nextId = 1;
var generateUniqueId = function () {
    return nextId++;
};
exports.generateUniqueId = generateUniqueId;


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
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/

exports.__esModule = true;
var elevator_system_1 = __webpack_require__(/*! ./elevator-system */ "./src/elevator-system.ts");
// show main box when JS is enabled
document.querySelector('main').style.display = null;
var system = new elevator_system_1["default"]();
var elevatorsListDiv = document.getElementById('elevators-list');
var waitingPassengersListDiv = document.getElementById('waiting-passengers-list');
// DOM events:
document.getElementById('add-elevator-btn').addEventListener('click', function () { return system.addNewElevator(); });
document.getElementById('add-passenger-btn').addEventListener('click', function () {
    system.addNewPassenger({
        name: prompt('Give a passenger name', '') || '',
        initialFloor: +prompt('That floor is that passenger on?'),
        destinationFloor: +prompt('That floor is that passenger going to go?'),
    });
});
document.getElementById('next-step-btn').addEventListener('click', function () { return system.commitNextStep(); });
// system events
system.addEventListener('elevator-added', function (elevator) {
    var elevatorDiv = document.createElement('div');
    elevatorDiv.id = "elevator-id-" + elevator.id;
    elevatorDiv.classList.add('elevator');
    {
        var el = document.createElement('div');
        el.classList.add('elevator-id-value');
        el.innerText = "" + elevator.id;
        elevatorDiv.appendChild(el);
    }
    {
        var el = document.createElement('div');
        el.classList.add('elevator-id-title');
        el.innerText = "Elevator ID";
        elevatorDiv.appendChild(el);
    }
    {
        var el = document.createElement('div');
        el.classList.add('current-floor-value');
        el.innerText = "" + elevator.currentFloor;
        elevatorDiv.appendChild(el);
    }
    {
        var el = document.createElement('div');
        el.innerText = "Current floor";
        elevatorDiv.appendChild(el);
    }
    {
        var el = document.createElement('div');
        el.classList.add('destination-floor-value');
        el.innerText = "" + elevator.destinationFloor;
        elevatorDiv.appendChild(el);
    }
    {
        var el = document.createElement('div');
        el.innerText = "Destination floor";
        elevatorDiv.appendChild(el);
    }
    {
        var el = document.createElement('div');
        el.classList.add('passengers-inside-list');
        elevatorDiv.appendChild(el);
    }
    elevatorsListDiv.appendChild(elevatorDiv);
});
system.addEventListener('elevator-updated', function (elevator) {
    var elevatorDiv = document.getElementById("elevator-id-" + elevator.id);
    elevatorDiv.querySelector('.current-floor-value').innerText = "" + elevator.currentFloor;
    elevatorDiv.querySelector('.destination-floor-value').innerText = "" + elevator.destinationFloor;
});
system.addEventListener('waiting-passenger-added', function (passenger) {
    var elevatorDiv = document.createElement('div');
    elevatorDiv.id = "waiting-passenger-id-" + passenger.id;
    elevatorDiv.classList.add('waiting-passenger');
    {
        var el = document.createElement('div');
        el.innerText = "" + passenger.name;
        elevatorDiv.appendChild(el);
    }
    {
        var el = document.createElement('div');
        el.innerText = "Name";
        elevatorDiv.appendChild(el);
    }
    {
        var el = document.createElement('div');
        el.innerText = "" + passenger.initialFloor;
        elevatorDiv.appendChild(el);
    }
    {
        var el = document.createElement('div');
        el.innerText = "Waiting at";
        elevatorDiv.appendChild(el);
    }
    {
        var el = document.createElement('div');
        el.innerText = "" + passenger.destinationFloor;
        elevatorDiv.appendChild(el);
    }
    {
        var el = document.createElement('div');
        el.innerText = "Destination floor";
        elevatorDiv.appendChild(el);
    }
    waitingPassengersListDiv.appendChild(elevatorDiv);
});
system.addEventListener('passenger-taken', function (_a) {
    var passenger = _a.passenger, elevator = _a.elevator;
    document.getElementById("waiting-passenger-id-" + passenger.id).remove();
    var listOfInsiders = document.querySelector("#elevator-id-" + elevator.id + " .passengers-inside-list");
    var el = document.createElement('div');
    el.id = "passenger_" + passenger.id;
    el.classList.add('passenger-inside');
    el.innerText = "" + passenger.name;
    listOfInsiders.appendChild(el);
});
system.addEventListener('passenger-dropped', function (_a) {
    var passenger = _a.passenger, elevator = _a.elevator;
    document.querySelector("#elevator-id-" + elevator.id + " #passenger_" + passenger.id).remove();
});
// system.addNewElevator()
system.addNewElevator();
system.addNewPassenger({
    name: 'Jakub', initialFloor: 2, destinationFloor: 5
});
system.addNewPassenger({
    name: 'Piotr', initialFloor: 6, destinationFloor: 3
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWItZWxldmF0b3JzLy4vc3JjL2VsZXZhdG9yLXN5c3RlbS50cyIsIndlYnBhY2s6Ly93ZWItZWxldmF0b3JzLy4vc3JjL2V2ZW50LXByb2R1Y2VyLnRzIiwid2VicGFjazovL3dlYi1lbGV2YXRvcnMvLi9zcmMvdXRpbC50cyIsIndlYnBhY2s6Ly93ZWItZWxldmF0b3JzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dlYi1lbGV2YXRvcnMvLi9zcmMvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxjQUFjLGdCQUFnQixzQ0FBc0MsaUJBQWlCLEVBQUU7QUFDdkYsNkJBQTZCLDhFQUE4RTtBQUMzRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsc0JBQXNCO0FBQzdDO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCLGdCQUFnQjtBQUNoQix1QkFBdUIsbUJBQU8sQ0FBQyxpREFBa0I7QUFDakQsYUFBYSxtQkFBTyxDQUFDLDZCQUFRO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEVBQTRFLFVBQVU7QUFDdEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0REFBNEQsUUFBUTtBQUNwRTtBQUNBO0FBQ0E7QUFDQSx3REFBd0QsMkNBQTJDO0FBQ25HO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0RBQStELFFBQVE7QUFDdkU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzREFBc0QsMkNBQTJDO0FBQ2pHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLFFBQVEsZ0JBQWdCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLDBCQUEwQjtBQUMvQztBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsZUFBa0I7Ozs7Ozs7Ozs7O0FDeElMO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwSEFBMEgsVUFBVTtBQUNwSTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixRQUFRLGdCQUFnQjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQiwwQkFBMEI7QUFDL0M7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELGVBQWtCOzs7Ozs7Ozs7OztBQzFDTDtBQUNiLGtCQUFrQjtBQUNsQix3QkFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0I7Ozs7Ozs7VUNQeEI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7Ozs7OztBQ3RCYTtBQUNiLGtCQUFrQjtBQUNsQix3QkFBd0IsbUJBQU8sQ0FBQyxtREFBbUI7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUZBQW1GLGdDQUFnQyxFQUFFO0FBQ3JIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQztBQUNELGdGQUFnRixnQ0FBZ0MsRUFBRTtBQUNsSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQSxDQUFDIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICB9O1xufSkoKTtcbnZhciBfX3ZhbHVlcyA9ICh0aGlzICYmIHRoaXMuX192YWx1ZXMpIHx8IGZ1bmN0aW9uKG8pIHtcbiAgICB2YXIgcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuaXRlcmF0b3IsIG0gPSBzICYmIG9bc10sIGkgPSAwO1xuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xuICAgIGlmIChvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHtcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihzID8gXCJPYmplY3QgaXMgbm90IGl0ZXJhYmxlLlwiIDogXCJTeW1ib2wuaXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xufTtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLkVsZXZhdG9yID0gdm9pZCAwO1xudmFyIGV2ZW50X3Byb2R1Y2VyXzEgPSByZXF1aXJlKFwiLi9ldmVudC1wcm9kdWNlclwiKTtcbnZhciB1dGlsXzEgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xudmFyIEVsZXZhdG9yID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEVsZXZhdG9yKGlkKSB7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5jdXJyZW50Rmxvb3IgPSAwO1xuICAgICAgICB0aGlzLmRlc3RpbmF0aW9uRmxvb3IgPSAwO1xuICAgICAgICB0aGlzLnBhc3NlbmdlcnMgPSBbXTtcbiAgICB9XG4gICAgcmV0dXJuIEVsZXZhdG9yO1xufSgpKTtcbmV4cG9ydHMuRWxldmF0b3IgPSBFbGV2YXRvcjtcbnZhciBFbGV2YXRvclN5c3RlbSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoRWxldmF0b3JTeXN0ZW0sIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gRWxldmF0b3JTeXN0ZW0oKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xuICAgICAgICAvLyBpZCB0byBFbGV2YXRvclxuICAgICAgICBfdGhpcy5lbGV2YXRvcnMgPSBuZXcgTWFwKCk7XG4gICAgICAgIF90aGlzLndhaXRpbmdQYXNzZW5nZXJzID0gW107XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgRWxldmF0b3JTeXN0ZW0ucHJvdG90eXBlLmFkZE5ld0VsZXZhdG9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaWQgPSB1dGlsXzEuZ2VuZXJhdGVVbmlxdWVJZCgpO1xuICAgICAgICB2YXIgb2JqID0gbmV3IEVsZXZhdG9yKGlkKTtcbiAgICAgICAgdGhpcy5lbGV2YXRvcnMuc2V0KGlkLCBvYmopO1xuICAgICAgICB0aGlzLmVtaXQoJ2VsZXZhdG9yLWFkZGVkJywgb2JqKTtcbiAgICB9O1xuICAgIEVsZXZhdG9yU3lzdGVtLnByb3RvdHlwZS5hZGROZXdQYXNzZW5nZXIgPSBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgdmFyIG5hbWUgPSBfYS5uYW1lLCBpbml0aWFsRmxvb3IgPSBfYS5pbml0aWFsRmxvb3IsIGRlc3RpbmF0aW9uRmxvb3IgPSBfYS5kZXN0aW5hdGlvbkZsb29yO1xuICAgICAgICBpZiAoaXNOYU4oaW5pdGlhbEZsb29yKSB8fCBpc05hTihkZXN0aW5hdGlvbkZsb29yKSlcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBwYXNzZW5nZXJzIHBhcmFtZXRlcnMnKTtcbiAgICAgICAgdmFyIHBhc3NlbmdlciA9IHtcbiAgICAgICAgICAgIGlkOiB1dGlsXzEuZ2VuZXJhdGVVbmlxdWVJZCgpLFxuICAgICAgICAgICAgbmFtZTogbmFtZSwgaW5pdGlhbEZsb29yOiBpbml0aWFsRmxvb3IsIGRlc3RpbmF0aW9uRmxvb3I6IGRlc3RpbmF0aW9uRmxvb3JcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy53YWl0aW5nUGFzc2VuZ2Vycy5wdXNoKHBhc3Nlbmdlcik7XG4gICAgICAgIHRoaXMuZW1pdCgnd2FpdGluZy1wYXNzZW5nZXItYWRkZWQnLCBwYXNzZW5nZXIpO1xuICAgIH07XG4gICAgRWxldmF0b3JTeXN0ZW0ucHJvdG90eXBlLmNvbW1pdE5leHRTdGVwID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZV8xLCBfYTtcbiAgICAgICAgdmFyIF9iO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gbW92aW5nIGVsZXZhdG9yc1xuICAgICAgICAgICAgZm9yICh2YXIgX2MgPSBfX3ZhbHVlcyh0aGlzLmVsZXZhdG9ycy52YWx1ZXMoKSksIF9kID0gX2MubmV4dCgpOyAhX2QuZG9uZTsgX2QgPSBfYy5uZXh0KCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgZWxldmF0b3IgPSBfZC52YWx1ZTtcbiAgICAgICAgICAgICAgICB2YXIgd2FzQ2hhbmdlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlmIChlbGV2YXRvci5kZXN0aW5hdGlvbkZsb29yID4gZWxldmF0b3IuY3VycmVudEZsb29yKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMgZWxldmF0b3IgaXMgZ29pbmcgdXBcbiAgICAgICAgICAgICAgICAgICAgZWxldmF0b3IuY3VycmVudEZsb29yKys7XG4gICAgICAgICAgICAgICAgICAgIHdhc0NoYW5nZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChlbGV2YXRvci5kZXN0aW5hdGlvbkZsb29yIDwgZWxldmF0b3IuY3VycmVudEZsb29yKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMgZWxldmF0b3IgaXMgZ29pbmcgZG93blxuICAgICAgICAgICAgICAgICAgICBlbGV2YXRvci5jdXJyZW50Rmxvb3ItLTtcbiAgICAgICAgICAgICAgICAgICAgd2FzQ2hhbmdlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGRyb3AgcGFzc2VuZ2VycyB0aGF0IHdhbnRzIHRvIGJlIG9uIHRoaXMgZmxvb3JcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gZWxldmF0b3IucGFzc2VuZ2Vycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcGFzc2VuZ2VyID0gZWxldmF0b3IucGFzc2VuZ2Vyc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhc3Nlbmdlci5kZXN0aW5hdGlvbkZsb29yID09PSBlbGV2YXRvci5jdXJyZW50Rmxvb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZXZhdG9yLnBhc3NlbmdlcnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdwYXNzZW5nZXItZHJvcHBlZCcsIHsgcGFzc2VuZ2VyOiBwYXNzZW5nZXIsIGVsZXZhdG9yOiBlbGV2YXRvciB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyB0YWtlIHBhc3NlbmdlcnMgdGhhdCB3YW50IHRvIGdvIHVwIGFuZCBhcmUgb24gdGhpcyBmbG9vclxuICAgICAgICAgICAgICAgIC8vIGRyb3AgcGFzc2VuZ2VycyB0aGF0IHdhbnRzIHRvIGJlIG9uIHRoaXMgZmxvb3JcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gdGhpcy53YWl0aW5nUGFzc2VuZ2Vycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcGFzc2VuZ2VyID0gdGhpcy53YWl0aW5nUGFzc2VuZ2Vyc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhc3Nlbmdlci5pbml0aWFsRmxvb3IgPT09IGVsZXZhdG9yLmN1cnJlbnRGbG9vcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxldmF0b3IucGFzc2VuZ2Vycy5wdXNoKHBhc3Nlbmdlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndhaXRpbmdQYXNzZW5nZXJzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgncGFzc2VuZ2VyLXRha2VuJywgeyBwYXNzZW5nZXI6IHBhc3NlbmdlciwgZWxldmF0b3I6IGVsZXZhdG9yIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChlbGV2YXRvci5kZXN0aW5hdGlvbkZsb29yID09PSBlbGV2YXRvci5jdXJyZW50Rmxvb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZWxldmF0b3IgaXMgb24gdGhlIGRlc3RpbmF0aW9uIGZsb29yXG4gICAgICAgICAgICAgICAgICAgIC8vIGNoZWNrIGlmIGl0IGhhcyBwYXNzZW5nZXJzXG4gICAgICAgICAgICAgICAgICAgIGlmIChlbGV2YXRvci5wYXNzZW5nZXJzLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbG9va3MgbGlrZSBpdCBuZWVkIHRvIGNvbnRpbnVlIGdvaW5nIHRoZSBzYW1lIGRpcmVjdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgZWxldmF0b3IuZGVzdGluYXRpb25GbG9vciA9IGVsZXZhdG9yLnBhc3NlbmdlcnNbMF0uZGVzdGluYXRpb25GbG9vcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdhc0NoYW5nZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbG9va3MgbGlrZSB0aGUgZWxldmF0b3IgaXMgZW1wdHksIGZpbmQgYW55IHdhaXRpbmcgcGFzc2VuZ2VyIHRvIGdvIGZvciAvLyAgbWVhYnkgb3B0aW1pemUgaXQ/XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmxvb3IgPSAoX2IgPSB0aGlzLndhaXRpbmdQYXNzZW5nZXJzWzBdKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuaW5pdGlhbEZsb29yO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZsb29yICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGVyZSBpcyBhdCBsZWFzdCBvbmUgd2FpdGluZyBwYXNzZW5nZXIsIGdvIGZvciBpdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZXZhdG9yLmRlc3RpbmF0aW9uRmxvb3IgPSBmbG9vcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3YXNDaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAod2FzQ2hhbmdlZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2VsZXZhdG9yLXVwZGF0ZWQnLCBlbGV2YXRvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlXzFfMSkgeyBlXzEgPSB7IGVycm9yOiBlXzFfMSB9OyB9XG4gICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBpZiAoX2QgJiYgIV9kLmRvbmUgJiYgKF9hID0gX2NbXCJyZXR1cm5cIl0pKSBfYS5jYWxsKF9jKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpbmFsbHkgeyBpZiAoZV8xKSB0aHJvdyBlXzEuZXJyb3I7IH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIEVsZXZhdG9yU3lzdGVtO1xufShldmVudF9wcm9kdWNlcl8xW1wiZGVmYXVsdFwiXSkpO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBFbGV2YXRvclN5c3RlbTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fdmFsdWVzID0gKHRoaXMgJiYgdGhpcy5fX3ZhbHVlcykgfHwgZnVuY3Rpb24obykge1xuICAgIHZhciBzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIFN5bWJvbC5pdGVyYXRvciwgbSA9IHMgJiYgb1tzXSwgaSA9IDA7XG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XG4gICAgaWYgKG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSByZXR1cm4ge1xuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xuICAgICAgICB9XG4gICAgfTtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHMgPyBcIk9iamVjdCBpcyBub3QgaXRlcmFibGUuXCIgOiBcIlN5bWJvbC5pdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XG59O1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbnZhciBFdmVudFByb2R1Y2VyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEV2ZW50UHJvZHVjZXIoKSB7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzID0gbmV3IE1hcCgpO1xuICAgIH1cbiAgICBFdmVudFByb2R1Y2VyLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24gKHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgdmFyIGxpc3QgPSAoX2EgPSB0aGlzLmxpc3RlbmVycy5nZXQodHlwZSkpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IFtdO1xuICAgICAgICBsaXN0LnB1c2gobGlzdGVuZXIpO1xuICAgICAgICB0aGlzLmxpc3RlbmVycy5zZXQodHlwZSwgbGlzdCk7XG4gICAgfTtcbiAgICBFdmVudFByb2R1Y2VyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24gKHR5cGUsIGV2ZW50KSB7XG4gICAgICAgIHZhciBlXzEsIF9hO1xuICAgICAgICB2YXIgX2I7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmb3IgKHZhciBfYyA9IF9fdmFsdWVzKCgoX2IgPSB0aGlzLmxpc3RlbmVycy5nZXQodHlwZSkpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IFtdKSksIF9kID0gX2MubmV4dCgpOyAhX2QuZG9uZTsgX2QgPSBfYy5uZXh0KCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgbCA9IF9kLnZhbHVlO1xuICAgICAgICAgICAgICAgIGwoZXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlXzFfMSkgeyBlXzEgPSB7IGVycm9yOiBlXzFfMSB9OyB9XG4gICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBpZiAoX2QgJiYgIV9kLmRvbmUgJiYgKF9hID0gX2NbXCJyZXR1cm5cIl0pKSBfYS5jYWxsKF9jKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpbmFsbHkgeyBpZiAoZV8xKSB0aHJvdyBlXzEuZXJyb3I7IH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIEV2ZW50UHJvZHVjZXI7XG59KCkpO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBFdmVudFByb2R1Y2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5nZW5lcmF0ZVVuaXF1ZUlkID0gdm9pZCAwO1xudmFyIG5leHRJZCA9IDE7XG52YXIgZ2VuZXJhdGVVbmlxdWVJZCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbmV4dElkKys7XG59O1xuZXhwb3J0cy5nZW5lcmF0ZVVuaXF1ZUlkID0gZ2VuZXJhdGVVbmlxdWVJZDtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJcInVzZSBzdHJpY3RcIjtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG52YXIgZWxldmF0b3Jfc3lzdGVtXzEgPSByZXF1aXJlKFwiLi9lbGV2YXRvci1zeXN0ZW1cIik7XG4vLyBzaG93IG1haW4gYm94IHdoZW4gSlMgaXMgZW5hYmxlZFxuZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWFpbicpLnN0eWxlLmRpc3BsYXkgPSBudWxsO1xudmFyIHN5c3RlbSA9IG5ldyBlbGV2YXRvcl9zeXN0ZW1fMVtcImRlZmF1bHRcIl0oKTtcbnZhciBlbGV2YXRvcnNMaXN0RGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VsZXZhdG9ycy1saXN0Jyk7XG52YXIgd2FpdGluZ1Bhc3NlbmdlcnNMaXN0RGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dhaXRpbmctcGFzc2VuZ2Vycy1saXN0Jyk7XG4vLyBET00gZXZlbnRzOlxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FkZC1lbGV2YXRvci1idG4nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHN5c3RlbS5hZGROZXdFbGV2YXRvcigpOyB9KTtcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhZGQtcGFzc2VuZ2VyLWJ0bicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIHN5c3RlbS5hZGROZXdQYXNzZW5nZXIoe1xuICAgICAgICBuYW1lOiBwcm9tcHQoJ0dpdmUgYSBwYXNzZW5nZXIgbmFtZScsICcnKSB8fCAnJyxcbiAgICAgICAgaW5pdGlhbEZsb29yOiArcHJvbXB0KCdUaGF0IGZsb29yIGlzIHRoYXQgcGFzc2VuZ2VyIG9uPycpLFxuICAgICAgICBkZXN0aW5hdGlvbkZsb29yOiArcHJvbXB0KCdUaGF0IGZsb29yIGlzIHRoYXQgcGFzc2VuZ2VyIGdvaW5nIHRvIGdvPycpLFxuICAgIH0pO1xufSk7XG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmV4dC1zdGVwLWJ0bicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkgeyByZXR1cm4gc3lzdGVtLmNvbW1pdE5leHRTdGVwKCk7IH0pO1xuLy8gc3lzdGVtIGV2ZW50c1xuc3lzdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2VsZXZhdG9yLWFkZGVkJywgZnVuY3Rpb24gKGVsZXZhdG9yKSB7XG4gICAgdmFyIGVsZXZhdG9yRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZWxldmF0b3JEaXYuaWQgPSBcImVsZXZhdG9yLWlkLVwiICsgZWxldmF0b3IuaWQ7XG4gICAgZWxldmF0b3JEaXYuY2xhc3NMaXN0LmFkZCgnZWxldmF0b3InKTtcbiAgICB7XG4gICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKCdlbGV2YXRvci1pZC12YWx1ZScpO1xuICAgICAgICBlbC5pbm5lclRleHQgPSBcIlwiICsgZWxldmF0b3IuaWQ7XG4gICAgICAgIGVsZXZhdG9yRGl2LmFwcGVuZENoaWxkKGVsKTtcbiAgICB9XG4gICAge1xuICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZWwuY2xhc3NMaXN0LmFkZCgnZWxldmF0b3ItaWQtdGl0bGUnKTtcbiAgICAgICAgZWwuaW5uZXJUZXh0ID0gXCJFbGV2YXRvciBJRFwiO1xuICAgICAgICBlbGV2YXRvckRpdi5hcHBlbmRDaGlsZChlbCk7XG4gICAgfVxuICAgIHtcbiAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2N1cnJlbnQtZmxvb3ItdmFsdWUnKTtcbiAgICAgICAgZWwuaW5uZXJUZXh0ID0gXCJcIiArIGVsZXZhdG9yLmN1cnJlbnRGbG9vcjtcbiAgICAgICAgZWxldmF0b3JEaXYuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIH1cbiAgICB7XG4gICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBlbC5pbm5lclRleHQgPSBcIkN1cnJlbnQgZmxvb3JcIjtcbiAgICAgICAgZWxldmF0b3JEaXYuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIH1cbiAgICB7XG4gICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKCdkZXN0aW5hdGlvbi1mbG9vci12YWx1ZScpO1xuICAgICAgICBlbC5pbm5lclRleHQgPSBcIlwiICsgZWxldmF0b3IuZGVzdGluYXRpb25GbG9vcjtcbiAgICAgICAgZWxldmF0b3JEaXYuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIH1cbiAgICB7XG4gICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBlbC5pbm5lclRleHQgPSBcIkRlc3RpbmF0aW9uIGZsb29yXCI7XG4gICAgICAgIGVsZXZhdG9yRGl2LmFwcGVuZENoaWxkKGVsKTtcbiAgICB9XG4gICAge1xuICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZWwuY2xhc3NMaXN0LmFkZCgncGFzc2VuZ2Vycy1pbnNpZGUtbGlzdCcpO1xuICAgICAgICBlbGV2YXRvckRpdi5hcHBlbmRDaGlsZChlbCk7XG4gICAgfVxuICAgIGVsZXZhdG9yc0xpc3REaXYuYXBwZW5kQ2hpbGQoZWxldmF0b3JEaXYpO1xufSk7XG5zeXN0ZW0uYWRkRXZlbnRMaXN0ZW5lcignZWxldmF0b3ItdXBkYXRlZCcsIGZ1bmN0aW9uIChlbGV2YXRvcikge1xuICAgIHZhciBlbGV2YXRvckRpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZWxldmF0b3ItaWQtXCIgKyBlbGV2YXRvci5pZCk7XG4gICAgZWxldmF0b3JEaXYucXVlcnlTZWxlY3RvcignLmN1cnJlbnQtZmxvb3ItdmFsdWUnKS5pbm5lclRleHQgPSBcIlwiICsgZWxldmF0b3IuY3VycmVudEZsb29yO1xuICAgIGVsZXZhdG9yRGl2LnF1ZXJ5U2VsZWN0b3IoJy5kZXN0aW5hdGlvbi1mbG9vci12YWx1ZScpLmlubmVyVGV4dCA9IFwiXCIgKyBlbGV2YXRvci5kZXN0aW5hdGlvbkZsb29yO1xufSk7XG5zeXN0ZW0uYWRkRXZlbnRMaXN0ZW5lcignd2FpdGluZy1wYXNzZW5nZXItYWRkZWQnLCBmdW5jdGlvbiAocGFzc2VuZ2VyKSB7XG4gICAgdmFyIGVsZXZhdG9yRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZWxldmF0b3JEaXYuaWQgPSBcIndhaXRpbmctcGFzc2VuZ2VyLWlkLVwiICsgcGFzc2VuZ2VyLmlkO1xuICAgIGVsZXZhdG9yRGl2LmNsYXNzTGlzdC5hZGQoJ3dhaXRpbmctcGFzc2VuZ2VyJyk7XG4gICAge1xuICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZWwuaW5uZXJUZXh0ID0gXCJcIiArIHBhc3Nlbmdlci5uYW1lO1xuICAgICAgICBlbGV2YXRvckRpdi5hcHBlbmRDaGlsZChlbCk7XG4gICAgfVxuICAgIHtcbiAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGVsLmlubmVyVGV4dCA9IFwiTmFtZVwiO1xuICAgICAgICBlbGV2YXRvckRpdi5hcHBlbmRDaGlsZChlbCk7XG4gICAgfVxuICAgIHtcbiAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGVsLmlubmVyVGV4dCA9IFwiXCIgKyBwYXNzZW5nZXIuaW5pdGlhbEZsb29yO1xuICAgICAgICBlbGV2YXRvckRpdi5hcHBlbmRDaGlsZChlbCk7XG4gICAgfVxuICAgIHtcbiAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGVsLmlubmVyVGV4dCA9IFwiV2FpdGluZyBhdFwiO1xuICAgICAgICBlbGV2YXRvckRpdi5hcHBlbmRDaGlsZChlbCk7XG4gICAgfVxuICAgIHtcbiAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGVsLmlubmVyVGV4dCA9IFwiXCIgKyBwYXNzZW5nZXIuZGVzdGluYXRpb25GbG9vcjtcbiAgICAgICAgZWxldmF0b3JEaXYuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIH1cbiAgICB7XG4gICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBlbC5pbm5lclRleHQgPSBcIkRlc3RpbmF0aW9uIGZsb29yXCI7XG4gICAgICAgIGVsZXZhdG9yRGl2LmFwcGVuZENoaWxkKGVsKTtcbiAgICB9XG4gICAgd2FpdGluZ1Bhc3NlbmdlcnNMaXN0RGl2LmFwcGVuZENoaWxkKGVsZXZhdG9yRGl2KTtcbn0pO1xuc3lzdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ3Bhc3Nlbmdlci10YWtlbicsIGZ1bmN0aW9uIChfYSkge1xuICAgIHZhciBwYXNzZW5nZXIgPSBfYS5wYXNzZW5nZXIsIGVsZXZhdG9yID0gX2EuZWxldmF0b3I7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3YWl0aW5nLXBhc3Nlbmdlci1pZC1cIiArIHBhc3Nlbmdlci5pZCkucmVtb3ZlKCk7XG4gICAgdmFyIGxpc3RPZkluc2lkZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNlbGV2YXRvci1pZC1cIiArIGVsZXZhdG9yLmlkICsgXCIgLnBhc3NlbmdlcnMtaW5zaWRlLWxpc3RcIik7XG4gICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZWwuaWQgPSBcInBhc3Nlbmdlcl9cIiArIHBhc3Nlbmdlci5pZDtcbiAgICBlbC5jbGFzc0xpc3QuYWRkKCdwYXNzZW5nZXItaW5zaWRlJyk7XG4gICAgZWwuaW5uZXJUZXh0ID0gXCJcIiArIHBhc3Nlbmdlci5uYW1lO1xuICAgIGxpc3RPZkluc2lkZXJzLmFwcGVuZENoaWxkKGVsKTtcbn0pO1xuc3lzdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ3Bhc3Nlbmdlci1kcm9wcGVkJywgZnVuY3Rpb24gKF9hKSB7XG4gICAgdmFyIHBhc3NlbmdlciA9IF9hLnBhc3NlbmdlciwgZWxldmF0b3IgPSBfYS5lbGV2YXRvcjtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2VsZXZhdG9yLWlkLVwiICsgZWxldmF0b3IuaWQgKyBcIiAjcGFzc2VuZ2VyX1wiICsgcGFzc2VuZ2VyLmlkKS5yZW1vdmUoKTtcbn0pO1xuLy8gc3lzdGVtLmFkZE5ld0VsZXZhdG9yKClcbnN5c3RlbS5hZGROZXdFbGV2YXRvcigpO1xuc3lzdGVtLmFkZE5ld1Bhc3Nlbmdlcih7XG4gICAgbmFtZTogJ0pha3ViJywgaW5pdGlhbEZsb29yOiAyLCBkZXN0aW5hdGlvbkZsb29yOiA1XG59KTtcbnN5c3RlbS5hZGROZXdQYXNzZW5nZXIoe1xuICAgIG5hbWU6ICdQaW90cicsIGluaXRpYWxGbG9vcjogNiwgZGVzdGluYXRpb25GbG9vcjogM1xufSk7XG4iXSwic291cmNlUm9vdCI6IiJ9