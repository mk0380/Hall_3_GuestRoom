import { validation_error } from "@/important_data/important_data";
import responseHandler from "./responseHandler";

const schemaValidator = async (schema, key, value, res) => {
  try {
    await schema.validate(
      { [key]: value },
      {
        strict: true,
      }
    );
  } catch (error) {
    return responseHandler(res, false, 400, validation_error(error.message));
  }
};

export default schemaValidator;
