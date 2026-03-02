import { StaticProjectRepository } from "@/contexts/projects/infrastructure/StaticProjectRepository";
import { getProjects } from "@/contexts/projects/use-cases/GetProjects";

import ProyectosClient from "./ProyectosClient";

export default async function ProyectosPage() {
  const projects = await getProjects(new StaticProjectRepository());
  return <ProyectosClient projects={projects} />;
}
