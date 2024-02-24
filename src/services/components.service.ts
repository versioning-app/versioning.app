import { db } from '@/database/db';
import { Component, NewComponent, components } from '@/database/schema';
import { AppError } from '@/lib/error/app.error';
import { ErrorCodes } from '@/lib/error/error-codes';
import { WorkspaceScopedService } from '@/services/workspace-scoped-service';
import { and, eq } from 'drizzle-orm';
import 'server-only';

export class ComponentsService extends WorkspaceScopedService {
  public constructor() {
    super();
  }

  public async getComponents(): Promise<Component[] | undefined> {
    const workspaceId = await this.currentWorkspaceId;

    const allComponents = await db
      .select()
      .from(components)
      .where(eq(components.workspaceId, workspaceId));

    this.logger.debug({ allComponents }, 'Components found');

    return allComponents;
  }

  public async getComponentByName(
    name: string,
  ): Promise<Component | undefined> {
    const workspaceId = await this.currentWorkspaceId;

    const [component] = await db
      .select()
      .from(components)
      .where(
        and(eq(components.workspaceId, workspaceId), eq(components.name, name)),
      );

    this.logger.debug({ component }, 'Component found');

    return component;
  }

  public async createComponent({
    name,
    description,
  }: Pick<NewComponent, 'name' | 'description'>) {
    const workspaceId = await this.currentWorkspaceId;
    const existing = await this.getComponentByName(name);

    if (existing) {
      throw new AppError(
        'A component with the same name already exists',
        ErrorCodes.RESOURCE_ALREADY_EXISTS,
      );
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

  public async deleteComponent(componentId: string) {
    const workspaceId = await this.currentWorkspaceId;

    const [deletedComponent] = await db
      .delete(components)
      .where(
        and(
          eq(components.workspaceId, workspaceId),
          eq(components.id, componentId),
        ),
      )
      .returning();

    if (!deletedComponent) {
      this.logger.error({ componentId }, 'Component not found');

      throw new AppError('Component not found', ErrorCodes.RESOURCE_NOT_FOUND);
    }

    this.logger.info({ deletedComponent }, 'Component deleted');
  }
}
