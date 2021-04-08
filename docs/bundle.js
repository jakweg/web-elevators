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
exports.Elevator = exports.ElevatorDirection = void 0;
var event_producer_1 = __webpack_require__(/*! ./event-producer */ "./src/event-producer.ts");
var util_1 = __webpack_require__(/*! ./util */ "./src/util.ts");
var ElevatorDirection;
(function (ElevatorDirection) {
    ElevatorDirection[ElevatorDirection["Standing"] = 0] = "Standing";
    ElevatorDirection[ElevatorDirection["GoingUp"] = 1] = "GoingUp";
    ElevatorDirection[ElevatorDirection["GoingDown"] = -1] = "GoingDown";
})(ElevatorDirection = exports.ElevatorDirection || (exports.ElevatorDirection = {}));
var Elevator = /** @class */ (function () {
    function Elevator(id) {
        this.id = id;
        this.currentFloor = 0;
        this.direction = ElevatorDirection.Standing;
        this.nextDirection = ElevatorDirection.Standing;
        this.destinationLimit = Number.MAX_SAFE_INTEGER;
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
    ElevatorSystem.prototype.addNewElevator = function (initialFloor) {
        var id = util_1.generateUniqueId();
        var obj = new Elevator(id);
        obj.currentFloor = +initialFloor || 0;
        this.elevators.set(id, obj);
        this.emit('elevator-added', obj);
    };
    ElevatorSystem.prototype.addNewPassenger = function (_a) {
        var name = _a.name, initialFloor = _a.initialFloor, destinationFloor = _a.destinationFloor;
        if (isNaN(initialFloor) || isNaN(destinationFloor))
            throw new Error('Invalid passengers parameters');
        if (initialFloor === destinationFloor)
            throw new Error('Passenger is already on the destination floor');
        var passenger = {
            id: util_1.generateUniqueId(),
            direction: destinationFloor < initialFloor ? ElevatorDirection.GoingDown : ElevatorDirection.GoingUp,
            name: name, initialFloor: initialFloor, destinationFloor: destinationFloor
        };
        this.waitingPassengers.unshift(passenger);
        this.emit('waiting-passenger-added', passenger);
    };
    ElevatorSystem.prototype.commitNextStep = function () {
        var e_1, _a, e_2, _b, e_3, _c, e_4, _d, e_5, _e;
        var changedElevatorIds = new Set();
        try {
            for (var _f = __values(this.elevators.values()), _g = _f.next(); !_g.done; _g = _f.next()) {
                var elevator = _g.value;
                if (elevator.direction !== ElevatorDirection.Standing) {
                    // move the elevator
                    changedElevatorIds.add(elevator.id);
                    elevator.currentFloor += elevator.direction;
                    // drop passengers that wants to be on this floor
                    for (var i = elevator.passengers.length - 1; i >= 0; i--) {
                        var passenger = elevator.passengers[i];
                        if (passenger.destinationFloor === elevator.currentFloor) {
                            elevator.passengers.splice(i, 1);
                            this.emit('passenger-dropped', { passenger: passenger, elevator: elevator });
                        }
                    }
                    // if the elevator is at the limit floor this means it needs to change the direction
                    if (elevator.nextDirection !== ElevatorDirection.Standing
                        && elevator.currentFloor === elevator.destinationLimit) {
                        elevator.direction = elevator.nextDirection;
                        elevator.nextDirection = ElevatorDirection.Standing;
                        elevator.destinationLimit = Number.MAX_SAFE_INTEGER * elevator.direction;
                    }
                    else if (elevator.passengers.length === 0) {
                        if (elevator.nextDirection !== ElevatorDirection.Standing) {
                            // even thouh this elevator is empty it needs to go this way anyway
                        }
                        else {
                            // looks like this elevator is empty now, check if there is any passenger in this way that wants to go this way
                            var isSomeone = false;
                            var tmp = elevator.currentFloor * elevator.direction;
                            try {
                                for (var _h = (e_2 = void 0, __values(this.waitingPassengers)), _j = _h.next(); !_j.done; _j = _h.next()) {
                                    var passenger = _j.value;
                                    if (passenger.initialFloor * elevator.direction >= tmp
                                        && passenger.direction === elevator.direction
                                        && passenger.destinationFloor * elevator.direction <= elevator.destinationLimit * elevator.direction) {
                                        isSomeone = true;
                                        break;
                                    }
                                }
                            }
                            catch (e_2_1) { e_2 = { error: e_2_1 }; }
                            finally {
                                try {
                                    if (_j && !_j.done && (_b = _h["return"])) _b.call(_h);
                                }
                                finally { if (e_2) throw e_2.error; }
                            }
                            if (!isSomeone) {
                                //if not then switch direction to standing
                                elevator.direction = ElevatorDirection.Standing;
                            }
                        }
                    }
                    // take passengers that want to go this way and are on this floor and they are within the limit
                    for (var i = this.waitingPassengers.length - 1; i >= 0; i--) {
                        var passenger = this.waitingPassengers[i];
                        if (passenger.initialFloor === elevator.currentFloor
                            && passenger.direction === elevator.direction
                            && passenger.destinationFloor * elevator.direction < elevator.destinationLimit * elevator.direction) {
                            elevator.passengers.push(passenger);
                            this.waitingPassengers.splice(i, 1);
                            this.emit('passenger-taken', { passenger: passenger, elevator: elevator });
                        }
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_g && !_g.done && (_a = _f["return"])) _a.call(_f);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var _k = __values(this.elevators.values()), _l = _k.next(); !_l.done; _l = _k.next()) {
                var elevator = _l.value;
                if (elevator.direction == ElevatorDirection.Standing) {
                    var _loop_1 = function (passenger) {
                        var e_6, _p;
                        // check if there is any elevator going to that persion, or will take it in the near future
                        var isAny = false;
                        try {
                            for (var _q = (e_6 = void 0, __values(this_1.elevators.values())), _r = _q.next(); !_r.done; _r = _q.next()) {
                                var otherElevator = _r.value;
                                if ((otherElevator.direction !== ElevatorDirection.Standing
                                    && passenger.initialFloor * otherElevator.direction > otherElevator.currentFloor * otherElevator.direction
                                    && passenger.destinationFloor * elevator.direction <= otherElevator.destinationLimit * otherElevator.direction
                                    && passenger.direction === otherElevator.direction)
                                    || (otherElevator.direction !== ElevatorDirection.Standing
                                        && otherElevator.nextDirection !== ElevatorDirection.Standing
                                        && passenger.initialFloor * otherElevator.direction <= otherElevator.destinationLimit * otherElevator.direction
                                        && passenger.direction === otherElevator.nextDirection)) {
                                    isAny = true;
                                    break;
                                }
                            }
                        }
                        catch (e_6_1) { e_6 = { error: e_6_1 }; }
                        finally {
                            try {
                                if (_r && !_r.done && (_p = _q["return"])) _p.call(_q);
                            }
                            finally { if (e_6) throw e_6.error; }
                        }
                        if (!isAny) {
                            // if there are none, then make this elevator go for that person
                            elevator.direction = Math.sign(passenger.initialFloor - elevator.currentFloor);
                            elevator.nextDirection = Math.sign(passenger.destinationFloor - passenger.initialFloor);
                            if (elevator.nextDirection === elevator.direction) {
                                elevator.nextDirection = ElevatorDirection.Standing;
                                elevator.destinationLimit = Number.MAX_SAFE_INTEGER * elevator.direction;
                            }
                            else {
                                // it's good idea to find a person that is on lowest/heighest floor
                                var limit_1 = passenger.initialFloor;
                                this_1.waitingPassengers.forEach((elevator.direction === ElevatorDirection.GoingUp) ?
                                    function (p) { if (p.initialFloor > limit_1)
                                        limit_1 = p.initialFloor; } :
                                    function (p) { if (p.initialFloor < limit_1)
                                        limit_1 = p.initialFloor; });
                                elevator.destinationLimit = limit_1;
                            }
                            changedElevatorIds.add(elevator.id);
                            return "break";
                        }
                    };
                    var this_1 = this;
                    try {
                        // find a direction to go to
                        for (var _m = (e_4 = void 0, __values(this.waitingPassengers)), _o = _m.next(); !_o.done; _o = _m.next()) {
                            var passenger = _o.value;
                            var state_1 = _loop_1(passenger);
                            if (state_1 === "break")
                                break;
                        }
                    }
                    catch (e_4_1) { e_4 = { error: e_4_1 }; }
                    finally {
                        try {
                            if (_o && !_o.done && (_d = _m["return"])) _d.call(_m);
                        }
                        finally { if (e_4) throw e_4.error; }
                    }
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_l && !_l.done && (_c = _k["return"])) _c.call(_k);
            }
            finally { if (e_3) throw e_3.error; }
        }
        try {
            for (var changedElevatorIds_1 = __values(changedElevatorIds), changedElevatorIds_1_1 = changedElevatorIds_1.next(); !changedElevatorIds_1_1.done; changedElevatorIds_1_1 = changedElevatorIds_1.next()) {
                var id = changedElevatorIds_1_1.value;
                this.emit('elevator-updated', this.elevators.get(id));
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (changedElevatorIds_1_1 && !changedElevatorIds_1_1.done && (_e = changedElevatorIds_1["return"])) _e.call(changedElevatorIds_1);
            }
            finally { if (e_5) throw e_5.error; }
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
document.querySelector("main").style.display = null;
var system = new elevator_system_1["default"]();
// window.system = system
var elevatorsListDiv = document.getElementById("elevators-list");
var waitingPassengersListDiv = document.getElementById("waiting-passengers-list");
var formatDirection = function (dir) {
    switch (dir) {
        case elevator_system_1.ElevatorDirection.GoingUp:
            return "up";
        case elevator_system_1.ElevatorDirection.GoingDown:
            return "down";
        case elevator_system_1.ElevatorDirection.Standing:
            return "none";
    }
};
// DOM events:
document.getElementById("add-elevator-btn").addEventListener("click", function () {
    system.addNewElevator(+prompt("What floor is that elevator initially on?"));
});
document.getElementById("add-passenger-btn").addEventListener("click", function () {
    system.addNewPassenger({
        name: prompt("Give a passenger name", "") || "",
        initialFloor: +prompt("That floor is that passenger on?"),
        destinationFloor: +prompt("That floor is that passenger going to go?"),
    });
});
document
    .getElementById("next-step-btn")
    .addEventListener("click", function () { return system.commitNextStep(); });
// system events
system.addEventListener("elevator-added", function (elevator) {
    var elevatorDiv = document.createElement("div");
    elevatorDiv.id = "elevator-id-" + elevator.id;
    elevatorDiv.classList.add("elevator");
    //   {
    //     const el = document.createElement("div");
    //     el.classList.add("elevator-id-value");
    //     el.innerText = `${elevator.id}`;
    //     elevatorDiv.appendChild(el);
    //   }
    //   {
    //     const el = document.createElement("div");
    //     el.classList.add("elevator-id-title");
    //     el.innerText = `Elevator ID`;
    //     elevatorDiv.appendChild(el);
    //   }
    {
        var el = document.createElement("div");
        el.classList.add("current-floor-value");
        el.innerText = "" + elevator.currentFloor;
        elevatorDiv.appendChild(el);
    }
    {
        var el = document.createElement("div");
        el.innerText = "Current floor";
        elevatorDiv.appendChild(el);
    }
    {
        var el = document.createElement("div");
        el.classList.add("direction-value");
        el.innerText = "" + formatDirection(elevator.direction);
        elevatorDiv.appendChild(el);
    }
    {
        var el = document.createElement("div");
        el.innerText = "Direction";
        elevatorDiv.appendChild(el);
    }
    // {
    //     const el = document.createElement('div')
    //     el.classList.add('limit-floor-value')
    //     el.innerText = `${elevator.destinationLimit}`
    //     elevatorDiv.appendChild(el)
    // }
    // {
    //     const el = document.createElement('div')
    //     el.innerText = `Floor limit`
    //     elevatorDiv.appendChild(el)
    // }
    // {
    //     const el = document.createElement('div')
    //     el.classList.add('next-direction-value')
    //     el.innerText = `${formatDirection(elevator.nextDirection)}`
    //     elevatorDiv.appendChild(el)
    // }
    // {
    //     const el = document.createElement('div')
    //     el.innerText = `Next direction`
    //     elevatorDiv.appendChild(el)
    // }
    {
        var el = document.createElement("div");
        el.classList.add("passengers-inside-list");
        elevatorDiv.appendChild(el);
    }
    elevatorsListDiv.appendChild(elevatorDiv);
});
system.addEventListener("elevator-updated", function (elevator) {
    var elevatorDiv = document.getElementById("elevator-id-" + elevator.id);
    elevatorDiv.querySelector(".current-floor-value").innerText = "" + elevator.currentFloor;
    elevatorDiv.querySelector(".direction-value").innerText = "" + formatDirection(elevator.direction);
    // (elevatorDiv.querySelector('.limit-floor-value') as HTMLDivElement).innerText = `${elevator.destinationLimit}`;
    // (elevatorDiv.querySelector('.next-direction-value') as HTMLDivElement).innerText = `${formatDirection(elevator.nextDirection)}`;
});
system.addEventListener("waiting-passenger-added", function (passenger) {
    var elevatorDiv = document.createElement("div");
    elevatorDiv.id = "waiting-passenger-id-" + passenger.id;
    elevatorDiv.classList.add("waiting-passenger");
    {
        var el = document.createElement("div");
        el.innerText = "" + passenger.name;
        elevatorDiv.appendChild(el);
    }
    {
        var el = document.createElement("div");
        el.innerText = "Name";
        elevatorDiv.appendChild(el);
    }
    {
        var el = document.createElement("div");
        el.innerText = "" + passenger.initialFloor;
        elevatorDiv.appendChild(el);
    }
    {
        var el = document.createElement("div");
        el.innerText = "Waiting at";
        elevatorDiv.appendChild(el);
    }
    {
        var el = document.createElement("div");
        el.innerText = "" + passenger.destinationFloor;
        elevatorDiv.appendChild(el);
    }
    {
        var el = document.createElement("div");
        el.innerText = "Destination floor";
        elevatorDiv.appendChild(el);
    }
    waitingPassengersListDiv.appendChild(elevatorDiv);
});
system.addEventListener("passenger-taken", function (_a) {
    var passenger = _a.passenger, elevator = _a.elevator;
    document.getElementById("waiting-passenger-id-" + passenger.id).remove();
    var listOfInsiders = document.querySelector("#elevator-id-" + elevator.id + " .passengers-inside-list");
    var el = document.createElement("div");
    el.id = "passenger_" + passenger.id;
    el.classList.add("passenger-inside");
    el.innerText = "" + passenger.name;
    listOfInsiders.appendChild(el);
});
system.addEventListener("passenger-dropped", function (_a) {
    var passenger = _a.passenger, elevator = _a.elevator;
    document
        .querySelector("#elevator-id-" + elevator.id + " #passenger_" + passenger.id)
        .remove();
});
// system.addNewElevator();
// system.addNewElevator();
// system.addNewPassenger({
//   name: "Jakub",
//   initialFloor: 2,
//   destinationFloor: 4,
// });
// system.addNewPassenger({
//   name: "Paweł",
//   initialFloor: 6,
//   destinationFloor: 3,
// });
// system.addNewPassenger({
//   name: "Piotr",
//   initialFloor: 7,
//   destinationFloor: 3,
// });

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWItZWxldmF0b3JzLy4vc3JjL2VsZXZhdG9yLXN5c3RlbS50cyIsIndlYnBhY2s6Ly93ZWItZWxldmF0b3JzLy4vc3JjL2V2ZW50LXByb2R1Y2VyLnRzIiwid2VicGFjazovL3dlYi1lbGV2YXRvcnMvLi9zcmMvdXRpbC50cyIsIndlYnBhY2s6Ly93ZWItZWxldmF0b3JzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dlYi1lbGV2YXRvcnMvLi9zcmMvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxjQUFjLGdCQUFnQixzQ0FBc0MsaUJBQWlCLEVBQUU7QUFDdkYsNkJBQTZCLDhFQUE4RTtBQUMzRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsc0JBQXNCO0FBQzdDO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCLGdCQUFnQixHQUFHLHlCQUF5QjtBQUM1Qyx1QkFBdUIsbUJBQU8sQ0FBQyxpREFBa0I7QUFDakQsYUFBYSxtQkFBTyxDQUFDLDZCQUFRO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLG9EQUFvRCx5QkFBeUIsS0FBSztBQUNuRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0RUFBNEUsVUFBVTtBQUN0RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnRUFBZ0UsUUFBUTtBQUN4RTtBQUNBO0FBQ0E7QUFDQSw0REFBNEQsMkNBQTJDO0FBQ3ZHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtHQUErRyxVQUFVO0FBQ3pIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQyxRQUFRLGdCQUFnQjtBQUNuRTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QywwQkFBMEI7QUFDbkU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1FQUFtRSxRQUFRO0FBQzNFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBEQUEwRCwyQ0FBMkM7QUFDckc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixRQUFRLGdCQUFnQjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQiwwQkFBMEI7QUFDL0M7QUFDQTtBQUNBLDRFQUE0RSxVQUFVO0FBQ3RGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEdBQThHLFVBQVU7QUFDeEg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QyxRQUFRLGdCQUFnQjtBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQywwQkFBMEI7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBa0Q7QUFDbEQsaUVBQWlFLEVBQUU7QUFDbkUsa0RBQWtEO0FBQ2xELGlFQUFpRSxFQUFFO0FBQ25FO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVHQUF1RyxVQUFVO0FBQ2pIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxRQUFRLGdCQUFnQjtBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQywwQkFBMEI7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsUUFBUSxnQkFBZ0I7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsMEJBQTBCO0FBQy9DO0FBQ0E7QUFDQSwrSEFBK0gsOEJBQThCO0FBQzdKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLFFBQVEsZ0JBQWdCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLDBCQUEwQjtBQUMvQztBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsZUFBa0I7Ozs7Ozs7Ozs7O0FDN1BMO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwSEFBMEgsVUFBVTtBQUNwSTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixRQUFRLGdCQUFnQjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQiwwQkFBMEI7QUFDL0M7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELGVBQWtCOzs7Ozs7Ozs7OztBQzFDTDtBQUNiLGtCQUFrQjtBQUNsQix3QkFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0I7Ozs7Ozs7VUNQeEI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7Ozs7OztBQ3RCYTtBQUNiLGtCQUFrQjtBQUNsQix3QkFBd0IsbUJBQU8sQ0FBQyxtREFBbUI7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDO0FBQ0Q7QUFDQTtBQUNBLDRDQUE0QyxnQ0FBZ0MsRUFBRTtBQUM5RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLFlBQVk7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLDBCQUEwQjtBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2Qix3Q0FBd0M7QUFDckU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwRkFBMEYsMEJBQTBCO0FBQ3BILDZGQUE2Rix3Q0FBd0M7QUFDckksQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcbiAgICAgICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2xhc3MgZXh0ZW5kcyB2YWx1ZSBcIiArIFN0cmluZyhiKSArIFwiIGlzIG5vdCBhIGNvbnN0cnVjdG9yIG9yIG51bGxcIik7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG4gICAgfTtcbn0pKCk7XG52YXIgX192YWx1ZXMgPSAodGhpcyAmJiB0aGlzLl9fdmFsdWVzKSB8fCBmdW5jdGlvbihvKSB7XG4gICAgdmFyIHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yLCBtID0gcyAmJiBvW3NdLCBpID0gMDtcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcbiAgICBpZiAobyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHJldHVybiB7XG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IocyA/IFwiT2JqZWN0IGlzIG5vdCBpdGVyYWJsZS5cIiA6IFwiU3ltYm9sLml0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcbn07XG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5FbGV2YXRvciA9IGV4cG9ydHMuRWxldmF0b3JEaXJlY3Rpb24gPSB2b2lkIDA7XG52YXIgZXZlbnRfcHJvZHVjZXJfMSA9IHJlcXVpcmUoXCIuL2V2ZW50LXByb2R1Y2VyXCIpO1xudmFyIHV0aWxfMSA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XG52YXIgRWxldmF0b3JEaXJlY3Rpb247XG4oZnVuY3Rpb24gKEVsZXZhdG9yRGlyZWN0aW9uKSB7XG4gICAgRWxldmF0b3JEaXJlY3Rpb25bRWxldmF0b3JEaXJlY3Rpb25bXCJTdGFuZGluZ1wiXSA9IDBdID0gXCJTdGFuZGluZ1wiO1xuICAgIEVsZXZhdG9yRGlyZWN0aW9uW0VsZXZhdG9yRGlyZWN0aW9uW1wiR29pbmdVcFwiXSA9IDFdID0gXCJHb2luZ1VwXCI7XG4gICAgRWxldmF0b3JEaXJlY3Rpb25bRWxldmF0b3JEaXJlY3Rpb25bXCJHb2luZ0Rvd25cIl0gPSAtMV0gPSBcIkdvaW5nRG93blwiO1xufSkoRWxldmF0b3JEaXJlY3Rpb24gPSBleHBvcnRzLkVsZXZhdG9yRGlyZWN0aW9uIHx8IChleHBvcnRzLkVsZXZhdG9yRGlyZWN0aW9uID0ge30pKTtcbnZhciBFbGV2YXRvciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBFbGV2YXRvcihpZCkge1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMuY3VycmVudEZsb29yID0gMDtcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSBFbGV2YXRvckRpcmVjdGlvbi5TdGFuZGluZztcbiAgICAgICAgdGhpcy5uZXh0RGlyZWN0aW9uID0gRWxldmF0b3JEaXJlY3Rpb24uU3RhbmRpbmc7XG4gICAgICAgIHRoaXMuZGVzdGluYXRpb25MaW1pdCA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xuICAgICAgICB0aGlzLnBhc3NlbmdlcnMgPSBbXTtcbiAgICB9XG4gICAgcmV0dXJuIEVsZXZhdG9yO1xufSgpKTtcbmV4cG9ydHMuRWxldmF0b3IgPSBFbGV2YXRvcjtcbnZhciBFbGV2YXRvclN5c3RlbSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoRWxldmF0b3JTeXN0ZW0sIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gRWxldmF0b3JTeXN0ZW0oKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xuICAgICAgICAvLyBpZCB0byBFbGV2YXRvclxuICAgICAgICBfdGhpcy5lbGV2YXRvcnMgPSBuZXcgTWFwKCk7XG4gICAgICAgIF90aGlzLndhaXRpbmdQYXNzZW5nZXJzID0gW107XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgRWxldmF0b3JTeXN0ZW0ucHJvdG90eXBlLmFkZE5ld0VsZXZhdG9yID0gZnVuY3Rpb24gKGluaXRpYWxGbG9vcikge1xuICAgICAgICB2YXIgaWQgPSB1dGlsXzEuZ2VuZXJhdGVVbmlxdWVJZCgpO1xuICAgICAgICB2YXIgb2JqID0gbmV3IEVsZXZhdG9yKGlkKTtcbiAgICAgICAgb2JqLmN1cnJlbnRGbG9vciA9ICtpbml0aWFsRmxvb3IgfHwgMDtcbiAgICAgICAgdGhpcy5lbGV2YXRvcnMuc2V0KGlkLCBvYmopO1xuICAgICAgICB0aGlzLmVtaXQoJ2VsZXZhdG9yLWFkZGVkJywgb2JqKTtcbiAgICB9O1xuICAgIEVsZXZhdG9yU3lzdGVtLnByb3RvdHlwZS5hZGROZXdQYXNzZW5nZXIgPSBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgdmFyIG5hbWUgPSBfYS5uYW1lLCBpbml0aWFsRmxvb3IgPSBfYS5pbml0aWFsRmxvb3IsIGRlc3RpbmF0aW9uRmxvb3IgPSBfYS5kZXN0aW5hdGlvbkZsb29yO1xuICAgICAgICBpZiAoaXNOYU4oaW5pdGlhbEZsb29yKSB8fCBpc05hTihkZXN0aW5hdGlvbkZsb29yKSlcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBwYXNzZW5nZXJzIHBhcmFtZXRlcnMnKTtcbiAgICAgICAgaWYgKGluaXRpYWxGbG9vciA9PT0gZGVzdGluYXRpb25GbG9vcilcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUGFzc2VuZ2VyIGlzIGFscmVhZHkgb24gdGhlIGRlc3RpbmF0aW9uIGZsb29yJyk7XG4gICAgICAgIHZhciBwYXNzZW5nZXIgPSB7XG4gICAgICAgICAgICBpZDogdXRpbF8xLmdlbmVyYXRlVW5pcXVlSWQoKSxcbiAgICAgICAgICAgIGRpcmVjdGlvbjogZGVzdGluYXRpb25GbG9vciA8IGluaXRpYWxGbG9vciA/IEVsZXZhdG9yRGlyZWN0aW9uLkdvaW5nRG93biA6IEVsZXZhdG9yRGlyZWN0aW9uLkdvaW5nVXAsXG4gICAgICAgICAgICBuYW1lOiBuYW1lLCBpbml0aWFsRmxvb3I6IGluaXRpYWxGbG9vciwgZGVzdGluYXRpb25GbG9vcjogZGVzdGluYXRpb25GbG9vclxuICAgICAgICB9O1xuICAgICAgICB0aGlzLndhaXRpbmdQYXNzZW5nZXJzLnVuc2hpZnQocGFzc2VuZ2VyKTtcbiAgICAgICAgdGhpcy5lbWl0KCd3YWl0aW5nLXBhc3Nlbmdlci1hZGRlZCcsIHBhc3Nlbmdlcik7XG4gICAgfTtcbiAgICBFbGV2YXRvclN5c3RlbS5wcm90b3R5cGUuY29tbWl0TmV4dFN0ZXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBlXzEsIF9hLCBlXzIsIF9iLCBlXzMsIF9jLCBlXzQsIF9kLCBlXzUsIF9lO1xuICAgICAgICB2YXIgY2hhbmdlZEVsZXZhdG9ySWRzID0gbmV3IFNldCgpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm9yICh2YXIgX2YgPSBfX3ZhbHVlcyh0aGlzLmVsZXZhdG9ycy52YWx1ZXMoKSksIF9nID0gX2YubmV4dCgpOyAhX2cuZG9uZTsgX2cgPSBfZi5uZXh0KCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgZWxldmF0b3IgPSBfZy52YWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAoZWxldmF0b3IuZGlyZWN0aW9uICE9PSBFbGV2YXRvckRpcmVjdGlvbi5TdGFuZGluZykge1xuICAgICAgICAgICAgICAgICAgICAvLyBtb3ZlIHRoZSBlbGV2YXRvclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkRWxldmF0b3JJZHMuYWRkKGVsZXZhdG9yLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgZWxldmF0b3IuY3VycmVudEZsb29yICs9IGVsZXZhdG9yLmRpcmVjdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgLy8gZHJvcCBwYXNzZW5nZXJzIHRoYXQgd2FudHMgdG8gYmUgb24gdGhpcyBmbG9vclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gZWxldmF0b3IucGFzc2VuZ2Vycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBhc3NlbmdlciA9IGVsZXZhdG9yLnBhc3NlbmdlcnNbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFzc2VuZ2VyLmRlc3RpbmF0aW9uRmxvb3IgPT09IGVsZXZhdG9yLmN1cnJlbnRGbG9vcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZXZhdG9yLnBhc3NlbmdlcnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgncGFzc2VuZ2VyLWRyb3BwZWQnLCB7IHBhc3NlbmdlcjogcGFzc2VuZ2VyLCBlbGV2YXRvcjogZWxldmF0b3IgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIGVsZXZhdG9yIGlzIGF0IHRoZSBsaW1pdCBmbG9vciB0aGlzIG1lYW5zIGl0IG5lZWRzIHRvIGNoYW5nZSB0aGUgZGlyZWN0aW9uXG4gICAgICAgICAgICAgICAgICAgIGlmIChlbGV2YXRvci5uZXh0RGlyZWN0aW9uICE9PSBFbGV2YXRvckRpcmVjdGlvbi5TdGFuZGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgJiYgZWxldmF0b3IuY3VycmVudEZsb29yID09PSBlbGV2YXRvci5kZXN0aW5hdGlvbkxpbWl0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGV2YXRvci5kaXJlY3Rpb24gPSBlbGV2YXRvci5uZXh0RGlyZWN0aW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxldmF0b3IubmV4dERpcmVjdGlvbiA9IEVsZXZhdG9yRGlyZWN0aW9uLlN0YW5kaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxldmF0b3IuZGVzdGluYXRpb25MaW1pdCA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSICogZWxldmF0b3IuZGlyZWN0aW9uO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGVsZXZhdG9yLnBhc3NlbmdlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWxldmF0b3IubmV4dERpcmVjdGlvbiAhPT0gRWxldmF0b3JEaXJlY3Rpb24uU3RhbmRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBldmVuIHRob3VoIHRoaXMgZWxldmF0b3IgaXMgZW1wdHkgaXQgbmVlZHMgdG8gZ28gdGhpcyB3YXkgYW55d2F5XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBsb29rcyBsaWtlIHRoaXMgZWxldmF0b3IgaXMgZW1wdHkgbm93LCBjaGVjayBpZiB0aGVyZSBpcyBhbnkgcGFzc2VuZ2VyIGluIHRoaXMgd2F5IHRoYXQgd2FudHMgdG8gZ28gdGhpcyB3YXlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXNTb21lb25lID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRtcCA9IGVsZXZhdG9yLmN1cnJlbnRGbG9vciAqIGVsZXZhdG9yLmRpcmVjdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBfaCA9IChlXzIgPSB2b2lkIDAsIF9fdmFsdWVzKHRoaXMud2FpdGluZ1Bhc3NlbmdlcnMpKSwgX2ogPSBfaC5uZXh0KCk7ICFfai5kb25lOyBfaiA9IF9oLm5leHQoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBhc3NlbmdlciA9IF9qLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhc3Nlbmdlci5pbml0aWFsRmxvb3IgKiBlbGV2YXRvci5kaXJlY3Rpb24gPj0gdG1wXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgcGFzc2VuZ2VyLmRpcmVjdGlvbiA9PT0gZWxldmF0b3IuZGlyZWN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgcGFzc2VuZ2VyLmRlc3RpbmF0aW9uRmxvb3IgKiBlbGV2YXRvci5kaXJlY3Rpb24gPD0gZWxldmF0b3IuZGVzdGluYXRpb25MaW1pdCAqIGVsZXZhdG9yLmRpcmVjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzU29tZW9uZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGVfMl8xKSB7IGVfMiA9IHsgZXJyb3I6IGVfMl8xIH07IH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfaiAmJiAhX2ouZG9uZSAmJiAoX2IgPSBfaFtcInJldHVyblwiXSkpIF9iLmNhbGwoX2gpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsbHkgeyBpZiAoZV8yKSB0aHJvdyBlXzIuZXJyb3I7IH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc1NvbWVvbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9pZiBub3QgdGhlbiBzd2l0Y2ggZGlyZWN0aW9uIHRvIHN0YW5kaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZXZhdG9yLmRpcmVjdGlvbiA9IEVsZXZhdG9yRGlyZWN0aW9uLlN0YW5kaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyB0YWtlIHBhc3NlbmdlcnMgdGhhdCB3YW50IHRvIGdvIHRoaXMgd2F5IGFuZCBhcmUgb24gdGhpcyBmbG9vciBhbmQgdGhleSBhcmUgd2l0aGluIHRoZSBsaW1pdFxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gdGhpcy53YWl0aW5nUGFzc2VuZ2Vycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBhc3NlbmdlciA9IHRoaXMud2FpdGluZ1Bhc3NlbmdlcnNbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFzc2VuZ2VyLmluaXRpYWxGbG9vciA9PT0gZWxldmF0b3IuY3VycmVudEZsb29yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgcGFzc2VuZ2VyLmRpcmVjdGlvbiA9PT0gZWxldmF0b3IuZGlyZWN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgcGFzc2VuZ2VyLmRlc3RpbmF0aW9uRmxvb3IgKiBlbGV2YXRvci5kaXJlY3Rpb24gPCBlbGV2YXRvci5kZXN0aW5hdGlvbkxpbWl0ICogZWxldmF0b3IuZGlyZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxldmF0b3IucGFzc2VuZ2Vycy5wdXNoKHBhc3Nlbmdlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53YWl0aW5nUGFzc2VuZ2Vycy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdwYXNzZW5nZXItdGFrZW4nLCB7IHBhc3NlbmdlcjogcGFzc2VuZ2VyLCBlbGV2YXRvcjogZWxldmF0b3IgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVfMV8xKSB7IGVfMSA9IHsgZXJyb3I6IGVfMV8xIH07IH1cbiAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlmIChfZyAmJiAhX2cuZG9uZSAmJiAoX2EgPSBfZltcInJldHVyblwiXSkpIF9hLmNhbGwoX2YpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmluYWxseSB7IGlmIChlXzEpIHRocm93IGVfMS5lcnJvcjsgfVxuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmb3IgKHZhciBfayA9IF9fdmFsdWVzKHRoaXMuZWxldmF0b3JzLnZhbHVlcygpKSwgX2wgPSBfay5uZXh0KCk7ICFfbC5kb25lOyBfbCA9IF9rLm5leHQoKSkge1xuICAgICAgICAgICAgICAgIHZhciBlbGV2YXRvciA9IF9sLnZhbHVlO1xuICAgICAgICAgICAgICAgIGlmIChlbGV2YXRvci5kaXJlY3Rpb24gPT0gRWxldmF0b3JEaXJlY3Rpb24uU3RhbmRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIF9sb29wXzEgPSBmdW5jdGlvbiAocGFzc2VuZ2VyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZV82LCBfcDtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNoZWNrIGlmIHRoZXJlIGlzIGFueSBlbGV2YXRvciBnb2luZyB0byB0aGF0IHBlcnNpb24sIG9yIHdpbGwgdGFrZSBpdCBpbiB0aGUgbmVhciBmdXR1cmVcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpc0FueSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBfcSA9IChlXzYgPSB2b2lkIDAsIF9fdmFsdWVzKHRoaXNfMS5lbGV2YXRvcnMudmFsdWVzKCkpKSwgX3IgPSBfcS5uZXh0KCk7ICFfci5kb25lOyBfciA9IF9xLm5leHQoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgb3RoZXJFbGV2YXRvciA9IF9yLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKG90aGVyRWxldmF0b3IuZGlyZWN0aW9uICE9PSBFbGV2YXRvckRpcmVjdGlvbi5TdGFuZGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgcGFzc2VuZ2VyLmluaXRpYWxGbG9vciAqIG90aGVyRWxldmF0b3IuZGlyZWN0aW9uID4gb3RoZXJFbGV2YXRvci5jdXJyZW50Rmxvb3IgKiBvdGhlckVsZXZhdG9yLmRpcmVjdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgcGFzc2VuZ2VyLmRlc3RpbmF0aW9uRmxvb3IgKiBlbGV2YXRvci5kaXJlY3Rpb24gPD0gb3RoZXJFbGV2YXRvci5kZXN0aW5hdGlvbkxpbWl0ICogb3RoZXJFbGV2YXRvci5kaXJlY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHBhc3Nlbmdlci5kaXJlY3Rpb24gPT09IG90aGVyRWxldmF0b3IuZGlyZWN0aW9uKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgKG90aGVyRWxldmF0b3IuZGlyZWN0aW9uICE9PSBFbGV2YXRvckRpcmVjdGlvbi5TdGFuZGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIG90aGVyRWxldmF0b3IubmV4dERpcmVjdGlvbiAhPT0gRWxldmF0b3JEaXJlY3Rpb24uU3RhbmRpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiBwYXNzZW5nZXIuaW5pdGlhbEZsb29yICogb3RoZXJFbGV2YXRvci5kaXJlY3Rpb24gPD0gb3RoZXJFbGV2YXRvci5kZXN0aW5hdGlvbkxpbWl0ICogb3RoZXJFbGV2YXRvci5kaXJlY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiBwYXNzZW5nZXIuZGlyZWN0aW9uID09PSBvdGhlckVsZXZhdG9yLm5leHREaXJlY3Rpb24pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0FueSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGNoIChlXzZfMSkgeyBlXzYgPSB7IGVycm9yOiBlXzZfMSB9OyB9XG4gICAgICAgICAgICAgICAgICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoX3IgJiYgIV9yLmRvbmUgJiYgKF9wID0gX3FbXCJyZXR1cm5cIl0pKSBfcC5jYWxsKF9xKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmluYWxseSB7IGlmIChlXzYpIHRocm93IGVfNi5lcnJvcjsgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0FueSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZXJlIGFyZSBub25lLCB0aGVuIG1ha2UgdGhpcyBlbGV2YXRvciBnbyBmb3IgdGhhdCBwZXJzb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGV2YXRvci5kaXJlY3Rpb24gPSBNYXRoLnNpZ24ocGFzc2VuZ2VyLmluaXRpYWxGbG9vciAtIGVsZXZhdG9yLmN1cnJlbnRGbG9vcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxldmF0b3IubmV4dERpcmVjdGlvbiA9IE1hdGguc2lnbihwYXNzZW5nZXIuZGVzdGluYXRpb25GbG9vciAtIHBhc3Nlbmdlci5pbml0aWFsRmxvb3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbGV2YXRvci5uZXh0RGlyZWN0aW9uID09PSBlbGV2YXRvci5kaXJlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxldmF0b3IubmV4dERpcmVjdGlvbiA9IEVsZXZhdG9yRGlyZWN0aW9uLlN0YW5kaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGV2YXRvci5kZXN0aW5hdGlvbkxpbWl0ID0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIgKiBlbGV2YXRvci5kaXJlY3Rpb247XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpdCdzIGdvb2QgaWRlYSB0byBmaW5kIGEgcGVyc29uIHRoYXQgaXMgb24gbG93ZXN0L2hlaWdoZXN0IGZsb29yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsaW1pdF8xID0gcGFzc2VuZ2VyLmluaXRpYWxGbG9vcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc18xLndhaXRpbmdQYXNzZW5nZXJzLmZvckVhY2goKGVsZXZhdG9yLmRpcmVjdGlvbiA9PT0gRWxldmF0b3JEaXJlY3Rpb24uR29pbmdVcCkgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHApIHsgaWYgKHAuaW5pdGlhbEZsb29yID4gbGltaXRfMSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW1pdF8xID0gcC5pbml0aWFsRmxvb3I7IH0gOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHApIHsgaWYgKHAuaW5pdGlhbEZsb29yIDwgbGltaXRfMSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW1pdF8xID0gcC5pbml0aWFsRmxvb3I7IH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGV2YXRvci5kZXN0aW5hdGlvbkxpbWl0ID0gbGltaXRfMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlZEVsZXZhdG9ySWRzLmFkZChlbGV2YXRvci5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiYnJlYWtcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRoaXNfMSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBmaW5kIGEgZGlyZWN0aW9uIHRvIGdvIHRvXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBfbSA9IChlXzQgPSB2b2lkIDAsIF9fdmFsdWVzKHRoaXMud2FpdGluZ1Bhc3NlbmdlcnMpKSwgX28gPSBfbS5uZXh0KCk7ICFfby5kb25lOyBfbyA9IF9tLm5leHQoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwYXNzZW5nZXIgPSBfby52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RhdGVfMSA9IF9sb29wXzEocGFzc2VuZ2VyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdGVfMSA9PT0gXCJicmVha1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZV80XzEpIHsgZV80ID0geyBlcnJvcjogZV80XzEgfTsgfVxuICAgICAgICAgICAgICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF9vICYmICFfby5kb25lICYmIChfZCA9IF9tW1wicmV0dXJuXCJdKSkgX2QuY2FsbChfbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBmaW5hbGx5IHsgaWYgKGVfNCkgdGhyb3cgZV80LmVycm9yOyB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVfM18xKSB7IGVfMyA9IHsgZXJyb3I6IGVfM18xIH07IH1cbiAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlmIChfbCAmJiAhX2wuZG9uZSAmJiAoX2MgPSBfa1tcInJldHVyblwiXSkpIF9jLmNhbGwoX2spO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmluYWxseSB7IGlmIChlXzMpIHRocm93IGVfMy5lcnJvcjsgfVxuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmb3IgKHZhciBjaGFuZ2VkRWxldmF0b3JJZHNfMSA9IF9fdmFsdWVzKGNoYW5nZWRFbGV2YXRvcklkcyksIGNoYW5nZWRFbGV2YXRvcklkc18xXzEgPSBjaGFuZ2VkRWxldmF0b3JJZHNfMS5uZXh0KCk7ICFjaGFuZ2VkRWxldmF0b3JJZHNfMV8xLmRvbmU7IGNoYW5nZWRFbGV2YXRvcklkc18xXzEgPSBjaGFuZ2VkRWxldmF0b3JJZHNfMS5uZXh0KCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBjaGFuZ2VkRWxldmF0b3JJZHNfMV8xLnZhbHVlO1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnZWxldmF0b3ItdXBkYXRlZCcsIHRoaXMuZWxldmF0b3JzLmdldChpZCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlXzVfMSkgeyBlXzUgPSB7IGVycm9yOiBlXzVfMSB9OyB9XG4gICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBpZiAoY2hhbmdlZEVsZXZhdG9ySWRzXzFfMSAmJiAhY2hhbmdlZEVsZXZhdG9ySWRzXzFfMS5kb25lICYmIChfZSA9IGNoYW5nZWRFbGV2YXRvcklkc18xW1wicmV0dXJuXCJdKSkgX2UuY2FsbChjaGFuZ2VkRWxldmF0b3JJZHNfMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaW5hbGx5IHsgaWYgKGVfNSkgdGhyb3cgZV81LmVycm9yOyB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBFbGV2YXRvclN5c3RlbTtcbn0oZXZlbnRfcHJvZHVjZXJfMVtcImRlZmF1bHRcIl0pKTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gRWxldmF0b3JTeXN0ZW07XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX3ZhbHVlcyA9ICh0aGlzICYmIHRoaXMuX192YWx1ZXMpIHx8IGZ1bmN0aW9uKG8pIHtcbiAgICB2YXIgcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuaXRlcmF0b3IsIG0gPSBzICYmIG9bc10sIGkgPSAwO1xuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xuICAgIGlmIChvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHtcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihzID8gXCJPYmplY3QgaXMgbm90IGl0ZXJhYmxlLlwiIDogXCJTeW1ib2wuaXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xufTtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG52YXIgRXZlbnRQcm9kdWNlciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBFdmVudFByb2R1Y2VyKCkge1xuICAgICAgICB0aGlzLmxpc3RlbmVycyA9IG5ldyBNYXAoKTtcbiAgICB9XG4gICAgRXZlbnRQcm9kdWNlci5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uICh0eXBlLCBsaXN0ZW5lcikge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHZhciBsaXN0ID0gKF9hID0gdGhpcy5saXN0ZW5lcnMuZ2V0KHR5cGUpKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBbXTtcbiAgICAgICAgbGlzdC5wdXNoKGxpc3RlbmVyKTtcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMuc2V0KHR5cGUsIGxpc3QpO1xuICAgIH07XG4gICAgRXZlbnRQcm9kdWNlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uICh0eXBlLCBldmVudCkge1xuICAgICAgICB2YXIgZV8xLCBfYTtcbiAgICAgICAgdmFyIF9iO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm9yICh2YXIgX2MgPSBfX3ZhbHVlcygoKF9iID0gdGhpcy5saXN0ZW5lcnMuZ2V0KHR5cGUpKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBbXSkpLCBfZCA9IF9jLm5leHQoKTsgIV9kLmRvbmU7IF9kID0gX2MubmV4dCgpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGwgPSBfZC52YWx1ZTtcbiAgICAgICAgICAgICAgICBsKGV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZV8xXzEpIHsgZV8xID0geyBlcnJvcjogZV8xXzEgfTsgfVxuICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKF9kICYmICFfZC5kb25lICYmIChfYSA9IF9jW1wicmV0dXJuXCJdKSkgX2EuY2FsbChfYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaW5hbGx5IHsgaWYgKGVfMSkgdGhyb3cgZV8xLmVycm9yOyB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBFdmVudFByb2R1Y2VyO1xufSgpKTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gRXZlbnRQcm9kdWNlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuZ2VuZXJhdGVVbmlxdWVJZCA9IHZvaWQgMDtcbnZhciBuZXh0SWQgPSAxO1xudmFyIGdlbmVyYXRlVW5pcXVlSWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG5leHRJZCsrO1xufTtcbmV4cG9ydHMuZ2VuZXJhdGVVbmlxdWVJZCA9IGdlbmVyYXRlVW5pcXVlSWQ7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xudmFyIGVsZXZhdG9yX3N5c3RlbV8xID0gcmVxdWlyZShcIi4vZWxldmF0b3Itc3lzdGVtXCIpO1xuLy8gc2hvdyBtYWluIGJveCB3aGVuIEpTIGlzIGVuYWJsZWRcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJtYWluXCIpLnN0eWxlLmRpc3BsYXkgPSBudWxsO1xudmFyIHN5c3RlbSA9IG5ldyBlbGV2YXRvcl9zeXN0ZW1fMVtcImRlZmF1bHRcIl0oKTtcbi8vIHdpbmRvdy5zeXN0ZW0gPSBzeXN0ZW1cbnZhciBlbGV2YXRvcnNMaXN0RGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlbGV2YXRvcnMtbGlzdFwiKTtcbnZhciB3YWl0aW5nUGFzc2VuZ2Vyc0xpc3REaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndhaXRpbmctcGFzc2VuZ2Vycy1saXN0XCIpO1xudmFyIGZvcm1hdERpcmVjdGlvbiA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICBzd2l0Y2ggKGRpcikge1xuICAgICAgICBjYXNlIGVsZXZhdG9yX3N5c3RlbV8xLkVsZXZhdG9yRGlyZWN0aW9uLkdvaW5nVXA6XG4gICAgICAgICAgICByZXR1cm4gXCJ1cFwiO1xuICAgICAgICBjYXNlIGVsZXZhdG9yX3N5c3RlbV8xLkVsZXZhdG9yRGlyZWN0aW9uLkdvaW5nRG93bjpcbiAgICAgICAgICAgIHJldHVybiBcImRvd25cIjtcbiAgICAgICAgY2FzZSBlbGV2YXRvcl9zeXN0ZW1fMS5FbGV2YXRvckRpcmVjdGlvbi5TdGFuZGluZzpcbiAgICAgICAgICAgIHJldHVybiBcIm5vbmVcIjtcbiAgICB9XG59O1xuLy8gRE9NIGV2ZW50czpcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWRkLWVsZXZhdG9yLWJ0blwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgIHN5c3RlbS5hZGROZXdFbGV2YXRvcigrcHJvbXB0KFwiV2hhdCBmbG9vciBpcyB0aGF0IGVsZXZhdG9yIGluaXRpYWxseSBvbj9cIikpO1xufSk7XG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFkZC1wYXNzZW5nZXItYnRuXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgc3lzdGVtLmFkZE5ld1Bhc3Nlbmdlcih7XG4gICAgICAgIG5hbWU6IHByb21wdChcIkdpdmUgYSBwYXNzZW5nZXIgbmFtZVwiLCBcIlwiKSB8fCBcIlwiLFxuICAgICAgICBpbml0aWFsRmxvb3I6ICtwcm9tcHQoXCJUaGF0IGZsb29yIGlzIHRoYXQgcGFzc2VuZ2VyIG9uP1wiKSxcbiAgICAgICAgZGVzdGluYXRpb25GbG9vcjogK3Byb21wdChcIlRoYXQgZmxvb3IgaXMgdGhhdCBwYXNzZW5nZXIgZ29pbmcgdG8gZ28/XCIpLFxuICAgIH0pO1xufSk7XG5kb2N1bWVudFxuICAgIC5nZXRFbGVtZW50QnlJZChcIm5leHQtc3RlcC1idG5cIilcbiAgICAuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHN5c3RlbS5jb21taXROZXh0U3RlcCgpOyB9KTtcbi8vIHN5c3RlbSBldmVudHNcbnN5c3RlbS5hZGRFdmVudExpc3RlbmVyKFwiZWxldmF0b3ItYWRkZWRcIiwgZnVuY3Rpb24gKGVsZXZhdG9yKSB7XG4gICAgdmFyIGVsZXZhdG9yRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBlbGV2YXRvckRpdi5pZCA9IFwiZWxldmF0b3ItaWQtXCIgKyBlbGV2YXRvci5pZDtcbiAgICBlbGV2YXRvckRpdi5jbGFzc0xpc3QuYWRkKFwiZWxldmF0b3JcIik7XG4gICAgLy8gICB7XG4gICAgLy8gICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAvLyAgICAgZWwuY2xhc3NMaXN0LmFkZChcImVsZXZhdG9yLWlkLXZhbHVlXCIpO1xuICAgIC8vICAgICBlbC5pbm5lclRleHQgPSBgJHtlbGV2YXRvci5pZH1gO1xuICAgIC8vICAgICBlbGV2YXRvckRpdi5hcHBlbmRDaGlsZChlbCk7XG4gICAgLy8gICB9XG4gICAgLy8gICB7XG4gICAgLy8gICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAvLyAgICAgZWwuY2xhc3NMaXN0LmFkZChcImVsZXZhdG9yLWlkLXRpdGxlXCIpO1xuICAgIC8vICAgICBlbC5pbm5lclRleHQgPSBgRWxldmF0b3IgSURgO1xuICAgIC8vICAgICBlbGV2YXRvckRpdi5hcHBlbmRDaGlsZChlbCk7XG4gICAgLy8gICB9XG4gICAge1xuICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKFwiY3VycmVudC1mbG9vci12YWx1ZVwiKTtcbiAgICAgICAgZWwuaW5uZXJUZXh0ID0gXCJcIiArIGVsZXZhdG9yLmN1cnJlbnRGbG9vcjtcbiAgICAgICAgZWxldmF0b3JEaXYuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIH1cbiAgICB7XG4gICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGVsLmlubmVyVGV4dCA9IFwiQ3VycmVudCBmbG9vclwiO1xuICAgICAgICBlbGV2YXRvckRpdi5hcHBlbmRDaGlsZChlbCk7XG4gICAgfVxuICAgIHtcbiAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgZWwuY2xhc3NMaXN0LmFkZChcImRpcmVjdGlvbi12YWx1ZVwiKTtcbiAgICAgICAgZWwuaW5uZXJUZXh0ID0gXCJcIiArIGZvcm1hdERpcmVjdGlvbihlbGV2YXRvci5kaXJlY3Rpb24pO1xuICAgICAgICBlbGV2YXRvckRpdi5hcHBlbmRDaGlsZChlbCk7XG4gICAgfVxuICAgIHtcbiAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgZWwuaW5uZXJUZXh0ID0gXCJEaXJlY3Rpb25cIjtcbiAgICAgICAgZWxldmF0b3JEaXYuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIH1cbiAgICAvLyB7XG4gICAgLy8gICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAvLyAgICAgZWwuY2xhc3NMaXN0LmFkZCgnbGltaXQtZmxvb3ItdmFsdWUnKVxuICAgIC8vICAgICBlbC5pbm5lclRleHQgPSBgJHtlbGV2YXRvci5kZXN0aW5hdGlvbkxpbWl0fWBcbiAgICAvLyAgICAgZWxldmF0b3JEaXYuYXBwZW5kQ2hpbGQoZWwpXG4gICAgLy8gfVxuICAgIC8vIHtcbiAgICAvLyAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIC8vICAgICBlbC5pbm5lclRleHQgPSBgRmxvb3IgbGltaXRgXG4gICAgLy8gICAgIGVsZXZhdG9yRGl2LmFwcGVuZENoaWxkKGVsKVxuICAgIC8vIH1cbiAgICAvLyB7XG4gICAgLy8gICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAvLyAgICAgZWwuY2xhc3NMaXN0LmFkZCgnbmV4dC1kaXJlY3Rpb24tdmFsdWUnKVxuICAgIC8vICAgICBlbC5pbm5lclRleHQgPSBgJHtmb3JtYXREaXJlY3Rpb24oZWxldmF0b3IubmV4dERpcmVjdGlvbil9YFxuICAgIC8vICAgICBlbGV2YXRvckRpdi5hcHBlbmRDaGlsZChlbClcbiAgICAvLyB9XG4gICAgLy8ge1xuICAgIC8vICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgLy8gICAgIGVsLmlubmVyVGV4dCA9IGBOZXh0IGRpcmVjdGlvbmBcbiAgICAvLyAgICAgZWxldmF0b3JEaXYuYXBwZW5kQ2hpbGQoZWwpXG4gICAgLy8gfVxuICAgIHtcbiAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgZWwuY2xhc3NMaXN0LmFkZChcInBhc3NlbmdlcnMtaW5zaWRlLWxpc3RcIik7XG4gICAgICAgIGVsZXZhdG9yRGl2LmFwcGVuZENoaWxkKGVsKTtcbiAgICB9XG4gICAgZWxldmF0b3JzTGlzdERpdi5hcHBlbmRDaGlsZChlbGV2YXRvckRpdik7XG59KTtcbnN5c3RlbS5hZGRFdmVudExpc3RlbmVyKFwiZWxldmF0b3ItdXBkYXRlZFwiLCBmdW5jdGlvbiAoZWxldmF0b3IpIHtcbiAgICB2YXIgZWxldmF0b3JEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVsZXZhdG9yLWlkLVwiICsgZWxldmF0b3IuaWQpO1xuICAgIGVsZXZhdG9yRGl2LnF1ZXJ5U2VsZWN0b3IoXCIuY3VycmVudC1mbG9vci12YWx1ZVwiKS5pbm5lclRleHQgPSBcIlwiICsgZWxldmF0b3IuY3VycmVudEZsb29yO1xuICAgIGVsZXZhdG9yRGl2LnF1ZXJ5U2VsZWN0b3IoXCIuZGlyZWN0aW9uLXZhbHVlXCIpLmlubmVyVGV4dCA9IFwiXCIgKyBmb3JtYXREaXJlY3Rpb24oZWxldmF0b3IuZGlyZWN0aW9uKTtcbiAgICAvLyAoZWxldmF0b3JEaXYucXVlcnlTZWxlY3RvcignLmxpbWl0LWZsb29yLXZhbHVlJykgYXMgSFRNTERpdkVsZW1lbnQpLmlubmVyVGV4dCA9IGAke2VsZXZhdG9yLmRlc3RpbmF0aW9uTGltaXR9YDtcbiAgICAvLyAoZWxldmF0b3JEaXYucXVlcnlTZWxlY3RvcignLm5leHQtZGlyZWN0aW9uLXZhbHVlJykgYXMgSFRNTERpdkVsZW1lbnQpLmlubmVyVGV4dCA9IGAke2Zvcm1hdERpcmVjdGlvbihlbGV2YXRvci5uZXh0RGlyZWN0aW9uKX1gO1xufSk7XG5zeXN0ZW0uYWRkRXZlbnRMaXN0ZW5lcihcIndhaXRpbmctcGFzc2VuZ2VyLWFkZGVkXCIsIGZ1bmN0aW9uIChwYXNzZW5nZXIpIHtcbiAgICB2YXIgZWxldmF0b3JEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGVsZXZhdG9yRGl2LmlkID0gXCJ3YWl0aW5nLXBhc3Nlbmdlci1pZC1cIiArIHBhc3Nlbmdlci5pZDtcbiAgICBlbGV2YXRvckRpdi5jbGFzc0xpc3QuYWRkKFwid2FpdGluZy1wYXNzZW5nZXJcIik7XG4gICAge1xuICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBlbC5pbm5lclRleHQgPSBcIlwiICsgcGFzc2VuZ2VyLm5hbWU7XG4gICAgICAgIGVsZXZhdG9yRGl2LmFwcGVuZENoaWxkKGVsKTtcbiAgICB9XG4gICAge1xuICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBlbC5pbm5lclRleHQgPSBcIk5hbWVcIjtcbiAgICAgICAgZWxldmF0b3JEaXYuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIH1cbiAgICB7XG4gICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGVsLmlubmVyVGV4dCA9IFwiXCIgKyBwYXNzZW5nZXIuaW5pdGlhbEZsb29yO1xuICAgICAgICBlbGV2YXRvckRpdi5hcHBlbmRDaGlsZChlbCk7XG4gICAgfVxuICAgIHtcbiAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgZWwuaW5uZXJUZXh0ID0gXCJXYWl0aW5nIGF0XCI7XG4gICAgICAgIGVsZXZhdG9yRGl2LmFwcGVuZENoaWxkKGVsKTtcbiAgICB9XG4gICAge1xuICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBlbC5pbm5lclRleHQgPSBcIlwiICsgcGFzc2VuZ2VyLmRlc3RpbmF0aW9uRmxvb3I7XG4gICAgICAgIGVsZXZhdG9yRGl2LmFwcGVuZENoaWxkKGVsKTtcbiAgICB9XG4gICAge1xuICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBlbC5pbm5lclRleHQgPSBcIkRlc3RpbmF0aW9uIGZsb29yXCI7XG4gICAgICAgIGVsZXZhdG9yRGl2LmFwcGVuZENoaWxkKGVsKTtcbiAgICB9XG4gICAgd2FpdGluZ1Bhc3NlbmdlcnNMaXN0RGl2LmFwcGVuZENoaWxkKGVsZXZhdG9yRGl2KTtcbn0pO1xuc3lzdGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJwYXNzZW5nZXItdGFrZW5cIiwgZnVuY3Rpb24gKF9hKSB7XG4gICAgdmFyIHBhc3NlbmdlciA9IF9hLnBhc3NlbmdlciwgZWxldmF0b3IgPSBfYS5lbGV2YXRvcjtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndhaXRpbmctcGFzc2VuZ2VyLWlkLVwiICsgcGFzc2VuZ2VyLmlkKS5yZW1vdmUoKTtcbiAgICB2YXIgbGlzdE9mSW5zaWRlcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2VsZXZhdG9yLWlkLVwiICsgZWxldmF0b3IuaWQgKyBcIiAucGFzc2VuZ2Vycy1pbnNpZGUtbGlzdFwiKTtcbiAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGVsLmlkID0gXCJwYXNzZW5nZXJfXCIgKyBwYXNzZW5nZXIuaWQ7XG4gICAgZWwuY2xhc3NMaXN0LmFkZChcInBhc3Nlbmdlci1pbnNpZGVcIik7XG4gICAgZWwuaW5uZXJUZXh0ID0gXCJcIiArIHBhc3Nlbmdlci5uYW1lO1xuICAgIGxpc3RPZkluc2lkZXJzLmFwcGVuZENoaWxkKGVsKTtcbn0pO1xuc3lzdGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJwYXNzZW5nZXItZHJvcHBlZFwiLCBmdW5jdGlvbiAoX2EpIHtcbiAgICB2YXIgcGFzc2VuZ2VyID0gX2EucGFzc2VuZ2VyLCBlbGV2YXRvciA9IF9hLmVsZXZhdG9yO1xuICAgIGRvY3VtZW50XG4gICAgICAgIC5xdWVyeVNlbGVjdG9yKFwiI2VsZXZhdG9yLWlkLVwiICsgZWxldmF0b3IuaWQgKyBcIiAjcGFzc2VuZ2VyX1wiICsgcGFzc2VuZ2VyLmlkKVxuICAgICAgICAucmVtb3ZlKCk7XG59KTtcbi8vIHN5c3RlbS5hZGROZXdFbGV2YXRvcigpO1xuLy8gc3lzdGVtLmFkZE5ld0VsZXZhdG9yKCk7XG4vLyBzeXN0ZW0uYWRkTmV3UGFzc2VuZ2VyKHtcbi8vICAgbmFtZTogXCJKYWt1YlwiLFxuLy8gICBpbml0aWFsRmxvb3I6IDIsXG4vLyAgIGRlc3RpbmF0aW9uRmxvb3I6IDQsXG4vLyB9KTtcbi8vIHN5c3RlbS5hZGROZXdQYXNzZW5nZXIoe1xuLy8gICBuYW1lOiBcIlBhd2XFglwiLFxuLy8gICBpbml0aWFsRmxvb3I6IDYsXG4vLyAgIGRlc3RpbmF0aW9uRmxvb3I6IDMsXG4vLyB9KTtcbi8vIHN5c3RlbS5hZGROZXdQYXNzZW5nZXIoe1xuLy8gICBuYW1lOiBcIlBpb3RyXCIsXG4vLyAgIGluaXRpYWxGbG9vcjogNyxcbi8vICAgZGVzdGluYXRpb25GbG9vcjogMyxcbi8vIH0pO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==