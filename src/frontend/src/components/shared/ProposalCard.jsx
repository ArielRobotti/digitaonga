import "../../index.css";

import { CommentIcon, DislikeIcon, LikeIcon, VotationIcon } from "../ui/icons";

import Button from "./Button";
import StatusBallProposal from "./StatusBallProposal";
import { useNavigate } from "react-router";
import { useAuth } from "@nfid/identitykit/react";

const ProposalCard = ({
  title = "Proposal name",
  status = "Open",
  id = 1,
  creator = "akdfa...cai",
  deadline,
  creatorName,
  likes,
  dislikes,
  comments,
  description = "This is a proposal description",
  className = "",
} = {}) => {
  const navigate = useNavigate();
  const { user } = useAuth()

  const startDate = new Date(Number(id / 1000000n))
  const deadlineDate = new Date(Number(deadline / 1000000n))
  const today = new Date()
  
  const calculateProgress = (start, end, current) => {
    const totalDuration = end.getTime() - start.getTime();
    const elapsedDuration = current.getTime() - start.getTime();

    // Asegurar que el porcentaje no sea menor a 0 ni mayor a 100
    const progress = Math.min(100, Math.max(0, (elapsedDuration / totalDuration) * 100));
    return progress;
  };

  const countTotalComments = (list) => {
    let count = 0;
    let currentList = list;
    // Iteramos sobre el nivel actual de la lista vinculada (head, tail)
    while (currentList.length > 0) {
      // La estructura es: [[headComment, tailList]]
      const [[headComment, tailList]] = currentList;
      // 1. Contar el comentario actual (el head)
      count += 1;
      // 2. Sumar los subcomentarios recursivamente
      // Nota: Asegúrate que subComments es de tipo CommentList antes de la recursión.
      if (headComment.subComments && headComment.subComments.length > 0) {
        count += countTotalComments(headComment.subComments);
      }
      // 3. Mover al siguiente elemento de la lista (el tail)
      currentList = tailList;
    }
    return count;
  }

  const progressPercentage = calculateProgress(startDate, deadlineDate, today);

  return (
    <article
      className={`flex flex-col justify-between 
            min-w-[200px]  /* Permitimos un encogimiento mayor en móviles */
            sm:min-w-[250px] /* Establecemos un mínimo más razonable */
            w-full /* Permitimos que ocupe todo el espacio de su columna */
            min-h-[246px] xl:min-h-[298px]

            transition duration-300 ease-in-out
            hover:scale-[1.03] 
            rounded-[5px] shadow-digitaonga cursor-pointer ${className} shadow__digitaonga ${status === "Approved"
          ? "!bg-light-green"
          : status === "Rejected"
            ? "!bg-light-red"
            : "bg-wheua"
        }`}
      onClick={() => {if(user) {navigate(`/proposals/${id}`)}}}
    >
      <section className="py-4 px-6">
  
        <div className="flex justify-between items-center">
          <span>{startDate.toLocaleDateString()}</span> {/* Fecha de Ingreso */}
          <span className="text-kokowai font-medium flex items-center gap-1 justify-end">
            <StatusBallProposal status={status} />
            {status}
          </span>
        </div>

        <h5 className="font-bold text-black mt-1 ">{title}</h5>

        <div className="relative pt-1">
          
          <div className="flex justify-between mb-2">
            <span className="text-xs text-gray-500">Start</span>
            <div className="flex flex-col">
              {/* <span className="text-xs font-bold text-gray-700">Deadline: </span> */}
              {/* <span className=""> {deadlineDate.toLocaleDateString()} </span> */}
              <span className="group relative mb-2"> 
                  <span className="text-sm text-gray-500">
                  {deadlineDate.toLocaleDateString()} 
                </span>
                
                {/* Tooltip con la fecha completa */}
                <div className="hidden group-hover:block absolute z-20 
                                bottom-2  -translate-x-1/2 
                                bg-gray-800 text-white text-xs rounded py-1 px-2 shadow-lg whitespace-nowrap">
                    {deadlineDate.toLocaleDateString()} - {deadlineDate.toLocaleTimeString()}
                </div>
              </span>
            </div>
          </div>

          <div className="h-2 w-full bg-gray-200 rounded-full relative">
            
            <div 
              className="h-full bg-green-700 rounded-full absolute" 
              style={{ width: `${progressPercentage}%` }} 
            ></div>
            
            <div 
              className="absolute bottom-0 -translate-y-1/2 w-4 h-4  "
              style={{ left: `${progressPercentage}%`, transform: 'translateX(-50%) translateY(-50%)' }}
              title={`Hoy: ${today.toLocaleDateString()}`}
            >
              <VotationIcon />
            </div>
          </div>
        </div>
        
      </section>

      <section className="py-4 px-6 text-gray-900">
        <p>Proposal ID: {id}</p>
        <p>Delegate ID: {creator.slice(0,7)}...{creator.slice(creator.length -7, creator.length)}</p>
        <p>Delagate Name: {creatorName}</p>
      </section>

      <section className="hidden sm:block py-4 px-6">
        <h5>Impact</h5>
        <p>{description}</p>
      </section>

      <section className="flex justify-between items-center p-2.5">
        <div className="flex gap-4">
          <div>
            <LikeIcon />
            <span>{likes}</span>
          </div>
          <div>
            <DislikeIcon />
            <span>{dislikes}</span>
          </div>
          <div>
            <CommentIcon />
            <span>{countTotalComments(comments)}</span>
          </div>
        </div>

        {status === "Open" && (
          <Button className="w-fit text-white bg-kokowai shadow-[0px_1px_3px_0px_#0000004D]">
            Vote
          </Button>
        )}
      </section>
    </article>
  );
};

export default ProposalCard;
// box-shadow: 0px 4px 8px 0px #00000040;
