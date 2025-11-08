
"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { useTransition } from "react"
import { ArrowUpDown, MoreHorizontal, User, Trash2, KeyRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { AppUser } from "@/app/auth/actions"
import { deleteUserAction, resetPasswordAction } from "@/app/actions"

const ActionsCell = ({ row }: { row: any }) => {
    const [isPending, startTransition] = useTransition();
    const user = row.original as AppUser;

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this user? This action is irreversible.")) {
            startTransition(async () => {
                await deleteUserAction(user.uid);
            });
        }
    };
    
    const handleResetPassword = () => {
         if (!user.email) {
            alert("User email is not available.");
            return;
        }
        if (confirm(`Are you sure you want to send a password reset email to ${user.email}?`)) {
            startTransition(async () => {
                const result = await resetPasswordAction(user.email!);
                 if (result.message) {
                    alert(result.message);
                } else if (result.error) {
                    alert(result.error);
                }
            });
        }
    };

    return (
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
                onClick={handleResetPassword}
                disabled={isPending}
            >
                <KeyRound className="mr-2 h-4 w-4" />
                Reset Password
            </DropdownMenuItem>
            <DropdownMenuItem
                onClick={handleDelete}
                className="text-red-500 focus:text-red-500"
                disabled={isPending}
            >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete User
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}


const getPaymentStatusVariant = (status: AppUser['paymentStatus']) => {
    switch(status) {
        case 'paid': return 'secondary';
        case 'pending': return 'outline';
        default: return 'default';
    }
}


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
      )
    },
    cell: ({ row }) => {
        const user = row.original
        return (
            <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
        )
    }
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge variant={row.getValue("role") === "admin" ? "default" : "secondary"}>
        {row.getValue("role")}
      </Badge>
    ),
  },
  {
    accessorKey: "accountStatus",
    header: "Account Status",
    cell: ({ row }) => (
      <Badge variant={row.getValue("accountStatus") === "active" ? "secondary" : "destructive"}>
        {row.getValue("accountStatus")}
      </Badge>
    ),
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment Status",
     cell: ({ row }) => (
      <Badge variant={getPaymentStatusVariant(row.getValue("paymentStatus"))}>
        {row.getValue("paymentStatus")}
      </Badge>
    ),
  },
   {
    id: "actions",
    cell: ActionsCell,
    header: () => <div className="text-right">Actions</div>,
  },
]

    