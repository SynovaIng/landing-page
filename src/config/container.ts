import "reflect-metadata";

import { ContainerBuilder } from "diod";

import { registerProjectsContainer } from "@/contexts/projects/app/projects.container";
import { registerServicesContainer } from "@/contexts/services/app/services.container";
import { registerSharedContainer } from "@/contexts/shared/app/shared.container";
import { registerTestimonialsContainer } from "@/contexts/testimonials/app/testimonials.container";

const builder = new ContainerBuilder();

registerProjectsContainer(builder);
registerServicesContainer(builder);
registerSharedContainer(builder);
registerTestimonialsContainer(builder);

export const container = builder.build();
