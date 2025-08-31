"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, Mail, KeyRound } from "lucide-react";
import type { AppUser } from "@/app/auth/actions";
import { deleteUserAction, resetPasswordAction } from "@/app/actions";
import { useTransition } from "react";

export function UserTable({ users }: { users: AppUser[] }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (uid: string) => {
    if (confirm("Are you sure you want to delete this user? This action is irreversible.")) {
      startTransition(async () => {
        const result = await deleteUserAction(uid);
        if (result?.error) {
          alert(result.error);
        }
      });
    }
  };

  const handleResetPassword = (email?: string) => {
    if (!email) {
        alert("User email is not available.");
        return;
    }
    if (confirm(`Are you sure you want to send a password reset email to ${email}?`)) {
      startTransition(async () => {
        const result = await resetPasswordAction(email);
        if (result.message) {
            alert(result.message);
        } else if (result.error) {
            alert(result.error);
        }
      });
    }
  };

  return (
    <div className="space-y-4">
      {users.length === 0 ? (
        <div className="text-center text-muted-foreground py-16">
          <p className="text-lg">No users found.</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.uid}>
                  <TableCell>
                    <div className="font-medium">{user.name || "N/A"}</div>
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? "default" : "secondary"}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={isPending}>
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">User Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                         <DropdownMenuItem
                          onClick={() => handleResetPassword(user.email)}
                          disabled={isPending}
                        >
                          <KeyRound className="mr-2 h-4 w-4" />
                          Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(user.uid)}
                          className="text-red-500 focus:text-red-500"
                          disabled={isPending}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}