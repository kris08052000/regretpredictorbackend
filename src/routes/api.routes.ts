import { Router } from "express";
import rateLimit from "express-rate-limit";
import { auth } from "../middleware/auth.js";
import Validate from "../middleware/validate.js";
import { createPredictionSchema } from "../validators/prediction.validator.js";
import { createPrediction, listPredictions } from "../controllers/prediction.controller.js";
import { createPurchase, listPurchases } from "../controllers/purchase.controller.js";
import { addToWishlist, listWishlist } from "../controllers/wishlist.controller.js";
import { createPurchaseSchema } from "../validators/purchase.validator.js";
import { addToWishlistSchema } from "../validators/wishlist.validator.js";
import { createIssueSchema } from "../validators/issues.validator.js";
import { createIssue } from "../controllers/issues.controller.js";

const router = Router();

const createLimter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minute
    max: 30,                    // limit each IP to 30 requests per window
    standardHeaders: true,
    legacyHeaders: false
});

router.use(auth);

router.post("/predictions", createLimter, Validate(createPredictionSchema), createPrediction);
router.get("/predictions", listPredictions);

router.post("/purchases", createLimter, Validate(createPurchaseSchema), createPurchase);
router.get("/purchases", listPurchases);

router.post("/wishlist", createLimter, Validate(addToWishlistSchema), addToWishlist);
router.get("/wishlist", listWishlist);

router.post("/issues", createLimter, Validate(createIssueSchema), createIssue);




export default router;