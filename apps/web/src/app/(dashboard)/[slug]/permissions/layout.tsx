'use client';

import DashboardPageLayout from '@/components/dashboard/layouts/page-layout';
import { Navigation } from '@/config/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PermissionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? ''; // safer fallback
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('evaluator');

  useEffect(() => {
    if (pathname.endsWith('/details')) {
      setActiveTab('details');
    } else {
      setActiveTab('evaluator');
    }
  }, [pathname]);

  return (
    <DashboardPageLayout
      slug={slug}
      page={
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-primary">Permissions</h1>
          </div>
          <Tabs value={activeTab} className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="evaluator" asChild className="w-1/2">
                <Link href={`/${slug}/permissions`}>Ad-hoc Evaluator</Link>
              </TabsTrigger>
              <TabsTrigger value="details" asChild className="w-1/2">
                <Link href={`/${slug}/permissions/details`}>Details</Link>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="evaluator" className="mt-6">
              {activeTab === 'evaluator' && children}
            </TabsContent>
            <TabsContent value="details" className="mt-6">
              {activeTab === 'details' && children}
            </TabsContent>
          </Tabs>
        </div>
      }
      resource="Permissions"
      href={Navigation.DASHBOARD_PERMISSIONS}
    />
  );
}
