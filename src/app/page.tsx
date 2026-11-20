import { HeroSection } from "@/components/hero-section";
import { CategoryStrip } from "@/components/category-strip";
import { LatestServices } from "@/components/latest-services";
import { HowItWorks } from "@/components/how-it-works";
import { TrustBand } from "@/components/trust-band";
import { PopularCategories } from "@/components/popular-categories";
import { Testimonials } from "@/components/testimonials";
import { CtaSection } from "@/components/cta";
import { SiteFooter } from "@/components/site-footer";
import { HomeMotion } from "@/components/home-motion";

export default function Home() {
  return (
    <>
      <HomeMotion />

      <main className="flex-1 bg-[#f6f4ee] dark:bg-[#080f0c]">
        <div className="relative overflow-hidden">
          {/* Warm light on the left, soft green on the right. */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,#f7f6f1_0%,#f5f4ee_42%,#e9f1e7_72%,#dfece2_100%)] dark:bg-[linear-gradient(105deg,#050d09_0%,#04100b_45%,#06170f_75%,#04100b_100%)]" />

          {/* Extra glow behind the repair illustration. */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_32%,rgba(82,183,137,0.16),transparent_45%)] dark:bg-[radial-gradient(circle_at_78%_32%,rgba(38,160,112,0.20),transparent_44%)]" />

          <HeroSection />
        </div>

        <CategoryStrip />
        <LatestServices />
        <HowItWorks />
        <TrustBand />
        <PopularCategories />
        <Testimonials />
        <CtaSection />
      </main>

      <SiteFooter />
    </>
  );
}
