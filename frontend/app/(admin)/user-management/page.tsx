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
import { Pencil, Search, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    console.log("UserManagement page loaded");
    axios.get("https://localhost:7174/api/user/all").then((res) => {
      setUsers(res.data.data);
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
                  <Button variant={"secondary"}>
                    <Pencil />
                    <span className="hidden lg:block"> Edit</span>
                  </Button>
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
    </div>
  );
};

export default UserManagement;
