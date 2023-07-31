import Image from "next/image";
import LogoSVG from "@/assets/svg/Logo.svg";
import Hamburger from "@/assets/svg/Hamburger.svg";

export const HamburgerIcon = () => (
  <Image src={Hamburger} alt="hamburger" style={{ objectFit: "contain" }} />
);

export const Logo = () => (
  <Image src={LogoSVG} alt="Logo" style={{ objectFit: "contain" }} />
);

export const ProfileIcon = () => <></>;
