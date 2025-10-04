import React from 'react';

const CheckCircle = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const XCircle = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const Clock = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ProposalVotingStatus = ({
    activeMembers = 100,
    partialResults = {
        approving: 0n,
        disapproving: 0n,
        abstentions: 0n
    },
    deadline = null, // BigInt timestamp en nanosegundos
    participationRequired = 20,
    majorityRequired = 50,
    status = "Open",
    className = "",
}) => {

    const [isHovered, setIsHovered] = React.useState(false);

    // Convertir BigInt a Number
    const yesVotes = Number(partialResults.approving || 0n);
    const noVotes = Number(partialResults.disapproving || 0n);
    const abstentionVotes = Number(partialResults.abstentions || 0n);

    // Calcular totales
    const totalVotes = yesVotes + noVotes + abstentionVotes;

    // Calcular porcentajes basados en el total de votos
    const yesPercentage = totalVotes > 0 ? yesVotes / totalVotes * 100 : 0;
    const noPercentage = totalVotes > 0 ? noVotes / totalVotes * 100 : 0;
    const abstentionPercentage = totalVotes > 0 ? abstentionVotes / totalVotes * 100 : 0;

    // Participación (sobre miembros activos)
    const participationPercentage = totalVotes / Number(activeMembers) * 100;

    // Verificar condiciones
    const participationMet = participationPercentage >= participationRequired;
    const yesOfVoted = totalVotes > 0 ? Number(yesVotes / totalVotes) * 100 : 0;
    const majorityMet = yesOfVoted > majorityRequired;

    // Formatear deadline
    const formatDeadline = (deadlineBigInt) => {
        if (!deadlineBigInt) return "No deadline set";

        try {
            // Convertir de nanosegundos a milisegundos
            const milliseconds = Number(deadlineBigInt / 1000000n);
            const deadlineDate = new Date(milliseconds);
            const now = new Date();

            const diffMs = deadlineDate - now;

            if (diffMs < 0) return "Voting closed";

            const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

            if (days > 0) {
                return `${days} day${days !== 1 ? 's' : ''}, ${hours} hour${hours !== 1 ? 's' : ''}`;
            } else if (hours > 0) {
                return `${hours} hour${hours !== 1 ? 's' : ''}, ${minutes} minute${minutes !== 1 ? 's' : ''}`;
            } else {
                return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
            }
        } catch (error) {
            console.error("Error formatting deadline:", error);
            return "Invalid deadline";
        }
    };

    return (
        <div
            className={`bg-gray-700 md:rounded-lg p-1 text-white md:mt-1 ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex flex-col items-center">
                <h2 className="text-xl font-semibold">Voting Results</h2>
            </div>

            {/* Barra de votación principal */}
            <div className="mb-2">
                <div className="flex justify-between items-start md:mb-2">
                    <div className="ml-6">
                        <span className="text-emerald-400 text-sm font-medium">Yes: </span>
                        <span className="text-emerald-400 text-xs ml-2">{yesVotes} votes</span>
                        <div className="text-emerald-400 text-xl font-bold">
                            {yesPercentage.toFixed(2)}%
                        </div>
                    </div>
                    <div className="text-gray-400">
                        Total: {totalVotes} votes
                    </div>
                    <div className="text-right mr-6">
                        <span className="text-rose-400 text-sm font-medium">No: </span>
                        <span className="text-rose-400 text-xs ml-2">{noVotes} votes</span>
                        <div className="text-rose-400 text-xl font-bold">
                            {noPercentage.toFixed(2)}%
                        </div>
                    </div>
                </div>

                {/* Barra de progreso */}
                <div className="relative w-full bg-slate-600 rounded-full h-2 overflow-hidden">
                    <div
                        className="absolute left-0 top-0 h-full bg-emerald-500 transition-all duration-500"
                        style={{ width: `${yesPercentage}%` }}
                    />
                    
                    <div
                        className="absolute right-0 top-0 h-full bg-rose-500 transition-all duration-500"
                        style={{ width: `${noPercentage}%` }}
                    />

                    {/* Indicador de posición */}
                    {totalVotes > 0 && (
                        <div
                            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-purple-500 rounded-full border-2 border-white transition-all duration-500"
                            style={{ left: `${yesPercentage}%`, transform: 'translate(-50%, -50%)' }}
                        />
                    )}
                </div>

                {/* Información de deadline y abstenciones */}
                <div className="flex flex-col items-center mt-3 text-sm">
                    <div className="text-gray-400">
                        {abstentionVotes > 0 && (
                            <span>Abstentions: {abstentionVotes}</span>
                        )}
                    </div>
                    {status == "Open" ? <div className="text-slate-300 text-center">
                        <Clock className="inline w-4 h-4 mr-1" />
                        Voting open until
                        <div className="font-semibold">{formatDeadline(deadline)}</div>
                    </div> :
                        <div className="text-slate-300 text-center">
                            Proposal status:
                            <div className="font-semibold">{status}</div>
                        </div>
                    }
                    
                </div>
            </div>

            <div
                className="overflow-hidden transition-all duration-500 ease-in-out"
                style={{
                    maxHeight: isHovered ? '1000px' : '0',
                    opacity: isHovered ? 1 : 0
                }}
            >
                {/* Condiciones para aprobar */}
                <div className="border-t border-slate-600 pt-4 mt-2">
                    <div className="flex items-center justify-between mb-3">
                        <div className="text-base font-medium">
                            The two following conditions have to be met for a proposal to be adopted:
                        </div>
                    </div>

                    <div className="space-y-3">
                        {/* Condición 1: Participación */}
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                                {participationMet ? (
                                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                                ) : (
                                    <XCircle className="w-5 h-5 text-slate-400" />
                                )}
                            </div>
                            <div className="flex-1">
                                <span className="text-slate-300">
                                    <span className="font-semibold">Participation:</span> at least {participationRequired}% of active members must vote
                                </span>
                                <div className="text-sm text-slate-400 mt-1">
                                    Current: {participationPercentage.toFixed(2)}% ({totalVotes}/{activeMembers}) {participationMet ? '✓' : '✗'}
                                </div>
                            </div>
                        </div>

                        {/* Condición 2: Mayoría */}
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                                {majorityMet ? (
                                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                                ) : (
                                    <XCircle className="w-5 h-5 text-slate-400" />
                                )}
                            </div>
                            <div className="flex-1">
                                <span className="text-slate-300">
                                    <span className="font-semibold">Majority:</span> more than {majorityRequired}% of votes must be yes
                                </span>
                                <div className="text-sm text-slate-400 mt-1">
                                    Current: {yesOfVoted.toFixed(2)}% of votes are yes {majorityMet ? '✓' : '✗'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Información adicional */}
                <div className="mt-4 pt-4 border-t border-slate-600 w-full flex flex-row gap-2 justify-around">
           
                        <div className="text-center">
                            <div className="text-slate-400 mb-1">Yes Votes</div>
                            <div className="font-semibold text-emerald-400">{yesVotes}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-slate-400 mb-1">No Votes</div>
                            <div className="font-semibold text-rose-400">{noVotes}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-slate-400 mb-1">Abstentions</div>
                            <div className="font-semibold text-gray-400">{abstentionVotes}</div>
                        </div>

                        <div className="text-center">
                            <div className="text-slate-400 mb-1">Active Members</div>
                            <div className="font-semibold">{activeMembers}</div>
                        </div>
            
                </div>
            </div>
        </div>
    );
};


export default ProposalVotingStatus;