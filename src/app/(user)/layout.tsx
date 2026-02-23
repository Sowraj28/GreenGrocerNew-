import UserNavbar from '@/components/user/Navbar';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />
      <main>{children}</main>
    </div>
  );
}
