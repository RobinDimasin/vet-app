import Entity from "@entity/Entity";
import Owner from "@db/entity/Account/Types/OwnerEntity";
class ReviewEntity extends Entity {
  constructor() {
    super("Reviews", {
      primaryKey: "id",
      columns: {
        id: Entity.Column.UUID,
        rating: {
          type: "INT",
          attributes: "NOT NULL CHECK (rating BETWEEN 1 AND 5)",
        },
        comment: {
          type: "VarChar(512)",
          attributes: "NULL",
        },
      },
      relationships: [
        {
          type: Entity.Relationship.ONE_TO_MANY,
          entity: Owner,
        },
      ],
    });
  }

  async new({ owner_id, rating, comment }) {
    return await super.new({
      owner_id,
      rating,
      comment,
    });
  }
}

const Review = new ReviewEntity();

export default Review;
