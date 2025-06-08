import express from "express"
import { login, logout, signup, onboard } from "../controllers/auth.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"


const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)  // logout should be always post method because it changes the server state and deletes a cookie

// in-future try to implement the forget password endpoint

router.post("/onboarding", protectRoute ,onboard)

router.get("/me", protectRoute, (req, res) => {
    res.status(200).json({success: true, user: req.user})
}) 

export default router;