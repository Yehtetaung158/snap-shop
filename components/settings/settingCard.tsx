import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

type AuthFormProps = {
  children: React.ReactNode;
  formTitle?: string;
  description?: string;
};

const SettingCard = ({ children, formTitle, description }: AuthFormProps) => {
  return (
    <div>
      <Card>
        <CardHeader>
          {formTitle && <CardTitle>{formTitle}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
          <CardContent>{children}</CardContent>
        </CardHeader>
      </Card>
    </div>
  );
};

export default SettingCard;
