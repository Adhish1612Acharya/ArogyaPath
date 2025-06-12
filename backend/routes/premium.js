import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import { isLoggedIn } from "../middlewares/commonAuth.js";
import {
  createPremiumOrder,
  verifyPremiumPayment,
} from "../controllers/premium.js";

const router = express.Router();

router.post("/:id/buy", isLoggedIn, wrapAsync(createPremiumOrder));

router.post(
  "/:id/payment-confirm",
  isLoggedIn,
  wrapAsync(verifyPremiumPayment)
);

export default router;
