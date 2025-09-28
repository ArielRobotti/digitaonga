import React, { useState, useRef, useEffect } from 'react';
// Importamos los tipos
import { CommentList } from '../../declarations/backend/dao/motokoDao.did';
import { CommentListRenderer } from './CommentListRenderer';

interface OnNewCommentHandler {
  (text: string, path: bigint[]): void;
}

interface CommentSectionProps {
  rawICComments: CommentList; // Recibe la lista vinculada generada
  onNewComment: OnNewCommentHandler;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ rawICComments, onNewComment }) => {
  const [rootCommentText, setRootCommentText] = useState('');

  const commentsContainerRef = useRef<HTMLDivElement>(null);
  const isUserScrollingUpRef = useRef(false);

  const scrollToBottom = () => {
    if (commentsContainerRef.current) {
        commentsContainerRef.current.scrollTop = commentsContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const container = commentsContainerRef.current;
    if (!container) return;

    // Condición 1: Si el usuario NO está leyendo arriba (es decir, el scroll estaba abajo)
    // O Condición 2: Si es el primer render (isUserScrollingUpRef.current es false por defecto)
    if (!isUserScrollingUpRef.current) {
        scrollToBottom();
    }
  // Se ejecuta cada vez que rawICComments cambia (un nuevo comentario llega)
  }, [rawICComments]);

  const handleScroll = () => {
    const container = commentsContainerRef.current;
    if (!container) return;
    
    // Cálculo para saber si el scroll está cerca del final.
    // Típicamente, si la posición actual + altura visible > altura total - 10px (margen de error)
    const isAtBottom = (container.scrollTop + container.clientHeight) >= container.scrollHeight - 10;
    
    // Si NO está abajo, el usuario está leyendo arriba.
    isUserScrollingUpRef.current = !isAtBottom;
  };


  // console.log({ rawICComments })

  const handleRootSubmit = () => {
    if (rootCommentText.trim()) {
      // Para el comentario raíz, el path es un array vacío []
      onNewComment(rootCommentText, []);
      setRootCommentText('');
    }
  };

  return (
    <div className="container mx-auto px-4 py-4 mb-10 max-w-5xl bg-gray-400 shadow-lg rounded-lg ">
      {/* <h2 className="text-3xl font-bold text-gray-800 mb-6"></h2> */}


      {/* Renderiza toda la lista de comentarios de la propuesta */}
      <div
        ref={commentsContainerRef} 
        onScroll={handleScroll} 
        className="comment-list max-h-[50vh] overflow-y-scroll custom-scrollbar"
      >
        {rawICComments.length === 0 ? (
          <p className="text-gray-500 italic">No hay comentarios aún. ¡Sé el primero en comentar!</p>
        ) : (
          <CommentListRenderer
            commentList={rawICComments}
            currentPath={[]}
            onNewComment={onNewComment}
          />
        )}
      </div>
      {/* Input para el comentario raíz */}
      <div className="new-comment-input p-4 mt-2 border border-gray-200 rounded-md bg-gray-50">
        <textarea
          value={rootCommentText}
          onChange={(e) => setRootCommentText(e.target.value)}
          //   placeholder="Escribe un comentario a la propuesta..."
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 resize-y"
          rows={3}
        />
        <button
          onClick={handleRootSubmit}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Comment
        </button>
      </div>
    </div>
  );
};