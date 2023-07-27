import Image from "next/image";
import LogoSVG from "./SVGFiles/Logo.svg";
import Hamburger from "./SVGFiles/Hamburger.svg";

export const HamburgerIcon = () => (
  <Image src={Hamburger} alt="hamburger" style={{ objectFit: "contain" }} />
);

export const Logo = () => (
  <Image src={LogoSVG} alt="Logo" style={{ objectFit: "contain" }} />
);

export const ProfileIcon = () => <></>;
