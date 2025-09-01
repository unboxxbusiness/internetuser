"use client";

import { useTransition } from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { AppUser } from "@/app/auth/actions";
import { deleteUserAction, resetPasswordAction } from "@/app/actions";
import { MoreHorizontal, Trash2, KeyRound, User, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<AppUser>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          User
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div>
          <div className="font-medium">{user.name || "N/A"}</div>
          <div className="text-sm text-muted-foreground">{user.email}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return (
        <Badge variant={role === "admin" ? "default" : "secondary"}>
          {role}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      const [isPending, startTransition] = useTransition();

      const handleDelete = (uid: string) => {
        if (
          confirm(
            "Are you sure you want to delete this user? This action is irreversible."
          )
        ) {
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
        if (
          confirm(
            `Are you sure you want to send a password reset email to ${email}?`
          )
        ) {
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
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/admin/users/${user.uid}`}>
                  <User className="mr-2 h-4 w-4" />
                  View Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
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
        </div>
      );
    },
  },
];
