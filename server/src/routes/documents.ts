import { Router } from "express";
import { uploadDocument, listDocuments, fetchDocument, deleteDocument, uploadDocumentIngest } from "../controllers/documents.js";
import { auth } from '../middleware/auth.js';
import multer from "multer";

const documentsRouter = Router();

const upload = multer({dest: 'uploads/'});

documentsRouter.use(auth);

documentsRouter.post("/", upload.single('file'), uploadDocument);
documentsRouter.get("/", listDocuments);
documentsRouter.get("/:id", fetchDocument);
documentsRouter.delete("/:id", deleteDocument);
documentsRouter.post("/:id/ingest", uploadDocumentIngest);
export {documentsRouter};