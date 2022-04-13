import { ModulesMasterRepository } from "../../../core/repository/master/modules/modules.master.repository";
import { ModulesEnterpriseRepository } from "../../../core/repository/enterprise/modules/modules-repository";

export class GetModulesByEnterpriseIdUsecase {
  constructor(
    private modulesEnterpriseRepository: ModulesEnterpriseRepository,
    private modulesMasterRepository: ModulesMasterRepository
  ) {}

  async call(body: any) {
    let response = [];
    const adquiredModules = await this.modulesEnterpriseRepository.getModules();
    for (const mod of adquiredModules) {
      const moduleInside = await this.modulesMasterRepository.getModuleById(
        mod["module_id"]
      );
      response.push({
        module: moduleInside,
        custom_name: mod["custom_name"],
      });
    }

    return response;
  }
}
