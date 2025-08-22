import PersonIcon from '@mui/icons-material/Person';
import { CopyIcon } from "../../components/ui/icons";
import ActionCard from '../../components/proposals/create/ActionCard';
import ProgressBar from '../../components/shared/ProgressBar';

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
    return (
        <main className='h-screen flex flex-col'>
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
                                    <input type="checkbox" className='w-4 h-4 accent-kokowai' />
                                    <div className="w-11 h-11 text-gray-500 bg-gray-400" />

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
                    <button className='rounded-[5px] font-medium text-[16px] leading-4 p-4 cursor-pointer text-kokowai shadow-digitaonga w-[316px] border border-kokowai disabled:bg-gray-100 disabled:border-none disabled:text-gray-500 disabled:cursor-default inline-block custom__button'>Invite new member</button>
                    <button className='rounded-[5px] font-medium text-[16px] leading-4 p-4 cursor-pointer bg-kokowai text-white shadow-digitaonga w-[316px] disabled:bg-gray-100 disabled:border-none disabled:text-gray-500 disabled:cursor-default inline-block custom__button'>Save</button>
                    <ProgressBar />
                </div>
            </section>
        </main>
    )
};

export default AssignRole;