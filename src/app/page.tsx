import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <Button>Click me</Button>
      <Image src="/logo.svg" alt="Logo" width={200} height={200} />
    </main>
  );
}
