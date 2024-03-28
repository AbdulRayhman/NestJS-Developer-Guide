const { TicketManager, TicketManager2 } = require("./ticketManager");
const fs = require("fs");
// const events = require('events')
// console.log(fs, new events.EventEmitter())
async function clerk() {
  const pr = new Promise((resolve, reject) => {
    resolve(console.log(1));
    reject(console.log(5));
  });
  await pr
    .then((r) => {
      console.log(r);
    })
    .catch((e) => {
      console.log(e);
    });

  console.log(2);
}
console.log(3);
clerk();
console.log(4);

const tM = new TicketManager(3);
const tM2 = new TicketManager2(3);
tM.on("ticketIsBuying", (obj) => {
  console.log(obj);
  tM2.buying("abcd@gmail.com", 25);
});
tM.buying("abcd@gmail.com", 25);
async function getUserData() {
  try {
    let response1 = await fetch(
      "https://jsonplaceholder.typicode.com/users"
    ).then((e) => {
      e.json().then((data) => console.log(data));
    });
    let response2 = await fetch(
      "https://jsonplaceholder.typicode.com/users"
    ).then((e) => {
      e.json().then((data) => console.log(data));
    });
    let response3 = await fetch(
      "https://jsonplaceholder.typicode.com/users"
    ).then((e) => {
      e.json().then((data) => console.log(data));
    });
  } catch (err) {
    console.log(err);
  }
}
// getUserData();
