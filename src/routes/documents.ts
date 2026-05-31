import { Router } from "express";
import { uploadDocument, listDocuments, fetchDocument, deleteDocument, patchDocument, uploadDocumentIngest } from "../controllers/documents.js";

const documentsRouter = Router();

documentsRouter.post("/", uploadDocument);
documentsRouter.get("/", listDocuments);
documentsRouter.get("/:id", fetchDocument);
documentsRouter.delete("/:id", deleteDocument);
documentsRouter.patch('/:id', patchDocument);
documentsRouter.post("/:id/ingest", uploadDocumentIngest);
export {documentsRouter};