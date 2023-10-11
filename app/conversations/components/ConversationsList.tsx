"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";
import { Conversation, User } from "@prisma/client";
import { find } from "lodash";
import { useSession } from "next-auth/react";

import useConversation from "@/app/hooks/useConversation";
import { FullConversationType } from "@/app/types";
import ConversationBox from "@/app/conversations/components/ConversationBox";
import GroupModal from "@/app/conversations/components/GroupModal";
import { pusherClient } from "@/app/libs/pusher";
import SettingsModal from "@/app/components/sidebar/SettingsModal";
import Avatar from "@/app/components/Avatar";

interface ConversationsListProps {
  initialItems: FullConversationType[];
  users: User[];
  currentUser: User;
}

const ConversationsList = ({ initialItems, users, currentUser }: ConversationsListProps) => {
  const [items, setItems] = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const session = useSession();

  const router = useRouter();

  const { conversationId, isOpen } = useConversation();

  const pusherKey = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  useEffect(() => {
    if (!pusherKey) {
      return;
    }

    const newHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        if (find(current, { id: conversation.id })) {
          return current;
        }

        return [conversation, ...current];
      });
    };

    const updateHandler = (conversation: FullConversationType) => {
      setItems((current) =>
        current.map((currentConversation) => {
          if (currentConversation.id === conversation.id) {
            return {
              ...currentConversation,
              messages: conversation.messages,
            };
          }

          return currentConversation;
        })
      );
    };

    const removeHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        return [...current.filter((convo) => convo.id !== conversation.id)];
      });

      if (conversationId === conversation.id) {
        router.push("/conversations");
      }
    };

    pusherClient.subscribe(pusherKey);
    pusherClient.bind("conversation:new", newHandler);
    pusherClient.bind("conversation:update", updateHandler);
    pusherClient.bind("conversation:remove", removeHandler);

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("conversation:new", newHandler);
      pusherClient.unbind("conversation:update", updateHandler);
      pusherClient.unbind("conversation:remove", removeHandler);
    };
  }, [pusherKey, conversationId, router]);

  return (
    <>
      <GroupModal
        users={users}
        conversation={initialItems}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <aside
        className={clsx(
          `
        fixed
        inset-y-0
        pb-20
        lg:pb-0
        lg:left-20
        lg:w-80
        lg:block
        overflow-y-auto
        border-r
        border-r-gray-300
        dark:border-r-gray-800
        `,
          isOpen ? "hidden" : "block w-full left-0"
        )}
      >
        <div className="px-5">
          <div className="flex items-center justify-between mb-4 pt-4">
            <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-200">
              Messages
            </div>
            <div
              onClick={() => setIsModalOpen(true)}
              className="rounded-full p-2 bg-gray-300 dark:bg-gray-800 cursor-pointer hover:opacity-75 transition"
            >
              <MdOutlineGroupAdd size={22} />
            </div>
            <div>
              <SettingsModal
                isOpen={isUserModalOpen}
                onClose={() => setIsUserModalOpen(false)}
                currentUser={currentUser}
              />
              <div
                onClick={() => setIsUserModalOpen(true)}
                className="cursor-pointer hover:opacity-75 transition"
              >
                <Avatar />
              </div>
            </div>
          </div>
          {items.map((item) => (
            <ConversationBox
              key={item.id}
              data={item}
              selected={conversationId === item.id}
            />
          ))}
        </div>
      </aside>
    </>
  );
};

export default ConversationsList;
