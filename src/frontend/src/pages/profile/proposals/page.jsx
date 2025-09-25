import { useEffect, useRef, useState } from "react";
import { CircularProgress } from "@mui/material";
import ProposalCard from "../../../components/shared/ProposalCard";
import { useAuth } from "@nfid/identitykit/react";
import useCanister from "../../../hooks/useCanister";
import { Style } from "@mui/icons-material";
import { proposalsArrayParser } from "../../../utils/parsers";

const ProfileProposals = () => {
  const { user } = useAuth();

  const [dao] = useCanister()

  const proposalsShown = useRef([])
  const [approved, setApproved] = useState([])
  const [rejected, setRejected] = useState([])
  const [active, setActive] = useState([])

  const [filter, setFilter] = useState(null)

  useEffect(() => {
    const fetchProposals = async () => {
      if (dao) {
        const response = await dao.get_my_proposals();
        if (response) {
          proposalsShown.current = proposalsArrayParser(response)

          setApproved(proposalsArrayParser(response.filter(p => 'Approved' in p.status)))
          setRejected(proposalsArrayParser(response.filter(p => 'Rejected' in p.status)))
          setActive(proposalsArrayParser(response.filter(p => 'Open' in p.status)))
        }
      }
    };
    fetchProposals()
  }, [dao])

  const handleFilter = (f) => {
    if (filter === f) {
      setFilter(null);
      // If the same filter is clicked, clear the filter and show all proposals.
      // Concatenate the three state arrays to get all proposals.
      proposalsShown.current = [...approved, ...rejected, ...active];
    } else {
      setFilter(f);
      // Apply the new filter and update proposalsShown.
      if (f === 'Approved') {
        proposalsShown.current = approved;
      } else if (f === 'Rejected') {
        proposalsShown.current = rejected;
      } else if (f === 'Active') {
        proposalsShown.current = active;
      }
    }
    // The console.log here will show the old `filter` value due to closures,
    // so it's better to log the `f` value directly.
  };

  return (
    <main>
      <div
        className="flex justify-around p-4 w-full flex-nowrap mt-2 select-none" // Use flex-nowrap to prevent wrapping
      >
        <div
          className={`flex-1 text-center rounded-sm max-w-30 md:max-w-100 py-2 cursor-pointer 
            transition-transform duration-300 hover:scale-110 ${filter === 'Active' ? 
              'bg-gray-500' : 'bg-gray-300'
            }`
          }
          onClick={() => { handleFilter("Active") }}
        >
          <h3 className="text-[18px] md:text-xl font-bold text-black">Active</h3>
          <p className="text-xl md:text-2xl text-black">{active.length}</p>
        </div>

        <div
          className={`flex-1 text-center rounded-sm max-w-30 md:max-w-100 py-2 cursor-pointer transition-transform duration-300 hover:scale-110 ${filter === 'Approved' ? 'bg-gray-500' : 'bg-gray-300'
            }`
          }
          onClick={() => { handleFilter("Approved") }}
        >
          <h3 className="text-[18px] md:text-xl font-bold text-black">Approved</h3>
          <p className="text-xl md:text-2xl text-black ">{approved.length}</p>
        </div>

        <div
          className={`flex-1 text-center rounded-sm max-w-30 md:max-w-100 py-2 cursor-pointer transition-transform duration-300 hover:scale-110 ${filter === 'Rejected' ? 'bg-gray-500' : 'bg-gray-300'
            }`
          }
          onClick={() => { handleFilter("Rejected") }}
        >
          <h3 className="text-[18px] md:text-xl font-bold text-black">Rejected</h3>
          <p className="text-xl md:text-2xl text-black">{rejected.length}</p>
        </div>
      </div>

      <section className="grid grid-cols-3 gap-4 mt-4">
        {proposalsShown.current.map((item) => (
          <ProposalCard
            // key={Number(item.id)}
            {...item = item}
          />
          /*
            title = "Proposal name",
            status = "Open",
            id = 1,
            creator = "akdfa...cai",
            description = "This is a proposal description",
            className = "",
          */
        ))}
      </section>

      {/* <div className="flex gap-4 overflow-x-auto py-2 xl:flex-wrap">
        {false ? (
          <CircularProgress />
        ) : (
          proposals.current.map((proposal) => <ProposalCard key={proposal.canisterId} {...proposal} />)
        )}
      </div> */}
    </main>
  );
};

export default ProfileProposals;
