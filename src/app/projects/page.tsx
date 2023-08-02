import { productsTitle } from "@/data/projects/projects";
import Link from "next/link";
import { FolderIcon } from "@/utils/Images";

export default function Projects() {
  const folders = [
    { id: "1", name: "Folder 1" },
    { id: "2", name: "Folder 2" },
    { id: "3", name: "Folder 3" },
    { id: "4", name: "Folder 4" },
    { id: "5", name: "Folder 5" },
    { id: "6", name: "Folder 6" },
    { id: "7", name: "Folder 7" },
    { id: "8", name: "Folder 8" },
    { id: "9", name: "Folder 9" },
  ];
  return (
    <main className="min-h-[calc(100vh-15.5rem)] font-secondary text-primary  bg-secondary flex flex-col">
      <h1 className=" w-full text-center text-4xl p-2 shadow-lg">
        {productsTitle}
      </h1>
      <section className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 h-full gap-6 self-center w-full justify-center p-6">
        {folders.map((key, index) => (
          <Link
            href={"/project/" + key.id}
            key={index}
            className="aspect-square flex flex-col"
          >
            <div className="h-full">
              <FolderIcon />
            </div>
            <h1 className="text-center">{key.name}</h1>
          </Link>
        ))}
      </section>
    </main>
  );
}
