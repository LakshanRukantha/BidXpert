"use client";

import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoaderIcon, Pencil, Save, Search, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setLoading(true);
    axios.get("https://localhost:7174/api/user/all").then((res) => {
      const { data } = res.data;
      console.log(data[0]);
      setUsers(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="relative flex items-center flex-col">
      <div className="flex flex-col lg:flex-row gap-2 w-full mb-4">
        <Select>
          <SelectTrigger className="flex-auto lg:max-w-48 w-full">
            <SelectValue placeholder="User Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Type</SelectLabel>
              <SelectItem value="admin">Admin Users</SelectItem>
              <SelectItem value="standard">Standard Users</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input className="flex-grow" placeholder="Search for users..." />
        <Button className="lg:max-w-40 w-full">
          <Search />
          Search
        </Button>
      </div>
      {loading ? (
        <LoaderIcon className="animate-spin" />
      ) : (
        <Table className="relative">
          <TableCaption>A list of all users.</TableCaption>
          <TableHeader className="sticky top-4 bg-secondary">
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Registered On</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(
              (user: {
                userId: string;
                email: string;
                firstname: string;
                lastname: string;
                regDate: string;
              }) => (
                <TableRow key={user.userId}>
                  <TableCell className="font-medium">{user.userId}</TableCell>
                  <TableCell>{`${user.firstname} ${user.lastname}`}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {format(new Date(user.regDate), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell className="flex items-center gap-2 justify-end">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant={"secondary"}>
                          <Pencil />
                          <span className="hidden lg:block"> Edit</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Edit User Details</DialogTitle>
                          <DialogDescription>
                            Make changes to user details here. Click save when
                            you are done.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid py-4">
                          <Label htmlFor="fName" className="mb-1">
                            First Name
                          </Label>
                          <Input
                            id="fName"
                            name="fName"
                            placeholder="Enter user's first name"
                            className="mb-2"
                          />
                          <Label htmlFor="lName" className="mb-1">
                            Last Name
                          </Label>
                          <Input
                            id="lName"
                            name="lName"
                            placeholder="Enter user's last name"
                            className="mb-2"
                          />
                          <Label htmlFor="email" className="mb-1">
                            Email
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            placeholder="Enter email address"
                            className="mb-2"
                          />
                          <Label htmlFor="type" className="mb-1">
                            Type
                          </Label>
                          <Select onValueChange={(e) => console.log(e)}>
                            <SelectTrigger className="flex-auto w-full mb-2">
                              <SelectValue placeholder="Change User Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="standard">
                                  Standard
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <DialogFooter>
                          <Button type="submit">
                            <Save />
                            Save changes
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Button variant={"destructive"}>
                      <Trash2 />
                      <span className="hidden lg:block">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default UserManagement;
