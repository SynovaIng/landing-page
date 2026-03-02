import "reflect-metadata";

import { ContainerBuilder } from "diod";

import { registerProjectsContainer } from "@/contexts/projects/app/projects.container";
import { registerServicesContainer } from "@/contexts/services/app/services.container";
import { registerTestimonialsContainer } from "@/contexts/testimonials/app/testimonials.container";

const builder = new ContainerBuilder();

registerProjectsContainer(builder);
registerServicesContainer(builder);
registerTestimonialsContainer(builder);

export const container = builder.build();
