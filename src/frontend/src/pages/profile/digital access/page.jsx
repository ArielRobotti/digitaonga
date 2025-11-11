import React from 'react';
import { useNavigate } from 'react-router';
import Button from "../../../components/shared/Button";
import useMemberStore from "../../../store/useMemberStore";
import NftsContainer from "../../../components/shared/NftsContainer";



const ProfileDigitalAccess = () => {
  const navigate = useNavigate()
  const { member } = useMemberStore();
  
  const defaultNotAssetsCard = () => {
    return (  
        <div className="bg-white rounded-lg shadow-xl w-[398px] h-[359px] max-w-md mx-auto p-6 relative text-center border-[2px] border-white border-b-gray-600 ">
          {/* Close Button (X) */}
          <button
            onClick={() =>{}}
            className="absolute top-4 right-4 text-kokowai hover:text-gray-600 focus:outline-none"
            aria-label="Close"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
  
          <div className="mb-4 flex justify-center">
            <div className="h-8 w-8 flex justify-center items-center rounded-full border border-kokowai">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
  
          {/* Title */}
          <h2 className="text-xl font-semibold text-kokowai mb-2">No Access Yet</h2>
  
          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed w-[315px] p-6 text-left">
            You don't currently have access to any Digital Taonga. Once your proposal is approved, your asset will appear here along with a download option. You can also find it in your gallery.
          </p>
  
          {/* Buttons */}
          <div className="flex justify-center space-x-4">
            <Button
              variant="secondary" 
              className="w-fit border border-gray-300 hover:bg-gray-50"
              onClick={() => navigate("/proposals/create/Digital Taonga proposal?action=Request Download Permission")}
              disabled={!(member.data?.role === "Admin" || member.data?.role === "Guardian") }
            >
              Create a proposal
            </Button>
            <Button
              variant="primary" 
              className="w-fit px-8 text-white bg-kokowai" 
              onClick={() => {navigate("/profile")}}
            >
              Accept
            </Button>
          </div>
        </div>
    );
  } 

  return (
    <NftsContainer filter={(asset) => asset.canDownload} defaultNotAssets={defaultNotAssetsCard()}/>
  )
};

export default ProfileDigitalAccess;
