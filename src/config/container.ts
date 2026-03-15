import "reflect-metadata";

import { ContainerBuilder } from "diod";

import { registerAuthContainer } from "@/contexts/auth/app/auth.container";
import { registerProjectsContainer } from "@/contexts/projects/app/projects.container";
import { registerServicesContainer } from "@/contexts/services/app/services.container";
import { registerSharedContainer } from "@/contexts/shared/app/shared.container";
import { registerTestimonialsContainer } from "@/contexts/testimonials/app/testimonials.container";

const builder = new ContainerBuilder();

registerAuthContainer(builder);
registerProjectsContainer(builder);
registerServicesContainer(builder);
registerSharedContainer(builder);
registerTestimonialsContainer(builder);

export const container = builder.build();
