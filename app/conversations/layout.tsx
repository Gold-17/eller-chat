import Sidebar from "@/app/components/sidebar/Sidebar";
import ConversationsList from "@/app/conversations/components/ConversationsList";
import getConversations from "@/app/actions/getConversations";
import getUsers from "@/app/actions/getUsers";
import { User } from "@prisma/client";

export default async function ConversationsLayout({
  children,
  currentUser
}: {
  children: React.ReactNode;
  currentUser: User;
}) {
  const conversations = await getConversations();
  const users = await getUsers();
  return (
    <Sidebar>
      <div className="h-[100vh]">
        <ConversationsList
          currentUser={currentUser}
          users={users}
          initialItems={conversations}
        />
        {children}
      </div>
    </Sidebar>
  );
}
