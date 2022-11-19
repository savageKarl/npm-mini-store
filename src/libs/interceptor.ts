// import forEach from "lodash-es/forEach";

import { HandlerItem,HandlersType, Callback } from "./types";

export class Interceptor {
  handlers: HandlersType = [];

  constructor() {}

  use(fulfilled: Callback, rejected: Callback) {
    this.handlers.push({
      fulfilled,
      rejected,
    });

    const index = this.handlers.length - 1;
    return index;
  }

  eject(index: number) {
    if (this.handlers[index]) this.handlers[index] = null;
  }

  // forEach(fn: (v: HandlerItem, i: number) => any) {
  //   forEach(this.handlers, function (v, i) {
  //     if (v) fn(v, i);
  //   });
  // }
}
