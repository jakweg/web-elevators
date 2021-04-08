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
                            // if there are none, then make this elevator go for that person
                            elevator.direction = Math.sign(passenger.initialFloor - elevator.currentFloor);
                            if (elevator.direction === 0) {
                                // in case the passenger is one the same floor as the elevator, take it
                                elevator.direction = Math.sign(passenger.destinationFloor - passenger.initialFloor);
                                for (var i = this_1.waitingPassengers.length - 1; i >= 0; i--) {
                                    var passenger_1 = this_1.waitingPassengers[i];
                                    if (passenger_1.initialFloor === elevator.currentFloor && passenger_1.direction === elevator.direction) {
                                        elevator.passengers.push(passenger_1);
                                        this_1.waitingPassengers.splice(i, 1);
                                        this_1.emit('passenger-taken', { passenger: passenger_1, elevator: elevator });
                                    }
                                }
                            }
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
// system.addNewElevator()
// system.addNewPassenger({
//     name: 'Jakub',
//     initialFloor: 0,
//     destinationFloor: 1,
// })
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWItZWxldmF0b3JzLy4vc3JjL2VsZXZhdG9yLXN5c3RlbS50cyIsIndlYnBhY2s6Ly93ZWItZWxldmF0b3JzLy4vc3JjL2V2ZW50LXByb2R1Y2VyLnRzIiwid2VicGFjazovL3dlYi1lbGV2YXRvcnMvLi9zcmMvdXRpbC50cyIsIndlYnBhY2s6Ly93ZWItZWxldmF0b3JzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dlYi1lbGV2YXRvcnMvLi9zcmMvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxjQUFjLGdCQUFnQixzQ0FBc0MsaUJBQWlCLEVBQUU7QUFDdkYsNkJBQTZCLDhFQUE4RTtBQUMzRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsc0JBQXNCO0FBQzdDO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCLGdCQUFnQixHQUFHLHlCQUF5QjtBQUM1Qyx1QkFBdUIsbUJBQU8sQ0FBQyxpREFBa0I7QUFDakQsYUFBYSxtQkFBTyxDQUFDLDZCQUFRO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLG9EQUFvRCx5QkFBeUIsS0FBSztBQUNuRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICB9O1xufSkoKTtcbnZhciBfX3ZhbHVlcyA9ICh0aGlzICYmIHRoaXMuX192YWx1ZXMpIHx8IGZ1bmN0aW9uKG8pIHtcbiAgICB2YXIgcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuaXRlcmF0b3IsIG0gPSBzICYmIG9bc10sIGkgPSAwO1xuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xuICAgIGlmIChvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHtcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihzID8gXCJPYmplY3QgaXMgbm90IGl0ZXJhYmxlLlwiIDogXCJTeW1ib2wuaXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xufTtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLkVsZXZhdG9yID0gZXhwb3J0cy5FbGV2YXRvckRpcmVjdGlvbiA9IHZvaWQgMDtcbnZhciBldmVudF9wcm9kdWNlcl8xID0gcmVxdWlyZShcIi4vZXZlbnQtcHJvZHVjZXJcIik7XG52YXIgdXRpbF8xID0gcmVxdWlyZShcIi4vdXRpbFwiKTtcbnZhciBFbGV2YXRvckRpcmVjdGlvbjtcbihmdW5jdGlvbiAoRWxldmF0b3JEaXJlY3Rpb24pIHtcbiAgICBFbGV2YXRvckRpcmVjdGlvbltFbGV2YXRvckRpcmVjdGlvbltcIlN0YW5kaW5nXCJdID0gMF0gPSBcIlN0YW5kaW5nXCI7XG4gICAgRWxldmF0b3JEaXJlY3Rpb25bRWxldmF0b3JEaXJlY3Rpb25bXCJHb2luZ1VwXCJdID0gMV0gPSBcIkdvaW5nVXBcIjtcbiAgICBFbGV2YXRvckRpcmVjdGlvbltFbGV2YXRvckRpcmVjdGlvbltcIkdvaW5nRG93blwiXSA9IC0xXSA9IFwiR29pbmdEb3duXCI7XG59KShFbGV2YXRvckRpcmVjdGlvbiA9IGV4cG9ydHMuRWxldmF0b3JEaXJlY3Rpb24gfHwgKGV4cG9ydHMuRWxldmF0b3JEaXJlY3Rpb24gPSB7fSkpO1xudmFyIEVsZXZhdG9yID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEVsZXZhdG9yKGlkKSB7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5jdXJyZW50Rmxvb3IgPSAwO1xuICAgICAgICB0aGlzLmRpcmVjdGlvbiA9IEVsZXZhdG9yRGlyZWN0aW9uLlN0YW5kaW5nO1xuICAgICAgICB0aGlzLm5leHREaXJlY3Rpb24gPSBFbGV2YXRvckRpcmVjdGlvbi5TdGFuZGluZztcbiAgICAgICAgdGhpcy5kZXN0aW5hdGlvbkxpbWl0ID0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG4gICAgICAgIHRoaXMucGFzc2VuZ2VycyA9IFtdO1xuICAgIH1cbiAgICByZXR1cm4gRWxldmF0b3I7XG59KCkpO1xuZXhwb3J0cy5FbGV2YXRvciA9IEVsZXZhdG9yO1xudmFyIEVsZXZhdG9yU3lzdGVtID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhFbGV2YXRvclN5c3RlbSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBFbGV2YXRvclN5c3RlbSgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XG4gICAgICAgIC8vIGlkIHRvIEVsZXZhdG9yXG4gICAgICAgIF90aGlzLmVsZXZhdG9ycyA9IG5ldyBNYXAoKTtcbiAgICAgICAgX3RoaXMud2FpdGluZ1Bhc3NlbmdlcnMgPSBbXTtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICBFbGV2YXRvclN5c3RlbS5wcm90b3R5cGUuYWRkTmV3RWxldmF0b3IgPSBmdW5jdGlvbiAoaW5pdGlhbEZsb29yKSB7XG4gICAgICAgIHZhciBpZCA9IHV0aWxfMS5nZW5lcmF0ZVVuaXF1ZUlkKCk7XG4gICAgICAgIHZhciBvYmogPSBuZXcgRWxldmF0b3IoaWQpO1xuICAgICAgICBvYmouY3VycmVudEZsb29yID0gK2luaXRpYWxGbG9vciB8fCAwO1xuICAgICAgICB0aGlzLmVsZXZhdG9ycy5zZXQoaWQsIG9iaik7XG4gICAgICAgIHRoaXMuZW1pdCgnZWxldmF0b3ItYWRkZWQnLCBvYmopO1xuICAgIH07XG4gICAgRWxldmF0b3JTeXN0ZW0ucHJvdG90eXBlLmFkZE5ld1Bhc3NlbmdlciA9IGZ1bmN0aW9uIChfYSkge1xuICAgICAgICB2YXIgbmFtZSA9IF9hLm5hbWUsIGluaXRpYWxGbG9vciA9IF9hLmluaXRpYWxGbG9vciwgZGVzdGluYXRpb25GbG9vciA9IF9hLmRlc3RpbmF0aW9uRmxvb3I7XG4gICAgICAgIGlmIChpc05hTihpbml0aWFsRmxvb3IpIHx8IGlzTmFOKGRlc3RpbmF0aW9uRmxvb3IpKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHBhc3NlbmdlcnMgcGFyYW1ldGVycycpO1xuICAgICAgICBpZiAoaW5pdGlhbEZsb29yID09PSBkZXN0aW5hdGlvbkZsb29yKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQYXNzZW5nZXIgaXMgYWxyZWFkeSBvbiB0aGUgZGVzdGluYXRpb24gZmxvb3InKTtcbiAgICAgICAgdmFyIHBhc3NlbmdlciA9IHtcbiAgICAgICAgICAgIGlkOiB1dGlsXzEuZ2VuZXJhdGVVbmlxdWVJZCgpLFxuICAgICAgICAgICAgZGlyZWN0aW9uOiBkZXN0aW5hdGlvbkZsb29yIDwgaW5pdGlhbEZsb29yID8gRWxldmF0b3JEaXJlY3Rpb24uR29pbmdEb3duIDogRWxldmF0b3JEaXJlY3Rpb24uR29pbmdVcCxcbiAgICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgICBpbml0aWFsRmxvb3I6IGluaXRpYWxGbG9vcixcbiAgICAgICAgICAgIGRlc3RpbmF0aW9uRmxvb3I6IGRlc3RpbmF0aW9uRmxvb3IsXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMud2FpdGluZ1Bhc3NlbmdlcnMudW5zaGlmdChwYXNzZW5nZXIpO1xuICAgICAgICB0aGlzLmVtaXQoJ3dhaXRpbmctcGFzc2VuZ2VyLWFkZGVkJywgcGFzc2VuZ2VyKTtcbiAgICB9O1xuICAgIEVsZXZhdG9yU3lzdGVtLnByb3RvdHlwZS5jb21taXROZXh0U3RlcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGVfMSwgX2EsIGVfMiwgX2IsIGVfMywgX2MsIGVfNCwgX2QsIGVfNSwgX2U7XG4gICAgICAgIHZhciBjaGFuZ2VkRWxldmF0b3JJZHMgPSBuZXcgU2V0KCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmb3IgKHZhciBfZiA9IF9fdmFsdWVzKHRoaXMuZWxldmF0b3JzLnZhbHVlcygpKSwgX2cgPSBfZi5uZXh0KCk7ICFfZy5kb25lOyBfZyA9IF9mLm5leHQoKSkge1xuICAgICAgICAgICAgICAgIHZhciBlbGV2YXRvciA9IF9nLnZhbHVlO1xuICAgICAgICAgICAgICAgIGlmIChlbGV2YXRvci5kaXJlY3Rpb24gIT09IEVsZXZhdG9yRGlyZWN0aW9uLlN0YW5kaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG1vdmUgdGhlIGVsZXZhdG9yXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZWRFbGV2YXRvcklkcy5hZGQoZWxldmF0b3IuaWQpO1xuICAgICAgICAgICAgICAgICAgICBlbGV2YXRvci5jdXJyZW50Rmxvb3IgKz0gZWxldmF0b3IuZGlyZWN0aW9uO1xuICAgICAgICAgICAgICAgICAgICAvLyBkcm9wIHBhc3NlbmdlcnMgdGhhdCB3YW50cyB0byBiZSBvbiB0aGlzIGZsb29yXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSBlbGV2YXRvci5wYXNzZW5nZXJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGFzc2VuZ2VyID0gZWxldmF0b3IucGFzc2VuZ2Vyc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXNzZW5nZXIuZGVzdGluYXRpb25GbG9vciA9PT0gZWxldmF0b3IuY3VycmVudEZsb29yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxldmF0b3IucGFzc2VuZ2Vycy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdwYXNzZW5nZXItZHJvcHBlZCcsIHsgcGFzc2VuZ2VyOiBwYXNzZW5nZXIsIGVsZXZhdG9yOiBlbGV2YXRvciB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGUgZWxldmF0b3IgaXMgYXQgdGhlIGxpbWl0IGZsb29yIHRoaXMgbWVhbnMgaXQgbmVlZHMgdG8gY2hhbmdlIHRoZSBkaXJlY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsZXZhdG9yLm5leHREaXJlY3Rpb24gIT09IEVsZXZhdG9yRGlyZWN0aW9uLlN0YW5kaW5nICYmIGVsZXZhdG9yLmN1cnJlbnRGbG9vciA9PT0gZWxldmF0b3IuZGVzdGluYXRpb25MaW1pdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxldmF0b3IuZGlyZWN0aW9uID0gZWxldmF0b3IubmV4dERpcmVjdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZXZhdG9yLm5leHREaXJlY3Rpb24gPSBFbGV2YXRvckRpcmVjdGlvbi5TdGFuZGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZXZhdG9yLmRlc3RpbmF0aW9uTGltaXQgPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUiAqIGVsZXZhdG9yLmRpcmVjdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChlbGV2YXRvci5wYXNzZW5nZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVsZXZhdG9yLm5leHREaXJlY3Rpb24gIT09IEVsZXZhdG9yRGlyZWN0aW9uLlN0YW5kaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZXZlbiB0aG91aCB0aGlzIGVsZXZhdG9yIGlzIGVtcHR5IGl0IG5lZWRzIHRvIGdvIHRoaXMgd2F5IGFueXdheVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbG9va3MgbGlrZSB0aGlzIGVsZXZhdG9yIGlzIGVtcHR5IG5vdywgY2hlY2sgaWYgdGhlcmUgaXMgYW55IHBhc3NlbmdlciBpbiB0aGlzIHdheSB0aGF0IHdhbnRzIHRvIGdvIHRoaXMgd2F5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlzU29tZW9uZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0bXAgPSBlbGV2YXRvci5jdXJyZW50Rmxvb3IgKiBlbGV2YXRvci5kaXJlY3Rpb247XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgX2ggPSAoZV8yID0gdm9pZCAwLCBfX3ZhbHVlcyh0aGlzLndhaXRpbmdQYXNzZW5nZXJzKSksIF9qID0gX2gubmV4dCgpOyAhX2ouZG9uZTsgX2ogPSBfaC5uZXh0KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwYXNzZW5nZXIgPSBfai52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXNzZW5nZXIuaW5pdGlhbEZsb29yICogZWxldmF0b3IuZGlyZWN0aW9uID49IHRtcCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhc3Nlbmdlci5kaXJlY3Rpb24gPT09IGVsZXZhdG9yLmRpcmVjdGlvbiAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhc3Nlbmdlci5kZXN0aW5hdGlvbkZsb29yICogZWxldmF0b3IuZGlyZWN0aW9uIDw9IGVsZXZhdG9yLmRlc3RpbmF0aW9uTGltaXQgKiBlbGV2YXRvci5kaXJlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1NvbWVvbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGNoIChlXzJfMSkgeyBlXzIgPSB7IGVycm9yOiBlXzJfMSB9OyB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoX2ogJiYgIV9qLmRvbmUgJiYgKF9iID0gX2hbXCJyZXR1cm5cIl0pKSBfYi5jYWxsKF9oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaW5hbGx5IHsgaWYgKGVfMikgdGhyb3cgZV8yLmVycm9yOyB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNTb21lb25lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vaWYgbm90IHRoZW4gc3dpdGNoIGRpcmVjdGlvbiB0byBzdGFuZGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGV2YXRvci5kaXJlY3Rpb24gPSBFbGV2YXRvckRpcmVjdGlvbi5TdGFuZGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gdGFrZSBwYXNzZW5nZXJzIHRoYXQgd2FudCB0byBnbyB0aGlzIHdheSBhbmQgYXJlIG9uIHRoaXMgZmxvb3IgYW5kIHRoZXkgYXJlIHdpdGhpbiB0aGUgbGltaXRcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IHRoaXMud2FpdGluZ1Bhc3NlbmdlcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwYXNzZW5nZXIgPSB0aGlzLndhaXRpbmdQYXNzZW5nZXJzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhc3Nlbmdlci5pbml0aWFsRmxvb3IgPT09IGVsZXZhdG9yLmN1cnJlbnRGbG9vciAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhc3Nlbmdlci5kaXJlY3Rpb24gPT09IGVsZXZhdG9yLmRpcmVjdGlvbiAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhc3Nlbmdlci5kZXN0aW5hdGlvbkZsb29yICogZWxldmF0b3IuZGlyZWN0aW9uIDwgZWxldmF0b3IuZGVzdGluYXRpb25MaW1pdCAqIGVsZXZhdG9yLmRpcmVjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZXZhdG9yLnBhc3NlbmdlcnMucHVzaChwYXNzZW5nZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud2FpdGluZ1Bhc3NlbmdlcnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgncGFzc2VuZ2VyLXRha2VuJywgeyBwYXNzZW5nZXI6IHBhc3NlbmdlciwgZWxldmF0b3I6IGVsZXZhdG9yIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlXzFfMSkgeyBlXzEgPSB7IGVycm9yOiBlXzFfMSB9OyB9XG4gICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBpZiAoX2cgJiYgIV9nLmRvbmUgJiYgKF9hID0gX2ZbXCJyZXR1cm5cIl0pKSBfYS5jYWxsKF9mKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpbmFsbHkgeyBpZiAoZV8xKSB0aHJvdyBlXzEuZXJyb3I7IH1cbiAgICAgICAgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm9yICh2YXIgX2sgPSBfX3ZhbHVlcyh0aGlzLmVsZXZhdG9ycy52YWx1ZXMoKSksIF9sID0gX2submV4dCgpOyAhX2wuZG9uZTsgX2wgPSBfay5uZXh0KCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgZWxldmF0b3IgPSBfbC52YWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAoZWxldmF0b3IuZGlyZWN0aW9uID09IEVsZXZhdG9yRGlyZWN0aW9uLlN0YW5kaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBfbG9vcF8xID0gZnVuY3Rpb24gKHBhc3Nlbmdlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVfNiwgX3A7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjaGVjayBpZiB0aGVyZSBpcyBhbnkgZWxldmF0b3IgZ29pbmcgdG8gdGhhdCBwZXJzaW9uLCBvciB3aWxsIHRha2UgaXQgaW4gdGhlIG5lYXIgZnV0dXJlXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXNBbnkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgX3EgPSAoZV82ID0gdm9pZCAwLCBfX3ZhbHVlcyh0aGlzXzEuZWxldmF0b3JzLnZhbHVlcygpKSksIF9yID0gX3EubmV4dCgpOyAhX3IuZG9uZTsgX3IgPSBfcS5uZXh0KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG90aGVyRWxldmF0b3IgPSBfci52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChvdGhlckVsZXZhdG9yLmRpcmVjdGlvbiAhPT0gRWxldmF0b3JEaXJlY3Rpb24uU3RhbmRpbmcgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhc3Nlbmdlci5pbml0aWFsRmxvb3IgKiBvdGhlckVsZXZhdG9yLmRpcmVjdGlvbiA+IG90aGVyRWxldmF0b3IuY3VycmVudEZsb29yICogb3RoZXJFbGV2YXRvci5kaXJlY3Rpb24gJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhc3Nlbmdlci5kZXN0aW5hdGlvbkZsb29yICogZWxldmF0b3IuZGlyZWN0aW9uIDw9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3RoZXJFbGV2YXRvci5kZXN0aW5hdGlvbkxpbWl0ICogb3RoZXJFbGV2YXRvci5kaXJlY3Rpb24gJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhc3Nlbmdlci5kaXJlY3Rpb24gPT09IG90aGVyRWxldmF0b3IuZGlyZWN0aW9uKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG90aGVyRWxldmF0b3IuZGlyZWN0aW9uICE9PSBFbGV2YXRvckRpcmVjdGlvbi5TdGFuZGluZyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG90aGVyRWxldmF0b3IubmV4dERpcmVjdGlvbiAhPT0gRWxldmF0b3JEaXJlY3Rpb24uU3RhbmRpbmcgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXNzZW5nZXIuaW5pdGlhbEZsb29yICogb3RoZXJFbGV2YXRvci5kaXJlY3Rpb24gPD1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3RoZXJFbGV2YXRvci5kZXN0aW5hdGlvbkxpbWl0ICogb3RoZXJFbGV2YXRvci5kaXJlY3Rpb24gJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXNzZW5nZXIuZGlyZWN0aW9uID09PSBvdGhlckVsZXZhdG9yLm5leHREaXJlY3Rpb24pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0FueSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGNoIChlXzZfMSkgeyBlXzYgPSB7IGVycm9yOiBlXzZfMSB9OyB9XG4gICAgICAgICAgICAgICAgICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoX3IgJiYgIV9yLmRvbmUgJiYgKF9wID0gX3FbXCJyZXR1cm5cIl0pKSBfcC5jYWxsKF9xKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmluYWxseSB7IGlmIChlXzYpIHRocm93IGVfNi5lcnJvcjsgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0FueSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZXJlIGFyZSBub25lLCB0aGVuIG1ha2UgdGhpcyBlbGV2YXRvciBnbyBmb3IgdGhhdCBwZXJzb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGV2YXRvci5kaXJlY3Rpb24gPSBNYXRoLnNpZ24ocGFzc2VuZ2VyLmluaXRpYWxGbG9vciAtIGVsZXZhdG9yLmN1cnJlbnRGbG9vcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVsZXZhdG9yLmRpcmVjdGlvbiA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpbiBjYXNlIHRoZSBwYXNzZW5nZXIgaXMgb25lIHRoZSBzYW1lIGZsb29yIGFzIHRoZSBlbGV2YXRvciwgdGFrZSBpdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGV2YXRvci5kaXJlY3Rpb24gPSBNYXRoLnNpZ24ocGFzc2VuZ2VyLmRlc3RpbmF0aW9uRmxvb3IgLSBwYXNzZW5nZXIuaW5pdGlhbEZsb29yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IHRoaXNfMS53YWl0aW5nUGFzc2VuZ2Vycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBhc3Nlbmdlcl8xID0gdGhpc18xLndhaXRpbmdQYXNzZW5nZXJzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhc3Nlbmdlcl8xLmluaXRpYWxGbG9vciA9PT0gZWxldmF0b3IuY3VycmVudEZsb29yICYmIHBhc3Nlbmdlcl8xLmRpcmVjdGlvbiA9PT0gZWxldmF0b3IuZGlyZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxldmF0b3IucGFzc2VuZ2Vycy5wdXNoKHBhc3Nlbmdlcl8xKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzXzEud2FpdGluZ1Bhc3NlbmdlcnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNfMS5lbWl0KCdwYXNzZW5nZXItdGFrZW4nLCB7IHBhc3NlbmdlcjogcGFzc2VuZ2VyXzEsIGVsZXZhdG9yOiBlbGV2YXRvciB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGV2YXRvci5uZXh0RGlyZWN0aW9uID0gTWF0aC5zaWduKHBhc3Nlbmdlci5kZXN0aW5hdGlvbkZsb29yIC0gcGFzc2VuZ2VyLmluaXRpYWxGbG9vcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVsZXZhdG9yLm5leHREaXJlY3Rpb24gPT09IGVsZXZhdG9yLmRpcmVjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGV2YXRvci5uZXh0RGlyZWN0aW9uID0gRWxldmF0b3JEaXJlY3Rpb24uU3RhbmRpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZXZhdG9yLmRlc3RpbmF0aW9uTGltaXQgPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUiAqIGVsZXZhdG9yLmRpcmVjdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGl0J3MgZ29vZCBpZGVhIHRvIGZpbmQgYSBwZXJzb24gdGhhdCBpcyBvbiBsb3dlc3QvaGVpZ2hlc3QgZmxvb3JcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxpbWl0XzEgPSBwYXNzZW5nZXIuaW5pdGlhbEZsb29yO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzXzEud2FpdGluZ1Bhc3NlbmdlcnMuZm9yRWFjaChlbGV2YXRvci5kaXJlY3Rpb24gPT09IEVsZXZhdG9yRGlyZWN0aW9uLkdvaW5nVXBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gZnVuY3Rpb24gKHApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocC5pbml0aWFsRmxvb3IgPiBsaW1pdF8xKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW1pdF8xID0gcC5pbml0aWFsRmxvb3I7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uIChwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHAuaW5pdGlhbEZsb29yIDwgbGltaXRfMSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGltaXRfMSA9IHAuaW5pdGlhbEZsb29yO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZXZhdG9yLmRlc3RpbmF0aW9uTGltaXQgPSBsaW1pdF8xO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkRWxldmF0b3JJZHMuYWRkKGVsZXZhdG9yLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJicmVha1wiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGhpc18xID0gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZpbmQgYSBkaXJlY3Rpb24gdG8gZ28gdG9cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIF9tID0gKGVfNCA9IHZvaWQgMCwgX192YWx1ZXModGhpcy53YWl0aW5nUGFzc2VuZ2VycykpLCBfbyA9IF9tLm5leHQoKTsgIV9vLmRvbmU7IF9vID0gX20ubmV4dCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBhc3NlbmdlciA9IF9vLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdGF0ZV8xID0gX2xvb3BfMShwYXNzZW5nZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGF0ZV8xID09PSBcImJyZWFrXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNhdGNoIChlXzRfMSkgeyBlXzQgPSB7IGVycm9yOiBlXzRfMSB9OyB9XG4gICAgICAgICAgICAgICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoX28gJiYgIV9vLmRvbmUgJiYgKF9kID0gX21bXCJyZXR1cm5cIl0pKSBfZC5jYWxsKF9tKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsbHkgeyBpZiAoZV80KSB0aHJvdyBlXzQuZXJyb3I7IH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZV8zXzEpIHsgZV8zID0geyBlcnJvcjogZV8zXzEgfTsgfVxuICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKF9sICYmICFfbC5kb25lICYmIChfYyA9IF9rW1wicmV0dXJuXCJdKSkgX2MuY2FsbChfayk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaW5hbGx5IHsgaWYgKGVfMykgdGhyb3cgZV8zLmVycm9yOyB9XG4gICAgICAgIH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZvciAodmFyIGNoYW5nZWRFbGV2YXRvcklkc18xID0gX192YWx1ZXMoY2hhbmdlZEVsZXZhdG9ySWRzKSwgY2hhbmdlZEVsZXZhdG9ySWRzXzFfMSA9IGNoYW5nZWRFbGV2YXRvcklkc18xLm5leHQoKTsgIWNoYW5nZWRFbGV2YXRvcklkc18xXzEuZG9uZTsgY2hhbmdlZEVsZXZhdG9ySWRzXzFfMSA9IGNoYW5nZWRFbGV2YXRvcklkc18xLm5leHQoKSkge1xuICAgICAgICAgICAgICAgIHZhciBpZCA9IGNoYW5nZWRFbGV2YXRvcklkc18xXzEudmFsdWU7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdlbGV2YXRvci11cGRhdGVkJywgdGhpcy5lbGV2YXRvcnMuZ2V0KGlkKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVfNV8xKSB7IGVfNSA9IHsgZXJyb3I6IGVfNV8xIH07IH1cbiAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlmIChjaGFuZ2VkRWxldmF0b3JJZHNfMV8xICYmICFjaGFuZ2VkRWxldmF0b3JJZHNfMV8xLmRvbmUgJiYgKF9lID0gY2hhbmdlZEVsZXZhdG9ySWRzXzFbXCJyZXR1cm5cIl0pKSBfZS5jYWxsKGNoYW5nZWRFbGV2YXRvcklkc18xKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpbmFsbHkgeyBpZiAoZV81KSB0aHJvdyBlXzUuZXJyb3I7IH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIEVsZXZhdG9yU3lzdGVtO1xufShldmVudF9wcm9kdWNlcl8xW1wiZGVmYXVsdFwiXSkpO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBFbGV2YXRvclN5c3RlbTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fdmFsdWVzID0gKHRoaXMgJiYgdGhpcy5fX3ZhbHVlcykgfHwgZnVuY3Rpb24obykge1xuICAgIHZhciBzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIFN5bWJvbC5pdGVyYXRvciwgbSA9IHMgJiYgb1tzXSwgaSA9IDA7XG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XG4gICAgaWYgKG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSByZXR1cm4ge1xuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xuICAgICAgICB9XG4gICAgfTtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHMgPyBcIk9iamVjdCBpcyBub3QgaXRlcmFibGUuXCIgOiBcIlN5bWJvbC5pdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XG59O1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbnZhciBFdmVudFByb2R1Y2VyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEV2ZW50UHJvZHVjZXIoKSB7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzID0gbmV3IE1hcCgpO1xuICAgIH1cbiAgICBFdmVudFByb2R1Y2VyLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24gKHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgdmFyIGxpc3QgPSAoX2EgPSB0aGlzLmxpc3RlbmVycy5nZXQodHlwZSkpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IFtdO1xuICAgICAgICBsaXN0LnB1c2gobGlzdGVuZXIpO1xuICAgICAgICB0aGlzLmxpc3RlbmVycy5zZXQodHlwZSwgbGlzdCk7XG4gICAgfTtcbiAgICBFdmVudFByb2R1Y2VyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24gKHR5cGUsIGV2ZW50KSB7XG4gICAgICAgIHZhciBlXzEsIF9hO1xuICAgICAgICB2YXIgX2I7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmb3IgKHZhciBfYyA9IF9fdmFsdWVzKCgoX2IgPSB0aGlzLmxpc3RlbmVycy5nZXQodHlwZSkpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IFtdKSksIF9kID0gX2MubmV4dCgpOyAhX2QuZG9uZTsgX2QgPSBfYy5uZXh0KCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgbCA9IF9kLnZhbHVlO1xuICAgICAgICAgICAgICAgIGwoZXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlXzFfMSkgeyBlXzEgPSB7IGVycm9yOiBlXzFfMSB9OyB9XG4gICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBpZiAoX2QgJiYgIV9kLmRvbmUgJiYgKF9hID0gX2NbXCJyZXR1cm5cIl0pKSBfYS5jYWxsKF9jKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpbmFsbHkgeyBpZiAoZV8xKSB0aHJvdyBlXzEuZXJyb3I7IH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIEV2ZW50UHJvZHVjZXI7XG59KCkpO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBFdmVudFByb2R1Y2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5nZW5lcmF0ZVVuaXF1ZUlkID0gdm9pZCAwO1xudmFyIG5leHRJZCA9IDE7XG52YXIgZ2VuZXJhdGVVbmlxdWVJZCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbmV4dElkKys7XG59O1xuZXhwb3J0cy5nZW5lcmF0ZVVuaXF1ZUlkID0gZ2VuZXJhdGVVbmlxdWVJZDtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJcInVzZSBzdHJpY3RcIjtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG52YXIgZWxldmF0b3Jfc3lzdGVtXzEgPSByZXF1aXJlKFwiLi9lbGV2YXRvci1zeXN0ZW1cIik7XG4vLyBzaG93IG1haW4gYm94IHdoZW4gSlMgaXMgZW5hYmxlZFxuZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWFpbicpLnN0eWxlLmRpc3BsYXkgPSBudWxsO1xudmFyIHN5c3RlbSA9IG5ldyBlbGV2YXRvcl9zeXN0ZW1fMVtcImRlZmF1bHRcIl0oKTtcbi8vIHdpbmRvdy5zeXN0ZW0gPSBzeXN0ZW1cbnZhciBlbGV2YXRvcnNMaXN0RGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VsZXZhdG9ycy1saXN0Jyk7XG52YXIgd2FpdGluZ1Bhc3NlbmdlcnNMaXN0RGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dhaXRpbmctcGFzc2VuZ2Vycy1saXN0Jyk7XG52YXIgZm9ybWF0RGlyZWN0aW9uID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHN3aXRjaCAoZGlyKSB7XG4gICAgICAgIGNhc2UgZWxldmF0b3Jfc3lzdGVtXzEuRWxldmF0b3JEaXJlY3Rpb24uR29pbmdVcDpcbiAgICAgICAgICAgIHJldHVybiAndXAnO1xuICAgICAgICBjYXNlIGVsZXZhdG9yX3N5c3RlbV8xLkVsZXZhdG9yRGlyZWN0aW9uLkdvaW5nRG93bjpcbiAgICAgICAgICAgIHJldHVybiAnZG93bic7XG4gICAgICAgIGNhc2UgZWxldmF0b3Jfc3lzdGVtXzEuRWxldmF0b3JEaXJlY3Rpb24uU3RhbmRpbmc6XG4gICAgICAgICAgICByZXR1cm4gJ25vbmUnO1xuICAgIH1cbn07XG4vLyBET00gZXZlbnRzOlxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FkZC1lbGV2YXRvci1idG4nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICBzeXN0ZW0uYWRkTmV3RWxldmF0b3IoK3Byb21wdCgnV2hhdCBmbG9vciBpcyB0aGF0IGVsZXZhdG9yIGluaXRpYWxseSBvbj8nKSk7XG59KTtcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhZGQtcGFzc2VuZ2VyLWJ0bicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIHN5c3RlbS5hZGROZXdQYXNzZW5nZXIoe1xuICAgICAgICBuYW1lOiBwcm9tcHQoJ0dpdmUgYSBwYXNzZW5nZXIgbmFtZScsICcnKSB8fCAnJyxcbiAgICAgICAgaW5pdGlhbEZsb29yOiArcHJvbXB0KCdUaGF0IGZsb29yIGlzIHRoYXQgcGFzc2VuZ2VyIG9uPycpLFxuICAgICAgICBkZXN0aW5hdGlvbkZsb29yOiArcHJvbXB0KCdUaGF0IGZsb29yIGlzIHRoYXQgcGFzc2VuZ2VyIGdvaW5nIHRvIGdvPycpLFxuICAgIH0pO1xufSk7XG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmV4dC1zdGVwLWJ0bicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkgeyByZXR1cm4gc3lzdGVtLmNvbW1pdE5leHRTdGVwKCk7IH0pO1xuLy8gc3lzdGVtIGV2ZW50c1xuc3lzdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2VsZXZhdG9yLWFkZGVkJywgZnVuY3Rpb24gKGVsZXZhdG9yKSB7XG4gICAgdmFyIGVsZXZhdG9yRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZWxldmF0b3JEaXYuaWQgPSBcImVsZXZhdG9yLWlkLVwiICsgZWxldmF0b3IuaWQ7XG4gICAgZWxldmF0b3JEaXYuY2xhc3NMaXN0LmFkZCgnZWxldmF0b3InKTtcbiAgICAvLyAgIHtcbiAgICAvLyAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIC8vICAgICBlbC5jbGFzc0xpc3QuYWRkKFwiZWxldmF0b3ItaWQtdmFsdWVcIik7XG4gICAgLy8gICAgIGVsLmlubmVyVGV4dCA9IGAke2VsZXZhdG9yLmlkfWA7XG4gICAgLy8gICAgIGVsZXZhdG9yRGl2LmFwcGVuZENoaWxkKGVsKTtcbiAgICAvLyAgIH1cbiAgICAvLyAgIHtcbiAgICAvLyAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIC8vICAgICBlbC5jbGFzc0xpc3QuYWRkKFwiZWxldmF0b3ItaWQtdGl0bGVcIik7XG4gICAgLy8gICAgIGVsLmlubmVyVGV4dCA9IGBFbGV2YXRvciBJRGA7XG4gICAgLy8gICAgIGVsZXZhdG9yRGl2LmFwcGVuZENoaWxkKGVsKTtcbiAgICAvLyAgIH1cbiAgICB7XG4gICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKCdjdXJyZW50LWZsb29yLXZhbHVlJyk7XG4gICAgICAgIGVsLmlubmVyVGV4dCA9IFwiXCIgKyBlbGV2YXRvci5jdXJyZW50Rmxvb3I7XG4gICAgICAgIGVsZXZhdG9yRGl2LmFwcGVuZENoaWxkKGVsKTtcbiAgICB9XG4gICAge1xuICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZWwuaW5uZXJUZXh0ID0gXCJDdXJyZW50IGZsb29yXCI7XG4gICAgICAgIGVsZXZhdG9yRGl2LmFwcGVuZENoaWxkKGVsKTtcbiAgICB9XG4gICAge1xuICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZWwuY2xhc3NMaXN0LmFkZCgnZGlyZWN0aW9uLXZhbHVlJyk7XG4gICAgICAgIGVsLmlubmVyVGV4dCA9IFwiXCIgKyBmb3JtYXREaXJlY3Rpb24oZWxldmF0b3IuZGlyZWN0aW9uKTtcbiAgICAgICAgZWxldmF0b3JEaXYuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIH1cbiAgICB7XG4gICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBlbC5pbm5lclRleHQgPSBcIkRpcmVjdGlvblwiO1xuICAgICAgICBlbGV2YXRvckRpdi5hcHBlbmRDaGlsZChlbCk7XG4gICAgfVxuICAgIC8vIHtcbiAgICAvLyAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIC8vICAgICBlbC5jbGFzc0xpc3QuYWRkKCdsaW1pdC1mbG9vci12YWx1ZScpXG4gICAgLy8gICAgIGVsLmlubmVyVGV4dCA9IGAke2VsZXZhdG9yLmRlc3RpbmF0aW9uTGltaXR9YFxuICAgIC8vICAgICBlbGV2YXRvckRpdi5hcHBlbmRDaGlsZChlbClcbiAgICAvLyB9XG4gICAgLy8ge1xuICAgIC8vICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgLy8gICAgIGVsLmlubmVyVGV4dCA9IGBGbG9vciBsaW1pdGBcbiAgICAvLyAgICAgZWxldmF0b3JEaXYuYXBwZW5kQ2hpbGQoZWwpXG4gICAgLy8gfVxuICAgIC8vIHtcbiAgICAvLyAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIC8vICAgICBlbC5jbGFzc0xpc3QuYWRkKCduZXh0LWRpcmVjdGlvbi12YWx1ZScpXG4gICAgLy8gICAgIGVsLmlubmVyVGV4dCA9IGAke2Zvcm1hdERpcmVjdGlvbihlbGV2YXRvci5uZXh0RGlyZWN0aW9uKX1gXG4gICAgLy8gICAgIGVsZXZhdG9yRGl2LmFwcGVuZENoaWxkKGVsKVxuICAgIC8vIH1cbiAgICAvLyB7XG4gICAgLy8gICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAvLyAgICAgZWwuaW5uZXJUZXh0ID0gYE5leHQgZGlyZWN0aW9uYFxuICAgIC8vICAgICBlbGV2YXRvckRpdi5hcHBlbmRDaGlsZChlbClcbiAgICAvLyB9XG4gICAge1xuICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZWwuY2xhc3NMaXN0LmFkZCgncGFzc2VuZ2Vycy1pbnNpZGUtbGlzdCcpO1xuICAgICAgICBlbGV2YXRvckRpdi5hcHBlbmRDaGlsZChlbCk7XG4gICAgfVxuICAgIGVsZXZhdG9yc0xpc3REaXYuYXBwZW5kQ2hpbGQoZWxldmF0b3JEaXYpO1xufSk7XG5zeXN0ZW0uYWRkRXZlbnRMaXN0ZW5lcignZWxldmF0b3ItdXBkYXRlZCcsIGZ1bmN0aW9uIChlbGV2YXRvcikge1xuICAgIHZhciBlbGV2YXRvckRpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZWxldmF0b3ItaWQtXCIgKyBlbGV2YXRvci5pZCk7XG4gICAgZWxldmF0b3JEaXYucXVlcnlTZWxlY3RvcignLmN1cnJlbnQtZmxvb3ItdmFsdWUnKS5pbm5lclRleHQgPSBcIlwiICsgZWxldmF0b3IuY3VycmVudEZsb29yO1xuICAgIGVsZXZhdG9yRGl2LnF1ZXJ5U2VsZWN0b3IoJy5kaXJlY3Rpb24tdmFsdWUnKS5pbm5lclRleHQgPSBcIlwiICsgZm9ybWF0RGlyZWN0aW9uKGVsZXZhdG9yLmRpcmVjdGlvbik7XG4gICAgLy8gKGVsZXZhdG9yRGl2LnF1ZXJ5U2VsZWN0b3IoJy5saW1pdC1mbG9vci12YWx1ZScpIGFzIEhUTUxEaXZFbGVtZW50KS5pbm5lclRleHQgPSBgJHtlbGV2YXRvci5kZXN0aW5hdGlvbkxpbWl0fWA7XG4gICAgLy8gKGVsZXZhdG9yRGl2LnF1ZXJ5U2VsZWN0b3IoJy5uZXh0LWRpcmVjdGlvbi12YWx1ZScpIGFzIEhUTUxEaXZFbGVtZW50KS5pbm5lclRleHQgPSBgJHtmb3JtYXREaXJlY3Rpb24oZWxldmF0b3IubmV4dERpcmVjdGlvbil9YDtcbn0pO1xuc3lzdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ3dhaXRpbmctcGFzc2VuZ2VyLWFkZGVkJywgZnVuY3Rpb24gKHBhc3Nlbmdlcikge1xuICAgIHZhciBlbGV2YXRvckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGVsZXZhdG9yRGl2LmlkID0gXCJ3YWl0aW5nLXBhc3Nlbmdlci1pZC1cIiArIHBhc3Nlbmdlci5pZDtcbiAgICBlbGV2YXRvckRpdi5jbGFzc0xpc3QuYWRkKCd3YWl0aW5nLXBhc3NlbmdlcicpO1xuICAgIHtcbiAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGVsLmlubmVyVGV4dCA9IFwiXCIgKyBwYXNzZW5nZXIubmFtZTtcbiAgICAgICAgZWxldmF0b3JEaXYuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIH1cbiAgICB7XG4gICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBlbC5pbm5lclRleHQgPSBcIk5hbWVcIjtcbiAgICAgICAgZWxldmF0b3JEaXYuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIH1cbiAgICB7XG4gICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBlbC5pbm5lclRleHQgPSBcIlwiICsgcGFzc2VuZ2VyLmluaXRpYWxGbG9vcjtcbiAgICAgICAgZWxldmF0b3JEaXYuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIH1cbiAgICB7XG4gICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBlbC5pbm5lclRleHQgPSBcIldhaXRpbmcgYXRcIjtcbiAgICAgICAgZWxldmF0b3JEaXYuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIH1cbiAgICB7XG4gICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBlbC5pbm5lclRleHQgPSBcIlwiICsgcGFzc2VuZ2VyLmRlc3RpbmF0aW9uRmxvb3I7XG4gICAgICAgIGVsZXZhdG9yRGl2LmFwcGVuZENoaWxkKGVsKTtcbiAgICB9XG4gICAge1xuICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZWwuaW5uZXJUZXh0ID0gXCJEZXN0aW5hdGlvbiBmbG9vclwiO1xuICAgICAgICBlbGV2YXRvckRpdi5hcHBlbmRDaGlsZChlbCk7XG4gICAgfVxuICAgIHdhaXRpbmdQYXNzZW5nZXJzTGlzdERpdi5hcHBlbmRDaGlsZChlbGV2YXRvckRpdik7XG59KTtcbnN5c3RlbS5hZGRFdmVudExpc3RlbmVyKCdwYXNzZW5nZXItdGFrZW4nLCBmdW5jdGlvbiAoX2EpIHtcbiAgICB2YXIgcGFzc2VuZ2VyID0gX2EucGFzc2VuZ2VyLCBlbGV2YXRvciA9IF9hLmVsZXZhdG9yO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwid2FpdGluZy1wYXNzZW5nZXItaWQtXCIgKyBwYXNzZW5nZXIuaWQpLnJlbW92ZSgpO1xuICAgIHZhciBsaXN0T2ZJbnNpZGVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZWxldmF0b3ItaWQtXCIgKyBlbGV2YXRvci5pZCArIFwiIC5wYXNzZW5nZXJzLWluc2lkZS1saXN0XCIpO1xuICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGVsLmlkID0gXCJwYXNzZW5nZXJfXCIgKyBwYXNzZW5nZXIuaWQ7XG4gICAgZWwuY2xhc3NMaXN0LmFkZCgncGFzc2VuZ2VyLWluc2lkZScpO1xuICAgIGVsLmlubmVyVGV4dCA9IFwiXCIgKyBwYXNzZW5nZXIubmFtZTtcbiAgICBsaXN0T2ZJbnNpZGVycy5hcHBlbmRDaGlsZChlbCk7XG59KTtcbnN5c3RlbS5hZGRFdmVudExpc3RlbmVyKCdwYXNzZW5nZXItZHJvcHBlZCcsIGZ1bmN0aW9uIChfYSkge1xuICAgIHZhciBwYXNzZW5nZXIgPSBfYS5wYXNzZW5nZXIsIGVsZXZhdG9yID0gX2EuZWxldmF0b3I7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNlbGV2YXRvci1pZC1cIiArIGVsZXZhdG9yLmlkICsgXCIgI3Bhc3Nlbmdlcl9cIiArIHBhc3Nlbmdlci5pZCkucmVtb3ZlKCk7XG59KTtcbi8vIHN5c3RlbS5hZGROZXdFbGV2YXRvcigpXG4vLyBzeXN0ZW0uYWRkTmV3UGFzc2VuZ2VyKHtcbi8vICAgICBuYW1lOiAnSmFrdWInLFxuLy8gICAgIGluaXRpYWxGbG9vcjogMCxcbi8vICAgICBkZXN0aW5hdGlvbkZsb29yOiAxLFxuLy8gfSlcbi8vIHN5c3RlbS5hZGROZXdFbGV2YXRvcigpO1xuLy8gc3lzdGVtLmFkZE5ld0VsZXZhdG9yKCk7XG4vLyBzeXN0ZW0uYWRkTmV3UGFzc2VuZ2VyKHtcbi8vICAgbmFtZTogXCJKYWt1YlwiLFxuLy8gICBpbml0aWFsRmxvb3I6IDIsXG4vLyAgIGRlc3RpbmF0aW9uRmxvb3I6IDQsXG4vLyB9KTtcbi8vIHN5c3RlbS5hZGROZXdQYXNzZW5nZXIoe1xuLy8gICBuYW1lOiBcIlBhd2XFglwiLFxuLy8gICBpbml0aWFsRmxvb3I6IDYsXG4vLyAgIGRlc3RpbmF0aW9uRmxvb3I6IDMsXG4vLyB9KTtcbi8vIHN5c3RlbS5hZGROZXdQYXNzZW5nZXIoe1xuLy8gICBuYW1lOiBcIlBpb3RyXCIsXG4vLyAgIGluaXRpYWxGbG9vcjogNyxcbi8vICAgZGVzdGluYXRpb25GbG9vcjogMyxcbi8vIH0pO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==