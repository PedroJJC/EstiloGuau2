import React from "react";
import {
  Footer,
  FooterBrand,
  FooterCopyright,
  FooterDivider,
  FooterIcon
} from "flowbite-react";
import Logo from "../../img/Logo.png"
import { BsDribbble, BsFacebook, BsGithub, BsInstagram, BsTwitter } from "react-icons/bs";

const FooterLanding = () => {
  return (
    <section>
      <Footer container className="bg-black ">
      <div className="w-full ">
        <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
         {/* <div>
            <FooterBrand
              href=""
              className=" block h-20 w-auto" 
              src="../../images/Logo.png"
              alt="Flowbite Logo"
              name="Flowbite"
            />
          </div>
          <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <FooterTitle title="about" />
              <FooterLinkGroup col>
                <FooterLink href="#">Estilo Guau</FooterLink>
                <FooterLink href="#"></FooterLink>
              </FooterLinkGroup>
            </div>
            <div>
              <FooterTitle title="Follow us" />
              <FooterLinkGroup col>
                <FooterLink href="#">Github</FooterLink>
                <FooterLink href="#">Discord</FooterLink>
              </FooterLinkGroup>
            </div>
            <div>
              <FooterTitle title="Legal" />
              <FooterLinkGroup col>
                <FooterLink href="#">Privacy Policy</FooterLink>
                <FooterLink href="#">Terms &amp; Conditions</FooterLink>
              </FooterLinkGroup>
            </div>
          </div>*/}
        </div>
        <FooterDivider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
        <div>
            <FooterBrand
              href=""
              className=" block h-20 w-auto" 
              src={Logo}
              alt="Flowbite Logo"
              name="Flowbite"
            />
          </div>
          <FooterCopyright href="#" by="Estilo Guau" year={2024} />
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
            <FooterIcon href="https://www.facebook.com/profile.php?id=100078000248567&sk=about" icon={BsFacebook} />
            <FooterIcon href="#" icon={BsInstagram} />
            <FooterIcon href="#" icon={BsTwitter} />
            <FooterIcon href="#" icon={BsGithub} />
            <FooterIcon href="#" icon={BsDribbble} />
          </div>
        </div>
      </div>
    </Footer>
    </section>
  );
};

export default FooterLanding;
