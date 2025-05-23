import { Router } from "express";
import { getQuotes, getQuotesForID, createQuote, updateQuote, deleteQuote, getUpcomingQuotes, getAllQuotes, getAvailableHoursByDate, getQuotesByUser, cancelQuote } from "../controllers/quotesControllers.js";
import verificarToken from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", verificarToken, getQuotes);
router.get("/:id_quotePK", verificarToken, getQuotesForID);
router.post("/", verificarToken, createQuote);
router.put("/:id_quotePK", verificarToken, updateQuote);
router.delete("/:id_quotePK", verificarToken, deleteQuote);
router.get("/upcoming/update", verificarToken, getUpcomingQuotes);
router.get("/all/calendar", verificarToken, getAllQuotes); 
router.get("/disponibles/horas", verificarToken, getAvailableHoursByDate);
router.get("/all/:id_userFK", getQuotesByUser);
router.put("/cancel/cancelCustomerQuote/:id_quotePK", verificarToken, cancelQuote)




export default router;
