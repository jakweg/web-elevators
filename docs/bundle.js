(()=>{"use strict";var e={316:function(e,t,n){var i,r=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])})(e,t)},function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function n(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)}),o=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,n=t&&e[t],i=0;if(n)return n.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&i>=e.length&&(e=void 0),{value:e&&e[i++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")};t.__esModule=!0,t.Elevator=t.ElevatorDirection=void 0;var a,d=n(50),s=n(882);!function(e){e[e.Standing=0]="Standing",e[e.GoingUp=1]="GoingUp",e[e.GoingDown=-1]="GoingDown"}(a=t.ElevatorDirection||(t.ElevatorDirection={}));var l=function(e){this.id=e,this.currentFloor=0,this.direction=a.Standing,this.nextDirection=a.Standing,this.destinationLimit=Number.MAX_SAFE_INTEGER,this.passengers=[]};t.Elevator=l;var c=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.elevators=new Map,t.waitingPassengers=[],t}return r(t,e),t.prototype.addNewElevator=function(e){var t=s.generateUniqueId(),n=new l(t);n.currentFloor=+e||0,this.elevators.set(t,n),this.emit("elevator-added",n)},t.prototype.addNewPassenger=function(e){var t=e.name,n=e.initialFloor,i=e.destinationFloor;if(isNaN(n)||isNaN(i))throw new Error("Invalid passengers parameters");if(n===i)throw new Error("Passenger is already on the destination floor");var r={id:s.generateUniqueId(),direction:i<n?a.GoingDown:a.GoingUp,name:t,initialFloor:n,destinationFloor:i};this.waitingPassengers.unshift(r),this.emit("waiting-passenger-added",r)},t.prototype.commitNextStep=function(){var e,t,n,i,r,d,s,l,c,u,v=new Set;try{for(var p=o(this.elevators.values()),g=p.next();!g.done;g=p.next())if((F=g.value).direction!==a.Standing){v.add(F.id),F.currentFloor+=F.direction;for(var f=F.passengers.length-1;f>=0;f--)(D=F.passengers[f]).destinationFloor===F.currentFloor&&(F.passengers.splice(f,1),this.emit("passenger-dropped",{passenger:D,elevator:F}));if(F.nextDirection!==a.Standing&&F.currentFloor===F.destinationLimit)F.direction=F.nextDirection,F.nextDirection=a.Standing,F.destinationLimit=Number.MAX_SAFE_INTEGER*F.direction;else if(0===F.passengers.length)if(F.nextDirection!==a.Standing);else{var h=!1,m=F.currentFloor*F.direction;try{for(var y=(n=void 0,o(this.waitingPassengers)),E=y.next();!E.done;E=y.next())if((D=E.value).initialFloor*F.direction>=m&&D.direction===F.direction&&D.destinationFloor*F.direction<=F.destinationLimit*F.direction){h=!0;break}}catch(e){n={error:e}}finally{try{E&&!E.done&&(i=y.return)&&i.call(y)}finally{if(n)throw n.error}}h||(F.direction=a.Standing)}for(f=this.waitingPassengers.length-1;f>=0;f--)(D=this.waitingPassengers[f]).initialFloor===F.currentFloor&&D.direction===F.direction&&D.destinationFloor*F.direction<F.destinationLimit*F.direction&&(F.passengers.push(D),this.waitingPassengers.splice(f,1),this.emit("passenger-taken",{passenger:D,elevator:F}))}}catch(t){e={error:t}}finally{try{g&&!g.done&&(t=p.return)&&t.call(p)}finally{if(e)throw e.error}}try{for(var w=o(this.elevators.values()),x=w.next();!x.done;x=w.next()){var F;if((F=x.value).direction==a.Standing){var S=function(e){var t,n,i=!1;try{for(var r=(t=void 0,o(_.elevators.values())),d=r.next();!d.done;d=r.next()){var s=d.value;if(s.direction!==a.Standing&&e.initialFloor*s.direction>s.currentFloor*s.direction&&e.destinationFloor*F.direction<=s.destinationLimit*s.direction&&e.direction===s.direction||s.direction!==a.Standing&&s.nextDirection!==a.Standing&&e.initialFloor*s.direction<=s.destinationLimit*s.direction&&e.direction===s.nextDirection){i=!0;break}}}catch(e){t={error:e}}finally{try{d&&!d.done&&(n=r.return)&&n.call(r)}finally{if(t)throw t.error}}if(!i){if(F.direction=Math.sign(e.initialFloor-F.currentFloor),0===F.direction){F.direction=Math.sign(e.destinationFloor-e.initialFloor);for(var l=_.waitingPassengers.length-1;l>=0;l--){var c=_.waitingPassengers[l];c.initialFloor===F.currentFloor&&c.direction===F.direction&&(F.passengers.push(c),_.waitingPassengers.splice(l,1),_.emit("passenger-taken",{passenger:c,elevator:F}))}}if(F.nextDirection=Math.sign(e.destinationFloor-e.initialFloor),F.nextDirection===F.direction)F.nextDirection=a.Standing,F.destinationLimit=Number.MAX_SAFE_INTEGER*F.direction;else{var u=e.initialFloor;_.waitingPassengers.forEach(F.direction===a.GoingUp?function(e){e.initialFloor>u&&(u=e.initialFloor)}:function(e){e.initialFloor<u&&(u=e.initialFloor)}),F.destinationLimit=u}return v.add(F.id),"break"}},_=this;try{for(var b=(s=void 0,o(this.waitingPassengers)),L=b.next();!L.done;L=b.next()){var D;if("break"===S(D=L.value))break}}catch(e){s={error:e}}finally{try{L&&!L.done&&(l=b.return)&&l.call(b)}finally{if(s)throw s.error}}}}}catch(e){r={error:e}}finally{try{x&&!x.done&&(d=w.return)&&d.call(w)}finally{if(r)throw r.error}}try{for(var T=o(v),N=T.next();!N.done;N=T.next()){var C=N.value;this.emit("elevator-updated",this.elevators.get(C))}}catch(e){c={error:e}}finally{try{N&&!N.done&&(u=T.return)&&u.call(T)}finally{if(c)throw c.error}}},t}(d.default);t.default=c},50:function(e,t){var n=this&&this.__values||function(e){var t="function"==typeof Symbol&&Symbol.iterator,n=t&&e[t],i=0;if(n)return n.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&i>=e.length&&(e=void 0),{value:e&&e[i++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")};t.__esModule=!0;var i=function(){function e(){this.listeners=new Map}return e.prototype.addEventListener=function(e,t){var n,i=null!==(n=this.listeners.get(e))&&void 0!==n?n:[];i.push(t),this.listeners.set(e,i)},e.prototype.emit=function(e,t){var i,r,o;try{for(var a=n(null!==(o=this.listeners.get(e))&&void 0!==o?o:[]),d=a.next();!d.done;d=a.next())(0,d.value)(t)}catch(e){i={error:e}}finally{try{d&&!d.done&&(r=a.return)&&r.call(a)}finally{if(i)throw i.error}}},e}();t.default=i},882:(e,t)=>{t.__esModule=!0,t.generateUniqueId=void 0;var n=1;t.generateUniqueId=function(){return n++}}},t={};function n(i){var r=t[i];if(void 0!==r)return r.exports;var o=t[i]={exports:{}};return e[i].call(o.exports,o,o.exports,n),o.exports}(()=>{var e=n(316);document.querySelector("main").style.display=null;var t=new e.default,i=document.getElementById("elevators-list"),r=document.getElementById("waiting-passengers-list"),o=function(t){switch(t){case e.ElevatorDirection.GoingUp:return"up";case e.ElevatorDirection.GoingDown:return"down";case e.ElevatorDirection.Standing:return"none"}};document.getElementById("add-elevator-btn").addEventListener("click",(function(){t.addNewElevator(+prompt("What floor is that elevator initially on?"))})),document.getElementById("add-passenger-btn").addEventListener("click",(function(){t.addNewPassenger({name:prompt("Give a passenger name","")||"",initialFloor:+prompt("That floor is that passenger on?"),destinationFloor:+prompt("That floor is that passenger going to go?")})})),document.getElementById("next-step-btn").addEventListener("click",(function(){return t.commitNextStep()})),t.addEventListener("elevator-added",(function(e){var t,n=document.createElement("div");n.id="elevator-id-"+e.id,n.classList.add("elevator"),(t=document.createElement("div")).classList.add("current-floor-value"),t.innerText=""+e.currentFloor,n.appendChild(t),(t=document.createElement("div")).innerText="Current floor",n.appendChild(t),(t=document.createElement("div")).classList.add("direction-value"),t.innerText=""+o(e.direction),n.appendChild(t),(t=document.createElement("div")).innerText="Direction",n.appendChild(t),(t=document.createElement("div")).classList.add("passengers-inside-list"),n.appendChild(t),i.appendChild(n)})),t.addEventListener("elevator-updated",(function(e){var t=document.getElementById("elevator-id-"+e.id);t.querySelector(".current-floor-value").innerText=""+e.currentFloor,t.querySelector(".direction-value").innerText=""+o(e.direction)})),t.addEventListener("waiting-passenger-added",(function(e){var t,n=document.createElement("div");n.id="waiting-passenger-id-"+e.id,n.classList.add("waiting-passenger"),(t=document.createElement("div")).innerText=""+e.name,n.appendChild(t),(t=document.createElement("div")).innerText="Name",n.appendChild(t),(t=document.createElement("div")).innerText=""+e.initialFloor,n.appendChild(t),(t=document.createElement("div")).innerText="Waiting at",n.appendChild(t),(t=document.createElement("div")).innerText=""+e.destinationFloor,n.appendChild(t),(t=document.createElement("div")).innerText="Destination floor",n.appendChild(t),r.appendChild(n)})),t.addEventListener("passenger-taken",(function(e){var t=e.passenger,n=e.elevator;document.getElementById("waiting-passenger-id-"+t.id).remove();var i=document.querySelector("#elevator-id-"+n.id+" .passengers-inside-list"),r=document.createElement("div");r.id="passenger_"+t.id,r.classList.add("passenger-inside"),r.innerText=t.name+" ("+t.destinationFloor+")",i.appendChild(r)})),t.addEventListener("passenger-dropped",(function(e){var t=e.passenger,n=e.elevator;document.querySelector("#elevator-id-"+n.id+" #passenger_"+t.id).remove()}))})()})();