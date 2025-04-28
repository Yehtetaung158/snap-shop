import Link from "next/link";
import React from "react";
type AuthFooterProps = {
  footerLabel: string;
  footerHref: string;
};

const AuthFooter = ({ footerLabel, footerHref }: AuthFooterProps) => {
  return (
    <Link href={footerHref} className="text-sm text-muted-foreground">
      {footerLabel}
    </Link>
  );
};

export default AuthFooter;
