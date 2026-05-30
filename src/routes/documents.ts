import { Router } from "express";
import { uploadDocument, listDocuments, fetchDocument, deleteDocument } from "../controllers/documents.js";

const documentsRouter = Router();

documentsRouter.post("/", uploadDocument);
documentsRouter.get("/", listDocuments);
documentsRouter.get("/:id", fetchDocument);
documentsRouter.delete("/:id", deleteDocument);

export {documentsRouter};