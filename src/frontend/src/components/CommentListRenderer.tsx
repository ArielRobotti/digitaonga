import React, { useState } from 'react';
// Importamos los tipos y la interfaz de la función
import { Comment, CommentList } from '../../declarations/backend/dao/motokoDao.did';
// import { OnNewCommentHandler } from './types'; // Asume que 'types.ts' tiene la OnNewCommentHandler


interface OnNewCommentHandler {
  (text: string, path: bigint[]): void;
}

interface CommentListProps {
  commentList: CommentList; // Lista vinculada
  currentPath: bigint[]; // Path acumulado hasta el padre de esta lista
  onNewComment: OnNewCommentHandler;
}

// --- Componente para un solo comentario y su botón de respuesta ---
const CommentThread: React.FC<{ comment: Comment, path: bigint[], onNewComment: OnNewCommentHandler }> = ({ comment, path, onNewComment }) => {
    // Es CRUCIAL que el tipo 'Comment' tenga un campo 'id: bigint'
    // Si tu tipo generado no lo tiene, DEBES agregarlo al registro de Motoko.
    const commentId = (comment as any).created_at; // Uso 'as any' solo si el 'id' no está tipado pero sabes que existe.
    
    // Si tu Comment NO tiene 'id', usa 'created_at' como identificador, aunque no es ideal:
    // const commentId = comment.created_at; 
    
    // El path completo para responder a *este* comentario
    const replyPath = [...path, commentId]; 
    
    const [replyText, setReplyText] = useState('');
    const [isReplying, setIsReplying] = useState(false);

    const handleReplySubmit = () => {
        setIsReplying(false);

        if (replyText.trim()) {
            // Envía el path completo al Canister
            onNewComment(replyText, replyPath); 
            setReplyText('');
        }
    };

    const formatDate = (nanos: bigint) => {
        const ms = Number(nanos / 1_000_000n);
        return new Date(ms).toLocaleString();
    };
    const cretorPrincipalShort = comment.creator.toText().slice(0, 10) 
        + "..." 
        + comment.creator.toText().slice(comment.creator.toText().length - 10 , comment.creator.toText().length -1)

    function handleCancel(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        event.preventDefault();
        setIsReplying(false);
        setReplyText('');
    }
    return (
        <div 
          className={`
            p-4 rounded-lg mb-3 transition-colors duration-150 ease-in-out
            border-b border-gray-200 pb-3
            hover:bg-blue-50
            ${path.length > 0 
                ? 'ml-6 border-l-2 border-blue-300 pl-4 bg-white hover:bg-blue-50' 
                : 'shadow-sm bg-gray-50 hover:bg-blue-200'
            }
          `} 
          key={commentId.toString()} // Usamos el ID como key
          style={{ marginLeft: `${path.length * 20}px`, borderLeft: '1px solid #ccc', paddingLeft: '10px' }}>
            
            <div className='flex gap-10 items-center text-sm text-gray-600 mb-2'>
                <span className="font-semibold text-blue-700 mr-2">{cretorPrincipalShort}</span> 
                <span className="text-gray-500 text-xs">{formatDate(comment.created_at)}</span>
            </div>
            <p className="ml-6 text-gray-800 text-base mb-3 max-h-20">{comment.msg}</p>
            
            
            {isReplying && (
                <div className="">
                    <textarea
                        className='w-full'
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={`Reply to ${cretorPrincipalShort}`}
                    />
                    <button className="bg-blue-300 p-2 mx-2 rounded-md" onClick={handleReplySubmit}>send</button>
                    <button className="bg-blue-300 p-2 rounded-md" onClick={handleCancel}>cancel</button>

                </div>
            )}
            {!isReplying && <button className="bg-blue-300 p-2 mx-1 rounded-md" onClick={() => setIsReplying(!isReplying)}>
                reply
            </button>}


            {/* Renderizado recursivo del hilo de subcomentarios */}
            {comment.subComments.length > 0 && (
                <div className="mt-4">
                    <CommentListRenderer 
                      commentList={comment.subComments} 
                      currentPath={replyPath} // El path de los hijos incluye el ID del padre
                      onNewComment={onNewComment} 
                    />
                </div>
            )}
        </div>
    );
}

// --- Componente de Renderizado de Lista (Iterador Recursivo) ---
export const CommentListRenderer: React.FC<CommentListProps> = ({ commentList, currentPath, onNewComment }) => {
    // Caso base: La lista es el array vacío '[]' (fin de la lista)
    if (commentList && commentList.length === 0) {
        return null;
    }
    const [headComment, tailList] = commentList[0];
    
    return (
        <>
            {/* 1. Renderiza el comentario actual (head) */}
            <CommentThread 
                comment={headComment} 
                path={currentPath} 
                onNewComment={onNewComment} 
            />

            {/* 2. Llama recursivamente para renderizar el resto de la lista (tailList) */}
            <CommentListRenderer 
                commentList={tailList} // tailList es la siguiente CommentList
                currentPath={currentPath} // El path se mantiene para los comentarios del MISMO nivel
                onNewComment={onNewComment} 
            />
        </>
    );
};