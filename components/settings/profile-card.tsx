"use client";

import { Session } from "next-auth";
import React, { useState } from "react";
import { UserRoundPen } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useMediaQuery from "@/hooks/useMediaQuery";
import { Button } from "../ui/button";
import ProfileForm from "./profile-form";
import AvatarUploadForm from "./avatar-upload-form";

type ProfileCardProps = {
  session: Session;
};

const ProfileCard = ({ session }: ProfileCardProps) => {
  const isDesktop = useMediaQuery("(min-width: 720px)");
  const [isOpen, setIsOpen] = useState(false);
  const handelSetIsOpen = () => {
      setIsOpen(false);
    };
  

  return (
    <div className="flex px-2 py-4 items-center justify-between w-full">
      <div className="flex gap-2 items-center">
       <AvatarUploadForm image={session?.user?.image} name={session?.user?.name} email={session?.user?.email}/>
        <div>
          <h3>{session?.user?.name}</h3>
          <h3>{session?.user?.email}</h3>
        </div>
      </div>
      <div>
        {isDesktop ? (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger>
              <UserRoundPen className="w-5 h-5" />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Update your profile information.
                </DialogDescription>
              </DialogHeader>
              <ProfileForm session={session} setIsOpen={handelSetIsOpen} />
            </DialogContent>
          </Dialog>
        ) : (
          <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger>
              <UserRoundPen className="w-5 h-5" />
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Edit Profile</DrawerTitle>
                <DrawerDescription>
                  Update your profile information.
                </DrawerDescription>
              </DrawerHeader>
              <div className="p-4">
                <ProfileForm session={session} setIsOpen={handelSetIsOpen} />
              </div>
              <DrawerFooter>
                <DrawerClose>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
