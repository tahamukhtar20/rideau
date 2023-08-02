import Image from "next/image";
import LogoSVG from "@/assets/svg/Logo.svg";
import Hamburger from "@/assets/svg/Hamburger.svg";
import Instagram from "@/assets/svg/Instagram.svg";
import Profile from "@/assets/svg/Profile.svg";
import Folder from "@/assets/svg/Folder.svg";
import Arrow from "@/assets/svg/Arrow.svg";

export const HamburgerIcon = () => (
  <Image src={Hamburger} alt="hamburger" style={{ objectFit: "contain" }} />
);

export const Logo = () => (
  <Image src={LogoSVG} alt="logo" style={{ objectFit: "contain" }} />
);

export const ProfileIcon = () => (
  <Image src={Profile} alt={"profile-icon"} style={{ objectFit: "contain" }} />
);

export const InstagramIcon = () => (
  <Image src={Instagram} alt="instagram" style={{ objectFit: "contain" }} />
);

export const FolderIcon = () => (
  <>
    <Image src={Folder} alt="folder" style={{ objectFit: "contain" }} />
  </>
);

export const ArrowDown = () => (
  <>
    <Image
      src={Arrow}
      alt="arrow-down"
      style={{
        // objectFit: "contain",
        // rotate: "180deg",
        position: "static",
        zIndex: 0,
      }}
    />
  </>
);
