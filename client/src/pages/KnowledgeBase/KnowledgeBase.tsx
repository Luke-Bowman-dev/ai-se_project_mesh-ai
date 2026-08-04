import "./KnowledgeBase.css";
import UploadArea from "../../components/UploadArea/UploadArea";
import { getDocuments, type KnowledgeDoc, uploadDocument, deleteDocument } from "../../utils/api";
import { useState, useEffect } from "react";
import closeIcon from "../../assets/close-button.svg"


export default function KnowledgeBase() {
    const [documents, setDocuments] = useState<KnowledgeDoc[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);


  const handleDelete = async (id: string) => {
    try {
      setError(null);
      await deleteDocument(id);
      setDocuments(prevDocs => prevDocs.filter(doc => doc._id !== id));
    } catch {
      setError('Failed to delete the document.');
    }
  };

useEffect(() => {
  const load = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const res = await getDocuments();
      
      if (res && res.data) {
        setDocuments(res.data);
      } else {
        setDocuments([]);
      }
    } catch  {
      setError("Failed to load documents.");
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  load();
}, []);

    const handleFileSelect = async (file: File) => {
    setIsUploading(true);
    try {
    const res = await uploadDocument(file);
    if (res && res.data) {
      const uploadedDoc = res.data;
      setDocuments((prev) => [uploadedDoc, ...prev]);  
    }
    } catch {
    setError("Failed to upload document.");
    } finally {
    setIsUploading(false);
    }
};
    return (
    <div className="knowledge-base">
        <h1 className="knowledge-base__title">Manage Your Knowledge Base</h1>
        <section className="knowledge-base__content">
            <p className="knowledge-base__content__description">Upload documents (PDF)</p>
            <UploadArea onFileSelect={handleFileSelect} isUploading={isUploading}/>
            <ul className="knowledge-base__content__library">
              {isLoading && (
                <li className="knowledge-base__content__library__status">Loading...</li>
              )}
              {!isLoading && error && (
                <li className="knowledge-base__content__library__error">{error}</li>
              )}
              {!isLoading && !error && documents.length === 0 && (
                <li className="knowledge-base__content__library__status">No documents yet.</li>
              )}
              {!isLoading && !error && documents.length > 0 && (
                documents.map((document) => (
                  <li className="knowledge-base__content__library__document" key={document._id}>
                    <p>{document.title}</p>
                    <button className="knowledge-base__content__library__document__close-button" aria-label="Delete Document" onClick={() => handleDelete(document._id)}>
                      <img className="knowledge-base__content__library__document__close-button__img" src={closeIcon} alt="Close"></img>
                      </button> 
                  </li>
                ))
              )}
            </ul>
        </section>
    </div>

    );
}