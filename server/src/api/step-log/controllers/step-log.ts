import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::step-log.step-log' as any,
  ({ strapi }) => ({
    async create(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized("Login required");

    const { steps, calories, date } = ctx.request.body.data;

    // Check if entry already exists for today
    const existing = await strapi.entityService.findMany(
        "api::step-log.step-log",
        {
        filters: {
            users_permissions_user: user.id,
            date: date,
        },
        }
    );

    // If exists → update it
    if (existing.length > 0) {
        const updated = await strapi.entityService.update(
        "api::step-log.step-log",
        existing[0].id,
        {
            data: {
            steps,
            calories,
            },
        }
        );
        return updated;
    }

    // Otherwise → create new
    const entry = await strapi.entityService.create(
        "api::step-log.step-log",
        {
        data: {
            steps,
            calories,
            date,
            users_permissions_user: user.id,
        },
        }
    );

    return entry;
    },

    async find(ctx) {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized("Login required");

      return await strapi.entityService.findMany(
        "api::step-log.step-log" as any,
        {
          filters: { users_permissions_user: user.id },
        }
      );
    },
  })
);