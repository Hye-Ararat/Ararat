import InstanceShell from "./InstanceShell";

export default function DashboardLayout({ children }) {
  return (
    <>
      <InstanceShell />
      {children}
    </>
  );
}
