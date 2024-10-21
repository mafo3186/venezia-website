import ProjectPage, { Props } from "@/components/projectPage/projectPage";
export {
  generateMetadata,
  generateStaticParams,
} from "@/components/projectPage/projectPage";

export default async function ProjectPageList({ params }: Props) {
  return <ProjectPage params={params} />;
}
