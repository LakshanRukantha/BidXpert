"use client";

import {
  BadgeCheck,
  Bell,
  ChevronRight,
  ChevronsUpDown,
  Command,
  LifeBuoy,
  LogOut,
  Send,
  List,
  CreditCard,
  LayoutDashboard,
  PackageSearch,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ModeToggle from "./mode-toggle";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { getFirstLetters } from "@/lib/utils";

// Mock data for database emulation
const categories = [
  { id: 1, title: "Vehicles", url: "/?category=vehicles" },
  {
    id: 2,
    title: "Home & Property",
    url: "/?category=home-property",
  },
  { id: 3, title: "Electronics", url: "/?category=electronics" },
  { id: 4, title: "Fashion", url: "/?category=fashion" },
];

const data = {
  navMain: [
    {
      title: "Live Auctions",
      url: "/",
      icon: PackageSearch,
      // isActive: true,
      items: [
        // {
        //   title: "Sub Menu 1",
        //   url: "#",
        // },
      ],
    },
    {
      title: "Categories",
      url: "",
      icon: List,
      isActive: true,
      items: categories.map((category) => ({
        title: category.title,
        url: category.url,
      })),
    },
  ],
  navUserProtected: [
    {
      title: "Dashboard",
      url: "",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "My Bids",
          url: "/my-bids",
        },
        {
          title: "Create Auction",
          url: "/create-auction",
        },
        {
          title: "My Auctions",
          url: "/my-auctions",
        },
      ],
    },
    {
      title: "Live Auctions",
      url: "/",
      icon: PackageSearch,
      items: [],
    },
    {
      title: "Categories",
      url: "",
      isActive: false,
      icon: List,
      items: categories.map((category) => ({
        title: category.title,
        url: category.url,
      })),
    },
  ],
  navAdminProtected: [
    {
      title: "Admin Dashboard",
      url: "/admin-dashboard",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Manage Auctions",
          url: "manage-auctions",
        },
        {
          title: "User Management",
          url: "user-management",
        },
      ],
    },
    {
      title: "Live Auctions",
      url: "/",
      icon: PackageSearch,
      items: [],
    },
    {
      title: "Categories",
      url: "",
      isActive: false,
      icon: List,
      items: categories.map((category) => ({
        title: category.title,
        url: category.url,
      })),
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "/support",
      icon: LifeBuoy,
    },
    {
      title: "Contact Us",
      url: "/contact",
      icon: Send,
    },
  ],
};

export default function SideBar({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathName = usePathname();
  const session = useSession();
  const router = useRouter();

  const IS_LOGGED_IN = session && session.status === "authenticated";
  const IS_ADMIN = IS_LOGGED_IN && session.data.user.role === "admin";

  const navItems = IS_LOGGED_IN
    ? IS_ADMIN
      ? data.navAdminProtected
      : data.navUserProtected
    : data.navMain;
  return (
    <SidebarProvider>
      <Sidebar variant="sidebar">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                className="border border-transparent hover:border-gray-500/20 transition-colors"
                size="lg"
                asChild
              >
                <a href="/">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                    <Command className="size-6 text-primary" />
                  </div>
                  <h1 className="text-3xl">BidXpert</h1>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Explore</SidebarGroupLabel>
            <SidebarMenu>
              {navItems.map((item) => (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                    {item.items?.length ? (
                      <>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuAction className="data-[state=open]:rotate-90">
                            <ChevronRight />
                            <span className="sr-only">Toggle</span>
                          </SidebarMenuAction>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items?.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild>
                                  <a href={subItem.url}>
                                    <span>{subItem.title}</span>
                                  </a>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </>
                    ) : null}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <Separator />
          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <SidebarMenu>
                {data.navSecondary.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild size="sm">
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        {IS_LOGGED_IN ? (
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={""} alt={session.data.user.name} />
                        <AvatarFallback className="rounded-lg">
                          {getFirstLetters(session.data.user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {session.data.user.name}
                        </span>
                        <span className="truncate text-xs">
                          {session.data.user.email}
                        </span>
                      </div>
                      <ChevronsUpDown className="ml-auto size-4" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                    side="bottom"
                    align="end"
                    sideOffset={4}
                  >
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage src={""} alt={session.data.user.name} />
                          <AvatarFallback className="rounded-lg">
                            {getFirstLetters(session.data.user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">
                            {session.data.user.name}
                          </span>
                          <span className="truncate text-xs">
                            {session.data.user.email}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() => {
                          router.push("/account");
                        }}
                      >
                        <BadgeCheck />
                        Account
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          router.push("/transactions");
                        }}
                      >
                        <CreditCard />
                        Transactions
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          router.push("/notifications");
                        }}
                      >
                        <Bell />
                        Notifications
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
                      <LogOut />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        ) : (
          <SidebarFooter className="flex flex-row gap-2">
            <Link className="flex-1" href="/signup">
              <Button className="w-full" size={"sm"}>
                Sign Up
              </Button>
            </Link>
            <Link className="flex-1" href="/signin">
              <Button className="w-full" size={"sm"} variant={"secondary"}>
                Sign In
              </Button>
            </Link>
          </SidebarFooter>
        )}
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4 w-full justify-between">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1 scale-125" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {pathName.toUpperCase().split("/")}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <ModeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
