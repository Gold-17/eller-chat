"use client";

import { User } from "@prisma/client";
import UserBox from "@/app/users/components/UserBox";
import SettingsModal from "@/app/components/sidebar/SettingsModal";
import Avatar from "@/app/components/Avatar";
import { useState } from "react";

interface UserListProps {
  items: User[];
  currentUser: User;
}

const UserList = ({ items, currentUser }: UserListProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <aside className="fixed inset-y-0 pb:20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-r-gray-300 dark:border-r-gray-800 block w-full left-0">
      <div className="px-5">
        <div className="flex items-center justify-between mb-4 pt-4">
          <div className="flex-col">
            <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-200 py-4">
              People
            </div>
          </div>
          <div>
            <SettingsModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              currentUser={currentUser}
            />
            <div
              onClick={() => setIsModalOpen(true)}
              className="cursor-pointer hover:opacity-75 transition"
            >
              <Avatar />
            </div>
          </div>
        </div>
        {items.map((item) => (
          <UserBox key={item.id} data={item} />
        ))}
      </div>
    </aside>
  );
};

export default UserList;
