import "../../index.css";

import { CommentIcon, DislikeIcon, LikeIcon } from "../ui/icons";

import Button from "./Button";
import StatusBallProposal from "./StatusBallProposal";
import { useNavigate } from "react-router";

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

  const progressPercentage = calculateProgress(startDate, deadlineDate, today);

  return (
    <article
      className={`flex flex-col justify-between min-w-[251px] w-min sm:w-fit min-h-[246px] xl:min-h-[298px] rounded-[5px] shadow-digitaonga cursor-pointer ${className} shadow__digitaonga ${status === "Approved"
          ? "!bg-light-green"
          : status === "Rejected"
            ? "!bg-light-red"
            : "bg-wheua"
        }`}
      onClick={() => navigate(`/proposals/${id}`)}
    >
      <section className="py-4 px-6">
  
  <div className="flex justify-between items-center">
    <span>{startDate.toLocaleDateString()}</span> {/* Fecha de Ingreso */}
    <span className="text-kokowai font-medium flex items-center gap-1 justify-end">
      <StatusBallProposal status={status} />
      {status}
    </span>
  </div>

  <h5 className="font-bold text-black mt-2 mb-4">{title}</h5>

  {/* --- BARRA DE TIEMPO / TIMELINE --- */}
  <div className="relative pt-1">
    
    {/* Contenedor de la línea */}
    <div className="flex justify-between mb-2">
      <span className="text-xs text-gray-500">Inicio</span>
      <span className="text-xs font-bold text-gray-700">Deadline: {deadlineDate.toLocaleDateString()}</span>
    </div>

    {/* La Línea de Tiempo (Barra de Progreso) */}
    <div className="h-2 w-full bg-gray-200 rounded-full relative">
      
      {/* Indicador de progreso (Línea Azul) */}
      <div 
        className="h-full bg-[#226622] rounded-full absolute" 
        style={{ width: `${progressPercentage}%` }} 
      ></div>
      
      {/* Indicador de HOY (Punto) */}
      <div 
        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[#] rounded-full border-2 border-white shadow-lg"
        style={{ left: `${progressPercentage}%`, transform: 'translateX(-50%) translateY(-50%)' }}
        title={`Hoy: ${today.toLocaleDateString()}`}
      ></div>
    </div>
    
  </div>
  {/* ---------------------------------- */}
  
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
            <span>{comments.length}</span>
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
