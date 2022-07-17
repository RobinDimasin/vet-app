import Entity from "./Entity";
import Account from "@entity/Account/AccountEntity";
import Token from "@entity/Account/Token/TokenEntity";
import Owner from "@db/entity/Account/Types/OwnerEntity";
import Admin from "@db/entity/Account/Types/AdminEntity";
import Veterinarian from "@db/entity/Account/Types/VeterinarianEntity";
import Pet from "@entity/Pet/PetEntity";
import Form from "@entity/Form/FormEntity";
import Reason from "@entity/Reason/ReasonEntity";
import Appointment from "@entity/Appointment/AppointmentEntity";
import Review from "./Review/ReviewEntity";

const EntityList = {
  account: Account,
  token: Token,

  owner: Owner,
  admin: Admin,
  veterinarian: Veterinarian,

  pet: Pet,

  form: Form,
  reason: Reason,
  appointment: Appointment,

  review: Review,
};

const initEntities = async () => {
  const dependencyList = generateDependencyList();

  for (const entity of dependencyList) {
    console.log(entity.name);
    await entity.init();
  }

  for (const entity of dependencyList) {
    await entity.createTable();
  }

  for (const entity of dependencyList) {
    await entity.createConstraints();
  }

  for (const entity of dependencyList) {
    await entity.createModify();
  }

  for (const entity of dependencyList) {
    await entity.createIndex();
  }
};

const generateDependencyList = () => {
  /** @type {Entity[]} */
  const dependencyList = [];
  const inheritanceGraph = new Map();

  for (const entity of Object.values(EntityList)) {
    if (!inheritanceGraph.has(entity)) {
      inheritanceGraph.set(entity, new Set());
    }

    entity.relationships.forEach((_, parent) => {
      if (!inheritanceGraph.has(parent)) {
        inheritanceGraph.set(parent, new Set());
      }

      inheritanceGraph.get(parent).add(entity);
    });
  }

  const visited = new Set();

  const toposort = (entity) => {
    if (!inheritanceGraph.has(entity)) {
      return;
    }

    visited.add(entity);

    for (const child of inheritanceGraph.get(entity)) {
      if (!visited.has(child)) {
        toposort(child);
      }
    }

    dependencyList.push(entity);
  };

  for (const entity of inheritanceGraph.keys()) {
    if (!visited.has(entity)) {
      toposort(entity);
    }
  }

  dependencyList.reverse();

  return dependencyList;
};

initEntities();

export default EntityList;
