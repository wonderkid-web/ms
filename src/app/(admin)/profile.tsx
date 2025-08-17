import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SignOutButton, useSession } from "@clerk/nextjs";

function Profile() {
  const session = useSession();

  return (
    <div className="flex items-center gap-3 px-4 py-4">
      <Avatar className="h-10 w-10 ring-2 ring-white/20">
        <AvatarImage src="/placeholder-user.jpg" alt="User" />
        <AvatarFallback>AD</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">
          {session.session?.user.fullName}
        </p>
        <SignOutButton />
      </div>
    </div>
  );
}

export default Profile;
