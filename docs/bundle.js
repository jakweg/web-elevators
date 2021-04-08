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
        _this.waitingPassengersAboutToBeTaken = [];
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
        var e_1, _a, e_2, _b, e_3, _c;
        // assign elevators to passengers if someone is waiting
        for (var i = this.waitingPassengers.length - 1; i >= 0; i--) {
            var passenger = this.waitingPassengers[i];
            // find any elevator that is moving this direction
            var foundOne = false;
            try {
                for (var _d = (e_1 = void 0, __values(this.elevators.values())), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var elevator = _e.value;
                    // check if is moving
                    if (elevator.currentFloor !== elevator.destinationFloor) {
                        // check if (going down and we the passenger is below this elevator and the passenger wants to go down) OR exacly the opposite
                        if ((elevator.destinationFloor < elevator.currentFloor
                            && passenger.initialFloor <= elevator.currentFloor
                            && passenger.destinationFloor < passenger.initialFloor)
                            || (elevator.destinationFloor > elevator.currentFloor
                                && passenger.initialFloor >= elevator.currentFloor
                                && passenger.destinationFloor > passenger.initialFloor)) {
                            // elevator going to this passenger found!
                            this.waitingPassengersAboutToBeTaken.push(passenger);
                            this.waitingPassengers.splice(i, 1);
                            // change elevator's destination floor, because it may by farer away then it's current one
                            if (Math.abs(elevator.destinationFloor - elevator.currentFloor) < Math.abs(passenger.destinationFloor - elevator.currentFloor)) {
                                elevator.destinationFloor = passenger.destinationFloor;
                            }
                            // FIXME: it's possible that single elevator gets updated multiple times, but there should be a single event!
                            this.emit('elevator-updated', elevator);
                            foundOne = true;
                            break;
                        }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_a = _d["return"])) _a.call(_d);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (!foundOne) {
                try {
                    // there is no elevator that is going in our direction, use one that is free
                    for (var _f = (e_2 = void 0, __values(this.elevators.values())), _g = _f.next(); !_g.done; _g = _f.next()) {
                        var elevator = _g.value;
                        // check if is free
                        if (elevator.currentFloor === elevator.destinationFloor) {
                            this.waitingPassengersAboutToBeTaken.push(passenger);
                            this.waitingPassengers.splice(i, 1);
                            elevator.destinationFloor = passenger.initialFloor;
                            // FIXME: it's possible that single elevator gets updated multiple times, but there should be a single event!
                            this.emit('elevator-updated', elevator);
                            break;
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_g && !_g.done && (_b = _f["return"])) _b.call(_f);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        try {
            // moving elevators
            for (var _h = __values(this.elevators.values()), _j = _h.next(); !_j.done; _j = _h.next()) {
                var elevator = _j.value;
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
                for (var i = this.waitingPassengersAboutToBeTaken.length - 1; i >= 0; i--) {
                    var passenger = this.waitingPassengersAboutToBeTaken[i];
                    if (passenger.initialFloor === elevator.currentFloor) {
                        elevator.passengers.push(passenger);
                        this.waitingPassengersAboutToBeTaken.splice(i, 1);
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
                        // COMMENTED, because experimenting with different approach
                        // FIXME: remove this
                        // // looks like the elevator is empty, find any waiting passenger to go for //  meaby optimize it?
                        // const floor = this.waitingPassengersAboutToBeTaken[0]?.initialFloor
                        // if (floor !== undefined) {
                        //     // there is at least one waiting passenger, go for it
                        //     elevator.destinationFloor = floor
                        //     wasChanged = true
                        // }
                    }
                }
                if (wasChanged) {
                    this.emit('elevator-updated', elevator);
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_j && !_j.done && (_c = _h["return"])) _c.call(_h);
            }
            finally { if (e_3) throw e_3.error; }
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
system.addNewElevator();
system.addNewElevator();
system.addNewPassenger({
    name: 'Jakub', initialFloor: 2, destinationFloor: 4
});
system.addNewPassenger({
    name: 'Paweł', initialFloor: 6, destinationFloor: 3
});
system.addNewPassenger({
    name: 'Piotr', initialFloor: 6, destinationFloor: 3
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWItZWxldmF0b3JzLy4vc3JjL2VsZXZhdG9yLXN5c3RlbS50cyIsIndlYnBhY2s6Ly93ZWItZWxldmF0b3JzLy4vc3JjL2V2ZW50LXByb2R1Y2VyLnRzIiwid2VicGFjazovL3dlYi1lbGV2YXRvcnMvLi9zcmMvdXRpbC50cyIsIndlYnBhY2s6Ly93ZWItZWxldmF0b3JzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dlYi1lbGV2YXRvcnMvLi9zcmMvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxjQUFjLGdCQUFnQixzQ0FBc0MsaUJBQWlCLEVBQUU7QUFDdkYsNkJBQTZCLDhFQUE4RTtBQUMzRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsc0JBQXNCO0FBQzdDO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCLGdCQUFnQjtBQUNoQix1QkFBdUIsbUJBQU8sQ0FBQyxpREFBa0I7QUFDakQsYUFBYSxtQkFBTyxDQUFDLDZCQUFRO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVEQUF1RCxRQUFRO0FBQy9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0dBQWdHLFVBQVU7QUFDMUc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQSxDQUFDIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICB9O1xufSkoKTtcbnZhciBfX3ZhbHVlcyA9ICh0aGlzICYmIHRoaXMuX192YWx1ZXMpIHx8IGZ1bmN0aW9uKG8pIHtcbiAgICB2YXIgcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuaXRlcmF0b3IsIG0gPSBzICYmIG9bc10sIGkgPSAwO1xuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xuICAgIGlmIChvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHtcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihzID8gXCJPYmplY3QgaXMgbm90IGl0ZXJhYmxlLlwiIDogXCJTeW1ib2wuaXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xufTtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLkVsZXZhdG9yID0gdm9pZCAwO1xudmFyIGV2ZW50X3Byb2R1Y2VyXzEgPSByZXF1aXJlKFwiLi9ldmVudC1wcm9kdWNlclwiKTtcbnZhciB1dGlsXzEgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xudmFyIEVsZXZhdG9yID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEVsZXZhdG9yKGlkKSB7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5jdXJyZW50Rmxvb3IgPSAwO1xuICAgICAgICB0aGlzLmRlc3RpbmF0aW9uRmxvb3IgPSAwO1xuICAgICAgICB0aGlzLnBhc3NlbmdlcnMgPSBbXTtcbiAgICB9XG4gICAgcmV0dXJuIEVsZXZhdG9yO1xufSgpKTtcbmV4cG9ydHMuRWxldmF0b3IgPSBFbGV2YXRvcjtcbnZhciBFbGV2YXRvclN5c3RlbSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoRWxldmF0b3JTeXN0ZW0sIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gRWxldmF0b3JTeXN0ZW0oKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xuICAgICAgICAvLyBpZCB0byBFbGV2YXRvclxuICAgICAgICBfdGhpcy5lbGV2YXRvcnMgPSBuZXcgTWFwKCk7XG4gICAgICAgIF90aGlzLndhaXRpbmdQYXNzZW5nZXJzID0gW107XG4gICAgICAgIF90aGlzLndhaXRpbmdQYXNzZW5nZXJzQWJvdXRUb0JlVGFrZW4gPSBbXTtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICBFbGV2YXRvclN5c3RlbS5wcm90b3R5cGUuYWRkTmV3RWxldmF0b3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBpZCA9IHV0aWxfMS5nZW5lcmF0ZVVuaXF1ZUlkKCk7XG4gICAgICAgIHZhciBvYmogPSBuZXcgRWxldmF0b3IoaWQpO1xuICAgICAgICB0aGlzLmVsZXZhdG9ycy5zZXQoaWQsIG9iaik7XG4gICAgICAgIHRoaXMuZW1pdCgnZWxldmF0b3ItYWRkZWQnLCBvYmopO1xuICAgIH07XG4gICAgRWxldmF0b3JTeXN0ZW0ucHJvdG90eXBlLmFkZE5ld1Bhc3NlbmdlciA9IGZ1bmN0aW9uIChfYSkge1xuICAgICAgICB2YXIgbmFtZSA9IF9hLm5hbWUsIGluaXRpYWxGbG9vciA9IF9hLmluaXRpYWxGbG9vciwgZGVzdGluYXRpb25GbG9vciA9IF9hLmRlc3RpbmF0aW9uRmxvb3I7XG4gICAgICAgIGlmIChpc05hTihpbml0aWFsRmxvb3IpIHx8IGlzTmFOKGRlc3RpbmF0aW9uRmxvb3IpKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHBhc3NlbmdlcnMgcGFyYW1ldGVycycpO1xuICAgICAgICB2YXIgcGFzc2VuZ2VyID0ge1xuICAgICAgICAgICAgaWQ6IHV0aWxfMS5nZW5lcmF0ZVVuaXF1ZUlkKCksXG4gICAgICAgICAgICBuYW1lOiBuYW1lLCBpbml0aWFsRmxvb3I6IGluaXRpYWxGbG9vciwgZGVzdGluYXRpb25GbG9vcjogZGVzdGluYXRpb25GbG9vclxuICAgICAgICB9O1xuICAgICAgICB0aGlzLndhaXRpbmdQYXNzZW5nZXJzLnB1c2gocGFzc2VuZ2VyKTtcbiAgICAgICAgdGhpcy5lbWl0KCd3YWl0aW5nLXBhc3Nlbmdlci1hZGRlZCcsIHBhc3Nlbmdlcik7XG4gICAgfTtcbiAgICBFbGV2YXRvclN5c3RlbS5wcm90b3R5cGUuY29tbWl0TmV4dFN0ZXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBlXzEsIF9hLCBlXzIsIF9iLCBlXzMsIF9jO1xuICAgICAgICAvLyBhc3NpZ24gZWxldmF0b3JzIHRvIHBhc3NlbmdlcnMgaWYgc29tZW9uZSBpcyB3YWl0aW5nXG4gICAgICAgIGZvciAodmFyIGkgPSB0aGlzLndhaXRpbmdQYXNzZW5nZXJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICB2YXIgcGFzc2VuZ2VyID0gdGhpcy53YWl0aW5nUGFzc2VuZ2Vyc1tpXTtcbiAgICAgICAgICAgIC8vIGZpbmQgYW55IGVsZXZhdG9yIHRoYXQgaXMgbW92aW5nIHRoaXMgZGlyZWN0aW9uXG4gICAgICAgICAgICB2YXIgZm91bmRPbmUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgX2QgPSAoZV8xID0gdm9pZCAwLCBfX3ZhbHVlcyh0aGlzLmVsZXZhdG9ycy52YWx1ZXMoKSkpLCBfZSA9IF9kLm5leHQoKTsgIV9lLmRvbmU7IF9lID0gX2QubmV4dCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlbGV2YXRvciA9IF9lLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAvLyBjaGVjayBpZiBpcyBtb3ZpbmdcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsZXZhdG9yLmN1cnJlbnRGbG9vciAhPT0gZWxldmF0b3IuZGVzdGluYXRpb25GbG9vcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2hlY2sgaWYgKGdvaW5nIGRvd24gYW5kIHdlIHRoZSBwYXNzZW5nZXIgaXMgYmVsb3cgdGhpcyBlbGV2YXRvciBhbmQgdGhlIHBhc3NlbmdlciB3YW50cyB0byBnbyBkb3duKSBPUiBleGFjbHkgdGhlIG9wcG9zaXRlXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGVsZXZhdG9yLmRlc3RpbmF0aW9uRmxvb3IgPCBlbGV2YXRvci5jdXJyZW50Rmxvb3JcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiBwYXNzZW5nZXIuaW5pdGlhbEZsb29yIDw9IGVsZXZhdG9yLmN1cnJlbnRGbG9vclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHBhc3Nlbmdlci5kZXN0aW5hdGlvbkZsb29yIDwgcGFzc2VuZ2VyLmluaXRpYWxGbG9vcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCAoZWxldmF0b3IuZGVzdGluYXRpb25GbG9vciA+IGVsZXZhdG9yLmN1cnJlbnRGbG9vclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiBwYXNzZW5nZXIuaW5pdGlhbEZsb29yID49IGVsZXZhdG9yLmN1cnJlbnRGbG9vclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiBwYXNzZW5nZXIuZGVzdGluYXRpb25GbG9vciA+IHBhc3Nlbmdlci5pbml0aWFsRmxvb3IpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZWxldmF0b3IgZ29pbmcgdG8gdGhpcyBwYXNzZW5nZXIgZm91bmQhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53YWl0aW5nUGFzc2VuZ2Vyc0Fib3V0VG9CZVRha2VuLnB1c2gocGFzc2VuZ2VyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndhaXRpbmdQYXNzZW5nZXJzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjaGFuZ2UgZWxldmF0b3IncyBkZXN0aW5hdGlvbiBmbG9vciwgYmVjYXVzZSBpdCBtYXkgYnkgZmFyZXIgYXdheSB0aGVuIGl0J3MgY3VycmVudCBvbmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoZWxldmF0b3IuZGVzdGluYXRpb25GbG9vciAtIGVsZXZhdG9yLmN1cnJlbnRGbG9vcikgPCBNYXRoLmFicyhwYXNzZW5nZXIuZGVzdGluYXRpb25GbG9vciAtIGVsZXZhdG9yLmN1cnJlbnRGbG9vcikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxldmF0b3IuZGVzdGluYXRpb25GbG9vciA9IHBhc3Nlbmdlci5kZXN0aW5hdGlvbkZsb29yO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBGSVhNRTogaXQncyBwb3NzaWJsZSB0aGF0IHNpbmdsZSBlbGV2YXRvciBnZXRzIHVwZGF0ZWQgbXVsdGlwbGUgdGltZXMsIGJ1dCB0aGVyZSBzaG91bGQgYmUgYSBzaW5nbGUgZXZlbnQhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdlbGV2YXRvci11cGRhdGVkJywgZWxldmF0b3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kT25lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlXzFfMSkgeyBlXzEgPSB7IGVycm9yOiBlXzFfMSB9OyB9XG4gICAgICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoX2UgJiYgIV9lLmRvbmUgJiYgKF9hID0gX2RbXCJyZXR1cm5cIl0pKSBfYS5jYWxsKF9kKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZmluYWxseSB7IGlmIChlXzEpIHRocm93IGVfMS5lcnJvcjsgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFmb3VuZE9uZSkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZXJlIGlzIG5vIGVsZXZhdG9yIHRoYXQgaXMgZ29pbmcgaW4gb3VyIGRpcmVjdGlvbiwgdXNlIG9uZSB0aGF0IGlzIGZyZWVcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgX2YgPSAoZV8yID0gdm9pZCAwLCBfX3ZhbHVlcyh0aGlzLmVsZXZhdG9ycy52YWx1ZXMoKSkpLCBfZyA9IF9mLm5leHQoKTsgIV9nLmRvbmU7IF9nID0gX2YubmV4dCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZWxldmF0b3IgPSBfZy52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNoZWNrIGlmIGlzIGZyZWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbGV2YXRvci5jdXJyZW50Rmxvb3IgPT09IGVsZXZhdG9yLmRlc3RpbmF0aW9uRmxvb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndhaXRpbmdQYXNzZW5nZXJzQWJvdXRUb0JlVGFrZW4ucHVzaChwYXNzZW5nZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud2FpdGluZ1Bhc3NlbmdlcnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZXZhdG9yLmRlc3RpbmF0aW9uRmxvb3IgPSBwYXNzZW5nZXIuaW5pdGlhbEZsb29yO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZJWE1FOiBpdCdzIHBvc3NpYmxlIHRoYXQgc2luZ2xlIGVsZXZhdG9yIGdldHMgdXBkYXRlZCBtdWx0aXBsZSB0aW1lcywgYnV0IHRoZXJlIHNob3VsZCBiZSBhIHNpbmdsZSBldmVudCFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2VsZXZhdG9yLXVwZGF0ZWQnLCBlbGV2YXRvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVfMl8xKSB7IGVfMiA9IHsgZXJyb3I6IGVfMl8xIH07IH1cbiAgICAgICAgICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfZyAmJiAhX2cuZG9uZSAmJiAoX2IgPSBfZltcInJldHVyblwiXSkpIF9iLmNhbGwoX2YpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGZpbmFsbHkgeyBpZiAoZV8yKSB0aHJvdyBlXzIuZXJyb3I7IH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIG1vdmluZyBlbGV2YXRvcnNcbiAgICAgICAgICAgIGZvciAodmFyIF9oID0gX192YWx1ZXModGhpcy5lbGV2YXRvcnMudmFsdWVzKCkpLCBfaiA9IF9oLm5leHQoKTsgIV9qLmRvbmU7IF9qID0gX2gubmV4dCgpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGVsZXZhdG9yID0gX2oudmFsdWU7XG4gICAgICAgICAgICAgICAgdmFyIHdhc0NoYW5nZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpZiAoZWxldmF0b3IuZGVzdGluYXRpb25GbG9vciA+IGVsZXZhdG9yLmN1cnJlbnRGbG9vcikge1xuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzIGVsZXZhdG9yIGlzIGdvaW5nIHVwXG4gICAgICAgICAgICAgICAgICAgIGVsZXZhdG9yLmN1cnJlbnRGbG9vcisrO1xuICAgICAgICAgICAgICAgICAgICB3YXNDaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoZWxldmF0b3IuZGVzdGluYXRpb25GbG9vciA8IGVsZXZhdG9yLmN1cnJlbnRGbG9vcikge1xuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzIGVsZXZhdG9yIGlzIGdvaW5nIGRvd25cbiAgICAgICAgICAgICAgICAgICAgZWxldmF0b3IuY3VycmVudEZsb29yLS07XG4gICAgICAgICAgICAgICAgICAgIHdhc0NoYW5nZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBkcm9wIHBhc3NlbmdlcnMgdGhhdCB3YW50cyB0byBiZSBvbiB0aGlzIGZsb29yXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IGVsZXZhdG9yLnBhc3NlbmdlcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBhc3NlbmdlciA9IGVsZXZhdG9yLnBhc3NlbmdlcnNbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXNzZW5nZXIuZGVzdGluYXRpb25GbG9vciA9PT0gZWxldmF0b3IuY3VycmVudEZsb29yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGV2YXRvci5wYXNzZW5nZXJzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgncGFzc2VuZ2VyLWRyb3BwZWQnLCB7IHBhc3NlbmdlcjogcGFzc2VuZ2VyLCBlbGV2YXRvcjogZWxldmF0b3IgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gdGFrZSBwYXNzZW5nZXJzIHRoYXQgd2FudCB0byBnbyB1cCBhbmQgYXJlIG9uIHRoaXMgZmxvb3JcbiAgICAgICAgICAgICAgICAvLyBkcm9wIHBhc3NlbmdlcnMgdGhhdCB3YW50cyB0byBiZSBvbiB0aGlzIGZsb29yXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IHRoaXMud2FpdGluZ1Bhc3NlbmdlcnNBYm91dFRvQmVUYWtlbi5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcGFzc2VuZ2VyID0gdGhpcy53YWl0aW5nUGFzc2VuZ2Vyc0Fib3V0VG9CZVRha2VuW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFzc2VuZ2VyLmluaXRpYWxGbG9vciA9PT0gZWxldmF0b3IuY3VycmVudEZsb29yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGV2YXRvci5wYXNzZW5nZXJzLnB1c2gocGFzc2VuZ2VyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud2FpdGluZ1Bhc3NlbmdlcnNBYm91dFRvQmVUYWtlbi5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ3Bhc3Nlbmdlci10YWtlbicsIHsgcGFzc2VuZ2VyOiBwYXNzZW5nZXIsIGVsZXZhdG9yOiBlbGV2YXRvciB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZWxldmF0b3IuZGVzdGluYXRpb25GbG9vciA9PT0gZWxldmF0b3IuY3VycmVudEZsb29yKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGVsZXZhdG9yIGlzIG9uIHRoZSBkZXN0aW5hdGlvbiBmbG9vclxuICAgICAgICAgICAgICAgICAgICAvLyBjaGVjayBpZiBpdCBoYXMgcGFzc2VuZ2Vyc1xuICAgICAgICAgICAgICAgICAgICBpZiAoZWxldmF0b3IucGFzc2VuZ2Vycy5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGxvb2tzIGxpa2UgaXQgbmVlZCB0byBjb250aW51ZSBnb2luZyB0aGUgc2FtZSBkaXJlY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZXZhdG9yLmRlc3RpbmF0aW9uRmxvb3IgPSBlbGV2YXRvci5wYXNzZW5nZXJzWzBdLmRlc3RpbmF0aW9uRmxvb3I7XG4gICAgICAgICAgICAgICAgICAgICAgICB3YXNDaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENPTU1FTlRFRCwgYmVjYXVzZSBleHBlcmltZW50aW5nIHdpdGggZGlmZmVyZW50IGFwcHJvYWNoXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBGSVhNRTogcmVtb3ZlIHRoaXNcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIC8vIGxvb2tzIGxpa2UgdGhlIGVsZXZhdG9yIGlzIGVtcHR5LCBmaW5kIGFueSB3YWl0aW5nIHBhc3NlbmdlciB0byBnbyBmb3IgLy8gIG1lYWJ5IG9wdGltaXplIGl0P1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc3QgZmxvb3IgPSB0aGlzLndhaXRpbmdQYXNzZW5nZXJzQWJvdXRUb0JlVGFrZW5bMF0/LmluaXRpYWxGbG9vclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgKGZsb29yICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAvLyB0aGVyZSBpcyBhdCBsZWFzdCBvbmUgd2FpdGluZyBwYXNzZW5nZXIsIGdvIGZvciBpdFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIGVsZXZhdG9yLmRlc3RpbmF0aW9uRmxvb3IgPSBmbG9vclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIHdhc0NoYW5nZWQgPSB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHdhc0NoYW5nZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdlbGV2YXRvci11cGRhdGVkJywgZWxldmF0b3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZV8zXzEpIHsgZV8zID0geyBlcnJvcjogZV8zXzEgfTsgfVxuICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKF9qICYmICFfai5kb25lICYmIChfYyA9IF9oW1wicmV0dXJuXCJdKSkgX2MuY2FsbChfaCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaW5hbGx5IHsgaWYgKGVfMykgdGhyb3cgZV8zLmVycm9yOyB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBFbGV2YXRvclN5c3RlbTtcbn0oZXZlbnRfcHJvZHVjZXJfMVtcImRlZmF1bHRcIl0pKTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gRWxldmF0b3JTeXN0ZW07XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX3ZhbHVlcyA9ICh0aGlzICYmIHRoaXMuX192YWx1ZXMpIHx8IGZ1bmN0aW9uKG8pIHtcbiAgICB2YXIgcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuaXRlcmF0b3IsIG0gPSBzICYmIG9bc10sIGkgPSAwO1xuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xuICAgIGlmIChvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHtcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihzID8gXCJPYmplY3QgaXMgbm90IGl0ZXJhYmxlLlwiIDogXCJTeW1ib2wuaXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xufTtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG52YXIgRXZlbnRQcm9kdWNlciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBFdmVudFByb2R1Y2VyKCkge1xuICAgICAgICB0aGlzLmxpc3RlbmVycyA9IG5ldyBNYXAoKTtcbiAgICB9XG4gICAgRXZlbnRQcm9kdWNlci5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uICh0eXBlLCBsaXN0ZW5lcikge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHZhciBsaXN0ID0gKF9hID0gdGhpcy5saXN0ZW5lcnMuZ2V0KHR5cGUpKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBbXTtcbiAgICAgICAgbGlzdC5wdXNoKGxpc3RlbmVyKTtcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMuc2V0KHR5cGUsIGxpc3QpO1xuICAgIH07XG4gICAgRXZlbnRQcm9kdWNlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uICh0eXBlLCBldmVudCkge1xuICAgICAgICB2YXIgZV8xLCBfYTtcbiAgICAgICAgdmFyIF9iO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm9yICh2YXIgX2MgPSBfX3ZhbHVlcygoKF9iID0gdGhpcy5saXN0ZW5lcnMuZ2V0KHR5cGUpKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBbXSkpLCBfZCA9IF9jLm5leHQoKTsgIV9kLmRvbmU7IF9kID0gX2MubmV4dCgpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGwgPSBfZC52YWx1ZTtcbiAgICAgICAgICAgICAgICBsKGV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZV8xXzEpIHsgZV8xID0geyBlcnJvcjogZV8xXzEgfTsgfVxuICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKF9kICYmICFfZC5kb25lICYmIChfYSA9IF9jW1wicmV0dXJuXCJdKSkgX2EuY2FsbChfYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaW5hbGx5IHsgaWYgKGVfMSkgdGhyb3cgZV8xLmVycm9yOyB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBFdmVudFByb2R1Y2VyO1xufSgpKTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gRXZlbnRQcm9kdWNlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuZ2VuZXJhdGVVbmlxdWVJZCA9IHZvaWQgMDtcbnZhciBuZXh0SWQgPSAxO1xudmFyIGdlbmVyYXRlVW5pcXVlSWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG5leHRJZCsrO1xufTtcbmV4cG9ydHMuZ2VuZXJhdGVVbmlxdWVJZCA9IGdlbmVyYXRlVW5pcXVlSWQ7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xudmFyIGVsZXZhdG9yX3N5c3RlbV8xID0gcmVxdWlyZShcIi4vZWxldmF0b3Itc3lzdGVtXCIpO1xuLy8gc2hvdyBtYWluIGJveCB3aGVuIEpTIGlzIGVuYWJsZWRcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21haW4nKS5zdHlsZS5kaXNwbGF5ID0gbnVsbDtcbnZhciBzeXN0ZW0gPSBuZXcgZWxldmF0b3Jfc3lzdGVtXzFbXCJkZWZhdWx0XCJdKCk7XG52YXIgZWxldmF0b3JzTGlzdERpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlbGV2YXRvcnMtbGlzdCcpO1xudmFyIHdhaXRpbmdQYXNzZW5nZXJzTGlzdERpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3YWl0aW5nLXBhc3NlbmdlcnMtbGlzdCcpO1xuLy8gRE9NIGV2ZW50czpcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhZGQtZWxldmF0b3ItYnRuJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7IHJldHVybiBzeXN0ZW0uYWRkTmV3RWxldmF0b3IoKTsgfSk7XG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWRkLXBhc3Nlbmdlci1idG4nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICBzeXN0ZW0uYWRkTmV3UGFzc2VuZ2VyKHtcbiAgICAgICAgbmFtZTogcHJvbXB0KCdHaXZlIGEgcGFzc2VuZ2VyIG5hbWUnLCAnJykgfHwgJycsXG4gICAgICAgIGluaXRpYWxGbG9vcjogK3Byb21wdCgnVGhhdCBmbG9vciBpcyB0aGF0IHBhc3NlbmdlciBvbj8nKSxcbiAgICAgICAgZGVzdGluYXRpb25GbG9vcjogK3Byb21wdCgnVGhhdCBmbG9vciBpcyB0aGF0IHBhc3NlbmdlciBnb2luZyB0byBnbz8nKSxcbiAgICB9KTtcbn0pO1xuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25leHQtc3RlcC1idG4nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHN5c3RlbS5jb21taXROZXh0U3RlcCgpOyB9KTtcbi8vIHN5c3RlbSBldmVudHNcbnN5c3RlbS5hZGRFdmVudExpc3RlbmVyKCdlbGV2YXRvci1hZGRlZCcsIGZ1bmN0aW9uIChlbGV2YXRvcikge1xuICAgIHZhciBlbGV2YXRvckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGVsZXZhdG9yRGl2LmlkID0gXCJlbGV2YXRvci1pZC1cIiArIGVsZXZhdG9yLmlkO1xuICAgIGVsZXZhdG9yRGl2LmNsYXNzTGlzdC5hZGQoJ2VsZXZhdG9yJyk7XG4gICAge1xuICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZWwuY2xhc3NMaXN0LmFkZCgnZWxldmF0b3ItaWQtdmFsdWUnKTtcbiAgICAgICAgZWwuaW5uZXJUZXh0ID0gXCJcIiArIGVsZXZhdG9yLmlkO1xuICAgICAgICBlbGV2YXRvckRpdi5hcHBlbmRDaGlsZChlbCk7XG4gICAgfVxuICAgIHtcbiAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2VsZXZhdG9yLWlkLXRpdGxlJyk7XG4gICAgICAgIGVsLmlubmVyVGV4dCA9IFwiRWxldmF0b3IgSURcIjtcbiAgICAgICAgZWxldmF0b3JEaXYuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIH1cbiAgICB7XG4gICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKCdjdXJyZW50LWZsb29yLXZhbHVlJyk7XG4gICAgICAgIGVsLmlubmVyVGV4dCA9IFwiXCIgKyBlbGV2YXRvci5jdXJyZW50Rmxvb3I7XG4gICAgICAgIGVsZXZhdG9yRGl2LmFwcGVuZENoaWxkKGVsKTtcbiAgICB9XG4gICAge1xuICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZWwuaW5uZXJUZXh0ID0gXCJDdXJyZW50IGZsb29yXCI7XG4gICAgICAgIGVsZXZhdG9yRGl2LmFwcGVuZENoaWxkKGVsKTtcbiAgICB9XG4gICAge1xuICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZWwuY2xhc3NMaXN0LmFkZCgnZGVzdGluYXRpb24tZmxvb3ItdmFsdWUnKTtcbiAgICAgICAgZWwuaW5uZXJUZXh0ID0gXCJcIiArIGVsZXZhdG9yLmRlc3RpbmF0aW9uRmxvb3I7XG4gICAgICAgIGVsZXZhdG9yRGl2LmFwcGVuZENoaWxkKGVsKTtcbiAgICB9XG4gICAge1xuICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZWwuaW5uZXJUZXh0ID0gXCJEZXN0aW5hdGlvbiBmbG9vclwiO1xuICAgICAgICBlbGV2YXRvckRpdi5hcHBlbmRDaGlsZChlbCk7XG4gICAgfVxuICAgIHtcbiAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoJ3Bhc3NlbmdlcnMtaW5zaWRlLWxpc3QnKTtcbiAgICAgICAgZWxldmF0b3JEaXYuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIH1cbiAgICBlbGV2YXRvcnNMaXN0RGl2LmFwcGVuZENoaWxkKGVsZXZhdG9yRGl2KTtcbn0pO1xuc3lzdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2VsZXZhdG9yLXVwZGF0ZWQnLCBmdW5jdGlvbiAoZWxldmF0b3IpIHtcbiAgICB2YXIgZWxldmF0b3JEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVsZXZhdG9yLWlkLVwiICsgZWxldmF0b3IuaWQpO1xuICAgIGVsZXZhdG9yRGl2LnF1ZXJ5U2VsZWN0b3IoJy5jdXJyZW50LWZsb29yLXZhbHVlJykuaW5uZXJUZXh0ID0gXCJcIiArIGVsZXZhdG9yLmN1cnJlbnRGbG9vcjtcbiAgICBlbGV2YXRvckRpdi5xdWVyeVNlbGVjdG9yKCcuZGVzdGluYXRpb24tZmxvb3ItdmFsdWUnKS5pbm5lclRleHQgPSBcIlwiICsgZWxldmF0b3IuZGVzdGluYXRpb25GbG9vcjtcbn0pO1xuc3lzdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ3dhaXRpbmctcGFzc2VuZ2VyLWFkZGVkJywgZnVuY3Rpb24gKHBhc3Nlbmdlcikge1xuICAgIHZhciBlbGV2YXRvckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGVsZXZhdG9yRGl2LmlkID0gXCJ3YWl0aW5nLXBhc3Nlbmdlci1pZC1cIiArIHBhc3Nlbmdlci5pZDtcbiAgICBlbGV2YXRvckRpdi5jbGFzc0xpc3QuYWRkKCd3YWl0aW5nLXBhc3NlbmdlcicpO1xuICAgIHtcbiAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGVsLmlubmVyVGV4dCA9IFwiXCIgKyBwYXNzZW5nZXIubmFtZTtcbiAgICAgICAgZWxldmF0b3JEaXYuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIH1cbiAgICB7XG4gICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBlbC5pbm5lclRleHQgPSBcIk5hbWVcIjtcbiAgICAgICAgZWxldmF0b3JEaXYuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIH1cbiAgICB7XG4gICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBlbC5pbm5lclRleHQgPSBcIlwiICsgcGFzc2VuZ2VyLmluaXRpYWxGbG9vcjtcbiAgICAgICAgZWxldmF0b3JEaXYuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIH1cbiAgICB7XG4gICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBlbC5pbm5lclRleHQgPSBcIldhaXRpbmcgYXRcIjtcbiAgICAgICAgZWxldmF0b3JEaXYuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIH1cbiAgICB7XG4gICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBlbC5pbm5lclRleHQgPSBcIlwiICsgcGFzc2VuZ2VyLmRlc3RpbmF0aW9uRmxvb3I7XG4gICAgICAgIGVsZXZhdG9yRGl2LmFwcGVuZENoaWxkKGVsKTtcbiAgICB9XG4gICAge1xuICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZWwuaW5uZXJUZXh0ID0gXCJEZXN0aW5hdGlvbiBmbG9vclwiO1xuICAgICAgICBlbGV2YXRvckRpdi5hcHBlbmRDaGlsZChlbCk7XG4gICAgfVxuICAgIHdhaXRpbmdQYXNzZW5nZXJzTGlzdERpdi5hcHBlbmRDaGlsZChlbGV2YXRvckRpdik7XG59KTtcbnN5c3RlbS5hZGRFdmVudExpc3RlbmVyKCdwYXNzZW5nZXItdGFrZW4nLCBmdW5jdGlvbiAoX2EpIHtcbiAgICB2YXIgcGFzc2VuZ2VyID0gX2EucGFzc2VuZ2VyLCBlbGV2YXRvciA9IF9hLmVsZXZhdG9yO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid2FpdGluZy1wYXNzZW5nZXItaWQtXCIgKyBwYXNzZW5nZXIuaWQpLnJlbW92ZSgpO1xuICAgIHZhciBsaXN0T2ZJbnNpZGVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZWxldmF0b3ItaWQtXCIgKyBlbGV2YXRvci5pZCArIFwiIC5wYXNzZW5nZXJzLWluc2lkZS1saXN0XCIpO1xuICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGVsLmlkID0gXCJwYXNzZW5nZXJfXCIgKyBwYXNzZW5nZXIuaWQ7XG4gICAgZWwuY2xhc3NMaXN0LmFkZCgncGFzc2VuZ2VyLWluc2lkZScpO1xuICAgIGVsLmlubmVyVGV4dCA9IFwiXCIgKyBwYXNzZW5nZXIubmFtZTtcbiAgICBsaXN0T2ZJbnNpZGVycy5hcHBlbmRDaGlsZChlbCk7XG59KTtcbnN5c3RlbS5hZGRFdmVudExpc3RlbmVyKCdwYXNzZW5nZXItZHJvcHBlZCcsIGZ1bmN0aW9uIChfYSkge1xuICAgIHZhciBwYXNzZW5nZXIgPSBfYS5wYXNzZW5nZXIsIGVsZXZhdG9yID0gX2EuZWxldmF0b3I7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNlbGV2YXRvci1pZC1cIiArIGVsZXZhdG9yLmlkICsgXCIgI3Bhc3Nlbmdlcl9cIiArIHBhc3Nlbmdlci5pZCkucmVtb3ZlKCk7XG59KTtcbnN5c3RlbS5hZGROZXdFbGV2YXRvcigpO1xuc3lzdGVtLmFkZE5ld0VsZXZhdG9yKCk7XG5zeXN0ZW0uYWRkTmV3UGFzc2VuZ2VyKHtcbiAgICBuYW1lOiAnSmFrdWInLCBpbml0aWFsRmxvb3I6IDIsIGRlc3RpbmF0aW9uRmxvb3I6IDRcbn0pO1xuc3lzdGVtLmFkZE5ld1Bhc3Nlbmdlcih7XG4gICAgbmFtZTogJ1Bhd2XFgicsIGluaXRpYWxGbG9vcjogNiwgZGVzdGluYXRpb25GbG9vcjogM1xufSk7XG5zeXN0ZW0uYWRkTmV3UGFzc2VuZ2VyKHtcbiAgICBuYW1lOiAnUGlvdHInLCBpbml0aWFsRmxvb3I6IDYsIGRlc3RpbmF0aW9uRmxvb3I6IDNcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==