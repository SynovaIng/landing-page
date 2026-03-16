import { Service } from "diod";

import { Project } from "@/contexts/projects/domain/project.entity";
import type {
  CreateProjectInput,
  UpdateProjectInput,
} from "@/contexts/projects/domain/project.repository";
import { ProjectRepository } from "@/contexts/projects/domain/project.repository";

const mockProjects: Project[] = [
  new Project({
    id: "iluminacion-las-condes",
    title: "Iluminación LED Las Condes",
    location: "Santiago, Las Condes",
    category: "Residencial",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAf3Sj43FzzIWZMuWxq-DGWXbdTtvViBxsOshZiNp-7Mz2KpSvnaryNcH0G1ud5NI4soMrWUzKHMmsEl8d3vDvn6mzpypp9jDvxMewT83ZhDUEsEEQ_eIKL4Mc1Xm0fdp8h5nXHKSWhV2hu0uExvdo4TAEW9VkOxChmuZfHPUBLfvbOVRF9gJ7bFTsLg67c9ZtJWkodnfoOEyZIie_MR6uoB_LFbVevX53rSWn8b8mAeLLcaxrGcBGAbAh5PryYdT8-boM2P48QgXyl",
    serviceIds: ["instalaciones", "mantencion"],
    orderIndex: 0,
  }),
  new Project({
    id: "tableros-quilicura",
    title: "Tableros Industriales Quilicura",
    location: "Santiago, Quilicura",
    category: "Industrial",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB7UThIV9Ysw-mqyPXB7fOkVPlOxyxu_pcXAKTlGb4Il-FxDtwB8me8fB5irlZmPxiMVP86GTpeSjXH-eop39DnSiCcl3y5T8htSAxnFirpeVwxXe4QwuT_m0uTuUltXSKUPd8lJYF4R55_633WdEnVN33z8Ofx1xftv-dlYT82wXtKCyvAHLlt7V2u5XTUlkPg04d8tAmB2b2YlCn-kbS5nVIjEJWn34LokKOMKKXHtjSWIdvd9ZVGn3UcPr0wXyDuvQ4E6P0-V2II",
    serviceIds: ["instalaciones", "certificaciones"],
    orderIndex: 1,
  }),
  new Project({
    id: "oficinas-providencia",
    title: "Remodelación Oficinas Providencia",
    location: "Santiago, Providencia",
    category: "Comercial",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC_Ph_WsBas_PmJYX-LPjK6Y9GFWKRDXbjOgSeQtvdi-JqowuUZ5NYNZ0dSxPym-trRQmzJn6spWlCNNtn9Y7UHTEh7LJJzybi5weYUUaDrmGIl2RjtTbcOImywqez_tXgu03GSdDLWiqm2WZzu8aRtAeCrbR2No1lEfRMCFFB1V_Lc7WdW4jmxxnIcFSq16B9qDhJlq_CTj3O1VYCI6umsBXxBvUinaw54CFduurjwlLqkunRzcKDlReVD6tn2qyRudXFYTdv-b7E7",
    serviceIds: ["emergencias"],
    orderIndex: 2,
  }),
  new Project({
    id: "condominio-la-dehesa",
    title: "Condominio La Dehesa",
    location: "Santiago, Lo Barnechea",
    category: "Residencial",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCWez-R1Xd48PkbAUm61jEklX545YoHcykTg7RMPcYz_GcJS4YLS_MxC-I7TLOEnhBAj2ebimsfKhPCHVcdQqVei1FuBLSCSHt_ejcrUbWhARwgKKnsVW57XWCwuNZwypbXTqLWHhAJdZTlOuX-y-JvV7bCnNYN-wcLEwORGJSusfKcgYa0rCEchLQg-2WTrD1FxUZ9VzirbHyKEfi3r8N1lEHdUvrj49hBhydnrTylXiDche9L5X8SIqZOsnW1MpZ3k628Twk_1VK0",
    serviceIds: ["mantencion"],
    orderIndex: 3,
  }),
  new Project({
    id: "planta-fotovoltaica-maipu",
    title: "Planta Fotovoltaica Maipú",
    location: "Santiago, Maipú",
    category: "Industrial",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCbelcB55Tii9jCB8BqrDjtypQRO7C6lxege90cUxHMyD46GZ5d7XDTvlplUwlh495IMa9er0gvm8mFOulVfyi7G2ka2qk_Kl2cUow4F1moVej2qB_Uq5OiUe0b3XrHfwOw1h41I0qkM7cg9MaTgY61MlzQ6LRz6iadLJhuPw2Wj5FieICWHdRzseNZr42_zwZO6WHZdpSKN54PJnJUzS1G1UOhqSrwk99YF3Lubi6PSFQXYt5OM_bMG048MuXuD-FBzJziqbp7ix-8",
    serviceIds: ["instalaciones", "mantencion"],
    orderIndex: 4,
  }),
  new Project({
    id: "cableado-centro",
    title: "Cableado Estructurado Centro",
    location: "Santiago, Centro",
    category: "Comercial",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBc8fD3T_oaTbS4ZqTsiXsOUfDycQr0yHEZSnzF-cIcXDmsDgtK0Tc3Zo6nDRKcDkAvPGLgL0e9y-t08E8R7jhZrzhyiJL2VFUNVjIkemjIoy-otAbCBuNg0d5S5PZvtamQYG5hsYmpLlUfvP1MFTFSD7a61bAvDjaKj8YGLkF-qYZiXWsgaFWB_uYmqgKrntGJ_-dxgueqklrOA41pcTJjVoZlQ86KE_lqNgPuJ_gpHapThUeNPosCcL6X3CxJX5eBikI2dG5Wq0LC",
    serviceIds: ["instalaciones"],
    orderIndex: 5,
  }),
];

@Service()
export class MockProjectRepository extends ProjectRepository {
  async getAll(): Promise<Project[]> {
    return mockProjects;
  }

  async getById(id: string): Promise<Project | null> {
    return mockProjects.find((p) => p.id === id) ?? null;
  }

  async create(input: CreateProjectInput): Promise<Project> {
    const created = new Project({
      id: `project-${Date.now()}`,
      title: input.title,
      location: input.location,
      category: input.category as Project["category"],
      imageUrl: "",
      serviceIds: input.serviceIds,
      orderIndex: mockProjects.length,
    });

    mockProjects.unshift(created);
    return created;
  }

  async update(input: UpdateProjectInput): Promise<Project> {
    const index = mockProjects.findIndex((project) => project.id === input.id);

    if (index === -1) {
      throw new Error("Proyecto no encontrado");
    }

    const updated = new Project({
      id: input.id,
      title: input.title,
      location: input.location,
      category: input.category as Project["category"],
      imageUrl: mockProjects[index].imageUrl,
      serviceIds: input.serviceIds,
      orderIndex: mockProjects[index].orderIndex,
    });

    mockProjects[index] = updated;
    return updated;
  }

  async reorder(ids: string[]): Promise<void> {
    const nextById = new Map(mockProjects.map((project) => [project.id, project]));
    const reordered = ids
      .map((id, index) => {
        const project = nextById.get(id);

        if (!project) {
          return null;
        }

        return new Project({
          id: project.id,
          title: project.title,
          location: project.location,
          category: project.category,
          imageUrl: project.imageUrl,
          imageUrls: project.imageUrls,
          serviceIds: project.serviceIds,
          orderIndex: index,
        });
      })
      .filter((project): project is Project => project !== null);

    mockProjects.splice(0, mockProjects.length, ...reordered);
  }
}
