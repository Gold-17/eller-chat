import Sidebar from "@/app/components/sidebar/Sidebar";
import getUsers from "@/app/actions/getUsers";
import UserList from "@/app/users/components/UserList";
import { User } from "@prisma/client";

export default async function UsersLayout({
  children,
  currentUser
}: {
  children: React.ReactNode;
  currentUser: User;
}) {
  const users = await getUsers();
  
  return (
    <Sidebar>
      <div className="h-[100vh]">
        <UserList
          items={users}
          currentUser={currentUser}
        />
        {children}
      </div>
    </Sidebar>
  );
}
