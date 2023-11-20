"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export default function Search({ data }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  console.log(data);

  const [isPending, startTransition] = useTransition();

  const onChange = (e) => {
    const updatedSearchParams = new URLSearchParams(searchParams);

    if (e.target.value) {
      updatedSearchParams.set("q", e.target.value);
    } else {
      updatedSearchParams.delete("q");
    }

    startTransition(() => {
      router.replace(`${pathname}?${updatedSearchParams.toString()}`);
    });
  };

  return (
    <div>
      <input type="text" onChange={onChange} />
      {isPending && <div>Loading...</div>}
    </div>
  );
}
