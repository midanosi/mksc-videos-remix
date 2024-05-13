import { useContext } from "react";
import { AdminContext } from "~/context/AdminContext";

export function ShowIfAdmin(
  props: React.PropsWithChildren
): React.JSX.Element | null {
  const { isAdmin } = useContext(AdminContext);
  const { children } = props;

  return isAdmin ? <>{children}</> : null;
}
export function ShowIfNotAdmin(
  props: React.PropsWithChildren
): React.JSX.Element | null {
  const { isAdmin } = useContext(AdminContext);
  const { children } = props;

  return !isAdmin ? <>{children}</> : null;
}
