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
        // for (const elevator of this.elevators.values()) {
        var e_1, _a, e_2, _b, e_3, _c, e_4, _d, e_5, _e, e_6, _f;
        //         this.emit('elevator-updated', elevator)
        //     }
        var changedElevatorIds = new Set();
        try {
            for (var _g = __values(this.elevators.keys()), _h = _g.next(); !_h.done; _h = _g.next()) {
                var elevator = _h.value;
                changedElevatorIds.add(elevator);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_h && !_h.done && (_a = _g["return"])) _a.call(_g);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var _j = __values(this.elevators.values()), _k = _j.next(); !_k.done; _k = _j.next()) {
                var elevator = _k.value;
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
                                for (var _l = (e_3 = void 0, __values(this.waitingPassengers)), _m = _l.next(); !_m.done; _m = _l.next()) {
                                    var passenger = _m.value;
                                    if (passenger.initialFloor * elevator.direction >= tmp
                                        && passenger.direction === elevator.direction
                                        && passenger.destinationFloor * elevator.direction <= elevator.destinationLimit * elevator.direction) {
                                        isSomeone = true;
                                        break;
                                    }
                                }
                            }
                            catch (e_3_1) { e_3 = { error: e_3_1 }; }
                            finally {
                                try {
                                    if (_m && !_m.done && (_c = _l["return"])) _c.call(_l);
                                }
                                finally { if (e_3) throw e_3.error; }
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
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_k && !_k.done && (_b = _j["return"])) _b.call(_j);
            }
            finally { if (e_2) throw e_2.error; }
        }
        try {
            for (var _o = __values(this.elevators.values()), _p = _o.next(); !_p.done; _p = _o.next()) {
                var elevator = _p.value;
                if (elevator.direction == ElevatorDirection.Standing) {
                    var _loop_1 = function (passenger) {
                        var e_7, _s;
                        // check if there is any elevator going to that persion, or will take it in the near future
                        var isAny = false;
                        try {
                            for (var _t = (e_7 = void 0, __values(this_1.elevators.values())), _u = _t.next(); !_u.done; _u = _t.next()) {
                                var otherElevator = _u.value;
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
                        catch (e_7_1) { e_7 = { error: e_7_1 }; }
                        finally {
                            try {
                                if (_u && !_u.done && (_s = _t["return"])) _s.call(_t);
                            }
                            finally { if (e_7) throw e_7.error; }
                        }
                        if (!isAny) {
                            console.log(elevator.id, passenger.name);
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
                        for (var _q = (e_5 = void 0, __values(this.waitingPassengers)), _r = _q.next(); !_r.done; _r = _q.next()) {
                            var passenger = _r.value;
                            var state_1 = _loop_1(passenger);
                            if (state_1 === "break")
                                break;
                        }
                    }
                    catch (e_5_1) { e_5 = { error: e_5_1 }; }
                    finally {
                        try {
                            if (_r && !_r.done && (_e = _q["return"])) _e.call(_q);
                        }
                        finally { if (e_5) throw e_5.error; }
                    }
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_p && !_p.done && (_d = _o["return"])) _d.call(_o);
            }
            finally { if (e_4) throw e_4.error; }
        }
        try {
            for (var changedElevatorIds_1 = __values(changedElevatorIds), changedElevatorIds_1_1 = changedElevatorIds_1.next(); !changedElevatorIds_1_1.done; changedElevatorIds_1_1 = changedElevatorIds_1.next()) {
                var id = changedElevatorIds_1_1.value;
                this.emit('elevator-updated', this.elevators.get(id));
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (changedElevatorIds_1_1 && !changedElevatorIds_1_1.done && (_f = changedElevatorIds_1["return"])) _f.call(changedElevatorIds_1);
            }
            finally { if (e_6) throw e_6.error; }
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
        case elevator_system_1.ElevatorDirection.GoingUp: return 'Going up';
        case elevator_system_1.ElevatorDirection.GoingDown: return 'Going down';
        case elevator_system_1.ElevatorDirection.Standing: return 'Standing still';
    }
};
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
system.addNewElevator();
system.addNewElevator();
system.addNewPassenger({
    name: 'Jakub', initialFloor: 2, destinationFloor: 4
});
system.addNewPassenger({
    name: 'Paweł', initialFloor: 6, destinationFloor: 3
});
system.addNewPassenger({
    name: 'Piotr', initialFloor: 7, destinationFloor: 3
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWItZWxldmF0b3JzLy4vc3JjL2VsZXZhdG9yLXN5c3RlbS50cyIsIndlYnBhY2s6Ly93ZWItZWxldmF0b3JzLy4vc3JjL2V2ZW50LXByb2R1Y2VyLnRzIiwid2VicGFjazovL3dlYi1lbGV2YXRvcnMvLi9zcmMvdXRpbC50cyIsIndlYnBhY2s6Ly93ZWItZWxldmF0b3JzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dlYi1lbGV2YXRvcnMvLi9zcmMvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxjQUFjLGdCQUFnQixzQ0FBc0MsaUJBQWlCLEVBQUU7QUFDdkYsNkJBQTZCLDhFQUE4RTtBQUMzRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsc0JBQXNCO0FBQzdDO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCLGdCQUFnQixHQUFHLHlCQUF5QjtBQUM1Qyx1QkFBdUIsbUJBQU8sQ0FBQyxpREFBa0I7QUFDakQsYUFBYSxtQkFBTyxDQUFDLDZCQUFRO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLG9EQUFvRCx5QkFBeUIsS0FBSztBQUNuRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0EsQ0FBQyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcbiAgICAgICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2xhc3MgZXh0ZW5kcyB2YWx1ZSBcIiArIFN0cmluZyhiKSArIFwiIGlzIG5vdCBhIGNvbnN0cnVjdG9yIG9yIG51bGxcIik7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG4gICAgfTtcbn0pKCk7XG52YXIgX192YWx1ZXMgPSAodGhpcyAmJiB0aGlzLl9fdmFsdWVzKSB8fCBmdW5jdGlvbihvKSB7XG4gICAgdmFyIHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yLCBtID0gcyAmJiBvW3NdLCBpID0gMDtcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcbiAgICBpZiAobyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHJldHVybiB7XG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IocyA/IFwiT2JqZWN0IGlzIG5vdCBpdGVyYWJsZS5cIiA6IFwiU3ltYm9sLml0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcbn07XG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5FbGV2YXRvciA9IGV4cG9ydHMuRWxldmF0b3JEaXJlY3Rpb24gPSB2b2lkIDA7XG52YXIgZXZlbnRfcHJvZHVjZXJfMSA9IHJlcXVpcmUoXCIuL2V2ZW50LXByb2R1Y2VyXCIpO1xudmFyIHV0aWxfMSA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XG52YXIgRWxldmF0b3JEaXJlY3Rpb247XG4oZnVuY3Rpb24gKEVsZXZhdG9yRGlyZWN0aW9uKSB7XG4gICAgRWxldmF0b3JEaXJlY3Rpb25bRWxldmF0b3JEaXJlY3Rpb25bXCJTdGFuZGluZ1wiXSA9IDBdID0gXCJTdGFuZGluZ1wiO1xuICAgIEVsZXZhdG9yRGlyZWN0aW9uW0VsZXZhdG9yRGlyZWN0aW9uW1wiR29pbmdVcFwiXSA9IDFdID0gXCJHb2luZ1VwXCI7XG4gICAgRWxldmF0b3JEaXJlY3Rpb25bRWxldmF0b3JEaXJlY3Rpb25bXCJHb2luZ0Rvd25cIl0gPSAtMV0gPSBcIkdvaW5nRG93blwiO1xufSkoRWxldmF0b3JEaXJlY3Rpb24gPSBleHBvcnRzLkVsZXZhdG9yRGlyZWN0aW9uIHx8IChleHBvcnRzLkVsZXZhdG9yRGlyZWN0aW9uID0ge30pKTtcbnZhciBFbGV2YXRvciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBFbGV2YXRvcihpZCkge1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMuY3VycmVudEZsb29yID0gMDtcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSBFbGV2YXRvckRpcmVjdGlvbi5TdGFuZGluZztcbiAgICAgICAgdGhpcy5uZXh0RGlyZWN0aW9uID0gRWxldmF0b3JEaXJlY3Rpb24uU3RhbmRpbmc7XG4gICAgICAgIHRoaXMuZGVzdGluYXRpb25MaW1pdCA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xuICAgICAgICB0aGlzLnBhc3NlbmdlcnMgPSBbXTtcbiAgICB9XG4gICAgcmV0dXJuIEVsZXZhdG9yO1xufSgpKTtcbmV4cG9ydHMuRWxldmF0b3IgPSBFbGV2YXRvcjtcbnZhciBFbGV2YXRvclN5c3RlbSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoRWxldmF0b3JTeXN0ZW0sIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gRWxldmF0b3JTeXN0ZW0oKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xuICAgICAgICAvLyBpZCB0byBFbGV2YXRvclxuICAgICAgICBfdGhpcy5lbGV2YXRvcnMgPSBuZXcgTWFwKCk7XG4gICAgICAgIF90aGlzLndhaXRpbmdQYXNzZW5nZXJzID0gW107XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgRWxldmF0b3JTeXN0ZW0ucHJvdG90eXBlLmFkZE5ld0VsZXZhdG9yID0gZnVuY3Rpb24gKGluaXRpYWxGbG9vcikge1xuICAgICAgICB2YXIgaWQgPSB1dGlsXzEuZ2VuZXJhdGVVbmlxdWVJZCgpO1xuICAgICAgICB2YXIgb2JqID0gbmV3IEVsZXZhdG9yKGlkKTtcbiAgICAgICAgb2JqLmN1cnJlbnRGbG9vciA9ICtpbml0aWFsRmxvb3IgfHwgMDtcbiAgICAgICAgdGhpcy5lbGV2YXRvcnMuc2V0KGlkLCBvYmopO1xuICAgICAgICB0aGlzLmVtaXQoJ2VsZXZhdG9yLWFkZGVkJywgb2JqKTtcbiAgICB9O1xuICAgIEVsZXZhdG9yU3lzdGVtLnByb3RvdHlwZS5hZGROZXdQYXNzZW5nZXIgPSBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgdmFyIG5hbWUgPSBfYS5uYW1lLCBpbml0aWFsRmxvb3IgPSBfYS5pbml0aWFsRmxvb3IsIGRlc3RpbmF0aW9uRmxvb3IgPSBfYS5kZXN0aW5hdGlvbkZsb29yO1xuICAgICAgICBpZiAoaXNOYU4oaW5pdGlhbEZsb29yKSB8fCBpc05hTihkZXN0aW5hdGlvbkZsb29yKSlcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBwYXNzZW5nZXJzIHBhcmFtZXRlcnMnKTtcbiAgICAgICAgaWYgKGluaXRpYWxGbG9vciA9PT0gZGVzdGluYXRpb25GbG9vcilcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUGFzc2VuZ2VyIGlzIGFscmVhZHkgb24gdGhlIGRlc3RpbmF0aW9uIGZsb29yJyk7XG4gICAgICAgIHZhciBwYXNzZW5nZXIgPSB7XG4gICAgICAgICAgICBpZDogdXRpbF8xLmdlbmVyYXRlVW5pcXVlSWQoKSxcbiAgICAgICAgICAgIGRpcmVjdGlvbjogZGVzdGluYXRpb25GbG9vciA8IGluaXRpYWxGbG9vciA/IEVsZXZhdG9yRGlyZWN0aW9uLkdvaW5nRG93biA6IEVsZXZhdG9yRGlyZWN0aW9uLkdvaW5nVXAsXG4gICAgICAgICAgICBuYW1lOiBuYW1lLCBpbml0aWFsRmxvb3I6IGluaXRpYWxGbG9vciwgZGVzdGluYXRpb25GbG9vcjogZGVzdGluYXRpb25GbG9vclxuICAgICAgICB9O1xuICAgICAgICB0aGlzLndhaXRpbmdQYXNzZW5nZXJzLnVuc2hpZnQocGFzc2VuZ2VyKTtcbiAgICAgICAgdGhpcy5lbWl0KCd3YWl0aW5nLXBhc3Nlbmdlci1hZGRlZCcsIHBhc3Nlbmdlcik7XG4gICAgfTtcbiAgICBFbGV2YXRvclN5c3RlbS5wcm90b3R5cGUuY29tbWl0TmV4dFN0ZXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIGZvciAoY29uc3QgZWxldmF0b3Igb2YgdGhpcy5lbGV2YXRvcnMudmFsdWVzKCkpIHtcbiAgICAgICAgdmFyIGVfMSwgX2EsIGVfMiwgX2IsIGVfMywgX2MsIGVfNCwgX2QsIGVfNSwgX2UsIGVfNiwgX2Y7XG4gICAgICAgIC8vICAgICAgICAgdGhpcy5lbWl0KCdlbGV2YXRvci11cGRhdGVkJywgZWxldmF0b3IpXG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIHZhciBjaGFuZ2VkRWxldmF0b3JJZHMgPSBuZXcgU2V0KCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmb3IgKHZhciBfZyA9IF9fdmFsdWVzKHRoaXMuZWxldmF0b3JzLmtleXMoKSksIF9oID0gX2cubmV4dCgpOyAhX2guZG9uZTsgX2ggPSBfZy5uZXh0KCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgZWxldmF0b3IgPSBfaC52YWx1ZTtcbiAgICAgICAgICAgICAgICBjaGFuZ2VkRWxldmF0b3JJZHMuYWRkKGVsZXZhdG9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZV8xXzEpIHsgZV8xID0geyBlcnJvcjogZV8xXzEgfTsgfVxuICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKF9oICYmICFfaC5kb25lICYmIChfYSA9IF9nW1wicmV0dXJuXCJdKSkgX2EuY2FsbChfZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaW5hbGx5IHsgaWYgKGVfMSkgdGhyb3cgZV8xLmVycm9yOyB9XG4gICAgICAgIH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZvciAodmFyIF9qID0gX192YWx1ZXModGhpcy5lbGV2YXRvcnMudmFsdWVzKCkpLCBfayA9IF9qLm5leHQoKTsgIV9rLmRvbmU7IF9rID0gX2oubmV4dCgpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGVsZXZhdG9yID0gX2sudmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKGVsZXZhdG9yLmRpcmVjdGlvbiAhPT0gRWxldmF0b3JEaXJlY3Rpb24uU3RhbmRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gbW92ZSB0aGUgZWxldmF0b3JcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlZEVsZXZhdG9ySWRzLmFkZChlbGV2YXRvci5pZCk7XG4gICAgICAgICAgICAgICAgICAgIGVsZXZhdG9yLmN1cnJlbnRGbG9vciArPSBlbGV2YXRvci5kaXJlY3Rpb247XG4gICAgICAgICAgICAgICAgICAgIC8vIGRyb3AgcGFzc2VuZ2VycyB0aGF0IHdhbnRzIHRvIGJlIG9uIHRoaXMgZmxvb3JcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IGVsZXZhdG9yLnBhc3NlbmdlcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwYXNzZW5nZXIgPSBlbGV2YXRvci5wYXNzZW5nZXJzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhc3Nlbmdlci5kZXN0aW5hdGlvbkZsb29yID09PSBlbGV2YXRvci5jdXJyZW50Rmxvb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGV2YXRvci5wYXNzZW5nZXJzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ3Bhc3Nlbmdlci1kcm9wcGVkJywgeyBwYXNzZW5nZXI6IHBhc3NlbmdlciwgZWxldmF0b3I6IGVsZXZhdG9yIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBlbGV2YXRvciBpcyBhdCB0aGUgbGltaXQgZmxvb3IgdGhpcyBtZWFucyBpdCBuZWVkcyB0byBjaGFuZ2UgdGhlIGRpcmVjdGlvblxuICAgICAgICAgICAgICAgICAgICBpZiAoZWxldmF0b3IubmV4dERpcmVjdGlvbiAhPT0gRWxldmF0b3JEaXJlY3Rpb24uU3RhbmRpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIGVsZXZhdG9yLmN1cnJlbnRGbG9vciA9PT0gZWxldmF0b3IuZGVzdGluYXRpb25MaW1pdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxldmF0b3IuZGlyZWN0aW9uID0gZWxldmF0b3IubmV4dERpcmVjdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZXZhdG9yLm5leHREaXJlY3Rpb24gPSBFbGV2YXRvckRpcmVjdGlvbi5TdGFuZGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZXZhdG9yLmRlc3RpbmF0aW9uTGltaXQgPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUiAqIGVsZXZhdG9yLmRpcmVjdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChlbGV2YXRvci5wYXNzZW5nZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVsZXZhdG9yLm5leHREaXJlY3Rpb24gIT09IEVsZXZhdG9yRGlyZWN0aW9uLlN0YW5kaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZXZlbiB0aG91aCB0aGlzIGVsZXZhdG9yIGlzIGVtcHR5IGl0IG5lZWRzIHRvIGdvIHRoaXMgd2F5IGFueXdheVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbG9va3MgbGlrZSB0aGlzIGVsZXZhdG9yIGlzIGVtcHR5IG5vdywgY2hlY2sgaWYgdGhlcmUgaXMgYW55IHBhc3NlbmdlciBpbiB0aGlzIHdheSB0aGF0IHdhbnRzIHRvIGdvIHRoaXMgd2F5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlzU29tZW9uZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0bXAgPSBlbGV2YXRvci5jdXJyZW50Rmxvb3IgKiBlbGV2YXRvci5kaXJlY3Rpb247XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgX2wgPSAoZV8zID0gdm9pZCAwLCBfX3ZhbHVlcyh0aGlzLndhaXRpbmdQYXNzZW5nZXJzKSksIF9tID0gX2wubmV4dCgpOyAhX20uZG9uZTsgX20gPSBfbC5uZXh0KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwYXNzZW5nZXIgPSBfbS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXNzZW5nZXIuaW5pdGlhbEZsb29yICogZWxldmF0b3IuZGlyZWN0aW9uID49IHRtcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHBhc3Nlbmdlci5kaXJlY3Rpb24gPT09IGVsZXZhdG9yLmRpcmVjdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHBhc3Nlbmdlci5kZXN0aW5hdGlvbkZsb29yICogZWxldmF0b3IuZGlyZWN0aW9uIDw9IGVsZXZhdG9yLmRlc3RpbmF0aW9uTGltaXQgKiBlbGV2YXRvci5kaXJlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1NvbWVvbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGNoIChlXzNfMSkgeyBlXzMgPSB7IGVycm9yOiBlXzNfMSB9OyB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoX20gJiYgIV9tLmRvbmUgJiYgKF9jID0gX2xbXCJyZXR1cm5cIl0pKSBfYy5jYWxsKF9sKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaW5hbGx5IHsgaWYgKGVfMykgdGhyb3cgZV8zLmVycm9yOyB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNTb21lb25lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vaWYgbm90IHRoZW4gc3dpdGNoIGRpcmVjdGlvbiB0byBzdGFuZGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGV2YXRvci5kaXJlY3Rpb24gPSBFbGV2YXRvckRpcmVjdGlvbi5TdGFuZGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gdGFrZSBwYXNzZW5nZXJzIHRoYXQgd2FudCB0byBnbyB0aGlzIHdheSBhbmQgYXJlIG9uIHRoaXMgZmxvb3IgYW5kIHRoZXkgYXJlIHdpdGhpbiB0aGUgbGltaXRcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IHRoaXMud2FpdGluZ1Bhc3NlbmdlcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwYXNzZW5nZXIgPSB0aGlzLndhaXRpbmdQYXNzZW5nZXJzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhc3Nlbmdlci5pbml0aWFsRmxvb3IgPT09IGVsZXZhdG9yLmN1cnJlbnRGbG9vclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHBhc3Nlbmdlci5kaXJlY3Rpb24gPT09IGVsZXZhdG9yLmRpcmVjdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHBhc3Nlbmdlci5kZXN0aW5hdGlvbkZsb29yICogZWxldmF0b3IuZGlyZWN0aW9uIDwgZWxldmF0b3IuZGVzdGluYXRpb25MaW1pdCAqIGVsZXZhdG9yLmRpcmVjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZXZhdG9yLnBhc3NlbmdlcnMucHVzaChwYXNzZW5nZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud2FpdGluZ1Bhc3NlbmdlcnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgncGFzc2VuZ2VyLXRha2VuJywgeyBwYXNzZW5nZXI6IHBhc3NlbmdlciwgZWxldmF0b3I6IGVsZXZhdG9yIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlXzJfMSkgeyBlXzIgPSB7IGVycm9yOiBlXzJfMSB9OyB9XG4gICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBpZiAoX2sgJiYgIV9rLmRvbmUgJiYgKF9iID0gX2pbXCJyZXR1cm5cIl0pKSBfYi5jYWxsKF9qKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpbmFsbHkgeyBpZiAoZV8yKSB0aHJvdyBlXzIuZXJyb3I7IH1cbiAgICAgICAgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm9yICh2YXIgX28gPSBfX3ZhbHVlcyh0aGlzLmVsZXZhdG9ycy52YWx1ZXMoKSksIF9wID0gX28ubmV4dCgpOyAhX3AuZG9uZTsgX3AgPSBfby5uZXh0KCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgZWxldmF0b3IgPSBfcC52YWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAoZWxldmF0b3IuZGlyZWN0aW9uID09IEVsZXZhdG9yRGlyZWN0aW9uLlN0YW5kaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBfbG9vcF8xID0gZnVuY3Rpb24gKHBhc3Nlbmdlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVfNywgX3M7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjaGVjayBpZiB0aGVyZSBpcyBhbnkgZWxldmF0b3IgZ29pbmcgdG8gdGhhdCBwZXJzaW9uLCBvciB3aWxsIHRha2UgaXQgaW4gdGhlIG5lYXIgZnV0dXJlXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXNBbnkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgX3QgPSAoZV83ID0gdm9pZCAwLCBfX3ZhbHVlcyh0aGlzXzEuZWxldmF0b3JzLnZhbHVlcygpKSksIF91ID0gX3QubmV4dCgpOyAhX3UuZG9uZTsgX3UgPSBfdC5uZXh0KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG90aGVyRWxldmF0b3IgPSBfdS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChvdGhlckVsZXZhdG9yLmRpcmVjdGlvbiAhPT0gRWxldmF0b3JEaXJlY3Rpb24uU3RhbmRpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHBhc3Nlbmdlci5pbml0aWFsRmxvb3IgKiBvdGhlckVsZXZhdG9yLmRpcmVjdGlvbiA+IG90aGVyRWxldmF0b3IuY3VycmVudEZsb29yICogb3RoZXJFbGV2YXRvci5kaXJlY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHBhc3Nlbmdlci5kZXN0aW5hdGlvbkZsb29yICogZWxldmF0b3IuZGlyZWN0aW9uIDw9IG90aGVyRWxldmF0b3IuZGVzdGluYXRpb25MaW1pdCAqIG90aGVyRWxldmF0b3IuZGlyZWN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiBwYXNzZW5nZXIuZGlyZWN0aW9uID09PSBvdGhlckVsZXZhdG9yLmRpcmVjdGlvbilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IChvdGhlckVsZXZhdG9yLmRpcmVjdGlvbiAhPT0gRWxldmF0b3JEaXJlY3Rpb24uU3RhbmRpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiBvdGhlckVsZXZhdG9yLm5leHREaXJlY3Rpb24gIT09IEVsZXZhdG9yRGlyZWN0aW9uLlN0YW5kaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgcGFzc2VuZ2VyLmluaXRpYWxGbG9vciAqIG90aGVyRWxldmF0b3IuZGlyZWN0aW9uIDw9IG90aGVyRWxldmF0b3IuZGVzdGluYXRpb25MaW1pdCAqIG90aGVyRWxldmF0b3IuZGlyZWN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgcGFzc2VuZ2VyLmRpcmVjdGlvbiA9PT0gb3RoZXJFbGV2YXRvci5uZXh0RGlyZWN0aW9uKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNBbnkgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZV83XzEpIHsgZV83ID0geyBlcnJvcjogZV83XzEgfTsgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF91ICYmICFfdS5kb25lICYmIChfcyA9IF90W1wicmV0dXJuXCJdKSkgX3MuY2FsbChfdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsbHkgeyBpZiAoZV83KSB0aHJvdyBlXzcuZXJyb3I7IH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNBbnkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlbGV2YXRvci5pZCwgcGFzc2VuZ2VyLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZXJlIGFyZSBub25lLCB0aGVuIG1ha2UgdGhpcyBlbGV2YXRvciBnbyBmb3IgdGhhdCBwZXJzb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGV2YXRvci5kaXJlY3Rpb24gPSBNYXRoLnNpZ24ocGFzc2VuZ2VyLmluaXRpYWxGbG9vciAtIGVsZXZhdG9yLmN1cnJlbnRGbG9vcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxldmF0b3IubmV4dERpcmVjdGlvbiA9IE1hdGguc2lnbihwYXNzZW5nZXIuZGVzdGluYXRpb25GbG9vciAtIHBhc3Nlbmdlci5pbml0aWFsRmxvb3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbGV2YXRvci5uZXh0RGlyZWN0aW9uID09PSBlbGV2YXRvci5kaXJlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxldmF0b3IubmV4dERpcmVjdGlvbiA9IEVsZXZhdG9yRGlyZWN0aW9uLlN0YW5kaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGV2YXRvci5kZXN0aW5hdGlvbkxpbWl0ID0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIgKiBlbGV2YXRvci5kaXJlY3Rpb247XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpdCdzIGdvb2QgaWRlYSB0byBmaW5kIGEgcGVyc29uIHRoYXQgaXMgb24gbG93ZXN0L2hlaWdoZXN0IGZsb29yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsaW1pdF8xID0gcGFzc2VuZ2VyLmluaXRpYWxGbG9vcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc18xLndhaXRpbmdQYXNzZW5nZXJzLmZvckVhY2goKGVsZXZhdG9yLmRpcmVjdGlvbiA9PT0gRWxldmF0b3JEaXJlY3Rpb24uR29pbmdVcCkgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHApIHsgaWYgKHAuaW5pdGlhbEZsb29yID4gbGltaXRfMSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW1pdF8xID0gcC5pbml0aWFsRmxvb3I7IH0gOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHApIHsgaWYgKHAuaW5pdGlhbEZsb29yIDwgbGltaXRfMSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW1pdF8xID0gcC5pbml0aWFsRmxvb3I7IH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGV2YXRvci5kZXN0aW5hdGlvbkxpbWl0ID0gbGltaXRfMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlZEVsZXZhdG9ySWRzLmFkZChlbGV2YXRvci5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiYnJlYWtcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRoaXNfMSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBmaW5kIGEgZGlyZWN0aW9uIHRvIGdvIHRvXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBfcSA9IChlXzUgPSB2b2lkIDAsIF9fdmFsdWVzKHRoaXMud2FpdGluZ1Bhc3NlbmdlcnMpKSwgX3IgPSBfcS5uZXh0KCk7ICFfci5kb25lOyBfciA9IF9xLm5leHQoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwYXNzZW5nZXIgPSBfci52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RhdGVfMSA9IF9sb29wXzEocGFzc2VuZ2VyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdGVfMSA9PT0gXCJicmVha1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZV81XzEpIHsgZV81ID0geyBlcnJvcjogZV81XzEgfTsgfVxuICAgICAgICAgICAgICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF9yICYmICFfci5kb25lICYmIChfZSA9IF9xW1wicmV0dXJuXCJdKSkgX2UuY2FsbChfcSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBmaW5hbGx5IHsgaWYgKGVfNSkgdGhyb3cgZV81LmVycm9yOyB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVfNF8xKSB7IGVfNCA9IHsgZXJyb3I6IGVfNF8xIH07IH1cbiAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlmIChfcCAmJiAhX3AuZG9uZSAmJiAoX2QgPSBfb1tcInJldHVyblwiXSkpIF9kLmNhbGwoX28pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmluYWxseSB7IGlmIChlXzQpIHRocm93IGVfNC5lcnJvcjsgfVxuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmb3IgKHZhciBjaGFuZ2VkRWxldmF0b3JJZHNfMSA9IF9fdmFsdWVzKGNoYW5nZWRFbGV2YXRvcklkcyksIGNoYW5nZWRFbGV2YXRvcklkc18xXzEgPSBjaGFuZ2VkRWxldmF0b3JJZHNfMS5uZXh0KCk7ICFjaGFuZ2VkRWxldmF0b3JJZHNfMV8xLmRvbmU7IGNoYW5nZWRFbGV2YXRvcklkc18xXzEgPSBjaGFuZ2VkRWxldmF0b3JJZHNfMS5uZXh0KCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBjaGFuZ2VkRWxldmF0b3JJZHNfMV8xLnZhbHVlO1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnZWxldmF0b3ItdXBkYXRlZCcsIHRoaXMuZWxldmF0b3JzLmdldChpZCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlXzZfMSkgeyBlXzYgPSB7IGVycm9yOiBlXzZfMSB9OyB9XG4gICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBpZiAoY2hhbmdlZEVsZXZhdG9ySWRzXzFfMSAmJiAhY2hhbmdlZEVsZXZhdG9ySWRzXzFfMS5kb25lICYmIChfZiA9IGNoYW5nZWRFbGV2YXRvcklkc18xW1wicmV0dXJuXCJdKSkgX2YuY2FsbChjaGFuZ2VkRWxldmF0b3JJZHNfMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaW5hbGx5IHsgaWYgKGVfNikgdGhyb3cgZV82LmVycm9yOyB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBFbGV2YXRvclN5c3RlbTtcbn0oZXZlbnRfcHJvZHVjZXJfMVtcImRlZmF1bHRcIl0pKTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gRWxldmF0b3JTeXN0ZW07XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX3ZhbHVlcyA9ICh0aGlzICYmIHRoaXMuX192YWx1ZXMpIHx8IGZ1bmN0aW9uKG8pIHtcbiAgICB2YXIgcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuaXRlcmF0b3IsIG0gPSBzICYmIG9bc10sIGkgPSAwO1xuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xuICAgIGlmIChvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHtcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihzID8gXCJPYmplY3QgaXMgbm90IGl0ZXJhYmxlLlwiIDogXCJTeW1ib2wuaXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xufTtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG52YXIgRXZlbnRQcm9kdWNlciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBFdmVudFByb2R1Y2VyKCkge1xuICAgICAgICB0aGlzLmxpc3RlbmVycyA9IG5ldyBNYXAoKTtcbiAgICB9XG4gICAgRXZlbnRQcm9kdWNlci5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uICh0eXBlLCBsaXN0ZW5lcikge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHZhciBsaXN0ID0gKF9hID0gdGhpcy5saXN0ZW5lcnMuZ2V0KHR5cGUpKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBbXTtcbiAgICAgICAgbGlzdC5wdXNoKGxpc3RlbmVyKTtcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMuc2V0KHR5cGUsIGxpc3QpO1xuICAgIH07XG4gICAgRXZlbnRQcm9kdWNlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uICh0eXBlLCBldmVudCkge1xuICAgICAgICB2YXIgZV8xLCBfYTtcbiAgICAgICAgdmFyIF9iO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm9yICh2YXIgX2MgPSBfX3ZhbHVlcygoKF9iID0gdGhpcy5saXN0ZW5lcnMuZ2V0KHR5cGUpKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBbXSkpLCBfZCA9IF9jLm5leHQoKTsgIV9kLmRvbmU7IF9kID0gX2MubmV4dCgpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGwgPSBfZC52YWx1ZTtcbiAgICAgICAgICAgICAgICBsKGV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZV8xXzEpIHsgZV8xID0geyBlcnJvcjogZV8xXzEgfTsgfVxuICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKF9kICYmICFfZC5kb25lICYmIChfYSA9IF9jW1wicmV0dXJuXCJdKSkgX2EuY2FsbChfYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaW5hbGx5IHsgaWYgKGVfMSkgdGhyb3cgZV8xLmVycm9yOyB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBFdmVudFByb2R1Y2VyO1xufSgpKTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gRXZlbnRQcm9kdWNlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuZ2VuZXJhdGVVbmlxdWVJZCA9IHZvaWQgMDtcbnZhciBuZXh0SWQgPSAxO1xudmFyIGdlbmVyYXRlVW5pcXVlSWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG5leHRJZCsrO1xufTtcbmV4cG9ydHMuZ2VuZXJhdGVVbmlxdWVJZCA9IGdlbmVyYXRlVW5pcXVlSWQ7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xudmFyIGVsZXZhdG9yX3N5c3RlbV8xID0gcmVxdWlyZShcIi4vZWxldmF0b3Itc3lzdGVtXCIpO1xuLy8gc2hvdyBtYWluIGJveCB3aGVuIEpTIGlzIGVuYWJsZWRcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21haW4nKS5zdHlsZS5kaXNwbGF5ID0gbnVsbDtcbnZhciBzeXN0ZW0gPSBuZXcgZWxldmF0b3Jfc3lzdGVtXzFbXCJkZWZhdWx0XCJdKCk7XG4vLyB3aW5kb3cuc3lzdGVtID0gc3lzdGVtXG52YXIgZWxldmF0b3JzTGlzdERpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlbGV2YXRvcnMtbGlzdCcpO1xudmFyIHdhaXRpbmdQYXNzZW5nZXJzTGlzdERpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3YWl0aW5nLXBhc3NlbmdlcnMtbGlzdCcpO1xudmFyIGZvcm1hdERpcmVjdGlvbiA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICBzd2l0Y2ggKGRpcikge1xuICAgICAgICBjYXNlIGVsZXZhdG9yX3N5c3RlbV8xLkVsZXZhdG9yRGlyZWN0aW9uLkdvaW5nVXA6IHJldHVybiAnR29pbmcgdXAnO1xuICAgICAgICBjYXNlIGVsZXZhdG9yX3N5c3RlbV8xLkVsZXZhdG9yRGlyZWN0aW9uLkdvaW5nRG93bjogcmV0dXJuICdHb2luZyBkb3duJztcbiAgICAgICAgY2FzZSBlbGV2YXRvcl9zeXN0ZW1fMS5FbGV2YXRvckRpcmVjdGlvbi5TdGFuZGluZzogcmV0dXJuICdTdGFuZGluZyBzdGlsbCc7XG4gICAgfVxufTtcbi8vIERPTSBldmVudHM6XG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWRkLWVsZXZhdG9yLWJ0bicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkgeyByZXR1cm4gc3lzdGVtLmFkZE5ld0VsZXZhdG9yKCk7IH0pO1xuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FkZC1wYXNzZW5nZXItYnRuJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgc3lzdGVtLmFkZE5ld1Bhc3Nlbmdlcih7XG4gICAgICAgIG5hbWU6IHByb21wdCgnR2l2ZSBhIHBhc3NlbmdlciBuYW1lJywgJycpIHx8ICcnLFxuICAgICAgICBpbml0aWFsRmxvb3I6ICtwcm9tcHQoJ1RoYXQgZmxvb3IgaXMgdGhhdCBwYXNzZW5nZXIgb24/JyksXG4gICAgICAgIGRlc3RpbmF0aW9uRmxvb3I6ICtwcm9tcHQoJ1RoYXQgZmxvb3IgaXMgdGhhdCBwYXNzZW5nZXIgZ29pbmcgdG8gZ28/JyksXG4gICAgfSk7XG59KTtcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXh0LXN0ZXAtYnRuJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7IHJldHVybiBzeXN0ZW0uY29tbWl0TmV4dFN0ZXAoKTsgfSk7XG4vLyBzeXN0ZW0gZXZlbnRzXG5zeXN0ZW0uYWRkRXZlbnRMaXN0ZW5lcignZWxldmF0b3ItYWRkZWQnLCBmdW5jdGlvbiAoZWxldmF0b3IpIHtcbiAgICB2YXIgZWxldmF0b3JEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBlbGV2YXRvckRpdi5pZCA9IFwiZWxldmF0b3ItaWQtXCIgKyBlbGV2YXRvci5pZDtcbiAgICBlbGV2YXRvckRpdi5jbGFzc0xpc3QuYWRkKCdlbGV2YXRvcicpO1xuICAgIHtcbiAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2VsZXZhdG9yLWlkLXZhbHVlJyk7XG4gICAgICAgIGVsLmlubmVyVGV4dCA9IFwiXCIgKyBlbGV2YXRvci5pZDtcbiAgICAgICAgZWxldmF0b3JEaXYuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIH1cbiAgICB7XG4gICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKCdlbGV2YXRvci1pZC10aXRsZScpO1xuICAgICAgICBlbC5pbm5lclRleHQgPSBcIkVsZXZhdG9yIElEXCI7XG4gICAgICAgIGVsZXZhdG9yRGl2LmFwcGVuZENoaWxkKGVsKTtcbiAgICB9XG4gICAge1xuICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZWwuY2xhc3NMaXN0LmFkZCgnY3VycmVudC1mbG9vci12YWx1ZScpO1xuICAgICAgICBlbC5pbm5lclRleHQgPSBcIlwiICsgZWxldmF0b3IuY3VycmVudEZsb29yO1xuICAgICAgICBlbGV2YXRvckRpdi5hcHBlbmRDaGlsZChlbCk7XG4gICAgfVxuICAgIHtcbiAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGVsLmlubmVyVGV4dCA9IFwiQ3VycmVudCBmbG9vclwiO1xuICAgICAgICBlbGV2YXRvckRpdi5hcHBlbmRDaGlsZChlbCk7XG4gICAgfVxuICAgIHtcbiAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2RpcmVjdGlvbi12YWx1ZScpO1xuICAgICAgICBlbC5pbm5lclRleHQgPSBcIlwiICsgZm9ybWF0RGlyZWN0aW9uKGVsZXZhdG9yLmRpcmVjdGlvbik7XG4gICAgICAgIGVsZXZhdG9yRGl2LmFwcGVuZENoaWxkKGVsKTtcbiAgICB9XG4gICAge1xuICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZWwuaW5uZXJUZXh0ID0gXCJEaXJlY3Rpb25cIjtcbiAgICAgICAgZWxldmF0b3JEaXYuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIH1cbiAgICAvLyB7XG4gICAgLy8gICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAvLyAgICAgZWwuY2xhc3NMaXN0LmFkZCgnbGltaXQtZmxvb3ItdmFsdWUnKVxuICAgIC8vICAgICBlbC5pbm5lclRleHQgPSBgJHtlbGV2YXRvci5kZXN0aW5hdGlvbkxpbWl0fWBcbiAgICAvLyAgICAgZWxldmF0b3JEaXYuYXBwZW5kQ2hpbGQoZWwpXG4gICAgLy8gfVxuICAgIC8vIHtcbiAgICAvLyAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIC8vICAgICBlbC5pbm5lclRleHQgPSBgRmxvb3IgbGltaXRgXG4gICAgLy8gICAgIGVsZXZhdG9yRGl2LmFwcGVuZENoaWxkKGVsKVxuICAgIC8vIH1cbiAgICAvLyB7XG4gICAgLy8gICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAvLyAgICAgZWwuY2xhc3NMaXN0LmFkZCgnbmV4dC1kaXJlY3Rpb24tdmFsdWUnKVxuICAgIC8vICAgICBlbC5pbm5lclRleHQgPSBgJHtmb3JtYXREaXJlY3Rpb24oZWxldmF0b3IubmV4dERpcmVjdGlvbil9YFxuICAgIC8vICAgICBlbGV2YXRvckRpdi5hcHBlbmRDaGlsZChlbClcbiAgICAvLyB9XG4gICAgLy8ge1xuICAgIC8vICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgLy8gICAgIGVsLmlubmVyVGV4dCA9IGBOZXh0IGRpcmVjdGlvbmBcbiAgICAvLyAgICAgZWxldmF0b3JEaXYuYXBwZW5kQ2hpbGQoZWwpXG4gICAgLy8gfVxuICAgIHtcbiAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoJ3Bhc3NlbmdlcnMtaW5zaWRlLWxpc3QnKTtcbiAgICAgICAgZWxldmF0b3JEaXYuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIH1cbiAgICBlbGV2YXRvcnNMaXN0RGl2LmFwcGVuZENoaWxkKGVsZXZhdG9yRGl2KTtcbn0pO1xuc3lzdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2VsZXZhdG9yLXVwZGF0ZWQnLCBmdW5jdGlvbiAoZWxldmF0b3IpIHtcbiAgICB2YXIgZWxldmF0b3JEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVsZXZhdG9yLWlkLVwiICsgZWxldmF0b3IuaWQpO1xuICAgIGVsZXZhdG9yRGl2LnF1ZXJ5U2VsZWN0b3IoJy5jdXJyZW50LWZsb29yLXZhbHVlJykuaW5uZXJUZXh0ID0gXCJcIiArIGVsZXZhdG9yLmN1cnJlbnRGbG9vcjtcbiAgICBlbGV2YXRvckRpdi5xdWVyeVNlbGVjdG9yKCcuZGlyZWN0aW9uLXZhbHVlJykuaW5uZXJUZXh0ID0gXCJcIiArIGZvcm1hdERpcmVjdGlvbihlbGV2YXRvci5kaXJlY3Rpb24pO1xuICAgIC8vIChlbGV2YXRvckRpdi5xdWVyeVNlbGVjdG9yKCcubGltaXQtZmxvb3ItdmFsdWUnKSBhcyBIVE1MRGl2RWxlbWVudCkuaW5uZXJUZXh0ID0gYCR7ZWxldmF0b3IuZGVzdGluYXRpb25MaW1pdH1gO1xuICAgIC8vIChlbGV2YXRvckRpdi5xdWVyeVNlbGVjdG9yKCcubmV4dC1kaXJlY3Rpb24tdmFsdWUnKSBhcyBIVE1MRGl2RWxlbWVudCkuaW5uZXJUZXh0ID0gYCR7Zm9ybWF0RGlyZWN0aW9uKGVsZXZhdG9yLm5leHREaXJlY3Rpb24pfWA7XG59KTtcbnN5c3RlbS5hZGRFdmVudExpc3RlbmVyKCd3YWl0aW5nLXBhc3Nlbmdlci1hZGRlZCcsIGZ1bmN0aW9uIChwYXNzZW5nZXIpIHtcbiAgICB2YXIgZWxldmF0b3JEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBlbGV2YXRvckRpdi5pZCA9IFwid2FpdGluZy1wYXNzZW5nZXItaWQtXCIgKyBwYXNzZW5nZXIuaWQ7XG4gICAgZWxldmF0b3JEaXYuY2xhc3NMaXN0LmFkZCgnd2FpdGluZy1wYXNzZW5nZXInKTtcbiAgICB7XG4gICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBlbC5pbm5lclRleHQgPSBcIlwiICsgcGFzc2VuZ2VyLm5hbWU7XG4gICAgICAgIGVsZXZhdG9yRGl2LmFwcGVuZENoaWxkKGVsKTtcbiAgICB9XG4gICAge1xuICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZWwuaW5uZXJUZXh0ID0gXCJOYW1lXCI7XG4gICAgICAgIGVsZXZhdG9yRGl2LmFwcGVuZENoaWxkKGVsKTtcbiAgICB9XG4gICAge1xuICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZWwuaW5uZXJUZXh0ID0gXCJcIiArIHBhc3Nlbmdlci5pbml0aWFsRmxvb3I7XG4gICAgICAgIGVsZXZhdG9yRGl2LmFwcGVuZENoaWxkKGVsKTtcbiAgICB9XG4gICAge1xuICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZWwuaW5uZXJUZXh0ID0gXCJXYWl0aW5nIGF0XCI7XG4gICAgICAgIGVsZXZhdG9yRGl2LmFwcGVuZENoaWxkKGVsKTtcbiAgICB9XG4gICAge1xuICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZWwuaW5uZXJUZXh0ID0gXCJcIiArIHBhc3Nlbmdlci5kZXN0aW5hdGlvbkZsb29yO1xuICAgICAgICBlbGV2YXRvckRpdi5hcHBlbmRDaGlsZChlbCk7XG4gICAgfVxuICAgIHtcbiAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGVsLmlubmVyVGV4dCA9IFwiRGVzdGluYXRpb24gZmxvb3JcIjtcbiAgICAgICAgZWxldmF0b3JEaXYuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIH1cbiAgICB3YWl0aW5nUGFzc2VuZ2Vyc0xpc3REaXYuYXBwZW5kQ2hpbGQoZWxldmF0b3JEaXYpO1xufSk7XG5zeXN0ZW0uYWRkRXZlbnRMaXN0ZW5lcigncGFzc2VuZ2VyLXRha2VuJywgZnVuY3Rpb24gKF9hKSB7XG4gICAgdmFyIHBhc3NlbmdlciA9IF9hLnBhc3NlbmdlciwgZWxldmF0b3IgPSBfYS5lbGV2YXRvcjtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndhaXRpbmctcGFzc2VuZ2VyLWlkLVwiICsgcGFzc2VuZ2VyLmlkKS5yZW1vdmUoKTtcbiAgICB2YXIgbGlzdE9mSW5zaWRlcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2VsZXZhdG9yLWlkLVwiICsgZWxldmF0b3IuaWQgKyBcIiAucGFzc2VuZ2Vycy1pbnNpZGUtbGlzdFwiKTtcbiAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBlbC5pZCA9IFwicGFzc2VuZ2VyX1wiICsgcGFzc2VuZ2VyLmlkO1xuICAgIGVsLmNsYXNzTGlzdC5hZGQoJ3Bhc3Nlbmdlci1pbnNpZGUnKTtcbiAgICBlbC5pbm5lclRleHQgPSBcIlwiICsgcGFzc2VuZ2VyLm5hbWU7XG4gICAgbGlzdE9mSW5zaWRlcnMuYXBwZW5kQ2hpbGQoZWwpO1xufSk7XG5zeXN0ZW0uYWRkRXZlbnRMaXN0ZW5lcigncGFzc2VuZ2VyLWRyb3BwZWQnLCBmdW5jdGlvbiAoX2EpIHtcbiAgICB2YXIgcGFzc2VuZ2VyID0gX2EucGFzc2VuZ2VyLCBlbGV2YXRvciA9IF9hLmVsZXZhdG9yO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZWxldmF0b3ItaWQtXCIgKyBlbGV2YXRvci5pZCArIFwiICNwYXNzZW5nZXJfXCIgKyBwYXNzZW5nZXIuaWQpLnJlbW92ZSgpO1xufSk7XG5zeXN0ZW0uYWRkTmV3RWxldmF0b3IoKTtcbnN5c3RlbS5hZGROZXdFbGV2YXRvcigpO1xuc3lzdGVtLmFkZE5ld1Bhc3Nlbmdlcih7XG4gICAgbmFtZTogJ0pha3ViJywgaW5pdGlhbEZsb29yOiAyLCBkZXN0aW5hdGlvbkZsb29yOiA0XG59KTtcbnN5c3RlbS5hZGROZXdQYXNzZW5nZXIoe1xuICAgIG5hbWU6ICdQYXdlxYInLCBpbml0aWFsRmxvb3I6IDYsIGRlc3RpbmF0aW9uRmxvb3I6IDNcbn0pO1xuc3lzdGVtLmFkZE5ld1Bhc3Nlbmdlcih7XG4gICAgbmFtZTogJ1Bpb3RyJywgaW5pdGlhbEZsb29yOiA3LCBkZXN0aW5hdGlvbkZsb29yOiAzXG59KTtcbiJdLCJzb3VyY2VSb290IjoiIn0=