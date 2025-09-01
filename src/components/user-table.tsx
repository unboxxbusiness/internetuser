
"use client";

import { useTransition } from "react";
import Link from "next/link";
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { AppUser } from "@/app/auth/actions";
import { deleteUserAction, resetPasswordAction } from "@/app/actions";
import { MoreHorizontal, Trash2, KeyRound, User } from "lucide-react";


export function UserTable({ users }: { users: AppUser[] }) {
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

    const getPaymentStatusVariant = (status: AppUser['paymentStatus']) => {
        switch(status) {
            case 'paid': return 'secondary';
            case 'pending': return 'outline';
            default: return 'default';
        }
    }


  return (
    <div className="rounded-md border">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Account Status</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.length === 0 ? (
                     <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                            No users found.
                        </TableCell>
                    </TableRow>
                ) : (
                    users.map((user) => (
                        <TableRow key={user.uid}>
                            <TableCell>
                                <div className="font-medium">{user.name || "N/A"}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                            </TableCell>
                            <TableCell>
                                 <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                                    {user.role}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant={user.accountStatus === "active" ? "secondary" : "destructive"}>
                                    {user.accountStatus}
                                </Badge>
                            </TableCell>
                             <TableCell>
                                <Badge variant={getPaymentStatusVariant(user.paymentStatus)}>
                                    {user.paymentStatus}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
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
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    </div>
  );
}
