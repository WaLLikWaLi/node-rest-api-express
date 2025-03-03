import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../schemas/contactsSchemas.js";
import Contact from "../models/contact.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const contacts = await Contact.find({ owner }, "-createdAt -updatedAt", {
      skip,
      limit,
    }).populate("owner", "name email");
    res.status(200).json(contacts);
  } catch (error) {
    console.log(error);
    next(HttpError(error.status, error.message));
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Contact.findById(id);

    if (!result) throw HttpError(404);
    res.status(200).json(result);
  } catch (error) {
    next(HttpError(error.status));
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Contact.findByIdAndDelete(id);

    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(result);
  } catch (error) {
    next(HttpError(error.status));
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { error, value } = createContactSchema.validate(req.body);
    if (typeof error !== "undefined") {
      throw HttpError(400, error.message);
    }

    const { _id: owner } = req.user;
    console.log(req.user);
    const newContact = await Contact.create({ ...req.body, owner });

    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};
export const updateContact = async (req, res, next) => {
  try {
    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { id } = req.params;
    const upContact = await Contact.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!upContact) {
      throw HttpError(404, "Not found");
    }
    console.log(upContact);
    res.status(200).json(upContact);
  } catch (error) {
    next(error);
  }
};
export const updateFavorite = async (req, res, next) => {
  try {
    const { error } = updateFavoriteSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { id } = req.params;
    const upContact = await Contact.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!upContact) {
      throw HttpError(404, "Not found");
    }
    console.log(upContact);
    res.status(200).json(upContact);
  } catch (error) {
    next(error);
  }
};
