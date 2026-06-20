import { GuestRoute } from "@/components/auth/guest-route";

export default function AuthGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GuestRoute>{children}</GuestRoute>;
}
