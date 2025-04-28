import ChangePassword from "@/components/settings/change-password";
import ProfileCard from "@/components/settings/profile-card";
import SettingLogOut from "@/components/settings/setting-logOut";
import SettingCard from "@/components/settings/settingCard";
import TwoFactor from "@/components/settings/twofactor";
import { Card } from "@/components/ui/card";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import React from "react";

const Settings = async () => {
  const session = await auth();
  if (!session?.user) return redirect("/");
  console.log("session", session.user);
  return (
    <>
    <h1 className=" text-2xl font-bold">Account Settings</h1>
    <SettingCard
      formTitle="Settings"
      description="Update your profile and security settings"
    >
      <main className=" grid grid-cols-2 mt-4 max-sm:grid-cols-1 w-full items-center gap-2 justify-between ">
        <Card className=" col-span-1 h-full flex items-center justify-center">
          <ProfileCard session={session!} />
        </Card>
        <div className=" col-span-1 flex flex-col gap-1 justify-center items-center w-full h-full">
          {!session.user.isOauth && (
            <>
              <ChangePassword email={session.user.email} />
              <TwoFactor
                isTwoFactorEnabled={session.user.isTwoFactorEnabled}
                email={session.user.email}
              />
              <SettingLogOut/>
            </>
          )}
        </div>
      </main>
    </SettingCard>
    </>
  );
};

export default Settings;
