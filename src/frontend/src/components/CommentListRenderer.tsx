import React, { useEffect, useRef, useState } from 'react';
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

    const commentId = (comment as any).created_at; // Uso 'as any' solo si el 'id' no está tipado pero sabes que existe.
    
    // const commentId = comment.created_at; 
    
    // El path completo para responder a *este* comentario
    const replyPath = [...path, commentId]; 
    
    const [replyText, setReplyText] = useState('');
    const [isReplying, setIsReplying] = useState(false);

    // Foco sutomatico en textarea

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    useEffect(() => {
        if (isReplying && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [isReplying]);
    
    ////

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
    const cretorPrincipalShort = comment.creator.toText().slice(0, 3) 
        + "..." 
        + comment.creator.toText().slice(comment.creator.toText().length - 3 , comment.creator.toText().length -1)

    function handleCancel(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        event.preventDefault();
        setIsReplying(false);
        setReplyText('');
    }
    return (
        <div 
          className={`
            p-1 rounded-lg mb-3 transition-colors duration-150 ease-in-out
            flex flex-col border border-gray-300 pb-1
            hover:bg-blue-50
            ${path.length > 0 
                ? 'ml-6 border-l-2 border-blue-300 pl-4 bg-white hover:bg-blue-50' 
                : 'shadow-sm bg-gray-50 hover:bg-blue-200'
            }
          `} 
          key={commentId.toString()} // Usamos el ID como key
          style={{ marginLeft: `${path.length * 6}px`, borderLeft: '1px solid #17a517ff', paddingLeft: '2px' }}>
            
            <div className='flex items-center text-sm text-gray-600 mb-2'>
                <div className='h-7 w-7 mr-1 rounded-full bg-gray-400'></div>
                <span className="font-semibold text-blue-700">{cretorPrincipalShort}</span> 
                <span className="text-gray-500 text-xs ml-auto">{formatDate(comment.created_at)}</span>
            </div>
            <p className="ml-4 text-gray-800 text-base mb-0 max-h-20 overflow-y-scroll max-h-40">{comment.msg}</p>
            {isReplying && (
                <div className="">
                    <textarea
                        ref={textareaRef}
                        className='w-full px-4 py-1'
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={`Reply to ${cretorPrincipalShort}`}
                    />
                    <div className='flex justify-end'>
                        <button className="w-16 bg-blue-300 p-2 rounded-md cursor-pointer" onClick={handleCancel}>cancel</button>
                        <button className="w-16 bg-blue-300 p-2 mx-2 rounded-md cursor-pointer" onClick={handleReplySubmit}>send</button>
                    </div>

                </div>
            )}
            {!isReplying && <button className=" m-2 mt-0 rounded-md ml-auto cursor-pointer" onClick={() => setIsReplying(!isReplying)}>
                Reply
            </button>}
            
            


            {/* Renderizado recursivo del hilo de subcomentarios */}
            {comment.subComments.length > 0 && (
                <div className="mt-2">
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