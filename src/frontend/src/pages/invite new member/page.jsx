import { useState } from 'react';
import TextField from '@mui/material/TextField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import SecurityIcon from '@mui/icons-material/Security';
import ProgressBar from '../../components/shared/ProgressBar';

const InviteNewMemberPage = () => {
    /* Necesito implementar una logica de que unicamente se el button para crear una propuesta es cuadno el usuario carga el Guardian ID, la fecha y asigno el role */
    const [guardianId, setGuardianId] = useState('');
    const [date, setDate] = useState(null);
    const [role, setRole] = useState('');
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

    const isFormValid = () => {
        return guardianId && date && role;
    };

    const handleCreateProposal = () => {
        if (isFormValid()) {
            setIsConfirmDialogOpen(true);
        }
    };

    const handleConfirmProposal = () => {
        // Aquí iría la lógica para crear la propuesta
        console.log("Creando propuesta con:", {
            guardianId,
            date: date?.format('DD/MM/YYYY'),
            role
        });
        
        setIsConfirmDialogOpen(false);
        setIsSuccessDialogOpen(true);
    };

    const handleCancelDialog = () => {
        setIsConfirmDialogOpen(false);
    };

    const handleSuccessAccept = () => {
        setIsSuccessDialogOpen(false);
        // Reset form
        setGuardianId('');
        setDate(null);
        setRole('');
    };

    const handleRoleChange = (event) => {
        setRole(event.target.value);
    };

    return (
        <main className="h-full w-full p-4 ">
            {/* Subtitle */}
            <h3 className="text-3xl">Guardian Proposal</h3>

            {/* Que este div ocupe todo el espacio que tiene, que los elementos quedente centrados */}
            <div className='flex flex-col gap-4 justify-center items-center w-full mt-8 mb-8'>
                {/* Description */}
                <p className='text-center'>used to add, update or remove a guardian. Requires and approved vote before execution.</p>

                <div className="flex flex-col gap-4 w-full max-w-sm">
                    <TextField 
                        id="outlined-basic" 
                        label="Guardian ID" 
                        variant="outlined" 
                        value={guardianId} 
                        onChange={(e) => setGuardianId(e.target.value)}
                        fullWidth
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                            <DatePicker 
                                label="Voting Deadline" 
                                value={date} 
                                onChange={(newValue) => setDate(newValue)}
                                sx={{ width: '100%' }}
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                </div>
            </div>

            {/* Subtitle */}
            <h3 className="text-3xl">What action should be proposed?</h3>

            {/* Description */}
            <p>used to add, update or remove a guardian. Requires and approved vote before execution.</p>

            <div className='flex flex-col gap-4 justify-center items-center w-full mt-8 mb-8'>
                <FormControl>
                    <RadioGroup
                        name="radio-buttons-group"
                        className='flex flex-col gap-4'
                        value={role}
                        onChange={handleRoleChange}
                    >
                        <div className='w-96 shadow-xl rounded-2xl border border-kokowai'>
                            <FormControlLabel value="observer" control={<Radio />} label="Assign as Observer" className='p-2' />

                            {/* Details */}
                            <div className='p-2'>
                                <RemoveRedEyeIcon />
                                <p>Limit this user's role to observer</p>
                            </div>

                            <div className='p-2'>
                                They will retain view-only access without the ability to vote or propose changes.
                            </div>
                        </div>

                        <div className='w-96 shadow-xl rounded-2xl border border-kokowai'>
                            <FormControlLabel value="guardian" control={<Radio />} label="Assign as Guardian" className='p-2'/>

                            {/* Details */}
                            <div className='p-2'>
                                <SecurityIcon />
                                <p>Grant Guardian permissions to this user</p>
                            </div>

                            <div className='p-2'>
                                they will have access to Digital Taonga and the ability to propose and vote within community discussions.
                            </div>
                        </div>
                    </RadioGroup>
                </FormControl>
            </div>

            <div className='flex flex-col gap-4 justify-center items-center w-full mt-8 mb-8'>
                <button
                    className={`rounded-[5px] font-medium text-[16px] leading-4 p-4 cursor-pointer w-[316px] shadow-digitaonga inline-block custom__button ${
                        isFormValid() 
                            ? 'bg-kokowai text-white hover:bg-opacity-90' 
                            : 'text-kokowai border border-kokowai disabled:bg-gray-100 disabled:border-none disabled:text-gray-500 disabled:cursor-default'
                    }`}
                    onClick={handleCreateProposal}
                    disabled={!isFormValid()}
                >
                    Create Proposal
                </button>
            </div>

            <ProgressBar />

            {/* Confirmation Dialog */}
            {isConfirmDialogOpen && (
                <div className="fixed inset-0  flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-2xl w-80 max-w-md mx-4 relative" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(0, 0, 0, 0.15)' }}>
                        {/* Close button */}
                        <button
                            onClick={handleCancelDialog}
                            className="absolute p-6 top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>

                        {/* Dialog content */}
                        <div className="mb-1 p-6">
                            <p className="text-gray-800 mb-10 mt-6">Proposal Summary</p>

                            <div className="space-y-3">
                                <p><span className='font-bold'>Guardian:</span> {guardianId}</p>
                                <p><span className='font-bold'>Action:</span> {role}</p>
                                <p><span className='font-bold'>Voting deadline:</span> {date?.format('DD/MM/YYYY')}</p>
                            </div>
                        </div>

                        {/* Linea para dividir y que tenga la misma longitud que el contenedor del dialog*/}
                        <hr className="border-t border-gray-300 mb-3" />

                        {/* Action buttons */}
                        <div className="flex gap-3 justify-center pb-4">
                            <button
                                onClick={handleCancelDialog}
                                className="px-6 py-3 rounded-lg border border-kokowai text-gray-700 font-medium hover:bg-gray-50 transition-colors shadow-2xl"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmProposal}
                                className="px-8 py-3 rounded-lg bg-kokowai text-white font-medium hover:bg-opacity-90 transition-colors shadow-2xl"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Dialog */}
            {isSuccessDialogOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-2xl w-80 max-w-md mx-4 relative" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(0, 0, 0, 0.15)' }}>
                        {/* Close button */}
                        <div className="flex justify-end pt-4 pr-4">
                            <button
                                onClick={handleSuccessAccept}
                                className="top-4 right-4 text-gray-500 hover:text-gray-700 p-2"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>

                        {/* Success message */}
                        <div className="text-center pb-5">
                            <p className="text-lg">Proposal created <br /> successfully!</p>
                        </div>

                        {/* Action button */}
                        <div className="flex justify-center pb-6 px-6 gap-2">
                                <button
                                className="px-6 py-3 rounded-lg border border-kokowai text-gray-700 font-medium hover:bg-gray-50 transition-colors shadow-2xl"
                            >
                                See Proposals
                            </button>
                            <button
                                onClick={handleSuccessAccept}
                                className="px-6 py-3 rounded-lg bg-kokowai text-white font-medium hover:bg-gray-900 transition-colors text-lg"
                            >
                                Accept
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default InviteNewMemberPage;
