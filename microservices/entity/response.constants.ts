export const BASE_CODE = 1000;
export const RESPONSE_CODES_MAPPER = {
  ENTITY_SUCCESSFULLY_STORED: {
    code: 0,
    message: "The entity was stored in '{collection}' collection",
  },
  ENTITY_SUCCESSFULLY_UPDATED: {
    code: 3,
    message: "The entity was updated in '{collection}' collection",
  },
  ENTITIES_BY_TYPE_FOUNDED_SUCCESSFULLY: {
    code: 5,
    message: "The entities for the '{collection}' type were founded.",
  },
  SCHEMAS_TYPE_ENTITY_SUCCESSFULLY_FOUNDED: {
    code: 10,
    message: "The schemas type entity was founded for the '{name}' enterprise.",
  },
  SCHEMA_TYPE_ENTITY_SUCCESSFULLY_FOUNDED: {
    code: 15,
    message: "The schema type entity with name {collection} was founded for the '{name}' enterprise.",
  },

  PRESENTATION_SUCCESSFULLY_FOUNDED: {
    code: 20,
    message: "The presentation for the schema {collection} was founded for the '{name}' enterprise.",
  },
};
