import { HTMLProps } from "react";

import { Credentials } from "@/hooks/useStoreCredentials";

type Form = HTMLProps<HTMLFormElement>;
export type CredentialsFormProps = {
  credentials: Credentials;
  onSubmit: Form["onSubmit"];
};
export const CredentialsForm = ({
  onSubmit,
  credentials,
}: CredentialsFormProps) => {
  return (
    <>
      {credentials.code === "" && credentials.route === "" && (
        <p>Merci de renseigner en premier les parametres</p>
      )}
      <form
        className="grid grid-cols-2 max-w-md gap-2 px-4 py-2"
        onSubmit={onSubmit}
      >
        <label htmlFor="route">Route</label>
        <input
          className="text-black invalid:bg-orange-400"
          type="text"
          name="route"
          id="route"
          pattern="\d{2,2}"
          required
          defaultValue={credentials.route}
        />

        <label htmlFor="code">Code</label>
        <input
          className="text-black invalid:bg-orange-400"
          type="number"
          name="code"
          id="code"
          pattern="\d{3,3}"
          required
          defaultValue={credentials.code}
        />
        <input type={"submit"} className="col-span-2 bg-gray-700" />
      </form>
    </>
  );
};
