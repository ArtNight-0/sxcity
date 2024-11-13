import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex bg-gray-900">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen bg-gray-900 text-gray-100">
        {children}
      </main>
    </div>
  );
};

export default Layout;
