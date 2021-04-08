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
exports.__esModule = true;
exports.Elevator = void 0;
var event_producer_1 = __webpack_require__(/*! ./event-producer */ "./src/event-producer.ts");
var Elevator = /** @class */ (function () {
    function Elevator(id) {
        this.id = id;
        this.currentFloor = 0;
        this.destinationFloor = 0;
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
    return ElevatorSystem;
}(event_producer_1["default"]));
exports.default = ElevatorSystem;


/***/ }),

/***/ "./src/event-producer.ts":
/*!*******************************!*\
  !*** ./src/event-producer.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {


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
        var _a;
        for (var _i = 0, _b = ((_a = this.listeners.get(type)) !== null && _a !== void 0 ? _a : []); _i < _b.length; _i++) {
            var l = _b[_i];
            l(event);
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
// system events
system.addEventListener('elevator-added', function (elevator) {
    var elevatorDiv = document.createElement('div');
    elevatorDiv.id = "elevator_id_" + elevator.id;
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
        el.classList.add('current-floor-title');
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
        el.classList.add('destination-floor-title');
        el.innerText = "Destination floor";
        elevatorDiv.appendChild(el);
    }
    elevatorsListDiv.appendChild(elevatorDiv);
});
system.addEventListener('waiting-passenger-added', function (passenger) {
    var elevatorDiv = document.createElement('div');
    elevatorDiv.id = "waiting_passenger_id_" + passenger.id;
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
system.addNewElevator();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWItZWxldmF0b3JzLy4vc3JjL2VsZXZhdG9yLXN5c3RlbS50cyIsIndlYnBhY2s6Ly93ZWItZWxldmF0b3JzLy4vc3JjL2V2ZW50LXByb2R1Y2VyLnRzIiwid2VicGFjazovL3dlYi1lbGV2YXRvcnMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vd2ViLWVsZXZhdG9ycy8uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGNBQWMsZ0JBQWdCLHNDQUFzQyxpQkFBaUIsRUFBRTtBQUN2Riw2QkFBNkIsOEVBQThFO0FBQzNHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixzQkFBc0I7QUFDN0M7QUFDQTtBQUNBLENBQUM7QUFDRCxrQkFBa0I7QUFDbEIsZ0JBQWdCO0FBQ2hCLHVCQUF1QixtQkFBTyxDQUFDLGlEQUFrQjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxlQUFrQjs7Ozs7Ozs7Ozs7QUMxREw7QUFDYixrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0dBQW9HLGdCQUFnQjtBQUNwSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELGVBQWtCOzs7Ozs7O1VDckJsQjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7Ozs7Ozs7O0FDdEJhO0FBQ2Isa0JBQWtCO0FBQ2xCLHdCQUF3QixtQkFBTyxDQUFDLG1EQUFtQjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtRkFBbUYsZ0NBQWdDLEVBQUU7QUFDckg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBLENBQUMiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xuICAgICAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xuICAgIH07XG59KSgpO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuRWxldmF0b3IgPSB2b2lkIDA7XG52YXIgZXZlbnRfcHJvZHVjZXJfMSA9IHJlcXVpcmUoXCIuL2V2ZW50LXByb2R1Y2VyXCIpO1xudmFyIEVsZXZhdG9yID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEVsZXZhdG9yKGlkKSB7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5jdXJyZW50Rmxvb3IgPSAwO1xuICAgICAgICB0aGlzLmRlc3RpbmF0aW9uRmxvb3IgPSAwO1xuICAgIH1cbiAgICByZXR1cm4gRWxldmF0b3I7XG59KCkpO1xuZXhwb3J0cy5FbGV2YXRvciA9IEVsZXZhdG9yO1xudmFyIEVsZXZhdG9yU3lzdGVtID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhFbGV2YXRvclN5c3RlbSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBFbGV2YXRvclN5c3RlbSgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XG4gICAgICAgIC8vIGlkIHRvIEVsZXZhdG9yXG4gICAgICAgIF90aGlzLmVsZXZhdG9ycyA9IG5ldyBNYXAoKTtcbiAgICAgICAgX3RoaXMud2FpdGluZ1Bhc3NlbmdlcnMgPSBbXTtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICBFbGV2YXRvclN5c3RlbS5wcm90b3R5cGUuYWRkTmV3RWxldmF0b3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBpZCA9IE1hdGgucmFuZG9tKCkgKiAxMDAwMDAwIHwgMDtcbiAgICAgICAgaWYgKHRoaXMuZWxldmF0b3JzLmhhcyhpZCkpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hZGROZXdFbGV2YXRvcigpO1xuICAgICAgICB2YXIgb2JqID0gbmV3IEVsZXZhdG9yKGlkKTtcbiAgICAgICAgdGhpcy5lbGV2YXRvcnMuc2V0KGlkLCBvYmopO1xuICAgICAgICB0aGlzLmVtaXQoJ2VsZXZhdG9yLWFkZGVkJywgb2JqKTtcbiAgICB9O1xuICAgIEVsZXZhdG9yU3lzdGVtLnByb3RvdHlwZS5hZGROZXdQYXNzZW5nZXIgPSBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgdmFyIG5hbWUgPSBfYS5uYW1lLCBpbml0aWFsRmxvb3IgPSBfYS5pbml0aWFsRmxvb3IsIGRlc3RpbmF0aW9uRmxvb3IgPSBfYS5kZXN0aW5hdGlvbkZsb29yO1xuICAgICAgICBpZiAoaXNOYU4oaW5pdGlhbEZsb29yKSB8fCBpc05hTihkZXN0aW5hdGlvbkZsb29yKSlcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBwYXNzZW5nZXJzIHBhcmFtZXRlcnMnKTtcbiAgICAgICAgdmFyIHBhc3NlbmdlciA9IHtcbiAgICAgICAgICAgIGlkOiBNYXRoLnJhbmRvbSgpICogMTAwMDAwMCB8IDAsXG4gICAgICAgICAgICBuYW1lOiBuYW1lLCBpbml0aWFsRmxvb3I6IGluaXRpYWxGbG9vciwgZGVzdGluYXRpb25GbG9vcjogZGVzdGluYXRpb25GbG9vclxuICAgICAgICB9O1xuICAgICAgICB0aGlzLndhaXRpbmdQYXNzZW5nZXJzLnB1c2gocGFzc2VuZ2VyKTtcbiAgICAgICAgdGhpcy5lbWl0KCd3YWl0aW5nLXBhc3Nlbmdlci1hZGRlZCcsIHBhc3Nlbmdlcik7XG4gICAgfTtcbiAgICByZXR1cm4gRWxldmF0b3JTeXN0ZW07XG59KGV2ZW50X3Byb2R1Y2VyXzFbXCJkZWZhdWx0XCJdKSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IEVsZXZhdG9yU3lzdGVtO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xudmFyIEV2ZW50UHJvZHVjZXIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gRXZlbnRQcm9kdWNlcigpIHtcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSBuZXcgTWFwKCk7XG4gICAgfVxuICAgIEV2ZW50UHJvZHVjZXIucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbiAodHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICB2YXIgbGlzdCA9IChfYSA9IHRoaXMubGlzdGVuZXJzLmdldCh0eXBlKSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogW107XG4gICAgICAgIGxpc3QucHVzaChsaXN0ZW5lcik7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzLnNldCh0eXBlLCBsaXN0KTtcbiAgICB9O1xuICAgIEV2ZW50UHJvZHVjZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbiAodHlwZSwgZXZlbnQpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIF9iID0gKChfYSA9IHRoaXMubGlzdGVuZXJzLmdldCh0eXBlKSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogW10pOyBfaSA8IF9iLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgdmFyIGwgPSBfYltfaV07XG4gICAgICAgICAgICBsKGV2ZW50KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIEV2ZW50UHJvZHVjZXI7XG59KCkpO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBFdmVudFByb2R1Y2VyO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIlwidXNlIHN0cmljdFwiO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbnZhciBlbGV2YXRvcl9zeXN0ZW1fMSA9IHJlcXVpcmUoXCIuL2VsZXZhdG9yLXN5c3RlbVwiKTtcbi8vIHNob3cgbWFpbiBib3ggd2hlbiBKUyBpcyBlbmFibGVkXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtYWluJykuc3R5bGUuZGlzcGxheSA9IG51bGw7XG52YXIgc3lzdGVtID0gbmV3IGVsZXZhdG9yX3N5c3RlbV8xW1wiZGVmYXVsdFwiXSgpO1xudmFyIGVsZXZhdG9yc0xpc3REaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZWxldmF0b3JzLWxpc3QnKTtcbnZhciB3YWl0aW5nUGFzc2VuZ2Vyc0xpc3REaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd2FpdGluZy1wYXNzZW5nZXJzLWxpc3QnKTtcbi8vIERPTSBldmVudHM6XG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWRkLWVsZXZhdG9yLWJ0bicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkgeyByZXR1cm4gc3lzdGVtLmFkZE5ld0VsZXZhdG9yKCk7IH0pO1xuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FkZC1wYXNzZW5nZXItYnRuJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgc3lzdGVtLmFkZE5ld1Bhc3Nlbmdlcih7XG4gICAgICAgIG5hbWU6IHByb21wdCgnR2l2ZSBhIHBhc3NlbmdlciBuYW1lJywgJycpIHx8ICcnLFxuICAgICAgICBpbml0aWFsRmxvb3I6ICtwcm9tcHQoJ1RoYXQgZmxvb3IgaXMgdGhhdCBwYXNzZW5nZXIgb24/JyksXG4gICAgICAgIGRlc3RpbmF0aW9uRmxvb3I6ICtwcm9tcHQoJ1RoYXQgZmxvb3IgaXMgdGhhdCBwYXNzZW5nZXIgZ29pbmcgdG8gZ28/JyksXG4gICAgfSk7XG59KTtcbi8vIHN5c3RlbSBldmVudHNcbnN5c3RlbS5hZGRFdmVudExpc3RlbmVyKCdlbGV2YXRvci1hZGRlZCcsIGZ1bmN0aW9uIChlbGV2YXRvcikge1xuICAgIHZhciBlbGV2YXRvckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGVsZXZhdG9yRGl2LmlkID0gXCJlbGV2YXRvcl9pZF9cIiArIGVsZXZhdG9yLmlkO1xuICAgIGVsZXZhdG9yRGl2LmNsYXNzTGlzdC5hZGQoJ2VsZXZhdG9yJyk7XG4gICAge1xuICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZWwuY2xhc3NMaXN0LmFkZCgnZWxldmF0b3ItaWQtdmFsdWUnKTtcbiAgICAgICAgZWwuaW5uZXJUZXh0ID0gXCJcIiArIGVsZXZhdG9yLmlkO1xuICAgICAgICBlbGV2YXRvckRpdi5hcHBlbmRDaGlsZChlbCk7XG4gICAgfVxuICAgIHtcbiAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2VsZXZhdG9yLWlkLXRpdGxlJyk7XG4gICAgICAgIGVsLmlubmVyVGV4dCA9IFwiRWxldmF0b3IgSURcIjtcbiAgICAgICAgZWxldmF0b3JEaXYuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIH1cbiAgICB7XG4gICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKCdjdXJyZW50LWZsb29yLXZhbHVlJyk7XG4gICAgICAgIGVsLmlubmVyVGV4dCA9IFwiXCIgKyBlbGV2YXRvci5jdXJyZW50Rmxvb3I7XG4gICAgICAgIGVsZXZhdG9yRGl2LmFwcGVuZENoaWxkKGVsKTtcbiAgICB9XG4gICAge1xuICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZWwuY2xhc3NMaXN0LmFkZCgnY3VycmVudC1mbG9vci10aXRsZScpO1xuICAgICAgICBlbC5pbm5lclRleHQgPSBcIkN1cnJlbnQgZmxvb3JcIjtcbiAgICAgICAgZWxldmF0b3JEaXYuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIH1cbiAgICB7XG4gICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKCdkZXN0aW5hdGlvbi1mbG9vci12YWx1ZScpO1xuICAgICAgICBlbC5pbm5lclRleHQgPSBcIlwiICsgZWxldmF0b3IuZGVzdGluYXRpb25GbG9vcjtcbiAgICAgICAgZWxldmF0b3JEaXYuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIH1cbiAgICB7XG4gICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKCdkZXN0aW5hdGlvbi1mbG9vci10aXRsZScpO1xuICAgICAgICBlbC5pbm5lclRleHQgPSBcIkRlc3RpbmF0aW9uIGZsb29yXCI7XG4gICAgICAgIGVsZXZhdG9yRGl2LmFwcGVuZENoaWxkKGVsKTtcbiAgICB9XG4gICAgZWxldmF0b3JzTGlzdERpdi5hcHBlbmRDaGlsZChlbGV2YXRvckRpdik7XG59KTtcbnN5c3RlbS5hZGRFdmVudExpc3RlbmVyKCd3YWl0aW5nLXBhc3Nlbmdlci1hZGRlZCcsIGZ1bmN0aW9uIChwYXNzZW5nZXIpIHtcbiAgICB2YXIgZWxldmF0b3JEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBlbGV2YXRvckRpdi5pZCA9IFwid2FpdGluZ19wYXNzZW5nZXJfaWRfXCIgKyBwYXNzZW5nZXIuaWQ7XG4gICAgZWxldmF0b3JEaXYuY2xhc3NMaXN0LmFkZCgnd2FpdGluZy1wYXNzZW5nZXInKTtcbiAgICB7XG4gICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBlbC5pbm5lclRleHQgPSBcIlwiICsgcGFzc2VuZ2VyLm5hbWU7XG4gICAgICAgIGVsZXZhdG9yRGl2LmFwcGVuZENoaWxkKGVsKTtcbiAgICB9XG4gICAge1xuICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZWwuaW5uZXJUZXh0ID0gXCJOYW1lXCI7XG4gICAgICAgIGVsZXZhdG9yRGl2LmFwcGVuZENoaWxkKGVsKTtcbiAgICB9XG4gICAge1xuICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZWwuaW5uZXJUZXh0ID0gXCJcIiArIHBhc3Nlbmdlci5pbml0aWFsRmxvb3I7XG4gICAgICAgIGVsZXZhdG9yRGl2LmFwcGVuZENoaWxkKGVsKTtcbiAgICB9XG4gICAge1xuICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZWwuaW5uZXJUZXh0ID0gXCJXYWl0aW5nIGF0XCI7XG4gICAgICAgIGVsZXZhdG9yRGl2LmFwcGVuZENoaWxkKGVsKTtcbiAgICB9XG4gICAge1xuICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZWwuaW5uZXJUZXh0ID0gXCJcIiArIHBhc3Nlbmdlci5kZXN0aW5hdGlvbkZsb29yO1xuICAgICAgICBlbGV2YXRvckRpdi5hcHBlbmRDaGlsZChlbCk7XG4gICAgfVxuICAgIHtcbiAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGVsLmlubmVyVGV4dCA9IFwiRGVzdGluYXRpb24gZmxvb3JcIjtcbiAgICAgICAgZWxldmF0b3JEaXYuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIH1cbiAgICB3YWl0aW5nUGFzc2VuZ2Vyc0xpc3REaXYuYXBwZW5kQ2hpbGQoZWxldmF0b3JEaXYpO1xufSk7XG5zeXN0ZW0uYWRkTmV3RWxldmF0b3IoKTtcbnN5c3RlbS5hZGROZXdFbGV2YXRvcigpO1xuc3lzdGVtLmFkZE5ld1Bhc3Nlbmdlcih7XG4gICAgbmFtZTogJ0pha3ViJywgaW5pdGlhbEZsb29yOiAyLCBkZXN0aW5hdGlvbkZsb29yOiA1XG59KTtcbnN5c3RlbS5hZGROZXdQYXNzZW5nZXIoe1xuICAgIG5hbWU6ICdQaW90cicsIGluaXRpYWxGbG9vcjogNiwgZGVzdGluYXRpb25GbG9vcjogM1xufSk7XG4iXSwic291cmNlUm9vdCI6IiJ9