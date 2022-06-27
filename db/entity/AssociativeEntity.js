import Entity from "./Entity";

export default class AssociativeEntity extends Entity {
  /** @type {Entity[]} */
  #entities;

  /**
   * @param {string} name
   * @param {Entity} entity1
   * @param {Entity} entity2
   * @param {import("./Entity").Schema} schema
   */
  constructor(name, entity1, entity2, schema) {
    const entities = [entity1, entity2];

    super(name, {
      ...schema,
      primaryKey: entities
        .map((entity) => entity.getColumn(entity.primaryKey).asForeignKey)
        .flat(Infinity),
    });

    this.#entities = entities;

    for (const entity of this.entities) {
      for (const pk of entity.primaryKey) {
        const column = entity.getColumn(pk);

        this.addColumn(column.asForeignKey, column.type, {
          attributes: "NOT NULL",
        });
      }
    }
  }

  get entities() {
    return this.#entities;
  }
}
