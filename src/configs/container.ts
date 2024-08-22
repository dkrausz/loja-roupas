// src/container.ts
import { container, DependencyContainer } from "tsyringe";

// Crie uma instância do container
const customContainer: DependencyContainer = container.createChildContainer();

// Exporta o container para uso em outras partes do código
export { customContainer };
