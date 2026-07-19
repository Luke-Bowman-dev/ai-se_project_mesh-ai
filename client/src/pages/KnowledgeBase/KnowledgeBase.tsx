import "./KnowledgeBase.css";
import UploadArea from "../../components/UploadArea/UploadArea";
import { getDocuments, type KnowledgeDoc } from "../../utils/api";
import { useState, useEffect } from "react";
import closeIcon from "../../assets/close-button.svg"


export default function KnowledgeBase() {
    const [documents, setDocuments] = useState<KnowledgeDoc[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
  const load = async () => {
    
    try {
      const res = await getDocuments();
      if (res && res.data) {
        setDocuments(res.data);
      }
      else {
        setDocuments([]);
      }
    } catch {
      setError("Failed to load documents.");
    } finally {
      setIsLoading(false);
    }
  };
  load();
}, []);

    const handleFileSelect = (file: File) => {
    const newDoc: KnowledgeDoc = {
        _id: Date.now().toString(),
        title: file.name,
        fileName: file.name,
        userId: 'local',
        createdAt: new Date().toISOString(),
    };

     return setDocuments((documents) => [ newDoc, ...documents ]);
};

    return (
    <div className="knowledge-base">
        <h1 className="knowledge-base__title">Manage Your Knowledge Base</h1>
        <section className="knowledge-base__content">
            <p className="knowledge-base__content__description">Upload documents (PDF)</p>
            <UploadArea onFileSelect={handleFileSelect} />
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
                    <button className="knowledge-base__content__library__document__close-button" aria-label="Delete Document">
                      <img className="knowledge-base__content__library__document__close-button__img" src={closeIcon} alt="Close"></img>
                      </button> 
                  </li>
                ))
              )}
            </ul>
            <button className="knowledge-base__content__btn">Save</button>
        </section>
    </div>

    );
}