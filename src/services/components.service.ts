import { db } from '@/database/db';
import { Component, NewComponent, components } from '@/database/schema';
import { BaseService } from '@/services/base.service';
import { EntityService } from '@/services/entity.service';
import { ServiceFactory } from '@/services/service-factory';
import { and, eq } from 'drizzle-orm';
import 'server-only';

export class ComponentsService extends BaseService {
  public constructor() {
    super();
  }

  public async getComponents(): Promise<Component[] | undefined> {
    const entity = await ServiceFactory.get(EntityService).currentEntity();

    const allComponents = await db
      .select()
      .from(components)
      .where(eq(components.entityId, entity.id));

    this.logger.debug({ allComponents }, 'Components found');

    return allComponents;
  }

  public async getComponentByName(
    name: string
  ): Promise<Component | undefined> {
    const entity = await ServiceFactory.get(EntityService).currentEntity();

    const [component] = await db
      .select()
      .from(components)
      .where(
        and(eq(components.entityId, entity.id), eq(components.name, name))
      );

    this.logger.debug({ component }, 'Component found');

    return component;
  }

  public async createComponent({
    name,
    description,
  }: Pick<NewComponent, 'name' | 'description'>) {
    const entity = await ServiceFactory.get(EntityService).currentEntity();

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
        entityId: entity.id,
      })
      .returning();

    this.logger.info({ newComponent }, 'Component created');

    return newComponent;
  }
}
