import { logo, options, profileIcon } from "@/data_fr/header";

export const Header: React.FC = () => {
  return (
    <header className="flex justify-between flex-row h-14 items-center px-2">
      <div className="">{logo}</div>
      {options.map((option, index) => (
        <a href={`/${option.slug}`} key={index} className="font-">
          {option.name}
        </a>
      ))}
      <div>{profileIcon}</div>
    </header>
  );
};
