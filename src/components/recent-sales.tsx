import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import type { AppUser } from "@/app/auth/actions";

function getInitials(name?: string) {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

export function RecentSales({ users }: { users: AppUser[] }) {
  return (
    <div className="space-y-8">
      {users.map(user => (
        <div className="flex items-center" key={user.uid}>
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.photoURL || undefined} alt="Avatar" />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
