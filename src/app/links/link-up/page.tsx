import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import UserSignOut from "@/components/UserSignOut";
import { UserService } from "@/services/UserService";
import { CompanyService } from "@/services/CompanyService";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import LinkUpClient from "./LinkUpClient";

// TODO: these are temporary, scanned id will be passed from  qr code
// scanner functionality, which is under works
// const scannedUserId = "9p4xbq0qs2ceg66r"; // company
const scannedUserId = "4yzop4p402c"; // member

export default async function LinkUp() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user: User = await UserService.getMe(session.cannonToken);
  if (!user) return <UserSignOut />;

  const scannedUser: User = await UserService.getUser(
    session.cannonToken,
    scannedUserId
  );
  if (!scannedUser) {
    console.log("Could not retrieve user!"); // TODO: alert instead
    redirect("/");
  }

  // verify that link pre-conditions are met
  let company!: Company;
  if (user.role === "company") {
    if (scannedUser.role === "company") {
      console.log("You can only link up with attendees!"); // TODO: alert instead
      redirect("/");
    }

    if (user.company.length == 0) {
      await UserService.demoteMe(session.cannonToken);
      redirect("/");
    } else {
      company = await CompanyService.getCompany(user.company[0].company);
      if (!company) {
        console.log("Could not perform operation!"); // TODO: alert instead
        redirect("/");
      }
    }
  } else {
    if (scannedUser.role !== "company") {
      console.log("You can only link up with companies!"); // TODO: alert instead
      return redirect("/");
    }

    if (
      scannedUser.company.length == 0 ||
      !(company = await CompanyService.getCompany(
        scannedUser.company[0]!.company
      ))
    ) {
      console.log("Could not perform operation!"); // TODO: alert instead
      return redirect("/");
    }
  }

  // verify that link doesn't already exist
  if (user.role === "company") {
    const link: LinkData = await CompanyService.getLink(
      session.cannonToken,
      company.id,
      scannedUser.id
    );
    if (link) {
      console.log("You have already linked with this attendee!"); // TODO: alert instead
      return redirect("/");
    }
  } else {
    const link: LinkData = await UserService.getLink(
      session.cannonToken,
      user.id,
      company.id
    );
    if (link) {
      console.log("You have already linked with this company!"); // TODO: alert instead
      return redirect("/");
    }
  }

  const handleCreateLink = async (formData: FormData) => {
    "use server";
    let success = false;

    if (user.role === "company") {
      success = await CompanyService.createLink(
        session.cannonToken,
        user.id,
        scannedUser.id,
        company.id,
        formData.get("notes") ? formData.get("notes")!.toString() : ""
      );
    } else {
      success = await UserService.createLink(
        session.cannonToken,
        user.id,
        scannedUser.id,
        company.id,
        formData.get("notes") ? formData.get("notes")!.toString() : ""
      );
    }

    if (success) {
      redirect("/links/link-up/success");
    } else {
      redirect("/links/link-up/failure");
    }
  };

  return (
    <LinkUpClient
      user={user}
      scannedUser={scannedUser}
      company={company}
      handleCreateLink={handleCreateLink}
    />
  );
}
