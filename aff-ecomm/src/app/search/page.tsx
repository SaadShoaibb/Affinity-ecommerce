import SalesCampaignBanner from '@/components/layout/SalesCampaignBanner';
import ProductGrid from '@/components/product/ProductGrid';
import { getCategoryBySlug, getProductsByCategorySlug, searchProducts } from '@/sanity/lib/client';
import React from 'react';

type SearchPageProps = {
  searchParams: Promise<{ query: string }>;
};

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { query } = await searchParams;

  const products = await searchProducts(query);

  return (
    <div>
      <SalesCampaignBanner />

      {/* Search Results Header */}
      <div className="bg-purple-50 p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-purple-600 mb-2">
            Search Results for &quot;{query}&quot; - UP TO 90% OFF! 🔥
          </h1>
          <p className="text-center text-purple-500 text-sm md:text-base animate-pulse">
            ⚡️ Flash Sale Ending Soon! ⏰ Limited Time Only
          </p>
          <p className="text-center text-gray-600 text-xs mt-2">
            Discover amazing deals matching your search
          </p>
        </div>
      </div>

      {/* Guarantee Section */}
      <div className="bg-purple-50 py-3">
        <div className="container mx-auto">
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-black">
              <span className="text-purple-600">🚚</span>
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-2 text-black">
              <span className="text-purple-600">⭐️</span>
              <span>Top Rated</span>
            </div>
            <div className="flex items-center gap-2 text-black">
              <span className="text-purple-600">💰</span>
              <span>Best Prices</span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <section className="container mx-auto py-8">
        <div className="text-center mb-8">
          <p className="text-sm text-purple-600">
            🎉 {products.length} Amazing Deals Available Now!
          </p>
        </div>

        <ProductGrid products={products} />
      </section>
    </div>
  );
};

export default SearchPage;
