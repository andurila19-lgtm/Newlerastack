// src/app/templates/[slug]/page.tsx
import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function TemplateDetailRedirectPage({ params }: PageProps) {
  const { slug } = await params;
  redirect(`/product/${slug}`);
}
