export default function Sidebar({ toggleSidebar }) {
  return (
    <div className="flex flex-col h-screen lg:w-[18vw] md:w-[40vw] sm:w-[50vw] fixed top-0 left-0 z-20 bg-[#12141c]/90 backdrop-blur-md shadow-2xl border-r border-white/5">
      <div className="w-full h-[7%] p-[5%] border-b border-gray-500">
        <h3 className="font-semibold text-white">PARALINE</h3>
        <button onClick={toggleSidebar}>
          <img src='./sidebar-icons/sidebar.svg' className="h-6 invert absolute right-4 top-3" />
        </button>
      </div>

      <div className="w-full flex flex-col gap-1 p-[1vw] *:p-2 *:text-start *:w-[90%] *:rounded">
        <button className="hover:bg-slate-800 flex">
          <img src='./sidebar-icons/home.svg' className="h-5 invert mr-2" />Home
        </button>
        <button className="hover:bg-slate-800 flex">
          <img src='./sidebar-icons/tools.svg' className="h-5 invert mr-2" />Installation Guide
        </button>
        <button className="hover:bg-slate-800 flex">
          <img src='./sidebar-icons/theme.svg' className="h-5 invert mr-2" />Themes
        </button>
        <button className="hover:bg-slate-800 flex">
          <img src='./sidebar-icons/settings.svg' className="h-5 invert mr-2" />Settings
        </button>
      </div>
      <div className="h-full flex flex-col justify-end gap-1 p-[1vw] *:p-2 *:text-start *:w-[90%] *:rounded">
        <button className="hover:bg-slate-800 flex">
          <img src='./sidebar-icons/customer-service.svg' className="h-5 invert mr-2" />Contact Us
        </button>
        <button className="hover:bg-slate-800 flex">
          <img src='./sidebar-icons/github-svgrepo-com.svg' className="h-5 invert mr-2" />Github
        </button>
      </div>
    </div>
  );
}