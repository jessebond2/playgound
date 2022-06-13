import Link from "next/link";

export const Header: React.FC = () => {
  return (
    <div>
      <Link href="/">Home</Link>
      <Link href="/prices">Prices</Link>
      <Link href="/foundry">Foundry</Link>
    </div>
  );
};
