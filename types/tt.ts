import gulp from "gulp";

declare module "gulp" {
   namespace GulpClient {
    interface WatchOptions {
      events: any;
    }
  }
}
