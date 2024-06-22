import { validation_error } from "@/important_data/important_data";

const schemaValidator = async (schema, key = null, value) => {
  try {
    if (key === null) {
      await schema.validate(
        { ...value },
        {
          strict: true,
        }
      );
    } else {
      await schema.validate(
        { [key]: value },
        {
          strict: true,
        }
      );
    }
    return {
      success: true,
      message: null,
    };
  } catch (error) {
    return {
      success: false,
      message: validation_error(error.message),
    };
  }
};

export default schemaValidator;
