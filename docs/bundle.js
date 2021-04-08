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
        var id = Math.random() * 1000000 | 0;
        if (this.elevators.has(id))
            return this.addNewElevator();
        var obj = new Elevator(id);
        this.elevators.set(id, obj);
        this.emit('elevator-added', obj);
    };
    ElevatorSystem.prototype.addNewPassenger = function (_a) {
        var name = _a.name, initialFloor = _a.initialFloor, destinationFloor = _a.destinationFloor;
        if (isNaN(initialFloor) || isNaN(destinationFloor))
            throw new Error('Invalid passengers parameters');
        var passenger = {
            id: Math.random() * 1000000 | 0,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWItZWxldmF0b3JzLy4vc3JjL2VsZXZhdG9yLXN5c3RlbS50cyIsIndlYnBhY2s6Ly93ZWItZWxldmF0b3JzLy4vc3JjL2V2ZW50LXByb2R1Y2VyLnRzIiwid2VicGFjazovL3dlYi1lbGV2YXRvcnMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vd2ViLWVsZXZhdG9ycy8uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGNBQWMsZ0JBQWdCLHNDQUFzQyxpQkFBaUIsRUFBRTtBQUN2Riw2QkFBNkIsOEVBQThFO0FBQzNHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixzQkFBc0I7QUFDN0M7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEIsZ0JBQWdCO0FBQ2hCLHVCQUF1QixtQkFBTyxDQUFDLGlEQUFrQjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0RUFBNEUsVUFBVTtBQUN0RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDREQUE0RCxRQUFRO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBLHdEQUF3RCwyQ0FBMkM7QUFDbkc7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrREFBK0QsUUFBUTtBQUN2RTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNEQUFzRCwyQ0FBMkM7QUFDakc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsUUFBUSxnQkFBZ0I7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsMEJBQTBCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxlQUFrQjs7Ozs7Ozs7Ozs7QUN6SUw7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBIQUEwSCxVQUFVO0FBQ3BJO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLFFBQVEsZ0JBQWdCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLDBCQUEwQjtBQUMvQztBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsZUFBa0I7Ozs7Ozs7VUMxQ2xCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7Ozs7Ozs7QUN0QmE7QUFDYixrQkFBa0I7QUFDbEIsd0JBQXdCLG1CQUFPLENBQUMsbURBQW1CO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1GQUFtRixnQ0FBZ0MsRUFBRTtBQUNySDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUM7QUFDRCxnRkFBZ0YsZ0NBQWdDLEVBQUU7QUFDbEg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0EsQ0FBQyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcbiAgICAgICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2xhc3MgZXh0ZW5kcyB2YWx1ZSBcIiArIFN0cmluZyhiKSArIFwiIGlzIG5vdCBhIGNvbnN0cnVjdG9yIG9yIG51bGxcIik7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG4gICAgfTtcbn0pKCk7XG52YXIgX192YWx1ZXMgPSAodGhpcyAmJiB0aGlzLl9fdmFsdWVzKSB8fCBmdW5jdGlvbihvKSB7XG4gICAgdmFyIHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yLCBtID0gcyAmJiBvW3NdLCBpID0gMDtcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcbiAgICBpZiAobyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHJldHVybiB7XG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IocyA/IFwiT2JqZWN0IGlzIG5vdCBpdGVyYWJsZS5cIiA6IFwiU3ltYm9sLml0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcbn07XG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5FbGV2YXRvciA9IHZvaWQgMDtcbnZhciBldmVudF9wcm9kdWNlcl8xID0gcmVxdWlyZShcIi4vZXZlbnQtcHJvZHVjZXJcIik7XG52YXIgRWxldmF0b3IgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gRWxldmF0b3IoaWQpIHtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLmN1cnJlbnRGbG9vciA9IDA7XG4gICAgICAgIHRoaXMuZGVzdGluYXRpb25GbG9vciA9IDA7XG4gICAgICAgIHRoaXMucGFzc2VuZ2VycyA9IFtdO1xuICAgIH1cbiAgICByZXR1cm4gRWxldmF0b3I7XG59KCkpO1xuZXhwb3J0cy5FbGV2YXRvciA9IEVsZXZhdG9yO1xudmFyIEVsZXZhdG9yU3lzdGVtID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhFbGV2YXRvclN5c3RlbSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBFbGV2YXRvclN5c3RlbSgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XG4gICAgICAgIC8vIGlkIHRvIEVsZXZhdG9yXG4gICAgICAgIF90aGlzLmVsZXZhdG9ycyA9IG5ldyBNYXAoKTtcbiAgICAgICAgX3RoaXMud2FpdGluZ1Bhc3NlbmdlcnMgPSBbXTtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICBFbGV2YXRvclN5c3RlbS5wcm90b3R5cGUuYWRkTmV3RWxldmF0b3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBpZCA9IE1hdGgucmFuZG9tKCkgKiAxMDAwMDAwIHwgMDtcbiAgICAgICAgaWYgKHRoaXMuZWxldmF0b3JzLmhhcyhpZCkpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hZGROZXdFbGV2YXRvcigpO1xuICAgICAgICB2YXIgb2JqID0gbmV3IEVsZXZhdG9yKGlkKTtcbiAgICAgICAgdGhpcy5lbGV2YXRvcnMuc2V0KGlkLCBvYmopO1xuICAgICAgICB0aGlzLmVtaXQoJ2VsZXZhdG9yLWFkZGVkJywgb2JqKTtcbiAgICB9O1xuICAgIEVsZXZhdG9yU3lzdGVtLnByb3RvdHlwZS5hZGROZXdQYXNzZW5nZXIgPSBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgdmFyIG5hbWUgPSBfYS5uYW1lLCBpbml0aWFsRmxvb3IgPSBfYS5pbml0aWFsRmxvb3IsIGRlc3RpbmF0aW9uRmxvb3IgPSBfYS5kZXN0aW5hdGlvbkZsb29yO1xuICAgICAgICBpZiAoaXNOYU4oaW5pdGlhbEZsb29yKSB8fCBpc05hTihkZXN0aW5hdGlvbkZsb29yKSlcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBwYXNzZW5nZXJzIHBhcmFtZXRlcnMnKTtcbiAgICAgICAgdmFyIHBhc3NlbmdlciA9IHtcbiAgICAgICAgICAgIGlkOiBNYXRoLnJhbmRvbSgpICogMTAwMDAwMCB8IDAsXG4gICAgICAgICAgICBuYW1lOiBuYW1lLCBpbml0aWFsRmxvb3I6IGluaXRpYWxGbG9vciwgZGVzdGluYXRpb25GbG9vcjogZGVzdGluYXRpb25GbG9vclxuICAgICAgICB9O1xuICAgICAgICB0aGlzLndhaXRpbmdQYXNzZW5nZXJzLnB1c2gocGFzc2VuZ2VyKTtcbiAgICAgICAgdGhpcy5lbWl0KCd3YWl0aW5nLXBhc3Nlbmdlci1hZGRlZCcsIHBhc3Nlbmdlcik7XG4gICAgfTtcbiAgICBFbGV2YXRvclN5c3RlbS5wcm90b3R5cGUuY29tbWl0TmV4dFN0ZXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBlXzEsIF9hO1xuICAgICAgICB2YXIgX2I7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBtb3ZpbmcgZWxldmF0b3JzXG4gICAgICAgICAgICBmb3IgKHZhciBfYyA9IF9fdmFsdWVzKHRoaXMuZWxldmF0b3JzLnZhbHVlcygpKSwgX2QgPSBfYy5uZXh0KCk7ICFfZC5kb25lOyBfZCA9IF9jLm5leHQoKSkge1xuICAgICAgICAgICAgICAgIHZhciBlbGV2YXRvciA9IF9kLnZhbHVlO1xuICAgICAgICAgICAgICAgIHZhciB3YXNDaGFuZ2VkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgaWYgKGVsZXZhdG9yLmRlc3RpbmF0aW9uRmxvb3IgPT09IGVsZXZhdG9yLmN1cnJlbnRGbG9vcikge1xuICAgICAgICAgICAgICAgICAgICAvLyBlbGV2YXRvciBpcyBvbiB0aGUgZGVzdGluYXRpb24gZmxvb3JcbiAgICAgICAgICAgICAgICAgICAgLy8gY2hlY2sgaWYgaXQgaGFzIHBhc3NlbmdlcnNcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsZXZhdG9yLnBhc3NlbmdlcnMubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBsb29rcyBsaWtlIGl0IG5lZWQgdG8gY29udGludWUgZ29pbmcgdGhlIHNhbWUgZGlyZWN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGV2YXRvci5kZXN0aW5hdGlvbkZsb29yID0gZWxldmF0b3IucGFzc2VuZ2Vyc1swXS5kZXN0aW5hdGlvbkZsb29yO1xuICAgICAgICAgICAgICAgICAgICAgICAgd2FzQ2hhbmdlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBsb29rcyBsaWtlIHRoZSBlbGV2YXRvciBpcyBlbXB0eSwgZmluZCBhbnkgd2FpdGluZyBwYXNzZW5nZXIgdG8gZ28gZm9yIC8vICBtZWFieSBvcHRpbWl6ZSBpdD9cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmbG9vciA9IChfYiA9IHRoaXMud2FpdGluZ1Bhc3NlbmdlcnNbMF0pID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5pbml0aWFsRmxvb3I7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmxvb3IgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoZXJlIGlzIGF0IGxlYXN0IG9uZSB3YWl0aW5nIHBhc3NlbmdlciwgZ28gZm9yIGl0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxldmF0b3IuZGVzdGluYXRpb25GbG9vciA9IGZsb29yO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdhc0NoYW5nZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChlbGV2YXRvci5kZXN0aW5hdGlvbkZsb29yID4gZWxldmF0b3IuY3VycmVudEZsb29yKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMgZWxldmF0b3IgaXMgZ29pbmcgdXBcbiAgICAgICAgICAgICAgICAgICAgZWxldmF0b3IuY3VycmVudEZsb29yKys7XG4gICAgICAgICAgICAgICAgICAgIHdhc0NoYW5nZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChlbGV2YXRvci5kZXN0aW5hdGlvbkZsb29yIDwgZWxldmF0b3IuY3VycmVudEZsb29yKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMgZWxldmF0b3IgaXMgZ29pbmcgZG93blxuICAgICAgICAgICAgICAgICAgICBlbGV2YXRvci5jdXJyZW50Rmxvb3ItLTtcbiAgICAgICAgICAgICAgICAgICAgd2FzQ2hhbmdlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGRyb3AgcGFzc2VuZ2VycyB0aGF0IHdhbnRzIHRvIGJlIG9uIHRoaXMgZmxvb3JcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gZWxldmF0b3IucGFzc2VuZ2Vycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcGFzc2VuZ2VyID0gZWxldmF0b3IucGFzc2VuZ2Vyc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhc3Nlbmdlci5kZXN0aW5hdGlvbkZsb29yID09PSBlbGV2YXRvci5jdXJyZW50Rmxvb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZXZhdG9yLnBhc3NlbmdlcnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdwYXNzZW5nZXItZHJvcHBlZCcsIHsgcGFzc2VuZ2VyOiBwYXNzZW5nZXIsIGVsZXZhdG9yOiBlbGV2YXRvciB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyB0YWtlIHBhc3NlbmdlcnMgdGhhdCB3YW50IHRvIGdvIHVwIGFuZCBhcmUgb24gdGhpcyBmbG9vclxuICAgICAgICAgICAgICAgIC8vIGRyb3AgcGFzc2VuZ2VycyB0aGF0IHdhbnRzIHRvIGJlIG9uIHRoaXMgZmxvb3JcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gdGhpcy53YWl0aW5nUGFzc2VuZ2Vycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcGFzc2VuZ2VyID0gdGhpcy53YWl0aW5nUGFzc2VuZ2Vyc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhc3Nlbmdlci5pbml0aWFsRmxvb3IgPT09IGVsZXZhdG9yLmN1cnJlbnRGbG9vcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxldmF0b3IucGFzc2VuZ2Vycy5wdXNoKHBhc3Nlbmdlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndhaXRpbmdQYXNzZW5nZXJzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgncGFzc2VuZ2VyLXRha2VuJywgeyBwYXNzZW5nZXI6IHBhc3NlbmdlciwgZWxldmF0b3I6IGVsZXZhdG9yIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh3YXNDaGFuZ2VkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnZWxldmF0b3ItdXBkYXRlZCcsIGVsZXZhdG9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVfMV8xKSB7IGVfMSA9IHsgZXJyb3I6IGVfMV8xIH07IH1cbiAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlmIChfZCAmJiAhX2QuZG9uZSAmJiAoX2EgPSBfY1tcInJldHVyblwiXSkpIF9hLmNhbGwoX2MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmluYWxseSB7IGlmIChlXzEpIHRocm93IGVfMS5lcnJvcjsgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gRWxldmF0b3JTeXN0ZW07XG59KGV2ZW50X3Byb2R1Y2VyXzFbXCJkZWZhdWx0XCJdKSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IEVsZXZhdG9yU3lzdGVtO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX192YWx1ZXMgPSAodGhpcyAmJiB0aGlzLl9fdmFsdWVzKSB8fCBmdW5jdGlvbihvKSB7XG4gICAgdmFyIHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yLCBtID0gcyAmJiBvW3NdLCBpID0gMDtcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcbiAgICBpZiAobyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHJldHVybiB7XG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IocyA/IFwiT2JqZWN0IGlzIG5vdCBpdGVyYWJsZS5cIiA6IFwiU3ltYm9sLml0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcbn07XG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xudmFyIEV2ZW50UHJvZHVjZXIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gRXZlbnRQcm9kdWNlcigpIHtcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSBuZXcgTWFwKCk7XG4gICAgfVxuICAgIEV2ZW50UHJvZHVjZXIucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbiAodHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICB2YXIgbGlzdCA9IChfYSA9IHRoaXMubGlzdGVuZXJzLmdldCh0eXBlKSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogW107XG4gICAgICAgIGxpc3QucHVzaChsaXN0ZW5lcik7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzLnNldCh0eXBlLCBsaXN0KTtcbiAgICB9O1xuICAgIEV2ZW50UHJvZHVjZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbiAodHlwZSwgZXZlbnQpIHtcbiAgICAgICAgdmFyIGVfMSwgX2E7XG4gICAgICAgIHZhciBfYjtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZvciAodmFyIF9jID0gX192YWx1ZXMoKChfYiA9IHRoaXMubGlzdGVuZXJzLmdldCh0eXBlKSkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogW10pKSwgX2QgPSBfYy5uZXh0KCk7ICFfZC5kb25lOyBfZCA9IF9jLm5leHQoKSkge1xuICAgICAgICAgICAgICAgIHZhciBsID0gX2QudmFsdWU7XG4gICAgICAgICAgICAgICAgbChldmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVfMV8xKSB7IGVfMSA9IHsgZXJyb3I6IGVfMV8xIH07IH1cbiAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlmIChfZCAmJiAhX2QuZG9uZSAmJiAoX2EgPSBfY1tcInJldHVyblwiXSkpIF9hLmNhbGwoX2MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmluYWxseSB7IGlmIChlXzEpIHRocm93IGVfMS5lcnJvcjsgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gRXZlbnRQcm9kdWNlcjtcbn0oKSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IEV2ZW50UHJvZHVjZXI7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xudmFyIGVsZXZhdG9yX3N5c3RlbV8xID0gcmVxdWlyZShcIi4vZWxldmF0b3Itc3lzdGVtXCIpO1xuLy8gc2hvdyBtYWluIGJveCB3aGVuIEpTIGlzIGVuYWJsZWRcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21haW4nKS5zdHlsZS5kaXNwbGF5ID0gbnVsbDtcbnZhciBzeXN0ZW0gPSBuZXcgZWxldmF0b3Jfc3lzdGVtXzFbXCJkZWZhdWx0XCJdKCk7XG52YXIgZWxldmF0b3JzTGlzdERpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlbGV2YXRvcnMtbGlzdCcpO1xudmFyIHdhaXRpbmdQYXNzZW5nZXJzTGlzdERpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3YWl0aW5nLXBhc3NlbmdlcnMtbGlzdCcpO1xuLy8gRE9NIGV2ZW50czpcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhZGQtZWxldmF0b3ItYnRuJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7IHJldHVybiBzeXN0ZW0uYWRkTmV3RWxldmF0b3IoKTsgfSk7XG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWRkLXBhc3Nlbmdlci1idG4nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICBzeXN0ZW0uYWRkTmV3UGFzc2VuZ2VyKHtcbiAgICAgICAgbmFtZTogcHJvbXB0KCdHaXZlIGEgcGFzc2VuZ2VyIG5hbWUnLCAnJykgfHwgJycsXG4gICAgICAgIGluaXRpYWxGbG9vcjogK3Byb21wdCgnVGhhdCBmbG9vciBpcyB0aGF0IHBhc3NlbmdlciBvbj8nKSxcbiAgICAgICAgZGVzdGluYXRpb25GbG9vcjogK3Byb21wdCgnVGhhdCBmbG9vciBpcyB0aGF0IHBhc3NlbmdlciBnb2luZyB0byBnbz8nKSxcbiAgICB9KTtcbn0pO1xuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25leHQtc3RlcC1idG4nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHN5c3RlbS5jb21taXROZXh0U3RlcCgpOyB9KTtcbi8vIHN5c3RlbSBldmVudHNcbnN5c3RlbS5hZGRFdmVudExpc3RlbmVyKCdlbGV2YXRvci1hZGRlZCcsIGZ1bmN0aW9uIChlbGV2YXRvcikge1xuICAgIHZhciBlbGV2YXRvckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGVsZXZhdG9yRGl2LmlkID0gXCJlbGV2YXRvci1pZC1cIiArIGVsZXZhdG9yLmlkO1xuICAgIGVsZXZhdG9yRGl2LmNsYXNzTGlzdC5hZGQoJ2VsZXZhdG9yJyk7XG4gICAge1xuICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZWwuY2xhc3NMaXN0LmFkZCgnZWxldmF0b3ItaWQtdmFsdWUnKTtcbiAgICAgICAgZWwuaW5uZXJUZXh0ID0gXCJcIiArIGVsZXZhdG9yLmlkO1xuICAgICAgICBlbGV2YXRvckRpdi5hcHBlbmRDaGlsZChlbCk7XG4gICAgfVxuICAgIHtcbiAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2VsZXZhdG9yLWlkLXRpdGxlJyk7XG4gICAgICAgIGVsLmlubmVyVGV4dCA9IFwiRWxldmF0b3IgSURcIjtcbiAgICAgICAgZWxldmF0b3JEaXYuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIH1cbiAgICB7XG4gICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKCdjdXJyZW50LWZsb29yLXZhbHVlJyk7XG4gICAgICAgIGVsLmlubmVyVGV4dCA9IFwiXCIgKyBlbGV2YXRvci5jdXJyZW50Rmxvb3I7XG4gICAgICAgIGVsZXZhdG9yRGl2LmFwcGVuZENoaWxkKGVsKTtcbiAgICB9XG4gICAge1xuICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZWwuaW5uZXJUZXh0ID0gXCJDdXJyZW50IGZsb29yXCI7XG4gICAgICAgIGVsZXZhdG9yRGl2LmFwcGVuZENoaWxkKGVsKTtcbiAgICB9XG4gICAge1xuICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZWwuY2xhc3NMaXN0LmFkZCgnZGVzdGluYXRpb24tZmxvb3ItdmFsdWUnKTtcbiAgICAgICAgZWwuaW5uZXJUZXh0ID0gXCJcIiArIGVsZXZhdG9yLmRlc3RpbmF0aW9uRmxvb3I7XG4gICAgICAgIGVsZXZhdG9yRGl2LmFwcGVuZENoaWxkKGVsKTtcbiAgICB9XG4gICAge1xuICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZWwuaW5uZXJUZXh0ID0gXCJEZXN0aW5hdGlvbiBmbG9vclwiO1xuICAgICAgICBlbGV2YXRvckRpdi5hcHBlbmRDaGlsZChlbCk7XG4gICAgfVxuICAgIHtcbiAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoJ3Bhc3NlbmdlcnMtaW5zaWRlLWxpc3QnKTtcbiAgICAgICAgZWxldmF0b3JEaXYuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIH1cbiAgICBlbGV2YXRvcnNMaXN0RGl2LmFwcGVuZENoaWxkKGVsZXZhdG9yRGl2KTtcbn0pO1xuc3lzdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2VsZXZhdG9yLXVwZGF0ZWQnLCBmdW5jdGlvbiAoZWxldmF0b3IpIHtcbiAgICB2YXIgZWxldmF0b3JEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVsZXZhdG9yLWlkLVwiICsgZWxldmF0b3IuaWQpO1xuICAgIGVsZXZhdG9yRGl2LnF1ZXJ5U2VsZWN0b3IoJy5jdXJyZW50LWZsb29yLXZhbHVlJykuaW5uZXJUZXh0ID0gXCJcIiArIGVsZXZhdG9yLmN1cnJlbnRGbG9vcjtcbiAgICBlbGV2YXRvckRpdi5xdWVyeVNlbGVjdG9yKCcuZGVzdGluYXRpb24tZmxvb3ItdmFsdWUnKS5pbm5lclRleHQgPSBcIlwiICsgZWxldmF0b3IuZGVzdGluYXRpb25GbG9vcjtcbn0pO1xuc3lzdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ3dhaXRpbmctcGFzc2VuZ2VyLWFkZGVkJywgZnVuY3Rpb24gKHBhc3Nlbmdlcikge1xuICAgIHZhciBlbGV2YXRvckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGVsZXZhdG9yRGl2LmlkID0gXCJ3YWl0aW5nLXBhc3Nlbmdlci1pZC1cIiArIHBhc3Nlbmdlci5pZDtcbiAgICBlbGV2YXRvckRpdi5jbGFzc0xpc3QuYWRkKCd3YWl0aW5nLXBhc3NlbmdlcicpO1xuICAgIHtcbiAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGVsLmlubmVyVGV4dCA9IFwiXCIgKyBwYXNzZW5nZXIubmFtZTtcbiAgICAgICAgZWxldmF0b3JEaXYuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIH1cbiAgICB7XG4gICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBlbC5pbm5lclRleHQgPSBcIk5hbWVcIjtcbiAgICAgICAgZWxldmF0b3JEaXYuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIH1cbiAgICB7XG4gICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBlbC5pbm5lclRleHQgPSBcIlwiICsgcGFzc2VuZ2VyLmluaXRpYWxGbG9vcjtcbiAgICAgICAgZWxldmF0b3JEaXYuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIH1cbiAgICB7XG4gICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBlbC5pbm5lclRleHQgPSBcIldhaXRpbmcgYXRcIjtcbiAgICAgICAgZWxldmF0b3JEaXYuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIH1cbiAgICB7XG4gICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBlbC5pbm5lclRleHQgPSBcIlwiICsgcGFzc2VuZ2VyLmRlc3RpbmF0aW9uRmxvb3I7XG4gICAgICAgIGVsZXZhdG9yRGl2LmFwcGVuZENoaWxkKGVsKTtcbiAgICB9XG4gICAge1xuICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZWwuaW5uZXJUZXh0ID0gXCJEZXN0aW5hdGlvbiBmbG9vclwiO1xuICAgICAgICBlbGV2YXRvckRpdi5hcHBlbmRDaGlsZChlbCk7XG4gICAgfVxuICAgIHdhaXRpbmdQYXNzZW5nZXJzTGlzdERpdi5hcHBlbmRDaGlsZChlbGV2YXRvckRpdik7XG59KTtcbnN5c3RlbS5hZGRFdmVudExpc3RlbmVyKCdwYXNzZW5nZXItdGFrZW4nLCBmdW5jdGlvbiAoX2EpIHtcbiAgICB2YXIgcGFzc2VuZ2VyID0gX2EucGFzc2VuZ2VyLCBlbGV2YXRvciA9IF9hLmVsZXZhdG9yO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid2FpdGluZy1wYXNzZW5nZXItaWQtXCIgKyBwYXNzZW5nZXIuaWQpLnJlbW92ZSgpO1xuICAgIHZhciBsaXN0T2ZJbnNpZGVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZWxldmF0b3ItaWQtXCIgKyBlbGV2YXRvci5pZCArIFwiIC5wYXNzZW5nZXJzLWluc2lkZS1saXN0XCIpO1xuICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGVsLmlkID0gXCJwYXNzZW5nZXJfXCIgKyBwYXNzZW5nZXIuaWQ7XG4gICAgZWwuY2xhc3NMaXN0LmFkZCgncGFzc2VuZ2VyLWluc2lkZScpO1xuICAgIGVsLmlubmVyVGV4dCA9IFwiXCIgKyBwYXNzZW5nZXIubmFtZTtcbiAgICBsaXN0T2ZJbnNpZGVycy5hcHBlbmRDaGlsZChlbCk7XG59KTtcbnN5c3RlbS5hZGRFdmVudExpc3RlbmVyKCdwYXNzZW5nZXItZHJvcHBlZCcsIGZ1bmN0aW9uIChfYSkge1xuICAgIHZhciBwYXNzZW5nZXIgPSBfYS5wYXNzZW5nZXIsIGVsZXZhdG9yID0gX2EuZWxldmF0b3I7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNlbGV2YXRvci1pZC1cIiArIGVsZXZhdG9yLmlkICsgXCIgI3Bhc3Nlbmdlcl9cIiArIHBhc3Nlbmdlci5pZCkucmVtb3ZlKCk7XG59KTtcbi8vIHN5c3RlbS5hZGROZXdFbGV2YXRvcigpXG5zeXN0ZW0uYWRkTmV3RWxldmF0b3IoKTtcbnN5c3RlbS5hZGROZXdQYXNzZW5nZXIoe1xuICAgIG5hbWU6ICdKYWt1YicsIGluaXRpYWxGbG9vcjogMiwgZGVzdGluYXRpb25GbG9vcjogNVxufSk7XG5zeXN0ZW0uYWRkTmV3UGFzc2VuZ2VyKHtcbiAgICBuYW1lOiAnUGlvdHInLCBpbml0aWFsRmxvb3I6IDYsIGRlc3RpbmF0aW9uRmxvb3I6IDNcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==