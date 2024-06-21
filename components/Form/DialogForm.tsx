import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Credentials } from "@/hooks/useStoreCredentials";
import { cn } from "@/lib/utils";
import { DialogProps } from "@radix-ui/react-dialog";

type Form = React.HTMLProps<HTMLFormElement>;

export type CredentialsDialogProps = {
  credentials: Credentials;
  onSubmit: Form["onSubmit"];
} & DialogProps;

export function CredentialsDialog(props: CredentialsDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={props.open} onOpenChange={props.onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Configuration du bus</DialogTitle>
            <DrawerDescription>Voir le mail du LFHED</DrawerDescription>
          </DialogHeader>
          <ProfileForm {...props} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={props.open} onOpenChange={props.onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Configuration du bus</DrawerTitle>
          <DrawerDescription>Voir le mail du LFHED</DrawerDescription>
        </DrawerHeader>
        <ProfileForm className="px-4" {...props} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function ProfileForm({
  className,
  credentials,
  onSubmit,
}: React.ComponentProps<"form"> & CredentialsDialogProps) {
  return (
    <>
      <form
        className={cn("grid items-start gap-4", className)}
        onSubmit={onSubmit}
        id="configuration"
      >
        <div className="grid gap-2">
          <Label htmlFor="route">Route</Label>
          <Input
            type="route"
            id="route"
            name="route"
            pattern="\d{2,2}"
            required
            defaultValue={credentials.route}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="code">code</Label>
          <Input
            type="number"
            name="code"
            id="code"
            pattern="\d{3,3}"
            required
            defaultValue={credentials.code}
          />
        </div>
        <Button type="submit">Ok</Button>
      </form>
    </>
  );
}
