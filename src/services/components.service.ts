import { db } from '@/database/db';
import { Component, NewComponent, components } from '@/database/schema';
import { BaseService } from '@/services/base.service';
import { ServiceFactory } from '@/services/service-factory';
import { WorkspaceService } from '@/services/workspace.service';
import { and, eq } from 'drizzle-orm';
import 'server-only';

export class ComponentsService extends BaseService {
  public constructor() {
    super();
  }

  public async getComponents(): Promise<Component[] | undefined> {
    const workspaceId = await ServiceFactory.get(
      WorkspaceService
    ).currentWorkspaceId();

    const allComponents = await db
      .select()
      .from(components)
      .where(eq(components.workspaceId, workspaceId));

    this.logger.debug({ allComponents }, 'Components found');

    return allComponents;
  }

  public async getComponentByName(
    name: string
  ): Promise<Component | undefined> {
    const workspaceId = await ServiceFactory.get(
      WorkspaceService
    ).currentWorkspaceId();

    const [component] = await db
      .select()
      .from(components)
      .where(
        and(eq(components.workspaceId, workspaceId), eq(components.name, name))
      );

    this.logger.debug({ component }, 'Component found');

    return component;
  }

  public async createComponent({
    name,
    description,
  }: Pick<NewComponent, 'name' | 'description'>) {
    const workspaceId = await ServiceFactory.get(
      WorkspaceService
    ).currentWorkspaceId();

    const existing = await this.getComponentByName(name);

    if (existing) {
      this.logger.error({ name }, 'Component already exists');
      throw new Error('Component already exists');
    }

    const [newComponent] = await db
      .insert(components)
      .values({
        name,
        description,
        workspaceId,
      })
      .returning();

    this.logger.info({ newComponent }, 'Component created');

    return newComponent;
  }
}
