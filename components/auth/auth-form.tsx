import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import ProviderLogin from "./providerLogin";
import AuthFooter from "./authFooter";

type AuthFormProps = {
  children: React.ReactNode;
  formTitle: string;
  showProvider: boolean;
  footerLabel: string;
  footerHref: string;
};

const AuthForm = ({
  children,
  formTitle,
  showProvider,
  footerLabel,
  footerHref,
}: AuthFormProps) => {
  return (
    <div>
      <Card>
        <CardHeader>{formTitle}</CardHeader>
        <CardContent>{children}</CardContent>
        <CardFooter>
          {showProvider && <ProviderLogin />}
          <AuthFooter footerLabel={footerLabel} footerHref={footerHref} />
        </CardFooter>
      </Card>
    </div> 
  );
};

export default AuthForm;
