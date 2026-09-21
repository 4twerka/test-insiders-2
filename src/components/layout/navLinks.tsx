import { BooksIcon, BookmarkIcon, ShieldIcon, UserCircleIcon } from "@/components/icons";

type IconComponent = (props: { className?: string }) => React.JSX.Element;

export type NavLink = {
  href: string;
  label: string;
  icon: IconComponent;
  adminOnly?: boolean;
};

export const NAV_LINKS: NavLink[] = [
  { href: "/books", label: "Книги", icon: BooksIcon },
  { href: "/me/books", label: "Мої книги", icon: BookmarkIcon },
  { href: "/profile", label: "Профіль", icon: UserCircleIcon },
  { href: "/admin", label: "Адмін", icon: ShieldIcon, adminOnly: true },
];
