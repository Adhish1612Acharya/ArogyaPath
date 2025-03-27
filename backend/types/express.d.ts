// import { Request } from "express";

// declare module "express-serve-static-core" {
//   interface Request {
//     mdata?: {
//       login: boolean;
//     };
//     file: any;
//     data: any;
//   }
// }

// export interface Req {
//   mdata?: {
//     login: boolean;
//   };
//   file: any;
// }

import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      validatedData?: any; // 👈 Allows any type to avoid future TS errors
    }
  }
}

