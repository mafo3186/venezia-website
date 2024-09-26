import Page, { Props } from "@/app/(home)/projects/[slug]/page";

export default async function MyPage({ params } : Props) {
  return <Page params={params} />;
}