"use client";
import { auth } from "@/auth";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import getCurrentUser from "@/lib/db/getCurrentUser";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
// import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type UserRole = {
  id: string;
  image: string;
  name: string;
  role: string;
  isAdmin: boolean;
};

export default function Admin({ params }: { params: any }) {
  // const { lng } = React.use<{ lng: string }>(params);
  const { data: session } = useSession();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<UserRole[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const currentUserRes = await fetch("/api/actions/user");
      if (!currentUserRes.ok) {
        throw new Error("Failed to fetch current user");
      }
      const userData: User = await currentUserRes.json();
      setCurrentUser(userData);

      if (userData.isAdmin) {
        const allUsersRes = await fetch("/api/actions/allusers");
        if (!allUsersRes.ok) {
          throw new Error("Failed to fetch all users");
        }
        const allUsersData = await allUsersRes.json();
        setAllUsers(allUsersData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [session]);

  if (loading) {
    return (
      <p className="flex justify-center font-lg text-bold text-white">
        Loading...
      </p>
    );
  }

  if (!session || !currentUser?.isAdmin) {
    console.log(session, currentUser);
    router.push("/");
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await fetch(`/api/role-update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      setAllUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleAdminToggle = async (userId: string, isAdmin: boolean) => {
    try {
      await fetch(`/api/admin-update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isAdmin }),
      });
      setAllUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, isAdmin } : user))
      );
    } catch (error) {
      console.error("Error updating admin status:", error);
    }
  };

  const filteredUsers = allUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col max-w-screen-md max-h-svh overflow-y-scroll mx-auto my-12 p-4 gap-4 justify-center bg-white rounded-md border-2">
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      {/* search */}
      <Input
        type="text"
        placeholder="Search by name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="px-4 py-2 border rounded-md"
      />

      {/* table */}
      <Table className="mb-4">
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="max-w-48">Role</TableHead>
            <TableHead className="max-w-36">Admin</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <img
                    src={user.image}
                    alt="avatar"
                    className="size-8 rounded-full shadow-md"
                  />
                  <span>{user.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  className="border rounded px-4 py-1"
                >
                  <option value="patient">Patient</option>
                  <option value="staff">Staff</option>
                </select>
              </TableCell>
              <TableCell>
                {currentUser?.isAdmin && (
                  <Switch
                    hidden={!currentUser.isAdmin}
                    disabled={currentUser?.id === user.id}
                    checked={user.isAdmin}
                    onCheckedChange={(checked) => {
                      handleAdminToggle(user.id, checked);
                    }}
                  />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
