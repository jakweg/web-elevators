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
            name: name,
            initialFloor: initialFloor,
            destinationFloor: destinationFloor,
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
                    if (elevator.nextDirection !== ElevatorDirection.Standing && elevator.currentFloor === elevator.destinationLimit) {
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
                                    if (passenger.initialFloor * elevator.direction >= tmp &&
                                        passenger.direction === elevator.direction &&
                                        passenger.destinationFloor * elevator.direction <= elevator.destinationLimit * elevator.direction) {
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
                        if (passenger.initialFloor === elevator.currentFloor &&
                            passenger.direction === elevator.direction &&
                            passenger.destinationFloor * elevator.direction < elevator.destinationLimit * elevator.direction) {
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
                                if ((otherElevator.direction !== ElevatorDirection.Standing &&
                                    passenger.initialFloor * otherElevator.direction > otherElevator.currentFloor * otherElevator.direction &&
                                    passenger.destinationFloor * elevator.direction <=
                                        otherElevator.destinationLimit * otherElevator.direction &&
                                    passenger.direction === otherElevator.direction) ||
                                    (otherElevator.direction !== ElevatorDirection.Standing &&
                                        otherElevator.nextDirection !== ElevatorDirection.Standing &&
                                        passenger.initialFloor * otherElevator.direction <=
                                            otherElevator.destinationLimit * otherElevator.direction &&
                                        passenger.direction === otherElevator.nextDirection)) {
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
                            console.log('nope');
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
                                this_1.waitingPassengers.forEach(elevator.direction === ElevatorDirection.GoingUp
                                    ? function (p) {
                                        if (p.initialFloor > limit_1)
                                            limit_1 = p.initialFloor;
                                    }
                                    : function (p) {
                                        if (p.initialFloor < limit_1)
                                            limit_1 = p.initialFloor;
                                    });
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
document.querySelector('main').style.display = null;
var system = new elevator_system_1["default"]();
// window.system = system
var elevatorsListDiv = document.getElementById('elevators-list');
var waitingPassengersListDiv = document.getElementById('waiting-passengers-list');
var formatDirection = function (dir) {
    switch (dir) {
        case elevator_system_1.ElevatorDirection.GoingUp:
            return 'up';
        case elevator_system_1.ElevatorDirection.GoingDown:
            return 'down';
        case elevator_system_1.ElevatorDirection.Standing:
            return 'none';
    }
};
// DOM events:
document.getElementById('add-elevator-btn').addEventListener('click', function () {
    system.addNewElevator(+prompt('What floor is that elevator initially on?'));
});
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
        el.classList.add('direction-value');
        el.innerText = "" + formatDirection(elevator.direction);
        elevatorDiv.appendChild(el);
    }
    {
        var el = document.createElement('div');
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
        var el = document.createElement('div');
        el.classList.add('passengers-inside-list');
        elevatorDiv.appendChild(el);
    }
    elevatorsListDiv.appendChild(elevatorDiv);
});
system.addEventListener('elevator-updated', function (elevator) {
    var elevatorDiv = document.getElementById("elevator-id-" + elevator.id);
    elevatorDiv.querySelector('.current-floor-value').innerText = "" + elevator.currentFloor;
    elevatorDiv.querySelector('.direction-value').innerText = "" + formatDirection(elevator.direction);
    // (elevatorDiv.querySelector('.limit-floor-value') as HTMLDivElement).innerText = `${elevator.destinationLimit}`;
    // (elevatorDiv.querySelector('.next-direction-value') as HTMLDivElement).innerText = `${formatDirection(elevator.nextDirection)}`;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWItZWxldmF0b3JzLy4vc3JjL2VsZXZhdG9yLXN5c3RlbS50cyIsIndlYnBhY2s6Ly93ZWItZWxldmF0b3JzLy4vc3JjL2V2ZW50LXByb2R1Y2VyLnRzIiwid2VicGFjazovL3dlYi1lbGV2YXRvcnMvLi9zcmMvdXRpbC50cyIsIndlYnBhY2s6Ly93ZWItZWxldmF0b3JzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dlYi1lbGV2YXRvcnMvLi9zcmMvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxjQUFjLGdCQUFnQixzQ0FBc0MsaUJBQWlCLEVBQUU7QUFDdkYsNkJBQTZCLDhFQUE4RTtBQUMzRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsc0JBQXNCO0FBQzdDO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCLGdCQUFnQixHQUFHLHlCQUF5QjtBQUM1Qyx1QkFBdUIsbUJBQU8sQ0FBQyxpREFBa0I7QUFDakQsYUFBYSxtQkFBTyxDQUFDLDZCQUFRO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLG9EQUFvRCx5QkFBeUIsS0FBSztBQUNuRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEVBQTRFLFVBQVU7QUFDdEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0VBQWdFLFFBQVE7QUFDeEU7QUFDQTtBQUNBO0FBQ0EsNERBQTRELDJDQUEyQztBQUN2RztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0dBQStHLFVBQVU7QUFDekg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDLFFBQVEsZ0JBQWdCO0FBQ25FO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUNBQXlDLDBCQUEwQjtBQUNuRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUVBQW1FLFFBQVE7QUFDM0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMERBQTBELDJDQUEyQztBQUNyRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLFFBQVEsZ0JBQWdCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLDBCQUEwQjtBQUMvQztBQUNBO0FBQ0EsNEVBQTRFLFVBQVU7QUFDdEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4R0FBOEcsVUFBVTtBQUN4SDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QyxRQUFRLGdCQUFnQjtBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQywwQkFBMEI7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVHQUF1RyxVQUFVO0FBQ2pIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxRQUFRLGdCQUFnQjtBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQywwQkFBMEI7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsUUFBUSxnQkFBZ0I7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsMEJBQTBCO0FBQy9DO0FBQ0E7QUFDQSwrSEFBK0gsOEJBQThCO0FBQzdKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLFFBQVEsZ0JBQWdCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLDBCQUEwQjtBQUMvQztBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsZUFBa0I7Ozs7Ozs7Ozs7O0FDclFMO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwSEFBMEgsVUFBVTtBQUNwSTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixRQUFRLGdCQUFnQjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQiwwQkFBMEI7QUFDL0M7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELGVBQWtCOzs7Ozs7Ozs7OztBQzFDTDtBQUNiLGtCQUFrQjtBQUNsQix3QkFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0I7Ozs7Ozs7VUNQeEI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7Ozs7OztBQ3RCYTtBQUNiLGtCQUFrQjtBQUNsQix3QkFBd0IsbUJBQU8sQ0FBQyxtREFBbUI7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDO0FBQ0QsZ0ZBQWdGLGdDQUFnQyxFQUFFO0FBQ2xIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsWUFBWTtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsMEJBQTBCO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLHdDQUF3QztBQUNyRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBGQUEwRiwwQkFBMEI7QUFDcEgsNkZBQTZGLHdDQUF3QztBQUNySSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUkiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xuICAgICAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xuICAgIH07XG59KSgpO1xudmFyIF9fdmFsdWVzID0gKHRoaXMgJiYgdGhpcy5fX3ZhbHVlcykgfHwgZnVuY3Rpb24obykge1xuICAgIHZhciBzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIFN5bWJvbC5pdGVyYXRvciwgbSA9IHMgJiYgb1tzXSwgaSA9IDA7XG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XG4gICAgaWYgKG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSByZXR1cm4ge1xuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xuICAgICAgICB9XG4gICAgfTtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHMgPyBcIk9iamVjdCBpcyBub3QgaXRlcmFibGUuXCIgOiBcIlN5bWJvbC5pdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XG59O1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuRWxldmF0b3IgPSBleHBvcnRzLkVsZXZhdG9yRGlyZWN0aW9uID0gdm9pZCAwO1xudmFyIGV2ZW50X3Byb2R1Y2VyXzEgPSByZXF1aXJlKFwiLi9ldmVudC1wcm9kdWNlclwiKTtcbnZhciB1dGlsXzEgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xudmFyIEVsZXZhdG9yRGlyZWN0aW9uO1xuKGZ1bmN0aW9uIChFbGV2YXRvckRpcmVjdGlvbikge1xuICAgIEVsZXZhdG9yRGlyZWN0aW9uW0VsZXZhdG9yRGlyZWN0aW9uW1wiU3RhbmRpbmdcIl0gPSAwXSA9IFwiU3RhbmRpbmdcIjtcbiAgICBFbGV2YXRvckRpcmVjdGlvbltFbGV2YXRvckRpcmVjdGlvbltcIkdvaW5nVXBcIl0gPSAxXSA9IFwiR29pbmdVcFwiO1xuICAgIEVsZXZhdG9yRGlyZWN0aW9uW0VsZXZhdG9yRGlyZWN0aW9uW1wiR29pbmdEb3duXCJdID0gLTFdID0gXCJHb2luZ0Rvd25cIjtcbn0pKEVsZXZhdG9yRGlyZWN0aW9uID0gZXhwb3J0cy5FbGV2YXRvckRpcmVjdGlvbiB8fCAoZXhwb3J0cy5FbGV2YXRvckRpcmVjdGlvbiA9IHt9KSk7XG52YXIgRWxldmF0b3IgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gRWxldmF0b3IoaWQpIHtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLmN1cnJlbnRGbG9vciA9IDA7XG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gRWxldmF0b3JEaXJlY3Rpb24uU3RhbmRpbmc7XG4gICAgICAgIHRoaXMubmV4dERpcmVjdGlvbiA9IEVsZXZhdG9yRGlyZWN0aW9uLlN0YW5kaW5nO1xuICAgICAgICB0aGlzLmRlc3RpbmF0aW9uTGltaXQgPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcbiAgICAgICAgdGhpcy5wYXNzZW5nZXJzID0gW107XG4gICAgfVxuICAgIHJldHVybiBFbGV2YXRvcjtcbn0oKSk7XG5leHBvcnRzLkVsZXZhdG9yID0gRWxldmF0b3I7XG52YXIgRWxldmF0b3JTeXN0ZW0gPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKEVsZXZhdG9yU3lzdGVtLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIEVsZXZhdG9yU3lzdGVtKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcbiAgICAgICAgLy8gaWQgdG8gRWxldmF0b3JcbiAgICAgICAgX3RoaXMuZWxldmF0b3JzID0gbmV3IE1hcCgpO1xuICAgICAgICBfdGhpcy53YWl0aW5nUGFzc2VuZ2VycyA9IFtdO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIEVsZXZhdG9yU3lzdGVtLnByb3RvdHlwZS5hZGROZXdFbGV2YXRvciA9IGZ1bmN0aW9uIChpbml0aWFsRmxvb3IpIHtcbiAgICAgICAgdmFyIGlkID0gdXRpbF8xLmdlbmVyYXRlVW5pcXVlSWQoKTtcbiAgICAgICAgdmFyIG9iaiA9IG5ldyBFbGV2YXRvcihpZCk7XG4gICAgICAgIG9iai5jdXJyZW50Rmxvb3IgPSAraW5pdGlhbEZsb29yIHx8IDA7XG4gICAgICAgIHRoaXMuZWxldmF0b3JzLnNldChpZCwgb2JqKTtcbiAgICAgICAgdGhpcy5lbWl0KCdlbGV2YXRvci1hZGRlZCcsIG9iaik7XG4gICAgfTtcbiAgICBFbGV2YXRvclN5c3RlbS5wcm90b3R5cGUuYWRkTmV3UGFzc2VuZ2VyID0gZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHZhciBuYW1lID0gX2EubmFtZSwgaW5pdGlhbEZsb29yID0gX2EuaW5pdGlhbEZsb29yLCBkZXN0aW5hdGlvbkZsb29yID0gX2EuZGVzdGluYXRpb25GbG9vcjtcbiAgICAgICAgaWYgKGlzTmFOKGluaXRpYWxGbG9vcikgfHwgaXNOYU4oZGVzdGluYXRpb25GbG9vcikpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgcGFzc2VuZ2VycyBwYXJhbWV0ZXJzJyk7XG4gICAgICAgIGlmIChpbml0aWFsRmxvb3IgPT09IGRlc3RpbmF0aW9uRmxvb3IpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Bhc3NlbmdlciBpcyBhbHJlYWR5IG9uIHRoZSBkZXN0aW5hdGlvbiBmbG9vcicpO1xuICAgICAgICB2YXIgcGFzc2VuZ2VyID0ge1xuICAgICAgICAgICAgaWQ6IHV0aWxfMS5nZW5lcmF0ZVVuaXF1ZUlkKCksXG4gICAgICAgICAgICBkaXJlY3Rpb246IGRlc3RpbmF0aW9uRmxvb3IgPCBpbml0aWFsRmxvb3IgPyBFbGV2YXRvckRpcmVjdGlvbi5Hb2luZ0Rvd24gOiBFbGV2YXRvckRpcmVjdGlvbi5Hb2luZ1VwLFxuICAgICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICAgIGluaXRpYWxGbG9vcjogaW5pdGlhbEZsb29yLFxuICAgICAgICAgICAgZGVzdGluYXRpb25GbG9vcjogZGVzdGluYXRpb25GbG9vcixcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy53YWl0aW5nUGFzc2VuZ2Vycy51bnNoaWZ0KHBhc3Nlbmdlcik7XG4gICAgICAgIHRoaXMuZW1pdCgnd2FpdGluZy1wYXNzZW5nZXItYWRkZWQnLCBwYXNzZW5nZXIpO1xuICAgIH07XG4gICAgRWxldmF0b3JTeXN0ZW0ucHJvdG90eXBlLmNvbW1pdE5leHRTdGVwID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZV8xLCBfYSwgZV8yLCBfYiwgZV8zLCBfYywgZV80LCBfZCwgZV81LCBfZTtcbiAgICAgICAgdmFyIGNoYW5nZWRFbGV2YXRvcklkcyA9IG5ldyBTZXQoKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZvciAodmFyIF9mID0gX192YWx1ZXModGhpcy5lbGV2YXRvcnMudmFsdWVzKCkpLCBfZyA9IF9mLm5leHQoKTsgIV9nLmRvbmU7IF9nID0gX2YubmV4dCgpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGVsZXZhdG9yID0gX2cudmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKGVsZXZhdG9yLmRpcmVjdGlvbiAhPT0gRWxldmF0b3JEaXJlY3Rpb24uU3RhbmRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gbW92ZSB0aGUgZWxldmF0b3JcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlZEVsZXZhdG9ySWRzLmFkZChlbGV2YXRvci5pZCk7XG4gICAgICAgICAgICAgICAgICAgIGVsZXZhdG9yLmN1cnJlbnRGbG9vciArPSBlbGV2YXRvci5kaXJlY3Rpb247XG4gICAgICAgICAgICAgICAgICAgIC8vIGRyb3AgcGFzc2VuZ2VycyB0aGF0IHdhbnRzIHRvIGJlIG9uIHRoaXMgZmxvb3JcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IGVsZXZhdG9yLnBhc3NlbmdlcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwYXNzZW5nZXIgPSBlbGV2YXRvci5wYXNzZW5nZXJzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhc3Nlbmdlci5kZXN0aW5hdGlvbkZsb29yID09PSBlbGV2YXRvci5jdXJyZW50Rmxvb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGV2YXRvci5wYXNzZW5nZXJzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ3Bhc3Nlbmdlci1kcm9wcGVkJywgeyBwYXNzZW5nZXI6IHBhc3NlbmdlciwgZWxldmF0b3I6IGVsZXZhdG9yIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBlbGV2YXRvciBpcyBhdCB0aGUgbGltaXQgZmxvb3IgdGhpcyBtZWFucyBpdCBuZWVkcyB0byBjaGFuZ2UgdGhlIGRpcmVjdGlvblxuICAgICAgICAgICAgICAgICAgICBpZiAoZWxldmF0b3IubmV4dERpcmVjdGlvbiAhPT0gRWxldmF0b3JEaXJlY3Rpb24uU3RhbmRpbmcgJiYgZWxldmF0b3IuY3VycmVudEZsb29yID09PSBlbGV2YXRvci5kZXN0aW5hdGlvbkxpbWl0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGV2YXRvci5kaXJlY3Rpb24gPSBlbGV2YXRvci5uZXh0RGlyZWN0aW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxldmF0b3IubmV4dERpcmVjdGlvbiA9IEVsZXZhdG9yRGlyZWN0aW9uLlN0YW5kaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxldmF0b3IuZGVzdGluYXRpb25MaW1pdCA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSICogZWxldmF0b3IuZGlyZWN0aW9uO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGVsZXZhdG9yLnBhc3NlbmdlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWxldmF0b3IubmV4dERpcmVjdGlvbiAhPT0gRWxldmF0b3JEaXJlY3Rpb24uU3RhbmRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBldmVuIHRob3VoIHRoaXMgZWxldmF0b3IgaXMgZW1wdHkgaXQgbmVlZHMgdG8gZ28gdGhpcyB3YXkgYW55d2F5XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBsb29rcyBsaWtlIHRoaXMgZWxldmF0b3IgaXMgZW1wdHkgbm93LCBjaGVjayBpZiB0aGVyZSBpcyBhbnkgcGFzc2VuZ2VyIGluIHRoaXMgd2F5IHRoYXQgd2FudHMgdG8gZ28gdGhpcyB3YXlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXNTb21lb25lID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRtcCA9IGVsZXZhdG9yLmN1cnJlbnRGbG9vciAqIGVsZXZhdG9yLmRpcmVjdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBfaCA9IChlXzIgPSB2b2lkIDAsIF9fdmFsdWVzKHRoaXMud2FpdGluZ1Bhc3NlbmdlcnMpKSwgX2ogPSBfaC5uZXh0KCk7ICFfai5kb25lOyBfaiA9IF9oLm5leHQoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBhc3NlbmdlciA9IF9qLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhc3Nlbmdlci5pbml0aWFsRmxvb3IgKiBlbGV2YXRvci5kaXJlY3Rpb24gPj0gdG1wICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFzc2VuZ2VyLmRpcmVjdGlvbiA9PT0gZWxldmF0b3IuZGlyZWN0aW9uICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFzc2VuZ2VyLmRlc3RpbmF0aW9uRmxvb3IgKiBlbGV2YXRvci5kaXJlY3Rpb24gPD0gZWxldmF0b3IuZGVzdGluYXRpb25MaW1pdCAqIGVsZXZhdG9yLmRpcmVjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzU29tZW9uZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGVfMl8xKSB7IGVfMiA9IHsgZXJyb3I6IGVfMl8xIH07IH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfaiAmJiAhX2ouZG9uZSAmJiAoX2IgPSBfaFtcInJldHVyblwiXSkpIF9iLmNhbGwoX2gpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsbHkgeyBpZiAoZV8yKSB0aHJvdyBlXzIuZXJyb3I7IH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc1NvbWVvbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9pZiBub3QgdGhlbiBzd2l0Y2ggZGlyZWN0aW9uIHRvIHN0YW5kaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZXZhdG9yLmRpcmVjdGlvbiA9IEVsZXZhdG9yRGlyZWN0aW9uLlN0YW5kaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyB0YWtlIHBhc3NlbmdlcnMgdGhhdCB3YW50IHRvIGdvIHRoaXMgd2F5IGFuZCBhcmUgb24gdGhpcyBmbG9vciBhbmQgdGhleSBhcmUgd2l0aGluIHRoZSBsaW1pdFxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gdGhpcy53YWl0aW5nUGFzc2VuZ2Vycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBhc3NlbmdlciA9IHRoaXMud2FpdGluZ1Bhc3NlbmdlcnNbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFzc2VuZ2VyLmluaXRpYWxGbG9vciA9PT0gZWxldmF0b3IuY3VycmVudEZsb29yICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFzc2VuZ2VyLmRpcmVjdGlvbiA9PT0gZWxldmF0b3IuZGlyZWN0aW9uICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFzc2VuZ2VyLmRlc3RpbmF0aW9uRmxvb3IgKiBlbGV2YXRvci5kaXJlY3Rpb24gPCBlbGV2YXRvci5kZXN0aW5hdGlvbkxpbWl0ICogZWxldmF0b3IuZGlyZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxldmF0b3IucGFzc2VuZ2Vycy5wdXNoKHBhc3Nlbmdlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53YWl0aW5nUGFzc2VuZ2Vycy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdwYXNzZW5nZXItdGFrZW4nLCB7IHBhc3NlbmdlcjogcGFzc2VuZ2VyLCBlbGV2YXRvcjogZWxldmF0b3IgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVfMV8xKSB7IGVfMSA9IHsgZXJyb3I6IGVfMV8xIH07IH1cbiAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlmIChfZyAmJiAhX2cuZG9uZSAmJiAoX2EgPSBfZltcInJldHVyblwiXSkpIF9hLmNhbGwoX2YpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmluYWxseSB7IGlmIChlXzEpIHRocm93IGVfMS5lcnJvcjsgfVxuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmb3IgKHZhciBfayA9IF9fdmFsdWVzKHRoaXMuZWxldmF0b3JzLnZhbHVlcygpKSwgX2wgPSBfay5uZXh0KCk7ICFfbC5kb25lOyBfbCA9IF9rLm5leHQoKSkge1xuICAgICAgICAgICAgICAgIHZhciBlbGV2YXRvciA9IF9sLnZhbHVlO1xuICAgICAgICAgICAgICAgIGlmIChlbGV2YXRvci5kaXJlY3Rpb24gPT0gRWxldmF0b3JEaXJlY3Rpb24uU3RhbmRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIF9sb29wXzEgPSBmdW5jdGlvbiAocGFzc2VuZ2VyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZV82LCBfcDtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNoZWNrIGlmIHRoZXJlIGlzIGFueSBlbGV2YXRvciBnb2luZyB0byB0aGF0IHBlcnNpb24sIG9yIHdpbGwgdGFrZSBpdCBpbiB0aGUgbmVhciBmdXR1cmVcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpc0FueSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBfcSA9IChlXzYgPSB2b2lkIDAsIF9fdmFsdWVzKHRoaXNfMS5lbGV2YXRvcnMudmFsdWVzKCkpKSwgX3IgPSBfcS5uZXh0KCk7ICFfci5kb25lOyBfciA9IF9xLm5leHQoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgb3RoZXJFbGV2YXRvciA9IF9yLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKG90aGVyRWxldmF0b3IuZGlyZWN0aW9uICE9PSBFbGV2YXRvckRpcmVjdGlvbi5TdGFuZGluZyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFzc2VuZ2VyLmluaXRpYWxGbG9vciAqIG90aGVyRWxldmF0b3IuZGlyZWN0aW9uID4gb3RoZXJFbGV2YXRvci5jdXJyZW50Rmxvb3IgKiBvdGhlckVsZXZhdG9yLmRpcmVjdGlvbiAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFzc2VuZ2VyLmRlc3RpbmF0aW9uRmxvb3IgKiBlbGV2YXRvci5kaXJlY3Rpb24gPD1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdGhlckVsZXZhdG9yLmRlc3RpbmF0aW9uTGltaXQgKiBvdGhlckVsZXZhdG9yLmRpcmVjdGlvbiAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFzc2VuZ2VyLmRpcmVjdGlvbiA9PT0gb3RoZXJFbGV2YXRvci5kaXJlY3Rpb24pIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAob3RoZXJFbGV2YXRvci5kaXJlY3Rpb24gIT09IEVsZXZhdG9yRGlyZWN0aW9uLlN0YW5kaW5nICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3RoZXJFbGV2YXRvci5uZXh0RGlyZWN0aW9uICE9PSBFbGV2YXRvckRpcmVjdGlvbi5TdGFuZGluZyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhc3Nlbmdlci5pbml0aWFsRmxvb3IgKiBvdGhlckVsZXZhdG9yLmRpcmVjdGlvbiA8PVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdGhlckVsZXZhdG9yLmRlc3RpbmF0aW9uTGltaXQgKiBvdGhlckVsZXZhdG9yLmRpcmVjdGlvbiAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhc3Nlbmdlci5kaXJlY3Rpb24gPT09IG90aGVyRWxldmF0b3IubmV4dERpcmVjdGlvbikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQW55ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGVfNl8xKSB7IGVfNiA9IHsgZXJyb3I6IGVfNl8xIH07IH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfciAmJiAhX3IuZG9uZSAmJiAoX3AgPSBfcVtcInJldHVyblwiXSkpIF9wLmNhbGwoX3EpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaW5hbGx5IHsgaWYgKGVfNikgdGhyb3cgZV82LmVycm9yOyB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzQW55KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ25vcGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGVyZSBhcmUgbm9uZSwgdGhlbiBtYWtlIHRoaXMgZWxldmF0b3IgZ28gZm9yIHRoYXQgcGVyc29uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxldmF0b3IuZGlyZWN0aW9uID0gTWF0aC5zaWduKHBhc3Nlbmdlci5pbml0aWFsRmxvb3IgLSBlbGV2YXRvci5jdXJyZW50Rmxvb3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZXZhdG9yLm5leHREaXJlY3Rpb24gPSBNYXRoLnNpZ24ocGFzc2VuZ2VyLmRlc3RpbmF0aW9uRmxvb3IgLSBwYXNzZW5nZXIuaW5pdGlhbEZsb29yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWxldmF0b3IubmV4dERpcmVjdGlvbiA9PT0gZWxldmF0b3IuZGlyZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZXZhdG9yLm5leHREaXJlY3Rpb24gPSBFbGV2YXRvckRpcmVjdGlvbi5TdGFuZGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxldmF0b3IuZGVzdGluYXRpb25MaW1pdCA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSICogZWxldmF0b3IuZGlyZWN0aW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaXQncyBnb29kIGlkZWEgdG8gZmluZCBhIHBlcnNvbiB0aGF0IGlzIG9uIGxvd2VzdC9oZWlnaGVzdCBmbG9vclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGltaXRfMSA9IHBhc3Nlbmdlci5pbml0aWFsRmxvb3I7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNfMS53YWl0aW5nUGFzc2VuZ2Vycy5mb3JFYWNoKGVsZXZhdG9yLmRpcmVjdGlvbiA9PT0gRWxldmF0b3JEaXJlY3Rpb24uR29pbmdVcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBmdW5jdGlvbiAocCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwLmluaXRpYWxGbG9vciA+IGxpbWl0XzEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbWl0XzEgPSBwLmluaXRpYWxGbG9vcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24gKHApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocC5pbml0aWFsRmxvb3IgPCBsaW1pdF8xKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW1pdF8xID0gcC5pbml0aWFsRmxvb3I7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxldmF0b3IuZGVzdGluYXRpb25MaW1pdCA9IGxpbWl0XzE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZWRFbGV2YXRvcklkcy5hZGQoZWxldmF0b3IuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcImJyZWFrXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIHZhciB0aGlzXzEgPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZmluZCBhIGRpcmVjdGlvbiB0byBnbyB0b1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgX20gPSAoZV80ID0gdm9pZCAwLCBfX3ZhbHVlcyh0aGlzLndhaXRpbmdQYXNzZW5nZXJzKSksIF9vID0gX20ubmV4dCgpOyAhX28uZG9uZTsgX28gPSBfbS5uZXh0KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGFzc2VuZ2VyID0gX28udmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXRlXzEgPSBfbG9vcF8xKHBhc3Nlbmdlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXRlXzEgPT09IFwiYnJlYWtcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGVfNF8xKSB7IGVfNCA9IHsgZXJyb3I6IGVfNF8xIH07IH1cbiAgICAgICAgICAgICAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfbyAmJiAhX28uZG9uZSAmJiAoX2QgPSBfbVtcInJldHVyblwiXSkpIF9kLmNhbGwoX20pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZmluYWxseSB7IGlmIChlXzQpIHRocm93IGVfNC5lcnJvcjsgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlXzNfMSkgeyBlXzMgPSB7IGVycm9yOiBlXzNfMSB9OyB9XG4gICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBpZiAoX2wgJiYgIV9sLmRvbmUgJiYgKF9jID0gX2tbXCJyZXR1cm5cIl0pKSBfYy5jYWxsKF9rKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpbmFsbHkgeyBpZiAoZV8zKSB0aHJvdyBlXzMuZXJyb3I7IH1cbiAgICAgICAgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm9yICh2YXIgY2hhbmdlZEVsZXZhdG9ySWRzXzEgPSBfX3ZhbHVlcyhjaGFuZ2VkRWxldmF0b3JJZHMpLCBjaGFuZ2VkRWxldmF0b3JJZHNfMV8xID0gY2hhbmdlZEVsZXZhdG9ySWRzXzEubmV4dCgpOyAhY2hhbmdlZEVsZXZhdG9ySWRzXzFfMS5kb25lOyBjaGFuZ2VkRWxldmF0b3JJZHNfMV8xID0gY2hhbmdlZEVsZXZhdG9ySWRzXzEubmV4dCgpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGlkID0gY2hhbmdlZEVsZXZhdG9ySWRzXzFfMS52YWx1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2VsZXZhdG9yLXVwZGF0ZWQnLCB0aGlzLmVsZXZhdG9ycy5nZXQoaWQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZV81XzEpIHsgZV81ID0geyBlcnJvcjogZV81XzEgfTsgfVxuICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKGNoYW5nZWRFbGV2YXRvcklkc18xXzEgJiYgIWNoYW5nZWRFbGV2YXRvcklkc18xXzEuZG9uZSAmJiAoX2UgPSBjaGFuZ2VkRWxldmF0b3JJZHNfMVtcInJldHVyblwiXSkpIF9lLmNhbGwoY2hhbmdlZEVsZXZhdG9ySWRzXzEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmluYWxseSB7IGlmIChlXzUpIHRocm93IGVfNS5lcnJvcjsgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gRWxldmF0b3JTeXN0ZW07XG59KGV2ZW50X3Byb2R1Y2VyXzFbXCJkZWZhdWx0XCJdKSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IEVsZXZhdG9yU3lzdGVtO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX192YWx1ZXMgPSAodGhpcyAmJiB0aGlzLl9fdmFsdWVzKSB8fCBmdW5jdGlvbihvKSB7XG4gICAgdmFyIHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yLCBtID0gcyAmJiBvW3NdLCBpID0gMDtcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcbiAgICBpZiAobyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHJldHVybiB7XG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IocyA/IFwiT2JqZWN0IGlzIG5vdCBpdGVyYWJsZS5cIiA6IFwiU3ltYm9sLml0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcbn07XG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xudmFyIEV2ZW50UHJvZHVjZXIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gRXZlbnRQcm9kdWNlcigpIHtcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSBuZXcgTWFwKCk7XG4gICAgfVxuICAgIEV2ZW50UHJvZHVjZXIucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbiAodHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICB2YXIgbGlzdCA9IChfYSA9IHRoaXMubGlzdGVuZXJzLmdldCh0eXBlKSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogW107XG4gICAgICAgIGxpc3QucHVzaChsaXN0ZW5lcik7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzLnNldCh0eXBlLCBsaXN0KTtcbiAgICB9O1xuICAgIEV2ZW50UHJvZHVjZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbiAodHlwZSwgZXZlbnQpIHtcbiAgICAgICAgdmFyIGVfMSwgX2E7XG4gICAgICAgIHZhciBfYjtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZvciAodmFyIF9jID0gX192YWx1ZXMoKChfYiA9IHRoaXMubGlzdGVuZXJzLmdldCh0eXBlKSkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogW10pKSwgX2QgPSBfYy5uZXh0KCk7ICFfZC5kb25lOyBfZCA9IF9jLm5leHQoKSkge1xuICAgICAgICAgICAgICAgIHZhciBsID0gX2QudmFsdWU7XG4gICAgICAgICAgICAgICAgbChldmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVfMV8xKSB7IGVfMSA9IHsgZXJyb3I6IGVfMV8xIH07IH1cbiAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlmIChfZCAmJiAhX2QuZG9uZSAmJiAoX2EgPSBfY1tcInJldHVyblwiXSkpIF9hLmNhbGwoX2MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmluYWxseSB7IGlmIChlXzEpIHRocm93IGVfMS5lcnJvcjsgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gRXZlbnRQcm9kdWNlcjtcbn0oKSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IEV2ZW50UHJvZHVjZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLmdlbmVyYXRlVW5pcXVlSWQgPSB2b2lkIDA7XG52YXIgbmV4dElkID0gMTtcbnZhciBnZW5lcmF0ZVVuaXF1ZUlkID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBuZXh0SWQrKztcbn07XG5leHBvcnRzLmdlbmVyYXRlVW5pcXVlSWQgPSBnZW5lcmF0ZVVuaXF1ZUlkO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIlwidXNlIHN0cmljdFwiO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbnZhciBlbGV2YXRvcl9zeXN0ZW1fMSA9IHJlcXVpcmUoXCIuL2VsZXZhdG9yLXN5c3RlbVwiKTtcbi8vIHNob3cgbWFpbiBib3ggd2hlbiBKUyBpcyBlbmFibGVkXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtYWluJykuc3R5bGUuZGlzcGxheSA9IG51bGw7XG52YXIgc3lzdGVtID0gbmV3IGVsZXZhdG9yX3N5c3RlbV8xW1wiZGVmYXVsdFwiXSgpO1xuLy8gd2luZG93LnN5c3RlbSA9IHN5c3RlbVxudmFyIGVsZXZhdG9yc0xpc3REaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZWxldmF0b3JzLWxpc3QnKTtcbnZhciB3YWl0aW5nUGFzc2VuZ2Vyc0xpc3REaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd2FpdGluZy1wYXNzZW5nZXJzLWxpc3QnKTtcbnZhciBmb3JtYXREaXJlY3Rpb24gPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgc3dpdGNoIChkaXIpIHtcbiAgICAgICAgY2FzZSBlbGV2YXRvcl9zeXN0ZW1fMS5FbGV2YXRvckRpcmVjdGlvbi5Hb2luZ1VwOlxuICAgICAgICAgICAgcmV0dXJuICd1cCc7XG4gICAgICAgIGNhc2UgZWxldmF0b3Jfc3lzdGVtXzEuRWxldmF0b3JEaXJlY3Rpb24uR29pbmdEb3duOlxuICAgICAgICAgICAgcmV0dXJuICdkb3duJztcbiAgICAgICAgY2FzZSBlbGV2YXRvcl9zeXN0ZW1fMS5FbGV2YXRvckRpcmVjdGlvbi5TdGFuZGluZzpcbiAgICAgICAgICAgIHJldHVybiAnbm9uZSc7XG4gICAgfVxufTtcbi8vIERPTSBldmVudHM6XG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWRkLWVsZXZhdG9yLWJ0bicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIHN5c3RlbS5hZGROZXdFbGV2YXRvcigrcHJvbXB0KCdXaGF0IGZsb29yIGlzIHRoYXQgZWxldmF0b3IgaW5pdGlhbGx5IG9uPycpKTtcbn0pO1xuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FkZC1wYXNzZW5nZXItYnRuJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgc3lzdGVtLmFkZE5ld1Bhc3Nlbmdlcih7XG4gICAgICAgIG5hbWU6IHByb21wdCgnR2l2ZSBhIHBhc3NlbmdlciBuYW1lJywgJycpIHx8ICcnLFxuICAgICAgICBpbml0aWFsRmxvb3I6ICtwcm9tcHQoJ1RoYXQgZmxvb3IgaXMgdGhhdCBwYXNzZW5nZXIgb24/JyksXG4gICAgICAgIGRlc3RpbmF0aW9uRmxvb3I6ICtwcm9tcHQoJ1RoYXQgZmxvb3IgaXMgdGhhdCBwYXNzZW5nZXIgZ29pbmcgdG8gZ28/JyksXG4gICAgfSk7XG59KTtcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXh0LXN0ZXAtYnRuJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7IHJldHVybiBzeXN0ZW0uY29tbWl0TmV4dFN0ZXAoKTsgfSk7XG4vLyBzeXN0ZW0gZXZlbnRzXG5zeXN0ZW0uYWRkRXZlbnRMaXN0ZW5lcignZWxldmF0b3ItYWRkZWQnLCBmdW5jdGlvbiAoZWxldmF0b3IpIHtcbiAgICB2YXIgZWxldmF0b3JEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBlbGV2YXRvckRpdi5pZCA9IFwiZWxldmF0b3ItaWQtXCIgKyBlbGV2YXRvci5pZDtcbiAgICBlbGV2YXRvckRpdi5jbGFzc0xpc3QuYWRkKCdlbGV2YXRvcicpO1xuICAgIC8vICAge1xuICAgIC8vICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgLy8gICAgIGVsLmNsYXNzTGlzdC5hZGQoXCJlbGV2YXRvci1pZC12YWx1ZVwiKTtcbiAgICAvLyAgICAgZWwuaW5uZXJUZXh0ID0gYCR7ZWxldmF0b3IuaWR9YDtcbiAgICAvLyAgICAgZWxldmF0b3JEaXYuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIC8vICAgfVxuICAgIC8vICAge1xuICAgIC8vICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgLy8gICAgIGVsLmNsYXNzTGlzdC5hZGQoXCJlbGV2YXRvci1pZC10aXRsZVwiKTtcbiAgICAvLyAgICAgZWwuaW5uZXJUZXh0ID0gYEVsZXZhdG9yIElEYDtcbiAgICAvLyAgICAgZWxldmF0b3JEaXYuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIC8vICAgfVxuICAgIHtcbiAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2N1cnJlbnQtZmxvb3ItdmFsdWUnKTtcbiAgICAgICAgZWwuaW5uZXJUZXh0ID0gXCJcIiArIGVsZXZhdG9yLmN1cnJlbnRGbG9vcjtcbiAgICAgICAgZWxldmF0b3JEaXYuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIH1cbiAgICB7XG4gICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBlbC5pbm5lclRleHQgPSBcIkN1cnJlbnQgZmxvb3JcIjtcbiAgICAgICAgZWxldmF0b3JEaXYuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIH1cbiAgICB7XG4gICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKCdkaXJlY3Rpb24tdmFsdWUnKTtcbiAgICAgICAgZWwuaW5uZXJUZXh0ID0gXCJcIiArIGZvcm1hdERpcmVjdGlvbihlbGV2YXRvci5kaXJlY3Rpb24pO1xuICAgICAgICBlbGV2YXRvckRpdi5hcHBlbmRDaGlsZChlbCk7XG4gICAgfVxuICAgIHtcbiAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGVsLmlubmVyVGV4dCA9IFwiRGlyZWN0aW9uXCI7XG4gICAgICAgIGVsZXZhdG9yRGl2LmFwcGVuZENoaWxkKGVsKTtcbiAgICB9XG4gICAgLy8ge1xuICAgIC8vICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgLy8gICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2xpbWl0LWZsb29yLXZhbHVlJylcbiAgICAvLyAgICAgZWwuaW5uZXJUZXh0ID0gYCR7ZWxldmF0b3IuZGVzdGluYXRpb25MaW1pdH1gXG4gICAgLy8gICAgIGVsZXZhdG9yRGl2LmFwcGVuZENoaWxkKGVsKVxuICAgIC8vIH1cbiAgICAvLyB7XG4gICAgLy8gICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAvLyAgICAgZWwuaW5uZXJUZXh0ID0gYEZsb29yIGxpbWl0YFxuICAgIC8vICAgICBlbGV2YXRvckRpdi5hcHBlbmRDaGlsZChlbClcbiAgICAvLyB9XG4gICAgLy8ge1xuICAgIC8vICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgLy8gICAgIGVsLmNsYXNzTGlzdC5hZGQoJ25leHQtZGlyZWN0aW9uLXZhbHVlJylcbiAgICAvLyAgICAgZWwuaW5uZXJUZXh0ID0gYCR7Zm9ybWF0RGlyZWN0aW9uKGVsZXZhdG9yLm5leHREaXJlY3Rpb24pfWBcbiAgICAvLyAgICAgZWxldmF0b3JEaXYuYXBwZW5kQ2hpbGQoZWwpXG4gICAgLy8gfVxuICAgIC8vIHtcbiAgICAvLyAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIC8vICAgICBlbC5pbm5lclRleHQgPSBgTmV4dCBkaXJlY3Rpb25gXG4gICAgLy8gICAgIGVsZXZhdG9yRGl2LmFwcGVuZENoaWxkKGVsKVxuICAgIC8vIH1cbiAgICB7XG4gICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKCdwYXNzZW5nZXJzLWluc2lkZS1saXN0Jyk7XG4gICAgICAgIGVsZXZhdG9yRGl2LmFwcGVuZENoaWxkKGVsKTtcbiAgICB9XG4gICAgZWxldmF0b3JzTGlzdERpdi5hcHBlbmRDaGlsZChlbGV2YXRvckRpdik7XG59KTtcbnN5c3RlbS5hZGRFdmVudExpc3RlbmVyKCdlbGV2YXRvci11cGRhdGVkJywgZnVuY3Rpb24gKGVsZXZhdG9yKSB7XG4gICAgdmFyIGVsZXZhdG9yRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlbGV2YXRvci1pZC1cIiArIGVsZXZhdG9yLmlkKTtcbiAgICBlbGV2YXRvckRpdi5xdWVyeVNlbGVjdG9yKCcuY3VycmVudC1mbG9vci12YWx1ZScpLmlubmVyVGV4dCA9IFwiXCIgKyBlbGV2YXRvci5jdXJyZW50Rmxvb3I7XG4gICAgZWxldmF0b3JEaXYucXVlcnlTZWxlY3RvcignLmRpcmVjdGlvbi12YWx1ZScpLmlubmVyVGV4dCA9IFwiXCIgKyBmb3JtYXREaXJlY3Rpb24oZWxldmF0b3IuZGlyZWN0aW9uKTtcbiAgICAvLyAoZWxldmF0b3JEaXYucXVlcnlTZWxlY3RvcignLmxpbWl0LWZsb29yLXZhbHVlJykgYXMgSFRNTERpdkVsZW1lbnQpLmlubmVyVGV4dCA9IGAke2VsZXZhdG9yLmRlc3RpbmF0aW9uTGltaXR9YDtcbiAgICAvLyAoZWxldmF0b3JEaXYucXVlcnlTZWxlY3RvcignLm5leHQtZGlyZWN0aW9uLXZhbHVlJykgYXMgSFRNTERpdkVsZW1lbnQpLmlubmVyVGV4dCA9IGAke2Zvcm1hdERpcmVjdGlvbihlbGV2YXRvci5uZXh0RGlyZWN0aW9uKX1gO1xufSk7XG5zeXN0ZW0uYWRkRXZlbnRMaXN0ZW5lcignd2FpdGluZy1wYXNzZW5nZXItYWRkZWQnLCBmdW5jdGlvbiAocGFzc2VuZ2VyKSB7XG4gICAgdmFyIGVsZXZhdG9yRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZWxldmF0b3JEaXYuaWQgPSBcIndhaXRpbmctcGFzc2VuZ2VyLWlkLVwiICsgcGFzc2VuZ2VyLmlkO1xuICAgIGVsZXZhdG9yRGl2LmNsYXNzTGlzdC5hZGQoJ3dhaXRpbmctcGFzc2VuZ2VyJyk7XG4gICAge1xuICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZWwuaW5uZXJUZXh0ID0gXCJcIiArIHBhc3Nlbmdlci5uYW1lO1xuICAgICAgICBlbGV2YXRvckRpdi5hcHBlbmRDaGlsZChlbCk7XG4gICAgfVxuICAgIHtcbiAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGVsLmlubmVyVGV4dCA9IFwiTmFtZVwiO1xuICAgICAgICBlbGV2YXRvckRpdi5hcHBlbmRDaGlsZChlbCk7XG4gICAgfVxuICAgIHtcbiAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGVsLmlubmVyVGV4dCA9IFwiXCIgKyBwYXNzZW5nZXIuaW5pdGlhbEZsb29yO1xuICAgICAgICBlbGV2YXRvckRpdi5hcHBlbmRDaGlsZChlbCk7XG4gICAgfVxuICAgIHtcbiAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGVsLmlubmVyVGV4dCA9IFwiV2FpdGluZyBhdFwiO1xuICAgICAgICBlbGV2YXRvckRpdi5hcHBlbmRDaGlsZChlbCk7XG4gICAgfVxuICAgIHtcbiAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGVsLmlubmVyVGV4dCA9IFwiXCIgKyBwYXNzZW5nZXIuZGVzdGluYXRpb25GbG9vcjtcbiAgICAgICAgZWxldmF0b3JEaXYuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIH1cbiAgICB7XG4gICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBlbC5pbm5lclRleHQgPSBcIkRlc3RpbmF0aW9uIGZsb29yXCI7XG4gICAgICAgIGVsZXZhdG9yRGl2LmFwcGVuZENoaWxkKGVsKTtcbiAgICB9XG4gICAgd2FpdGluZ1Bhc3NlbmdlcnNMaXN0RGl2LmFwcGVuZENoaWxkKGVsZXZhdG9yRGl2KTtcbn0pO1xuc3lzdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ3Bhc3Nlbmdlci10YWtlbicsIGZ1bmN0aW9uIChfYSkge1xuICAgIHZhciBwYXNzZW5nZXIgPSBfYS5wYXNzZW5nZXIsIGVsZXZhdG9yID0gX2EuZWxldmF0b3I7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3YWl0aW5nLXBhc3Nlbmdlci1pZC1cIiArIHBhc3Nlbmdlci5pZCkucmVtb3ZlKCk7XG4gICAgdmFyIGxpc3RPZkluc2lkZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNlbGV2YXRvci1pZC1cIiArIGVsZXZhdG9yLmlkICsgXCIgLnBhc3NlbmdlcnMtaW5zaWRlLWxpc3RcIik7XG4gICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZWwuaWQgPSBcInBhc3Nlbmdlcl9cIiArIHBhc3Nlbmdlci5pZDtcbiAgICBlbC5jbGFzc0xpc3QuYWRkKCdwYXNzZW5nZXItaW5zaWRlJyk7XG4gICAgZWwuaW5uZXJUZXh0ID0gXCJcIiArIHBhc3Nlbmdlci5uYW1lO1xuICAgIGxpc3RPZkluc2lkZXJzLmFwcGVuZENoaWxkKGVsKTtcbn0pO1xuc3lzdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ3Bhc3Nlbmdlci1kcm9wcGVkJywgZnVuY3Rpb24gKF9hKSB7XG4gICAgdmFyIHBhc3NlbmdlciA9IF9hLnBhc3NlbmdlciwgZWxldmF0b3IgPSBfYS5lbGV2YXRvcjtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2VsZXZhdG9yLWlkLVwiICsgZWxldmF0b3IuaWQgKyBcIiAjcGFzc2VuZ2VyX1wiICsgcGFzc2VuZ2VyLmlkKS5yZW1vdmUoKTtcbn0pO1xuLy8gc3lzdGVtLmFkZE5ld0VsZXZhdG9yKCk7XG4vLyBzeXN0ZW0uYWRkTmV3RWxldmF0b3IoKTtcbi8vIHN5c3RlbS5hZGROZXdQYXNzZW5nZXIoe1xuLy8gICBuYW1lOiBcIkpha3ViXCIsXG4vLyAgIGluaXRpYWxGbG9vcjogMixcbi8vICAgZGVzdGluYXRpb25GbG9vcjogNCxcbi8vIH0pO1xuLy8gc3lzdGVtLmFkZE5ld1Bhc3Nlbmdlcih7XG4vLyAgIG5hbWU6IFwiUGF3ZcWCXCIsXG4vLyAgIGluaXRpYWxGbG9vcjogNixcbi8vICAgZGVzdGluYXRpb25GbG9vcjogMyxcbi8vIH0pO1xuLy8gc3lzdGVtLmFkZE5ld1Bhc3Nlbmdlcih7XG4vLyAgIG5hbWU6IFwiUGlvdHJcIixcbi8vICAgaW5pdGlhbEZsb29yOiA3LFxuLy8gICBkZXN0aW5hdGlvbkZsb29yOiAzLFxuLy8gfSk7XG4iXSwic291cmNlUm9vdCI6IiJ9