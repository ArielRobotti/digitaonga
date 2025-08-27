import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { CopyIcon } from "../../components/ui/icons";
import ActionCard from '../../components/proposals/create/ActionCard';
import ProgressBar from '../../components/shared/ProgressBar';
import { useState } from 'react';

const users = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Alice Johnson" },
    { id: 4, name: "Bob Brown" },
    { id: 5, name: "Charlie Davis" },
    { id: 6, name: "David Wilson" },
    { id: 7, name: "Emma Thompson" }
];

const AssignRole = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDialogInviteMemberOpen, setIsDialogInviteMemberOpen] = useState(false);
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
    // Necesito que sea un array u objecto en el que se vayan alamacenando los users que se van a cambiar el role
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedRole, setSelectedRole] = useState('Guardian');

    const handleDialogInviteMember = () => {
        setIsDialogInviteMemberOpen(true);
    }

    const handleDialogOpen = () => {
        setIsDialogInviteMemberOpen(false);
        setIsDialogOpen(true);
    }

    const handleUserSelect = (user) => {
        setSelectedUsers(prev => [...prev, user]);
    };

    const handleRoleChange = (role) => {
        setSelectedRole(role);
    };

    const handleSaveRole = () => {
        // here the logic for selecting the role
        console.log("Los usuarios seleccionados son: ");
        console.log(selectedUsers);
        console.log("El role seleccionado es: ");
        console.log(selectedRole);

        // Cerrar el dialog de asignación y mostrar el de éxito
        setIsDialogOpen(false);
        setIsSuccessDialogOpen(true);
    };

    const handleCancel = () => {
        setIsDialogOpen(false);
        setIsDialogInviteMemberOpen(false);
        setSelectedUsers([]);
        setSelectedRole('Guardian');
    };

    const handleSuccessAccept = () => {
        setIsSuccessDialogOpen(false);
        setSelectedUsers([]);
        setSelectedRole('Guardian');
    };

    const handleSuccessUndo = () => {
        setIsSuccessDialogOpen(false);
        // Aquí podrías agregar lógica para deshacer la asignación de roles
        console.log("Undoing role assignment...");
    };

    return (
        <main className='h-screen flex flex-col p-4 relative'>
            <section className='flex flex-col gap-6 h-full'>
                {/* Title and filters */}
                <div className='flex justify-between flex-shrink-0'>
                    <h2>Assign Role</h2>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-filter-2"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 6h16" /><path d="M6 12h12" /><path d="M9 18h6" /></svg>
                </div>

                {/* User List - Scrollable container */}
                <div className='flex-1 overflow-hidden'>
                    <ul className='flex flex-col gap-3 p-4 h-full overflow-y-auto scrollbar-hide'>
                        {users.map(user => (
                            <li key={user.id} className='flex justify-between flex-shrink-0'>
                                <div className='flex items-center gap-4'>
                                    <input
                                        type="checkbox"
                                        className='w-4 h-4 accent-kokowai'
                                        onChange={() => handleUserSelect(user)}
                                    />
                                    <div className="w-10 h-10 text-gray-500 bg-gray-400" />

                                    <div className='flex flex-col'>
                                        <span className='text-2xl font-black'>{user.name}</span>
                                        <span>ID: {user.id}</span>
                                    </div>
                                </div>

                                <div>
                                    <CopyIcon
                                        className="cursor-pointer"
                                        onClick={() => copyToClipboard(p2str(user?.principal || "") || "abcde-cai")}
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Buttons and ProgressBar - Fixed at bottom */}
                <div className='flex flex-col items-center justify-center gap-4 flex-shrink-0'>
                    <button
                        className='rounded-[5px] font-medium text-[16px] leading-4 p-4 cursor-pointer text-kokowai shadow-digitaonga w-[316px] border border-kokowai disabled:bg-gray-100 disabled:border-none disabled:text-gray-500 disabled:cursor-default inline-block custom__button'
                        onClick={() => handleDialogInviteMember()}
                    >Invite new member</button>
                    <button
                        className='rounded-[5px] font-medium text-[16px] leading-4 p-4 cursor-pointer bg-kokowai text-white shadow-digitaonga w-[316px] disabled:bg-gray-100 disabled:border-none disabled:text-gray-500 disabled:cursor-default inline-block custom__button'
                        onClick={() => handleDialogOpen()}
                    >Save </button>
                    <ProgressBar />
                </div>
            </section>

            {/* Invite Member Dialog */}
            {isDialogInviteMemberOpen && (
                <div className="fixed inset-0  flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-2xl w-80 max-w-md mx-4 relative" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(0, 0, 0, 0.15)' }}>

                        {/* Close button */}
                        <button
                            onClick={handleCancel}
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
                        <div className="mb-6 p-6">
                            <div className='flex flex-col items-center justify-center gap-3 pt-8 pb-6'>
                                <HighlightOffIcon />

                                <p>Selection Will Be Cleared</p>

                                <p className='text-gray-500'>Inviting a new member will clear your current selection. Do you want to continue and discard the previously selected items?</p>
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-3 justify-center pb-2">
                                <button
                                    onClick={handleCancel}
                                    className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDialogOpen}
                                    className="px-8 py-3 rounded-lg bg-kokowai text-white font-medium hover:bg-opacity-90 transition-colors"
                                >
                                    Proceed
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Role Assignment Dialog */}
            {isDialogOpen && (
                <div className="fixed inset-0  flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-2xl w-80 max-w-md mx-4 relative" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(0, 0, 0, 0.15)' }}>
                        {/* Close button */}
                        <button
                            onClick={handleCancel}
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
                        <div className="mb-6 p-6">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Assign role</h3>

                            <div className="space-y-3">
                                {/* Guardian option */}
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="Guardian"
                                        checked={selectedRole === 'Guardian'}
                                        onChange={() => handleRoleChange('Guardian')}
                                        className="w-5 h-5 text-kokowai accent-kokowai mr-4"
                                    />
                                    <span className="text-lg font-medium text-gray-700">Guardian</span>
                                </label>

                                {/* Observer option */}
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="Observer"
                                        checked={selectedRole === 'Observer'}
                                        onChange={() => handleRoleChange('Observer')}
                                        className="w-5 h-5 text-kokowai accent-kokowai mr-4"
                                    />
                                    <span className="text-lg font-medium text-gray-700">Observer</span>
                                </label>
                            </div>
                        </div>

                        {/* Linea para dividir y que tenga la misma longitud que el contenedor del dialog*/}
                        <hr className="border-t border-gray-300 mb-6" />

                        {/* Action buttons */}
                        <div className="flex gap-3 justify-center pb-2">
                            <button
                                onClick={handleCancel}
                                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveRole}
                                className="px-8 py-3 rounded-lg bg-kokowai text-white font-medium hover:bg-opacity-90 transition-colors"
                            >
                                Save
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
                            <p className="text-lg">Role assigned successfully!</p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-4 justify-center pb-6 px-6">
                            <button
                                onClick={handleSuccessUndo}
                                className="px-4 rounded-lg border border-kokowai text-kokowai font-medium transition-colors text-lg"
                            >
                                Undo
                            </button>
                            <button
                                onClick={handleSuccessAccept}
                                className="px-5 py-3 rounded-lg bg-kokowai text-white font-medium hover:bg-gray-900 transition-colors text-lg"
                            >
                                Accept
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>

    )
};

export default AssignRole;