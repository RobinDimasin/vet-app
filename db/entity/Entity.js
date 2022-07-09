import { v4 as uuidv4 } from "uuid";
import pluralize from "pluralize";
import STATUS from "@db/status";
import { executeQuery } from "..";

/**
 * @typedef {Object} Column
 * @property {string} type
 * @property {string} asForeignKey
 * @property {string} attributes
 * @property {string | Function} default
 */

/**
 * @typedef {Object} Relationship
 * @property {string} type
 * @property {Entity} entity
 * @property {string | null} onDelete
 * @property {string | null} onUpdate
 */

/**
 * @typedef {Object} Schema
 * @property {string | string[]} primaryKey,
 * @property {Object.<string, Column>} columns,
 * @property {string[]} constraints,
 * @property {Entity | null} parent,
 * @property {Relationship[]} relationships
 */

export default class Entity {
  static Relationship = /** @type {const} */ ({
    ONE_TO_ONE: "ONE_TO_ONE",
    ONE_TO_MANY: "ONE_TO_MANY",
    MANY_TO_ONE: "MANY_TO_ONE",
    MANY_TO_MANY: "MANY_TO_MANY",
  });

  static ReferenceOption = /** @type {const} */ ({
    RESTRICT: "RESTRICT",
    CASCADE: "CASCADE",
    SET_NULL: "SET NULL",
    NO_ACTION: "NO ACTION",
    SET_DEFAULT: "SET DEFAULT",
  });

  static Column = /** @type {const} */ ({
    UUID: {
      type: "VarChar(36)",
      attributes: "NOT NULL",

      _type: "UUID",
      default: () => uuidv4(),
    },
  });

  /** @type {?NodeJS.Timer} */
  #executeQueueProcessor;

  /** @type {Function[]} */
  #executeQueue = [];

  #isTableCreated = false;

  #isConstraintsCreated = false;

  #isModifyCreated = false;

  #isIndexCreated = false;

  #closed = false;

  /** @type {Object.<string, Function | Promise<any>>} */
  functions = {};

  /** @type {string[]} */
  #primaryKey = [];

  /** @type {string} */
  #name;

  /** @type {string} */
  #singularName;

  /** @type {Object.<string, Column>} */
  #columns = {};

  /** @type {Object.<string, string>} */
  #constraints;

  /** @type {string[]} */
  #modify = [];

  /** @type {Entity | null} */
  #parent;

  /** @type {Set<Entity>} */
  #children = new Set();

  /** @type {Map<Entity, { type: string, }>} */
  #relationships = new Map();

  /**
   *
   * @param {string} name
   * @param {Schema} schema
   */
  constructor(name, schema) {
    const {
      primaryKey,
      columns = {},
      constraints = [],
      parent,
      relationships = [],
    } = schema;

    this.#name = pluralize.plural(name);
    this.#singularName = pluralize.singular(this.name.toLowerCase());

    this.#primaryKey =
      typeof primaryKey === "string" ? [primaryKey] : primaryKey;

    this.#constraints = constraints;

    for (const [key, column] of Object.entries(columns)) {
      this.addColumn(key, column.type, column);
    }

    if (parent) {
      this.inheritFrom(parent);
    }

    for (const relationship of relationships) {
      this.addRelationship(relationship);
    }
  }

  async init() {
    if (!this.name) {
      throw new Error("Table name can not be null");
    }

    if (!this.primaryKey) {
      throw new Error(`Primary Key not found in Table "${this.name}"`);
    }
    if (this.primaryKey.every((pk) => pk in this.columns)) {
      this.constraints[
        "primary_key_constraint"
      ] = `PRIMARY KEY (${this.primaryKey.join(", ")})`;
    } else {
      throw new Error(`Primary Key "${pk}" does not exist in columns`);
    }

    if (this.children.size > 0) {
      // this.#modify.push(
      //   `${this.entityType}_type ENUM(${Array.from(this.children)
      //     .map((child) => `'${child.entityType}'`)
      //     .join(", ")})`
      // );
    }

    this.addFunction("find", async (query = {}) => await this.find(query));
    this.addFunction(
      "findOne",
      async (query = {}) => await this.findOne(query)
    );

    this.addFunction("insert", async (entry = {}) => await this.insert(entry));
    this.addFunction("new", async (params = {}) => await this.new(params));

    this.addFunction("get", async (params = {}) => await this.get(params));

    this.addFunction(
      "addRelationshipValue",
      async (...params) => await this.addRelationshipValue(...params)
    );
  }

  /**
   * @param {Entity} entity
   */
  inheritFrom(entity) {
    if (this.parent) {
      throw new Error(`${this.name} already inherits from ${this.parent.name}`);
    }

    entity.children.add(this);
    this.#parent = entity;

    this.addRelationship({
      type: Entity.Relationship.ONE_TO_ONE,
      entity,
    });

    const subtypeDiscriminatorKey = `${entity.entityType}_type`;
    this.parent.addColumn(subtypeDiscriminatorKey, "VarChar(64)", {
      attributes: "NULL",
    });
  }

  /**
   * @param {string} name
   * @param {string} type
   * @param {?{ asForeignKey: string, attributes: string }} options
   */
  addColumn(name, type, options = {}) {
    this.#columns[name] = {
      type,
      asForeignKey: `${this.#singularName}_${name}`,
      attributes: "",
      ...options,
    };
  }

  getColumn(name) {
    return this.columns[name];
  }

  /**
   * @param {string} name
   * @param {string} constraint
   */
  addConstraint(name, constraint) {
    this.#constraints[name] = constraint;
  }

  /**
   * @param {Relationship} relationship
   */
  addRelationship(relationship) {
    const {
      type,
      entity,
      onDelete = Entity.ReferenceOption.CASCADE,
      onUpdate = Entity.ReferenceOption.CASCADE,
    } = relationship;
    const { primaryKey: keys } = entity;

    for (const foreignKey of keys) {
      const column = entity.getColumn(foreignKey);

      this.addColumn(column.asForeignKey, column.type);
    }

    const asPrimaryKeyJoined = keys.join(", ");
    const asForeignKeyJoined = keys
      .map((key) => entity.getColumn(key).asForeignKey)
      .join(", ");

    // if (
    //   [
    //     Entity.Relationship.ONE_TO_ONE,
    //     Entity.Relationship.ONE_TO_MANY,
    //   ].includes(type)
    // ) {
    //   this.addConstraint(
    //     `${entity.name}_relationship_uniqueness`,
    //     `UNIQUE (${asForeignKeyJoined})`
    //   );
    // }

    this.addConstraint(
      `${entity.name}_relationship_constraint`,
      `FOREIGN KEY (${asForeignKeyJoined}) REFERENCES ${entity.name}(${asPrimaryKeyJoined}) ON DELETE ${onDelete} ON UPDATE ${onUpdate}`
    );

    this.relationships.set(entity, relationship);
  }

  /**
   * @param {Entity} entity
   * @param {?Object.<string, any>} query
   */
  async queryRelationship(entity, query = {}) {
    const relationship = this.relationships.get(entity);

    if (!relationship) {
      return {
        status: STATUS.NOT_OK,
        message: `Entity "${entity.name}" has no relationship with Entity "${this.name}"`,
      };
    }

    return await entity.execute({
      query: `SELECT * FROM ${this.name} ${
        Object.keys(query).length > 0 ? "WHERE" : ""
      } ${Object.keys(query)
        .map((column) => `${column} = ?`)
        .join(" AND ")} 
        INNER JOIN ${entity.name} ON ${entity.primaryKey
        .map(
          (key) =>
            `${this.name}.${entity.getColumn(key).asForeignKey} = ${
              entity.name
            }.${key}`
        )
        .join(" AND ")};`,
      values: Object.values(query),
    });
  }

  async addRelationshipValue(entityType, match = {}, params = {}) {
    const entity = Array.from(this.relationships.keys()).find(
      (entity) => entity.entityType === entityType
    );

    if (entity) {
      const filteredPkParams = {};
      const filteredFkParams = {};

      for (const pk of this.primaryKey) {
        if (pk in match) {
          filteredPkParams[pk] = match[pk];
        } else {
          return {
            status: STATUS.NOT_OK,
            message: `Primary Key "${pk}" not found`,
          };
        }
      }

      for (const pk of entity.primaryKey) {
        const fk = entity.getColumn(pk).asForeignKey;

        if (fk in params) {
          filteredFkParams[fk] = params[fk];
        } else {
          return {
            status: STATUS.NOT_OK,
            message: `Foreign Key "${pk}"/"${fk}" not found`,
          };
        }
      }

      return await this.update(filteredPkParams, filteredFkParams);
    } else {
      return {
        status: STATUS.NOT_OK,
        message: `Unknown Entity Type "${entityType}"`,
      };
    }
  }

  /**
   * @param {?Object.<string, any>} params
   */
  async new(params = {}) {
    for (const [key, column] of Object.entries(this.columns)) {
      if (!(key in params) && column.default) {
        params[key] =
          typeof column.default === "function"
            ? column.default()
            : column.default;
      }
    }

    if (this.parent) {
      const parentPk = this.parent.primaryKey;

      if (!this.parent.checkForeignKeyInParams(params)) {
        return {
          status: STATUS.NOT_OK,
          message: `Foregin key ${parentPk
            .map((pk) => `"${pk}"`)
            .join(", ")} does not exist in params for creating new ${
            this.name
          }`,
        };
      }

      const parentParams = {};

      for (const pk of this.parent.primaryKey) {
        const fk = this.parent.getColumn(pk).asForeignKey;
        if (fk in params) {
          parentParams[pk] = params[fk];
        } else {
          throw new Error(
            `Foreign Key Reference "${key}" not found in parent "${this.parent.name}" keys`
          );
        }
      }

      if (await this.parent.has(parentParams)) {
        await this.parent.update(parentParams, {
          [`${this.parent.entityType}_type`]: this.entityType,
        });

        return await this.insert(params);
      } else {
        return {
          status: STATUS.NOT_OK,
          message: `${parentPk
            .map((pk) => `"${pk} = ${params[pk]}"`)
            .join(", ")} ${pluralize("does", parentPk.length)} not exist in ${
            this.parent.name
          }`,
        };
      }
    } else {
      return await this.insert(params);
    }
  }

  /**
   * @param {?Object.<string, any>} params
   */
  async get(params = {}) {
    if (!this.checkPrimaryKeyInParams(params)) {
      return {
        status: STATUS.NOT_OK,
        message: "Invalid Primary Key",
      };
    }

    const keysOnly = {};

    for (const pk of this.primaryKey) {
      keysOnly[pk] = params[pk];
    }

    return await this.findOne(keysOnly);
  }

  /**
   * @param {?Object.<string, any>} query
   */
  async find(query = {}) {
    return await this.execute({
      query: `SELECT * FROM ${this.name} ${
        Object.keys(query).length > 0 ? "WHERE" : ""
      } ${Object.keys(query)
        .map((column) => `${column} = ?`)
        .join(" AND ")};`,
      values: Object.values(query),
    });
  }

  /**
   * @param {?Object.<string, any>} query
   */
  async findOne(query = {}) {
    const response = await this.find(query);

    if (response.status === STATUS.OK) {
      return {
        status: response.status,
        data: response.data[0] ? [response.data[0]] : [],
      };
    } else {
      return response;
    }
  }

  /**
   * @param {?Object.<string, any>} query
   */
  async has(query = {}) {
    const response = await this.findOne(query);

    return response.status === STATUS.OK && response.data.length === 1;
  }

  /**
   * @param {?Object.<string, any>} entry
   */
  async insert(entry = {}) {
    if (!this.checkPrimaryKeyInParams(entry)) {
      throw new Error("Invalid Primary Key");
    }

    const _entry = Object.entries(entry).filter(([key]) => this.hasColumn(key));

    const keys = _entry.map(([key]) => key).filter((key) => entry[key]);
    const values = keys.map((key) => entry[key]);

    const queries = [
      `INSERT INTO ${this.name} (${keys.join(", ")}) VALUES (${values
        .map(() => "?")
        .join(", ")})`,
      `SELECT * FROM ${this.name} WHERE ${this.primaryKey
        .map((pk) => `${pk} = ?`)
        .join(" AND ")}`,
    ];

    const response = await this.execute({
      query: queries.join("; "),
      values: [...values, ...this.primaryKey.map((pk) => entry[pk])],
    });

    try {
      if (response.status === STATUS.OK) {
        const data = response.data[1][0];
        return {
          status: response.status,
          data: data ? [data] : [],
        };
      } else {
        return response;
      }
    } catch (e) {
      return {
        status: STATUS.NOT_OK,
        message: "error",
      };
    }
  }

  /**
   * @param {?Object.<string, any>} match
   * @param {?Object.<string, any>} entry
   */
  async update(match = {}, entry = {}) {
    const _entry = Object.entries(entry).filter(([key]) => this.hasColumn(key));

    const keys = _entry.map(([key]) => key);
    const values = _entry.map(([_, value]) => value);

    const queries = [
      `UPDATE ${this.name} SET ${keys.map((key) => `${key}=?`).join(", ")} ${
        Object.entries(match).length > 0 ? "WHERE" : ""
      } ${Object.keys(match)
        .map((column) => `${column}=?`)
        .join(" && ")}`,
      `SELECT * FROM ${this.name} WHERE ${this.primaryKey
        .map((pk) => `${pk} = ?`)
        .join(", ")}`,
    ];

    const response = await this.execute({
      query: queries.join("; "),
      values: [
        ...values,
        ...Object.values(match),
        ...this.primaryKey.map((pk) => match[pk]),
      ],
    });

    try {
      if (response.status === STATUS.OK) {
        const data = response.data[1][0];
        return {
          status: response.status,
          data: data ? [data] : [],
        };
      } else {
        return response;
      }
    } catch (e) {
      return {
        status: STATUS.NOT_OK,
        message: "error",
      };
    }
  }

  /**
   * @param {Object.<string, any>} match
   */
  async delete(match = {}) {
    return await this.execute({
      query: `DELETE FROM ${this.name} ${
        Object.entries(match).length > 0 ? "WHERE" : ""
      } ${Object.keys(match)
        .map((column) => `${column}=?`)
        .join(" && ")}`,
      values: Object.values(match),
    });
  }

  /**
   * @param {{ query: Object, values: Array }} sql
   */
  execute(sql) {
    const { query, values = [] } = sql;

    return new Promise(async (resolve) => {
      if (!this.#closed) {
        this.#executeQueue.push(async () =>
          resolve(await executeQuery({ query, values }))
        );
      } else {
        reject(new Error("Database is closed"));
      }
    });
  }

  async createTable() {
    if (!this.#isTableCreated) {
      await executeQuery({
        query: `CREATE TABLE IF NOT EXISTS ${this.name} (${Object.entries(
          this.columns
        )
          .map(
            ([name, { type, attributes }]) =>
              `${name} ${type} ${attributes ?? ""}`
          )
          .join(", ")})`,
      });

      this.#isTableCreated = true;

      this.#executeQueueProcessor = setInterval(() => {
        if (this.#isTableCreated && this.#executeQueue.length > 0) {
          const process = this.#executeQueue.shift();

          if (process && typeof process === "function") {
            process();
          }
        }
      }, 5);
    }
  }

  async createConstraints() {
    if (!this.#isConstraintsCreated) {
      for (const [key, constraint] of Object.entries(this.constraints)) {
        await executeQuery({
          query: `ALTER TABLE ${this.name} ADD CONSTRAINT ${key} ${constraint}`,
        });
      }
    }
  }

  async createModify() {
    if (!this.#isModifyCreated) {
      for (const modify of this.#modify) {
        await executeQuery({
          query: `ALTER TABLE ${this.name} MODIFY ${modify}`,
        });
      }
    }
  }

  async createIndex() {
    // if (!this.#isIndexCreated) {
    //   return await executeQuery({
    //     query: `ALTER TABLE ${this.name} ADD INDEX (${this.primaryKey.join(
    //       ", "
    //     )});`,
    //   });
    // }
  }

  /**
   * @param {Object.<string, any>} name
   */
  checkPrimaryKeyInParams(params) {
    return this.primaryKey.every((pk) => pk in params);
  }

  /**
   * @param {Object.<string, any>} name
   */
  checkForeignKeyInParams(params) {
    return this.primaryKey.every(
      (pk) => this.getColumn(pk).asForeignKey in params
    );
  }

  /**
   * @param {string} name
   * @param {Function | Promise<any>} func
   */
  addFunction(name, func) {
    this.functions[name] = func;
  }

  /**
   * @param {string} name
   */
  deleteFunction(name) {
    delete this.functions[name];
  }

  close() {
    clearInterval(this.#executeQueueProcessor);
    this.#executeQueue = [];
    this.#closed = true;
  }

  /**
   * @param {String} name
   */
  hasColumn(key) {
    return key in this.columns;
  }

  get name() {
    return this.#name;
  }

  get entityType() {
    return pluralize.singular(this.name).toLowerCase();
  }

  get primaryKey() {
    return this.#primaryKey;
  }

  get constraints() {
    return this.#constraints;
  }

  get columns() {
    return this.#columns;
  }

  get parent() {
    return this.#parent;
  }

  get children() {
    return this.#children;
  }

  get relationships() {
    return this.#relationships;
  }
}
