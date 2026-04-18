export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string;
          full_name: string;
          role: "owner" | "manager" | "editor";
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          role?: "owner" | "manager" | "editor";
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          role?: "owner" | "manager" | "editor";
          is_active?: boolean;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          icon_url: string | null;
          color: string | null;
          sort_order: number;
          seo_title: string | null;
          seo_description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          icon_url?: string | null;
          color?: string | null;
          sort_order?: number;
          seo_title?: string | null;
          seo_description?: string | null;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          icon_url?: string | null;
          color?: string | null;
          sort_order?: number;
          seo_title?: string | null;
          seo_description?: string | null;
        };
        Relationships: [];
      };
      tags: {
        Row: {
          id: string;
          name: string;
          slug: string;
          color: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          color?: string | null;
        };
        Update: {
          name?: string;
          slug?: string;
          color?: string | null;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          category_id: string | null;
          name: string;
          slug: string;
          short_desc: string | null;
          description: string | null;
          hero_image_url: string | null;
          images: string[] | null;
          price_per_day: number | null;
          price_per_3days: number | null;
          price_per_7days: number;
          min_rental_days: 1 | 3 | 7;
          requires_deposit: boolean;
          deposit_amount: number | null;
          deposit_note: string | null;
          is_available: boolean;
          is_featured: boolean;
          is_active: boolean;
          stock_qty: number;
          weight_kg: number | null;
          dimensions_cm: string | null;
          seo_title: string | null;
          seo_description: string | null;
          seo_keywords: string[] | null;
          schema_json: Json | null;
          view_count: number;
          inquiry_count: number;
          sort_order: number;
          faq: Array<{ question: string; answer: string }> | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id?: string | null;
          name: string;
          slug: string;
          short_desc?: string | null;
          description?: string | null;
          hero_image_url?: string | null;
          images?: string[] | null;
          price_per_day?: number | null;
          price_per_3days?: number | null;
          price_per_7days: number;
          min_rental_days?: 1 | 3 | 7;
          requires_deposit?: boolean;
          deposit_amount?: number | null;
          deposit_note?: string | null;
          is_available?: boolean;
          is_featured?: boolean;
          is_active?: boolean;
          stock_qty?: number;
          weight_kg?: number | null;
          dimensions_cm?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          seo_keywords?: string[] | null;
          schema_json?: Json | null;
          sort_order?: number;
          faq?: Array<{ question: string; answer: string }> | null;
        };
        Update: {
          category_id?: string | null;
          name?: string;
          slug?: string;
          short_desc?: string | null;
          description?: string | null;
          hero_image_url?: string | null;
          images?: string[] | null;
          price_per_day?: number | null;
          price_per_3days?: number | null;
          price_per_7days?: number;
          min_rental_days?: 1 | 3 | 7;
          requires_deposit?: boolean;
          deposit_amount?: number | null;
          deposit_note?: string | null;
          is_available?: boolean;
          is_featured?: boolean;
          is_active?: boolean;
          stock_qty?: number;
          weight_kg?: number | null;
          dimensions_cm?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          seo_keywords?: string[] | null;
          schema_json?: Json | null;
          sort_order?: number;
          faq?: Array<{ question: string; answer: string }> | null;
        };
        Relationships: [];
      };
      product_tags: {
        Row: { product_id: string; tag_id: string };
        Insert: { product_id: string; tag_id: string };
        Update: { product_id?: string; tag_id?: string };
        Relationships: [];
      };
      product_relations: {
        Row: {
          product_id: string;
          related_id: string;
          type: "connected" | "suggested";
          sort_order: number;
        };
        Insert: {
          product_id: string;
          related_id: string;
          type: "connected" | "suggested";
          sort_order?: number;
        };
        Update: { sort_order?: number };
        Relationships: [];
      };
      bundles: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          hero_image_url: string | null;
          discount_type: "percent" | "fixed" | null;
          discount_value: number | null;
          is_active: boolean;
          is_featured: boolean;
          seo_title: string | null;
          seo_description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          hero_image_url?: string | null;
          discount_type?: "percent" | "fixed" | null;
          discount_value?: number | null;
          is_active?: boolean;
          is_featured?: boolean;
          seo_title?: string | null;
          seo_description?: string | null;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          hero_image_url?: string | null;
          discount_type?: "percent" | "fixed" | null;
          discount_value?: number | null;
          is_active?: boolean;
          is_featured?: boolean;
          seo_title?: string | null;
          seo_description?: string | null;
        };
        Relationships: [];
      };
      bundle_products: {
        Row: { bundle_id: string; product_id: string; qty: number };
        Insert: { bundle_id: string; product_id: string; qty?: number };
        Update: { qty?: number };
        Relationships: [];
      };
      promotions: {
        Row: {
          id: string;
          name: string;
          code: string | null;
          discount_type: "percent" | "fixed" | "free_day";
          discount_value: number | null;
          applies_to: "all" | "category" | "product" | "bundle";
          applies_to_id: string | null;
          min_days: number | null;
          starts_at: string | null;
          ends_at: string | null;
          usage_limit: number | null;
          usage_count: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code?: string | null;
          discount_type: "percent" | "fixed" | "free_day";
          discount_value?: number | null;
          applies_to: "all" | "category" | "product" | "bundle";
          applies_to_id?: string | null;
          min_days?: number | null;
          starts_at?: string | null;
          ends_at?: string | null;
          usage_limit?: number | null;
          is_active?: boolean;
        };
        Update: {
          name?: string;
          code?: string | null;
          discount_type?: "percent" | "fixed" | "free_day";
          discount_value?: number | null;
          applies_to?: "all" | "category" | "product" | "bundle";
          applies_to_id?: string | null;
          min_days?: number | null;
          starts_at?: string | null;
          ends_at?: string | null;
          usage_limit?: number | null;
          is_active?: boolean;
        };
        Relationships: [];
      };
      availability: {
        Row: {
          id: string;
          product_id: string;
          date: string;
          qty_booked: number;
          note: string | null;
        };
        Insert: {
          id?: string;
          product_id: string;
          date: string;
          qty_booked?: number;
          note?: string | null;
        };
        Update: { qty_booked?: number; note?: string | null };
        Relationships: [];
      };
      inquiries: {
        Row: {
          id: string;
          inquiry_number: string;
          status: "new" | "read" | "replied" | "confirmed" | "cancelled";
          customer_name: string;
          customer_email: string;
          customer_phone: string | null;
          company_name: string | null;
          company_oib: string | null;
          company_address: string | null;
          needs_r1_invoice: boolean;
          delivery_type: "pickup" | "delivery";
          delivery_address: string | null;
          delivery_fee: number;
          rental_start: string | null;
          rental_end: string | null;
          message: string | null;
          accepted_liability_terms: boolean;
          promo_code: string | null;
          discount_amount: number;
          subtotal_estimate: number | null;
          total_estimate: number | null;
          items: Json;
          source_url: string | null;
          utm_source: string | null;
          utm_medium: string | null;
          utm_campaign: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          inquiry_number: string;
          status?: "new" | "read" | "replied" | "confirmed" | "cancelled";
          customer_name: string;
          customer_email: string;
          customer_phone?: string | null;
          company_name?: string | null;
          company_oib?: string | null;
          company_address?: string | null;
          needs_r1_invoice?: boolean;
          delivery_type?: "pickup" | "delivery";
          delivery_address?: string | null;
          delivery_fee?: number;
          rental_start?: string | null;
          rental_end?: string | null;
          message?: string | null;
          accepted_liability_terms?: boolean;
          promo_code?: string | null;
          discount_amount?: number;
          subtotal_estimate?: number | null;
          total_estimate?: number | null;
          items: Json;
          source_url?: string | null;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
        };
        Update: {
          status?: "new" | "read" | "replied" | "confirmed" | "cancelled";
        };
        Relationships: [];
      };
      testimonials: {
        Row: {
          id: string;
          author_name: string;
          author_role: string | null;
          content: string;
          rating: number;
          is_active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          author_name: string;
          author_role?: string | null;
          content: string;
          rating?: number;
          is_active?: boolean;
          sort_order?: number;
        };
        Update: {
          author_name?: string;
          author_role?: string | null;
          content?: string;
          rating?: number;
          is_active?: boolean;
          sort_order?: number;
        };
        Relationships: [];
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string | null;
          hero_image_url: string | null;
          author: string;
          category_id: string | null;
          tags: string[] | null;
          is_published: boolean;
          published_at: string | null;
          seo_title: string | null;
          seo_description: string | null;
          seo_keywords: string[] | null;
          reading_time: number | null;
          view_count: number;
          faq: Array<{ question: string; answer: string }> | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content?: string | null;
          hero_image_url?: string | null;
          author?: string;
          category_id?: string | null;
          tags?: string[] | null;
          is_published?: boolean;
          published_at?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          seo_keywords?: string[] | null;
          reading_time?: number | null;
          faq?: Array<{ question: string; answer: string }> | null;
        };
        Update: {
          title?: string;
          slug?: string;
          excerpt?: string | null;
          content?: string | null;
          hero_image_url?: string | null;
          author?: string;
          category_id?: string | null;
          tags?: string[] | null;
          is_published?: boolean;
          published_at?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          seo_keywords?: string[] | null;
          reading_time?: number | null;
          faq?: Array<{ question: string; answer: string }> | null;
        };
        Relationships: [];
      };
      seo_pages: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string | null;
          hero_image_url: string | null;
          is_published: boolean;
          seo_title: string | null;
          seo_description: string | null;
          seo_keywords: string[] | null;
          schema_json: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content?: string | null;
          hero_image_url?: string | null;
          is_published?: boolean;
          seo_title?: string | null;
          seo_description?: string | null;
          seo_keywords?: string[] | null;
          schema_json?: Json | null;
        };
        Update: {
          title?: string;
          slug?: string;
          content?: string | null;
          hero_image_url?: string | null;
          is_published?: boolean;
          seo_title?: string | null;
          seo_description?: string | null;
          seo_keywords?: string[] | null;
          schema_json?: Json | null;
        };
        Relationships: [];
      };
      settings: {
        Row: { key: string; value: Json };
        Insert: { key: string; value: Json };
        Update: { value?: Json };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
  };
}
