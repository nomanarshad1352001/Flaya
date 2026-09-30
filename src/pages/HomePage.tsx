import { useEffect } from "react";
import { PRODUCTS } from "../data/store";
import { track } from "../lib/shop";
import ProductRail from "../components/ProductRail";
import AutoProductRail from "../components/AutoProductRail";
import { CapsuleEditorial, CategoryMosaic, CommunitySection, Hero, ReviewsSection, TrustStrip } from "../components/home-sections";

const newCollection = PRODUCTS.filter((p) => p.badge === "new");
const bestSellers = PRODUCTS.filter((p) => p.badge === "bestseller");
const abayaEdit = PRODUCTS.filter((p) => p.category === "abayas");

export default function HomePage() {
  useEffect(() => {
    track("view_item_list", { list: "home" });
  }, []);

  return (
    <main>
      <Hero />
      <TrustStrip />
      <div className="space-y-20 pt-16 md:space-y-28 md:pt-24">
        <CategoryMosaic />
        <AutoProductRail
          kicker="Just Landed · SS26"
          title="The New Collection"
          note="Fresh silhouettes in this season’s palette — Velvet Abayas, Aura Sets and capsule bases, gliding in daily."
          products={newCollection.slice(0, 12)}
          viewAllHref="#/shop/new"
          duration="95s"
        />
        <CapsuleEditorial />
        <AutoProductRail
          kicker="Most Loved"
          title="Best Sellers"
          note="The pieces our community reorders, gifts and styles on repeat."
          products={bestSellers.slice(0, 12)}
          viewAllHref="#/shop/best-sellers"
          reverse
          duration="110s"
        />
        <ProductRail
          kicker="The House Signature"
          title="The Abaya Edit"
          note="From sculpted classics to velvet capes — the silhouette FLAYA is known for, in every shade of the season."
          products={abayaEdit.slice(0, 10)}
          viewAllHref="#/shop/abayas"
        />
        <ReviewsSection />
        <CommunitySection />
      </div>
    </main>
  );
}
