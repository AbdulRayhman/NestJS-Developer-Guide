const EventEmitter = require("events");
console.log("Module Load");
class TicketManager extends EventEmitter {
  constructor(supply) {
    super();
    this.supply = supply;
  }

  buying(email, price) {
    if (this.supply > 0) {
      this.supply = this.supply - 1;
      this.emit("ticketIsBuying", { email: email, price: price });
      return;
    } else {
      this.emit("error", new Error("There are no more tickets left!"));
    }
  }
}
class TicketManager2 extends EventEmitter {
  constructor(supply) {
    super();
    this.supply = supply;
  }

  buying(email, price) {
    if (this.supply > 0) {
      this.supply = this.supply - 1;
      this.emit("ticketIsBuying", { email: email, price: price });
      return;
    } else {
      this.emit("error", new Error("There are no more tickets left!"));
    }
  }
}
module.exports = { TicketManager, TicketManager2 };
