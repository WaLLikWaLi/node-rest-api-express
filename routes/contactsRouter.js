import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateFavorite,
} from "../controllers/contactsControllers.js";
import { isValidId, authenticate } from "../middlewares/index.js";
const jsonParser = express.json();
const contactsRouter = express.Router();

contactsRouter.get("/", authenticate, getAllContacts);

contactsRouter.get("/:id", authenticate, isValidId, getOneContact);

contactsRouter.delete("/:id", authenticate, isValidId, deleteContact);

contactsRouter.post("/", authenticate, jsonParser, createContact);

contactsRouter.put("/:id", authenticate, isValidId, updateContact);

contactsRouter.patch("/:id/favorite", authenticate, isValidId, updateFavorite);
export default contactsRouter;
